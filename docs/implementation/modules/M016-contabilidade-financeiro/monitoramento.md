# Monitoramento e Observabilidade — M016 Contabilidade e Financeiro

Dominio e regras: ver [README.md](README.md) | Eventos: ver [eventos-dominio.md](eventos-dominio.md)

## Objetivo de Sustentacao

A equipe de sustentacao deve garantir que o M016 mantenha a integridade contabil e financeira da agencia de fomento: lancamentos sem perda de trilha de auditoria (RN06), saldos consistentes sem ficar negativos fora de autorizacao (RN05), conciliacao bancaria executada e fechada com divergencias tratadas (RN04, RN08, RN09) e gestao financeira da Acao Transversal rastreavel (RN11-RN15). O foco operacional e: detectar rapidamente movimentacoes recusadas (saldo negativo, associacao ausente), conciliacoes que nao iniciam/concluem, transacoes pendentes de analise acumulando e indisponibilidade do extrato bancario externo. As operacoes `CriarFundoFinanceiro` e o vinculo de fundo em `CadastrarContaBancaria` estao deferidas (ver Nota de Deferimento no contrato.md); suas metricas/spans abaixo ficam como TODO ate a implementacao.

## Eventos de Negocio Monitorados

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| TRANSACAO_PENDENTE_ANALISE | eventos-dominio.md (catalogo M020) | gauge m016_transacoes_pendentes_analise + counter m016_transacao_pendente_analise_total | Sim | warning |
| SALDO_NEGATIVO_NAO_AUTORIZADO (recusa RN05) | contrato.md `RegistrarMovimentacaoFinanceira` | counter m016_registrar_movimentacao_financeira_total{status="error",motivo="saldo_negativo"} | Sim | critical |
| EXTRATO_BANCARIO_INDISPONIVEL (recusa) | contrato.md `ExecutarConciliacaoBancaria` | counter m016_ext_extrato_bancario_total{status="error"} | Sim | critical |
| CONCILIACAO_EM_ANDAMENTO (recusa RN08) | contrato.md `ExecutarConciliacaoBancaria` | counter m016_job_conciliacao_bancaria_total{resultado="rejeitada"} | Sim | warning |
| Divergencia de conciliacao registrada (RN09) | contrato.md (efeitos de `ExecutarConciliacaoBancaria`) | gauge m016_conciliacao_divergencias_abertas + counter m016_conciliacao_divergencias_total | Sim | warning |

> Os nomes de evento de dominio em PascalCase ainda nao estao estabilizados (ver stub em eventos-dominio.md). O unico evento ja mapeado no catalogo M020 e `TRANSACAO_PENDENTE_ANALISE`; os demais sinais acima sao derivados de recusas/efeitos declarados no contrato.md, nao de eventos publicados. Sincronizar com [catalogo-eventos.md](../M020-comunicacao/notificacoes/catalogo-eventos.md) quando os eventos forem estabilizados. TODO: revisar esta tabela apos saida do stub.

## Metricas (Prometheus)

RED por operacao publica do contrato.md (`status` em `{success, error}`; `motivo` de baixa cardinalidade restrito aos codigos de recusa do contrato):

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m016_criar_conta_contabil_total | counter | status, motivo | - | chamadas a CriarContaContabil |
| m016_criar_conta_contabil_duration_seconds | histogram | - | s | latencia de CriarContaContabil |
| m016_associar_conta_escopo_total | counter | status, motivo | - | chamadas a AssociarContaAoEscopoFinanceiro |
| m016_associar_conta_escopo_duration_seconds | histogram | - | s | latencia de AssociarContaAoEscopoFinanceiro |
| m016_cadastrar_conta_bancaria_total | counter | status, motivo | - | chamadas a CadastrarContaBancaria |
| m016_cadastrar_conta_bancaria_duration_seconds | histogram | - | s | latencia de CadastrarContaBancaria |
| m016_registrar_movimentacao_financeira_total | counter | status, motivo, tipo_movimentacao | - | chamadas a RegistrarMovimentacaoFinanceira |
| m016_registrar_movimentacao_financeira_duration_seconds | histogram | - | s | latencia de RegistrarMovimentacaoFinanceira |
| m016_consultar_fluxo_caixa_saldos_total | counter | status, motivo | - | chamadas a ConsultarFluxoCaixaESaldos |
| m016_consultar_fluxo_caixa_saldos_duration_seconds | histogram | - | s | latencia de ConsultarFluxoCaixaESaldos |
| m016_parametrizar_politica_acao_transversal_total | counter | status, motivo | - | chamadas a ParametrizarPoliticaAcaoTransversal |
| m016_parametrizar_politica_acao_transversal_duration_seconds | histogram | - | s | latencia de ParametrizarPoliticaAcaoTransversal |
| m016_receber_reserva_acao_transversal_total | counter | status, motivo, tipo_origem | - | chamadas a ReceberReservaAcaoTransversal (origem M010) |
| m016_receber_reserva_acao_transversal_duration_seconds | histogram | - | s | latencia de ReceberReservaAcaoTransversal |
| m016_cadastrar_plano_aplicacao_acao_transversal_total | counter | status, motivo | - | chamadas a CadastrarPlanoAplicacaoAcaoTransversal |
| m016_cadastrar_plano_aplicacao_acao_transversal_duration_seconds | histogram | - | s | latencia de CadastrarPlanoAplicacaoAcaoTransversal |
| m016_registrar_despesa_acao_transversal_total | counter | status, motivo | - | chamadas a RegistrarDespesaAcaoTransversal |
| m016_registrar_despesa_acao_transversal_duration_seconds | histogram | - | s | latencia de RegistrarDespesaAcaoTransversal |
| m016_analisar_prestacao_financeira_acao_transversal_total | counter | status, motivo, decisao | - | chamadas a AnalisarPrestacaoFinanceiraAcaoTransversal |
| m016_analisar_prestacao_financeira_acao_transversal_duration_seconds | histogram | - | s | latencia de AnalisarPrestacaoFinanceiraAcaoTransversal |
| m016_consultar_dashboard_acao_transversal_total | counter | status, motivo | - | chamadas a ConsultarDashboardAcaoTransversal |
| m016_consultar_dashboard_acao_transversal_duration_seconds | histogram | - | s | latencia de ConsultarDashboardAcaoTransversal |
| m016_criar_fundo_financeiro_total | counter | status, motivo | - | chamadas a CriarFundoFinanceiro (TODO: deferida, ver contrato.md) |
| m016_criar_fundo_financeiro_duration_seconds | histogram | - | s | latencia de CriarFundoFinanceiro (TODO: deferida) |

