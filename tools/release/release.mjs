#!/usr/bin/env node
/**
 * ConectaFapes Release Tool
 *
 * Fluxo:
 *   1. Detecta a maior tag semver entre todos os repos
 *   2. Analisa commits desde essa tag ate develop
 *   3. Classifica: feat→minor, fix→patch, BREAKING→major
 *   4. Gera changelog categorizado (Features, Bug Fixes, Chores, Breaking Changes)
 *   5. Em modo execucao: cria branches release/vX.Y.Z e abre PRs com changelog
 *
 * Uso:
 *   node release.mjs --dry-run                           # so mostra o plano
 *   node release.mjs --dry-run --repos backend-admin     # um repo
 *   node release.mjs --execute                           # executa de fato
 *   node release.mjs --diff                              # so changelog, sem criar nada
 *
 * Requer GH_TOKEN no ambiente.
 */

import { execSync } from "node:child_process";

// ─── Configuração ───────────────────────────────────────────────────────────

const ORG = "leds-conectafapes";

const REPO_DEFS = {
  "backend-admin":        { repo: `${ORG}-backend-admin`,        production: "main" },
  "frontend-backoffice":  { repo: `${ORG}-frontend-backoffice`,  production: "main" },
  "frontoffice-backend":  { repo: `${ORG}-frontoffice-backend`,  production: "main" },
  "frontoffice-frontend": { repo: `${ORG}-frontoffice-frontend`, production: "main" },
  "prestacao-de-contas":  { repo: `${ORG}-prestacao-de-contas`,  production: "master" },
};

const ALL_REPOS = Object.keys(REPO_DEFS);

// ─── Helpers ────────────────────────────────────────────────────────────────

function gh(...args) {
  const cmd = args.map(a => `'${a.replace(/'/g, "'\\''")}'`).join(" ");
  return execSync(`gh ${cmd}`, { encoding: "utf-8", stdio: ["pipe", "pipe", "ignore"] }).trim();
}

function ghJson(endpoint, ...flags) {
  const out = gh("api", endpoint, ...flags);
  return out ? JSON.parse(out) : null;
}

function fail(msg) { console.error(`✗ ${msg}`); process.exit(1); }
function info(msg) { console.log(`  ${msg}`); }
function step(title) { console.log(`\n${"═".repeat(56)}\n  ${title}\n${"═".repeat(56)}`); }

