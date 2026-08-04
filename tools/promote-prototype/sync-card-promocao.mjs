#!/usr/bin/env node
// Mantém o card do Project 43 em sincronia com o Pull Request de promoção
// (prototipagem -> main), para que o CARD seja a peça central: é nele que a
// equipe vê a alteração proposta e de onde vai ao PR aprovar.
//
// Ciclo de vida:
//
//   PR aberto/reaberto  -> cria a issue, põe no Project 43 e deixa em
//                          "In Validation"; comenta no PR o link do card.
//   PR mergeado         -> move para "Done", registra o link do ambiente estável
//                          e fecha a issue.
//   PR fechado sem merge-> move para "Desaprovado".
//
// A ligação card <-> PR é guardada num comentário-marcador no próprio PR
// (`<!-- card-promocao: N -->`). Comentários de PR são consistentes na hora,
// diferente da API de busca, que tem atraso de indexação.
//
// Variáveis de ambiente:
//   GH_TOKEN     token com acesso ao Project 43 e permissão de issues (PROJECTS_PAT)
//   GH_REPO      owner/repo deste repositório
//   PR_NUMBER, PR_TITLE, PR_BODY, PR_URL
//   PR_ACTION    opened | reopened | closed
//   PR_MERGED    "true" quando o fechamento foi por merge
//   DRY_RUN      "true" = só descreve o que faria

const ORG = "leds-conectafapes";
const PROJECT_NUMBER = 43;

// Colunas usadas no ciclo de vida (resolvidas por nome em tempo de execução).
const COLUNA_EM_REVISAO = "In Validation";
// Promoção aprovada e mergeada = trabalho concluído: o card vai para Done e a issue é
// fechada. O card registra a PROMOÇÃO, não um pedido de implementação — quem for
// implementar no repositório de produto abre a própria demanda.
const COLUNA_APROVADO = "Done";
const COLUNA_REPROVADO = "Desaprovado";
const AREA = "Frontend";
const SQUAD = "Design";

// Pasta do protótipo -> repositório de produto alvo e URLs dos dois ambientes.
const APPS = {
  "prototype/frontOffice": {
    label: "front-office",
    repoKey: "frontoffice-frontend",
    prototipo: "https://frontoffice-conecta.vercel.app",
    estavel: "https://frontoffice-conecta-estavel.vercel.app",
  },
  "prototype/backoffice": {
    label: "backoffice",
    repoKey: "frontend-backoffice",
    prototipo: "https://backoffice-conecta.vercel.app",
    estavel: "https://backoffice-conecta-estavel.vercel.app",
  },
};

const MARCADOR = (n) => `<!-- card-promocao: ${n} -->`;
const REGEX_MARCADOR = /<!--\s*card-promocao:\s*(\d+)\s*-->/;

const DRY_RUN = String(process.env.DRY_RUN || "false") === "true";
const token = exigir("GH_TOKEN");
const repo = exigir("GH_REPO");
const prNumero = exigir("PR_NUMBER");
const prTitulo = process.env.PR_TITLE || `PR #${prNumero}`;
const prCorpo = process.env.PR_BODY || "";
const prUrl = process.env.PR_URL || "";
const acao = process.env.PR_ACTION || "opened";
const mergeado = String(process.env.PR_MERGED || "false") === "true";

function exigir(nome) {
  const v = process.env[nome];
  if (!v) {
    console.error(`Faltou a variável de ambiente ${nome}`);
    process.exit(1);
  }
  return v;
}

