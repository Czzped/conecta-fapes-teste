# Monitoramento e Observabilidade — M015 Suspensao e Finalizacao

Dominio e regras: ver [README.md](README.md) | Eventos: ver [eventos-dominio.md](eventos-dominio.md)

## Objetivo de Sustentacao

Garantir que o fluxo digital de suspensao, reativacao e finalizacao de iniciativas opere de forma confiavel e auditavel em producao. A sustentacao precisa enxergar:

- que toda suspensao aprovada efetivamente disparou o bloqueio de pagamentos (M004) e o impedimento de novas alocacoes de bolsa (M009), sem falha silenciosa;
- que solicitacoes de suspensao e reativacao nao fiquem acumuladas aguardando decisao da Area Tecnica alem do esperado;
- que finalizacoes so concluam apos verificacao integral de pendencias em M009 e M014, sem encerrar iniciativa com pendencia aberta (RN04, RN05);
- que a irreversibilidade do encerramento (RN06) e a trilha de auditoria (RN07) sejam preservadas;
- que as integracoes internas (M003, M004, M009, M014) consultadas para verificacao de pendencias estejam saudaveis (latencia e taxa de erro por dependencia).

## Eventos de Negocio Monitorados

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| SUSPENSAO_SOLICITADA | eventos-dominio.md | counter m015_solicitar_suspensao_iniciativa_total{status="success"} + gauge m015_suspensoes_pendentes_aprovacao_total | Sim | warning |
| SUSPENSAO_APROVADA | eventos-dominio.md | counter m015_decidir_solicitacao_suspensao_total{status="success",decisao="aprovada"} | Sim (se bloqueio M004/M009 falhar) | critical |
| SUSPENSAO_REJEITADA | eventos-dominio.md | counter m015_decidir_solicitacao_suspensao_total{status="success",decisao="rejeitada"} | Nao | - |
| REATIVACAO_SOLICITADA | eventos-dominio.md | gauge m015_reativacoes_pendentes_aprovacao_total | Sim | warning |
| REATIVACAO_DEFERIDA | eventos-dominio.md | counter m015_reativar_iniciativa_suspensa_total{status="success"} | Nao | - |
| Finalizacao concluida com pendencia aberta (violacao RN04/RN05) | contrato.md ConcluirFinalizacaoIniciativa | counter m015_concluir_finalizacao_iniciativa_total{status="error",motivo="pendencias_abertas"} | Sim | critical |

## Metricas (Prometheus)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m015_solicitar_suspensao_iniciativa_total | counter | status, origem | - | chamadas a SolicitarSuspensaoIniciativa (origem: ortogado/agencia) |
| m015_solicitar_suspensao_iniciativa_duration_seconds | histogram | operacao | s | latencia de SolicitarSuspensaoIniciativa |
| m015_decidir_solicitacao_suspensao_total | counter | status, decisao | - | chamadas a DecidirSolicitacaoSuspensao (decisao: aprovada/rejeitada) |
| m015_decidir_solicitacao_suspensao_duration_seconds | histogram | operacao | s | latencia de DecidirSolicitacaoSuspensao |
| m015_reativar_iniciativa_suspensa_total | counter | status | - | chamadas a ReativarIniciativaSuspensa |
| m015_reativar_iniciativa_suspensa_duration_seconds | histogram | operacao | s | latencia de ReativarIniciativaSuspensa |
| m015_solicitar_finalizacao_iniciativa_total | counter | status, motivo | - | chamadas a SolicitarFinalizacaoIniciativa (motivo: conclusao_natural/ortogado/agencia) |
| m015_solicitar_finalizacao_iniciativa_duration_seconds | histogram | operacao | s | latencia de SolicitarFinalizacaoIniciativa |
| m015_concluir_finalizacao_iniciativa_total | counter | status, motivo | - | chamadas a ConcluirFinalizacaoIniciativa (motivo de erro: pendencias_abertas/nao_elegivel) |
| m015_concluir_finalizacao_iniciativa_duration_seconds | histogram | operacao | s | latencia de ConcluirFinalizacaoIniciativa |
| m015_consultar_pendencias_finalizacao_total | counter | status | - | chamadas a ConsultarPendenciasDeFinalizacao |
| m015_consultar_pendencias_finalizacao_duration_seconds | histogram | operacao | s | latencia de ConsultarPendenciasDeFinalizacao |
| m015_suspensoes_pendentes_aprovacao_total | gauge | - | - | solicitacoes de suspensao aguardando decisao da Area Tecnica |
| m015_reativacoes_pendentes_aprovacao_total | gauge | - | - | reativacoes aguardando aprovacao da Area Tecnica |
| m015_finalizacoes_em_verificacao_pendencias_total | gauge | - | - | finalizacoes em estado VERIFICANDO_PENDENCIAS |
| m015_ext_dependencia_duration_seconds | histogram | dependencia | s | latencia por chamada a modulo vizinho (M003/M004/M009/M014) |
| m015_ext_dependencia_total | counter | dependencia, status | - | chamadas a modulo vizinho por dependencia e resultado |

