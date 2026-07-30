# promote-prototype

Automação do **handoff** quando uma tela do protótipo é promovida de `prototipagem`
para `main` (ambiente estável).

## `sync-card-promocao.mjs`

Chamado pelo workflow [`promocao-project43.yml`](../../.github/workflows/promocao-project43.yml)
nos eventos do PR de promoção (`prototipagem` → `main`) que altera `prototype/**`.

O **card é a peça central** do fluxo: é nele que a equipe vê a alteração proposta e de
onde vai ao PR aprovar. Por isso ele nasce na **abertura** do PR, não no merge:

| Evento do PR | O que o script faz |
|---|---|
| `opened` / `reopened` | Cria a issue **"[Promoção] …"**, adiciona ao **Project 43** em `Status = In Validation`, preenche `Area=Frontend` e `Repositório` (repo de produto alvo), e comenta no PR o link do card |
| `closed` + mergeado | Move o card para **Pronto para desenvolvimento** e registra o link do ambiente **estável** |
| `closed` sem merge | Move o card para **Desaprovado** |

O corpo do card traz o link do **protótipo** (para ver a alteração) e a **auditoria**
gerada com `/promover-para-estavel`.

### Como o card é reencontrado

A ligação card ↔ PR fica num **comentário-marcador no próprio PR**
(`<!-- card-promocao: N -->`). Comentários de PR são consistentes imediatamente,
diferente da API de busca, que tem atraso de indexação. Isso também torna o script
idempotente: se o PR for reaberto, ele encontra o card em vez de criar outro.

### Validar antes (dry-run)

```bash
GH_TOKEN=<PROJECTS_PAT> \
GH_REPO=leds-conectafapes/conectafapes-project \
PR_NUMBER=<num> PR_TITLE="[FEAT] Tela X" PR_BODY="..." PR_URL="..." \
PR_ACTION=opened \
DRY_RUN=true \
node tools/promote-prototype/sync-card-promocao.mjs
```

O dry-run imprime as colunas e opções resolvidas sem alterar o board. Para dry-run no
CI, defina a *variable* `PROMOCAO_DRY_RUN=true`.

As constantes no topo do script definem as colunas usadas (`In Validation`,
`Pronto para desenvolvimento`, `Desaprovado`), a `Area` e o mapa de apps → repo de
produto e URLs dos dois ambientes.

### Pré-requisitos
- Secret `PROJECTS_PAT` com acesso ao Project 43 e permissão de criar issues.
  O `GITHUB_TOKEN` padrão **não** alcança projects da organização.

### Relação com a automação existente
O worker em [`tools/project43-automation`](../project43-automation) já move cards a
partir de eventos de PR (`pr-card-movement`), localizando o card pelo número na branch
(`feature/123-…`). A branch de promoção é sempre `prototipagem`, sem número — por isso
a movimentação da promoção vive aqui, e não lá. Não há conflito entre os dois.

## `setup-vercel-estavel.mjs`

Prepara a **conta Vercel do ambiente estável** (separada da conta do protótipo):
descobre o `VERCEL_ORG_ID_ESTAVEL`, cria/reaproveita os 2 projetos e imprime os
secrets a cadastrar no GitHub. Nunca imprime o token.

```bash
# dry-run (não cria nada)
VERCEL_TOKEN_ESTAVEL=*** node tools/promote-prototype/setup-vercel-estavel.mjs

# criar de verdade
VERCEL_TOKEN_ESTAVEL=*** node tools/promote-prototype/setup-vercel-estavel.mjs --execute
```

Flags: `--team <slug>` (se a conta tiver vários times), `--personal` (conta pessoal).

Os deploys usam apenas o secret do token — `VERCEL_TOKEN_ESTAVEL` (estável, Environment
`estavel`) e `VERCEL_TOKEN` (protótipo, Environment `prototipo`). Os identificadores de
conta e projeto ficam explícitos nos workflows, por não serem segredos.

> **Nota:** os dois ambientes publicam pela **CLI do Vercel** dentro do Actions — a
> integração nativa exigiria plano Pro para repositório privado de organização, e as
> contas estão no Hobby. Por isso as contas **não precisam** ter o repositório conectado.
> Ver [docs/management/ambientes-prototipo.md](../../docs/management/ambientes-prototipo.md).

> Os secrets `VERCEL_ORG_ID_ESTAVEL` e `VERCEL_PROJECT_ID_*_ESTAVEL` deixaram de ser
> usados (os valores passaram para os workflows) e podem ser removidos numa limpeza.
