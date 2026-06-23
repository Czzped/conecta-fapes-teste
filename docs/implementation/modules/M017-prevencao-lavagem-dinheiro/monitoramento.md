# Monitoramento e Observabilidade — M017 Prevencao a Lavagem de Dinheiro (PLD)

Dominio e regras: ver [README.md](README.md) | Eventos: ver [eventos-dominio.md](eventos-dominio.md)

## Objetivo de Sustentacao

Garantir que os controles regulatorios de PLD operem sem lacunas: que o monitoramento diario execute todo dia e consiga consultar as listas restritivas, que nenhum alerta gerado passe do prazo legal de 48h sem analise, que os reportes ao COAF sejam gerados dentro do prazo legal e que bloqueios preventivos sejam aplicados de forma confiavel. O risco aqui e regulatorio e juridico-institucional, nao apenas operacional: uma falha silenciosa (job que nao roda, alerta esquecido, lista indisponivel) expoe a agencia de fomento a sancao. A sustentacao precisa enxergar o backlog de alertas em risco de prazo, a saude do job diario e a disponibilidade das integracoes externas (listas restritivas / COAF).

## Eventos de Negocio Monitorados

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| PLD_SUSPEITA_DETECTADA | [eventos-dominio.md](eventos-dominio.md) | counter `m017_alertas_pld_gerados_total` | Sim | warning |
| PLD_PRAZO_LEGAL_VENCIDO | [eventos-dominio.md](eventos-dominio.md) | counter `m017_prazo_legal_vencido_total` + gauge `m017_alertas_prazo_legal_vencido_atual` | Sim | critical |
| Lista restritiva indisponivel (ExecutarMonitoramentoDiarioPLD) | [contrato.md](contrato.md) RN02 | counter `m017_ext_lista_restritiva_total{status="error"}` | Sim | critical |
| Job de monitoramento diario nao executado | [contrato.md](contrato.md) RN02 | gauge `m017_job_monitoramento_diario_last_success_timestamp_seconds` | Sim | critical |
| Reporte COAF nao gerado dentro do prazo legal (RN04) | [contrato.md](contrato.md) RN04 | gauge `m017_reportes_coaf_prazo_legal_vencido_atual` | Sim | critical |
| Bloqueio preventivo aplicado (RN05) | [contrato.md](contrato.md) RN05, RI1 | counter `m017_decidir_bloqueio_preventivo_de_pagamento_total{status="success"}` | Nao | - |

## Metricas (Prometheus)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m017_executar_verificacao_kyc_total | counter | status | - | execucoes de verificacao KYC por resultado |
| m017_executar_verificacao_kyc_duration_seconds | histogram | - | s | latencia da verificacao KYC |
| m017_executar_monitoramento_diario_pld_total | counter | status | - | execucoes do job de monitoramento diario PLD |
| m017_executar_monitoramento_diario_pld_duration_seconds | histogram | - | s | duracao do job de monitoramento diario PLD |
| m017_registrar_analise_de_alerta_pld_total | counter | status | - | analises de alerta registradas por resultado |
| m017_registrar_analise_de_alerta_pld_duration_seconds | histogram | - | s | latencia do registro de analise de alerta |
| m017_decidir_bloqueio_preventivo_de_pagamento_total | counter | status | - | decisoes de bloqueio/desbloqueio por resultado |
| m017_decidir_bloqueio_preventivo_de_pagamento_duration_seconds | histogram | - | s | latencia da decisao de bloqueio preventivo |
| m017_gerar_reporte_coaf_total | counter | status | - | reportes COAF gerados por resultado |
| m017_gerar_reporte_coaf_duration_seconds | histogram | - | s | latencia da geracao de reporte COAF |
| m017_consultar_dashboard_pld_total | counter | status | - | consultas ao dashboard PLD por resultado |
| m017_consultar_dashboard_pld_duration_seconds | histogram | - | s | latencia da consulta ao dashboard PLD |
| m017_alertas_pld_gerados_total | counter | tipo_alerta | - | alertas PLD gerados (PLD_SUSPEITA_DETECTADA) |
| m017_prazo_legal_vencido_total | counter | - | - | ocorrencias de prazo legal vencido (PLD_PRAZO_LEGAL_VENCIDO) |
| m017_alertas_pld_abertos_atual | gauge | - | - | alertas PLD em aberto aguardando analise |
| m017_alertas_pendentes_analise_48h_atual | gauge | - | - | alertas pendentes de analise dentro da janela de 48h (RN03) |
| m017_alertas_prazo_legal_vencido_atual | gauge | - | - | alertas que estouraram as 48h sem analise (RN03) |
| m017_bloqueios_preventivos_ativos_atual | gauge | - | - | bloqueios preventivos de pagamento atualmente ativos (RN05, RI1) |
| m017_reportes_coaf_prazo_legal_vencido_atual | gauge | - | - | reportes COAF pendentes alem do prazo legal (RN04) |
| m017_ext_lista_restritiva_total | counter | status | - | consultas a listas restritivas por resultado |
| m017_ext_lista_restritiva_duration_seconds | histogram | - | s | latencia das consultas a listas restritivas |
| m017_ext_coaf_total | counter | status | - | submissoes de reporte ao COAF por resultado |
| m017_ext_coaf_duration_seconds | histogram | - | s | latencia das submissoes ao COAF |
| m017_job_monitoramento_diario_last_success_timestamp_seconds | gauge | - | s | timestamp da ultima execucao bem-sucedida do job diario |

