# Monitoramento e Observabilidade — M002 Importacao SIGFAPES

Dominio e regras: ver [README.md](README.md) | Eventos: ver [contrato.md](contrato.md) (Eventos e Efeitos Colaterais)

## Objetivo de Sustentacao

O M002 e um modulo de importacao em lote (migracao) que traz dados do SIGFAPES legado para o ConectaFAPES via dumps Parquet diarios em S3, mediando a correcao assistida do operador e materializando os JSONL de importacao consumidos por M003. A sustentacao precisa garantir, em ordem de criticidade:

1. **Saude do pipeline de dump** — o dump SIGFAPES mais recente esta presente e fresco em S3 (RN01, RNF02); sem dump, todo o modulo para.
2. **Sucesso das execucoes de importacao/geracao** — jobs `CriarPlanilhaInicialDoEdital` e `GerarArquivosJsonlDeImportacao` (sincronos ou via `import_jobs` quando `ASYNC_JOBS_ENABLED`) completam dentro do orcamento de tempo (RNF03: 5000+ bolsistas em < 30s) e produzem registros importados versus falhos por entidade.
3. **Integridade dos artefatos S3** — leitura dos 4 dumps, gravacao de XLSX versionado e dos 3 JSONL (`bolsistas`, `projetos`, `alocacoes`) sem erro.
4. **Contencao de lock e idempotencia** — locks exclusivos com heartbeat de 45s (RN02), takeovers de lock expirado (RN09), conflitos de versao otimista (RN03), e operacoes idempotentes que nao devem reprocessar conteudo identico.
5. **Bloqueios de qualidade de dados** — uploads bloqueados por erros estruturais (RN06) e geracao bloqueada por mapeamento programa->area incompleto (RN07).

Como modulo batch/migracao, os sinais mais importantes sao **duracao do job de importacao**, **registros importados vs falhos POR ENTIDADE** (label `entidade`), **processamento de arquivo/dump**, **contencao de dedup/lock**, **idempotencia** e **frescor do ultimo sucesso** (`last_success_timestamp`).

## Eventos de Negocio Monitorados

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| Planilha inicial criada (versao 0) | contrato.md (CriarPlanilhaInicialDoEdital) | counter `m002_planilha_inicial_total{status}` | Sim (falha) | warning |
| Dump SIGFAPES indisponivel/ausente | RN01, RNF02; erro SIGFAPES_DUMP_INDISPONIVEL | counter `m002_dump_sigfapes_total{status="error"}` + gauge `m002_dump_sigfapes_age_seconds` | Sim | critical |
| Dados do dump ausentes para o edital | erro DADOS_DO_DUMP_AUSENTES | counter `m002_dump_dados_ausentes_total{entidade}` | Sim | warning |
| Run de importacao gera registros falhos | contrato.md (Gerar/CriarPlanilha) | counter `m002_import_registros_total{entidade,status="failed"}` | Sim | warning |
| JSONL de importacao gerado | contrato.md (GerarArquivosJsonlDeImportacao) | counter `m002_jsonl_gerado_total{entidade,status}` | Sim (falha) | warning |
| Geracao bloqueada por mapeamento programa->area incompleto | RN07; erro CONFIG_PROGRAMAS_INVALIDA | counter `m002_gerar_jsonl_total{status="error"}` (subcausa em log) | Sim | warning |
| Conflito de versao otimista no upload | RN03; erro CONFLITO_DE_VERSAO | counter `m002_planilha_conflito_versao_total` | Sim (taxa) | warning |
| Upload bloqueado por erro estrutural | RN06; LAYOUT_INVALIDO | counter `m002_upload_validacao_total{resultado}` | Nao | - |
| Lock tomado de outro operador (takeover) | RN09; release_reason=takeover | counter `m002_lock_takeover_total` | Sim (taxa) | warning |
| Contencao de lock (recurso em uso) | RN02; erro RECURSO_EM_USO | counter `m002_lock_contencao_total` | Nao | - |
| Job assincrono falhou | RNF04; status=failed em import_jobs | counter `m002_job_total{job,status="failed"}` | Sim | warning |

## Metricas (Prometheus)

