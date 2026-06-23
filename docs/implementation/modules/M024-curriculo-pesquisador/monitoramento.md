# Monitoramento e Observabilidade — M024 Curriculo do Pesquisador

Dominio e regras: ver [README.md](README.md) | Eventos: ver [eventos-dominio.md](eventos-dominio.md)

## Objetivo de Sustentacao

Garantir que pesquisadores consigam vincular e manter seus curriculos sincronizados com o Lattes do CNPq, que dependem de uma chamada **sincrona** ao adapter [M023/lattes](../M023-integracoes/lattes/README.md). Como `VincularCurriculo` e `SincronizarCurriculo` bloqueiam ate o adapter retornar snapshot ou falhar (HTTP 502 `ADAPTER_LATTES_FALHOU`), a saude do adapter externo e o sinal operacional dominante: a sustentacao precisa enxergar taxa de sucesso/falha da sincronizacao, latencia ate o adapter Lattes e disponibilidade do adapter. Em segundo plano, precisa acompanhar a curadoria de dados — areas de conhecimento vindas do Lattes que nao batem com o cadastro canonico M008 (`AreaConhecimentoNaoMapeada`, RN-M024-06) — e a saude dos jobs recorrentes (sincronizacao mensal e alerta de curriculos desatualizados). Erros de sincronizacao nao deixam estado intermediario persistido (RN-M024-03); portanto o snapshot anterior continua valido e a sustentacao responde ao alerta sem risco de corrupcao de dados.

## Eventos de Negocio Monitorados

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| `PesquisadorVinculado` | [eventos-dominio.md](eventos-dominio.md) | counter `m024_vincular_curriculo_total{status="success"}` | Nao | - |
| `CurriculoAtualizado` | [eventos-dominio.md](eventos-dominio.md) | counter `m024_sincronizar_curriculo_total{status="success"}` | Nao | - |
| `AreaConhecimentoNaoMapeada` | [eventos-dominio.md](eventos-dominio.md) | counter `m024_area_conhecimento_nao_mapeada_total` | Sim | warning |
| `PesquisadorSuspenso` | [eventos-dominio.md](eventos-dominio.md) | counter `m024_pesquisador_suspenso_total` | Nao | - |
| `PesquisadorReativado` | [eventos-dominio.md](eventos-dominio.md) | counter `m024_pesquisador_reativado_total` | Nao | - |
| Falha de sincronizacao (502 `ADAPTER_LATTES_FALHOU`) | [contrato.md](contrato.md) / [eventos-dominio.md](eventos-dominio.md) | counter `m024_sincronizar_curriculo_total{status="error",error_code="ADAPTER_LATTES_FALHOU"}` | Sim | critical |

## Metricas (Prometheus)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| `m024_vincular_curriculo_total` | counter | `status` | - | chamadas a VincularCurriculo (RED rate/errors) |
| `m024_vincular_curriculo_duration_seconds` | histogram | - | s | latencia de VincularCurriculo (inclui 1a sincronizacao sincrona) |
| `m024_sincronizar_curriculo_total` | counter | `status`, `error_code`, `origem` | - | chamadas a SincronizarCurriculo; `origem` = `sob_demanda`/`job` |
| `m024_sincronizar_curriculo_duration_seconds` | histogram | `origem` | s | latencia de SincronizarCurriculo |
| `m024_consultar_curriculo_total` | counter | `status` | - | chamadas a ConsultarCurriculo (RED rate/errors) |
| `m024_consultar_curriculo_duration_seconds` | histogram | - | s | latencia de ConsultarCurriculo |
| `m024_listar_componentes_curriculo_total` | counter | `status` | - | chamadas a ListarComponentesCurriculo |
| `m024_listar_componentes_curriculo_duration_seconds` | histogram | - | s | latencia de ListarComponentesCurriculo |
| `m024_buscar_pesquisadores_expertise_total` | counter | `status` | - | chamadas a BuscarPesquisadoresPorExpertise |
| `m024_buscar_pesquisadores_expertise_duration_seconds` | histogram | - | s | latencia de BuscarPesquisadoresPorExpertise |
| `m024_lattes_adapter_duration_seconds` | histogram | `operacao` | s | latencia da chamada sincrona ao adapter M023/lattes |
| `m024_lattes_adapter_requests_total` | counter | `operacao`, `result` | - | chamadas ao adapter Lattes por dependencia; `result` = `success`/`error` |
| `m024_atualizacao_cooldown_rejeitada_total` | counter | - | - | tentativas rejeitadas por cooldown de 1h (429 ATUALIZACAO_EM_COOLDOWN, RN-M024-08) |
| `m024_area_conhecimento_nao_mapeada_total` | counter | - | - | areas Lattes sem correspondencia M008 (RN-M024-06) |
| `m024_pesquisador_suspenso_total` | counter | - | - | suspensoes processadas (PesquisadorSuspenso) |
| `m024_pesquisador_reativado_total` | counter | - | - | reativacoes processadas (PesquisadorReativado) |
| `m024_pesquisadores_curriculo_valido_total` | gauge | - | - | pesquisadores com curriculo valido (RN-M024-04, <=12 meses) |
| `m024_curriculos_desatualizados_total` | gauge | - | - | curriculos com sincronizacao perto de 12 meses (RN-M024-04) |
| `m024_job_sincronizar_curriculos_duration_seconds` | histogram | `result` | s | duracao do job mensal de sincronizacao |
| `m024_job_sincronizar_curriculos_last_success_timestamp_seconds` | gauge | - | s | epoch da ultima execucao bem-sucedida do job mensal |
| `m024_job_sincronizar_curriculos_itens_total` | counter | `result` | - | curriculos processados pelo job mensal por resultado |
| `m024_job_alertar_desatualizados_duration_seconds` | histogram | `result` | s | duracao do job diario de alerta de desatualizados |
| `m024_job_alertar_desatualizados_last_success_timestamp_seconds` | gauge | - | s | epoch da ultima execucao bem-sucedida do job diario |