Job (`ExecutarConciliacaoBancaria`, Async Job — ADR-009):

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m016_job_conciliacao_bancaria_total | counter | resultado | - | execucoes de conciliacao por resultado (sucesso, falha, rejeitada) |
| m016_job_conciliacao_bancaria_duration_seconds | histogram | - | s | duracao da execucao do job de conciliacao |
| m016_job_conciliacao_bancaria_last_success_timestamp_seconds | gauge | - | s | timestamp da ultima conciliacao concluida com sucesso |

Integracao externa (extrato bancario / sistema financeiro — dependencia do contrato.md):

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m016_ext_extrato_bancario_total | counter | status | - | chamadas ao sistema de extrato bancario por resultado |
| m016_ext_extrato_bancario_duration_seconds | histogram | - | s | latencia das chamadas ao extrato bancario |

Gauges de negocio (dominio M016):

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m016_transacoes_pendentes_analise | gauge | - | - | transacoes pendentes de analise no momento (RN09, evento TRANSACAO_PENDENTE_ANALISE) |
| m016_conciliacao_divergencias_abertas | gauge | - | - | divergencias de conciliacao registradas e ainda nao tratadas (RN09) |
| m016_conciliacao_divergencias_total | counter | - | - | divergencias de conciliacao registradas acumuladas (RN04, RN09) |
| m016_transacao_pendente_analise_total | counter | - | - | transacoes que entraram em estado pendente de analise (acumulado) |
| m016_reserva_acao_transversal_saldo_brl | gauge | tipo_origem | brl | saldo disponivel das reservas de Acao Transversal (RN15) |

> Convencao: prefixo `m016_`, snake_case, unidade no sufixo, labels de baixa cardinalidade. NUNCA colocar CPF, nome, email, id de conta/parceria/iniciativa, codigo de conta contabil ou numero de conta bancaria em label de metrica — esses ids entram apenas em atributos de span/log correlacionados por `trace_id`. O label `motivo` deve usar apenas os codigos de recusa fixos do contrato.md (ex.: `saldo_negativo`, `associacao_ausente`, `conta_duplicada`).

