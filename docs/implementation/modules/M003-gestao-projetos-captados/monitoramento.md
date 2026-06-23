# Monitoramento e Observabilidade — M003 Gestao de Iniciativas Captadas (inclui Diarias)

Dominio e regras: ver [README.md](README.md) | Eventos: ver [eventos-dominio.md](eventos-dominio.md)

## Objetivo de Sustentacao

A equipe de sustentacao precisa garantir que a gestao pos-contratacao da `Projeto` e seus subfluxos financeiros operem sem perda de rastreabilidade nem comprometimento indevido de saldo de rubrica. Os pontos criticos sao:

- **Diarias**: a `SolicitacaoDiaria` aloca/compromete saldo na rubrica de Diarias e Passagens na criacao (RN29-RN30). Falha no calculo, no debito ou na reversao (RN33) gera divergencia financeira na execucao consolidada da projeto. O aceite do bolsista (RN26) e o ponto que move a solicitacao para `APROVADA`; aceites pendentes acumulados sinalizam viagens em risco de nao se concretizar.
- **Liberacao de parcelas**: a validacao automatica (RN43-RN50) depende de integracoes vivas com M014 (estado da PCTF), M008 (inadimplencia/certidoes) e da emissao do evento para o M004 (executor do pagamento). Falha ou indisponibilidade dessas dependencias bloqueia liberacao de recursos.
- **Execucao consolidada**: `LancamentoExecucao` (RN10, RN31) deve refletir todo comprometimento e reversao de diaria; lancamentos duplicados ou perdidos corrompem o saldo por rubrica exibido em **Meu Projeto** (RN42).
- **Integracoes externas**: M008, M009, M014, M004 e M020 devem ter latencia e taxa de erro observadas por dependencia.

Sem esses sinais, a sustentacao nao consegue distinguir erro de negocio (saldo insuficiente, certidao vencida) de falha tecnica (dependencia fora do ar).

## Eventos de Negocio Monitorados

Eventos referenciados de [eventos-dominio.md](eventos-dominio.md) (fonte unica do mapeamento `evento -> tipo -> destinatario -> canal` no [catalogo M020](../M020-comunicacao/notificacoes/catalogo-eventos.md)).

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| DIARIA_ACEITE_PENDENTE | eventos-dominio.md | gauge `m003_diarias_aceite_pendente_total` + counter `m003_diaria_aceite_pendente_total` | Sim | warning |
| DIARIA_PARCELA_DEFERIDA | eventos-dominio.md | counter `m003_liberacao_parcela_total{resultado="deferida"}` | Nao | - |
| DIARIA_PARCELA_REJEITADA | eventos-dominio.md | counter `m003_liberacao_parcela_total{resultado="rejeitada"}` | Sim | warning |
| Saldo insuficiente na criacao de diaria (RN29) | README.md RN29 / contrato SolicitarDiaria | counter `m003_solicitar_diaria_total{status="error",motivo="saldo_insuficiente"}` | Sim | warning |
| Reversao de comprometimento ausente apos recusa/remocao/regularizacao (RN33) | README.md RN33 / eventos-dominio.md | counter `m003_diaria_reversao_total{resultado="error"}` | Sim | critical |
| Falha de integracao externa em validacao de parcela (M008/M014) | contrato Dependencias / RN46-RN47 | counter `m003_ext_total{dependencia,status="error"}` | Sim | critical |

> Nota: o nome de evento de dominio em PascalCase ainda nao foi estabilizado (stub em eventos-dominio.md). Os sinais acima referenciam `eventoOrigem` do M020. TODO: reavaliar quando o evento de dominio for nomeado.

## Metricas (Prometheus)

