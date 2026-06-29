# Monitoramento e Observabilidade — M010 Planejamento e Estrategia

Dominio e regras: ver [README.md](README.md) | Contrato: ver [contrato.md](contrato.md) | Eventos: ver eventos-dominio.md (TODO: artefato ainda nao consolidado)

## Objetivo de Sustentacao

Garantir que o nucleo financeiro de Parcerias do M010 permaneca consistente em producao: aportes recebidos das Instituicoes, calculo da Taxa de Gestao de Parcerias, derivacao do `saldoAlocavelEmProgramas` e os aportes Parceria->Programa nao podem produzir saldo negativo (RN14/RN22) nem aporte fora de vigencia (RN13). A sustentacao precisa enxergar, em tempo quase real: volume e latencia das operacoes de comando/consulta do contrato, falhas de registro de aporte (impacto financeiro direto), inventario de negocio (parcerias vigentes, programas ativos, aportes financeiros recebidos, saldo alocavel agregado), saude do job diario de vigencia expirada e a latencia/erro das dependencias internas (M008, M016/Acao Transversal, M003, M014). Como Parcerias possuem entradas financeiras (aportes/saldo), os eventos de aporte e a evolucao do saldo sao cidadaos de primeira classe deste monitoramento.

## Eventos de Negocio Monitorados

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| AporteFinanceiroRegistrado | RegistrarAporteFinanceiro (contrato.md) | counter `m010_aporte_recebido_total{status}` + gauge `m010_aporte_recebido_valor_brl` | Nao | - |
| FalhaRegistroAporteFinanceiro | RegistrarAporteFinanceiro (status="error") | counter `m010_registrar_aporte_financeiro_total{status="error"}` | Sim | critical |
| TaxaGestaoParceriasCalculada | RegistrarAporteFinanceiro (efeito M016) | counter `m010_taxa_gestao_total{status}` | Sim (em erro) | warning |
| FalhaPoliticaTaxaGestao | RegistrarAporteFinanceiro (politica nao encontrada quando obrigatoria) | counter `m010_taxa_gestao_total{status="error"}` | Sim | critical |
| AporteParceriaProgramaRegistrado | RegistrarAporteFinanceiroParceriaPrograma | counter `m010_aporte_programa_total{status}` | Nao | - |
| SaldoAlocavelInsuficiente | RegistrarAporteFinanceiroParceriaPrograma (SALDO_INSUFICIENTE) | counter `m010_aporte_programa_total{status="rejected_saldo"}` | Sim | warning |
| AporteForaDaVigencia | RegistrarAporteFinanceiroParceriaPrograma (PROGRAMA_FORA_DA_VIGENCIA) | counter `m010_aporte_programa_total{status="rejected_vigencia"}` | Sim | warning |
| ParceriaCriada | CriarParceria (emite ParceriaCriada) | counter `m010_criar_parceria_total{status}` + gauge `m010_parcerias_total{estado}` | Nao | - |
| ParceriaFormalizada (Vigente) | FormalizarParceria | counter `m010_formalizar_parceria_total{status}` | Nao | - |
| ParceriaSuspensa | SuspenderParceria | counter `m010_suspender_parceria_total{status}` | Nao | - |
| ParceriaEncerrada / ProgramaEncerradoPorCascata | EncerrarParceria (RI2) | counter `m010_encerrar_parceria_total{status}` + counter `m010_encerramento_cascata_programas_total` | Sim (em erro) | warning |
| VigenciaExpiradaDetectada | Job VerificarVigenciaExpirada (RI2) | counter `m010_vigencias_expiradas_detectadas_total` | Nao | - |
| JobVigenciaNaoExecutado | Job VerificarVigenciaExpirada | gauge `m010_job_verificar_vigencia_expirada_last_success_timestamp_seconds` | Sim | critical |
| ProgramaAtivado | AtivarPrograma | counter `m010_ativar_programa_total{status}` + gauge `m010_programas_total{estado}` | Nao | - |
| ProgramaEncerrado | EncerrarPrograma | counter `m010_encerrar_programa_total{status}` | Nao | - |
| FalhaIntegracaoDependencia | chamadas a M008/M016/M003/M014 | counter `m010_dependencia_erro_total{dependencia}` | Sim | warning |

