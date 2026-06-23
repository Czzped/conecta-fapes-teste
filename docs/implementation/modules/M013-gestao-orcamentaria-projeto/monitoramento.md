# Monitoramento e Observabilidade — M013 Gestao Orcamentaria do Projeto

Dominio e regras: ver [README.md](README.md) | Eventos e invariantes canonicas (AX-SLD01, INV-SLD1, INV-SLD2): ver [ontology.yaml](ontology.yaml)

## Objetivo de Sustentacao

M013 e o modulo **canonico de saldo orcamentario** do Conecta FAPES: e a fonte oficial de `valorAprovado`/`valorComprometido`/`valorExecutado`/`saldoDisponivel` consumida por M003 (diarias), M009 (bolsas), M010 (relatorios financeiros), M014 e M019 (prestacao de contas/auditoria). A equipe de sustentacao precisa garantir, em producao:

- **Integridade dos invariantes de saldo** — `saldoDisponivel >= 0` (INV-SLD1) e `valorExecutado <= valorComprometido` (INV-SLD2) NUNCA podem ser violados; uma violacao significa saldo corrompido propagando para todos os modulos consumidores e e tratada como incidente critico.
- **Consistencia do recalculo de saldo** — toda `RegistrarTransacao` e toda aprovacao de `SolicitacaoOrcamentaria` deve recalcular os saldos conforme AX-SLD01 sem erro nem perda.
- **Disponibilidade das consultas de saldo** — `ConsultarSaldoPorRubrica` e fonte sincrona para validacao de alocacao por M003/M009 antes de confirmar despesa; sua indisponibilidade ou lentidao bloqueia operacoes a jusante.
- **Bloqueio correto por saldo insuficiente** — `SALDO_RUBRICA_INSUFICIENTE` deve recusar comprometimentos/execucoes que ultrapassem o disponivel (RN10), preservando o invariante.
- **Trilha de auditoria completa** — toda movimentacao registrada como `Transacao` e exposta via `ConsultarHistoricoOrcamentario` (RN05).

## Eventos de Negocio Monitorados

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| Violacao de invariante de saldo (saldoDisponivel < 0 / INV-SLD1) | INV-SLD1 (ontology.yaml) | gauge `m013_saldo_negativo_total` | Sim | critical |
| Violacao de invariante (valorExecutado > valorComprometido / INV-SLD2) | INV-SLD2 (ontology.yaml) | gauge `m013_inv_executado_excede_comprometido_total` | Sim | critical |
| Recusa por saldo insuficiente (SALDO_RUBRICA_INSUFICIENTE / RN10) | contrato.md (RegistrarTransacao, SolicitarMovimentacao) | counter `m013_registrar_transacao_total{status="error",error_code="SALDO_RUBRICA_INSUFICIENTE"}` | Sim | warning |
| TransacaoRegistrada (recalculo de saldo) | ontology.yaml (events) | counter `m013_registrar_transacao_total{status}` | Sim (so falha) | critical |
| SolicitacaoOrcamentariaSubmetida | ontology.yaml (events) | counter `m013_solicitar_movimentacao_orcamentaria_total{status}` | Nao | - |
| SolicitacaoOrcamentariaAprovada (aplica efeitos no saldo) | ontology.yaml (events) | counter `m013_registrar_parecer_total{status,decisao="aprovado"}` | Sim (so falha) | critical |
| SolicitacaoOrcamentariaRejeitada | ontology.yaml (events) | counter `m013_registrar_parecer_total{status,decisao="rejeitado"}` | Nao | - |
| Limite de edital excedido (LIMITE_EDITAL_EXCEDIDO / RI2) | contrato.md (RegistrarParecer) | counter `m013_registrar_parecer_total{status="error",error_code="LIMITE_EDITAL_EXCEDIDO"}` | Nao | warning |
| Falha ao consolidar saldo (SALDO_RUBRICA_INDISPONIVEL) | contrato.md (ConsultarSaldoPorRubrica) | counter `m013_consultar_saldo_por_rubrica_total{status="error"}` | Sim | warning |

