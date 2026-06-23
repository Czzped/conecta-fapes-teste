# Monitoramento e Observabilidade — M022 Contratacao e Outorga

Dominio e regras: ver [README.md](README.md) | Eventos: ver [contrato.md](contrato.md) (secao Eventos)

## Objetivo de Sustentacao

Garantir que toda proposta aprovada no resultado final da captacao (M011) seja convocada, conferida e formalizada em termo de outorga/contrato sem ficar presa em estados intermediarios. O ponto critico de producao e a **coleta de assinaturas via M023 (E-Docs)**: a sustentacao precisa enxergar assinaturas pendentes envelhecendo, latencia de coleta, e falhas/timeout de assinatura — porque sem termo assinado nao ha `ContratacaoOutorgaFormalizada` e a iniciativa nao chega ao M003. Tambem deve garantir que contratacoes canceladas (RN05) nunca gerem encaminhamento ao M003.

## Eventos de Negocio Monitorados

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| PropostaConvocada | contrato.md | counter m022_convocar_proposta_aprovada_total{status} | Nao | - |
| (Assinatura pendente envelhecendo) | M023/E-Docs (coleta) | gauge m022_outorgas_assinatura_pendente_total | Sim | warning |
| (Falha de coleta de assinatura) | M023/E-Docs | counter m022_assinatura_falha_total{motivo} | Sim | critical |
| ContratacaoOutorgaFormalizada | contrato.md | counter m022_formalizar_contratacao_outorga_total{status} + gauge m022_outorgas_assinadas_total | Sim (queda) | warning |
| ContratacaoOutorgaCancelada | contrato.md | counter m022_cancelar_contratacao_outorga_total{status} | Nao | - |
| IniciativaEncaminhadaParaM003 | contrato.md | counter m022_encaminhar_iniciativa_m003_total{status} | Sim (status=error) | critical |

## Metricas (Prometheus)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m022_listar_propostas_aprovadas_total | counter | status | - | chamadas a query de propostas aprovadas |
| m022_listar_propostas_aprovadas_duration_seconds | histogram | operacao | s | latencia da query |
| m022_convocar_proposta_aprovada_total | counter | status | - | convocacoes de proposta aprovada |
| m022_convocar_proposta_aprovada_duration_seconds | histogram | operacao | s | latencia da convocacao |
| m022_conferir_requisitos_finais_total | counter | status, resultado | - | conferencias finais registradas |
| m022_conferir_requisitos_finais_duration_seconds | histogram | operacao | s | latencia da conferencia |
| m022_formalizar_contratacao_outorga_total | counter | status | - | formalizacoes de termo de outorga/contrato |
| m022_formalizar_contratacao_outorga_duration_seconds | histogram | operacao | s | latencia da formalizacao |
| m022_cancelar_contratacao_outorga_total | counter | status | - | cancelamentos de contratacao/outorga |
| m022_cancelar_contratacao_outorga_duration_seconds | histogram | operacao | s | latencia do cancelamento |
| m022_encaminhar_iniciativa_m003_total | counter | status | - | encaminhamentos de iniciativa ao M003 |
| m022_encaminhar_iniciativa_m003_duration_seconds | histogram | operacao | s | latencia do encaminhamento |
| m022_outorgas_assinatura_pendente_total | gauge | - | - | outorgas aguardando assinatura (coleta via M023) |
| m022_outorgas_assinadas_total | gauge | - | - | outorgas com termo assinado/formalizado |
| m022_assinatura_latencia_seconds | histogram | - | s | tempo entre envio para coleta e assinatura concluida (M023) |
| m022_assinatura_falha_total | counter | motivo | - | falhas de coleta de assinatura (timeout, rejeicao, erro E-Docs) |
| m022_ext_edocs_duration_seconds | histogram | operacao | s | latencia das chamadas ao E-Docs via M023 |
| m022_ext_edocs_total | counter | operacao, status | - | chamadas ao E-Docs por dependencia (taxa de erro) |

## Tracing (SigNoz / OpenTelemetry)

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m022.ListarPropostasAprovadas | por execucao da query | captacao.id |
| m022.ConvocarPropostaAprovada | por convocacao | captacao.id, proposta.id |
| m022.ConferirRequisitosFinais | por conferencia | contratacao_outorga.id, resultado |
| m022.FormalizarContratacaoOutorga | por formalizacao do termo | contratacao_outorga.id, data_outorga |
| m022.CancelarContratacaoOutorga | por cancelamento | contratacao_outorga.id |
| m022.EncaminharIniciativaParaM003 | por encaminhamento | contratacao_outorga.id, iniciativa.ref |
| m022.ext.M023 | por chamada de coleta de assinatura (M023) | peer.service=m023, operacao, http.status_code |
| m022.ext.edocs | por chamada ao E-Docs (assinatura) | peer.service=edocs, http.status_code, resultado_assinatura |

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| taxa de sucesso de FormalizarContratacaoOutorga (status!=error) | 99% | 30d |
| taxa de sucesso das chamadas de assinatura ao M023/E-Docs (m022_ext_edocs_total status!=error) | 99% | 30d |
| latencia de coleta de assinatura (p95 de m022_assinatura_latencia_seconds) | p95 < 72h | 30d |
| taxa de sucesso de EncaminharIniciativaParaM003 (status!=error) | 99,5% | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Assinatura presa | `m022_outorgas_assinatura_pendente_total > 0` por janela de 72h sem transicao | warning | TODO runbook — reenviar coleta via M023, contatar outorgado |
| Timeout de assinatura | `increase(m022_assinatura_falha_total{motivo="timeout"}[1h]) > 0` | critical | TODO runbook — verificar E-Docs e reabrir coleta |
| Falha de coleta de assinatura | `increase(m022_assinatura_falha_total[15m]) > 0` | critical | TODO runbook — investigar rejeicao/erro E-Docs |
| Integracao M023/E-Docs degradada | `rate(m022_ext_edocs_total{status="error"}[5m]) / rate(m022_ext_edocs_total[5m]) > 0.05` | critical | TODO runbook — checar saude do E-Docs via M023 |
| Latencia de assinatura alta | `histogram_quantile(0.95, rate(m022_assinatura_latencia_seconds_bucket[1h])) > 259200` | warning | TODO runbook — revisar backlog de coleta |
| Falha ao formalizar | `increase(m022_formalizar_contratacao_outorga_total{status="error"}[15m]) > 0` | warning | TODO runbook — verificar persistencia do termo/data de outorga |
| Falha ao encaminhar ao M003 | `increase(m022_encaminhar_iniciativa_m003_total{status="error"}[15m]) > 0` | critical | TODO runbook — reprocessar encaminhamento; garantir RN05 (cancelada nao encaminha) |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M022 | rate/errors/duration por operacao do contrato | Grafana |
| Funil de outorga | pendentes de assinatura vs assinadas (gauges m022_outorgas_*) | Grafana |
| Coleta de assinatura M023/E-Docs | latencia (p50/p95), pendentes, falhas por motivo | Grafana |
| Saude integracao E-Docs | latencia e taxa de erro de m022_ext_edocs_* | Grafana |
| Trace explorer | spans m022.* e m022.ext.* | SigNoz |
