# Monitoramento e Observabilidade — M023 Integracoes

Dominio e regras: ver [README.md](README.md) | Contrato: ver [contrato.md](contrato.md)

> Modulo de **integracoes com sistemas externos**: hospeda adapters plugaveis (E-Docs ES V2 para assinatura eletronica qualificada; Lattes e ORCID para importacao de curriculo). Por ser o ponto de contato com APIs de terceiros, os sinais mais importantes sao **latencia, taxa de erro, timeouts, retries e deteccao de conclusao por polling** — por operacao e por provedor.

## Objetivo de Sustentacao

A equipe de sustentacao precisa garantir que:

1. Documentos enviados para assinatura sao **capturados no E-Docs** e que a **conclusao da assinatura e detectada via polling** (RN05/RN06) dentro de uma janela aceitavel — o E-Docs V2 nao expoe webhook (pendencia 1 do adapter), entao toda deteccao depende do job `ReconciliarAssinaturas` rodando a cada 5 min.
2. Cada **dependencia externa** (E-Docs API V2, Acesso Cidadao OAuth, MinIO E-Docs, fonte Lattes, ORCID Public API) tem **latencia e taxa de erro observaveis por provedor**, de modo que uma degradacao do terceiro seja distinguivel de um bug do Conecta.
3. **Recusas, erros e expiracoes** de assinatura (RN07, RN08, RN10) viram sinal e nao silencio — sao eventos com impacto juridico/operacional (bloqueiam formalizacao de bolsa, outorga, parcerias).
4. Os **jobs recorrentes** (polling de 5 min, alerta diario 09:00, expiracao diaria 03:00) executam no horario e nao acumulam atraso/backlog.
5. A janela de **upload temporario para o MinIO** (RN12 — URL expira em segundos) e os **limites do provedor** (RN11 — PDF E-Docs ate 250 MB) nao geram falha silenciosa de captura.

Nenhum dado pessoal (CPF, nome, email) deve aparecer em label de metrica ou atributo de span — apenas identificadores tecnicos nao sensiveis (`provedor`, `documento.id`, `solicitacao.id`).

## Eventos de Negocio Monitorados

Eventos derivados de [contrato.md §Eventos publicados](contrato.md). Apenas eventos com impacto operacional/juridico viram alerta.

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| `DocumentoAssinadoCompletamente` | contrato.md | counter `m023_assinatura_concluida_total{provedor}` | Nao | - |
| `DocumentoAssinadoParcialmente` | contrato.md | counter `m023_assinatura_individual_total{provedor}` | Nao | - |
| `AssinaturaRecusada` | contrato.md (RN07) | counter `m023_assinatura_recusada_total{provedor}` | Sim | warning |
| `AssinaturaExpirando` | contrato.md (RN08) | counter `m023_assinatura_expirando_total{provedor}` | Sim | warning |
| `ErroIntegracaoAssinatura` | contrato.md (RI1 estado `ERRO`) | counter `m023_assinatura_erro_total{provedor, tipo_erro}` | Sim | critical |
| Captura E-Docs nao concluida (evento polling sem `status=Executado`) | adapter E-Docs (RN05/RN06) | gauge `m023_captura_pendente_total{provedor}` | Sim | warning |
| `AreaConhecimentoNaoMapeada` (curriculo) | README.md / adapter Lattes-ORCID | counter `m023_area_nao_mapeada_total{provedor}` | Nao | - |

## Metricas (Prometheus)

Convencao: prefixo `m023_`, `snake_case`, unidade no sufixo, labels de baixa cardinalidade. Label `provedor` = `edocs` \| `lattes` \| `orcid`. Label `operacao` restrito ao conjunto fechado de operacoes do `contrato.md`. **Nunca** CPF, nome, email, numero Lattes ou ORCID iD em label.

