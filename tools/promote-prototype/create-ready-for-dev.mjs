#!/usr/bin/env node
// Cria uma issue "Pronto para Desenvolvimento" no Project 43 quando uma tela do
// protótipo é promovida (PR prototipagem -> main mergeado).
//
// - Detecta quais apps mudaram no PR (frontOffice / backoffice) e mapeia para o
//   repositório de produto alvo.
// - Cria a issue no repositório de planejamento, adiciona ao Project 43 e
//   preenche os campos `Repositório` e `Area` (resolvidos por nome em tempo de
//   execução, para não depender de IDs fixos).
// - A auditoria (corpo do PR, gerada localmente com o Claude) vira o corpo da issue.
//
// Variáveis de ambiente:
//   GH_TOKEN           token com acesso ao Project 43 e ao repo de issues (PROJECTS_PAT)
//   GH_REPO            owner/repo deste repositório (ex.: leds-conectafapes/conectafapes-project)
//   PR_NUMBER, PR_TITLE, PR_BODY, PR_URL
//   READY_ISSUE_REPO   (opcional) onde criar a issue. Default: leds-conectafapes/conectafapes-project
//   DRY_RUN            "true" = só imprime o plano, sem criar nada
//
// Uso local (dry-run):
//   GH_TOKEN=*** GH_REPO=leds-conectafapes/conectafapes-project PR_NUMBER=123 \
//   PR_TITLE="[FEAT] Tela X" PR_BODY="..." PR_URL="..." DRY_RUN=true \
//   node tools/promote-prototype/create-ready-for-dev.mjs

// ----------------------------- Config (revise) -----------------------------
const ORG = "leds-conectafapes";
const PROJECT_NUMBER = 43;

// Repositório onde as issues de handoff são abertas: hub de issues do ConectaFapes
// e backing repo do Project 43 (override via READY_ISSUE_REPO).
const ISSUE_REPO = process.env.READY_ISSUE_REPO || `${ORG}/conectafapes-project`;

// Mapeia a pasta do protótipo -> { repo de produto alvo, URL estável }.
// O `repoKey` é casado por substring contra as opções do campo `Repositório`.
const APP_MAP = {
  "prototype/frontOffice": {
    label: "front-office",
    repoKey: "frontoffice-frontend",
    stableUrl: "https://frontoffice-conecta-estavel.vercel.app",
  },
  "prototype/backoffice": {
    label: "backoffice",
    repoKey: "frontend-backoffice",
    stableUrl: "https://backoffice-conecta-estavel.vercel.app",
  },
};

const AREA_VALUE = "Frontend"; // opção do campo `Area`
// ---------------------------------------------------------------------------

