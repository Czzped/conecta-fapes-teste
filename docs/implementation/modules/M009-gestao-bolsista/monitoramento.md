# Monitoramento e Observabilidade — M009 Gestao de Bolsa Pesquisa

Dominio e regras: ver [README.md](README.md) | Eventos: ver [eventos-dominio.md](eventos-dominio.md)

## Objetivo de Sustentacao

Garantir que o ciclo de vida da bolsa de pesquisa — da indicacao a implementacao, com renovacao, suspensao, reativacao e encerramento — flua sem travas operacionais ou financeiras. A sustentacao precisa enxergar, em producao:

- a saude das operacoes publicas do [contrato.md](contrato.md) (RED por operacao);
- transicoes criticas que tem impacto financeiro ou de prazo (bolsa nao implementada, lembrete de encerramento, documentacao reprovada);
- o volume de bolsas em estados que exigem acao humana (aceite pendente, documentacao pendente, termos pendentes de assinatura);
- a execucao pontual do job de lembrete de prazo `BOLSA_PRAZO_ENCERRAMENTO` (T-30 / T-7 / T-1);
- a saude das integracoes externas (Diario Oficial / assinatura) e dos modulos internos dos quais o fluxo depende (M013 saldo, M011 edital).

Os indicadores de sucesso de negocio do modulo (taxa de bolsas com acompanhamento em dia, tempo medio de renovacao) sao apoiados por estes sinais operacionais.

## Eventos de Negocio Monitorados

Eventos definidos em [eventos-dominio.md](eventos-dominio.md) (fonte unica do mapeamento `evento -> tipo -> destinatario -> canal` no catalogo M020). Monitora-se aqui apenas o que tem impacto operacional, financeiro ou de prazo.

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| `BOLSA_NAO_IMPLEMENTADA` | eventos-dominio.md (RN12) | counter `m009_bolsa_nao_implementada_total{motivo}` | Sim | warning |
| `BOLSA_PRAZO_ENCERRAMENTO` (T-30 / T-7 / T-1) | eventos-dominio.md (RN04, lembrete mandatorio) | counter `m009_lembrete_prazo_encerramento_total{janela}` + saude do job | Sim | warning |
| `BOLSA_DOC_REPROVADA` | eventos-dominio.md (RN05) | counter `m009_documentacao_reprovada_total` | Nao | - |
| `TERMO_PRONTO_ASSINATURA` | eventos-dominio.md (RN06, RN07) | gauge `m009_termos_pendentes_assinatura` | Sim | warning |
| `BOLSA_IMPLEMENTADA` | eventos-dominio.md (RN07) | counter `m009_bolsa_implementada_total` | Nao | - |
| `BOLSA_RENOVACAO_INDEFERIDA` | eventos-dominio.md (RN09) | counter `m009_renovacao_total{resultado="indeferida"}` | Nao | - |
| `BOLSA_SUSPENSAO_EFETIVADA` | eventos-dominio.md (RN13) | counter `m009_suspensao_total` | Nao | - |
| `BOLSA_ENCERRAMENTO` | eventos-dominio.md (RN10, RN11) | counter `m009_encerramento_total{motivo}` | Nao | - |

> Nota: `BOLSA_PRAZO_ENCERRAMENTO` e um lembrete de prazo mandatorio com antecedencia em T-30, T-7 e T-1, executado por job recorrente (Hangfire, ADR-009). A falha ou nao execucao do job deixa bolsista e coordenador sem aviso de encerramento — por isso a saude do job e monitorada (ver Alertas).

## Metricas (Prometheus)

Convencao: prefixo `m009_`, `snake_case`, sufixo de unidade, labels de baixa cardinalidade. Nunca CPF, nome, email ou id de bolsa/bolsista em label.

