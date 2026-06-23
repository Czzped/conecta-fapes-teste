# Monitoramento e Observabilidade — M014 Prestacao de Contas

Dominio e regras: ver [README.md](README.md) | Eventos: ver [eventos-dominio.md](eventos-dominio.md)

## Objetivo de Sustentacao

Garantir que o ciclo de prestacao de contas da iniciativa flua sem perda de comprovacao financeira: submissoes, pareceres, importacoes de integracao (CNAB 240, SIGFAPES, dados bancarios) e validacoes de NF-e via SERPRO devem ser observaveis fim-a-fim. A sustentacao precisa enxergar, em producao:

- a saude das operacoes publicas do [contrato.md](contrato.md) (latencia, erro, taxa de uso);
- prestacoes que travam no fluxo `RASCUNHO -> EM_ANALISE -> {FINALIZADO | NEGADO | REVISAO}` (pendentes de analise, em revisao);
- prazos a vencer/estourados de submissao (apos encerramento do periodo) e de reposicao (apos recusa) — lembretes `T-7 / T-3 / T-0`;
- documentos fiscais reprovados e validacao SERPRO degradada (NF-e nao validavel = prestacao nao submetivel, RN06);
- jobs de integracao (Hangfire) que falham ou nao rodam no horario — sem CNAB importado nao ha conciliacao (RN02) e a prestacao nao avanca;
- integracoes externas (SERPRO, MinIO, SIGFAPES, sistema bancario CNAB) com latencia e taxa de erro por dependencia.

## Eventos de Negocio Monitorados

Eventos definidos em [eventos-dominio.md](eventos-dominio.md) (fonte unica do mapeamento `evento -> tipo -> destinatario -> canal` no [catalogo M020](../M020-comunicacao/notificacoes/catalogo-eventos.md)). Nem todo evento de dominio vira metrica — abaixo, os de impacto operacional/financeiro.

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| DOCUMENTO_FISCAL_REPROVADO | eventos-dominio.md | counter `m014_documentos_fiscais_reprovados_total` | Sim | warning |
| PRAZO_SUBMISSAO (T-7 / T-3 / T-0) | eventos-dominio.md | counter `m014_lembrete_prazo_total{tipo="submissao",janela}` + gauge `m014_prazos_submissao_a_vencer_total` | Sim | warning |
| PRAZO_REPOSICAO (T-7 / T-3 / T-0) | eventos-dominio.md | counter `m014_lembrete_prazo_total{tipo="reposicao",janela}` + gauge `m014_prazos_reposicao_a_vencer_total` | Sim | warning |
| REPOSICAO_RECEBIDA (dentro / fora do prazo) | eventos-dominio.md | counter `m014_reposicao_recebida_total{prazo}` | Nao | - |
| REVISOR_DESIGNADO | eventos-dominio.md | counter `m014_revisor_designado_total` | Nao | - |
| PARECER_PC_DEFERIDO | eventos-dominio.md | counter `m014_parecer_total{resultado="deferido"}` | Nao | - |
| PARECER_PC_INDEFERIDO | eventos-dominio.md | counter `m014_parecer_total{resultado="indeferido"}` | Nao | - |
| PRESTACAO_AUDITADA | eventos-dominio.md | counter `m014_prestacao_auditada_total` | Nao | - |

> Lembretes de prazo `T-0` sao mandatorios — prazo estourado (`janela="T0"` sem reposicao/submissao subsequente) tem impacto financeiro e deve alertar.

## Metricas (Prometheus)

Convencao: prefixo `m014_`, `snake_case`, unidade no sufixo, labels de baixa cardinalidade. Nunca CPF, id de prestacao, nome ou email em label.

