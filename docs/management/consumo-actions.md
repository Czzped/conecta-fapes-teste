# Consumo de GitHub Actions: diagnóstico e plano de redução

Levantamento de **julho/2026**, feito depois que os workflows da organização pararam de
executar por esgotamento da cota.

## Resumo executivo

A organização consumiu **3.007 minutos** contra os **3.000 incluídos** no plano Team. A
partir do momento em que o teto foi atingido, os jobs passaram a falhar sem executar
(0 steps) — inclusive workflows que nada tinham a ver com a causa do consumo.

Três conclusões que orientam o plano:

1. **Um único workflow, replicado em 6 repositórios, respondia por ~30% de toda a cota** —
   e não fazia nada de pesado. Já foi corrigido.
2. **A organização já tem runners self-hosted que não custam minuto**, e vários jobs pesados
   continuam rodando em runner pago por inércia, não por necessidade. É o maior ganho
   disponível.
3. **O repositório `otto` já resolveu isso sozinho** no meio de julho, migrando para
   self-hosted. Serve de referência: o consumo faturável dele caiu a praticamente zero.

Somando o que já foi feito e o que este documento propõe, a expectativa é sair de 3.007
para a **faixa de 800–1.000 min/mês** — folga confortável dentro da franquia.

## Como os números foram medidos

O painel de faturamento dá o total por repositório, mas não por workflow. Para chegar ao
detalhe, somei a duração de cada job (`started_at` → `completed_at`) com **arredondamento
para cima por minuto**, que é o modelo de cobrança do GitHub, e classifiquei por tipo de
runner.

Ressalvas que valem para ler as tabelas:

- **Job em runner self-hosted não é faturado.** Somar tudo sem separar infla o número: no
  `otto`, a soma bruta dava 1.266 min, mas apenas **364** eram faturáveis.
- **Runner não-Linux custa mais**: Windows conta ×2 e macOS ×10 os minutos de parede.
- **`0 steps` não é defeito do workflow**, é bloqueio de cota. Confundir os dois leva a
  "consertar" workflow que está saudável.
- Para `edite-project` a medição (812 min) ficou acima do faturado (451 min). A explicação
  provável é que o faturamento parou no teto da cota, enquanto a execução continuou sendo
  registrada. Onde há divergência, o valor faturado é o que vale para a cota.

Método validado no `conectafapes-project`: estimativa de 324 min contra 321 faturados.

## Panorama por repositório (julho/2026)

| Minutos | % | Repositório | Situação |
|---|---|---|---|
| 500 | 17% | `leds-agentes-Oraculo` | **alvo principal** |
| 451 | 15% | `edite-project` | **alvo principal** |
| 372 | 12% | `leds-conectafapes-otto` | já resolvido (migrou no mês) |
| 321 | 11% | `conectafapes-project` | otimizado |
| 266 | 9% | `leds-conectafapes-backend-admin` | `autoupdate` corrigido |
| 247 | 8% | `leds-conectafapes-frontend-backoffice` | `autoupdate` corrigido |
| 237 | 8% | `leds-conectafapes-frontoffice-backend` | `autoupdate` corrigido |
| 151 | 5% | `leds-conectafapes-frontoffice-frontend` | `autoupdate` corrigido |
| 87 | 3% | `leds-conectafapes-prestacao-de-contas` | `autoupdate` corrigido |
| 38 | 1% | `leds-conectafapes-backend-pagamento-bolsistas` | `autoupdate` corrigido |
| ~337 | 11% | outros 15 repositórios | sem concentração relevante |

## A causa de ~30% da cota: o workflow `autoupdate`

O `autoupdate` (atualiza a branch de um PR quando a base recebe commits) estava declarado
sem filtro de branch:

```yaml
on:
  push: {}          # qualquer push, em qualquer branch
```

Com isso ele executava a cada push de **qualquer** branch de feature, quando só precisa
reagir a push nas branches **base**. Em julho:

| Repositório | Execuções |
|---|---|
| `backend-admin` | 261 |
| `frontend-backoffice` | 224 |
| `frontoffice-frontend` | 151 |
| `frontoffice-backend` | 140 |
| `prestacao-de-contas` | 92 |
| `backend-pagamento-bolsistas` | 40 |
| **total** | **908 execuções ≈ 908 min** |

**Corrigido** nos 6 repositórios, restringindo o gatilho:

```yaml
on:
  push:
    branches: [develop, main, release/**]   # `master` no prestacao-de-contas
```

Expectativa: de ~908 para ~100–150 execuções/mês (**economia de ~750 min**).

## O padrão que explica o resto: runner pago × self-hosted

A organização mantém runners self-hosted (grupo `default`, labels
`[self-hosted, linux, x64]`) que **não consomem cota**. Eles já rodam trabalho pesado com
sucesso — o CI do `backend-admin` faz `docker build` e `docker/build-push-action` ali.

O problema é que a escolha do runner variou por repositório sem critério claro. O caso do
`backend-admin` ilustra bem a inversão: todo o CI pesado rodava **grátis** em self-hosted
(~840 min), enquanto o `autoupdate`, de ~1 minuto, era o único no runner pago — e por isso
respondia por 95% do consumo faturável do repositório.

### Armadilha importante, verificada na prática

**`docker build` funciona nos runners self-hosted. Ação Docker (`uses: docker://...`) não.**

Os runners rodam dentro de container e falam com o Docker do host pelo socket montado.
Nesse arranjo, os caminhos que o runner passa ao daemon não resolvem, os volumes chegam
vazios e a ação falha com:

```
ENOENT: no such file or directory, open '/github/workflow/event.json'
```