## Metricas (Prometheus)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m013_registrar_rubrica_do_projeto_total | counter | status, error_code | - | chamadas a RegistrarRubricaDoProjeto |
| m013_registrar_rubrica_do_projeto_duration_seconds | histogram | operacao | s | latencia de RegistrarRubricaDoProjeto |
| m013_registrar_transacao_total | counter | status, error_code, tipo_transacao | - | chamadas a RegistrarTransacao por tipo (COMPROMETIMENTO, EXECUCAO, ESTORNO, etc.) |
| m013_registrar_transacao_duration_seconds | histogram | operacao | s | latencia de RegistrarTransacao (inclui recalculo de saldo) |
| m013_solicitar_movimentacao_orcamentaria_total | counter | status, error_code, tipo_solicitacao | - | chamadas a SolicitarMovimentacaoOrcamentaria por tipo |
| m013_solicitar_movimentacao_orcamentaria_duration_seconds | histogram | operacao | s | latencia de SolicitarMovimentacaoOrcamentaria |
| m013_registrar_parecer_total | counter | status, error_code, decisao | - | chamadas a RegistrarParecerSolicitacaoOrcamentaria (decisao=aprovado/rejeitado) |
| m013_registrar_parecer_duration_seconds | histogram | operacao | s | latencia de RegistrarParecerSolicitacaoOrcamentaria (inclui aplicacao de efeitos) |
| m013_consultar_saldo_por_rubrica_total | counter | status, error_code | - | chamadas a ConsultarSaldoPorRubrica |
| m013_consultar_saldo_por_rubrica_duration_seconds | histogram | operacao | s | latencia de ConsultarSaldoPorRubrica (caminho critico para M003/M009) |
| m013_consultar_historico_orcamentario_total | counter | status, error_code | - | chamadas a ConsultarHistoricoOrcamentario |
| m013_consultar_historico_orcamentario_duration_seconds | histogram | operacao | s | latencia de ConsultarHistoricoOrcamentario |
| m013_consultar_execucao_por_programa_total | counter | status, error_code | - | chamadas a ConsultarExecucaoPorPrograma (consumida por M010) |
| m013_consultar_execucao_por_programa_duration_seconds | histogram | operacao | s | latencia de ConsultarExecucaoPorPrograma |
| m013_saldo_negativo_total | gauge | natureza | - | **Invariante INV-SLD1**: numero de RubricaProjeto com `saldoDisponivel < 0`. Valor esperado em regime: 0 |
| m013_inv_executado_excede_comprometido_total | gauge | natureza | - | **Invariante INV-SLD2**: numero de RubricaProjeto com `valorExecutado > valorComprometido`. Valor esperado: 0 |
| m013_saldo_disponivel_agregado_brl | gauge | natureza | brl | saldo disponivel agregado (SUM saldoDisponivel de todas as RubricaProjeto) |
| m013_valor_comprometido_agregado_brl | gauge | natureza | brl | valor comprometido agregado (SUM valorComprometido) |
| m013_valor_executado_agregado_brl | gauge | natureza | brl | valor executado agregado (SUM valorExecutado) |
| m013_solicitacoes_pendentes_total | gauge | estado | - | solicitacoes orcamentarias em estado SUBMETIDA ou EM_ANALISE aguardando parecer |

> Convencao aplicada: prefixo `m013_`, `snake_case`, sufixo de unidade (`_seconds`, `_brl`, `_total`), labels de baixa cardinalidade. Nenhum label carrega CPF, nome, email, id de projeto ou id de rubrica individual (PII / alta cardinalidade proibidos). O label `natureza` assume apenas `CUSTEIO`/`CAPITAL`; `tipo_transacao`/`tipo_solicitacao`/`estado`/`decisao` sao enums fechados da ontologia.

## Tracing (SigNoz / OpenTelemetry)

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m013.RegistrarRubricaDoProjeto | por chamada da operacao do contrato | natureza_rubrica, status, error_code |
| m013.RegistrarTransacao | por chamada da operacao do contrato | tipo_transacao, origem_modulo, status, error_code, saldo_pos_recalculo_ok |
| m013.SolicitarMovimentacaoOrcamentaria | por chamada da operacao do contrato | tipo_solicitacao, exige_aprovacao_diretor, status, error_code |
| m013.RegistrarParecerSolicitacaoOrcamentaria | por chamada da operacao do contrato | decisao, aplicou_efeitos_saldo, status, error_code |
| m013.ConsultarSaldoPorRubrica | por chamada da operacao do contrato | qtd_rubricas, status, error_code |
| m013.ConsultarHistoricoOrcamentario | por chamada da operacao do contrato | tipo_movimentacao, status, error_code |
| m013.ConsultarExecucaoPorPrograma | por chamada da operacao do contrato | qtd_projetos, status, error_code |
| m013.ext.M003 | por chamada externa a M003 (Projeto) | peer.service=M003, http.status_code, resultado |
| m013.ext.M008 | por chamada externa a M008 (Rubrica) | peer.service=M008, http.status_code, resultado |
| m013.ext.M001 | por chamada externa a M001 (VersaoNivel, realocacao de bolsa) | peer.service=M001, http.status_code, resultado |

