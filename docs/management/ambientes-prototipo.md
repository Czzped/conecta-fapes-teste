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

| Ambiente | Como publica | Por quê |
|---|---|---|
| **Protótipo** | Integração **nativa** do Vercel com o Git (push na `prototipagem`) | Publica dezenas de vezes por dia; fazer isso no GitHub Actions consumiria a cota da org (plano Team, 3.000 min/mês, já estourada em jul/2026) |
| **Estável** | **CLI do Vercel** no workflow [`deploy-estavel`](../../.github/workflows/deploy-estavel.yml) | Publica só em promoções aprovadas (raras), então o custo de Actions é pequeno. A CLI dispensa conectar o repositório, o que permite manter o estável numa conta Vercel separada em plano Hobby (a integração nativa exigiria plano Pro para repo privado de organização) |

Configuração dos projetos no Vercel:

| Projeto | Conta Vercel | Como publica | Root Directory |
|---|---|---|---|
| `frontoffice-conecta` | conta principal (paga) | nativo, Production Branch `prototipagem` | `prototype/frontOffice` |
| `backoffice-conecta` | conta principal (paga) | nativo, Production Branch `prototipagem` | `prototype/backoffice` |
| `frontoffice-conecta-estavel` | `fatasys-projects` (Hobby) | CLI, no merge para `main` | `prototype/frontOffice` |
| `backoffice-conecta-estavel` | `fatasys-projects` (Hobby) | CLI, no merge para `main` | `prototype/backoffice` |

Detalhes que fazem isso funcionar:
- No protótipo, o **Root Directory** garante que cada projeto só reconstrói quando a
  pasta dele muda, evitando builds desnecessários no monorepo. No estável, o mesmo
  papel é feito pelo filtro de `paths` do workflow.
- Os `vercel.json` de cada app têm o **rewrite de SPA** (`/(.*) → /index.html`), sem o
  qual dar refresh ou abrir um link direto numa rota retorna 404.
- Os ambientes ficam em **contas Vercel separadas**, então quem mexe no protótipo não
  alcança o estável.
- ⚠️ O Production Branch dos projetos de protótipo **precisa** ser `prototipagem`. Se
  ficar em `main`, o protótipo passa a publicar da `main` e os dois ambientes viram um só.

## 5. Regras da `main`

- Sem push direto: entrada só por Pull Request.
- **2 aprovações** obrigatórias.
- Quem faz prototipagem trabalha na branch `prototipagem`, não na `main`.
