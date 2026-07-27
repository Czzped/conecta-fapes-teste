# Ambientes do protótipo: prototipagem × estável

Este documento descreve como as telas do protótipo saem da prototipagem e chegam à
equipe de desenvolvimento.

## 1. O problema que isso resolve

Antes existia **um único ambiente**: quem faz a prototipagem publicava a cada push na
`main`, e as telas mudavam embaixo de quem ainda estava implementando, sem etapa de
aprovação. Agora há dois ambientes com propósitos distintos.

| Ambiente | Branch | Para que serve | URLs |
|---|---|---|---|
| **Protótipo** | `prototipagem` | Trabalho contínuo de prototipagem. Muda a toda hora, sem aprovação. | [frontoffice-conecta](https://frontoffice-conecta.vercel.app) · [backoffice-conecta](https://backoffice-conecta.vercel.app) |
| **Estável** | `main` | Referência de "tela pronta para desenvolvimento". Só muda com aprovação. | [frontoffice-conecta-estavel](https://frontoffice-conecta-estavel.vercel.app) · [backoffice-conecta-estavel](https://backoffice-conecta-estavel.vercel.app) |

> A equipe de desenvolvimento implementa olhando o **estável**. Se precisar ver o que
> está sendo desenhado agora, olha o **protótipo**.

## 2. O fluxo

```
feature/*  ──PR──▶  prototipagem  ──(deploy automático)──▶  PROTÓTIPO
                          │
                          │  PR de promoção: "tela pronta para desenvolvimento"
                          │  (auditoria no corpo + 2 aprovações)
                          ▼
                        main  ──(deploy automático)──▶  ESTÁVEL
                                                        + issue no Project 43
```

## 3. Como promover uma tela

1. Abra um **Pull Request de `prototipagem` para `main`**, usando o template
   [`promocao-estavel`](../../.github/PULL_REQUEST_TEMPLATE/promocao-estavel.md)
   (acrescente `?template=promocao-estavel.md` na URL do PR).
2. Coloque a `[FLAG]` no título (`[FEAT]`, `[FIX]`, …), como em qualquer PR do projeto.
3. Gere a **auditoria das mudanças** e cole no corpo do PR: rode `/auditar-promocao`
   no Claude Code, que lê o diff e descreve telas adicionadas/alteradas/removidas e
   fluxos afetados.
4. Vincule a issue de planejamento.
5. **2 aprovações** são obrigatórias (branch protection da `main`). Este é o gate:
   a aprovação acontece no PR, não no deploy.

Ao mergear, automaticamente:
- o **Vercel publica** o estável (só os apps cuja pasta mudou);
- o workflow [`promocao-project43`](../../.github/workflows/promocao-project43.yml)
  cria a issue **"[Pronto para Dev]"** no [Project 43](https://github.com/orgs/leds-conectafapes/projects/43),
  com `Repositório` (repo de produto alvo), `Area=Frontend` e a auditoria no corpo.

Mapeamento de destino: front-office → `leds-conectafapes-frontoffice-frontend`;
backoffice → `leds-conectafapes-frontend-backoffice`.

## 4. Como o deploy funciona

Cada ambiente publica de um jeito diferente, por uma razão de custo:

Os dois ambientes publicam pela **CLI do Vercel**, dentro do GitHub Actions. A
integração nativa do Vercel com o Git **não é usada** porque exige plano **Pro** para
repositório privado de organização, e as contas do projeto estão no plano **Hobby** — a
CLI não tem essa restrição.

São 4 workflows (um por app, por ambiente), todos chamando o mesmo workflow
reutilizável [`_deploy-vercel.yml`](../../.github/workflows/_deploy-vercel.yml), que
concentra a lógica de deploy:

| Workflow | Dispara em | Publica em |
|---|---|---|
| [`deploy-prototipo-frontoffice`](../../.github/workflows/deploy-prototipo-frontoffice.yml) | push na `prototipagem` alterando `prototype/frontOffice/**` | `frontoffice-conecta` |
| [`deploy-prototipo-backoffice`](../../.github/workflows/deploy-prototipo-backoffice.yml) | push na `prototipagem` alterando `prototype/backoffice/**` | `backoffice-conecta` |
| [`deploy-estavel-frontoffice`](../../.github/workflows/deploy-estavel-frontoffice.yml) | push na `main` alterando `prototype/frontOffice/**` | `frontoffice-conecta-estavel` |
| [`deploy-estavel-backoffice`](../../.github/workflows/deploy-estavel-backoffice.yml) | push na `main` alterando `prototype/backoffice/**` | `backoffice-conecta-estavel` |

### Como o custo de Actions é controlado

A cota da organização (plano Team, **3.000 min/mês**) foi atingida em jul/2026, então o
consumo é parte do desenho:

- **Um workflow por app, com filtro de `paths` próprio.** O GitHub avalia o filtro antes
  de alocar runner: se você mexeu só no front-office, o job do backoffice **não roda** e
  não custa nada. O workflow anterior buildava sempre os dois apps.
- **`concurrency` com `cancel-in-progress`** no protótipo: numa sequência de pushes
  rápidos, os builds já superados são cancelados em vez de rodarem até o fim. No estável
  é o oposto (`false`), porque cada promoção deve concluir.
- **Cache do npm** entre execuções, encurtando o install que o `vercel build` faz.

### Outros detalhes

- Os `vercel.json` de cada app têm o **rewrite de SPA** (`/(.*) → /index.html`), sem o
  qual dar refresh ou abrir um link direto numa rota retorna 404.
- Os ambientes ficam em **contas Vercel separadas**, então quem mexe no protótipo não
  alcança o estável.
- Cada ambiente tem um **GitHub Environment** (`prototipo` e `estavel`) que restringe de
  qual branch o deploy pode sair e escopa os segredos: o token do estável não é visível
  para o workflow do protótipo.
- Os identificadores do Vercel (`vercel_org_id`, `vercel_project_id`) ficam explícitos nos
  workflows — não são segredos. Só os **tokens** são secrets (`VERCEL_TOKEN` e
  `VERCEL_TOKEN_ESTAVEL`).

## 5. Regras da `main`

- Sem push direto: entrada só por Pull Request.
- **2 aprovações** obrigatórias.
- Quem faz prototipagem trabalha na branch `prototipagem`, não na `main`.