> Atributos de negocio uteis e nao sensiveis. NUNCA incluir CPF, nome, email, valores monetarios individuais identificaveis ou id de projeto/rubrica como atributo de span. Contexto de trace propagado BFF -> Gateway -> M013 -> integracao externa para trace fim-a-fim no SigNoz.

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| Conformidade do invariante de saldo: fracao do tempo com `m013_saldo_negativo_total == 0` e `m013_inv_executado_excede_comprometido_total == 0` | 100% (zero tolerancia) | 30d |
| Taxa de sucesso de RegistrarTransacao (status != error, excluindo recusa de negocio SALDO_RUBRICA_INSUFICIENTE) | 99,9% | 30d |
| Latencia p95 de ConsultarSaldoPorRubrica (caminho critico de validacao M003/M009) | < 500 ms | 30d |
| Taxa de sucesso de aplicacao de efeitos em SolicitacaoOrcamentariaAprovada (RegistrarParecer status != error) | 99,5% | 30d |
| Disponibilidade de ConsultarExecucaoPorPrograma (consumida por M010) | 99% | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Invariante de saldo violado (INV-SLD1) | `m013_saldo_negativo_total > 0` | critical | Saldo corrompido propagando para M003/M009/M010/M014/M019. Congelar novas alocacoes, identificar RubricaProjeto afetada via trace `m013.RegistrarTransacao`, auditar transacoes recentes. TODO: link runbook |
| Invariante executado > comprometido violado (INV-SLD2) | `m013_inv_executado_excede_comprometido_total > 0` | critical | Execucao registrada acima do comprometido — recalculo inconsistente. Bloquear EXECUCAO na rubrica afetada e revisar ordem das transacoes. TODO: link runbook |
| Falha no recalculo de saldo (RegistrarTransacao) | `rate(m013_registrar_transacao_total{status="error",error_code!="SALDO_RUBRICA_INSUFICIENTE"}[5m]) > 0` | critical | Transacao falhando fora de recusa de negocio — risco de saldo dessincronizado. Inspecionar spans `m013.RegistrarTransacao` com erro. TODO: link runbook |
| Falha ao aplicar efeitos de aprovacao | `rate(m013_registrar_parecer_total{status="error",decisao="aprovado"}[10m]) > 0` | critical | Solicitacao aprovada sem efeito no saldo aplicado. Reprocessar aplicacao de efeitos. TODO: link runbook |
| Consulta de saldo indisponivel | `rate(m013_consultar_saldo_por_rubrica_total{status="error"}[5m]) > 0.05 * rate(m013_consultar_saldo_por_rubrica_total[5m])` | warning | M003/M009 nao conseguem validar saldo antes de alocar — risco de bloqueio a jusante. Verificar consolidacao de saldo. TODO: link runbook |
| Latencia alta de consulta de saldo | `histogram_quantile(0.95, rate(m013_consultar_saldo_por_rubrica_duration_seconds_bucket[10m])) > 0.5` | warning | p95 acima do SLO de 500ms no caminho critico. Investigar performance da consolidacao. TODO: link runbook |
| Pico de recusa por saldo insuficiente | `rate(m013_registrar_transacao_total{error_code="SALDO_RUBRICA_INSUFICIENTE"}[15m]) > <baseline>` | warning | Volume anormal de bloqueios por RN10 — possivel orcamento mal dimensionado ou tentativa repetida de alocacao indevida. TODO: definir baseline + link runbook |
| Backlog de solicitacoes pendentes | `m013_solicitacoes_pendentes_total > <limite>` | warning | Solicitacoes acumulando sem parecer (SUBMETIDA/EM_ANALISE). Acionar Area Tecnica. TODO: definir limite + link runbook |
| Integracao externa degradada | `rate(m013_consultar_execucao_por_programa_total{status="error"}[10m]) > 0` ou erro em spans `m013.ext.*` acima do baseline | warning | Falha em M003/M008/M001 afetando operacoes orcamentarias. Verificar dependencia por `peer.service`. TODO: link runbook |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M013 | rate / errors / duration (p50, p95, p99) por operacao do contrato | Grafana |
| Invariantes de saldo | `m013_saldo_negativo_total`, `m013_inv_executado_excede_comprometido_total` (esperado 0) com destaque visual | Grafana |
| Saldo orcamentario agregado | `m013_saldo_disponivel_agregado_brl`, `m013_valor_comprometido_agregado_brl`, `m013_valor_executado_agregado_brl` por natureza | Grafana |
| Fluxo de solicitacoes | `m013_solicitacoes_pendentes_total` por estado, taxa de aprovacao/rejeicao via `m013_registrar_parecer_total{decisao}` | Grafana |
| Saude de integracoes externas | latencia e taxa de erro por dependencia (spans `m013.ext.M003`, `m013.ext.M008`, `m013.ext.M001`) | Grafana / SigNoz |
| Trace explorer | spans `m013.*` filtrados por operacao, tipo_transacao e status | SigNoz |