// ─── CLI ────────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { dryRun: false, diff: false, execute: false, repos: ALL_REPOS, version: "" };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--dry-run":       opts.dryRun = true; break;
      case "--diff":          opts.diff = true; break;
      case "--execute":       opts.execute = true; break;
      case "--repos":         opts.repos = args[++i]?.split(",").map(s => s.trim()) || ALL_REPOS; break;
      case "--version":       opts.version = args[++i] || ""; break;
      case "--help": case "-h":
        console.log(`
Release ConectaFapes — v1.0.0

  --dry-run        Mostra plano sem criar nada
  --diff           Apenas changelog, sem side-effects
  --execute        Cria branches e PRs
  --repos <lista>  Repos separados por virgula (default: todos)
  --version <v>    Forca versao (default: auto-detect)
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
    console.log("Use --dry-run, --diff ou --execute. --help para ajuda.");
    process.exit(1);
  }
  // Validar repos
  const valid = opts.repos.filter(r => ALL_REPOS.includes(r));
  if (valid.length === 0) fail(`Nenhum repositorio valido. Use: ${ALL_REPOS.join(", ")}`);
  opts.repos = valid;
  return opts;
}

// ─── Buscar tags ────────────────────────────────────────────────────────────

function getAllTags(repoFull) {
  try {
    const raw = gh("api", `repos/${ORG}/${repoFull}/git/refs/tags`, "--jq", '.[].ref | sub("refs/tags/"; "")');
    return raw.split("\n").filter(Boolean);
  } catch { return []; }
}

/** Extrai {major,minor,patch} de vX.Y, vX.Y.Z ou vX.Y.Z-... */
function parseSemver(tag) {
  const m = tag.match(/^v?(\d+)\.(\d+)(?:\.(\d+))?(?:-.*)?$/);
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +parseInt(m[3] || "0", 10), raw: tag };
}

function semverCmp(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

function getLatestVersion(repos) {
  let latest = { major: 0, minor: 0, patch: 0, raw: "" };
  for (const key of repos) {
    const name = REPO_DEFS[key]?.repo;
    if (!name) continue;
    const tags = getAllTags(name);
    for (const t of tags) {
      const sv = parseSemver(t);
      if (sv && semverCmp(sv, latest) > 0) latest = sv;
    }
  }
  return latest;
}

// ─── Analisar commits ───────────────────────────────────────────────────────

function commitsSince(repoFull, sinceTag) {
  try {
    if (sinceTag) {
      return ghJson(`repos/${ORG}/${repoFull}/compare/${sinceTag}...develop`)?.commits || [];
    }
    return ghJson(`repos/${ORG}/${repoFull}/commits?sha=develop&per_page=100`) || [];
  } catch { return []; }
}

/** Classifica um commit: feat, fix, chore, docs, refactor, breaking, ou other */
function classifyCommit(msg) {
  const first = msg.split("\n")[0].trim();
  if (/BREAKING\s+CHANGE|!:/.test(first)) return "breaking";
  if (/^(feat)[(:]/.test(first))               return "feat";
  if (/^(fix|bugfix|hotfix)[(:]/.test(first))  return "fix";
  if (/^(chore|ci|build)[(:]/.test(first))     return "chore";
  if (/^(docs)[(:]/.test(first))               return "docs";
  if (/^(refactor|perf|style)[(:]/.test(first)) return "refactor";
  return "other";
}

// ─── Bump ───────────────────────────────────────────────────────────────────

function determineBumpLevel(commitList) {
  let level = "patch";
  for (const c of commitList) {
    const type = classifyCommit(c.commit?.message || "");
    if (type === "breaking") { level = "major"; break; }
    if (type === "feat") level = "minor";
  }
  return level;
}

function bumpVersion(sv, level) {
  const { major, minor, patch } = sv;
  switch (level) {
    case "major": return `v${major + 1}.0.0`;
    case "minor": return `v${major}.${minor + 1}.0`;
    default:      return `v${major}.${minor}.${patch + 1}`;
  }
}

// ─── Changelog ──────────────────────────────────────────────────────────────

function formatCommitLine({ sha, commit }) {
  const short = sha.slice(0, 7);
  const msg = commit.message.split("\n")[0].trim();
  const issues = [...msg.matchAll(/#(\d+)/g)].map(m => `#${m[1]}`).join(", ");
  const cleaned = msg.replace(/\s*\(#\d+\)\s*$/, "").replace(/^(feat|fix|chore|docs|refactor|perf|style|test|ci|build)(\(.+?\))?:\s*/, "");
  return `- ${cleaned} (${short})${issues ? " (" + issues + ")" : ""}`;
}

function generateChangelog(reposConfig, version, sinceTag) {
  const sections = {
    breaking:  { title: "### ⚠️ Breaking Changes", items: [] },
    feat:     { title: "### ✨ Features",           items: [] },
    fix:      { title: "### 🐛 Bug Fixes",          items: [] },
    refactor: { title: "### ♻️ Refactoring",        items: [] },
    docs:     { title: "### 📚 Documentation",      items: [] },
    chore:    { title: "### 🔧 Chores",             items: [] },
    other:    { title: "### 📦 Outros",             items: [] },
  };

  let total = 0;
  let repoHeaders = [];

  for (const key of reposConfig) {
    const def = REPO_DEFS[key];
    if (!def) continue;
    const commits = commitsSince(def.repo, sinceTag);
    const repoItems = [];

    for (const c of commits) {
      if (!c.commit?.message) continue;
      const type = classifyCommit(c.commit.message);
      const line = formatCommitLine(c);
      if (type === "other") continue; // pular commits sem prefixo
      sections[type]?.items.push(`  ${line} (_${key}_)`);
      total++;
    }
  }

  let out = `## Release ${version}\n\n`;
  for (const sec of Object.values(sections)) {
    if (sec.items.length > 0) {
      out += `${sec.title}\n${sec.items.join("\n")}\n\n`;
    }
  }
  if (total === 0) out += "_Nenhuma mudanca significativa detectada_\n";
  return out;
}

// ─── Execução ───────────────────────────────────────────────────────────────

function createBranch(repoFull, version) {
  const branch = `release/${version}`;
  const url = `https://x-access-token:${process.env.GH_TOKEN}@github.com/${ORG}/${repoFull}.git`;
  const tmp = execSync("mktemp -d", { encoding: "utf-8" }).trim();

  try {
    execSync(`git -C "${tmp}" init -q`, { stdio: "ignore" });
    execSync(`git -C "${tmp}" fetch -q --depth=1 --no-tags "${url}" develop`, { stdio: "ignore" });
    const push = execSync(`git -C "${tmp}" push "${url}" FETCH_HEAD:refs/heads/${branch} 2>&1`, { encoding: "utf-8" });
    if (push.includes("new branch")) return "created";
    if (push.includes("up to date") || push.includes("up-to-date")) return "exists";
    return push.trim();
  } catch (e) {
    return e.stderr || e.message;
  } finally {
    execSync(`rm -rf "${tmp}"`, { stdio: "ignore" });
  }
}

function createPullRequest(repoFull, version, changelog) {
  const prod = REPO_DEFS[Object.entries(REPO_DEFS).find(([,v]) => v.repo === repoFull)?.[0]]?.production || "main";
  const body = JSON.stringify({ title: `Release ${version}`, head: `release/${version}`, base: prod, body: changelog });
  try {
    const out = execSync(`gh api repos/${ORG}/${repoFull}/pulls --input -`, { input: body, encoding: "utf-8" });
    const match = out.match(/"html_url"\s*:\s*"(https:\/\/[^"]+)"/);
    return match ? match[1] : out.slice(0, 200);
  } catch (e) {
    return String(e.stderr || e.message).slice(0, 200);
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

const opts = parseArgs();

let lastTag = "";

if (opts.version) {
  info(`Versao manual: ${opts.version}`);
} else {
  step("Detectando versao");
  const latest = getLatestVersion(opts.repos);
  console.log(`  Maior tag: ${latest.raw || "(nenhuma)"}`);
  lastTag = latest.raw;

  const allCommits = [];
  for (const key of opts.repos) {
    const def = REPO_DEFS[key];
    if (!def) continue;
    allCommits.push(...commitsSince(def.repo, latest.raw));
  }

  const level = determineBumpLevel(allCommits);
  const next = bumpVersion(latest, level);
  console.log(`  Bump: ${level} → ${next} (${allCommits.length} commits analisados)`);
  opts.version = next;
}

// Changelog
step("Changelog");
const changelog = generateChangelog(opts.repos, opts.version, lastTag);
console.log(changelog);

if (opts.diff) process.exit(0);

// Plano
step(`PLANO — Release ${opts.version} (${opts.execute ? "EXECUTAR" : "DRY-RUN"})`);
for (const key of opts.repos) {
  const def = REPO_DEFS[key];
  console.log(`  [${key}] release/${opts.version} → ${def.production}`);
}

if (!opts.execute) process.exit(0);

// Executar
step("Executando");
for (const key of opts.repos) {
  const def = REPO_DEFS[key];
  console.log(`\n>>> ${key}`);

  const branchResult = createBranch(def.repo, opts.version);
  if (branchResult === "created") info(`✓ Branch release/${opts.version}`);
  else if (branchResult === "exists") info(`= Branch release/${opts.version} (existe)`);
  else { console.log(`  ✗ ${branchResult}`); continue; }

  const pr = createPullRequest(def.repo, opts.version, changelog);
  console.log(`  ${pr.startsWith("https://") ? "✓" : "✗"} PR: ${pr}`);
}

console.log("\nOK.");