### RED por operacao publica do contrato

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m014_registrar_documento_fiscal_total | counter | status | - | chamadas a RegistrarDocumentoFiscal |
| m014_registrar_documento_fiscal_duration_seconds | histogram | - | s | latencia de RegistrarDocumentoFiscal |
| m014_registrar_justificativa_passagem_total | counter | status | - | chamadas a RegistrarJustificativaPassagem |
| m014_registrar_justificativa_passagem_duration_seconds | histogram | - | s | latencia de RegistrarJustificativaPassagem |
| m014_associar_estorno_total | counter | status | - | chamadas a AssociarEstornoPrestacaoContas |
| m014_associar_estorno_duration_seconds | histogram | - | s | latencia de AssociarEstornoPrestacaoContas |
| m014_submeter_prestacao_total | counter | status | - | chamadas a SubmeterPrestacaoContas |
| m014_submeter_prestacao_duration_seconds | histogram | - | s | latencia de SubmeterPrestacaoContas |
| m014_emitir_parecer_total | counter | status | - | chamadas a EmitirParecerPrestacaoContas |
| m014_emitir_parecer_duration_seconds | histogram | - | s | latencia de EmitirParecerPrestacaoContas |
| m014_registrar_contestacao_total | counter | status | - | chamadas a RegistrarContestacaoPrestacaoContas |
| m014_registrar_contestacao_duration_seconds | histogram | - | s | latencia de RegistrarContestacaoPrestacaoContas |
| m014_consultar_prestacao_total | counter | status | - | chamadas a ConsultarPrestacaoContas |
| m014_consultar_prestacao_duration_seconds | histogram | - | s | latencia de ConsultarPrestacaoContas |

> Errors = serie do counter `..._total{status="error"}`. O label `status` assume `success` ou `error` (baixa cardinalidade).

### Jobs de integracao (Hangfire)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m014_job_sincronizar_iniciativas_duration_seconds | histogram | - | s | duracao de SincronizarIniciativasDadosBancarios |
| m014_job_sincronizar_iniciativas_total | counter | status | - | execucoes do job de sincronizacao |
| m014_job_sincronizar_iniciativas_last_success_timestamp_seconds | gauge | - | s | epoch do ultimo sucesso da sincronizacao |
| m014_job_importar_orcamento_sigfapes_duration_seconds | histogram | - | s | duracao de ImportarOrcamentoPlanejadoSIGFAPES |
| m014_job_importar_orcamento_sigfapes_total | counter | status | - | execucoes da carga de orcamento |
| m014_job_importar_orcamento_sigfapes_last_success_timestamp_seconds | gauge | - | s | epoch do ultimo sucesso da carga SIGFAPES |
| m014_job_importar_cnab240_duration_seconds | histogram | - | s | duracao de ImportarMovimentosBancariosCNAB240 |
| m014_job_importar_cnab240_total | counter | status | - | execucoes da importacao CNAB 240 |
| m014_job_importar_cnab240_last_success_timestamp_seconds | gauge | - | s | epoch do ultimo sucesso da importacao CNAB |
| m014_cnab240_lancamentos_importados_total | counter | - | - | lancamentos bancarios importados via CNAB 240 |

### Gauges de negocio

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m014_prestacoes_pendentes_total | gauge | estado | - | prestacoes nao terminais por estado (RASCUNHO, EM_ANALISE, REVISAO) |
| m014_prazos_submissao_a_vencer_total | gauge | janela | - | prestacoes com prazo de submissao a vencer por janela (T-7/T-3/T-0) |
| m014_prazos_reposicao_a_vencer_total | gauge | janela | - | reposicoes com prazo a vencer por janela (T-7/T-3/T-0) |
| m014_documentos_fiscais_reprovados_total | counter | - | - | documentos fiscais reprovados na analise |
| m014_rubricas_estouro_total | counter | - | - | classificacoes que excederam o limite da RubricaProjeto (RI2) |

## Tracing (SigNoz / OpenTelemetry)

