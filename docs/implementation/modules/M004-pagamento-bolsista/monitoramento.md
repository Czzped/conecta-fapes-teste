# Monitoramento e Observabilidade — M004 Pagamento de Bolsistas

Dominio e regras: ver [README.md](README.md) | Eventos: ver [eventos-dominio.md](eventos-dominio.md)

## Objetivo de Sustentacao

Garantir que o ciclo mensal de pagamento de bolsistas ocorra no prazo e sem erros. Em producao, a sustentacao precisa enxergar: que folhas sao geradas, autorizadas e pagas dentro dos marcos M2/M3; que as remessas de cadastro e pagamento ao Banestes sao geradas e que seus retornos sao processados sem acumular fila no Redis; que o encaminhamento ao BANDES ocorre; e que falhas de pagamento (`PAGAMENTO_FALHA`, `FALHA_AGENDAMENTO`) sao detectadas e tratadas rapidamente, dado o impacto financeiro direto sobre os bolsistas. O sucesso operacional do modulo se mede pelo percentual de pagamentos processados no prazo e pela reducao de erros em folha.

## Eventos de Negocio Monitorados

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| `PAGAMENTO_FALHA` | eventos-dominio.md | counter `m004_pagamento_falha_total` | Sim | critical |
| `PAGAMENTO_AGENDADO` | eventos-dominio.md | counter `m004_pagamento_agendado_total` | Nao | - |
| `PAGAMENTO_REALIZADO` | eventos-dominio.md | counter `m004_pagamento_realizado_total` | Nao | - |
| `ORDEM_PAGAMENTO_GERADA` | eventos-dominio.md | counter `m004_ordem_pagamento_gerada_total` | Nao | - |
| Falha de agendamento no retorno de pagamento (`FALHA_AGENDAMENTO`) | eventos-dominio.md / contrato.md (ProcessarRetornoRemessaPagamento) | counter `m004_processar_retorno_pagamento_total{status="error"}` | Sim | critical |

> Os eventos sao definidos em [eventos-dominio.md](eventos-dominio.md) (fonte unica do mapeamento `evento -> tipo -> destinatario -> canal` no catalogo M020). Esta tabela apenas referencia os eventos e associa o sinal operacional; nao redefine payload nem destinatario.