Convencao: prefixo `m002_`, `snake_case`, unidade no sufixo, labels de baixa cardinalidade (nunca CPF, nome, email, `edital_id` ou `formulario_bolsa_id` em label). `entidade` ∈ {`bolsistas`, `projetos`, `alocacoes`, `editais`}; `kind` ∈ {`editais`, `programas`}.

### RED por operacao do contrato

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| `m002_operacao_total` | counter | operacao, status | - | chamadas por operacao publica do contrato (Rate + Errors via `status="error"`) |
| `m002_operacao_duration_seconds` | histogram | operacao | s | latencia por operacao publica |

`operacao` ∈ valores estaveis derivados do contrato: `listar_editais_latest`, `consultar_metricas`, `adquirir_lock`, `renovar_lock`, `liberar_lock`, `criar_planilha_inicial`, `obter_planilha`, `validar_upload`, `enviar_planilha_corrigida`, `trocar_tipo_recurso`, `salvar_dados_programas`, `gerar_jsonl`, `consultar_status_job`, `status`.

### Metricas de run de importacao (nucleo batch/migracao)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| `m002_import_run_total` | counter | tipo, status | - | execucoes de import run (`tipo` ∈ {`criar_planilha`, `gerar_jsonl`}; `status` ∈ {`success`, `failed`}) |
| `m002_import_run_duration_seconds` | histogram | tipo | s | duracao da execucao de importacao (orcamento RNF03: p95 < 30s) |
| `m002_import_registros_total` | counter | entidade, status | - | registros importados vs falhos POR ENTIDADE (`status` ∈ {`imported`, `failed`}) |
| `m002_import_registros_processados` | gauge | entidade, kind | - | registros processados na ultima run por entidade e kind |
| `m002_jsonl_gerado_total` | counter | entidade, status | - | arquivos/linhas JSONL gerados por entidade |
| `m002_jsonl_linhas` | gauge | entidade | - | linhas no JSONL mais recente por entidade |

### Processamento de arquivo / dump SIGFAPES

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| `m002_dump_sigfapes_age_seconds` | gauge | origem | s | idade do dump mais recente em S3 (`origem` ∈ {`sigfapes`, `conecta`}); frescor do pipeline (RN01) |
| `m002_dump_sigfapes_total` | counter | origem, status | - | tentativas de leitura de dump por origem (Errors via `status="error"`) |
| `m002_dump_dados_ausentes_total` | counter | entidade | - | edital/entidade sem dados no dump mais recente (DADOS_DO_DUMP_AUSENTES) |
| `m002_arquivo_processado_bytes` | histogram | artefato | bytes | tamanho dos artefatos lidos/gravados (`artefato` ∈ {`parquet`, `xlsx`, `jsonl`, `json`}) |
| `m002_planilha_fetch_s3_duration_seconds` | histogram | - | s | duracao dos 4 fetches S3 paralelos da geracao de planilha (RNF03) |

### Dedup / lock / idempotencia

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| `m002_lock_contencao_total` | counter | - | - | tentativas de aquisicao recusadas por recurso em uso (RECURSO_EM_USO) |
| `m002_lock_takeover_total` | counter | - | - | locks expirados tomados por outro operador (RN09, release_reason=takeover) |
| `m002_locks_ativos` | gauge | - | - | locks atualmente ativos no `resource_locks` |
| `m002_lock_heartbeat_total` | counter | status | - | heartbeats de renovacao (status `ok`/`expired`) |
| `m002_planilha_conflito_versao_total` | counter | - | - | conflitos de versao otimista no upload (CONFLITO_DE_VERSAO, RN03) |
| `m002_upload_validacao_total` | counter | resultado | - | validacoes de upload (`resultado` ∈ {`ok`, `error`, `warning`}, RN06) |
| `m002_idempotencia_short_circuit_total` | counter | operacao | - | runs idempotentes que reusaram conteudo identico sem reprocessar (gerar_jsonl, salvar_dados_programas) |

### Saude de job (Hangfire/worker assincrono — `ASYNC_JOBS_ENABLED`)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| `m002_job_total` | counter | job, status | - | execucoes de job assincrono (`job` ∈ {`criar_planilha`, `gerar_jsonl`}; `status` ∈ {`completed`, `failed`}) |
| `m002_job_duration_seconds` | histogram | job | s | duracao do job assincrono |
| `m002_job_last_success_timestamp_seconds` | gauge | job | s | epoch do ultimo sucesso por job (frescor / detecta job parado) |
| `m002_jobs_fila_pendentes` | gauge | - | - | jobs em estado pending/processing em `import_jobs` |

