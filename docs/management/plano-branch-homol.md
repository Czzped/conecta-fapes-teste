# Plano: branch `homol` e separação dev / homologação / produção

Documento de execução para tirar a homologação da branch `main` e liberar a `main`
para produção. O objetivo prático é destravar hotfix: hoje, corrigir produção
obriga a passar por `main`, que carrega tudo que já foi mergeado e ainda não foi
promovido.

## 1. Decisões tomadas

| Decisão | Escolha | Consequência |
|---|---|---|
| Como a imagem chega em produção | **Rebuild na `main`** | Push na `main` builda e dispara `environment: prod`. Simétrico com homol, sem pré-requisito. Produção roda um digest diferente do validado em homol (mesmo código, outro artefato) e o mesmo commit é buildado até 3x. |
| Git-flow | **`release/*` como veículo até a `main`** | `release/vX.Y.Z` sai de `develop` → PR para `homol` (deploy homol) → o **mesmo** `release/*` vai para `main` (deploy prod + tag). O head da `main` continua sendo `release/*`, então a lógica de tag atual sobrevive. |
| Stage do cluster LEDS | **Aposentar** | Homologação passa a ser só a do Prodest. Remove o deploy de `values-stage.yaml` dos repos de app. |

## 2. Estado atual (verificado)

Existem **dois** repos de infra:

| Ambiente | Repo | Branch | Arquivo | Quem escreve |
|---|---|---|---|---|
| dev | `leds-plataforma-helms` | `develop` | `conectafapes/values-develop.yaml` | CI do app, push direto |
| stage | `leds-plataforma-helms` | `develop` | `conectafapes/values-stage.yaml` | CI do app, push direto |
| homologação (Prodest) | `leds-conectafapes-helm-prodest` | `conectafapes-prodest-hom` | `values-hom.yaml` | `update-image.yml`, via PR |
| produção (Prodest) | `leds-conectafapes-helm-prodest` | `conectafapes-prodest-prod` | `values-prod.yaml` | `release-prod.yml`, via PR |

Gatilhos por repo de aplicação:

| Repo | Serviço no Prodest | dev ← | stage ← | homol ← | tag da imagem |
|---|---|---|---|---|---|
| `backend-admin` | `backendAdmin` | develop | main | **main** | `:<branch>` |
| `authentication` | `auth` + `authPortal` | — | — | **main** | `:<branch>` |
| `frontend-backoffice` | `frontendAdmin` | develop | main | **main** | `:<branch>-<sha>` |
| `frontoffice-frontend` | `frontendPortal` | develop | main | **main** | `:<branch>-<sha>` |
| `frontoffice-backend` | `backendPortal` | develop | main | **main** | `:<branch>` |
| `prestacao-de-contas` | `backendPrestacaoContas` | develop | master | **master** | `:<branch>` |
| `backend-pagamento-bolsistas` | `backendPagamentoBolsistas` | develop | main | **main** | `:<branch>` |

O job `deploy-homol` faz `repository_dispatch` → `update-image.yml` abre PR em
`conectafapes-prodest-hom` → merge → ArgoCD. Produção **nunca** é disparada por
branch: só pelo `release-prod.yml` manual, que copia o digest de `values-hom.yaml`
para `values-prod.yaml`, e o `sync-prod.yml` roda `argocd app sync`.

Os workflows do `helm-prodest` existem **apenas na branch default**
(`conectafapes-prodest-prod`) — que é de onde `repository_dispatch` e
`workflow_dispatch` são lidos. Não mover para a branch `hom`.

## 3. Modelo alvo

| Branch do app | Ambiente | Destino |
|---|---|---|
| `develop` | dev | `values-develop.yaml` (cluster LEDS), push direto |
| `homol` (nova) | homologação | dispatch `environment: homol` → PR em `values-hom.yaml` (Prodest) |
| `main` | produção | dispatch `environment: prod` → PR em `values-prod.yaml` (Prodest) |

Fluxo:

```text
feature/123-x ──PR──> develop                        (deploy dev)
develop ──release/vX.Y.Z──PR──> homol                (deploy homologação)
release/vX.Y.Z ──PR──> main                          (deploy produção + tag vX.Y.Z)
hotfix/vX.Y.Z ──PR──> main                           (deploy produção + tag)
        └── back-merge automático ──> homol e develop
```

O ganho do hotfix: a branch sai de `main`, volta para `main`, e o back-merge é
aberto automaticamente para `homol` e `develop`. Nada que está pendente em homol
é arrastado para produção.

## 4. Mudanças por área

### 4.1 Branches e proteções (7 repos de app)

- Criar `homol` a partir de **`main`** (não de `develop`) — homol precisa ser
  superconjunto de produção, senão o primeiro deploy de homol regride serviços.
