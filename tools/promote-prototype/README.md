# promote-prototype

Automação do **handoff** quando uma tela do protótipo é promovida de `prototipagem`
para `main` (ambiente estável).

## `create-ready-for-dev.mjs`

Chamado pelo workflow [`promocao-project43.yml`](../../.github/workflows/promocao-project43.yml)
quando um PR que altera `prototype/**` é mergeado na `main`. Ele:

1. Detecta quais apps mudaram no PR (front-office / backoffice).
2. Cria uma issue **"[Pronto para Dev] …"** no repositório de planejamento.
3. Adiciona a issue ao **Project 43** e preenche `Repositório` (repo de produto alvo)
   e `Area=Frontend` — IDs resolvidos por nome em tempo de execução.
4. Usa a auditoria do corpo do PR (gerada localmente com o Claude via `/auditar-promocao`).

### Validar antes (dry-run)

```bash
GH_TOKEN=<PROJECTS_PAT> \
GH_REPO=leds-conectafapes/conectafapes-project \
PR_NUMBER=<num> PR_TITLE="[FEAT] Tela X" PR_BODY="..." PR_URL="..." \
DRY_RUN=true \
node tools/promote-prototype/create-ready-for-dev.mjs
```

O dry-run imprime os campos/opções resolvidos do Project 43 sem criar nada — use-o
para conferir o mapeamento antes de ativar (ou ajuste as constantes no topo do script:
`ISSUE_REPO`, `APP_MAP`, `AREA_VALUE`). Para rodar em dry-run no CI, defina a
*repository variable* `PROMOCAO_DRY_RUN=true`.

### Pré-requisitos
- Secret `PROJECTS_PAT` com acesso ao Project 43 e permissão de criar issues no repo de planejamento.

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

> **Nota:** este script serve para **criar/inspecionar** os projetos do estável.
> O **deploy não usa mais GitHub Actions** — é feito pela integração nativa do Vercel
> com o Git (`main` → estável), para não consumir minutos de Actions. Por isso a conta
> do estável **precisa** ter o repositório conectado (app do Vercel no GitHub), e cada
> projeto precisa de **Production Branch** e **Root Directory** configurados.
> Ver [docs/management/ambientes-prototipo.md](../../docs/management/ambientes-prototipo.md).
