# Monitoramento e Observabilidade — M018 Business Intelligence

Dominio e regras: ver [README.md](README.md) | Eventos: ver [contrato.md](contrato.md)

## Objetivo de Sustentacao

A sustentacao precisa garantir que os paineis analiticos reflitam dados confiaveis e atualizados para a tomada de decisao estrategica da Diretoria e da Area Tecnica. Como BI e um contexto analitico alimentado por consolidacao diaria (RN01), os tres riscos operacionais centrais sao: (1) o job de atualizacao analitica nao executar, atrasar ou falhar, deixando paineis defasados; (2) os dados ficarem obsoletos (data freshness/lag) sem que a operacao perceba — risco de decisao sobre numero velho; (3) consultas e exportacoes degradarem alem do limite de 5s (RN08), prejudicando a adocao. Alem disso, deve-se observar erros no calculo automatico de indicadores (RN05) e falhas de acesso aos modulos-fonte (M003, M009, M010, M011). Nao ha movimentacao financeira propria neste modulo; o impacto e de confiabilidade e disponibilidade da informacao gerencial.

## Eventos de Negocio Monitorados

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| Consolidacao diaria concluida | contrato.md (AtualizarPaineisAnaliticos) | counter m018_atualizar_paineis_analiticos_total{status} + gauge m018_paineis_ultima_atualizacao_timestamp_seconds | Sim (ausencia) | critical |
| FONTE_ANALITICA_INDISPONIVEL | contrato.md (AtualizarPaineisAnaliticos) | counter m018_fonte_analitica_indisponivel_total{fonte} | Sim | critical |
| TEMPO_PROCESSAMENTO_EXCEDIDO | contrato.md (AtualizarPaineisAnaliticos) | histogram m018_job_atualizar_paineis_duration_seconds | Sim | warning |
| Dados analiticos obsoletos (lag) | RN01 / consolidacao diaria | gauge m018_dados_freshness_horas | Sim | critical |
| INDICADOR_NAO_DISPONIVEL | contrato.md (ConsultarIndicadoresConsolidados) | counter m018_indicador_calculo_erro_total{indicador} | Sim | warning |
| Painel acima do limite de carregamento (RN08) | contrato.md (ConsultarPainelAnalitico) | histogram m018_consultar_painel_analitico_duration_seconds | Sim | warning |
| EXPORTACAO_ANALITICA_INDISPONIVEL | contrato.md (ExportarRelatorioAnalitico) | counter m018_exportar_relatorio_analitico_total{status="error"} | Sim | warning |
| ACESSO_PAINEL_NEGADO | contrato.md (ConsultarPainelAnalitico) | counter m018_consultar_painel_analitico_total{status="denied"} | Nao | - |

## Metricas (Prometheus)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m018_atualizar_paineis_analiticos_total | counter | status | - | execucoes do job de consolidacao por resultado |
| m018_consultar_painel_analitico_total | counter | tipo_painel, status | - | consultas de painel por tipo e resultado (status inclui error/denied) |
| m018_consultar_painel_analitico_duration_seconds | histogram | tipo_painel | s | latencia da consulta de painel |
| m018_consultar_indicadores_consolidados_total | counter | status | - | consultas de indicadores consolidados por resultado |
| m018_consultar_indicadores_consolidados_duration_seconds | histogram | - | s | latencia da consulta de indicadores |
| m018_exportar_relatorio_analitico_total | counter | formato, status | - | exportacoes por formato (PDF/Excel) e resultado |
| m018_exportar_relatorio_analitico_duration_seconds | histogram | formato | s | latencia da geracao de exportacao |
| m018_job_atualizar_paineis_duration_seconds | histogram | - | s | duracao do job de consolidacao diaria |
| m018_job_atualizar_paineis_last_success_timestamp_seconds | gauge | - | s | timestamp do ultimo sucesso do job de consolidacao |
| m018_job_atualizar_paineis_falha_total | counter | motivo | - | falhas do job de consolidacao por motivo |
| m018_paineis_ultima_atualizacao_timestamp_seconds | gauge | tipo_painel | s | timestamp da ultima atualizacao por painel |
| m018_dados_freshness_horas | gauge | tipo_painel | h | idade dos dados analiticos (lag desde a ultima consolidacao) |
| m018_paineis_processados_total | gauge | - | - | quantidade de paineis processados na ultima consolidacao |
| m018_indicador_calculo_erro_total | counter | indicador | - | erros no calculo automatico de indicadores (RN05) |
| m018_fonte_analitica_indisponivel_total | counter | fonte | - | indisponibilidade de fonte transacional na consolidacao |
| m018_ext_fonte_duration_seconds | histogram | fonte | s | latencia de leitura por modulo-fonte (M003/M009/M010/M011) |
| m018_ext_fonte_erro_total | counter | fonte | - | erros de leitura por modulo-fonte |