- Replicar na `homol` a proteção que a `main` já tem: PR obrigatório, 1 aprovação,
  conversas resolvidas, status `git-flow/pr-policy` obrigatório, sem force-push,
  sem deleção.
- `authentication` e `backend-pagamento-bolsistas` têm `main` **sem proteção** —
  corrigir junto.
- `prestacao-de-contas` usa `master` como produção. Renomear para `main`
  (GitHub mantém redirect) e ajustar os 5 pontos que referenciam `master`:
  CI, `generate-new-tag.yml`, `release.mjs`, `git-flow-config.ts` e a doc do
  git flow. Nos outros repos `master` já é redirect antigo para `develop`, então
  a operação de rename é conhecida na org.

### 4.2 CI dos repos de aplicação

Três edições por arquivo. Exemplo em `backend-admin-ci.yml`:

**a) Gatilhos** — adicionar `homol`, remover `test` (branch inexistente em 5 dos
7 repos):

```yaml
on:
  push:
    branches: [develop, homol, main]
  pull_request:
    branches: [develop, homol, main]
```

**b) Job `deploy` (helm legado)** — stage aposentado, sobra só dev. Guardar o job
inteiro por branch e remover o `case`:

```yaml
  deploy:
    name: Deploy dev (helm legado)
    if: ${{ github.event_name == 'push' && github.ref_name == 'develop' }}
    # VALUES_FILE fixo: conectafapes/values-develop.yaml
```

**c) Job `deploy-homol` → `deploy-prodest`** — um job só, ambiente derivado da
branch. Mantém o `curl` com JSON literal (o runner self-hosted não tem `jq`
garantido):

```yaml
  deploy-prodest:
    name: Deploy Prodest (homol/prod)
    runs-on: ${{ fromJSON(vars.RUNNER_LABELS || '["self-hosted","linux","x64"]') }}
    if: ${{ github.event_name == 'push' && (github.ref_name == 'homol' || github.ref_name == 'main') }}
    needs: publish
    steps:
      - name: Definir ambiente
        id: env
        run: |
          case "${BRANCH_NAME}" in
            homol) echo "environment=homol" >> "$GITHUB_OUTPUT" ;;
            main)  echo "environment=prod"  >> "$GITHUB_OUTPUT" ;;
          esac

      - name: Disparar atualização no helm-prodest
        run: |
          curl --fail-with-body -sS -X POST \
            "https://api.github.com/repos/${HELM_PRODEST_REPO}/dispatches" \
            -H "Authorization: Bearer ${{ secrets.HELM_PRODEST_TOKEN }}" \
            -H "Accept: application/vnd.github+json" \
            -d '{
              "event_type": "update-image",
              "client_payload": {
                "service": "${{ env.HELM_PRODEST_SERVICE }}",
                "tag": "${{ needs.publish.outputs.image_digest }}",
                "environment": "${{ steps.env.outputs.environment }}",
                "app_repo": "${{ github.repository }}"
              }
            }'
```

Particularidades por repo:

| Repo | Ajuste extra |
|---|---|
| `authentication` | Mantém a `matrix: [auth, authPortal]`; não tem job de helm legado, então só muda gatilho + `if`. |
| `frontoffice-backend` | Remover o gatilho da branch `prod` (não existe) e o job `deploy-stage` inteiro. |
| `prestacao-de-contas` | Trocar `master` por `main` em gatilho e `if`. **Não** habilitar o dispatch de prod ainda (ver 4.6). |
| `backend-admin` | Deixa de publicar em `values-stage.yaml`. A imagem `job-admin` continua sem destino no Prodest (ver 4.6). |
| `backend-pagamento-bolsistas` | Idem stage. A imagem `job-pagamento` é publicada mas nunca despachada (ver 4.6). |
| `frontend-backoffice`, `frontoffice-frontend` | Só gatilho, `if` e remoção do stage. |

**`autoupdate.yml` / `autoupdate-on-pr.yml` (7 repos)**: adicionar `homol` em
`on.push.branches`, senão PRs baseados em homol param de se atualizar sozinhos.

### 4.3 `helm-prodest`

- `update-image.yml` **não precisa mudar**: já aceita `environment: prod` e
  resolve base `conectafapes-prodest-prod` + `values-prod.yaml`.
- Proteger a branch `conectafapes-prodest-hom` (hoje sem proteção): sem
  force-push, sem deleção. Aprovação não é necessária — o volume é diário.
- `release-prod.yml` passa a furar o modelo (promove hom→prod ignorando a `main`).
  Manter como break-glass: renomear para deixar explícito que é manual/emergência
  e adicionar `environment: producao` para exigir aprovação.
- Confirmar se os apps de **homologação** têm auto-sync no ArgoCD. Existe
  `sync-prod.yml` (sync explícito depois de `values-prod.yaml`), mas **não existe
  `sync-hom.yml`**. Funciona hoje, logo o auto-sync provavelmente está ligado —
  mas isso passa a ser o caminho principal e precisa ser verificado com o Prodest.