async function rest(metodo, caminho, corpo) {
  const res = await fetch(`https://api.github.com${caminho}`, {
    method: metodo,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  if (!res.ok) throw new Error(`REST ${metodo} ${caminho} -> ${res.status}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

async function gql(query, variables) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(`GraphQL: ${JSON.stringify(json.errors)}`);
  return json.data;
}

// Quais apps do protótipo o PR alterou.
async function appsAlterados() {
  const [owner, nome] = repo.split("/");
  const arquivos = await rest("GET", `/repos/${owner}/${nome}/pulls/${prNumero}/files?per_page=100`);
  const tocados = new Set();
  for (const f of arquivos) {
    for (const prefixo of Object.keys(APPS)) {
      if (f.filename.startsWith(prefixo)) tocados.add(prefixo);
    }
  }
  return [...tocados].map((p) => APPS[p]);
}

async function projeto() {
  const d = await gql(
    `query($org:String!,$n:Int!){
       organization(login:$org){ projectV2(number:$n){
         id
         fields(first:50){ nodes{
           ... on ProjectV2FieldCommon { id name }
           ... on ProjectV2SingleSelectField { id name options { id name } }
           ... on ProjectV2IterationField {
             id name
             configuration { iterations { id title startDate duration } }
           }
         }}
       }}
     }`,
    { org: ORG, n: PROJECT_NUMBER },
  );
  const p = d.organization?.projectV2;
  if (!p) throw new Error(`Project ${PROJECT_NUMBER} não encontrado em ${ORG}`);
  return p;
}

const campo = (p, nome) =>
  p.fields.nodes.find((f) => f?.name && f.name.toLowerCase() === nome.toLowerCase());
const opcao = (f, teste) => (f?.options || []).find(teste);

// Procura o marcador nos comentários do PR.
async function cardExistente() {
  const [owner, nome] = repo.split("/");
  const comentarios = await rest("GET", `/repos/${owner}/${nome}/issues/${prNumero}/comments?per_page=100`);
  for (const c of comentarios) {
    const m = (c.body || "").match(REGEX_MARCADOR);
    if (m) return Number(m[1]);
  }
  return null;
}

// Item do card dentro do Project 43 (necessário para escrever campos).
async function itemDoProjeto(numeroIssue, projetoId) {
  const [owner, nome] = repo.split("/");
  const d = await gql(
    `query($owner:String!,$repo:String!,$n:Int!){
       repository(owner:$owner,name:$repo){ issue(number:$n){
         id
         projectItems(first:20){ nodes{ id project{ id } } }
       }}
     }`,
    { owner, repo: nome, n: numeroIssue },
  );
  const issue = d.repository?.issue;
  if (!issue) return null;
  const item = issue.projectItems.nodes.find((i) => i.project.id === projetoId);
  return item ? item.id : null;
}

/**
 * Sprint em andamento hoje, calculada pelas datas — nada fixo no código, para
 * que os próximos cards caiam sempre na sprint corrente.
 * Se hoje estiver fora de todas (janela entre sprints), devolve a próxima.
 */
function iteracaoAtual(campoSprint) {
  const iteracoes = campoSprint?.configuration?.iterations || [];
  if (!iteracoes.length) return null;
  const hoje = new Date().toISOString().slice(0, 10);

  const emAndamento = iteracoes.find((it) => {
    const fim = new Date(it.startDate);
    fim.setDate(fim.getDate() + it.duration);
    return it.startDate <= hoje && hoje < fim.toISOString().slice(0, 10);
  });
  if (emAndamento) return emAndamento;

  const futuras = iteracoes.filter((it) => it.startDate > hoje);
  return futuras.length ? futuras[0] : null;
}

async function definirIteracao(projetoId, itemId, campoId, iteracaoId) {
  await gql(
    `mutation($p:ID!,$i:ID!,$f:ID!,$it:String!){
       updateProjectV2ItemFieldValue(input:{
         projectId:$p, itemId:$i, fieldId:$f, value:{ iterationId:$it }
       }){ projectV2Item { id } }
     }`,
    { p: projetoId, i: itemId, f: campoId, it: iteracaoId },
  );
}

async function definirSelecao(projetoId, itemId, campoId, opcaoId) {
  await gql(
    `mutation($p:ID!,$i:ID!,$f:ID!,$o:String!){
       updateProjectV2ItemFieldValue(input:{
         projectId:$p, itemId:$i, fieldId:$f, value:{ singleSelectOptionId:$o }
       }){ projectV2Item { id } }
     }`,
    { p: projetoId, i: itemId, f: campoId, o: opcaoId },
  );
}

async function moverColuna(nomeColuna, complemento, fechar = false) {
  const numeroIssue = await cardExistente();
  if (!numeroIssue) {
    console.log("Nenhum card vinculado a este PR (marcador ausente). Nada a mover.");
    return;
  }
  const p = await projeto();
  const campoStatus = campo(p, "Status");
  const alvo = opcao(campoStatus, (o) => o.name.toLowerCase() === nomeColuna.toLowerCase());
  if (!alvo) throw new Error(`Coluna "${nomeColuna}" não existe no Status do Project ${PROJECT_NUMBER}`);

  console.log(`Card #${numeroIssue} -> "${alvo.name}"`);
  if (DRY_RUN) {
    console.log("[DRY_RUN] nada foi alterado.");
    if (complemento) console.log(`[DRY_RUN] comentário no card:\n${complemento}`);
    return;
  }

  const itemId = await itemDoProjeto(numeroIssue, p.id);
  if (!itemId) throw new Error(`Card #${numeroIssue} não está no Project ${PROJECT_NUMBER}`);
  await definirSelecao(p.id, itemId, campoStatus.id, alvo.id);

  const [owner, nome] = repo.split("/");
  if (complemento) {
    await rest("POST", `/repos/${owner}/${nome}/issues/${numeroIssue}/comments`, { body: complemento });
  }

  // Promoção concluída: fecha a issue, para não ficar aberta indefinidamente. O card
  // segue no board como histórico — fechar a issue não o remove do Project.
  if (fechar) {
    await rest("PATCH", `/repos/${owner}/${nome}/issues/${numeroIssue}`, {
      state: "closed",
      state_reason: "completed",
    });
    console.log(`Issue #${numeroIssue} fechada.`);
  }

  console.log(`Card #${numeroIssue} atualizado.`);
}

async function criarCard() {
  const jaExiste = await cardExistente();
  if (jaExiste) {
    console.log(`Card #${jaExiste} já vinculado a este PR. Nada a criar.`);
    return;
  }

  const apps = await appsAlterados();
  if (apps.length === 0) {
    console.log("PR não altera prototype/frontOffice nem prototype/backoffice. Nada a fazer.");
    return;
  }

  const p = await projeto();
  const campoStatus = campo(p, "Status");
  const campoArea = campo(p, "Area") || campo(p, "Área");
  const campoRepo = campo(p, "Repositório") || campo(p, "Repositorio");
  const campoSquad = campo(p, "Squad");
  const campoSprint = campo(p, "Sprint");
  const sprint = iteracaoAtual(campoSprint);
  const colunaInicial = opcao(campoStatus, (o) => o.name.toLowerCase() === COLUNA_EM_REVISAO.toLowerCase());
  if (!colunaInicial) throw new Error(`Coluna "${COLUNA_EM_REVISAO}" não existe no Status`);

  const titulo = `[Promoção] ${prTitulo}`.slice(0, 256);
  const corpo = [
    `> Promoção de protótipo para o ambiente estável, proposta em ${prUrl || `PR #${prNumero}`}.`,
    "",
    "## Como avaliar",
    "",
    "1. Veja a alteração **no ambiente de protótipo**:",
    ...apps.map((a) => `   - ${a.label}: ${a.prototipo}`),
    `2. Confira a auditoria abaixo e o diff no ${prUrl || "Pull Request"}.`,
    "3. **A aprovação acontece no Pull Request** — são necessárias 2 aprovações.",
    "",
    "Ao ser aprovado e mergeado, este card é concluído (**Done**, issue fechada) e o",
    "ambiente estável é publicado. Se for recusado, o card vai para **Desaprovado**.",
    "",
    "## Auditoria das mudanças",
    "",
    prCorpo.trim() || "_(sem auditoria no corpo do PR)_",
  ].join("\n");

  console.log(`Apps: ${apps.map((a) => a.label).join(", ")}`);
  console.log(`Criaria a issue "${titulo}" em ${repo}, na coluna "${colunaInicial.name}"`);

  if (DRY_RUN) {
    console.log(`[DRY_RUN] Area   -> ${campoArea ? AREA : "campo ausente"}`);
    console.log(`[DRY_RUN] Squad  -> ${campoSquad ? SQUAD : "campo ausente"}`);
    console.log(`[DRY_RUN] Sprint -> ${sprint ? sprint.title : "nenhuma sprint corrente"}`);
    for (const a of apps) {
      const o = opcao(campoRepo, (x) => x.name.includes(a.repoKey));
      console.log(`[DRY_RUN] Repositório (${a.label}) -> ${o ? o.name : "OPÇÃO NÃO ENCONTRADA"}`);
    }
    console.log(`[DRY_RUN] corpo:\n${corpo}`);
    return;
  }

  const [owner, nome] = repo.split("/");
  const issue = await rest("POST", `/repos/${owner}/${nome}/issues`, { title: titulo, body: corpo });
  console.log(`Issue criada: ${issue.html_url}`);

  const add = await gql(
    `mutation($p:ID!,$c:ID!){ addProjectV2ItemById(input:{projectId:$p, contentId:$c}){ item { id } } }`,
    { p: p.id, c: issue.node_id },
  );
  const itemId = add.addProjectV2ItemById.item.id;

  await definirSelecao(p.id, itemId, campoStatus.id, colunaInicial.id);

  if (campoArea) {
    const o = opcao(campoArea, (x) => x.name.toLowerCase() === AREA.toLowerCase());
    if (o) await definirSelecao(p.id, itemId, campoArea.id, o.id);
  }
  if (campoSquad) {
    const o = opcao(campoSquad, (x) => x.name.toLowerCase() === SQUAD.toLowerCase());
    if (o) await definirSelecao(p.id, itemId, campoSquad.id, o.id);
    else console.log(`Atenção: squad "${SQUAD}" não existe no board.`);
  }
  if (campoSprint) {
    if (sprint) {
      await definirIteracao(p.id, itemId, campoSprint.id, sprint.id);
      console.log(`Sprint: ${sprint.title}`);
    } else {
      console.log("Atenção: nenhuma sprint corrente ou futura no board; card ficou sem sprint.");
    }
  }
  if (campoRepo) {
    const principal = apps[0];
    const o = opcao(campoRepo, (x) => x.name.includes(principal.repoKey));
    if (o) await definirSelecao(p.id, itemId, campoRepo.id, o.id);
    if (apps.length > 1) {
      console.log(`Atenção: PR toca ${apps.length} apps; Repositório ficou em "${principal.label}". Revise no board.`);
    }
  }

  // Marcador que liga PR -> card, lido nos eventos seguintes.
  await rest("POST", `/repos/${owner}/${nome}/issues/${prNumero}/comments`, {
    body: [
      MARCADOR(issue.number),
      `📋 Card de promoção criado: ${issue.html_url}`,
      "",
      `Ele está em **${colunaInicial.name}** no [Project 43](https://github.com/orgs/${ORG}/projects/${PROJECT_NUMBER})`,
      "e é a partir dele que a equipe avalia a alteração. **A aprovação é aqui no PR** (2 aprovações).",
    ].join("\n"),
  });
  console.log(`Card #${issue.number} em "${colunaInicial.name}".`);
}

async function main() {
  console.log(`Evento: ${acao}${acao === "closed" ? ` (mergeado=${mergeado})` : ""}`);

  if (acao === "opened" || acao === "reopened") {
    await criarCard();
    return;
  }

  if (acao === "closed" && mergeado) {
    const apps = await appsAlterados();
    const links = apps.map((a) => `- ${a.label}: ${a.estavel}`).join("\n");
    await moverColuna(
      COLUNA_APROVADO,
      ["✅ Promoção **aprovada e publicada**.", "", "## Ambiente estável (referência para implementar)", links].join("\n"),
      true, // fecha a issue: a promoção terminou
    );
    return;
  }

  if (acao === "closed") {
    await moverColuna(
      COLUNA_REPROVADO,
      `❌ Promoção **recusada**: o Pull Request foi fechado sem merge. O protótipo segue em prototipagem.`,
    );
    return;
  }

  console.log(`Ação "${acao}" não tratada. Nada a fazer.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