### RED por operacao do contrato (familia assinatura + familia curriculo)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| `m023_operacao_total` | counter | operacao, provedor, status | - | chamadas por operacao publica (`EnviarDocumentoParaAssinatura`, `ConsultarStatusAssinatura`, `BaixarDocumentoAssinado`, `CancelarSolicitacao`, `ReconciliarSolicitacaoManualmente`, `ImportarCurriculo`, `SincronizarCurriculo`, `ConsultarStatusSincronizacao`); `status`=`ok`\|`error` |
| `m023_operacao_duration_seconds` | histogram | operacao, provedor | s | latencia da operacao publica (Rate/Duration) |
| `m023_operacao_erros_total` | counter | operacao, provedor, codigo_erro | - | erros por codigo de negocio (`DOCUMENTO_INVALIDO_PDF`, `DOCUMENTO_EXCEDE_LIMITE`, `SOLICITACAO_DUPLICADA`, `EDOCS_INDISPONIVEL`, etc.) |

### RED por chamada externa (o sinal central deste modulo)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| `m023_ext_chamada_total` | counter | provedor, operacao_ext, status | - | chamadas a API externa; `operacao_ext`=`token`\|`gerar_url_upload`\|`upload_minio`\|`capturar`\|`polling_evento`\|`polling_documento`\|`download`\|`importar_curriculo`\|`busca` |
| `m023_ext_duration_seconds` | histogram | provedor, operacao_ext | s | latencia por chamada externa e por provedor |
| `m023_ext_erros_total` | counter | provedor, operacao_ext, http_status | - | erros por dependencia; `http_status`=`400`\|`401`\|`403`\|`404`\|`409`\|`422`\|`5xx` (mapeamento adapter E-Docs) |
| `m023_ext_timeouts_total` | counter | provedor, operacao_ext | - | timeouts/sem resposta da dependencia externa |
| `m023_ext_retries_total` | counter | provedor, operacao_ext, motivo | - | retentativas; `motivo`=`token_expirado_401`\|`backoff_5xx`\|`url_upload_expirada` |

### Negocio — assinatura (gauges e contadores de estado)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| `m023_solicitacoes_estado_total` | gauge | provedor, estado | - | solicitacoes por estado (`ENVIADA`, `AGUARDANDO_ASSINATURAS`, `PARCIALMENTE_ASSINADA`, `ASSINADA`, `RECUSADA`, `ERRO`) — RI1 |
| `m023_captura_pendente_total` | gauge | provedor | - | solicitacoes aguardando deteccao de conclusao via polling |
| `m023_assinatura_idade_dias` | histogram | provedor | d | idade da solicitacao nao terminal (suporta RN08 — 30 dias) |
| `m023_assinatura_concluida_total` | counter | provedor | - | evento `DocumentoAssinadoCompletamente` |
| `m023_assinatura_individual_total` | counter | provedor | - | evento `DocumentoAssinadoParcialmente` |
| `m023_assinatura_recusada_total` | counter | provedor | - | evento `AssinaturaRecusada` (RN07) |
| `m023_assinatura_expirando_total` | counter | provedor | - | evento `AssinaturaExpirando` (RN08) |
| `m023_assinatura_erro_total` | counter | provedor, tipo_erro | - | evento `ErroIntegracaoAssinatura` (estado `ERRO`) |
| `m023_pdf_upload_bytes` | histogram | provedor | bytes | tamanho do PDF enviado (suporta RN11 — limite 250 MB) |

### Negocio — curriculo (familia Lattes / ORCID)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| `m023_curriculo_sincronizado_total` | counter | provedor, status | - | importacoes/sincronizacoes de curriculo (`provedor`=`lattes`\|`orcid`) |
| `m023_area_nao_mapeada_total` | counter | provedor | - | `AreaConhecimentoNaoMapeada` — area Lattes/ORCID sem match no cadastro CNPq canonico (M008) |

### Jobs (Hangfire — cidadaos de primeira classe)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| `m023_job_duration_seconds` | histogram | job | s | duracao por job (`reconciliar_assinaturas`, `alertar_solicitacoes_expirando`, `marcar_solicitacoes_expiradas`) |
| `m023_job_execucao_total` | counter | job, status | - | execucoes por job; `status`=`ok`\|`error` |
| `m023_job_last_success_timestamp_seconds` | gauge | job | s | timestamp Unix da ultima execucao bem-sucedida (detecta job nao executado) |
| `m023_job_itens_processados_total` | counter | job | - | itens processados por execucao (ex.: solicitacoes pendentes verificadas no polling) |