### 4.4 Automação git-flow (`tools/project43-automation`)

Sem estas mudanças o fluxo novo é **bloqueado** pelo status obrigatório
`git-flow/pr-policy`.

**`src/config/git-flow-config.ts`**
- `DEFAULT_HOMOLOGATION_BRANCH = "homol"`; campo `homologationBranch` em
  `RepoDefinition` e em `GitFlowConfig`; incluir em `protectedBranches`;
  helper `listHomologationBranches`.
- Adicionar os repos ausentes de `DEFAULT_REPOSITORIES`:
  `leds-conectafapes-authentication` e
  `leds-conectafapes-backend-pagamento-bolsistas`.
- `prestacao-de-contas`: `productionBranch` de `master` para `main` após o rename.

**`src/domain/pr-validation.ts`**
- Novo caso `base === homologationBranch`: válido para `release/*`, `hotfix/*` e
  back-merge da produção; inválido para branch de trabalho e para `develop`
  (o veículo até homol é a release, é isso que força o versionamento).
- Estender o back-merge para `develop`: aceitar `homol` como head
  (hoje cai em `develop_pr_from_unknown_branch` e **falha**).
- `release/* → main` e `hotfix/* → main` continuam válidos sem mudança.

**`src/domain/production-merge-planning.ts`**
- Hotfix mergeado em produção: além do PR de retorno para `develop` e para as
  `release/*` abertas, abrir PR de retorno para **`homol`**. É o ponto que fecha
  o ciclo do hotfix.
- Release mergeada em produção: além do back-merge `main → develop`, abrir
  `main → homol`. Normalmente é no-op (homol já recebeu a release antes), mas
  garante convergência.
- A criação da tag **não muda**: o head da `main` continua sendo `release/*` ou
  `hotfix/*`.

**`src/domain/pr-card-movement.ts`** (opcional, decisão de produto)
- Hoje o card vai para "Homologation" ao mergear em `develop`. Com um ambiente de
  homologação real, o mapeamento coerente seria: merge em `homol` → Homologation,
  merge em `main` → Done. Não mexer sem uma decisão de produto; anotar como
  pendência.

### 4.5 Release tool

**`tools/release/release.mjs`**
- `REPO_DEFS`: adicionar `homologation: 'homol'` por repo; incluir
  `authentication` (hoje fora da ferramenta, e alimenta 2 serviços).
- `createPullRequest`: base passa a ser `homol` (era `main`/`master`).
- Novo modo `--promote`: abre `release/vX.Y.Z → main` para os repos escolhidos,
  depois que a homologação foi validada.

**`.github/workflows/release-conectafapes.yml`**
- Novo input booleano `promover_para_producao`, mapeado para `--promote`,
  mantendo o par dry-run/execute.

**`generate-new-tag.yml` (7 repos)** — decisão pendente: ele cria tag automática
em todo push na `main`, competindo com a tag criada pelo app git-flow. Ou remove
o workflow nos repos cobertos pelo git-flow, ou remove o `create_tag` do app.
No `prestacao-de-contas` ele aponta para `main`, que não existe: workflow morto.

### 4.6 Pendências que bloqueiam parte do escopo

