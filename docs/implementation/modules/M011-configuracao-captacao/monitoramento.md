# Monitoramento e Observabilidade — M011 Configuracao de Captacao

Dominio e regras: ver [README.md](README.md) | Contrato: ver [contrato.md](contrato.md)

## Objetivo de Sustentacao

A equipe de sustentacao deve garantir que o ciclo de configuracao e selecao de captacoes do M011 opere sem interrupcoes que comprometam editais publicos ou demandas induzidas: que captacoes prontas sejam publicadas no horario do cronograma, que propostas sejam recebidas dentro do periodo `RECEBIMENTO_PROPOSTAS`, que avaliacao documental, avaliacao ad hoc e revisao de resultado avancem sem travas, e que o resultado final seja publicado encerrando o processo e liberando propostas aprovadas para o M022.

Pontos de atencao operacional: transicoes de estado da captacao (publicacao, pausa, cancelamento, encerramento), expiracao automatica quando `RESULTADO_FINAL.dataFim` e atingida sem publicacao manual, falhas na selecao de formularios publicados no M021 e bloqueios de operacao por captacao em estado `PAUSADO`. Integracoes internas (M021 formularios, M010 aportes, M008 rubricas, M001 niveis de bolsa) sempre observadas por latencia e taxa de erro por dependencia. NUNCA registrar dado pessoal (CPF de revisor/proponente, nome, email) em label de metrica ou atributo de span.

## Eventos de Negocio Monitorados

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| CaptacaoPublicada | contrato.md (PublicarCaptacao) | counter `m011_captacao_publicada_total{tipo_captacao}` | Nao | - |
| PublicacaoBloqueadaPorGuard | contrato.md (PublicarCaptacao recusas) | counter `m011_publicar_captacao_total{status="error",motivo}` | Sim | warning |
| ResultadoFinalPublicado | contrato.md (PublicarResultado RESULTADO_FINAL) | counter `m011_resultado_publicado_total{tipo="RESULTADO_FINAL"}` | Nao | - |
| CaptacaoExpiradaSemResultado | contrato.md (expiracao automatica RESULTADO_FINAL.dataFim) | counter `m011_captacao_expirada_total` | Sim | critical |
| CaptacaoPausada | contrato.md (PausarCaptacao) | counter `m011_captacao_pausada_total` | Nao | - |
| CaptacaoCancelada | contrato.md (CancelarCaptacao) | counter `m011_captacao_cancelada_total` | Sim | warning |
| PropostaRecusadaForaDePeriodo | contrato.md (SubmeterProposta, RN15) | counter `m011_submeter_proposta_total{status="error",motivo="periodo_encerrado"}` | Sim | warning |
| FalhaIntegracaoM021Formularios | contrato.md (SelecionarFormularios) | counter `m011_ext_dependencia_total{dependencia="m021",status="error"}` | Sim | critical |
| OperacaoBloqueadaCaptacaoPausada | contrato.md (AX-M011-032) | counter `m011_operacao_bloqueada_pausa_total{operacao}` | Nao | - |

