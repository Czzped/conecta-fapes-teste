# Estrutura do Backend - Importador SIGFAPES

[← Voltar ao Importador](README.md)

> Detalha camadas, feature flags e como cada modulo se relaciona no repositorio [`MateusLannes/importacao-conecta-backend`](https://github.com/MateusLannes/importacao-conecta-backend).

---

## Camadas

O backend esta migrando de um modelo "router + service + scripts legados" para um modelo em camadas com use cases e adapters. A transicao e controlada por **feature flags** para permitir rollout gradual.

```
app/
├── main.py                 # app = create_app()
├── factory.py              # create_app() monta FastAPI + middlewares + routers
├── settings.py             # Config global (via os.getenv)
├── core/
│   ├── settings.py         # AppSettings (Pydantic) consumido por providers
│   ├── providers.py        # Factories com lru_cache (adapters, settings)
│   ├── request_context.py  # ContextVars: request_id, user_id
│   └── validation.py       # normalize_edital_id, current_month_year, ensure_internal_role
├── middleware/
│   └── request_context.py  # Log estruturado + X-Request-ID + bind user_id
├── security/
│   └── jwt_auth.py         # Validacao JWT Supabase (JWKS cache 1h)
├── api/
│   └── error_mapper.py     # DomainError -> HTTPException
├── domain/
│   ├── errors.py           # DomainError e subclasses (7 niveis HTTP)
│   └── types.py            # Enums e tipos do dominio (ResourceKind)
├── routers/                # Entradas HTTP
├── services/               # Regras de negocio (ainda o "estado maduro")
├── use_cases/              # Orquestracao de negocio (novo, opt-in)
├── adapters/               # Interface clean para clientes externos
├── gateways/               # Pontes para scripts legados (planilha_edital.py, geraArquivosImportacao.py)
└── clients/                # boto3/httpx brutos
```

---

## Feature flags (rollout)

| Flag | Default | Efeito |
|------|---------|--------|
| `LOCKS_ENABLED` | `0` | Habilita verificacao de lock em todos os writes (`/gerar-jsonl`, `/upload-planilha-corrigida`, `/dados-programas`, `/recurso-kind/switch`). Exige migration `20260227_create_resource_locks.sql`. |
| `USE_CASES_ENABLED` | `0` | Roteia endpoints criticos para camada `app/use_cases/` em vez do codigo legado do router. Endpoints afetados: `POST /validate-upload-planilha`, `POST /upload-planilha-corrigida`, `POST /gerar-jsonl`, `POST /cria-planilha-edital`, `POST /recurso-kind/switch`. |
| `ASYNC_JOBS_ENABLED` | `0` | Habilita `?async=true` em endpoints pesados e exige worker (`scripts/job_worker.py`). Exige migration `20260402_create_import_jobs.sql`. |
| `AUDIT_DB_ENABLED` | `1` | Registra eventos em `planilha_version_audit` quando escrita no S3 muda versao. |
| `AUDIT_DB_STRICT` | `0` | Se `1`, falha ao escrever se auditoria DB falhar; se `0`, apenas loga warning. |
| `LOG_STRUCTURED` | `1` | Loga eventos em JSON pelo `RequestContextMiddleware`. |

Resolucao central: [`app/core/providers.py:get_app_settings()`](https://github.com/MateusLannes/importacao-conecta-backend/blob/main/app/core/providers.py) retorna um `AppSettings` (Pydantic BaseModel) cacheado por `lru_cache`.

---

## Routers (`app/routers/`)

| Arquivo | Prefixo | Protecao | Papel |
|---------|---------|----------|-------|
| `status.py` | - | publico | `/health`, `/status` |
| `auth.py` | `/auth` | publico | `/auth/login` (Supabase Auth) |
| `editais.py` | - | Bearer | `/editais-latest`, `/editais-grafico-metricas` |
| `planilhas.py` | - | Bearer | `/cria-planilha-edital`, `/planilha-selecionada`, `/recurso-kind`, `/bolsista-dump-json`, `/planilhas-mes-passado`, `/recurso-kind/switch` (7 endpoints) |
| `upload.py` | - | Bearer | `/upload`, `/upload-planilha-corrigida`, `/validate-upload-planilha` |
| `importacao.py` | - | Bearer | `/gerar-jsonl` |
| `locks.py` | - | Bearer | 6 endpoints de lock |
| `programas.py` | - | Bearer | `/dados-programas` (GET/POST) |
| `jobs.py` | - | Bearer | `/jobs/{job_id}` |
| `internal.py` | `/internal` | Bearer + role | `/airflow-check`, `/airflow/trigger-sigfapes`, `/planilha-audit/backfill` |

Os routers que ja foram refatorados para use case mantem um fallback para o codigo antigo quando `USE_CASES_ENABLED=0`.

---

## Services (`app/services/`)

O "core" de regra de negocio atual. Cada service e um conjunto de funcoes focadas, nao classes.

| Modulo | Responsabilidade |
|--------|------------------|
| `locks.py` | Acquire/heartbeat/release, `resource_key` parsing, `validate_write_lock`, `LockConflictError`. Usa `supabase_db`. |
| `editais.py` | Contagem de bolsistas (por JSON sumario ou Parquet com cache por ETag), auditoria de editais Sigfapes vs Conecta, metricas do grafico. Cache em modulo (`threading.Lock`). |
| `planilhas.py` | Resolucao de kind ativo, listagem de keys versionadas (`<N>_<DD_MM_YYYY>...xlsx`), `resolve_historico_kind_and_keys`, `set_active_resource_kind`, `clone_latest_historico_version_between_kinds`. |
| `validacao_upload.py` | `compute_planilha_diff` (changed cells, added, removed) entre versoes. |
| `planilha_audit_service.py` | `record_version_event`, `list_events_by_scope`, `backfill_planilha_audit_for_scope`. Grava em `planilha_version_audit`. |
| `s3_audit_metadata.py` | `build_s3_audit_metadata` — headers `x-amz-meta-*` de auditoria em cada put S3. |
| `jobs.py` | CRUD de `import_jobs`, `claim_next_pending_job`, `complete_job`, `fail_job`. |
| `sigfapes_dump.py` | Descoberta do ultimo dump completo (marcador `dump_complete.json`). |
| `conecta_dump.py` | Ultimo dump Conecta em `CONNECTA_DUMP_PREFIX`. |
| `airflow_check.py` | Health + auth + list DAGs via Airflow REST. |
| `airflow_trigger.py` | Dispara DAG com `conf`. |

---

## Use cases (`app/use_cases/`)

Implementacao em camadas emergente. Cada use case recebe `input_data` + `user_claims` e lanca `DomainError` em falha. Os routers traduzem via `raise_http_from_domain`.

| Use case | Input | Acao |
|----------|-------|------|
| `CreatePlanilhaEditalUseCase` | `edital_id`, `is_programa` | Resolve ultimo dump, gera XLSX base via gateway legado, grava no S3 com auditoria S3+DB. |
| `UploadPlanilhaCorrigidaUseCase` | `edital_id`, `kind`, `lock_token`, `base_version`, `data_url` | Valida layout, confere base_version, grava nova versao. |
| `ValidateUploadPlanilhaUseCase` | mesmo do upload, sem salvar | Produz `ValidateUploadResponse` com erros/warnings/diff. |
| `GenerateJsonlUseCase` | `edital_id`, `lock_token`, `dados_programas` | Valida lock, resolve tipo, chama gateway legado. |
| `SwitchResourceKindUseCase` | `edital_id`, `target_kind`, `lock_token`, `confirm` | Clona ultima versao, registra `switch_clone`. |
| `job_executor.py` | `job_type`, `payload` | Despacha para use case certo a partir do worker. |
| `_legacy_bridge.py` | - | Converte `HTTPException` (ainda lancado por services) em `DomainError`. |

Fluxo dentro do router quando flag esta ligada:

```python
runtime_settings = get_app_settings()
if runtime_settings.use_cases_enabled:
    try:
        return UploadPlanilhaCorrigidaUseCase().execute(...)
    except DomainError as exc:
        raise_http_from_domain(exc)
# fallback: codigo legado inline no router
```

---

## Adapters e gateways

### Adapters (`app/adapters/`)

Wrappers com interface limpa para uso em use cases:

- `S3Adapter` — wrapper do `boto3` (upload/download/list/copy).
- `SupabaseDbAdapter` — delega para `supabase_db` (REST via PostgREST).
- `SupabaseAuthAdapter` — login email/senha.
- `AirflowAdapter` — health + trigger.

### Gateways (`app/gateways/`)

Bridges para os scripts Python raiz (fluxo legado ainda em producao):

- `legacy_planilhas.py` — envolve `planilha_edital.build_planilha_edital_xlsx_bytes`.
- `legacy_importacao.py` — envolve `geraArquivosImportacao.generate_importacao_jsonl_to_s3`.

Os scripts raiz permanecem porque a logica de calculo das planilhas/JSONLs esta hoje toda neles. A intencao do gateway e quebrar essa dependencia aos poucos.

---

## Clients (`app/clients/`)

Clientes brutos (boto3, httpx):

- `s3.py` — cria `boto3.client("s3")` respeitando `S3_ENDPOINT_URL` (MinIO) quando definido.
- `supabase_auth.py` — `login_with_password` via `/auth/v1/token?grant_type=password`.
- `supabase_db.py` — `SupabaseDBClient` com `.select()`, `.insert()`, `.update()`, `.delete()` e erros tipados (`SupabaseDBConfigError`, `SupabaseDBConflictError`). Seleciona automaticamente a chave: `SUPABASE_DB_API_KEY` → `SUPABASE_SERVICE_ROLE_KEY` → `SUPABASE_ANON_KEY`.

---

## Scripts raiz (Python legado)

### `planilha_edital.py`

Core da geracao de planilha base.

- `build_planilha_edital_xlsx_bytes(edital_id, inputs, ...) -> bytes` — funcao central.
- 4 leituras S3 em paralelo (`ThreadPoolExecutor`) antes do processamento.
- Calculos vetorizados com `np.where` (jamais `df.apply`).
- Usa `xlsxwriter` para montar a pasta com niveis, formulas e formatacao.
- Logs estruturados com `"event": "planilha_edital_timing"` para observabilidade.

### `geraArquivosImportacao.py`

Core da geracao de JSONLs.

- `generate_importacao_jsonl_to_s3(...)` — recebe edital_id, is_programa, dados_programas e S3 client, produz arquivos JSONL de importacao e envia.
- `validate_planilha_corrigida_layout_bytes` — valida layout + edital_id.
- `collect_all_planilha_validation_errors` — retorna lista de erros (datas, niveis, valores inteiros, campos obrigatorios, programas).
- Constantes: `ALLOWED_AREAS = {GEPED, NUPEX, GECAP, GEINOV}`, `MAX_NIVEIS_BOLSA = 5`.

---

## Observabilidade

- `RequestContextMiddleware` injeta `X-Request-ID` (UUIDv4 ou valor recebido) e seta ContextVars (`request_id`, `user_id`).
- Quando `LOG_STRUCTURED=1`, loga JSON: `{"event": "request_started|request_finished", "request_id": ..., "method": ..., "path": ..., "status_code": ..., "elapsed_ms": ...}`.
- Eventos de dominio tambem em JSON via `services.*._log_event` (ex.: `lock_acquired`, `planilha_edital_timing`, `resource_kind_state_missing_table`).

---

## Testes (`tests/`)

Cobertura em 40+ arquivos pytest, destaques:

- `test_factory_and_public_routes.py` — smoke do `create_app()`.
- `test_security_jwt_auth.py` — fluxo JWT completo (JWKS mock, issuer, audience, leeway).
- `test_locks_service.py` + `test_locks_router_contract.py` — racing acquire, heartbeat expira, release.
- `test_upload_*` — validacao de layout (novo/legado), controle otimista de versao.
- `test_planilha_audit_db.py` + `test_planilha_audit_metadata.py` — auditoria S3 e DB.
- `test_migrations_contract.py` — valida SQL das migrations sem aplicar.
- `test_use_case_*` — use cases independentes do router.
- `test_async_jobs_routes.py` + `test_jobs_service.py` — fila de jobs.
- `test_airflow_*` — healthcheck e trigger.

Execucao: `pytest -q tests/`.