> Nota: a definicao canonica de cada evento deve viver em `eventos-dominio.md` (TODO: artefato a consolidar). Aqui apenas referenciamos o evento como sinal operacional, sem redefini-lo.

## Metricas (Prometheus)

RED por operacao publica do contrato (counter de rate/erros + histogram de duracao). Counter de rate sempre carrega label `operacao` e `status` (baixa cardinalidade: `success` | `error` | `rejected_*`).

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m010_operacao_total | counter | operacao, status | - | chamadas por operacao do contrato (rate + erros via status) |
| m010_operacao_duration_seconds | histogram | operacao | s | latencia por operacao do contrato |
| m010_registrar_aporte_financeiro_total | counter | status | - | registros de AporteFinanceiro (entrada financeira) |
| m010_registrar_aporte_financeiro_duration_seconds | histogram | - | s | latencia do registro de aporte |
| m010_aporte_programa_total | counter | status | - | aportes Parceria->Programa (status inclui rejected_saldo, rejected_vigencia) |
| m010_taxa_gestao_total | counter | status | - | calculos de Taxa de Gestao de Parcerias disponibilizados ao M016 |
| m010_criar_parceria_total | counter | status | - | criacoes de Parceria |
| m010_formalizar_parceria_total | counter | status | - | transicoes EmElaboracao->Vigente |
| m010_encerrar_parceria_total | counter | status, origem_gatilho | - | encerramentos de Parceria (origem_gatilho: usuario, expiracao_vigencia) |
| m010_encerramento_cascata_programas_total | counter | - | - | Programas encerrados por cascata (RI2) |
| m010_dependencia_erro_total | counter | dependencia | - | erros por dependencia interna (m008, m016, m003, m014) |
| m010_aporte_recebido_valor_brl | gauge | - | brl | valor bruto agregado recebido em aportes (somatorio corrente) |
| m010_saldo_alocavel_programas_brl | gauge | - | brl | saldo alocavel agregado das Parcerias vigentes (derivado RN22) |
| m010_taxa_gestao_valor_brl | gauge | - | brl | valor agregado da Taxa de Gestao de Parcerias (destino M016) |
| m010_parcerias_total | gauge | estado | - | inventario de Parcerias por estado (EmElaboracao, Vigente, Suspensa, Encerrada) |
| m010_parcerias_ativas_total | gauge | - | - | Parcerias no estado Vigente (atalho de negocio) |
| m010_programas_total | gauge | estado | - | inventario de Programas por estado (EM_PLANEJAMENTO, ATIVO, SUSPENSO, ENCERRADO) |
| m010_programas_ativos_total | gauge | - | - | Programas no estado ATIVO (atalho de negocio) |
| m010_planos_estrategicos_ativos_total | gauge | - | - | Planos estrategicos ativos (deve ser sempre 0 ou 1, RN09) |
| m010_vigencias_expiradas_pendentes_total | gauge | - | - | Parcerias com vigencia expirada aguardando confirmacao de encerramento |
| m010_job_verificar_vigencia_expirada_duration_seconds | histogram | - | s | duracao da execucao do job diario |
| m010_job_verificar_vigencia_expirada_last_success_timestamp_seconds | gauge | - | s | timestamp Unix da ultima execucao bem-sucedida do job |
| m010_dependencia_duration_seconds | histogram | dependencia | s | latencia por chamada a dependencia interna |

Convencao aplicada: prefixo `m010_`, `snake_case`, unidade no sufixo (`_seconds`, `_brl`, `_total`), labels de baixa cardinalidade. Nunca `parceriaId`, `instituicaoId`, `programaId`, CPF, nome ou email em label (alta cardinalidade + PII).

## Tracing (SigNoz / OpenTelemetry)

