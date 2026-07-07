#!/usr/bin/env node
/**
 * ConectaFapes Release Tool
 *
 * Fluxo:
 *   1. Detecta a maior tag semver do repositorio sendo liberado
 *   2. Analisa commits dessa tag ate develop
 *   3. Classifica: feat->minor, fix->patch, BREAKING->major
 *   4. Gera changelog categorizado (Features, Bug Fixes, Chores, Breaking Changes)
 *   5. Em modo execucao: cria branch release/vX.Y.Z, tag, e PR com changelog
 *
 * Uso:
 *   node release.mjs --dry-run                           # so mostra o plano
 *   node release.mjs --dry-run --repos backend-admin     # um repo
 *   node release.mjs --execute                           # executa de fato
 *   node release.mjs --diff                              # so changelog, sem criar nada
 *
 * Requer GH_TOKEN no ambiente (usado via gh CLI, nao como senha git).
 */

import { execSync } from 'node:child_process';

// --- Configuracao -----------------------------------------------------------

const ORG = 'leds-conectafapes';

const REPO_DEFS = {
  'backend-admin':        { repo: `${ORG}-backend-admin`,        production: 'main' },
  'frontend-backoffice':  { repo: `${ORG}-frontend-backoffice`,  production: 'main' },
  'frontoffice-backend':  { repo: `${ORG}-frontoffice-backend`,  production: 'main' },
  'frontoffice-frontend': { repo: `${ORG}-frontoffice-frontend`, production: 'main' },
  'prestacao-de-contas':  { repo: `${ORG}-prestacao-de-contas`,  production: 'master' },
};

const ALL_REPOS = Object.keys(REPO_DEFS);

// --- Helpers -----------------------------------------------------------------

