# Monitoramento e Observabilidade — M007 API Gateway

Dominio e regras: ver [README.md](README.md)

> **Modulo em stub.** O M007 ainda nao possui `contrato.md` (rotas, politicas de rate limiting, health check) nem `eventos-dominio.md`. Os sinais abaixo sao os **sinais-padrao de API Gateway** (RED por rota + saude de upstream + seguranca de borda), bem conhecidos para a camada de borda e **propostos** aqui. Nomes de rota, upstreams e thresholds especificos ficam **TODO** ate o `contrato.md` ser definido. Nao foram inventadas operacoes de negocio.

## Objetivo de Sustentacao

Garantir que o gateway de borda esteja disponivel e roteando trafego com latencia aceitavel para todos os modulos a jusante. A sustentacao precisa enxergar, em tempo real: taxa de requisicoes, erros (4xx/5xx) e latencia por rota; saude e latencia de cada upstream (modulo backend); rejeicoes por rate limit (429) e por autenticacao/autorizacao (401/403); e requisicoes em voo. O gateway e o ponto unico de falha da borda — qualquer degradacao aqui afeta todos os portais e BFFs a jusante.

## Eventos de Negocio Monitorados

> O M007 e infraestrutura de borda, nao tem eventos de dominio de negocio proprios. Os "eventos" monitorados sao sinais operacionais de borda (RED + seguranca). Eventos de negocio derivados de `eventos-dominio.md` ficam **TODO** ate definicao do contrato.

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| Pico de erros 5xx (gateway/upstream) | sinal-padrao gateway | counter m007_request_total{status_class="5xx"} | Sim | critical |
| Upstream indisponivel | sinal-padrao gateway | counter m007_upstream_request_total{status_class="5xx"} + m007_upstream_duration_seconds | Sim | critical |
| Latencia p99 acima do alvo | sinal-padrao gateway | histogram m007_request_duration_seconds | Sim | warning |
| Surto de rate limit (429) | sinal-padrao gateway | counter m007_rate_limit_rejected_total | Sim | warning |
| Surto de rejeicoes de auth (401/403) | sinal-padrao gateway | counter m007_auth_rejected_total | TODO (threshold pendente contrato) | warning |

## Metricas (Prometheus)

> Convencao: prefixo `m007_`, `snake_case`, unidade no sufixo, labels de baixa cardinalidade. `route` e sempre **template de baixa cardinalidade** (ex.: `/editais/{id}`), **nunca** o path bruto com ids. Nunca PII em label.

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m007_request_total | counter | route, method, status_class | - | requisicoes por rota+metodo+classe de status (RED: rate + errors) |
| m007_request_duration_seconds | histogram | route, method | s | latencia da requisicao no gateway (RED: duration) |
| m007_requests_in_flight | gauge | route | - | requisicoes em voo (concorrencia atual) |
| m007_upstream_request_total | counter | upstream, status_class | - | requisicoes encaminhadas por upstream (modulo backend) + classe de status |
| m007_upstream_duration_seconds | histogram | upstream | s | latencia de resposta do upstream (backend) |
| m007_rate_limit_rejected_total | counter | route | - | requisicoes rejeitadas por rate limit (429) |
| m007_auth_rejected_total | counter | route, reason | - | requisicoes rejeitadas por auth — reason `unauthenticated` (401) / `forbidden` (403) |

> Rotas (`route`), upstreams (`upstream`) e classes de erro especificas: **TODO** — derivar do `contrato.md` (rotas e politicas de rate limiting). `status_class` usa baixa cardinalidade (`2xx`/`3xx`/`4xx`/`5xx`), nunca codigo individual em alta cardinalidade salvo necessidade.

## Tracing (SigNoz / OpenTelemetry)

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m007.request | por requisicao recebida na borda | route (template), http.method, http.status_code, status_class |
| m007.ext.{modulo} | por chamada a upstream (modulo backend) | peer.service, http.status_code, upstream |
| m007.rate_limit | por rejeicao de rate limit | route, http.status_code=429 |
| m007.auth | por rejeicao de auth | route, http.status_code (401/403), reason |

> Gateway propaga contexto de trace (W3C traceparent) para o upstream — span filho `m007.ext.{modulo}` por modulo a jusante, viabilizando trace fim-a-fim BFF → Gateway → modulo no SigNoz. Lista de upstreams (`{modulo}`): **TODO** pendente `contrato.md`. Nunca PII em atributo de span.

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| disponibilidade do gateway (1 - taxa de 5xx do gateway sobre total) | 99,9% (alvo proposto — confirmar no contrato) | 30d |
| latencia p99 da requisicao no gateway abaixo do alvo | p99 < TODO ms (alvo pendente contrato) | 30d |

> KPI do README: disponibilidade do gateway, latencia media, incidentes de seguranca. Thresholds numericos: **TODO** ate `contrato.md`.

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Pico de 5xx no gateway | `sum(rate(m007_request_total{status_class="5xx"}[5m])) / sum(rate(m007_request_total[5m])) > 0.05` (threshold a confirmar) | critical | TODO runbook — investigar gateway e upstreams; verificar deploy recente |
| Upstream indisponivel | `sum by (upstream) (rate(m007_upstream_request_total{status_class="5xx"}[5m])) / sum by (upstream) (rate(m007_upstream_request_total[5m])) > 0.5` | critical | TODO runbook — identificar modulo backend afetado; acionar dono do upstream |
| Latencia p99 alta | `histogram_quantile(0.99, sum by (le,route) (rate(m007_request_duration_seconds_bucket[5m]))) > TODO` | warning | TODO runbook — checar latencia de upstream e saturacao do gateway |
| Surto de rate limit (429) | `sum(rate(m007_rate_limit_rejected_total[5m])) > TODO` | warning | TODO runbook — avaliar abuso vs. limite mal calibrado |

> Thresholds e runbooks: **TODO** — definir junto ao `contrato.md` e politicas de rate limiting. RED e o nucleo; expansao de alertas de seguranca (401/403) pendente contrato.

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED Gateway | rate/errors/duration por route+method+status_class | Grafana |
| Saude de Upstreams | latencia (m007_upstream_duration_seconds) e taxa de erro por upstream | Grafana |
| Seguranca de Borda | rejeicoes 429 (rate limit) e 401/403 (auth) por rota | Grafana |
| Concorrencia | m007_requests_in_flight por rota | Grafana |
| Trace explorer | spans m007.* (request, ext.{modulo}, rate_limit, auth) | SigNoz |