## Tracing (SigNoz / OpenTelemetry)

Um span por operacao publica do contrato (`m002.{Operacao}`), span filho por chamada a dependencia externa (`m002.ext.{dep}`) e span por execucao de job. Atributos de negocio uteis e **nao sensiveis** apenas — nunca CPF, nome ou email.

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| `m002.CriarPlanilhaInicialDoEdital` | por geracao da planilha base (v0) | `edital.id`, `kind`, `is_programa`, `registros.processados`, `duracao_ms` |
| `m002.GerarArquivosJsonlDeImportacao` | por geracao dos JSONL | `edital.id`, `kind`, `entidades`, `jsonl.linhas_total`, `idempotente` |
| `m002.EnviarPlanilhaCorrigida` | por upload de versao corrigida | `edital.id`, `kind`, `base_version`, `latest_version`, `conflito_versao` |
| `m002.ValidarUploadDePlanilha` | por validacao de planilha candidata | `edital.id`, `kind`, `errors.count`, `warnings.count`, `diff.changed_rows` |
| `m002.AdquirirLockDoRecurso` | por aquisicao de lock | `resource_key`, `kind`, `resultado`, `takeover` |
| `m002.TrocarTipoDoRecurso` | por switch editais<->programas | `edital.id`, `from_kind`, `to_kind` |
| `m002.SalvarDadosDeProgramas` | por persistencia do mapa programa->area | `edital.id`, `projetos.count`, `idempotente` |
| `m002.ListarEditaisDoUltimoDump` | por consulta da listagem | `editais.count`, `include_importados` |
| `m002.ext.s3` | por chamada boto3 a S3 (read/write Parquet/XLSX/JSONL) | `peer.service=s3`, `artefato`, `operacao` (get/put), `http.status_code`, `bytes` |
| `m002.ext.sigfapes_dump` | por leitura do dump materializado em S3 | `peer.service=sigfapes_dump`, `origem`, `dump.age_seconds`, `encontrado` |
| `m002.ext.supabase` | por chamada Supabase (locks, auditoria, switch log) | `peer.service=supabase`, `tabela`, `http.status_code` |
| `m002.ext.airflow` | por trigger opcional da DAG SigFapes2Conecta | `peer.service=airflow`, `dag.id`, `http.status_code` |
| `m002.job.criar_planilha` | por execucao assincrona em `import_jobs` | `job.id`, `resultado`, `registros.processados`, `duracao_ms` |
| `m002.job.gerar_jsonl` | por execucao assincrona em `import_jobs` | `job.id`, `resultado`, `jsonl.linhas_total`, `duracao_ms` |

