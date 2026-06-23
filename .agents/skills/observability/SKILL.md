---
name: observability
description: Define o que cada modulo do Conecta FAPES deve expor para observabilidade e monitoramento operacional (sustentacao) — quais eventos de negocio e variaveis monitorar em SigNoz, Prometheus e Grafana, quais metricas e SLIs/SLOs publicar, quais alertas configurar e quais tracing/spans instrumentar no codigo. Use ao criar ou revisar a documentacao de um modulo (artefato padrao monitoramento.md), ao definir o contrato de telemetria de um bounded context, ou ao traduzir eventos de dominio e jobs em sinais operacionais. Complementa as skills ddd e a documentacao de modulo.
---

# Observabilidade e Monitoramento de Modulo

Use esta skill quando a tarefa envolver **o que a equipe de sustentacao precisa enxergar** de um modulo em producao: sinais de saude, eventos criticos de negocio, latencia, erros, filas e integracoes externas.

Esta skill complementa `.agents/skills/ddd/SKILL.md` (define o que o modulo e) e `.agents/product-owner/documentation-module.md` (workflow de artefatos). Aqui voce decide **quais sinais** o modulo emite e **como** a sustentacao os observa.

> Divisao de responsabilidade: **esta skill define O QUE monitorar** (nivel PO/spec → artefato `monitoramento.md`). Para **COMO implementar** (configurar Prometheus/Grafana, escrever alertas, instrumentar spans/metricas OTel no codigo, load testing), usar a skill externa `monitoring-expert` (ver [SKILLS.md](../../SKILLS.md)).

Todo modulo deve ter um artefato padrao **`monitoramento.md`** co-localizado com os demais artefatos do modulo. Sem esse arquivo, o modulo nao esta pronto para producao.

## Stack de Observabilidade do Conecta FAPES

| Pilar | Ferramenta | Origem do sinal |
|-------|-----------|-----------------|
| Traces (distributed tracing) | **SigNoz** (OpenTelemetry-native) | `ActivitySource` (.NET) instrumentado no codigo + auto-instrumentacao de ASP.NET Core, EF Core, HttpClient |
| Metricas | **Prometheus** (scrape `/metrics`) | `Meter` (.NET OTel) ou exporter Prometheus; counters, gauges, histograms |
| Dashboards e alertas | **Grafana** | consulta Prometheus + SigNoz; paineis e regras de alerta |
| Logs estruturados | SigNoz / stack de logs | logging estruturado (ADR-001) correlacionado por `trace_id`/`span_id` |

Premissas:
- Logs sao **estruturados** e carregam `trace_id` para correlacionar com traces no SigNoz.
- Toda metrica segue convencao de nomenclatura Prometheus: `snake_case`, sufixo de unidade (`_seconds`, `_bytes`, `_total` para counters).
- Jobs recorrentes (Hangfire, ADR-009) sao cidadaos de primeira classe de monitoramento — duracao, sucesso/falha, atraso de agendamento.
- Integracoes externas (Banestes, E-Docs, Acesso Cidadao, SERPRO, Lattes, SIGFAPES) sempre tem metrica de latencia + taxa de erro por dependencia.

## Core Outcome

Ao final, o modulo deve ter um `monitoramento.md` que responde, sem ambiguidade:

1. Quais **eventos de negocio** sao criticos e devem gerar metrica/alerta (derivados de `eventos-dominio.md` e do catalogo M020).
2. Quais **metricas** (com nome, tipo, labels e unidade) o modulo publica no Prometheus.
3. Quais **SLIs e SLOs** definem a saude da capacidade do modulo.
4. Quais **tracing/spans** instrumentar no codigo (operacoes do `contrato.md`, jobs, integracoes externas).
5. Quais **alertas** a sustentacao configura no Grafana (condicao, severidade, acao).
6. Quais **paineis de dashboard** representam o modulo.

## O que definir — checklist por modulo

### 1. Eventos de negocio a monitorar

Partir de `eventos-dominio.md` (e do [catalogo M020](../../../docs/implementation/modules/M020-comunicacao/notificacoes/catalogo-eventos.md)). Para cada evento critico decidir: gera metrica? gera alerta? Exemplos de eventos que tipicamente viram sinal:

- transicoes de estado relevantes (ex.: `PAGAMENTO_FALHA`, `BOLSA_NAO_IMPLEMENTADA`) → counter + alerta;
- prazos estourados (ex.: lembretes `T-0`, reposicao atrasada) → counter + alerta;
- falha de integracao externa → counter por dependencia + alerta.

Regra: nem todo evento de dominio vira metrica. Monitorar o que tem **impacto operacional ou financeiro** se falhar ou atrasar.

### 2. Metricas (Prometheus)

