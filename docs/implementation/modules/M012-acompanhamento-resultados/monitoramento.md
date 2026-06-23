# Monitoramento e Observabilidade — M012 Acompanhamento e Resultados

Dominio e regras: ver [README.md](README.md) | Eventos: ver [eventos-dominio.md](eventos-dominio.md)

## Objetivo de Sustentacao

A sustentacao precisa garantir que o ciclo de acompanhamento pos-contratacao permaneca confiavel: dashboards consolidados disponiveis por perfil (Coordenador, Area Tecnica, SECONT), relatorios tecnicos submetidos e analisados dentro do prazo, e o fluxo de contestacao e solicitacao de alteracao funcionando sem perda de prazos regulatorios (contestacao em 15 dias corridos, RN03/RN08). Os sinais de saude devem evidenciar acumulo de relatorios pendentes de analise, contestacoes abertas sem decisao final e indisponibilidade de consolidacao de dashboard, alem da saude da integracao com M003 (Projeto/Edital) e M020 (notificacoes de prazo e resultado).

## Eventos de Negocio Monitorados

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| RELATORIO_REPROVADO | [eventos-dominio.md](eventos-dominio.md) | counter `m012_parecer_relatorio_total{tipo_parecer="reprovado"}` | Nao | - |
| RELATORIO_APROVADO | [eventos-dominio.md](eventos-dominio.md) | counter `m012_parecer_relatorio_total{tipo_parecer="aprovado"}` | Nao | - |
| CONTESTACAO_RECEBIDA | [eventos-dominio.md](eventos-dominio.md) | counter `m012_contestacao_relatorio_total{status="ok"}` + gauge `m012_contestacoes_abertas` | Sim | warning |

## Metricas (Prometheus)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m012_consultar_dashboard_acompanhamento_total | counter | status | - | chamadas a ConsultarDashboardAcompanhamento por status |
| m012_consultar_dashboard_acompanhamento_duration_seconds | histogram | operacao | s | latencia de ConsultarDashboardAcompanhamento |
| m012_submeter_relatorio_tecnico_total | counter | status | - | chamadas a SubmeterRelatorioTecnico por status |
| m012_submeter_relatorio_tecnico_duration_seconds | histogram | operacao | s | latencia de SubmeterRelatorioTecnico |
| m012_emitir_parecer_relatorio_total | counter | status | - | chamadas a EmitirParecerRelatorio por status |
| m012_emitir_parecer_relatorio_duration_seconds | histogram | operacao | s | latencia de EmitirParecerRelatorio |
| m012_parecer_relatorio_total | counter | tipo_parecer | - | pareceres emitidos por tipo (aprovado/reprovado) |
| m012_registrar_contestacao_relatorio_total | counter | status | - | chamadas a RegistrarContestacaoRelatorio por status |
| m012_registrar_contestacao_relatorio_duration_seconds | histogram | operacao | s | latencia de RegistrarContestacaoRelatorio |
| m012_contestacao_relatorio_total | counter | status | - | contestacoes recebidas (CONTESTACAO_RECEBIDA) |
| m012_registrar_solicitacao_alteracao_total | counter | status | - | chamadas a RegistrarSolicitacaoDeAlteracao por status |
| m012_registrar_solicitacao_alteracao_duration_seconds | histogram | operacao | s | latencia de RegistrarSolicitacaoDeAlteracao |
| m012_decidir_solicitacao_alteracao_total | counter | status | - | chamadas a DecidirSolicitacaoDeAlteracao por status |
| m012_decidir_solicitacao_alteracao_duration_seconds | histogram | operacao | s | latencia de DecidirSolicitacaoDeAlteracao |
| m012_relatorios_pendentes_analise | gauge | - | - | relatorios tecnicos submetidos aguardando parecer |
| m012_contestacoes_abertas | gauge | - | - | contestacoes recebidas sem decisao final |
| m012_solicitacoes_alteracao_pendentes | gauge | tipo_alteracao | - | solicitacoes de alteracao pendentes de decisao |
| m012_ext_m003_duration_seconds | histogram | dependencia | s | latencia de chamadas a M003 (Projeto/Edital) |
| m012_ext_m003_total | counter | dependencia, status | - | chamadas a M003 por status |
| m012_ext_m020_duration_seconds | histogram | dependencia | s | latencia de acionamento de M020 (notificacoes) |
| m012_ext_m020_total | counter | dependencia, status | - | acionamentos de M020 por status |