## Metricas (Prometheus)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| `m004_configurar_plano_mensal_total` | counter | status | - | chamadas a ConfigurarPlanoMensalDeFolhas |
| `m004_configurar_plano_mensal_duration_seconds` | histogram | - | s | latencia de ConfigurarPlanoMensalDeFolhas |
| `m004_registrar_decisao_liberacao_total` | counter | status | - | chamadas a RegistrarDecisaoDeLiberacaoDoEditalCompetencia |
| `m004_registrar_decisao_liberacao_duration_seconds` | histogram | - | s | latencia de RegistrarDecisaoDeLiberacaoDoEditalCompetencia |
| `m004_gerar_folha_total` | counter | status, tipo_folha | - | chamadas a GerarFolhaDePagamento (tipo_folha: normal/complementar) |
| `m004_gerar_folha_duration_seconds` | histogram | - | s | latencia de GerarFolhaDePagamento |
| `m004_registrar_decisao_folha_total` | counter | status, tipo_acao | - | chamadas a RegistrarDecisaoSobreFolha (tipo_acao: autorizar/rejeitar/cancelar) |
| `m004_registrar_decisao_folha_duration_seconds` | histogram | - | s | latencia de RegistrarDecisaoSobreFolha |
| `m004_gerenciar_bonus_pagamento_total` | counter | status | - | chamadas a GerenciarBonusPagamento |
| `m004_gerenciar_bonus_pagamento_duration_seconds` | histogram | - | s | latencia de GerenciarBonusPagamento |
| `m004_gerar_remessa_cadastro_total` | counter | status | - | chamadas a GerarRemessaCadastroBolsista |
| `m004_gerar_remessa_cadastro_duration_seconds` | histogram | - | s | latencia de GerarRemessaCadastroBolsista |
| `m004_gerar_remessa_pagamento_total` | counter | status | - | chamadas a GerarRemessaPagamento |
| `m004_gerar_remessa_pagamento_duration_seconds` | histogram | - | s | latencia de GerarRemessaPagamento |
| `m004_encaminhar_pagamento_bandes_total` | counter | status | - | chamadas a EncaminharPagamentoBandes |
| `m004_encaminhar_pagamento_bandes_duration_seconds` | histogram | - | s | latencia de EncaminharPagamentoBandes |
| `m004_gerar_guia_liberacao_total` | counter | status, tipo | - | chamadas a GerarGuiaLiberacao (tipo: normal/alternativa) |
| `m004_gerar_guia_liberacao_duration_seconds` | histogram | - | s | latencia de GerarGuiaLiberacao |
| `m004_gerar_relacao_pagamento_total` | counter | status | - | chamadas a GerarRelacaoPagamento |
| `m004_gerar_relacao_pagamento_duration_seconds` | histogram | - | s | latencia de GerarRelacaoPagamento |
| `m004_consultar_folhas_competencia_total` | counter | status | - | chamadas a ConsultarFolhasDaCompetencia |
| `m004_consultar_folhas_competencia_duration_seconds` | histogram | - | s | latencia de ConsultarFolhasDaCompetencia |
| `m004_consultar_processos_remessa_total` | counter | status | - | chamadas a ConsultarProcessosRemessa |
| `m004_consultar_processos_remessa_duration_seconds` | histogram | - | s | latencia de ConsultarProcessosRemessa |
| `m004_suspender_pagamento_total` | counter | status | - | chamadas a SuspenderPagamento |
| `m004_suspender_pagamento_duration_seconds` | histogram | - | s | latencia de SuspenderPagamento |
| `m004_estender_pagamento_total` | counter | status | - | chamadas a EstenderPagamento |
| `m004_estender_pagamento_duration_seconds` | histogram | - | s | latencia de EstenderPagamento |
| `m004_exportar_folha_csv_total` | counter | status | - | chamadas a ExportarFolhaCsv |
| `m004_exportar_folha_csv_duration_seconds` | histogram | - | s | latencia de ExportarFolhaCsv |
| `m004_processar_retorno_cadastro_total` | counter | status | - | execucoes do job ProcessarRetornoRemessaCadastro |
| `m004_processar_retorno_pagamento_total` | counter | status | - | execucoes do job ProcessarRetornoRemessaPagamento |
| `m004_ext_banestes_total` | counter | operacao, status | - | chamadas a integracao externa Banestes (operacao: remessa_cadastro/remessa_pagamento/retorno) |
| `m004_ext_banestes_duration_seconds` | histogram | operacao | s | latencia por chamada ao Banestes |
| `m004_ext_bandes_total` | counter | status | - | chamadas a integracao externa BANDES |
| `m004_ext_bandes_duration_seconds` | histogram | - | s | latencia por chamada ao BANDES |
| `m004_folha_pagamento_valor_total_brl` | gauge | competencia, tipo_folha | brl | valor total da folha de pagamento gerada |
| `m004_folha_pagamentos_total` | gauge | competencia, tipo_folha | - | quantidade de pagamentos vinculados a folha |
| `m004_remessas_pendentes_total` | gauge | tipo | - | remessas geradas aguardando retorno (tipo: cadastro/pagamento) |
| `m004_retorno_remessa_fila_total` | gauge | fila | - | mensagens pendentes na fila Redis de retorno (fila: cadastro/pagamento) |
| `m004_job_processar_retorno_cadastro_duration_seconds` | histogram | - | s | duracao do job ProcessarRetornoRemessaCadastro |
| `m004_job_processar_retorno_cadastro_last_success_timestamp_seconds` | gauge | - | s | timestamp da ultima execucao com sucesso do job de retorno de cadastro |
| `m004_job_processar_retorno_pagamento_duration_seconds` | histogram | - | s | duracao do job ProcessarRetornoRemessaPagamento |
| `m004_job_processar_retorno_pagamento_last_success_timestamp_seconds` | gauge | - | s | timestamp da ultima execucao com sucesso do job de retorno de pagamento |
| `m004_pagamento_falha_total` | counter | etapa | - | pagamentos com falha (etapa: agendamento/pagamento) |
| `m004_pagamento_agendado_total` | counter | - | - | pagamentos agendados |
| `m004_pagamento_realizado_total` | counter | - | - | pagamentos realizados |
| `m004_ordem_pagamento_gerada_total` | counter | - | - | ordens de pagamento geradas |