## Tracing (SigNoz / OpenTelemetry)

Um span por operacao publica do `contrato.md`; span filho por chamada externa com `peer.service` + `http.status_code`; span por job. Atributos sempre nao sensiveis.

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| `m023.EnviarDocumentoParaAssinatura` | por command | provedor, documento.id, total_assinantes, solicitacao.id |
| `m023.ConsultarStatusAssinatura` | por query | provedor, solicitacao.id, estado |
| `m023.BaixarDocumentoAssinado` | por query | provedor, solicitacao.id, documento.id |
| `m023.CancelarSolicitacao` | por command | provedor, solicitacao.id, motivo_categoria |
| `m023.ReconciliarSolicitacaoManualmente` | por command | provedor, solicitacao.id |
| `m023.ImportarCurriculo` / `m023.SincronizarCurriculo` | por command (familia curriculo) | provedor, curriculo.fonte, itens_importados |
| `m023.ConsultarStatusSincronizacao` | por query | provedor |
| `m023.ext.edocs` | por chamada a E-Docs V2 / Acesso Cidadao / MinIO | peer.service (`api.e-docs.es.gov.br`\|`acessocidadao.es.gov.br`\|`minio.e-docs.es.gov.br`), operacao_ext, http.status_code, tentativa |
| `m023.ext.lattes` | por chamada a fonte Lattes | peer.service, operacao_ext, http.status_code |
| `m023.ext.orcid` | por chamada a ORCID Public API | peer.service (`pub.orcid.org`), operacao_ext, http.status_code, secao |
| `m023.job.reconciliar_assinaturas` | a cada 5 min (RN05) | itens_processados, solicitacoes_concluidas, solicitacoes_erro |
| `m023.job.alertar_solicitacoes_expirando` | diario 09:00 (RN08) | itens_processados, alertas_emitidos |
| `m023.job.marcar_solicitacoes_expiradas` | diario 03:00 (RN08/RI1) | itens_processados, solicitacoes_expiradas |

Propagar `trace_id` BFF → Gateway → M023 → integracao externa, para trace fim-a-fim no SigNoz. Logs estruturados carregam `trace_id` para correlacao.

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| % das assinaturas concluidas detectadas via polling em ate 10 min apos a ultima assinatura no provedor (`m023_assinatura_concluida_total` vs latencia de deteccao) | 99% | 30d |
| Taxa de sucesso de `EnviarDocumentoParaAssinatura` (captura iniciada sem erro) — `m023_operacao_total{operacao="EnviarDocumentoParaAssinatura",status="ok"}` / total | 99% | 30d |
| Disponibilidade efetiva da dependencia E-Docs vista pelo M023 — `m023_ext_chamada_total{provedor="edocs",status="ok"}` / total | 99,5% | 30d |
| p95 de latencia das chamadas externas E-Docs (`m023_ext_duration_seconds{provedor="edocs"}`) | < 3 s | 30d |
| Taxa de sucesso de importacao de curriculo (`m023_curriculo_sincronizado_total{status="ok"}` / total) por provedor | 95% | 30d |
| Execucao pontual do job de polling (`m023_job_last_success_timestamp_seconds{job="reconciliar_assinaturas"}` com atraso < 10 min) | 99,9% | 30d |

## Alertas