## Metricas (Prometheus)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m011_configurar_cronograma_total | counter | status | - | chamadas a ConfigurarCronogramaDaCaptacao |
| m011_configurar_cronograma_duration_seconds | histogram | - | s | latencia de ConfigurarCronogramaDaCaptacao |
| m011_adiar_etapa_cronograma_total | counter | status | - | chamadas a AdiarEtapaCronogramaDaCaptacao |
| m011_adiar_etapa_cronograma_duration_seconds | histogram | - | s | latencia de AdiarEtapaCronogramaDaCaptacao |
| m011_selecionar_formularios_total | counter | status | - | chamadas a SelecionarFormularios |
| m011_selecionar_formularios_duration_seconds | histogram | - | s | latencia de SelecionarFormularios |
| m011_configurar_faixas_total | counter | status | - | chamadas a ConfigurarFaixasSelecionadas |
| m011_configurar_faixas_duration_seconds | histogram | - | s | latencia de ConfigurarFaixasSelecionadas |
| m011_configurar_rubricas_total | counter | status | - | chamadas a ConfigurarRubricasPermitidas |
| m011_configurar_rubricas_duration_seconds | histogram | - | s | latencia de ConfigurarRubricasPermitidas |
| m011_configurar_regras_submissao_total | counter | status | - | chamadas a ConfigurarRegrasSubmissao |
| m011_configurar_regras_submissao_duration_seconds | histogram | - | s | latencia de ConfigurarRegrasSubmissao |
| m011_configurar_proponentes_escolhidos_total | counter | status | - | chamadas a ConfigurarProponentesEscolhidos |
| m011_configurar_proponentes_escolhidos_duration_seconds | histogram | - | s | latencia de ConfigurarProponentesEscolhidos |
| m011_configurar_documentos_total | counter | status | - | chamadas a ConfigurarDocumentosExigidos |
| m011_configurar_documentos_duration_seconds | histogram | - | s | latencia de ConfigurarDocumentosExigidos |
| m011_configurar_matriz_total | counter | status | - | chamadas a ConfigurarMatrizConfiguracao |
| m011_configurar_matriz_duration_seconds | histogram | - | s | latencia de ConfigurarMatrizConfiguracao |
| m011_validar_configuracao_total | counter | status | - | chamadas a ValidarConfiguracaoDaCaptacao |
| m011_validar_configuracao_duration_seconds | histogram | - | s | latencia de ValidarConfiguracaoDaCaptacao |
| m011_publicar_captacao_total | counter | status, motivo | - | chamadas a PublicarCaptacao (motivo preenchido em erro) |
| m011_publicar_captacao_duration_seconds | histogram | - | s | latencia de PublicarCaptacao |
| m011_despublicar_captacao_total | counter | status | - | chamadas a DespublicarCaptacao |
| m011_despublicar_captacao_duration_seconds | histogram | - | s | latencia de DespublicarCaptacao |
| m011_reabrir_captacao_total | counter | status | - | chamadas a ReabrirCaptacao |
| m011_reabrir_captacao_duration_seconds | histogram | - | s | latencia de ReabrirCaptacao |
| m011_pausar_captacao_total | counter | status | - | chamadas a PausarCaptacao |
| m011_pausar_captacao_duration_seconds | histogram | - | s | latencia de PausarCaptacao |
| m011_retomar_captacao_total | counter | status, motivo | - | chamadas a RetomarCaptacao (motivo em bloqueio AX-M011-033) |
| m011_retomar_captacao_duration_seconds | histogram | - | s | latencia de RetomarCaptacao |
| m011_cancelar_captacao_total | counter | status | - | chamadas a CancelarCaptacao |
| m011_cancelar_captacao_duration_seconds | histogram | - | s | latencia de CancelarCaptacao |
| m011_submeter_proposta_total | counter | status, motivo | - | chamadas a SubmeterProposta (motivo em erro, ex. periodo_encerrado) |
| m011_submeter_proposta_duration_seconds | histogram | - | s | latencia de SubmeterProposta |
| m011_listar_propostas_total | counter | status | - | chamadas a ListarPropostasDaCaptacao |
| m011_listar_propostas_duration_seconds | histogram | - | s | latencia de ListarPropostasDaCaptacao |
| m011_registrar_avaliacao_documental_total | counter | status, decisao | - | chamadas a RegistrarAvaliacaoDocumental (decisao=habilitado\|inabilitado) |
| m011_registrar_avaliacao_documental_duration_seconds | histogram | - | s | latencia de RegistrarAvaliacaoDocumental |
| m011_distribuir_propostas_total | counter | status | - | chamadas a DistribuirPropostasParaRevisores |
| m011_distribuir_propostas_duration_seconds | histogram | - | s | latencia de DistribuirPropostasParaRevisores |
| m011_avaliar_proposta_total | counter | status | - | chamadas a AvaliarProposta |
| m011_avaliar_proposta_duration_seconds | histogram | - | s | latencia de AvaliarProposta |
| m011_consolidar_notas_total | counter | status | - | chamadas a ConsolidarNotasDeAvaliacao |
| m011_consolidar_notas_duration_seconds | histogram | - | s | latencia de ConsolidarNotasDeAvaliacao |
| m011_submeter_revisao_total | counter | status, motivo | - | chamadas a SubmeterRevisaoResultado |
| m011_submeter_revisao_duration_seconds | histogram | - | s | latencia de SubmeterRevisaoResultado |
| m011_analisar_revisao_total | counter | status, decisao | - | chamadas a AnalisarRevisaoResultado |
| m011_analisar_revisao_duration_seconds | histogram | - | s | latencia de AnalisarRevisaoResultado |
| m011_publicar_resultado_total | counter | status, tipo | - | chamadas a PublicarResultado (tipo=RESULTADO_PRELIMINAR\|RESULTADO_FINAL) |
| m011_publicar_resultado_duration_seconds | histogram | - | s | latencia de PublicarResultado |
| m011_captacao_publicada_total | counter | tipo_captacao | - | captacoes publicadas (CHAMADA_PUBLICA\|DEMANDA_INDUZIDA) |
| m011_captacao_pausada_total | counter | - | - | captacoes pausadas administrativamente |
| m011_captacao_cancelada_total | counter | - | - | captacoes canceladas administrativamente |
| m011_captacao_expirada_total | counter | - | - | captacoes encerradas por expiracao sem resultado final manual |
| m011_resultado_publicado_total | counter | tipo | - | resultados publicados por tipo |
| m011_operacao_bloqueada_pausa_total | counter | operacao | - | operacoes de selecao bloqueadas por captacao PAUSADO (AX-M011-032) |
| m011_ext_dependencia_total | counter | dependencia, status | - | chamadas a integracoes internas (m021, m010, m008, m001) por status |
| m011_ext_dependencia_duration_seconds | histogram | dependencia | s | latencia por integracao interna |
| m011_editais_publicados_total | gauge | tipo_captacao | - | captacoes atualmente no estado PUBLICADO |
| m011_captacoes_em_configuracao_total | gauge | - | - | captacoes no estado EM_ANDAMENTO |
| m011_projetos_em_selecao_total | gauge | fase | - | propostas em fase de selecao (fase=AVALIACAO_DOCUMENTAL\|AVALIACAO_AD_HOC\|REVISAO) |
| m011_projetos_em_julgamento_total | gauge | - | - | propostas com avaliacao ad hoc pendente de conclusao |
| m011_captacoes_pausadas_total | gauge | - | - | captacoes atualmente no estado PAUSADO |

