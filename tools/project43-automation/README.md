# Project 43 automation

Cloudflare Worker em TypeScript que reage ao webhook `projects_v2_item`
do GitHub App e atualiza as datas do Project 43 da organizacao
`leds-conectafapes`.

## O que ele faz

- cria os campos ausentes do projeto via script
- preenche `Iniciado em` ao entrar em `In Progress`
- preenche `Data de Conclusao` ao entrar em `Done`
- limpa `Data de Conclusao` quando o item sai de `Done`
- move automaticamente para a proxima sprint os cards da sprint encerrada
  que nao estao em `Done`
- cria branch de tarefa quando uma issue/card entra em `In Progress` com repo resolvido
  e vincula em **Development** quando o card e uma Issue
- publica o status `git-flow/pr-policy` nos PRs
- **move o card para `In Validation` automaticamente quando um PR e aberto**
  a partir de um branch de trabalho (`feature/`, `fix/`, etc.)
- **move o card para `Homologation` automaticamente quando o PR e mergeado**
  (vale para branches de trabalho e hotfix)
- cria tag automaticamente depois do merge de release/hotfix em producao
- abre PRs de retorno de hotfix para `develop` e para release aberta

## Estrutura

- `src/app`: ponto de entrada do worker e orquestracao do webhook
- `src/config`: leitura e validacao de configuracao
- `src/domain`: regras de negocio da automacao
- `src/github`: autenticacao, GraphQL e acesso ao Project
- `src/project`: sincronizacao e definicao dos campos gerenciados
- `scripts`: comandos operacionais
- `test`: testes unitarios

## Automacoes de Git Flow

Alem da automacao de datas, o worker expoe as automacoes de Git Flow do
ConectaFapes. O dominio e puro (planejadores) e o gateway GitHub
(`GitFlowGateway`) e o unico que executa acoes de fato. Toda operacao tem
modo **dry-run** (padrao): sem `execute: true` no corpo, o worker retorna
apenas o **plano** (`status: "planned"`), sem chamar o GitHub. Com
`execute: true` (e credenciais do GitHub App presentes), as acoes sao
aplicadas de forma **idempotente** — branch/PR/tag ja existentes retornam
`already_exists` em vez de falhar.

### Repositorios suportados

| Repositorio | Producao | Integracao |
| --- | --- | --- |
| `leds-conectafapes-backend-admin` | `main` | `develop` |
| `leds-conectafapes-frontend-backoffice` | `main` | `develop` |
| `leds-conectafapes-frontoffice-backend` | `main` | `develop` |
| `leds-conectafapes-frontoffice-frontend` | `main` | `develop` |
| `leds-conectafapes-prestacao-de-contas` | `master` | `develop` |

### Rotas (todas `POST`)

#### Webhook `pull_request`

Qualquer request com header `x-github-event: pull_request` e roteado para a
validacao de politica. Se `GITHUB_WEBHOOK_SECRET` estiver configurado, a
assinatura `x-hub-signature-256` e verificada.

Regras validadas:

- PR para producao (`main`/`master`) so pode vir de `release/*` ou `hotfix/*`;
- PR para `develop` deve vir de um branch de trabalho permitido e nunca de um
  branch protegido (`main`/`master`/`develop`).

Resposta: `{ "validation": { "valid": true|false, "reason": "...",
"checkName": "git-flow/pr-policy" }, "repository": "..." }`. Quando o PR tem
`head.sha` e repositorio, o worker tambem publica o status
`git-flow/pr-policy` no commit do PR.

Quando um PR de `release/*` ou `hotfix/*` e mergeado em producao, o mesmo
webhook executa a etapa pos-merge: cria a tag no commit de merge. Para hotfix,
tambem abre os PRs de retorno para `develop` e para qualquer `release/*` aberta.

#### `POST /git-flow/pull-request`

Valida a politica via JSON (util para testes/integracao manual). Retorna
`200` quando valido e `422` quando invalido.

```json
{ "baseBranch": "main", "headBranch": "release/v1.2" }
```

#### `POST /git-flow/branch`