### RED por operacao do contrato

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| `m009_indicar_bolsista_total` | counter | status | - | chamadas a IndicarBolsista (status=success\|error) |
| `m009_indicar_bolsista_duration_seconds` | histogram | - | s | latencia de IndicarBolsista |
| `m009_registrar_aceite_orientador_total` | counter | status | - | chamadas a RegistrarAceiteDoOrientador |
| `m009_registrar_aceite_orientador_duration_seconds` | histogram | - | s | latencia de RegistrarAceiteDoOrientador |
| `m009_submeter_documentacao_bolsa_total` | counter | status | - | chamadas a SubmeterDocumentacaoDaBolsa |
| `m009_submeter_documentacao_bolsa_duration_seconds` | histogram | - | s | latencia de SubmeterDocumentacaoDaBolsa |
| `m009_avaliar_documentacao_bolsa_total` | counter | status | - | chamadas a AvaliarDocumentacaoDaBolsa |
| `m009_avaliar_documentacao_bolsa_duration_seconds` | histogram | - | s | latencia de AvaliarDocumentacaoDaBolsa |
| `m009_formalizar_implementar_bolsa_total` | counter | status | - | chamadas a FormalizarEImplementarBolsa |
| `m009_formalizar_implementar_bolsa_duration_seconds` | histogram | - | s | latencia de FormalizarEImplementarBolsa |
| `m009_consultar_bolsa_pesquisa_total` | counter | status | - | chamadas a ConsultarBolsaPesquisa |
| `m009_consultar_bolsa_pesquisa_duration_seconds` | histogram | - | s | latencia de ConsultarBolsaPesquisa |

### Metricas de negocio (gauges / counters de dominio)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| `m009_bolsas_ativas` | gauge | - | - | bolsas implementadas em vigencia |
| `m009_termos_pendentes_assinatura` | gauge | - | - | termos de compromisso aguardando assinatura (RN06) |
| `m009_indicacoes_aguardando_aceite` | gauge | - | - | indicacoes aguardando aceite do orientador (RN03) |
| `m009_bolsas_aguardando_documentacao` | gauge | - | - | bolsas aguardando envio/avaliacao documental |
| `m009_bolsa_implementada_total` | counter | - | - | bolsas implementadas (RN07) |
| `m009_bolsa_nao_implementada_total` | counter | motivo | - | bolsas que nao foram implementadas (RN12) |
| `m009_documentacao_reprovada_total` | counter | - | - | pareceres documentais reprovados (RN05) |
| `m009_renovacao_total` | counter | resultado | - | renovacoes (resultado=deferida\|indeferida, RN09) |
| `m009_suspensao_total` | counter | - | - | suspensoes efetivadas (RN13) |
| `m009_encerramento_total` | counter | motivo | - | encerramentos (motivo=conclusao\|desistencia\|corte\|descumprimento, RN10) |
| `m009_alocacao_bloqueada_saldo_total` | counter | - | - | indicacoes bloqueadas por SALDO_INSUFICIENTE (RN01) |
| `m009_lembrete_prazo_encerramento_total` | counter | janela | - | lembretes de prazo enviados (janela=t30\|t7\|t1) |

### Job recorrente

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| `m009_job_lembrete_prazo_encerramento_duration_seconds` | histogram | - | s | duracao do job de lembrete de encerramento |
| `m009_job_lembrete_prazo_encerramento_last_success_timestamp_seconds` | gauge | - | s | timestamp do ultimo sucesso do job |

### Integracao externa

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| `m009_ext_request_duration_seconds` | histogram | dependencia | s | latencia por dependencia externa (dependencia=diario_oficial\|assinatura) |
| `m009_ext_request_total` | counter | dependencia, status | - | chamadas externas por dependencia e status |

## Tracing (SigNoz / OpenTelemetry)

