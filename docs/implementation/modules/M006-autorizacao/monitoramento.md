# Monitoramento e Observabilidade — M006 Autorizacao

Dominio e regras: ver [README.md](README.md) | Eventos: ver eventos-dominio.md (TODO — pendente)

> **Modulo em stub.** O [README.md](README.md) ainda nao define contrato (politicas, delegacao, consultas de permissao) nem eventos de dominio. Este artefato cobre os **sinais padrao de autorizacao** (well-known) que um Policy Decision Point (PDP) sobre OpenFGA deve expor (RBAC/ABAC, [ADR-007](../../../architecture/decisions/ADR-007.md)). Sinais especificos do modulo (operacoes, eventos, delegacao) estao marcados **TODO** e devem ser confirmados quando `contrato.md` e `eventos-dominio.md` existirem.

## Objetivo de Sustentacao

Garantir que o motor de autorizacao (M006 / AuthRix sobre OpenFGA) responda decisoes de acesso (`allow`/`deny`) de forma correta, rapida e disponivel, pois ele esta no **hot path** de praticamente toda requisicao dos produtos consumidores (Portal Coordenador, Portal Admin, Importador). A sustentacao precisa enxergar: disponibilidade e latencia do OpenFGA, latencia das decisoes de autorizacao, taxa de negacoes (cuja anomalia pode indicar misconfiguration de politica ou tentativa de ataque) e escrita de tuplas/relacionamentos.

## Eventos de Negocio Monitorados

> Eventos de dominio especificos (ex.: delegacao concedida/revogada, politica alterada) **TODO** — pendente de `eventos-dominio.md`. A tabela abaixo lista os sinais padrao derivados da operacao de um PDP.

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| OpenFGA indisponivel | sinal padrao (integracao externa) | gauge `m006_authz_openfga_up` | Sim | critical |
| Pico de negacoes de acesso | sinal padrao (possivel misconfig/ataque) | counter `m006_authz_check_total{decision="deny"}` | Sim | warning |
| Latencia de decisao de autorizacao alta | sinal padrao (hot path) | histogram `m006_authz_check_duration_seconds` | Sim | warning |
| Escrita de tupla/relacionamento | sinal padrao (PAP) | counter `m006_authz_tuple_write_total{status}` | TODO | TODO |
| Delegacao concedida/revogada | TODO — eventos-dominio.md | TODO | TODO | TODO |

## Metricas (Prometheus)

> RED do PDP. Operacoes publicas especificas do `contrato.md` (ex.: `m006_consulta_permissao_total`) **TODO** — pendente de contrato.

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m006_authz_check_total | counter | decision (allow\|deny), status (ok\|error) | - | total de verificacoes de autorizacao por decisao |
| m006_authz_check_duration_seconds | histogram | - | s | latencia da decisao de autorizacao (p95/p99) |
| m006_authz_openfga_up | gauge | - | - | disponibilidade do OpenFGA (1=up, 0=down) |
| m006_authz_openfga_request_duration_seconds | histogram | operation (check\|write\|read) | s | latencia das chamadas ao OpenFGA por operacao |
| m006_authz_openfga_request_total | counter | operation, status (ok\|error) | - | chamadas ao OpenFGA por operacao e resultado |
| m006_authz_tuple_write_total | counter | status (ok\|error) | - | escrita de tuplas/relacionamentos (PAP) |
| m006_{operacao}_total | counter | status | - | TODO — operacoes do contrato.md |
| m006_{operacao}_duration_seconds | histogram | - | s | TODO — latencia de operacao do contrato.md |

## Tracing (SigNoz / OpenTelemetry)

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m006.AuthorizationCheck | por decisao de autorizacao (PDP) | decision, resource.type, action, modulo.origem |
| m006.ext.openfga | por chamada ao OpenFGA | peer.service, openfga.operation, openfga.store_id, http.status_code |
| m006.{Operacao} | por operacao publica do contrato | TODO — pendente de contrato.md |

> Nunca propagar dado pessoal (CPF, nome, email, id de usuario nominal) em atributo de span. Usar identificadores de tipo/recurso de baixa cardinalidade.

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| latencia da decisao de autorizacao (p99) | < 100 ms | 30d |
| disponibilidade do OpenFGA (PDP up) | >= 99,9% | 30d |
| taxa de chamadas ao OpenFGA sem erro | >= 99,9% | 30d |

> Limiares de latencia/disponibilidade sao propostos como baseline de hot path — confirmar metas com o time AuthRix quando o `contrato.md` for definido (**TODO**).

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| OpenFGA indisponivel | `m006_authz_openfga_up == 0` por 1m | critical | TODO — runbook AuthRix (PDP degradado bloqueia autorizacao em todos os produtos consumidores) |
| Pico de negacoes de acesso | `rate(m006_authz_check_total{decision="deny"}[5m])` acima do baseline (ex.: > 3x media movel) | warning | TODO — investigar misconfiguration de politica ou tentativa de ataque |
| Latencia de autorizacao alta | `histogram_quantile(0.99, rate(m006_authz_check_duration_seconds_bucket[5m])) > 0.1` por 10m | warning | TODO — autorizacao no hot path; investigar OpenFGA / rede |
| Erros ao OpenFGA | `rate(m006_authz_openfga_request_total{status="error"}[5m]) > 0` sustentado | warning | TODO — runbook integracao OpenFGA |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED Autorizacao | rate/errors/duration das decisoes (`m006_authz_check_*`) | Grafana |
| Decisoes allow vs deny | series `m006_authz_check_total` por `decision` | Grafana |
| Saude OpenFGA | `m006_authz_openfga_up`, latencia e erro por operacao | Grafana |
| Trace explorer | spans `m006.*` (foco em `m006.ext.openfga`) | SigNoz |