RED por operacao publica do [contrato.md](contrato.md). Convencao: prefixo `m003_`, `snake_case`, sufixo de unidade, labels de baixa cardinalidade. Nunca CPF/nome/email/id de entidade em label.

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m003_registrar_projeto_total | counter | status | - | RegistrarProjetoContratada por status |
| m003_registrar_projeto_duration_seconds | histogram | - | s | latencia RegistrarProjetoContratada |
| m003_criar_versao_plano_total | counter | status | - | CriarVersaoPlanoProjeto por status |
| m003_criar_versao_plano_duration_seconds | histogram | - | s | latencia CriarVersaoPlanoProjeto |
| m003_ativar_versao_plano_total | counter | status | - | AtivarVersaoPlanoProjeto por status |
| m003_ativar_versao_plano_duration_seconds | histogram | - | s | latencia AtivarVersaoPlanoProjeto |
| m003_solicitar_alteracao_rubrica_total | counter | status, tipo_alteracao | - | SolicitarAlteracaoRubrica por status |
| m003_solicitar_alteracao_rubrica_duration_seconds | histogram | - | s | latencia SolicitarAlteracaoRubrica |
| m003_decidir_alteracao_rubrica_total | counter | status, decisao | - | DecidirSolicitacaoAlteracaoRubrica por status |
| m003_decidir_alteracao_rubrica_duration_seconds | histogram | - | s | latencia DecidirSolicitacaoAlteracaoRubrica |
| m003_solicitar_diaria_total | counter | status, motivo | - | SolicitarDiaria por status (motivo so em error: saldo_insuficiente, tipo_ausente, alocacao_invalida) |
| m003_solicitar_diaria_duration_seconds | histogram | - | s | latencia SolicitarDiaria (inclui calculo + debito) |
| m003_registrar_aceite_diaria_total | counter | status | - | RegistrarAceiteDiaria por status |
| m003_registrar_aceite_diaria_duration_seconds | histogram | - | s | latencia RegistrarAceiteDiaria |
| m003_registrar_recusa_diaria_total | counter | status | - | RegistrarRecusaDiaria por status |
| m003_registrar_recusa_diaria_duration_seconds | histogram | - | s | latencia RegistrarRecusaDiaria |
| m003_remover_diaria_total | counter | status | - | RemoverSolicitacaoDiaria por status |
| m003_remover_diaria_duration_seconds | histogram | - | s | latencia RemoverSolicitacaoDiaria |
| m003_regularizar_diaria_total | counter | status | - | RegularizarDiariaNaoUtilizada por status |
| m003_regularizar_diaria_duration_seconds | histogram | - | s | latencia RegularizarDiariaNaoUtilizada |
| m003_registrar_lancamento_execucao_total | counter | status, tipo | - | RegistrarLancamentoExecucao por status |
| m003_registrar_lancamento_execucao_duration_seconds | histogram | - | s | latencia RegistrarLancamentoExecucao |
| m003_consultar_projeto_consolidada_total | counter | status | - | ConsultarProjetoConsolidada por status |
| m003_consultar_projeto_consolidada_duration_seconds | histogram | - | s | latencia ConsultarProjetoConsolidada |
| m003_consultar_projetos_por_programa_total | counter | status | - | ConsultarProjetosPorPrograma por status |
| m003_consultar_projetos_por_programa_duration_seconds | histogram | - | s | latencia ConsultarProjetosPorPrograma |
| m003_consultar_projetos_por_parceria_total | counter | status | - | ConsultarProjetosPorParceria por status |
| m003_consultar_projetos_por_parceria_duration_seconds | histogram | - | s | latencia ConsultarProjetosPorParceria |
| m003_consultar_execucao_consolidada_total | counter | status | - | ConsultarExecucaoConsolidadaProjeto por status |
| m003_consultar_execucao_consolidada_duration_seconds | histogram | - | s | latencia ConsultarExecucaoConsolidadaProjeto |
| m003_consultar_ciclo_fomento_total | counter | status | - | ConsultarCicloFomentoProjeto por status |
| m003_consultar_ciclo_fomento_duration_seconds | histogram | - | s | latencia ConsultarCicloFomentoProjeto |
| m003_consultar_solicitacoes_diaria_total | counter | status | - | ConsultarSolicitacoesDiaria por status |
| m003_consultar_solicitacoes_diaria_duration_seconds | histogram | - | s | latencia ConsultarSolicitacoesDiaria |
| m003_consultar_solicitacao_diaria_total | counter | status | - | ConsultarSolicitacaoDiaria por status |
| m003_consultar_solicitacao_diaria_duration_seconds | histogram | - | s | latencia ConsultarSolicitacaoDiaria |
| m003_diarias_aceite_pendente_total | gauge | - | - | diarias em estado ALOCADA aguardando aceite do bolsista (RN26) |
| m003_diaria_aceite_pendente_total | counter | - | - | aceites de diaria que entraram em estado pendente (DIARIA_ACEITE_PENDENTE) |
| m003_diaria_reversao_total | counter | resultado, origem | - | reversoes de comprometimento por recusa/remocao/regularizacao (RN33); origem in [recusa, remocao, regularizacao] |
| m003_liberacao_parcela_total | counter | resultado | - | resultados de validacao de liberacao de parcela; resultado in [deferida, rejeitada] (RN49) |
| m003_parcelas_liberadas_total | gauge | - | - | parcelas com liberacao deferida aguardando execucao de pagamento pelo M004 |
| m003_validacao_parcela_bloqueada_total | counter | motivo | - | validacoes bloqueadas; motivo in [inadimplencia, certidao_invalida, pctf_insuficiente, comprometimento_insuficiente] (RN44-RN46) |
| m003_ext_total | counter | dependencia, status | - | chamadas a integracao externa; dependencia in [m008, m009, m014, m004, m020] |
| m003_ext_duration_seconds | histogram | dependencia | s | latencia por dependencia externa |