Um span por operacao publica do contrato (`m010.{Operacao}`), span filho por chamada a dependencia interna (`m010.ext.{dep}`) e span por job. Atributos de negocio nao sensiveis apenas (estado, flags, codigos derivados) — nunca dado pessoal.

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m010.RegistrarPlanoEstrategico | por comando | plano.ativo, resultado |
| m010.CadastrarEixoEstrategico | por comando | plano.id, resultado |
| m010.CriarPrograma | por comando | programa.estado, qtd_eixos, resultado |
| m010.RemoverPrograma | por comando | resultado |
| m010.CadastrarComiteGovernanca | por comando | qtd_membros, resultado |
| m010.AtivarPrograma | por comando | programa.estado_anterior, resultado |
| m010.SuspenderPrograma | por comando | resultado |
| m010.ReativarPrograma | por comando | resultado |
| m010.EncerrarPrograma | por comando | tem_iniciativas, resultado |
| m010.AtualizarPrograma | por comando | resultado |
| m010.CriarParceria | por comando | parceria.estado, resultado |
| m010.FormalizarParceria | por comando | parceria.estado, resultado |
| m010.RegistrarAporteFinanceiro | por comando | is_aditivo, acao_transversal_aplicada, resultado |
| m010.EditarAporteFinanceiroAditivo | por comando | resultado |
| m010.RemoverAporteFinanceiroAditivo | por comando | resultado |
| m010.RegistrarVigencia | por comando | is_aditivo, resultado |
| m010.AnexarDocumentoAParceria | por comando | resultado |
| m010.DesanexarDocumentoDaParceria | por comando | resultado |
| m010.RegistrarAporteFinanceiroParceriaPrograma | por comando | dentro_vigencia, saldo_suficiente, resultado |
| m010.SuspenderParceria | por comando | resultado |
| m010.ReativarParceria | por comando | resultado |
| m010.AtualizarParceria | por comando | resultado |
| m010.EncerrarParceria | por comando | origem_gatilho, qtd_programas_cascata, resultado |
| m010.RemoverParceria | por comando | tem_vinculo_programa, resultado |
| m010.ConsultarSaldoParceria | por consulta | resultado |
| m010.ConsultarDashboardLocalParceria | por consulta | qtd_programas, resultado |
| m010.ConsultarDashboardGlobalParcerias | por consulta | tem_filtro, page_size, resultado |
| m010.ConsultarPortfolioEstrategico | por consulta | resultado |
| m010.VerificarVigenciaExpirada | por execucao do job | itens_processados, vigencias_expiradas, resultado |
| m010.ext.m008 | chamada a M008 (Instituicao/Documento/TipoDocumento) | peer.service, http.status_code, resultado |
| m010.ext.m016 | chamada a M016 (ContaBancaria, politica/faixa Acao Transversal) | peer.service, http.status_code, resultado |
| m010.ext.m003 | chamada a M003 (iniciativas por programa / consumo) | peer.service, http.status_code, resultado |
| m010.ext.m014 | chamada a M014 (movimentacoes / prestacoes que alimentam consumo) | peer.service, http.status_code, resultado |