function gh(...args) {
  const cmd = args.map(a => `'${a.replace(/'/g, "'\\''")}'`).join(' ');
  try {
    return execSync(`gh ${cmd}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (e) {
    const stderr = e.stderr?.toString().trim() || '';
    const stdout = e.stdout?.toString().trim() || '';
    const msg = [stderr, stdout].filter(Boolean).join('\n') || e.message;
    throw new Error(`gh ${cmd.split(' ')[0]} failed: ${msg}`);
  }
}

function ghJson(endpoint, ...flags) {
  const out = gh('api', endpoint, ...flags);
  return out ? JSON.parse(out) : null;
}

function fail(msg) { console.error(`\u2717 ${msg}`); process.exit(1); }
function info(msg) { console.log(`  ${msg}`); }
function step(title) { console.log(`\n${'='.repeat(56)}\n  ${title}\n${'='.repeat(56)}`); }

// --- CLI ---------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { dryRun: false, diff: false, execute: false, repos: ALL_REPOS, version: '' };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--dry-run':       opts.dryRun = true; break;
      case '--diff':          opts.diff = true; break;
      case '--execute':       opts.execute = true; break;
      case '--repos':         opts.repos = args[++i]?.split(',').map(s => s.trim()) || ALL_REPOS; break;
      case '--version':       opts.version = args[++i] || ''; break;
      case '--help': case '-h':
        console.log(`
Release ConectaFapes — v2.0.0

  --dry-run        Mostra plano sem criar nada
  --diff           Apenas changelog, sem side-effects
  --execute        Cria branches e PRs
  --repos <lista>  Repos separados por virgula (default: todos)
  --version <v>    Forca versao (default: auto-detect por repo)
  --help           Esta mensagem

Exemplos:
  node release.mjs --dry-run
  node release.mjs --dry-run --repos backend-admin,frontoffice-frontend
  node release.mjs --execute
`);
        process.exit(0);
    }
  }
  if (!opts.dryRun && !opts.diff && !opts.execute) {
    console.log('Use --dry-run, --diff ou --execute. --help para ajuda.');
    process.exit(1);
  }
  const valid = opts.repos.filter(r => ALL_REPOS.includes(r));
  if (valid.length === 0) fail(`Nenhum repositorio valido. Use: ${ALL_REPOS.join(', ')}`);
  opts.repos = valid;
  return opts;
}

// --- Tags --------------------------------------------------------------------

function getAllTags(repoFull) {
  try {
    const raw = gh('api', `repos/${ORG}/${repoFull}/git/refs/tags`, '--jq', '.[].ref | sub("refs/tags/"; "")');
    return raw.split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

/** Extrai {major,minor,patch} de vX.Y, vX.Y.Z ou vX.Y.Z-... */
function parseSemver(tag) {
  const m = tag.match(/^v?(\d+)\.(\d+)(?:\.(\d+))?(?:-.*)?$/);
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +(m[3] || '0'), raw: tag };
}

function semverCmp(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

function getLatestTag(repoFull) {
  let latest = null;
  for (const t of getAllTags(repoFull)) {
    const sv = parseSemver(t);
    if (sv && (!latest || semverCmp(sv, latest) > 0)) latest = sv;
  }
  return latest;
}

// --- Commits -----------------------------------------------------------------

function commitsSince(repoFull, sinceTag) {
  try {
    if (sinceTag) {
      const result = ghJson(`repos/${ORG}/${repoFull}/compare/${sinceTag}...develop`);
      if (!result) return [];
      // Se o status for "diverged" ou "ahead", tem commits
      if (result.status === 'identical') return [];
      return result.commits || [];
    }
    // Sem tag anterior: pega os ultimos 100 commits do develop
    const result = ghJson(`repos/${ORG}/${repoFull}/commits?sha=develop&per_page=100`);
    return result || [];
  } catch {
    return [];
  }
}

function classifyCommit(msg) {
  const first = msg.split('\n')[0].trim();
  if (/BREAKING\s+CHANGE|!:/.test(first)) return 'breaking';
  if (/^(feat)[(:]/.test(first))           return 'feat';
  if (/^(fix|bugfix|hotfix)[(:]/.test(first)) return 'fix';
  if (/^(chore|ci|build)[(:]/.test(first)) return 'chore';
  if (/^(docs)[(:]/.test(first))           return 'docs';
  if (/^(refactor|perf|style)[(:]/.test(first)) return 'refactor';
  return 'other';
}

// --- Bump --------------------------------------------------------------------

function determineBumpLevel(commitList) {
  let level = 'patch';
  for (const c of commitList) {
    const type = classifyCommit(c.commit?.message || '');
    if (type === 'breaking') { level = 'major'; break; }
    if (type === 'feat') level = 'minor';
  }
  return level;
}

function bumpVersion(sv, level) {
  const { major, minor, patch } = sv;
  switch (level) {
    case 'major': return `v${major + 1}.0.0`;
    case 'minor': return `v${major}.${minor + 1}.0`;
    default:      return `v${major}.${minor}.${patch + 1}`;
  }
}

// --- Changelog ---------------------------------------------------------------

function formatCommitLine({ sha, commit }) {
  const short = sha.slice(0, 7);
  const msg = commit.message.split('\n')[0].trim();
  const issues = [...msg.matchAll(/#(\d+)/g)].map(m => `#${m[1]}`).join(', ');
  const cleaned = msg
    .replace(/\s*\(#\d+\)\s*$/, '')
    .replace(/^(feat|fix|chore|docs|refactor|perf|style|test|ci|build)(\(.+?\))?:\s*/, '');
  return `- ${cleaned} (${short})${issues ? ` (${issues})` : ''}`;
}

function generateChangelog(repoFull, version, sinceTag) {
  const sections = {
    breaking:  { title: '### \u26a0\ufe0f Breaking Changes', items: [] },
    feat:     { title: '### \u2728 Features',           items: [] },
    fix:      { title: '### \ud83d\udc1b Bug Fixes',          items: [] },
    refactor: { title: '### \u267b\ufe0f Refactoring',        items: [] },
    docs:     { title: '### \ud83d\udcda Documentation',      items: [] },
    chore:    { title: '### \ud83d\udd27 Chores',             items: [] },
    other:    { title: '### \ud83d\udce6 Outros',             items: [] },
  };

  let total = 0;
  const commits = commitsSince(repoFull, sinceTag);

  for (const c of commits) {
    if (!c.commit?.message) continue;
    const type = classifyCommit(c.commit.message);
    const line = formatCommitLine(c);
    if (type === 'other') continue;
    sections[type]?.items.push(`  ${line}`);
    total++;
  }

  let out = `## Release ${version}\n\n`;
  for (const sec of Object.values(sections)) {
    if (sec.items.length > 0) {
      out += `${sec.title}\n${sec.items.join('\n')}\n\n`;
    }
  }
  if (total === 0) out += '_Nenhuma mudanca significativa detectada_\n';
  return out;
}

// --- Execucao (via gh API, sem git fetch com token na URL) ------------------

/**
 * Cria branch release/vX.Y.Z a partir do develop usando gh api.
 * Nao usa git fetch com token embutido na URL (incompativel com gho_ tokens).
 */
function createBranchViaApi(repoFull, version) {
  const branch = `release/${version}`;
  try {
    // Pega o SHA do develop
    const sha = gh('api', `repos/${ORG}/${repoFull}/git/refs/heads/develop`, '--jq', '.object.sha');
    if (!sha) return 'Falha ao obter SHA do develop';

    // Tenta criar a ref. Se ja existir, o push recusaria — tratamos como "exists"
    try {
      const result = gh('api', `repos/${ORG}/${repoFull}/git/refs`, '-f', `ref=refs/heads/${branch}`, '-f', `sha=${sha}`);
      return result ? 'created' : 'Falha ao criar ref';
    } catch (e) {
      const msg = String(e.stderr || e.message);
      // GitHub retorna 422 quando a ref ja existe
      if (msg.includes('Reference already exists') || msg.includes('422')) {
        return 'exists';
      }
      return msg.slice(0, 300);
    }
  } catch (e) {
    return String(e.stderr || e.message).slice(0, 300);
  }
}

/**
 * Cria uma tag anotada vX.Y.Z apontando para o mesmo SHA do develop.
 */
function createTagViaApi(repoFull, version, changelog) {
  try {
    const sha = gh('api', `repos/${ORG}/${repoFull}/git/refs/heads/develop`, '--jq', '.object.sha');
    if (!sha) return 'Falha ao obter SHA do develop';

    // Cria tag anotada via git/tags + refs/tags
    const tagObj = gh('api', `repos/${ORG}/${repoFull}/git/tags`,
      '-f', `tag=${version}`,
      '-f', `message=Release ${version}`,
      '-f', `object=${sha}`,
      '-f', 'type=commit');
    const tagSha = JSON.parse(tagObj).sha;

    gh('api', `repos/${ORG}/${repoFull}/git/refs`,
      '-f', `ref=refs/tags/${version}`,
      '-f', `sha=${tagSha}`);
    return 'created';
  } catch (e) {
    const msg = String(e.stderr || e.message);
    if (msg.includes('Reference already exists') || msg.includes('422')) {
      return 'exists';
    }
    return msg.slice(0, 300);
  }
}

function createPullRequest(repoFull, version, changelog) {
  const entry = Object.entries(REPO_DEFS).find(([, v]) => v.repo === repoFull);
  const prod = entry ? entry[1].production : 'main';
  const body = JSON.stringify({
    title: `Release ${version}`,
    head: `release/${version}`,
    base: prod,
    body: changelog,
  });
  try {
    const out = execSync(`gh api repos/${ORG}/${repoFull}/pulls --input -`, {
      input: body,
      encoding: 'utf-8',
    });
    const match = out.match(/"html_url"\s*:\s*"(https:\/\/[^"]+)"/);
    return match ? match[1] : out.slice(0, 200);
  } catch (e) {
    return String(e.stderr || e.message).slice(0, 200);
  }
}

// --- Main --------------------------------------------------------------------

const opts = parseArgs();

// Mapa: chave do repo -> { version, changelog, lastTag }
const plan = {};

step('Detectando versao por repositorio');
for (const key of opts.repos) {
  const def = REPO_DEFS[key];
  if (!def) continue;

  const latest = getLatestTag(def.repo);
  const lastTag = latest?.raw || '';
  console.log(`  [${key}] Ultima tag: ${lastTag || '(nenhuma)'}`);

  if (opts.version) {
    plan[key] = { version: opts.version, lastTag, changelog: '' };
  } else {
    const commits = commitsSince(def.repo, lastTag);
    const level = determineBumpLevel(commits);
    const next = latest
      ? bumpVersion(latest, level)
      : bumpVersion({ major: 0, minor: 0, patch: 0 }, level);
    console.log(`         Bump: ${level} -> ${next} (${commits.length} commits)`);
    plan[key] = { version: next, lastTag, changelog: '' };
  }
}

// Changelog (por repo, usando a tag especifica de cada um)
step('Changelog');
for (const key of opts.repos) {
  const def = REPO_DEFS[key];
  if (!def) continue;
  const p = plan[key];
  if (!p) continue;
  p.changelog = generateChangelog(def.repo, p.version, p.lastTag);
  console.log(`\n>>> ${key} ${p.version}`);
  console.log(p.changelog);
}

if (opts.diff) process.exit(0);

// Plano
step(`PLANO — ${opts.execute ? 'EXECUTAR' : 'DRY-RUN'}`);
for (const key of opts.repos) {
  const def = REPO_DEFS[key];
  if (!def) continue;
  const p = plan[key];
  if (!p) continue;
  console.log(`  [${key}] release/${p.version} -> ${def.production} + tag ${p.version}`);
}

if (!opts.execute) process.exit(0);

// Executar
step('Executando');
for (const key of opts.repos) {
  const def = REPO_DEFS[key];
  if (!def) continue;
  const p = plan[key];
  if (!p) continue;

  console.log(`\n>>> ${key}`);

  // 1. Branch release
  const branchResult = createBranchViaApi(def.repo, p.version);
  if (branchResult === 'created') info(`Branch release/${p.version} criada`);
  else if (branchResult === 'exists') info(`= Branch release/${p.version} ja existe`);
  else { console.log(`  \u2717 Branch: ${branchResult}`); continue; }

  // 2. Tag
  const tagResult = createTagViaApi(def.repo, p.version, p.changelog);
  if (tagResult === 'created') info(`Tag ${p.version} criada`);
  else if (tagResult === 'exists') info(`= Tag ${p.version} ja existe`);
  else { console.log(`  \u2717 Tag: ${tagResult}`); }

  // 3. PR
  const pr = createPullRequest(def.repo, p.version, p.changelog);
  console.log(`  ${pr.startsWith('https://') ? '\u2713' : '\u2717'} PR: ${pr}`);
}

console.log('\nOK.');