## Tracing (SigNoz / OpenTelemetry)

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m012.ConsultarDashboardAcompanhamento | por chamada a ConsultarDashboardAcompanhamento | projeto.id, edital.id, perfil.origem, status_projeto |
| m012.SubmeterRelatorioTecnico | por chamada a SubmeterRelatorioTecnico | projeto.id, relatorio.id, periodo_referencia, resultado |
| m012.EmitirParecerRelatorio | por chamada a EmitirParecerRelatorio | relatorio.id, tipo_parecer, resultado |
| m012.RegistrarContestacaoRelatorio | por chamada a RegistrarContestacaoRelatorio | relatorio.id, contestacao.id, resultado |
| m012.RegistrarSolicitacaoDeAlteracao | por chamada a RegistrarSolicitacaoDeAlteracao | projeto.id, solicitacao.id, tipo_alteracao, resultado |
| m012.DecidirSolicitacaoDeAlteracao | por chamada a DecidirSolicitacaoDeAlteracao | solicitacao.id, aprovado, resultado |
| m012.ext.m003 | por chamada a M003 (Projeto/Coordenador/Edital) | peer.service, http.status_code, projeto.id |
| m012.ext.m020 | por acionamento de M020 (notificacao) | peer.service, http.status_code, evento.origem |

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| taxa de sucesso de ConsultarDashboardAcompanhamento (`status!="error"`) | 99% | 30d |
| disponibilidade de consolidacao do dashboard (p95 < 3s) | 99% | 30d |
| taxa de sucesso de SubmeterRelatorioTecnico (`status!="error"`) | 99% | 30d |
| taxa de sucesso de EmitirParecerRelatorio (`status!="error"`) | 99% | 30d |
| taxa de sucesso de RegistrarContestacaoRelatorio (`status!="error"`) | 99% | 30d |
| taxa de sucesso de chamadas a M003 (`status!="error"`) | 99% | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Dashboard indisponivel | `rate(m012_consultar_dashboard_acompanhamento_total{status="error"}[5m]) > 0` por 10m | critical | TODO runbook: investigar consolidacao de indicadores e dependencia M003 |
| Relatorios pendentes de analise acumulando | `m012_relatorios_pendentes_analise > 20` por 1h | warning | TODO runbook: acionar Area Tecnica para fila de analise (RN02) |
| Contestacoes abertas sem decisao | `m012_contestacoes_abertas > 0` por 24h | warning | TODO runbook: priorizar reanalise antes de vencer prazo regulatorio (RN03/RN08) |
| Solicitacoes de alteracao pendentes | `m012_solicitacoes_alteracao_pendentes > 10` por 24h | warning | TODO runbook: acionar Area Tecnica para decisao de alteracoes (RN05) |
| Falha de integracao M003 | `rate(m012_ext_m003_total{status="error"}[5m]) > 0` por 10m | critical | TODO runbook: verificar disponibilidade de M003 (Projeto/Edital) |
| Falha de integracao M020 | `rate(m012_ext_m020_total{status="error"}[5m]) > 0` por 10m | warning | TODO runbook: verificar M020; notificacoes de prazo/resultado podem nao estar saindo |
| SLO de submissao de relatorio em risco | error budget de SubmeterRelatorioTecnico consumido > 50% na janela 30d | warning | TODO runbook: revisar causas de falha de submissao |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M012 | rate/errors/duration por operacao do contrato | Grafana |
| Acompanhamento de negocio | gauges relatorios pendentes, contestacoes abertas, solicitacoes pendentes | Grafana |
| Pareceres por tipo | counter `m012_parecer_relatorio_total` por aprovado/reprovado | Grafana |
| Integracoes externas | latencia/erro por dependencia (M003, M020) | Grafana |
| Trace explorer | spans `m012.*` | SigNoz |