## Tracing (SigNoz / OpenTelemetry)

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| `m024.VincularCurriculo` | por chamada a VincularCurriculo | `curriculo.versao`, `status`, `error.code` |
| `m024.SincronizarCurriculo` | por chamada a SincronizarCurriculo | `curriculo.versao`, `origem`, `status`, `error.code` |
| `m024.ConsultarCurriculo` | por chamada a ConsultarCurriculo | `status` |
| `m024.ListarComponentesCurriculo` | por chamada a ListarComponentesCurriculo | `tipo_componente`, `status` |
| `m024.BuscarPesquisadoresPorExpertise` | por chamada a BuscarPesquisadoresPorExpertise | `area.id`, `titulacao_minima`, `status` |
| `m024.ext.lattes` | span filho por chamada sincrona ao adapter M023/lattes | `peer.service=m023-lattes`, `operacao`, `http.status_code`, `result`, `contagens.total` |
| `m024.job.SincronizarCurriculos` | por execucao do job mensal | `result`, `itens_processados`, `itens_falha` |
| `m024.job.AlertarCurriculosDesatualizados` | por execucao do job diario | `result`, `curriculos_alertados` |

> Atributos NAO carregam dado pessoal: nunca `cpf`, `numeroLattes`, nome ou email em label de metrica ou atributo de span. Identificacao para investigacao usa `trace_id`/log estruturado correlacionado.

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| Taxa de sucesso de SincronizarCurriculo (`status="success"` / total) | 99% | 30d |
| Taxa de sucesso de VincularCurriculo (`status="success"` / total) | 99% | 30d |
| Latencia da chamada ao adapter Lattes (`m024_lattes_adapter_duration_seconds` p95) | < 30s | 30d |
| Disponibilidade do adapter M023/lattes (1 - taxa de `ADAPTER_LATTES_FALHOU` 502) | 99% | 30d |
| Latencia de ConsultarCurriculo (p95) | < 1s | 30d |
| Cobertura de curriculos validos (RN-M024-04) | >= 95% dos pesquisadores vinculados | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Adapter Lattes indisponivel | `increase(m024_sincronizar_curriculo_total{status="error",error_code="ADAPTER_LATTES_FALHOU"}[10m]) > 0` e taxa de erro 502 do adapter > 50% em 10m | critical | TODO runbook: verificar saude do adapter M023/lattes e disponibilidade do CNPq Lattes; sincronizacoes falham sem perda do snapshot anterior |
| Taxa de falha de sincronizacao alta | `sum(rate(m024_sincronizar_curriculo_total{status="error"}[15m])) / sum(rate(m024_sincronizar_curriculo_total[15m])) > 0.05` | critical | TODO runbook: inspecionar `error_code` e spans `m024.ext.lattes`; correlacionar por `trace_id` |
| SLO de sincronizacao em risco | error budget de `m024_sincronizar_curriculo_total{status="success"}` queimando > 2% em 30d | warning | TODO runbook: revisar tendencia de falhas do adapter e abrir chamado com M023 |
| Latencia do adapter Lattes degradada | `histogram_quantile(0.95, sum(rate(m024_lattes_adapter_duration_seconds_bucket[15m])) by (le)) > 30` | warning | TODO runbook: checar latencia do CNPq e timeouts do adapter M023/lattes |
| Areas de conhecimento nao mapeadas crescendo | `increase(m024_area_conhecimento_nao_mapeada_total[1d]) > 10` | warning | TODO runbook: acionar curadoria do cadastro canonico de AreaConhecimento em M008 (§1.3.6, RN-M024-06) |
| Job mensal de sincronizacao nao executou | `time() - m024_job_sincronizar_curriculos_last_success_timestamp_seconds > 2678400` (>31d) | critical | TODO runbook: verificar agendamento Hangfire e disparar execucao manual |
| Job diario de alerta nao executou | `time() - m024_job_alertar_desatualizados_last_success_timestamp_seconds > 172800` (>2d) | warning | TODO runbook: verificar agendamento Hangfire do job AlertarCurriculosDesatualizados |
| Cobertura de curriculos validos baixa | `m024_pesquisadores_curriculo_valido_total / (m024_pesquisadores_curriculo_valido_total + m024_curriculos_desatualizados_total) < 0.95` | warning | TODO runbook: revisar curriculos proximos de 12 meses sem sincronizacao (RN-M024-04) |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M024 | rate/errors/duration por operacao do contrato (Vincular, Sincronizar, Consultar, ListarComponentes, BuscarPorExpertise) | Grafana |
| Saude do adapter Lattes | latencia (p50/p95) e taxa de erro de `m024.ext.lattes` / `m024_lattes_adapter_*` por dependencia | Grafana |
| Sincronizacao de curriculos | taxa de sucesso/falha por `origem` (sob_demanda vs job) e error budget do SLO | Grafana |
| Curadoria de dados | `m024_area_conhecimento_nao_mapeada_total`, cobertura de curriculos validos vs desatualizados | Grafana |
| Saude de jobs | duracao, ultimo sucesso e itens processados dos jobs mensal e diario | Grafana |
| Trace explorer | spans `m024.*` (incl. `m024.ext.lattes`) filtrados por `error.code`/`status` | SigNoz |
