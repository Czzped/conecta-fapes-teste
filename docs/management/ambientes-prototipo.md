# Lançamento no ambiente estável

Como uma tela sai da prototipagem e chega, aprovada, à equipe de desenvolvimento.

## 1. Por que existem dois ambientes

Antes havia **um só**: a prototipagem publicava a cada push na `main`, e as telas mudavam
embaixo de quem ainda estava implementando — sem aviso e sem etapa de aprovação.

Agora são dois, com propósitos distintos:

| Ambiente | Branch | Para que serve | URLs |
|---|---|---|---|
| **Protótipo** | `prototipagem` | Trabalho contínuo. Muda a toda hora, sem aprovação. | [frontoffice-conecta](https://frontoffice-conecta.vercel.app) · [backoffice-conecta](https://backoffice-conecta.vercel.app) |
| **Estável** | `main` | Referência de "pronto para desenvolvimento". Só muda com aprovação. | [frontoffice-conecta-estavel](https://frontoffice-conecta-estavel.vercel.app) · [backoffice-conecta-estavel](https://backoffice-conecta-estavel.vercel.app) |

> **Quem implementa olha o estável.** O protótipo serve para acompanhar o que está sendo
> desenhado agora — ele muda sem aviso, por definição.

## 2. Quem faz o quê

| Papel | Responsabilidade |
|---|---|
| **Prototipagem** | Trabalha na branch `prototipagem`. Quando uma tela fica pronta, abre o PR de promoção com a auditoria |
| **Quem aprova** (2 pessoas) | Avalia pelo card, confere no ambiente de protótipo e aprova no Pull Request |
| **Desenvolvimento** | Consome o card em *Pronto para desenvolvimento* e implementa olhando o **estável** |

## 3. O fluxo

```
prototipagem  ──(publica automático)──▶  PROTÓTIPO
      │
      │  abre PR de promoção  ──▶  CARD no Project 43 (In Validation)
      │                             · link do protótipo, para ver a alteração
      │                             · auditoria das mudanças
      │                             · Squad Design, sprint corrente
      │
      │  2 aprovações no PR  ──▶  merge
      ▼
    main  ──(publica automático)──▶  ESTÁVEL
                                    + CARD → "Pronto para desenvolvimento"

PR fechado sem merge  ──▶  CARD → "Desaprovado"
```

O **card é a peça central**: nasce quando a promoção é proposta e é dele que a equipe
parte para avaliar. Só chega em *Pronto para desenvolvimento* depois de aprovado e
mergeado.

## 4. Como promover uma tela

1. **Abra um Pull Request de `prototipagem` para `main`**, usando o template
   [`promocao-estavel`](../../.github/PULL_REQUEST_TEMPLATE/promocao-estavel.md)
   (acrescente `?template=promocao-estavel.md` na URL do PR).
2. **Coloque a `[FLAG]` no título** (`[FEAT]`, `[FIX]`, `[REFACTOR]`…), como em qualquer PR
   do projeto.
3. **Gere a auditoria e cole no corpo do PR.** Rode `/auditar-promocao` no Claude Code:
   ele lê o diff e descreve telas adicionadas, alteradas e removidas, além dos fluxos
   afetados. É o que permite revisar sem precisar ler código.
4. **Vincule a issue de planejamento**, se houver.
5. **Consiga 2 aprovações.** Este é o gate.

Ao **abrir** o PR, o card é criado automaticamente (seção 5). Ao **mergear**, o estável é
publicado e o card avança.

> **Mergear equivale a liberar.** Não existe uma segunda confirmação depois do merge: a
> publicação e a movimentação do card são automáticas. O motivo está na seção 6.

## 5. O card no Project 43

Criado pelo workflow [`promocao-project43`](../../.github/workflows/promocao-project43.yml)
no [Project 43](https://github.com/orgs/leds-conectafapes/projects/43), com o título
`[Promoção] …` e os campos:

| Campo | Valor |
|---|---|
| `Status` | **In Validation** enquanto aguarda aprovação |
| `Area` | Frontend |
| `Squad` | Design |
| `Sprint` | a iteração em andamento, calculada pelas datas do board |
| `Repositório` | repo de produto alvo — front-office → `leds-conectafapes-frontoffice-frontend`; backoffice → `leds-conectafapes-frontend-backoffice` |

No corpo: link do **ambiente de protótipo** (para ver a alteração) e a **auditoria**.
Um comentário no PR aponta para o card, e vice-versa.

### Ciclo de vida

| Evento no PR | Card |
|---|---|
| aberto / reaberto | criado em **In Validation** |
| aprovado e mergeado | **Pronto para desenvolvimento** + link do estável |
| fechado sem merge | **Desaprovado** |

Depois de *Pronto para desenvolvimento*, o card entra no fluxo normal do time: quem pega
move para *In Progress* — o que dispara a criação da branch no repositório de produto pela
automação em [`tools/project43-automation`](../../tools/project43-automation) — e segue até
*Done* conforme a implementação avança.

> O card representa "esta tela está pronta **para ser desenvolvida**". Ele não é *Done*
> quando a promoção é aprovada; é *Done* quando a tela existe no produto.

## 6. As regras da `main`

- **Sem push direto.** Entrada apenas por Pull Request.
- **2 aprovações obrigatórias.** O autor não pode aprovar o próprio PR, então são sempre
  duas outras pessoas com acesso de escrita.
- **Vale para administradores.** `enforce_admins` está ligado: ninguém burla, nem quem
  tem admin. Uma tentativa de merge sem as aprovações é recusada com
  `405: At least 2 approving reviews are required by reviewers with write access`.
- Sem force-push e sem deleção da branch.
- **Quem faz prototipagem trabalha na `prototipagem`**, não na `main`.

### Por que o gate fica no PR, e não no deploy

O desenho original previa aprovar a **publicação** (GitHub Environment com revisor
obrigatório). Isso não é possível aqui: em repositório **privado**, "required reviewers"
de Environment exige **GitHub Enterprise**, e o plano da organização é **Team**. O que o
Team oferece em Environment são segredos e política de branch — não aprovação.

Por isso o único ponto onde "2 pessoas" é tecnicamente imposto é o Pull Request. Em
emergência não há bypass: seria preciso desligar a proteção temporariamente.

## 7. Como o deploy funciona

Os dois ambientes publicam pela **CLI do Vercel**, dentro do GitHub Actions. A integração
nativa do Vercel com o Git **não é usada** porque exige plano **Pro** para repositório
privado de organização, e as contas do projeto estão no **Hobby** — a CLI não tem essa
restrição.

São 4 workflows (um por app, por ambiente), todos chamando o mesmo workflow reutilizável
[`_deploy-vercel.yml`](../../.github/workflows/_deploy-vercel.yml):

| Workflow | Dispara em | Publica em |
|---|---|---|
| [`deploy-prototipo-frontoffice`](../../.github/workflows/deploy-prototipo-frontoffice.yml) | push na `prototipagem` alterando `prototype/frontOffice/**` | `frontoffice-conecta` |
| [`deploy-prototipo-backoffice`](../../.github/workflows/deploy-prototipo-backoffice.yml) | push na `prototipagem` alterando `prototype/backoffice/**` | `backoffice-conecta` |
| [`deploy-estavel-frontoffice`](../../.github/workflows/deploy-estavel-frontoffice.yml) | push na `main` alterando `prototype/frontOffice/**` | `frontoffice-conecta-estavel` |
| [`deploy-estavel-backoffice`](../../.github/workflows/deploy-estavel-backoffice.yml) | push na `main` alterando `prototype/backoffice/**` | `backoffice-conecta-estavel` |

Todos rodam em **runner self-hosted**, que não consome a cota de Actions da organização
(esgotada em jul/2026 — ver [consumo-actions.md](consumo-actions.md)).

**Se os runners self-hosted ficarem indisponíveis**, criar a variável de organização
devolve tudo ao runner pago sem alterar código:

```
RUNNER_LABELS = ["ubuntu-latest"]
```

O valor é **JSON** — com colchetes e aspas; `ubuntu-latest` puro faz o `fromJSON` falhar.

### Detalhes que fazem isso funcionar

- **Filtro de `paths` por app.** O GitHub avalia o filtro antes de alocar runner: mexer só
  no front-office não custa nada no backoffice.
- **`concurrency`**: no protótipo, pushes em sequência cancelam builds superados; no
  estável é o contrário, cada publicação conclui.
- Os `vercel.json` têm o **rewrite de SPA** (`/(.*) → /index.html`). Sem ele, refresh ou
  link direto em qualquer rota retorna 404 — e os dois protótipos hoje navegam por URL.
- **Contas Vercel separadas** para protótipo e estável: quem mexe num não alcança o outro.
- Cada ambiente tem um **GitHub Environment** (`prototipo` e `estavel`) que restringe de
  qual branch o deploy pode sair e escopa os segredos.
- Os identificadores do Vercel ficam explícitos nos workflows — não são segredos. Só os
  **tokens** são secrets (`VERCEL_TOKEN` e `VERCEL_TOKEN_ESTAVEL`).
- ⚠️ O **Root Directory** dos projetos no Vercel deve ficar **vazio**: o workflow já entra
  na pasta do app antes de rodar a CLI. Preenchê-lo duplica o caminho e o build falha com
  `vite: not found`.

## 8. Armadilhas conhecidas

**"Publiquei na `prototipagem` e nada aconteceu."**
O workflow só dispara se o push alterar `prototype/<app>/**`. Mudanças em documentação ou
workflows não publicam nada — de propósito.

**"O deep-link dá 404."**
Falta o rewrite de SPA no `vercel.json` daquele app.

**"O card não foi criado."**
O gatilho exige que o PR altere `prototype/**`. PRs de infraestrutura não geram card, para
não poluir o board.

**"O job ficou em `queued` e não anda."**
Runner self-hosted ocupado. O campo `labels` do job na API mostra o que ele está pedindo —
útil para distinguir fila de label incompatível. Se persistir, use a chave `RUNNER_LABELS`.

**"O workflow falhou com 0 steps."**
Não é defeito do workflow: é bloqueio de cota de Actions. Ver
[consumo-actions.md](consumo-actions.md).

## 9. Referências

- [`promocao-estavel.md`](../../.github/PULL_REQUEST_TEMPLATE/promocao-estavel.md) — template do PR de promoção
- [`tools/promote-prototype/`](../../tools/promote-prototype) — script que sincroniza o card
- [consumo-actions.md](consumo-actions.md) — diagnóstico do consumo de GitHub Actions
- [Project 43](https://github.com/orgs/leds-conectafapes/projects/43) — board