## Tracing (SigNoz / OpenTelemetry)

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m011.ConfigurarCronogramaDaCaptacao | por chamada ao command | captacao.id, periodos.count, versao |
| m011.AdiarEtapaCronogramaDaCaptacao | por chamada ao command | captacao.id, tipo_periodo, dias, periodos_afetados.count |
| m011.SelecionarFormularios | por chamada ao command | captacao.id, formularios.count, tem_anexo |
| m011.ConfigurarFaixasSelecionadas | por chamada ao command | captacao.id, faixas.count, fomento.id |
| m011.ConfigurarRubricasPermitidas | por chamada ao command | captacao.id, faixa.id, rubricas.count |
| m011.ConfigurarRegrasSubmissao | por chamada ao command | captacao.id, direcionamento |
| m011.ConfigurarProponentesEscolhidos | por chamada ao command | captacao.id, tipo_proponente, proponentes.count |
| m011.ConfigurarDocumentosExigidos | por chamada ao command | captacao.id, documentos.count |
| m011.ConfigurarMatrizConfiguracao | por chamada ao command | captacao.id, blocos_exigidos.count |
| m011.ValidarConfiguracaoDaCaptacao | por chamada a query | captacao.id, pronto_para_publicacao, pendencias.count |
| m011.PublicarCaptacao | por chamada ao command | captacao.id, tipo_captacao, resultado |
| m011.DespublicarCaptacao | por chamada ao command | captacao.id, resultado |
| m011.ReabrirCaptacao | por chamada ao command | captacao.id |
| m011.PausarCaptacao | por chamada ao command | captacao.id |
| m011.RetomarCaptacao | por chamada ao command | captacao.id, resultado |
| m011.CancelarCaptacao | por chamada ao command | captacao.id |
| m011.SubmeterProposta | por chamada ao command | captacao.id, periodo, resultado |
| m011.ListarPropostasDaCaptacao | por chamada a query | captacao.id, filtros.count, resultados.count |
| m011.RegistrarAvaliacaoDocumental | por chamada ao command | captacao.id, proposta.id, decisao |
| m011.DistribuirPropostasParaRevisores | por chamada ao command | captacao.id, propostas.count, revisores.count |
| m011.AvaliarProposta | por chamada ao command | captacao.id, proposta.id, revisor.id |
| m011.ConsolidarNotasDeAvaliacao | por chamada a query | captacao.id, propostas.count |
| m011.SubmeterRevisaoResultado | por chamada ao command | captacao.id, proposta.id, periodo |
| m011.AnalisarRevisaoResultado | por chamada ao command | captacao.id, revisao.id, decisao |
| m011.PublicarResultado | por chamada ao command | captacao.id, tipo, aprovados.count |
| m011.ext.m021 | por chamada de selecao/validacao de formulario | peer.service, http.status_code, formulario.id, versao.id |
| m011.ext.m010 | por leitura de origem de aporte (Programa/Parceria) | peer.service, http.status_code, origem.tipo |
| m011.ext.m008 | por leitura de rubricas ativas | peer.service, http.status_code, rubrica.id |
| m011.ext.m001 | por leitura de versoes de niveis de bolsa | peer.service, http.status_code, nivel.versao |

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| taxa de sucesso de PublicarCaptacao (status!="error") | 99% | 30d |
| taxa de sucesso de SubmeterProposta dentro do periodo de recebimento | 99,5% | 30d |
| taxa de sucesso de SelecionarFormularios (sem falha de integracao M021) | 99% | 30d |
| latencia p95 de SubmeterProposta | < 2 s | 30d |
| latencia p95 de ValidarConfiguracaoDaCaptacao | < 1 s | 30d |
| taxa de sucesso de PublicarResultado (RESULTADO_FINAL) | 99,5% | 30d |
| disponibilidade de integracao M021 (1 - taxa de erro) | 99,5% | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Falha de integracao M021 (formularios) | `rate(m011_ext_dependencia_total{dependencia="m021",status="error"}[5m]) > 0` | critical | TODO: runbook integracao M021 |
| Captacao expirada sem resultado final | `increase(m011_captacao_expirada_total[1h]) > 0` | critical | TODO: runbook expiracao captacao |
| Erro na publicacao de resultado final | `rate(m011_publicar_resultado_total{status="error",tipo="RESULTADO_FINAL"}[15m]) > 0` | critical | TODO: runbook publicar resultado |
| Taxa de erro de SubmeterProposta elevada | `sum(rate(m011_submeter_proposta_total{status="error"}[10m])) / sum(rate(m011_submeter_proposta_total[10m])) > 0.05` | warning | TODO: runbook submissao proposta |
| Publicacao de captacao bloqueada por guard recorrente | `increase(m011_publicar_captacao_total{status="error"}[30m]) > 5` | warning | TODO: runbook prontidao publicacao |
| SLO de PublicarCaptacao em risco | `sum(rate(m011_publicar_captacao_total{status="error"}[1h])) / sum(rate(m011_publicar_captacao_total[1h])) > 0.01` | warning | TODO: runbook SLO publicacao |
| Cancelamento de captacao detectado | `increase(m011_captacao_cancelada_total[1h]) > 0` | warning | TODO: runbook cancelamento administrativo |
| Latencia p95 de SubmeterProposta acima do SLO | `histogram_quantile(0.95, sum(rate(m011_submeter_proposta_duration_seconds_bucket[10m])) by (le)) > 2` | warning | TODO: runbook latencia submissao |
| Disponibilidade de dependencias internas degradada | `rate(m011_ext_dependencia_total{status="error"}[10m]) > 0` (por `dependencia`) | warning | TODO: runbook integracoes internas |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED Configuracao M011 | rate/errors/duration dos commands de configuracao (cronograma, formularios, faixas, rubricas, regras, documentos, matriz) | Grafana |
| RED Selecao M011 | rate/errors/duration de SubmeterProposta, RegistrarAvaliacaoDocumental, DistribuirPropostas, AvaliarProposta, PublicarResultado | Grafana |
| Estados da Captacao | gauges m011_editais_publicados_total, m011_captacoes_em_configuracao_total, m011_captacoes_pausadas_total | Grafana |
| Selecao de Projetos | gauges m011_projetos_em_selecao_total (por fase), m011_projetos_em_julgamento_total | Grafana |
| Transicoes e Eventos Criticos | counters publicada/pausada/cancelada/expirada/resultado_publicado | Grafana |
| Integracoes Internas | latencia e taxa de erro por dependencia (m021, m010, m008, m001) | Grafana |
| Trace explorer | spans m011.* e m011.ext.* | SigNoz |