Cria um branch a partir de `develop` quando uma demanda entra em `In Progress`.
Na rota manual, aceita `repository` (nome puro ou `org/repo`); sem repositorio
reconhecido retorna `needs_review`. Se `issueId` for informado, o worker usa
`createLinkedBranch`, entao a branch ja aparece na secao **Development** da
Issue. Sem `issueId`, ele mantem o fallback idempotente de criar apenas a ref.
A mesma regra tambem roda no webhook `projects_v2_item`: o worker resolve
titulo/numero/repositorio/Issue ID via GraphQL, priorizando o campo
single-select `Repositório` do Project e usando o repositorio da Issue como
fallback. Com repositorio reconhecido, cria a branch automaticamente.

```json
{
  "statusName": "In Progress",
  "repository": "leds-conectafapes-backend-admin",
  "issueId": "I_kwDO...",
  "issueNumber": 42,
  "title": "Cadastro de Diarias",
  "execute": false
}
```

#### `POST /git-flow/release`

Planeja/executa a release `vX.Y` nos repositorios afetados: cria
`release/vX.Y` a partir de `develop`, abre o PR da release para producao e
cria a tag em producao (apos o merge). Versao invalida ou nenhum repositorio
reconhecido retorna `422`.

```json
{
  "version": "v1.2",
  "repositories": [
    "leds-conectafapes-backend-admin",
    "leds-conectafapes-prestacao-de-contas"
  ],
  "execute": false
}
```

#### `POST /git-flow/hotfix`

Planeja/executa um hotfix seguro: valida versao (`vX.Y.Z`) e aprovacao, cria
a tag em producao, abre PR de retorno para `develop` e, se houver release
aberta, PR de retorno para ela.

```json
{
  "version": "v1.2.1",
  "repository": "leds-conectafapes-backend-admin",
  "approved": true,
  "openReleaseBranch": "release/v1.3",
  "execute": false
}
```

### `execute`, autorizacao e dry-run

- sem `execute` (ou `execute: false`): o worker retorna o plano com
  `status: "planned"` e nao chama o GitHub. Dry-run NAO exige token.
- `execute: true`: exige autorizacao de admin. E preciso ter
  `GIT_FLOW_ADMIN_TOKEN` configurado no env E enviar o mesmo valor no header
  `authorization` usando Bearer, ou no header `x-git-flow-token`.
  - sem `GIT_FLOW_ADMIN_TOKEN` configurado: `403 execution_not_configured`
    (o gateway nao e construido);
  - token ausente/incorreto: `401 unauthorized` (o gateway nao e construido);
  - autorizado: o worker monta o `GitFlowGateway` (token via GitHub App) e
    aplica o plano; resultados por acao: `created`, `already_exists`,
    `skipped`, `blocked` ou `failed`.

### Tag e etapa pos-merge (seguranca)

A tag de release/hotfix so deve existir **depois** do merge em producao.
Por isso, as rotas manuais `/git-flow/release` e `/git-flow/hotfix` continuam
planejando a tag, mas nao executam `create_tag` durante a preparacao da release
ou do hotfix.

O caminho automatico e o webhook `pull_request`: quando o PR de `release/*` ou
`hotfix/*` e mergeado em `main`/`master`, o worker cria a tag no
`merge_commit_sha`. Em hotfix, ele tambem abre os PRs de retorno para
`develop` e para as branches `release/*` abertas.

`createTags: true` continua existindo para execucao administrativa manual, caso
seja necessario reprocessar/conferir uma tag com autorizacao explicita.

```json
{
  "version": "v1.2",
  "repositories": ["leds-conectafapes-backend-admin"],
  "execute": true,
  "createTags": true
}
```

## Comandos

```bash
npm install
npm run rollover:sprint
npm run typecheck
npm test
npm run sync:fields
```

## Variaveis

### `wrangler.jsonc`