Isso foi testado no `autoupdate` do `backend-admin` (PR #479) e revertido (PR #480). Antes
de migrar um workflow, verifique se ele usa ação Docker.

## Alvos com ação concreta

### 1. `leds-agentes-Oraculo` — 442 min (89% do repo)

O workflow **Build and Push to GHCR** roda **3 jobs** (backend, airflow, frontend), todos
em `ubuntu-latest`, cada um fazendo `docker/build-push-action`. Dispara em push para `main`
e `develop` **e** em PR para as duas.

Três ações, em ordem de retorno:

| Ação | Ganho estimado | Risco |
|---|---|---|
| Mover os 3 jobs para `[self-hosted, linux, x64]` | ~442 min → **0 faturável** | Baixo: é `docker build`, não ação Docker. Padrão já usado no `backend-admin` e no `otto` |
| Adicionar cache do buildx (`cache-from`/`cache-to`) — hoje **não há cache**, todo build começa do zero | 30–50% do tempo de build | Baixo |
| Filtro de `paths` por imagem, para reconstruir só a imagem cujos arquivos mudaram | ~⅔ dos jobs | Médio: exige mapear as pastas de cada imagem |

O cache e o filtro de `paths` valem mesmo depois de migrar para self-hosted: encurtam o
tempo de espera do time e liberam o runner para outros jobs.

### 2. `edite-project` — 451 min faturados (97% do repo)

O workflow **Weekly Project & Developer Messages** roda por `schedule` (segundas, 8h) com
3 jobs Python de **~65 minutos cada** — 4 execuções no mês consumiram quase 800 min de
tempo de máquina. Não é excesso de gatilho: é custo por execução.

| Ação | Ganho estimado | Observação |
|---|---|---|
| Mover para `[self-hosted, linux, x64]` | ~451 min → **0 faturável** | É Python puro, sem ação Docker. Confirmar que o runner atende o `setup-python` |
| Definir `timeout-minutes` nos 3 jobs | proteção | O padrão do GitHub é **6 horas**: um script travado queima 360 min sozinho |
| Revisar por que cada job leva ~65 min | alto, se houver serialização | Provavelmente chamadas externas em laço; paralelizar ou agrupar em lote resolveria |

### 3. `leds-conectafapes-otto` — nenhuma ação

Já migrado. A linha do tempo mostra a transição acontecendo dentro de julho:

| Semana | Runner |
|---|---|
| 27 | 129 jobs, **todos pagos** |
| 28 | 214 pagos + 64 self-hosted (transição) |
| 29 | 161 jobs, **100% self-hosted** |
| 30 | 193 jobs, **100% self-hosted** |

Os 372 min faturados vieram da primeira metade do mês. Daqui para frente o repositório
tende a zero, com **~900 min/mês de trabalho rodando sem custo**.

## Recomendações transversais

Checklist para qualquer workflow novo na organização:

- **Escolha o runner conscientemente.** Trabalho pesado e recorrente deve ir para
  self-hosted. Reserve runner pago para o que precisa de VM limpa e efêmera, ou para
  ação Docker (que não funciona nos self-hosted).
- **Todo job com `timeout-minutes`.** O padrão de 6 horas transforma qualquer travamento em
  360 minutos de cota.
- **Filtro de `paths` em monorepo.** O GitHub avalia o filtro antes de alocar runner: o job
  que não precisa rodar custa zero, em vez de custar um minuto para descobrir que não
  precisava.
- **`concurrency` com `cancel-in-progress: true`** em workflows de PR, para que pushes
  rápidos cancelem builds já superados. Em publicação para produção, o contrário
  (`false`), porque cada deploy deve concluir.
- **Cache de dependências e de build.** Sem cache, todo build parte do zero.
- **Gatilho de `push` sempre com `branches:`.** `push: {}` significa "todas as branches" e
  foi exatamente a causa dos 908 minutos.

Vale também **definir um limite de gasto** diferente de zero como margem de segurança. Hoje,
ao encostar no teto, tudo para — inclusive publicação de documentação e sincronizações que
não têm relação com o consumo. Minuto extra de Linux custa cerca de US$ 0,008.

## Consolidado

| Item | Minutos/mês | Estado |
|---|---|---|
| `autoupdate` em 6 repositórios | ~750 | ✅ corrigido |
| `otto` migrado para self-hosted | ~364 | ✅ resolvido pela equipe |
| `conectafapes-project`: deploy do protótipo por app | ~60 | ✅ corrigido |
| `conectafapes-project`: filtro no deploy de docs | ~65 | ✅ corrigido |
| **`Oraculo` para self-hosted + cache** | **~442** | ⬜ proposto |
| **`edite-project` para self-hosted + timeout** | **~451** | ⬜ proposto |
| **Total** | **~2.130** | de 3.007 consumidos |

Os dois itens propostos dependem de quem mantém esses repositórios: são mudanças de uma a
poucas linhas, mas em código de outros times, e a migração de runner precisa da confirmação
de que há capacidade disponível na infraestrutura.

## Como reproduzir a análise

Os dados vêm de duas fontes da API do GitHub:

```bash
# Total por repositório no mês (visão de faturamento)
gh api "/organizations/leds-conectafapes/settings/billing/usage?year=2026&month=7"

# Execuções e jobs de um repositório, para detalhar por workflow
gh api "/repos/leds-conectafapes/<repo>/actions/runs?created=2026-07-01..2026-07-31"
gh api "/repos/leds-conectafapes/<repo>/actions/runs/<run_id>/jobs"
```

Ao agregar, some por job (não por execução), arredonde para cima por minuto, **descarte
jobs em self-hosted** e aplique ×2 para Windows e ×10 para macOS.