> Convencao: prefixo `m004_`, `snake_case`, unidade no sufixo, labels de baixa cardinalidade. Nenhum label carrega dado pessoal (CPF, nome, email, conta bancaria). `competencia` (ex.: `2026-05`) e label de baixa cardinalidade controlada.

## Tracing (SigNoz / OpenTelemetry)

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| `m004.ConfigurarPlanoMensalDeFolhas` | por operacao do contrato | competencia |
| `m004.RegistrarDecisaoDeLiberacaoDoEditalCompetencia` | por operacao do contrato | edital.id, competencia, eh_liberado |
| `m004.GerarFolhaDePagamento` | por operacao do contrato | competencia, tipo_folha, folha.id, qtd_pagamentos |
| `m004.RegistrarDecisaoSobreFolha` | por operacao do contrato | folha.id, tipo_acao, status_resultante |
| `m004.GerenciarBonusPagamento` | por operacao do contrato | plano_mensal.id, tipo_bonus |
| `m004.GerarRemessaCadastroBolsista` | por operacao do contrato | remessa.numero, qtd_alocacoes |
| `m004.GerarRemessaPagamento` | por operacao do contrato | folha.id, remessa.numero |
| `m004.EncaminharPagamentoBandes` | por operacao do contrato | folha.id |
| `m004.GerarGuiaLiberacao` | por operacao do contrato | folha.id, tipo |
| `m004.GerarRelacaoPagamento` | por operacao do contrato | folha.id, edital.id |
| `m004.ConsultarFolhasDaCompetencia` | por operacao do contrato | competencia, status |
| `m004.ConsultarProcessosRemessa` | por operacao do contrato | tipo, status |
| `m004.SuspenderPagamento` | por operacao do contrato | pagamento.id |
| `m004.EstenderPagamento` | por operacao do contrato | alocacao.id, qtd_cotas |
| `m004.ExportarFolhaCsv` | por operacao do contrato | folha.id |
| `m004.ext.banestes` | por chamada externa ao Banestes (remessa/retorno) | peer.service=banestes, operacao, http.status_code, resultado |
| `m004.ext.bandes` | por chamada externa ao BANDES | peer.service=bandes, http.status_code, resultado |
| `m004.ext.minio` | por gravacao/leitura de arquivo no MinIO | peer.service=minio, bucket, operacao |
| `m004.job.ProcessarRetornoRemessaCadastro` | por execucao do job Hangfire (a cada 3 min) | resultado, itens_processados, fila |
| `m004.job.ProcessarRetornoRemessaPagamento` | por execucao do job Hangfire (a cada 3 min) | resultado, itens_processados, fila |