## Tracing (SigNoz / OpenTelemetry)

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m018.ConsultarPainelAnalitico | por consulta de painel (contrato) | tipo_painel, programa.id, edital.id, instituicao.id |
| m018.ConsultarIndicadoresConsolidados | por consulta de indicadores (contrato) | periodo.atual, periodo.comparativo |
| m018.ExportarRelatorioAnalitico | por exportacao (contrato) | tipo_painel, formato |
| m018.job.atualizar_paineis | por execucao do job de consolidacao diaria | data_referencia, paineis_processados, resultado |
| m018.ext.m003 | leitura de Iniciativa em M003 | peer.service, http.status_code |
| m018.ext.m009 | leitura de BolsaPesquisa em M009 | peer.service, http.status_code |
| m018.ext.m010 | leitura de Programa em M010 | peer.service, http.status_code |
| m018.ext.m011 | leitura de Edital em M011 | peer.service, http.status_code |

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| frescor dos dados analiticos (m018_dados_freshness_horas) abaixo do limite diario | < 30h em 99% das medicoes | 30d |
| job de consolidacao diaria concluido com sucesso | 99% das execucoes | 30d |
| latencia de carregamento de painel abaixo do limite (RN08) | 95% das consultas < 5s | 30d |
| taxa de sucesso de ConsultarIndicadoresConsolidados | 99% | 30d |
| taxa de sucesso de ExportarRelatorioAnalitico | 99% | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Job de consolidacao nao executou | `time() - m018_job_atualizar_paineis_last_success_timestamp_seconds > 86400` | critical | TODO runbook: verificar agendador (Hangfire), disponibilidade das fontes e reexecutar consolidacao por data de referencia |
| Dados analiticos obsoletos | `max(m018_dados_freshness_horas) > 30` | critical | TODO runbook: investigar atraso/falha da consolidacao; sinalizar paineis como desatualizados |
| Job de consolidacao falhando | `increase(m018_job_atualizar_paineis_falha_total[6h]) > 0` | critical | TODO runbook: inspecionar motivo da falha e fonte indisponivel |
| Fonte transacional indisponivel | `increase(m018_fonte_analitica_indisponivel_total[1h]) > 0` | critical | TODO runbook: validar saude de M003/M009/M010/M011 e reprocessar |
| Consolidacao excedendo tempo esperado | `histogram_quantile(0.95, rate(m018_job_atualizar_paineis_duration_seconds_bucket[1d])) > 3600` | warning | TODO runbook: avaliar volume de dados e otimizacao da consolidacao |
| Painel acima do limite de 5s (RN08) | `histogram_quantile(0.95, rate(m018_consultar_painel_analitico_duration_seconds_bucket[15m])) > 5` | warning | TODO runbook: revisar cache/materializacao do painel e indices analiticos |
| Erros de calculo de indicador | `increase(m018_indicador_calculo_erro_total[1h]) > 0` | warning | TODO runbook: validar regra de calculo (RN05) e dados de origem do indicador |
| Falha de exportacao | `rate(m018_exportar_relatorio_analitico_total{status="error"}[15m]) > 0` | warning | TODO runbook: verificar servico de exportacao PDF/Excel e disponibilidade do painel |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED BI | rate/errors/duration por operacao (consultar painel, indicadores, exportacao) | Grafana |
| Saude do job de consolidacao | duracao, ultimo sucesso, falhas e paineis processados | Grafana |
| Frescor dos dados (freshness/lag) | m018_dados_freshness_horas por tipo de painel vs. limite diario | Grafana |
| Fontes analiticas | latencia e erro por modulo-fonte (M003/M009/M010/M011) | Grafana |
| Indicadores | erros de calculo de indicador por tipo (RN05) | Grafana |
| Trace explorer | spans m018.* (operacoes, job, integracoes) | SigNoz |