Propagar `trace_id` BFF -> backend FastAPI -> S3/Supabase/Airflow para trace fim-a-fim; logs estruturados (RNF01, `LOG_STRUCTURED`) carregam `request_id`/`trace_id` para correlacao no SigNoz.

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| % de registros importados sem erro por run (`m002_import_registros_total{status="imported"}` / total) | >= 99% | 30d |
| % de import runs (`criar_planilha` + `gerar_jsonl`) concluidas com `status="success"` | >= 99% | 30d |
| p95 da duracao de `m002_import_run_duration_seconds{tipo="criar_planilha"}` (edital com 5000+ bolsistas, RNF03) | < 30s | 30d |
| % de geracoes de JSONL completas (3 entidades) sem falha | >= 99% | 30d |
| Frescor do dump SIGFAPES (`m002_dump_sigfapes_age_seconds`) dentro do ciclo diario | < 36h em 99% das checagens | 30d |
| % de aquisicoes de lock sem takeover involuntario (`1 - m002_lock_takeover_total / m002_operacao_total{operacao="adquirir_lock"}`) | >= 99% | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Dump SIGFAPES obsoleto/ausente | `max(m002_dump_sigfapes_age_seconds{origem="sigfapes"}) > 129600` (36h) | critical | Verificar DAG `SigFapes2Conecta` no Airflow e `sigfapes_dump_job.py`; sem dump fresco toda importacao para. TODO: link runbook |
| Falha de leitura/escrita S3 | `increase(m002_dump_sigfapes_total{status="error"}[15m]) > 0` ou erro em `m002.ext.s3` | critical | Verificar credenciais/endpoint S3 (`S3_ENDPOINT_URL`, `S3_BUCKET`) e disponibilidade do bucket. TODO: link runbook |
| Import run com registros falhos | `increase(m002_import_registros_total{status="failed"}[1h]) > 0` | warning | Inspecionar entidade afetada (label `entidade`) e logs estruturados por `request_id`; checar consistencia do dump. TODO: link runbook |
| Import run falhando (taxa) | `sum(rate(m002_import_run_total{status="failed"}[30m])) / sum(rate(m002_import_run_total[30m])) > 0.01` | warning | SLO de sucesso de run em risco; correlacionar com falha de dump/S3/Supabase. TODO: link runbook |
| Geracao de planilha lenta | `histogram_quantile(0.95, rate(m002_import_run_duration_seconds_bucket{tipo="criar_planilha"}[1h])) > 30` | warning | Investigar latencia dos 4 fetches S3 (`m002_planilha_fetch_s3_duration_seconds`) e volume de bolsistas; RNF03 violado. TODO: link runbook |
| Geracao JSONL bloqueada por config de programas | `increase(m002_gerar_jsonl_total{status="error"}[30m]) > 0` (subcausa CONFIG_PROGRAMAS_INVALIDA) | warning | Completar mapeamento `projeto -> AreaTecnica` em `dados-programas.json` (RN07). TODO: link runbook |
| Job assincrono parado | `time() - max(m002_job_last_success_timestamp_seconds) > 86400` (com `ASYNC_JOBS_ENABLED`) | critical | Verificar worker `ASYNC_JOBS_POLL_INTERVAL_SECONDS` e fila `import_jobs`; nenhum job concluiu no periodo esperado. TODO: link runbook |
| Fila de jobs crescente | `m002_jobs_fila_pendentes > 20` e crescente por 30m | warning | Worker assincrono saturado ou travado; checar `m002_job_total{status="failed"}`. TODO: link runbook |
| Taxa anomala de takeover de lock | `increase(m002_lock_takeover_total[1h]) > 5` | warning | Heartbeat de 45s pode estar falhando no frontend ou operadores abandonando sessao (RN02/RN09). TODO: link runbook |
| Conflitos de versao otimista frequentes | `increase(m002_planilha_conflito_versao_total[1h]) > 5` | warning | Possivel edicao concorrente apesar do lock; revisar RN03 e fluxo de versao no frontend. TODO: link runbook |
| Falha persistente de auditoria | erro de gravacao em `planilha_version_audit` com `AUDIT_DB_STRICT=true` abortando escrita | warning | Verificar conectividade Supabase; RNF01 exige trilha de auditoria. TODO: link runbook |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M002 por operacao | rate/errors/duration de `m002_operacao_*` por operacao do contrato | Grafana |
| Import runs (batch) | `m002_import_run_total` por status, p50/p95 de `m002_import_run_duration_seconds`, registros imported vs failed por `entidade` | Grafana |
| Saude do dump SIGFAPES | `m002_dump_sigfapes_age_seconds` por origem, `m002_dump_sigfapes_total{status}`, dados ausentes por entidade | Grafana |
| Geracao de JSONL | `m002_jsonl_gerado_total` e `m002_jsonl_linhas` por entidade | Grafana |
| Lock e idempotencia | `m002_locks_ativos`, `m002_lock_contencao_total`, `m002_lock_takeover_total`, `m002_planilha_conflito_versao_total`, `m002_idempotencia_short_circuit_total` | Grafana |
| Saude de jobs assincronos | `m002_job_total{status}`, `m002_job_duration_seconds`, `m002_job_last_success_timestamp_seconds`, `m002_jobs_fila_pendentes` | Grafana |
| Latencia/erro por dependencia externa | spans/derivadas de `m002.ext.s3`, `m002.ext.supabase`, `m002.ext.airflow`, `m002.ext.sigfapes_dump` | Grafana + SigNoz |
| Trace explorer | spans `m002.*` filtrados por `edital.id` / `kind` | SigNoz |