Propagar contexto de trace BFF -> Gateway -> M010 -> dependencia interna para trace fim-a-fim no SigNoz.

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| taxa de sucesso de RegistrarAporteFinanceiro (status != error) | 99,5% | 30d |
| taxa de sucesso de RegistrarAporteFinanceiroParceriaPrograma (excluindo rejeicoes de regra de negocio) | 99% | 30d |
| taxa de sucesso do calculo de Taxa de Gestao de Parcerias | 99,9% | 30d |
| latencia p95 das consultas de dashboard de parceria (Local e Global) | < 2 s | 30d |
| latencia p95 dos comandos transacionais do contrato | < 1,5 s | 30d |
| execucao diaria bem-sucedida do job VerificarVigenciaExpirada | 100% (1x/dia) | 30d |
| disponibilidade efetiva da dependencia M016 (Acao Transversal) vista pelo M010 | 99,5% | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Falha em registro de aporte financeiro | `increase(m010_registrar_aporte_financeiro_total{status="error"}[15m]) > 0` | critical | TODO: runbook registrar-aporte — verificar M008/M016, integridade do Documento (RN12) e politica de Acao Transversal |
| Politica de Acao Transversal indisponivel | `increase(m010_taxa_gestao_total{status="error"}[10m]) > 0` | critical | TODO: runbook acao-transversal — checar parametrizacao de faixas no M016 (Resolucao CCAF 334/2023) |
| SLO de aporte financeiro em risco | `sum(rate(m010_registrar_aporte_financeiro_total{status="error"}[1h])) / sum(rate(m010_registrar_aporte_financeiro_total[1h])) > 0.005` | warning | TODO: runbook slo-aporte — abrir investigacao de erro recorrente |
| Rejeicoes recorrentes por saldo insuficiente | `increase(m010_aporte_programa_total{status="rejected_saldo"}[30m]) > 5` | warning | TODO: runbook saldo-parceria — validar saldo alocavel (RN22) e possivel inconsistencia de derivacao |
| Job de vigencia expirada nao executado | `time() - m010_job_verificar_vigencia_expirada_last_success_timestamp_seconds > 93600` (>26h) | critical | TODO: runbook job-vigencia — checar agendador Hangfire e reexecutar manualmente |
| Job de vigencia expirada lento | `histogram_quantile(0.95, rate(m010_job_verificar_vigencia_expirada_duration_seconds_bucket[1d])) > 600` | warning | TODO: runbook job-vigencia-lento — avaliar volume de parcerias e indices |
| Dependencia interna degradada | `sum by (dependencia) (increase(m010_dependencia_erro_total[15m])) > 10` | warning | TODO: runbook dependencias — verificar saude de M008/M016/M003/M014 |
| Latencia alta de dependencia | `histogram_quantile(0.95, sum by (le,dependencia) (rate(m010_dependencia_duration_seconds_bucket[10m]))) > 3` | warning | TODO: runbook dependencias — checar latencia da dependencia degradada |
| Latencia alta de dashboard de parceria | `histogram_quantile(0.95, rate(m010_operacao_duration_seconds_bucket{operacao=~"ConsultarDashboard.*"}[15m])) > 2` | warning | TODO: runbook dashboard — avaliar query de consolidacao e cache |
| Mais de um plano estrategico ativo | `m010_planos_estrategicos_ativos_total > 1` | critical | TODO: runbook plano-ativo — viola RN09; identificar e corrigir plano duplicado |
| Falha em encerramento de parceria | `increase(m010_encerrar_parceria_total{status="error"}[15m]) > 0` | warning | TODO: runbook encerramento — verificar cascata de Programas (RI2) e estado dos vinculos |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M010 — Operacoes | rate/errors/duration por operacao (`m010_operacao_total`, `m010_operacao_duration_seconds`) | Grafana |
| Financeiro de Parcerias | gauges `m010_aporte_recebido_valor_brl`, `m010_saldo_alocavel_programas_brl`, `m010_taxa_gestao_valor_brl`; rate de aportes recebidos e Parceria->Programa | Grafana |
| Inventario de Negocio | `m010_parcerias_total{estado}`, `m010_parcerias_ativas_total`, `m010_programas_total{estado}`, `m010_programas_ativos_total`, `m010_planos_estrategicos_ativos_total` | Grafana |
| Saude de Jobs | duracao e last_success do job VerificarVigenciaExpirada; `m010_vigencias_expiradas_pendentes_total` | Grafana |
| Integracoes Internas | latencia e erro por dependencia (`m010_dependencia_duration_seconds`, `m010_dependencia_erro_total` por m008/m016/m003/m014) | Grafana |
| Trace explorer M010 | spans `m010.*` e `m010.ext.*` filtrados, foco em RegistrarAporteFinanceiro e cascata de encerramento | SigNoz |