## Tracing (SigNoz / OpenTelemetry)

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m017.ExecutarVerificacaoKYC | por execucao da operacao | kyc.codigo, kyc.resultado, contexto |
| m017.ExecutarMonitoramentoDiarioPLD | por execucao do job diario | data_referencia, alertas_gerados, consultas_executadas |
| m017.RegistrarAnaliseDeAlertaPLD | por analise de alerta | alerta.codigo, confirmado |
| m017.DecidirBloqueioPreventivoDePagamento | por decisao de bloqueio | alerta.codigo, bloqueio.codigo, bloquear |
| m017.GerarReporteCOAF | por geracao de reporte | alerta.codigo, reporte.codigo |
| m017.ConsultarDashboardPLD | por consulta ao dashboard | periodo, estado_alerta, tipo_alerta |
| m017.ext.lista_restritiva | por consulta a lista restritiva | peer.service, http.status_code, resultado |
| m017.ext.coaf | por submissao ao COAF | peer.service, http.status_code, reporte.codigo |

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| Taxa de alertas analisados dentro do prazo legal de 48h (RN03) | 100% | 30d |
| Taxa de execucao bem-sucedida do job de monitoramento diario PLD (RN02) | 99,5% | 30d |
| Taxa de reportes COAF gerados dentro do prazo legal (RN04) | 100% | 30d |
| Taxa de sucesso das consultas a listas restritivas | 99% | 30d |
| Latencia p95 da consulta ao dashboard PLD (ConsultarDashboardPLD) | < 2s | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Prazo legal de analise vencido | `m017_alertas_prazo_legal_vencido_atual > 0` | critical | Escalar imediatamente ao oficial de compliance; alerta ultrapassou a janela legal de 48h (RN03). Runbook: TODO |
| Reporte COAF fora do prazo legal | `m017_reportes_coaf_prazo_legal_vencido_atual > 0` | critical | Acionar compliance/diretoria para gerar reporte ao COAF imediatamente (RN04). Runbook: TODO |
| Job de monitoramento diario nao executou | `time() - m017_job_monitoramento_diario_last_success_timestamp_seconds > 86400` | critical | Verificar scheduler/Hangfire e reexecutar o monitoramento diario; risco de descumprimento de RN02. Runbook: TODO |
| Lista restritiva indisponivel | `increase(m017_ext_lista_restritiva_total{status="error"}[1h]) > 0` | critical | Verificar disponibilidade da integracao de listas restritivas e reprocessar consultas pendentes. Runbook: TODO |
| Falha de submissao ao COAF | `increase(m017_ext_coaf_total{status="error"}[1h]) > 0` | critical | Verificar conectividade com o COAF e reenfileirar reporte; risco regulatorio. Runbook: TODO |
| Backlog de alertas em risco de prazo | `m017_alertas_pendentes_analise_48h_atual > 0 and on() (hora aproximando das 48h)` | warning | Notificar oficial de compliance sobre alertas proximos do vencimento das 48h. Runbook: TODO |
| Falha recorrente do job de monitoramento diario | `increase(m017_executar_monitoramento_diario_pld_total{status="error"}[24h]) > 0` | critical | Investigar causa da falha do job diario e garantir reprocessamento da janela (RN02). Runbook: TODO |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M017 | rate/errors/duration por operacao do contrato | Grafana |
| Backlog de alertas PLD | alertas abertos, pendentes de analise <48h, prazo legal vencido (gauges) | Grafana |
| Bloqueios e reportes | bloqueios preventivos ativos, reportes COAF e reportes fora do prazo | Grafana |
| Saude do job diario | duracao, sucesso/falha e ultimo sucesso do monitoramento diario PLD | Grafana |
| Integracoes externas | latencia e taxa de erro de listas restritivas e COAF por dependencia | Grafana |
| Trace explorer | spans m017.* fim-a-fim | SigNoz |