Definir por modulo, no minimo, as RED metrics para cada operacao publica do `contrato.md`:

- **Rate** — `{modulo}_{operacao}_total` (counter, label `status`)
- **Errors** — derivado do label `status="error"` no counter acima
- **Duration** — `{modulo}_{operacao}_duration_seconds` (histogram)

E metricas de dominio especificas (gauges de negocio), ex.:
- `m004_folha_pagamento_valor_total_brl` (gauge)
- `m014_prestacoes_pendentes_total` (gauge)
- `m020_notificacoes_falha_total` (counter)
- jobs: `{modulo}_job_{nome}_duration_seconds`, `{modulo}_job_{nome}_last_success_timestamp_seconds`

Convencao: prefixo `m0XX_`, `snake_case`, unidade no sufixo, labels de baixa cardinalidade (nunca CPF, id de entidade, email em label).

### 3. Tracing / spans no codigo (OpenTelemetry → SigNoz)

Definir quais operacoes instrumentar com `ActivitySource`:

- **um span por operacao publica** do `contrato.md` (command/query/job) — nome `m0XX.{Operacao}`;
- **span filho por chamada a integracao externa** — nome `m0XX.ext.{dependencia}` com atributos `peer.service`, `http.status_code`, resultado de negocio;
- **span por job** Hangfire (inicio, duracao, resultado);
- atributos de negocio uteis e **nao sensiveis** (ex.: `edital.id`, `bolsa.codigo`, `modulo.origem`) — nunca dado pessoal (CPF, nome, email) em atributo de span.

Propagar contexto de trace entre BFF → Gateway → modulo → integracao externa, para trace fim-a-fim no SigNoz.

### 4. SLIs / SLOs

Para a capacidade central do modulo definir SLI (o que se mede) e SLO (meta), ex.:
- M004: "99% das remessas de pagamento processadas sem erro em < 5 min" (SLI = taxa de sucesso da remessa; SLO = 99%).
- M020: "99,5% das notificacoes mandatorias entregues em ate 3 tentativas".

### 5. Alertas (Grafana)

Para cada SLO e evento critico, definir regra: condicao, janela, severidade (`critical`/`warning`), e acao da sustentacao (runbook). Alertas mandatorios cobrem: falha de pagamento, falha de integracao externa, job nao executado no horario, fila de notificacao crescente, SLO em risco.

### 6. Dashboards

Listar os paineis do modulo (Grafana/SigNoz): RED por operacao, gauges de negocio, saude de jobs, latencia/erro por integracao externa, trace explorer filtrado por `m0XX`.

## Artefato padrao: `monitoramento.md`

Criar `/docs/implementation/modules/{M00x-name}/monitoramento.md` com este template:

```markdown
# Monitoramento e Observabilidade — M00x [Nome]

Dominio e regras: ver [README.md](README.md) | Eventos: ver [eventos-dominio.md](eventos-dominio.md)

## Objetivo de Sustentacao

[O que a equipe de sustentacao precisa garantir deste modulo em producao.]

## Eventos de Negocio Monitorados

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| PAGAMENTO_FALHA | eventos-dominio.md | counter m004_pagamento_total{status="error"} | Sim | critical |

## Metricas (Prometheus)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m00x_{operacao}_total | counter | status | - | chamadas por operacao |
| m00x_{operacao}_duration_seconds | histogram | operacao | s | latencia |
| m00x_{dominio}_... | gauge | ... | ... | metrica de negocio |

## Tracing (SigNoz / OpenTelemetry)

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m00x.{Operacao} | por operacao do contrato | edital.id, bolsa.codigo |
| m00x.ext.{dependencia} | por chamada externa | peer.service, http.status_code |
| m00x.job.{nome} | por execucao de job | resultado, itens_processados |

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| taxa de sucesso de [operacao] | 99% | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| [nome] | [expr PromQL] | critical | [link runbook] |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED [modulo] | rate/errors/duration por operacao | Grafana |
| Trace explorer | spans m00x.* | SigNoz |
```

## Rules / Anti-Patterns (NAO FAZER)

- **NAO** colocar dado pessoal (CPF, nome, email) em label de metrica ou atributo de span — alta cardinalidade + violacao de privacidade.
- **NAO** monitorar todo evento de dominio — so o que tem impacto operacional/financeiro.
- **NAO** duplicar a definicao do evento: `monitoramento.md` referencia `eventos-dominio.md`, nao redefine o evento.
- **NAO** inventar metrica sem unidade ou sem convencao de nome Prometheus.
- **NAO** definir alerta sem acao/runbook associado — alerta sem resposta vira ruido.
- **NAO** definir SLO sem SLI mensuravel correspondente.
- **NAO** deixar integracao externa sem metrica de latencia e taxa de erro por dependencia.
```