Um span por operacao do contrato (`m014.{Operacao}`), span filho por dependencia externa (`m014.ext.{dep}`), span por job Hangfire. Propagar contexto BFF -> Gateway -> M014 -> integracao externa. Atributos de negocio nao sensiveis apenas — nunca CPF, nome ou email.

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m014.RegistrarDocumentoFiscal | por chamada a RegistrarDocumentoFiscal | prestacao.id, rubrica.id, documento.tipo, status |
| m014.RegistrarJustificativaPassagem | por chamada a RegistrarJustificativaPassagem | prestacao.id, rubrica.id, status |
| m014.AssociarEstornoPrestacaoContas | por chamada a AssociarEstornoPrestacaoContas | prestacao.id, status |
| m014.SubmeterPrestacaoContas | por chamada a SubmeterPrestacaoContas | prestacao.id, periodo.referencia, status |
| m014.EmitirParecerPrestacaoContas | por chamada a EmitirParecerPrestacaoContas | prestacao.id, parecer.aprovado, status |
| m014.RegistrarContestacaoPrestacaoContas | por chamada a RegistrarContestacaoPrestacaoContas | prestacao.id, status |
| m014.ConsultarPrestacaoContas | por chamada a ConsultarPrestacaoContas | prestacao.id, status |
| m014.ext.serpro | validacao de NF-e por ChaveAcesso (RN06) | peer.service=serpro, http.status_code, nfe.validada |
| m014.ext.minio | leitura/escrita de PDF de orcamento/justificativa | peer.service=minio, http.status_code, objeto.operacao |
| m014.ext.sigfapes | carga de orcamento planejado | peer.service=sigfapes, http.status_code, resultado |
| m014.ext.banco_cnab | leitura do arquivo CNAB 240 | peer.service=banco_cnab, resultado |
| m014.job.SincronizarIniciativasDadosBancarios | por execucao do job | resultado, iniciativas_processadas |
| m014.job.ImportarOrcamentoPlanejadoSIGFAPES | por execucao do job | resultado, iniciativa.id |
| m014.job.ImportarMovimentosBancariosCNAB240 | por execucao do job | resultado, arquivo.nome, lancamentos_importados, lancamentos_ignorados |

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| taxa de sucesso de SubmeterPrestacaoContas (`status="success"` / total) | 99% | 30d |
| taxa de sucesso de EmitirParecerPrestacaoContas | 99% | 30d |
| taxa de sucesso de validacao de NF-e via SERPRO (`m014.ext.serpro`) | 98% | 30d |
| taxa de sucesso do job ImportarMovimentosBancariosCNAB240 | 99% | 30d |
| latencia p95 de ConsultarPrestacaoContas | < 2 s | 30d |
| cobertura de lembrete de prazo T-0 emitido para prestacoes com prazo a vencer | 100% | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Falha de submissao de prestacao | `rate(m014_submeter_prestacao_total{status="error"}[15m]) > 0` sustentado por 15m | critical | TODO: runbook submissao-prestacao |
| SERPRO degradado | `rate(m014_serpro_validacao_nfe_total{status="error"}[10m]) / rate(m014_serpro_validacao_nfe_total[10m]) > 0.1` por 10m | critical | TODO: runbook integracao-serpro |
| Job CNAB 240 nao executado | `time() - m014_job_importar_cnab240_last_success_timestamp_seconds > 86400` | critical | TODO: runbook job-cnab240 |
| Job SIGFAPES / sincronizacao falhando | `rate(m014_job_importar_orcamento_sigfapes_total{status="error"}[1h]) > 0` ou `rate(m014_job_sincronizar_iniciativas_total{status="error"}[1h]) > 0` | warning | TODO: runbook jobs-integracao |
| Prazo de submissao estourando (T-0) | `m014_prazos_submissao_a_vencer_total{janela="T0"} > 0` | warning | TODO: runbook prazo-submissao |
| Prazo de reposicao estourando (T-0) | `m014_prazos_reposicao_a_vencer_total{janela="T0"} > 0` | warning | TODO: runbook prazo-reposicao |
| Documentos fiscais reprovados em alta | `increase(m014_documentos_fiscais_reprovados_total[1h]) > 10` | warning | TODO: runbook documento-fiscal-reprovado |
| Estouro de limite de rubrica | `increase(m014_rubricas_estouro_total[1h]) > 0` | warning | TODO: runbook estouro-rubrica |
| Fila de prestacoes em analise crescente | `m014_prestacoes_pendentes_total{estado="EM_ANALISE"}` crescente por 7d | warning | TODO: runbook fila-analise |
| Latencia alta de consulta | `histogram_quantile(0.95, rate(m014_consultar_prestacao_duration_seconds_bucket[5m])) > 2` por 15m | warning | TODO: runbook latencia-consulta |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M014 por operacao | rate/errors/duration de cada operacao do contrato | Grafana |
| Saude dos jobs de integracao | duracao, sucesso/falha e ultimo sucesso de CNAB 240, SIGFAPES e sincronizacao | Grafana |
| Integracoes externas | latencia e taxa de erro por dependencia (SERPRO, MinIO, SIGFAPES, banco CNAB) | Grafana |
| Negocio — prestacoes e prazos | gauges de prestacoes pendentes por estado, prazos T-7/T-3/T-0 a vencer, documentos fiscais reprovados | Grafana |
| Conciliacao e pareceres | lancamentos CNAB importados, pareceres deferidos/indeferidos, reposicoes recebidas | Grafana |
| Trace explorer | spans `m014.*` (operacoes, `m014.ext.*`, jobs) | SigNoz |