## Tracing (SigNoz / OpenTelemetry)

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m016.CriarContaContabil | por operacao CriarContaContabil | tipo_conta, natureza, resultado |
| m016.AssociarContaAoEscopoFinanceiro | por operacao AssociarContaAoEscopoFinanceiro | tipo_associacao, resultado |
| m016.CadastrarContaBancaria | por operacao CadastrarContaBancaria | tipo_associacao, banco, resultado |
| m016.RegistrarMovimentacaoFinanceira | por operacao RegistrarMovimentacaoFinanceira | tipo_movimentacao, resultado, motivo_recusa |
| m016.ConsultarFluxoCaixaESaldos | por operacao ConsultarFluxoCaixaESaldos | tipo_filtro, periodo, resultado |
| m016.ParametrizarPoliticaAcaoTransversal | por operacao ParametrizarPoliticaAcaoTransversal | vigencia, resultado |
| m016.ReceberReservaAcaoTransversal | por operacao ReceberReservaAcaoTransversal | tipo_origem, modulo.origem=M010, resultado |
| m016.CadastrarPlanoAplicacaoAcaoTransversal | por operacao CadastrarPlanoAplicacaoAcaoTransversal | qtd_itens, resultado |
| m016.RegistrarDespesaAcaoTransversal | por operacao RegistrarDespesaAcaoTransversal | resultado, motivo_recusa |
| m016.AnalisarPrestacaoFinanceiraAcaoTransversal | por operacao AnalisarPrestacaoFinanceiraAcaoTransversal | decisao, resultado |
| m016.ConsultarDashboardAcaoTransversal | por operacao ConsultarDashboardAcaoTransversal | tipo_filtro, resultado |
| m016.CriarFundoFinanceiro | por operacao CriarFundoFinanceiro (TODO: deferida, ver contrato.md) | resultado |
| m016.ext.extrato_bancario | por chamada ao sistema de extrato bancario | peer.service, http.status_code, resultado |
| m016.job.ConciliacaoBancaria | por execucao do job de conciliacao | resultado, periodo, divergencias_encontradas, itens_processados |

> Propagar contexto de trace BFF -> Gateway -> M016 -> integracao de extrato bancario. Atributos de span carregam apenas dados nao sensiveis: nunca CPF, nome, email, numero de conta bancaria. Ids de negocio (conta, parceria, reserva) podem ir em atributo de span (correlacao operacional), nunca em label de metrica.

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| taxa de sucesso de RegistrarMovimentacaoFinanceira (status="success" / total) | 99,5% | 30d |
| latencia p95 de RegistrarMovimentacaoFinanceira | < 1s | 30d |
| taxa de sucesso de ConsultarFluxoCaixaESaldos | 99% | 30d |
| latencia p95 de ConsultarFluxoCaixaESaldos | < 2s | 30d |
| taxa de sucesso do job ExecutarConciliacaoBancaria (resultado="sucesso" / total executado) | 99% | 30d |
| taxa de sucesso das chamadas ao extrato bancario (m016.ext.extrato_bancario) | 98% | 30d |
| taxa de sucesso de ReceberReservaAcaoTransversal | 99,5% | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Movimentacao recusada por saldo negativo | `increase(m016_registrar_movimentacao_financeira_total{status="error",motivo="saldo_negativo"}[15m]) > 0` | critical | Verificar conta/escopo e autorizacao de gestor (RN05). TODO: link runbook |
| Falha no extrato bancario | `sum(rate(m016_ext_extrato_bancario_total{status="error"}[10m])) / sum(rate(m016_ext_extrato_bancario_total[10m])) > 0.05` | critical | Checar disponibilidade do sistema de extrato/integracao bancaria. TODO: link runbook |
| Conciliacao nao executou no horario | `time() - m016_job_conciliacao_bancaria_last_success_timestamp_seconds > 86400` | critical | Verificar agendamento Hangfire (ADR-009) e logs do job. TODO: link runbook |
| Job de conciliacao falhando | `increase(m016_job_conciliacao_bancaria_total{resultado="falha"}[1h]) > 0` | warning | Investigar causa da falha por trace m016.job.ConciliacaoBancaria. TODO: link runbook |
| Divergencias de conciliacao acumulando | `m016_conciliacao_divergencias_abertas > 50` | warning | Acionar gestor financeiro para tratar divergencias antes do fechamento (RN09). TODO: link runbook |
| Transacoes pendentes de analise acumulando | `m016_transacoes_pendentes_analise > 100` | warning | Acionar Analista Financeiro (evento TRANSACAO_PENDENTE_ANALISE). TODO: link runbook |
| SLO de movimentacao em risco | `sum(rate(m016_registrar_movimentacao_financeira_total{status="error"}[1h])) / sum(rate(m016_registrar_movimentacao_financeira_total[1h])) > 0.005` | warning | Investigar erros recorrentes de lancamento (associacao ausente, conta invalida). TODO: link runbook |
| Falha ao receber reserva de Acao Transversal | `increase(m016_receber_reserva_acao_transversal_total{status="error"}[30m]) > 0` | warning | Verificar integracao com M010 e classificacao contabil obrigatoria (RN11, RN12). TODO: link runbook |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M016 - Operacoes | rate/errors/duration por operacao do contrato (commands e queries) | Grafana |
| RED M016 - Acao Transversal | rate/errors/duration das operacoes de reserva, plano, despesa e prestacao | Grafana |
| Saude da Conciliacao | execucoes, duracao, ultima execucao com sucesso e divergencias abertas do job | Grafana |
| Integracao Extrato Bancario | latencia e taxa de erro de m016.ext.extrato_bancario | Grafana |
| Gauges de Negocio | transacoes pendentes de analise, divergencias abertas, saldo de reservas (brl) | Grafana |
| Trace explorer M016 | spans m016.* fim-a-fim, filtro por operacao e integracao | SigNoz |
