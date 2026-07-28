#!/usr/bin/env node
// Prepara a CONTA VERCEL do ambiente ESTÁVEL: descobre o org id, cria (ou
// reaproveita) os 2 projetos e imprime exatamente os secrets a cadastrar no
// GitHub. Não imprime o token em nenhum momento.
//
// Uso (dry-run — só mostra o plano, não cria nada):
//   VERCEL_TOKEN_ESTAVEL=*** node tools/promote-prototype/setup-vercel-estavel.mjs
//
// Criar de verdade:
//   VERCEL_TOKEN_ESTAVEL=*** node tools/promote-prototype/setup-vercel-estavel.mjs --execute
//
// Se a conta tiver mais de um time, escolha com --team <slug|id>.
// Para conta pessoal (sem time), use --personal.

const TOKEN = process.env.VERCEL_TOKEN_ESTAVEL;
const EXECUTE = process.argv.includes("--execute");
const PERSONAL = process.argv.includes("--personal");
const teamArg = (() => {
  const i = process.argv.indexOf("--team");
  return i !== -1 ? process.argv[i + 1] : null;
})();

// Projeto -> pasta do protótipo neste repo.
const PROJECTS = [
  { name: "frontoffice-conecta-estavel", secret: "VERCEL_PROJECT_ID_FRONTOFFICE_ESTAVEL", dir: "prototype/frontOffice" },
  { name: "backoffice-conecta-estavel", secret: "VERCEL_PROJECT_ID_BACKOFFICE_ESTAVEL", dir: "prototype/backoffice" },
];

if (!TOKEN) {
  console.error("Faltou VERCEL_TOKEN_ESTAVEL no ambiente.");
  console.error("Crie em: Vercel > Account Settings > Tokens (escopo da conta/time do estável).");
  process.exit(1);
}

async function api(method, path, body) {
  const res = await fetch(`https://api.vercel.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const msg = json?.error?.message || json?.raw || res.statusText;
    const err = new Error(`${method} ${path} -> ${res.status}: ${msg}`);
    err.status = res.status;
    err.code = json?.error?.code;
    throw err;
  }
  return json;
}

// Descobre o escopo (time ou conta pessoal) e devolve { orgId, label, teamId }.
async function resolveScope() {
  const me = await api("GET", "/v2/user");
  const user = me.user || me;

  if (PERSONAL) {
    return { orgId: user.id, label: `conta pessoal (${user.username || user.email})`, teamId: null };
  }

  const { teams = [] } = await api("GET", "/v2/teams");

  if (teamArg) {
    const t = teams.find((t) => t.slug === teamArg || t.id === teamArg);
    if (!t) throw new Error(`Time "${teamArg}" não encontrado. Times: ${teams.map((t) => t.slug).join(", ") || "(nenhum)"}`);
    return { orgId: t.id, label: `time ${t.slug}`, teamId: t.id };
  }

  if (teams.length === 1) {
    const t = teams[0];
    return { orgId: t.id, label: `time ${t.slug}`, teamId: t.id };
  }

  if (teams.length === 0) {
    return { orgId: user.id, label: `conta pessoal (${user.username || user.email})`, teamId: null };
  }

  throw new Error(
    `A conta tem ${teams.length} times: ${teams.map((t) => t.slug).join(", ")}.\n` +
      `Escolha um com --team <slug>, ou use --personal para a conta pessoal.`,
  );
}

async function getProject(name, teamId) {
  const qs = teamId ? `?teamId=${teamId}` : "";
  try {
    return await api("GET", `/v9/projects/${name}${qs}`);
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

async function createProject(name, teamId) {
  const qs = teamId ? `?teamId=${teamId}` : "";
  // framework vite: o build real é feito pela CLI dentro da pasta do app,
  // mas deixar o preset correto evita surpresa no painel.
  return api("POST", `/v11/projects${qs}`, { name, framework: "vite" });
}

async function main() {
  const scope = await resolveScope();
  console.log(`Escopo: ${scope.label}`);
  console.log(`VERCEL_ORG_ID_ESTAVEL = ${scope.orgId}\n`);

  const results = [];
  for (const p of PROJECTS) {
    const existing = await getProject(p.name, scope.teamId);
    if (existing) {
      console.log(`[existe]  ${p.name} -> ${existing.id}`);
      results.push({ ...p, id: existing.id, created: false });
      continue;
    }
    if (!EXECUTE) {
      console.log(`[criaria] ${p.name}  (rode com --execute para criar)`);
      results.push({ ...p, id: null, created: false });
      continue;
    }
    const created = await createProject(p.name, scope.teamId);
    console.log(`[criado]  ${p.name} -> ${created.id}`);
    results.push({ ...p, id: created.id, created: true });
  }

  console.log("\n--- Secrets para cadastrar no GitHub (Settings > Secrets and variables > Actions) ---");
  console.log(`VERCEL_ORG_ID_ESTAVEL = ${scope.orgId}`);
  for (const r of results) {
    console.log(`${r.secret} = ${r.id ?? "(pendente — rode com --execute)"}`);
  }
  console.log("VERCEL_TOKEN_ESTAVEL  = (o token que você usou aqui)");

  if (!EXECUTE && results.some((r) => !r.id)) {
    console.log("\nDry-run: nada foi criado. Rode novamente com --execute quando quiser criar.");
  }

  console.log("\nObservação: a URL final de cada projeto é <nome>.vercel.app se o nome estiver livre;");
  console.log("confira no painel e ajuste os links em tools/promote-prototype/create-ready-for-dev.mjs se diferir.");
}

main().catch((err) => {
  console.error(`\nErro: ${err.message}`);
  process.exit(1);
});