> Nenhum atributo de span carrega CPF, nome, email ou conta bancaria. Contexto de trace propagado BFF -> Gateway -> M004 -> Banestes/BANDES/MinIO para trace fim-a-fim no SigNoz.

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| Taxa de sucesso da geracao de remessa de pagamento: `1 - (rate(m004_gerar_remessa_pagamento_total{status="error"}) / rate(m004_gerar_remessa_pagamento_total))` | >= 99% das remessas processadas sem erro, latencia p95 < 5 min | 30d |
| Taxa de sucesso da geracao de folha: `1 - (rate(m004_gerar_folha_total{status="error"}) / rate(m004_gerar_folha_total))` | >= 99% | 30d |
| Taxa de sucesso do processamento de retorno de pagamento: `1 - (rate(m004_processar_retorno_pagamento_total{status="error"}) / rate(m004_processar_retorno_pagamento_total))` | >= 99% | 30d |
| Taxa de sucesso por dependencia externa Banestes: `1 - (rate(m004_ext_banestes_total{status="error"}) / rate(m004_ext_banestes_total))` | >= 99% | 30d |
| Disponibilidade do job de retorno de pagamento: `time() - m004_job_processar_retorno_pagamento_last_success_timestamp_seconds` | execucao bem-sucedida a cada <= 10 min (cadencia agendada 3 min) | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Falha de pagamento | `increase(m004_pagamento_falha_total[15m]) > 0` | critical | TODO: runbook investigar falha de pagamento (verificar retorno Banestes, status do pagamento, reprocessar) |
| Falha no retorno de remessa de pagamento | `increase(m004_processar_retorno_pagamento_total{status="error"}[15m]) > 0` | critical | TODO: runbook processamento de retorno de pagamento |
| Falha na geracao de remessa de pagamento | `increase(m004_gerar_remessa_pagamento_total{status="error"}[15m]) > 0` | critical | TODO: runbook geracao de remessa de pagamento |
| Integracao Banestes degradada | `(rate(m004_ext_banestes_total{status="error"}[10m]) / rate(m004_ext_banestes_total[10m])) > 0.05` | critical | TODO: runbook integracao Banestes (status do servico, conectividade, retry) |
| Integracao BANDES degradada | `(rate(m004_ext_bandes_total{status="error"}[10m]) / rate(m004_ext_bandes_total[10m])) > 0.05` | warning | TODO: runbook integracao BANDES |
| Job de retorno de cadastro nao executou | `time() - m004_job_processar_retorno_cadastro_last_success_timestamp_seconds > 600` | warning | TODO: runbook job Hangfire (verificar dashboard Hangfire, fila Redis, agendamento) |
| Job de retorno de pagamento nao executou | `time() - m004_job_processar_retorno_pagamento_last_success_timestamp_seconds > 600` | critical | TODO: runbook job Hangfire de retorno de pagamento |
| Fila Redis de retorno crescente | `m004_retorno_remessa_fila_total > 100` por 15m | warning | TODO: runbook fila de retorno de remessa (verificar throughput do job, backlog) |
| Falha na geracao de folha | `increase(m004_gerar_folha_total{status="error"}[30m]) > 0` | warning | TODO: runbook geracao de folha |
| SLO de remessa de pagamento em risco | error budget de `m004_gerar_remessa_pagamento_total` consumido > 80% na janela 30d | warning | TODO: runbook revisao de SLO de remessa |

> Todo alerta possui acao/runbook associado. Os links de runbook estao marcados como TODO ate publicacao no repositorio de runbooks da sustentacao.

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M004 — Operacoes | rate/errors/duration por operacao publica do contrato (folha, remessa, decisoes, consultas) | Grafana |
| Folhas de Pagamento | `m004_folha_pagamento_valor_total_brl` e `m004_folha_pagamentos_total` por competencia/tipo; folhas geradas/autorizadas | Grafana |
| Remessas e Retornos | remessas pendentes, fila Redis de retorno, taxa de sucesso de processamento | Grafana |
| Integracoes Externas | latencia e taxa de erro por dependencia (Banestes, BANDES, MinIO) | Grafana |
| Saude dos Jobs Hangfire | duracao, ultimo sucesso e atraso de agendamento dos jobs de retorno (cadastro/pagamento) | Grafana |
| SLO M004 | error budget e burn rate dos SLOs de remessa/folha/retorno | Grafana |
| Trace explorer | spans `m004.*` (operacoes, `m004.ext.*`, `m004.job.*`) e logs correlacionados por `trace_id` | SigNoz |