const DRY_RUN = String(process.env.DRY_RUN || "false") === "true";
const token = requireEnv("GH_TOKEN");
const thisRepo = requireEnv("GH_REPO"); // owner/repo deste projeto
const prNumber = requireEnv("PR_NUMBER");
const prTitle = process.env.PR_TITLE || `PR #${prNumber}`;
const prBody = process.env.PR_BODY || "";
const prUrl = process.env.PR_URL || "";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Faltou a variável de ambiente ${name}`);
    process.exit(1);
  }
  return v;
}

async function rest(method, path, body) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`REST ${method} ${path} -> ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function gql(query, variables) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(`GraphQL: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

async function detectApps() {
  const [owner, repo] = thisRepo.split("/");
  const files = await rest("GET", `/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=100`);
  const touched = new Set();
  for (const f of files) {
    for (const prefix of Object.keys(APP_MAP)) {
      if (f.filename.startsWith(prefix)) touched.add(prefix);
    }
  }
  return [...touched].map((p) => APP_MAP[p]);
}

async function getProject() {
  const data = await gql(
    `query($org:String!,$number:Int!){
       organization(login:$org){
         projectV2(number:$number){
           id
           fields(first:50){
             nodes{
               ... on ProjectV2FieldCommon { id name }
               ... on ProjectV2SingleSelectField { id name options { id name } }
             }
           }
         }
       }
     }`,
    { org: ORG, number: PROJECT_NUMBER },
  );
  const project = data.organization?.projectV2;
  if (!project) throw new Error(`Project ${PROJECT_NUMBER} não encontrado em ${ORG}`);
  return project;
}

function findField(project, name) {
  return project.fields.nodes.find(
    (f) => f.name && f.name.toLowerCase() === name.toLowerCase(),
  );
}

function findOption(field, predicate) {
  return (field?.options || []).find(predicate);
}

async function main() {
  const apps = await detectApps();
  if (apps.length === 0) {
    console.log("Nenhuma mudança em prototype/frontOffice ou prototype/backoffice. Nada a fazer.");
    return;
  }

  const project = await getProject();
  const repoField = findField(project, "Repositório") || findField(project, "Repositorio");
  const areaField = findField(project, "Area") || findField(project, "Área");

  const stableLinks = apps.map((a) => `- ${a.label}: ${a.stableUrl}`).join("\n");
  const issueTitle = `[Pronto para Dev] ${prTitle}`.slice(0, 256);
  const issueBody = [
    `> Promovido do protótipo para o ambiente **estável** via ${prUrl || `PR #${prNumber}`}.`,
    "",
    "## Ambiente estável (referência para implementar)",
    stableLinks,
    "",
    "## Auditoria das mudanças",
    prBody.trim() || "_(sem auditoria no corpo do PR)_",
  ].join("\n");

  console.log(`Apps detectados: ${apps.map((a) => a.label).join(", ")}`);
  console.log(`Issue: "${issueTitle}" em ${ISSUE_REPO}`);

  if (DRY_RUN) {
    console.log("\n[DRY_RUN] Campos resolvidos:");
    console.log(`  Repositório field: ${repoField ? repoField.id : "NÃO ENCONTRADO"}`);
    for (const a of apps) {
      const opt = findOption(repoField, (o) => o.name.includes(a.repoKey));
      console.log(`    ${a.label} -> opção "${opt ? opt.name : "NÃO ENCONTRADA"}"`);
    }
    const areaOpt = findOption(areaField, (o) => o.name.toLowerCase().includes(AREA_VALUE.toLowerCase()));
    console.log(`  Area field: ${areaField ? areaField.id : "NÃO ENCONTRADO"} -> "${areaOpt ? areaOpt.name : "NÃO ENCONTRADA"}"`);
    console.log("\n[DRY_RUN] Corpo da issue:\n" + issueBody);
    return;
  }

  // 1) Cria a issue no repo de planejamento
  const [io, ir] = ISSUE_REPO.split("/");
  const issue = await rest("POST", `/repos/${io}/${ir}/issues`, {
    title: issueTitle,
    body: issueBody,
  });
  console.log(`Issue criada: ${issue.html_url}`);

  // 2) Adiciona ao Project 43
  const added = await gql(
    `mutation($projectId:ID!,$contentId:ID!){
       addProjectV2ItemById(input:{projectId:$projectId, contentId:$contentId}){ item { id } }
     }`,
    { projectId: project.id, contentId: issue.node_id },
  );
  const itemId = added.addProjectV2ItemById.item.id;
  console.log(`Adicionada ao Project ${PROJECT_NUMBER} (item ${itemId})`);

  // 3) Preenche Area (uma vez)
  if (areaField) {
    const areaOpt = findOption(areaField, (o) => o.name.toLowerCase().includes(AREA_VALUE.toLowerCase()));
    if (areaOpt) await setSingleSelect(project.id, itemId, areaField.id, areaOpt.id);
  }

  // 4) Preenche Repositório (usa o 1º app; se houver mais de um, registra no log)
  if (repoField) {
    const primary = apps[0];
    const repoOpt = findOption(repoField, (o) => o.name.includes(primary.repoKey));
    if (repoOpt) await setSingleSelect(project.id, itemId, repoField.id, repoOpt.id);
    if (apps.length > 1) {
      console.log(`Atenção: PR tocou ${apps.length} apps; Repositório setado para "${primary.label}". Revise manualmente se necessário.`);
    }
  }

  console.log("Concluído.");
}

async function setSingleSelect(projectId, itemId, fieldId, optionId) {
  await gql(
    `mutation($projectId:ID!,$itemId:ID!,$fieldId:ID!,$optionId:String!){
       updateProjectV2ItemFieldValue(input:{
         projectId:$projectId, itemId:$itemId, fieldId:$fieldId,
         value:{ singleSelectOptionId:$optionId }
       }){ projectV2Item { id } }
     }`,
    { projectId, itemId, fieldId, optionId },
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