1. ~~**`backendPrestacaoContas` não existe em `values-prod.yaml`**~~ —
   **resolvido** pelo [PR #62](https://github.com/leds-conectafapes/leds-conectafapes-helm-prodest/pull/62)
   (aguardando 2 aprovações). Os templates de deploy/service e o bloco de
   values foram adicionados; **nenhum secret novo era necessário** — todas as
   chaves já existiam na branch de produção. Restam duas verificações de
   infraestrutura antes do merge: o bucket
   `pr-conectafapes-admin-prestacao-contas` em `one.s3.es.gov.br` e o schema de
   prestação de contas no banco de produção. `autherixApi` continua ausente de
   `values-prod.yaml`, mas não é alimentado por nenhum destes repos.
2. **Serviços do Prodest sem CI nenhum**, que um deploy de produção não vai
   atualizar:
   - `jobPagamento` (`leds-conectafapes-job-pagamento`) — a imagem **é** buildada
     e publicada pelo `pagamento-ci.yml`, mas nunca despachada. Correção simples:
     incluir no dispatch.
   - `jobImportacao` (`leds-conectafapes-job-importacao`) — **nenhum CI publica**
     essa imagem; é resquício do repo `leds-conectafapes-infra`. O
     `backend-admin` builda `leds-conectafapes-job-admin`, que é outra imagem.
     Precisa decidir se `jobImportacao` passa a ser alimentado pelo
     `backend-admin` ou se está morto.
   - `backendNotifications`, `backendPagamentoDashboard`, `createUser`,
     `apiGateway`, `apiGatewayPortal` — atualizados manualmente hoje.
3. **Aposentar o stage** exige, além dos 7 CIs, remover
   `conectafapes/values-stage.yaml` do `leds-plataforma-helms` e o app do ArgoCD
   que o consome (ação na infra do LEDS).
4. **Tags de imagem mutáveis** (`:main`, `:develop`) em 5 dos 7 repos: o digest
   que vai para produção fica órfão no GHCR (sem tag) na próxima build. Não
   bloqueia o rebuild-na-main, mas é o pré-requisito de qualquer promoção por
   artefato no futuro. Padronizar em `:<branch>-<sha>`, como já fazem
   `frontend-backoffice` e `frontoffice-frontend`.

## 5. Ordem de execução

**Fase 0 — desbloquear a automação (repo `conectafapes-project`) — ✅ feita**
Sem isso, todo PR do fluxo novo é reprovado pelo `git-flow/pr-policy`.

- `git-flow-config.ts`: campo `homologationBranch` por repo (`null` no
  `conectafapes-project`, que não tem esse ambiente) + os repos que faltavam
  (`authentication`, `backend-pagamento-bolsistas`).
- `pr-validation.ts`: `release/*`, `hotfix/*` e back-merge de produção passam a
  ser aceitos com destino `homol`; `homol → develop` deixa de ser reprovado.
  `homol → main` **continua** reprovado de propósito: a `main` só recebe
  `release/*` e `hotfix/*`, que é o que carrega a versão.
- `production-merge-planning.ts`: hotfix mergeado em produção agora abre PR de
  retorno para `homol` (antes de `develop` e das releases abertas), e a release
  abre back-merge `main → homol`. A criação da tag não mudou.
- 93 testes passando, `tsc --noEmit` limpo.

> ⚠️ O `git-flow/pr-policy` roda num Cloudflare Worker
> (`tools/project43-automation/wrangler.jsonc`), e o workflow
> `project43-automation.yml` **só roda os testes — não faz deploy**. A mudança
> só passa a valer depois de um `wrangler deploy` manual. Enquanto o worker
> antigo estiver no ar, os PRs para `homol` seguem sendo reprovados.

**Fase 1 — piloto em um repo**
`leds-conectafapes-authentication`: é o único sem job de helm legado, então o
diff é mínimo (gatilho + `if` + ambiente). Criar `homol`, proteger, ajustar o CI,
e validar o ciclo completo: merge em `homol` → PR no `helm-prodest` → merge →
ArgoCD; merge em `main` → PR em `values-prod.yaml`.

**Fase 2 — demais repos**
`frontend-backoffice`, `frontoffice-frontend`, `backend-admin`,
`frontoffice-backend`, `backend-pagamento-bolsistas`. `prestacao-de-contas`
entra com o rename `master → main` e já com o dispatch de prod, desde que o
[PR #62](https://github.com/leds-conectafapes/leds-conectafapes-helm-prodest/pull/62)
tenha sido mergeado.

**Fase 3 — release tool e docs**
`release.mjs` + `release-conectafapes.yml`; reescrever
`docs/management/git-flow-conectafapes.md`.

**Fase 4 — limpeza**
Aposentar o stage no `leds-plataforma-helms`; resolver a duplicidade de tag
(`generate-new-tag.yml`); padronizar tags de imagem; decidir os serviços órfãos.

## 6. Como validar

Por repo, depois da mudança:

1. Push numa `feature/*` → só build/lint, nenhum deploy.
2. PR `feature/* → develop`, merge → `values-develop.yaml` atualizado no
   `leds-plataforma-helms`.
3. `release/vX.Y.Z` de `develop`, PR para `homol` (o `pr-policy` precisa passar),
   merge → PR automático no `helm-prodest` contra `conectafapes-prodest-hom`.
4. Merge desse PR → app sincronizado no ArgoCD de homologação.
5. PR `release/vX.Y.Z → main`, merge → PR no `helm-prodest` contra
   `conectafapes-prodest-prod` + tag `vX.Y.Z` criada no repo de app.
6. Teste do hotfix: `hotfix/vX.Y.Z+1` de `main`, PR para `main`, merge →
   deploy de produção + PRs de retorno abertos para `homol` e `develop`.

## 7. Rollback

Cada fase é reversível de forma independente:

- Fases 1–2: reverter o commit do CI e mudar o `if` do `deploy-prodest` de volta
  para `main` com `environment: homol`. A branch `homol` pode ficar parada sem
  efeito nenhum.
- Fase 0: reverter os commits da automação; o `pr-policy` volta ao
  comportamento anterior no próximo deploy do worker.
- Fase 4 é a única com passo destrutivo (remover `values-stage.yaml` e o app do
  ArgoCD). Fazer por último, e só depois de a homologação do Prodest estar
  estável no fluxo novo.