Todo alerta tem condicao, severidade e acao/runbook.

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Erro de integracao de assinatura | `increase(m023_assinatura_erro_total[15m]) > 0` | critical | Inspecionar `tipo_erro` e `EventoAssinatura`; verificar saude do E-Docs. TODO: runbook `m023/erro-integracao-assinatura` |
| Dependencia externa degradada | `sum by (provedor) (rate(m023_ext_erros_total[5m])) / sum by (provedor) (rate(m023_ext_chamada_total[5m])) > 0.10` por 10 min | critical | Distinguir falha do terceiro vs Conecta; checar status page do provedor / Acesso Cidadao. TODO: runbook `m023/dependencia-externa` |
| Latencia externa alta | `histogram_quantile(0.95, sum by (le,provedor) (rate(m023_ext_duration_seconds_bucket[5m]))) > 5` por 10 min | warning | Avaliar timeouts e backoff; abrir chamado com provedor se persistir. TODO: runbook `m023/latencia-externa` |
| Surto de timeouts | `increase(m023_ext_timeouts_total[10m]) > 5` por provedor | warning | Verificar conectividade/SLA do provedor; conferir RN12 (URL upload MinIO expira em segundos). TODO: runbook `m023/timeouts-externos` |
| Job de polling parado | `time() - m023_job_last_success_timestamp_seconds{job="reconciliar_assinaturas"} > 900` (15 min, esperado 5 min) | critical | Sem polling nao ha deteccao de conclusao (V2 sem webhook); reiniciar job Hangfire e reconciliar manualmente. TODO: runbook `m023/job-polling-parado` |
| Job recorrente falhou | `increase(m023_job_execucao_total{status="error"}[1h]) > 0` | warning | Verificar log do job (`alertar_solicitacoes_expirando` / `marcar_solicitacoes_expiradas`). TODO: runbook `m023/job-falha` |
| Captura pendente acumulando | `m023_captura_pendente_total > 0` estavel por 30 min sem decremento | warning | Indica polling sem progresso; verificar dependencia E-Docs e estado das solicitacoes. TODO: runbook `m023/captura-pendente` |
| Falha de OAuth Acesso Cidadao | `increase(m023_ext_erros_total{provedor="edocs",http_status="401"}[10m]) > 3` | critical | Token Client Credentials invalido/expirado; checar credenciais no vault (M005/Sysadmin). TODO: runbook `m023/oauth-acesso-cidadao` |
| Solicitacoes expirando | `increase(m023_assinatura_expirando_total[1d]) > 0` | warning | Notificar sysadmin via M020 (RN08); acompanhar antes do corte de 30 dias. TODO: runbook `m023/assinatura-expirando` |
| Recusa de assinatura | `increase(m023_assinatura_recusada_total[1h]) > 0` | warning | Repassar motivo ao modulo consumidor (RN07); decidir reenvio. TODO: runbook `m023/assinatura-recusada` |
| PDF excede limite do provedor | `increase(m023_operacao_erros_total{codigo_erro="DOCUMENTO_EXCEDE_LIMITE"}[1h]) > 0` | warning | Validar geracao do PDF (RN11 — limite E-Docs 250 MB) no modulo de origem. TODO: runbook `m023/pdf-excede-limite` |
| Falha de importacao de curriculo | `sum by (provedor) (rate(m023_curriculo_sincronizado_total{status="error"}[30m])) / sum by (provedor) (rate(m023_curriculo_sincronizado_total[30m])) > 0.20` | warning | Verificar fonte Lattes (sem API oficial — pendencia) / ORCID Public API e credenciais no vault. TODO: runbook `m023/falha-curriculo` |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED por operacao M023 | rate/errors/duration de cada operacao do contrato (`m023_operacao_*`), separado por `provedor` | Grafana |
| Saude por provedor (E-Docs / Lattes / ORCID) | latencia p50/p95, taxa de erro por `http_status`, timeouts e retries (`m023_ext_*`) por `provedor` | Grafana |
| Funil de assinatura | `m023_solicitacoes_estado_total` por estado, `m023_captura_pendente_total`, conclusoes/recusas/erros, distribuicao de `m023_assinatura_idade_dias` | Grafana |
| Saude dos jobs | duracao, sucesso/falha e `last_success_timestamp` dos 3 jobs (`m023_job_*`); destaque para o polling de 5 min | Grafana |
| Curriculo (Lattes / ORCID) | sincronizacoes ok/erro por provedor, areas nao mapeadas (`m023_curriculo_*`, `m023_area_nao_mapeada_total`) | Grafana |
| SLO M023 | error budget dos SLIs (deteccao por polling, sucesso de envio, disponibilidade E-Docs) | Grafana |
| Trace explorer | spans `m023.*` (operacoes, `m023.ext.{provedor}`, jobs) filtrados por `trace_id`, `provedor`, `http.status_code` | SigNoz |