Um span por operacao publica do contrato (`ActivitySource`), span filho por chamada externa, span por job. Atributos de negocio nao sensiveis apenas — nunca CPF, nome, email ou tema de pesquisa identificavel.

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| `m009.IndicarBolsista` | por operacao do contrato | projeto.id, cota.id, edital.id, resultado |
| `m009.RegistrarAceiteDoOrientador` | por operacao do contrato | bolsa.codigo, aceito, resultado |
| `m009.SubmeterDocumentacaoDaBolsa` | por operacao do contrato | bolsa.codigo, qtd_documentos, resultado |
| `m009.AvaliarDocumentacaoDaBolsa` | por operacao do contrato | bolsa.codigo, aprovado, resultado |
| `m009.FormalizarEImplementarBolsa` | por operacao do contrato | bolsa.codigo, publicacao.presente, resultado |
| `m009.ConsultarBolsaPesquisa` | por operacao do contrato | bolsa.codigo, resultado |
| `m009.ext.diario_oficial` | por chamada de publicacao | peer.service, http.status_code, publicacao.presente |
| `m009.ext.assinatura` | por chamada de assinatura | peer.service, http.status_code, assinatura.resultado |
| `m009.job.lembrete_prazo_encerramento` | por execucao do job (T-30 / T-7 / T-1) | janela, itens_processados, resultado |

Propagar contexto de trace BFF → Gateway → M009 → integracao externa, para trace fim-a-fim no SigNoz.

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| taxa de sucesso de FormalizarEImplementarBolsa (sem erro) | 99% | 30d |
| taxa de sucesso de IndicarBolsista (sem erro) | 99% | 30d |
| latencia p95 de ConsultarBolsaPesquisa | < 1s | 30d |
| execucoes do job de lembrete de encerramento concluidas no horario | 99,5% | 30d |
| cobertura de lembrete de encerramento (bolsas com aviso T-30/T-7/T-1 enviado antes do vencimento) | 100% | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Job de lembrete de encerramento nao executado | `time() - m009_job_lembrete_prazo_encerramento_last_success_timestamp_seconds > 86400` | critical | Investigar Hangfire; reprocessar lembretes T-30/T-7/T-1 pendentes. Runbook: TODO |
| SLO de implementacao em risco | `sum(rate(m009_formalizar_implementar_bolsa_total{status="error"}[30m])) / sum(rate(m009_formalizar_implementar_bolsa_total[30m])) > 0.01` | critical | Verificar assinaturas/publicacao pendentes e dependencias externas. Runbook: TODO |
| Falha de integracao externa | `sum(rate(m009_ext_request_total{status="error"}[5m])) by (dependencia) / sum(rate(m009_ext_request_total[5m])) by (dependencia) > 0.05` | critical | Verificar disponibilidade de Diario Oficial / assinatura; acionar fornecedor. Runbook: TODO |
| Latencia externa alta | `histogram_quantile(0.95, sum(rate(m009_ext_request_duration_seconds_bucket[10m])) by (le, dependencia)) > 5` | warning | Verificar latencia do Diario Oficial / assinatura. Runbook: TODO |
| Bolsas nao implementadas crescendo | `increase(m009_bolsa_nao_implementada_total[1d]) > 0` | warning | Acionar coordenadores (RN12) e revisar bloqueios do fluxo. Runbook: TODO |
| Termos pendentes de assinatura acumulando | `m009_termos_pendentes_assinatura > 20` | warning | Cobrar assinaturas de Coord/Orientador/Bolsista/DIRAF/DIPRE (RN06). Runbook: TODO |
| Alocacao bloqueada por saldo | `increase(m009_alocacao_bloqueada_saldo_total[1h]) > 0` | warning | Verificar saldo da rubrica de bolsas (M013, RN01). Runbook: TODO |
| Erro em IndicarBolsista acima do limiar | `sum(rate(m009_indicar_bolsista_total{status="error"}[15m])) / sum(rate(m009_indicar_bolsista_total[15m])) > 0.05` | warning | Verificar validacao de cota/saldo e regras RI1/RI2. Runbook: TODO |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M009 | rate / errors / duration por operacao do contrato | Grafana |
| Funil de bolsa | gauges de estado: aguardando aceite, aguardando documentacao, termos pendentes, bolsas ativas | Grafana |
| Encerramento e prazos | lembretes T-30/T-7/T-1, saude do job, encerramentos por motivo | Grafana |
| Saude de integracoes externas | latencia e taxa de erro por dependencia (Diario Oficial, assinatura) | Grafana |
| Impacto financeiro | bloqueios por saldo (RN01), bolsas nao implementadas (RN12) | Grafana |
| Trace explorer | spans `m009.*` filtrados por operacao e dependencia | SigNoz |