> TODO: avaliar gauge de saldo por rubrica (`m003_rubrica_saldo_disponivel_brl`) — depende de definicao canonica de RN-SLD01 e de cardinalidade aceitavel de label de rubrica; nao monitorar id de projeto. Jobs Hangfire: nenhum job recorrente identificado no contrato.md atual; TODO confirmar com modelo comportamental (a definir no M003).

## Tracing (SigNoz / OpenTelemetry)

Um span por operacao publica do contrato (`m003.{Operacao}`); span filho por chamada externa (`m003.ext.{dependencia}`). Atributos de negocio nao sensiveis apenas — nunca CPF, nome, email ou conta bancaria.

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m003.RegistrarProjetoContratada | por operacao do contrato | tipo_projeto.id, origem_captacao.id |
| m003.CriarVersaoPlanoProjeto | por operacao do contrato | projeto.id, versao |
| m003.AtivarVersaoPlanoProjeto | por operacao do contrato | projeto.id, versao |
| m003.SolicitarAlteracaoRubrica | por operacao do contrato | projeto.id, rubrica.id, tipo_alteracao |
| m003.DecidirSolicitacaoAlteracaoRubrica | por operacao do contrato | solicitacao.id, decisao |
| m003.SolicitarDiaria | por operacao do contrato | projeto.id, abrangencia.codigo, estado_resultante, motivo_recusa |
| m003.RegistrarAceiteDiaria | por operacao do contrato | solicitacao_diaria.id, estado_resultante |
| m003.RegistrarRecusaDiaria | por operacao do contrato | solicitacao_diaria.id, gerou_credito |
| m003.RemoverSolicitacaoDiaria | por operacao do contrato | solicitacao_diaria.id, gerou_credito |
| m003.RegularizarDiariaNaoUtilizada | por operacao do contrato | solicitacao_diaria.id, gerou_credito |
| m003.RegistrarLancamentoExecucao | por operacao do contrato | projeto.id, rubrica.id, tipo, origem |
| m003.ConsultarProjetoConsolidada | por operacao do contrato | projeto.id |
| m003.ConsultarExecucaoConsolidadaProjeto | por operacao do contrato | projeto.id |
| m003.ConsultarCicloFomentoProjeto | por operacao do contrato | projeto.id |
| m003.ConsultarSolicitacoesDiaria | por operacao do contrato | projeto.id, estado_filtro |
| m003.ConsultarSolicitacaoDiaria | por operacao do contrato | solicitacao_diaria.id |
| m003.ext.m008 | consulta abrangencia/tipo diaria/parametro calculo, inadimplencia, certidoes (RN28, RN46) | peer.service, http.status_code, resultado_negocio |
| m003.ext.m009 | validacao de AlocacaoBolsista (RN23) | peer.service, http.status_code, alocacao.ref |
| m003.ext.m014 | consulta estado da PCTF anterior (RN47) | peer.service, http.status_code, pctf.estado |
| m003.ext.m004 | emissao de evento de liberacao de parcela para execucao de pagamento (RN49) | peer.service, http.status_code, resultado_negocio |
| m003.ext.m020 | envio de notificacao de aceite de diaria ao bolsista (RN26) | peer.service, http.status_code |

