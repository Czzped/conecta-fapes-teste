# Monitoramento e Observabilidade — M005 Autenticacao e Auditoria

Dominio e regras: ver [README.md](README.md) | Eventos: TODO (ver `eventos-dominio.md` quando definido)

> **Modulo STUB.** O M005 ainda nao possui `contrato.md` nem `eventos-dominio.md` (ver Status no README). Os sinais abaixo sao **padrao de autenticacao OIDC/SSO** (well-known signals para login, token, sessao, callback ao IdP e auditoria), **propostos** e sujeitos a revisao quando o contrato do modulo for definido. Itens especificos do dominio (operacoes do `contrato.md`, eventos de auditoria nomeados, regras de autorizacao granular) estao marcados como **TODO**.

## Objetivo de Sustentacao

Garantir que a autenticacao federada via [Acesso Cidadao](https://docs.acessocidadao.es.gov.br) (OpenID Connect / SSO) esteja disponivel e com latencia aceitavel, detectar indisponibilidade do IdP externo, identificar picos anomalos de falha de login (possivel brute force / credential stuffing) e assegurar que a trilha de auditoria de acesso esteja sendo gravada sem perda. Nenhum sinal pode expor dado pessoal (CPF, email, token, nome) em label de metrica ou atributo de span.

## Eventos de Negocio Monitorados

> Stub: eventos de dominio ainda nao catalogados. Eventos abaixo sao inferidos do fluxo OIDC padrao.

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| Login falho (credencial invalida / negado) | fluxo OIDC (padrao) | counter `m005_login_total{result="failure"}` | Sim | warning / critical (pico) |
| Login com sucesso | fluxo OIDC (padrao) | counter `m005_login_total{result="success"}` | Nao | - |
| Falha na validacao de token | fluxo OIDC (padrao) | counter `m005_token_validation_errors_total{reason}` | Sim | warning |
| Indisponibilidade do Acesso Cidadao (IdP) | integracao externa | counter `m005_acesso_cidadao_callback_total{result="error"}` | Sim | critical |
| Falha ao gravar log de auditoria | fluxo de auditoria (padrao) | counter `m005_audit_log_write_total{result="error"}` | Sim | critical |
| Eventos de auditoria especificos do dominio | TODO (`eventos-dominio.md`) | TODO | TODO | TODO |

## Metricas (Prometheus)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m005_login_total | counter | result (`success`/`failure`) | - | tentativas de login por resultado |
| m005_login_duration_seconds | histogram | result | s | latencia do fluxo de login fim-a-fim |
| m005_token_issued_total | counter | type (`access`/`refresh`/`id`) | - | tokens emitidos por tipo |
| m005_token_validation_total | counter | result (`valid`/`invalid`) | - | validacoes de token por resultado |
| m005_token_validation_errors_total | counter | reason (`expired`/`signature`/`audience`/`other`) | - | erros de validacao de token por motivo |
| m005_acesso_cidadao_callback_duration_seconds | histogram | result | s | latencia do callback SSO ao Acesso Cidadao |
| m005_acesso_cidadao_callback_total | counter | result (`success`/`error`) | - | callbacks ao IdP por resultado |
| m005_session_active_count | gauge | - | - | sessoes ativas no momento |
| m005_session_refresh_total | counter | result (`success`/`failure`) | - | renovacoes de sessao/refresh token |
| m005_audit_log_write_total | counter | result (`success`/`error`) | - | gravacoes de log de auditoria por resultado |
| m005_{operacao}_total | counter | result | - | TODO — RED por operacao do `contrato.md` |
| m005_{operacao}_duration_seconds | histogram | operacao | s | TODO — latencia por operacao do `contrato.md` |

## Tracing (SigNoz / OpenTelemetry)

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m005.Login | por fluxo de login OIDC | result, auth.method |
| m005.ValidateToken | por validacao de token | result, token.type, validation.reason |
| m005.ext.acesso_cidadao | por chamada/callback ao IdP externo | peer.service=`acesso_cidadao`, http.status_code, result |
| m005.RefreshSession | por renovacao de sessao/refresh | result |
| m005.WriteAuditLog | por gravacao de trilha de auditoria | result, audit.action |
| m005.{Operacao} | TODO — por operacao do `contrato.md` | TODO (nunca CPF/email/token) |

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| taxa de sucesso de autenticacao (`m005_login_total{result="success"}` / total, excluindo falhas de credencial do usuario) | 99% | 30d |
| latencia do login (p95 `m005_login_duration_seconds`) | < 2s | 30d |
| disponibilidade do callback ao Acesso Cidadao (`m005_acesso_cidadao_callback_total{result="success"}` / total) | 99,5% | 30d |
| TODO — SLO especifico de autorizacao granular / cobertura de auditoria | TODO | TODO |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Pico de falhas de login (possivel brute force) | `rate(m005_login_total{result="failure"}[5m]) > N` (warning) | warning | TODO runbook — investigar origem, avaliar rate-limit / bloqueio |
| Surto critico de falhas de login | `rate(m005_login_total{result="failure"}[5m]) > M` (M >> N) | critical | TODO runbook — acionar seguranca, possivel ataque coordenado |
| Acesso Cidadao (IdP) indisponivel | `rate(m005_acesso_cidadao_callback_total{result="error"}[5m]) / rate(m005_acesso_cidadao_callback_total[5m]) > 0.5` por 5m | critical | TODO runbook — validar status do Acesso Cidadao, abrir incidente |
| Falha ao gravar auditoria | `rate(m005_audit_log_write_total{result="error"}[5m]) > 0` | critical | TODO runbook — risco de perda de trilha, investigar storage de auditoria |
| Erros de validacao de token elevados | `rate(m005_token_validation_errors_total[5m]) > P` | warning | TODO runbook — checar rotacao de chaves / clock skew / config OIDC |
| SLO de disponibilidade do IdP em risco | burn rate do SLO `m005_acesso_cidadao_callback` | warning | TODO runbook |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED Autenticacao | rate/errors/duration de login e validacao de token | Grafana |
| Login success vs failure | taxa de sucesso/falha de login ao longo do tempo (deteccao de brute force) | Grafana |
| Saude Acesso Cidadao | latencia e taxa de erro do callback ao IdP externo | Grafana |
| Sessoes e tokens | sessoes ativas, emissao de token, refresh | Grafana |
| Auditoria | taxa de gravacao e falha do log de auditoria | Grafana |
| Trace explorer | spans `m005.*` (filtro por `m005.ext.acesso_cidadao`) | SigNoz |
