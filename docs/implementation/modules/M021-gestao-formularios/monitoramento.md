# Monitoramento e Observabilidade — M021 Gestao de Formularios Dinamicos

Dominio e regras: ver [README.md](README.md) | Eventos: ver [contrato.md](contrato.md)

## Objetivo de Sustentacao

Garantir que a base central de formularios reutilizaveis e versionados esteja sempre disponivel e integra para os modulos consumidores (especialmente o M011). A sustentacao precisa enxergar: que formularios e versoes estao publicados/ativos para selecao, se as submissoes/operacoes de configuracao estao sendo processadas sem erro, se a validacao de estrutura esta rejeitando publicacoes indevidamente, e se a renderizacao/consulta de versoes responde dentro de latencia aceitavel — ja que uma versao publicada com defeito ou indisponivel impacta diretamente a configuracao de captacoes em todos os modulos que dependem dela.

## Eventos de Negocio Monitorados

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| FormularioCriado | contrato.md | counter m021_formularios_criados_total | Nao | - |
| VersaoFormularioPublicada | contrato.md | counter m021_versoes_publicadas_total | Sim | warning |
| FormularioInativado | contrato.md | counter m021_formularios_inativados_total | Nao | - |
| Falha de validacao de estrutura na publicacao | contrato.md (RN05-RN07, PublicarVersaoFormulario) | counter m021_validacao_falha_total{operacao} | Sim | warning |

## Metricas (Prometheus)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m021_criar_formulario_total | counter | status | - | chamadas a CriarFormulario |
| m021_criar_formulario_duration_seconds | histogram | operacao | s | latencia de CriarFormulario |
| m021_classificar_formulario_total | counter | status | - | chamadas a ClassificarFormulario |
| m021_classificar_formulario_duration_seconds | histogram | operacao | s | latencia de ClassificarFormulario |
| m021_criar_versao_formulario_total | counter | status | - | chamadas a CriarVersaoFormulario |
| m021_criar_versao_formulario_duration_seconds | histogram | operacao | s | latencia de CriarVersaoFormulario |
| m021_configurar_estrutura_formulario_total | counter | status | - | chamadas a ConfigurarEstruturaFormulario |
| m021_configurar_estrutura_formulario_duration_seconds | histogram | operacao | s | latencia de ConfigurarEstruturaFormulario |
| m021_publicar_versao_formulario_total | counter | status | - | chamadas a PublicarVersaoFormulario (submit de versao) |
| m021_publicar_versao_formulario_duration_seconds | histogram | operacao | s | latencia de PublicarVersaoFormulario (submit latency) |
| m021_inativar_formulario_total | counter | status | - | chamadas a InativarFormulario |
| m021_inativar_formulario_duration_seconds | histogram | operacao | s | latencia de InativarFormulario |
| m021_listar_formularios_publicados_total | counter | status | - | chamadas a ListarFormulariosPublicados |
| m021_listar_formularios_publicados_duration_seconds | histogram | operacao | s | latencia de ListarFormulariosPublicados |
| m021_consultar_versao_formulario_total | counter | status | - | chamadas a ConsultarVersaoFormulario (render de versao) |
| m021_consultar_versao_formulario_duration_seconds | histogram | operacao | s | latencia de ConsultarVersaoFormulario (render latency) |
| m021_validacao_falha_total | counter | operacao | - | falhas de validacao de estrutura (RN05-RN07) |
| m021_formularios_publicados_ativos | gauge | tipo, finalidade | - | formularios publicados e ativos disponiveis para selecao |
| m021_versoes_publicadas_ativas | gauge | tipo | - | versoes publicadas e ativas selecionaveis por outros modulos |
| m021_submissoes_versao_total | counter | status | - | submissoes de versao para publicacao (rate/errors) |

## Tracing (SigNoz / OpenTelemetry)

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m021.CriarFormulario | por execucao de CriarFormulario | formulario.tipo, formulario.finalidade |
| m021.ClassificarFormulario | por execucao de ClassificarFormulario | formulario.id, formulario.tipo, formulario.finalidade |
| m021.CriarVersaoFormulario | por execucao de CriarVersaoFormulario | formulario.id, versao.base_id |
| m021.ConfigurarEstruturaFormulario | por execucao de ConfigurarEstruturaFormulario | versao.id, qtd_secoes, qtd_campos |
| m021.PublicarVersaoFormulario | por execucao de PublicarVersaoFormulario | versao.id, resultado_validacao |
| m021.InativarFormulario | por execucao de InativarFormulario | formulario.id |
| m021.ListarFormulariosPublicados | por execucao de ListarFormulariosPublicados | filtro.tipo, filtro.finalidade |
| m021.ConsultarVersaoFormulario | por execucao de ConsultarVersaoFormulario | formulario.id, versao.id |
| m021.ext.M008 | por chamada ao M008 (resolver responsavel pela criacao/publicacao) | peer.service, http.status_code |

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| taxa de sucesso de PublicarVersaoFormulario (status != error) | 99% | 30d |
| taxa de sucesso de ConsultarVersaoFormulario (render de versao) | 99,9% | 30d |
| latencia p95 de ConsultarVersaoFormulario | < 500 ms | 30d |
| taxa de sucesso de ListarFormulariosPublicados | 99,9% | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Falha de publicacao de versao | `rate(m021_publicar_versao_formulario_total{status="error"}[5m]) > 0` | warning | TODO runbook |
| Indisponibilidade de consulta de versao | `rate(m021_consultar_versao_formulario_total{status="error"}[5m]) / rate(m021_consultar_versao_formulario_total[5m]) > 0.001` | critical | TODO runbook |
| Latencia alta na renderizacao de versao | `histogram_quantile(0.95, rate(m021_consultar_versao_formulario_duration_seconds_bucket[5m])) > 0.5` | warning | TODO runbook |
| Pico de falhas de validacao de estrutura | `rate(m021_validacao_falha_total[15m]) > 0` | warning | TODO runbook |
| Falha de integracao com M008 | `rate(m021_publicar_versao_formulario_total{status="error"}[5m]) > 0 and on() trace m021.ext.M008 http.status_code >= 500` | warning | TODO runbook |
| SLO de publicacao em risco | `sum(rate(m021_publicar_versao_formulario_total{status="error"}[1h])) / sum(rate(m021_publicar_versao_formulario_total[1h])) > 0.01` | critical | TODO runbook |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M021 | rate/errors/duration por operacao do contrato | Grafana |
| Formularios publicados/ativos | gauges m021_formularios_publicados_ativos e m021_versoes_publicadas_ativas por tipo/finalidade | Grafana |
| Submissoes e validacao | rate/errors de m021_submissoes_versao_total e m021_validacao_falha_total | Grafana |
| Latencia render/submit | p50/p95/p99 de ConsultarVersaoFormulario e PublicarVersaoFormulario | Grafana |
| Saude da integracao M008 | latencia e taxa de erro do span m021.ext.M008 | Grafana |
| Trace explorer | spans m021.* | SigNoz |