## Tracing (SigNoz / OpenTelemetry)

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m015.SolicitarSuspensaoIniciativa | por chamada da operacao do contrato | iniciativa.id, suspensao.origem |
| m015.DecidirSolicitacaoSuspensao | por chamada da operacao do contrato | solicitacao.codigo, decisao |
| m015.ReativarIniciativaSuspensa | por chamada da operacao do contrato | iniciativa.id |
| m015.SolicitarFinalizacaoIniciativa | por chamada da operacao do contrato | iniciativa.id, finalizacao.motivo |
| m015.ConcluirFinalizacaoIniciativa | por chamada da operacao do contrato | solicitacao.codigo, pendencias.resultado |
| m015.ConsultarPendenciasDeFinalizacao | por chamada da operacao do contrato | iniciativa.id, pendencias.total |
| m015.ext.M004 | ao acionar bloqueio de pagamentos apos suspensao aprovada | peer.service, http.status_code, resultado |
| m015.ext.M009 | ao verificar/encerrar bolsas e impedir alocacao | peer.service, http.status_code, bolsas.ativas |
| m015.ext.M014 | ao verificar prestacoes de contas para finalizacao | peer.service, http.status_code, prestacoes.pendentes |
| m015.ext.M003 | ao obter/atualizar estado da iniciativa | peer.service, http.status_code, iniciativa.estado |

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| taxa de sucesso de DecidirSolicitacaoSuspensao (suspensao aprovada com bloqueio M004/M009 efetivado) | 99,5% | 30d |
| taxa de sucesso de ConcluirFinalizacaoIniciativa sem violacao de RN04/RN05 | 100% | 30d |
| latencia p95 de ConsultarPendenciasDeFinalizacao | < 3s | 30d |
| taxa de sucesso por dependencia interna (m015.ext.*) | 99% | 30d |
| tempo medio de processamento de suspensao (solicitacao -> decisao) | TODO definir meta com PO | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Falha ao efetivar bloqueio pos-suspensao | `increase(m015_decidir_solicitacao_suspensao_total{status="error",decisao="aprovada"}[15m]) > 0` ou `increase(m015_ext_dependencia_total{dependencia=~"M004|M009",status="error"}[15m]) > 0` | critical | TODO runbook: verificar integracao M004/M009; suspensao aprovada sem bloqueio expoe risco financeiro |
| Finalizacao com pendencia aberta | `increase(m015_concluir_finalizacao_iniciativa_total{status="error",motivo="pendencias_abertas"}[1h]) > 0` | critical | TODO runbook: encerramento bloqueado por RN04/RN05; revisar pendencias M009/M014 |
| Suspensoes pendentes de aprovacao acumulando | `m015_suspensoes_pendentes_aprovacao_total > 20` | warning | TODO runbook: acionar Area Tecnica para decisao |
| Reativacoes pendentes de aprovacao acumulando | `m015_reativacoes_pendentes_aprovacao_total > 10` | warning | TODO runbook: acionar Area Tecnica para aprovacao |
| Dependencia interna degradada | `histogram_quantile(0.95, rate(m015_ext_dependencia_duration_seconds_bucket[10m])) > 5` | warning | TODO runbook: verificar saude de M003/M004/M009/M014 |
| SLO de finalizacao em risco | `rate(m015_concluir_finalizacao_iniciativa_total{status="error"}[6h]) > 0` | warning | TODO runbook: investigar elegibilidade e verificacao de pendencias |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M015 | rate/errors/duration por operacao do contrato | Grafana |
| Suspensoes e reativacoes pendentes | gauges m015_suspensoes_pendentes_aprovacao_total, m015_reativacoes_pendentes_aprovacao_total | Grafana |
| Finalizacoes em verificacao | gauge m015_finalizacoes_em_verificacao_pendencias_total + taxa de erro por motivo | Grafana |
| Saude de dependencias internas | latencia e taxa de erro por dependencia (M003/M004/M009/M014) | Grafana |
| Trace explorer | spans m015.* (operacoes e m015.ext.*) | SigNoz |