- `GITHUB_ORG`
- `GITHUB_PROJECT_ID`
- `GITHUB_PROJECT_NUMBER`
- `STATUS_FIELD_NAME`
- `STARTED_AT_FIELD_NAME`
- `DONE_AT_FIELD_NAME`
- `REPOSITORY_FIELD_NAME`
- `IN_PROGRESS_OPTION_NAME`
- `IN_VALIDATION_OPTION_NAME` (default `In Validation`)
- `HOMOLOGATION_OPTION_NAME` (default `Homologation`)
- `READY_FOR_DEV_OPTION_NAME`
- `DONE_OPTION_NAME`
- `ITERATION_FIELD_NAME` ou `SPRINT_FIELD_NAME`
- `SPRINT_ROLLOVER_DRY_RUN`
- `SPRINT_ROLLOVER_DATE`

### Git Flow (`wrangler.jsonc`, opcionais)

- `READY_FOR_DEV_OPTION_NAME` (default `In Progress`)
- `GIT_FLOW_DEVELOP_BRANCH` (default `develop`)
- `GIT_FLOW_WORK_BRANCH_PREFIXES` (lista separada por virgula; default
  `feature/,feat/,fix/,bugfix/,chore/,docs/,refactor/,test/`)
- `GIT_FLOW_RELEASE_PREFIX` (default `release/`)
- `GIT_FLOW_HOTFIX_PREFIX` (default `hotfix/`)

As automacoes de Git Flow usam, por padrao, os segredos do GitHub App
(`GITHUB_APP_ID`, `GITHUB_APP_INSTALLATION_ID`, `GITHUB_APP_PRIVATE_KEY`) para
ler o Project e criar o token da instalacao. Para side-effects em repositorios
tecnicos (criar branch/PR/tag), o worker pode usar um token de repositorio
quando o GitHub App nao tiver `Contents: write`: configure
`GITHUB_GIT_FLOW_TOKEN` (preferido) ou `GITHUB_REPOSITORY_TOKEN`. O secret
legado `GITHUB_STATUS_TOKEN` tambem e aceito como fallback para manter
compatibilidade. Para branch vinculada em **Development**, esse token precisa
conseguir ler a Issue do card e criar `createLinkedBranch` no repositorio
tecnico alem de criar refs/branches. A chave privada do GitHub App pode estar
em PKCS#8 ou no formato RSA/PKCS#1 emitido pelo GitHub; o worker normaliza
antes de gerar o JWT da instalacao. `GITHUB_WEBHOOK_SECRET` valida a assinatura
do webhook principal do GitHub App/Project.

Para webhooks diretos de repositorio que disparam a validacao de PR, use
`GITHUB_REPO_WEBHOOK_SECRET`. Isso permite configurar `pull_request` nos repos
tecnicos sem rotacionar o secret ja usado pelo webhook do Project.

A publicacao do status `git-flow/pr-policy` pode usar `GITHUB_STATUS_TOKEN`
quando o GitHub App ainda nao tiver permissao `Commit statuses: write`; se esse
secret nao existir, o worker usa o token da instalacao do GitHub App.

### Segredo de execucao do Git Flow

- `GIT_FLOW_ADMIN_TOKEN` — token obrigatorio para autorizar qualquer rota
  `/git-flow/*` chamada com `execute: true`. Enviar no header `authorization`
  usando Bearer, ou no header `x-git-flow-token`. Sem ele, execucoes sao
  recusadas (`403`/`401`); dry-run continua liberado.

### Segredos

- `GITHUB_APP_ID`
- `GITHUB_APP_INSTALLATION_ID`
- `GITHUB_APP_PRIVATE_KEY`
- `GITHUB_WEBHOOK_SECRET`
- `GITHUB_REPO_WEBHOOK_SECRET` (opcional; webhooks diretos dos repositorios)
- `GITHUB_GIT_FLOW_TOKEN` (opcional; preferido para branch/PR/tag/linked branch)
- `GITHUB_REPOSITORY_TOKEN` (opcional; fallback para side-effects nos repositorios)
- `GITHUB_STATUS_TOKEN` (opcional; fallback para publicar commit statuses e legado de repositorio)

Para o rollover executado pelo GitHub Actions, use um token com permissao de
Projects em `GITHUB_LEDS`/`PROJECTS_PAT` ou os segredos do GitHub App
`GITHUB_APP_ID`, `GITHUB_APP_INSTALLATION_ID` e `GITHUB_APP_PRIVATE_KEY`.