> TODO: span de job Hangfire (`m003.job.{nome}`) a definir quando o modelo comportamental confirmar jobs recorrentes (ex.: lembrete de aceite pendente, varredura de diaria nao utilizada apos a partida).

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| taxa de sucesso de SolicitarDiaria (status != error tecnico; saldo_insuficiente conta como sucesso de negocio) | 99% | 30d |
| latencia p95 de SolicitarDiaria (calculo + debito) | < 3 s | 30d |
| taxa de reversao de comprometimento concluida sem erro apos recusa/remocao/regularizacao (RN33) | 100% | 30d |
| taxa de sucesso de validacao de liberacao de parcela sem falha tecnica de integracao (RN43-RN49) | 99% | 30d |
| disponibilidade das integracoes M008/M014 usadas na validacao de parcela (1 - taxa de erro por dependencia) | 99,5% | 30d |
| latencia p95 das consultas (ConsultarProjetoConsolidada, ConsultarExecucaoConsolidadaProjeto) | < 1 s | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Reversao de diaria falhando | `increase(m003_diaria_reversao_total{resultado="error"}[15m]) > 0` | critical | Saldo de rubrica pode ficar inconsistente. Verificar lancamento de credito x SolicitacaoDiaria (RN31, RN33). TODO: link runbook |
| SolicitarDiaria com erro tecnico elevado | `sum(rate(m003_solicitar_diaria_total{status="error",motivo!="saldo_insuficiente",motivo!="alocacao_invalida"}[10m])) / sum(rate(m003_solicitar_diaria_total[10m])) > 0.01` | warning | SLO de SolicitarDiaria em risco. Investigar M008 (calculo) e debito de rubrica. TODO: link runbook |
| Integracao externa em falha | `sum(rate(m003_ext_total{status="error"}[10m])) by (dependencia) / sum(rate(m003_ext_total[10m])) by (dependencia) > 0.05` | critical | Validacao de parcela e calculo de diaria dependem de M008/M014. Checar saude da dependencia. TODO: link runbook |
| Latencia de dependencia externa alta | `histogram_quantile(0.95, sum(rate(m003_ext_duration_seconds_bucket[10m])) by (le, dependencia)) > 5` | warning | Dependencia degradada impacta latencia de SolicitarDiaria e liberacao. TODO: link runbook |
| Aceites de diaria pendentes acumulando | `m003_diarias_aceite_pendente_total > 50` | warning | Bolsistas nao aceitam; viagens podem nao se concretizar e saldo fica comprometido. Verificar entrega de notificacao via M020 (DIARIA_ACEITE_PENDENTE). TODO: definir threshold real e link runbook |
| Liberacao de parcela rejeitada em volume | `increase(m003_liberacao_parcela_total{resultado="rejeitada"}[1h]) > 10` | warning | Pode indicar regra/integracao quebrada (PCTF, certidoes). Revisar motivos em m003_validacao_parcela_bloqueada_total. TODO: definir threshold real e link runbook |
| Parcelas deferidas sem execucao de pagamento | `m003_parcelas_liberadas_total > 0 and increase(m003_ext_total{dependencia="m004"}[30m]) == 0` | critical | Evento de liberacao emitido mas M004 nao consome. Checar fila/integracao M004 (RN49). TODO: link runbook |
| SLO de validacao de parcela em risco | `sum(rate(m003_liberacao_parcela_total[1h]))` com taxa de falha tecnica acima do error budget | warning | SLO 99% em risco. Revisar dependencias e validacao automatica. TODO: definir expr final e link runbook |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M003 — Diarias | rate/errors/duration de SolicitarDiaria, RegistrarAceiteDiaria, RegistrarRecusaDiaria, RemoverSolicitacaoDiaria, RegularizarDiariaNaoUtilizada | Grafana |
| RED M003 — Projeto e Plano | rate/errors/duration de RegistrarProjetoContratada, CriarVersaoPlanoProjeto, AtivarVersaoPlanoProjeto, alteracao de rubrica | Grafana |
| RED M003 — Consultas | rate/errors/duration das operacoes de consulta consolidada e ciclo de fomento | Grafana |
| Negocio — Diarias e Parcelas | gauges m003_diarias_aceite_pendente_total, m003_parcelas_liberadas_total; counters de reversao, liberacao deferida/rejeitada e motivos de bloqueio | Grafana |
| Integracoes externas | latencia (p95) e taxa de erro por dependencia (m008, m009, m014, m004, m020) | Grafana |
| Trace explorer | spans m003.* (operacoes) e m003.ext.* (dependencias), fim-a-fim BFF -> Gateway -> M003 -> externa | SigNoz |
