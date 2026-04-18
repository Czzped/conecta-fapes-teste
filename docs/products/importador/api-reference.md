# Referencia de API - Importador SIGFAPES

[← Voltar ao Importador](README.md)

> Documentacao dos endpoints expostos pelo backend FastAPI. A API tambem publica Swagger interativo em `/docs` e ReDoc em `/redoc`. Os routers sao montados em [`app/factory.py`](https://github.com/MateusLannes/importacao-conecta-backend/blob/main/app/factory.py).

---

## Autenticacao

Rotas protegidas aceitam dois modos equivalentes:

- **Cookie HttpOnly** `sb-access-token` (definido por `/auth/login`)
- **Header** `Authorization: Bearer <access_token>`

A validacao usa JWKS publico do Supabase (`SUPABASE_JWKS_URL`) com cache de 1 hora, verificando `iss`, `aud` e algoritmo (default `ES256,RS256`). Todo request propaga `X-Request-ID` (gerado se ausente) via `RequestContextMiddleware`.

Rotas **publicas**: `GET /health`, `GET /status`, `POST /auth/login`.

Rotas **internal**: alem de autenticacao, exigem `role` do JWT em `INTERNAL_ALLOWED_ROLES` (default `admin,service_role`).

Erros de dominio sao mapeados por [`app/api/error_mapper.py`](https://github.com/MateusLannes/importacao-conecta-backend/blob/main/app/api/error_mapper.py):

| DomainError | HTTP | error_code |
|-------------|------|------------|
| `ValidationError` | 400 | `validation_error` |
| `UnauthorizedError` | 401 | `unauthorized` |
| `ForbiddenError` | 403 | `forbidden` |
| `NotFoundError` | 404 | `not_found` |
| `ConflictError` | 409 | `conflict` |
| `ConfigError` | 500 | `config_error` |
| `ExternalServiceError` | 502 | `external_service_error` |

---

## Indice de endpoints

| Tag | Metodo | Path | Descricao |
|-----|--------|------|-----------|
| status | GET | `/health` | Healthcheck publico |
| status | GET | `/status` | Status publico + flag de S3 |
| auth | POST | `/auth/login` | Login Supabase (retorna tokens + cookies) |
| editais | GET | `/editais-latest` | Lista editais do dump mais recente |
| editais | GET | `/editais-grafico-metricas` | Metricas de cobertura e auditoria |
| planilhas | GET | `/recurso-kind` | Tipo real (editais vs programas) |
| planilhas | GET | `/planilha-selecionada` | Planilha atual em base64 |
| planilhas | GET | `/planilhas-mes-passado` | Planilhas corrigidas do mes anterior |
| planilhas | GET | `/planilhas-mes-passado/download` | Download XLSX do mes passado |
| planilhas | GET | `/bolsista-dump-json` | Registros brutos do dump filtrados |
| planilhas | POST | `/cria-planilha` | Script legado (dev local) |
| planilhas | POST | `/cria-planilha-edital` | Gera planilha base (XLSX) |
| planilhas | POST | `/recurso-kind/switch` | Troca edital ↔ programa com clone |
| upload | POST | `/upload` | Upload generico de arquivos para S3 |
| upload | POST | `/upload-planilha-corrigida` | Upload da planilha corrigida |
| upload | POST | `/validate-upload-planilha` | Valida planilha sem salvar |
| importacao | POST | `/gerar-jsonl` | Gera JSONLs de importacao |
| locks | POST | `/locks/acquire` | Adquire lock de recurso |
| locks | POST | `/locks/heartbeat` | Renova lock (heartbeat) |
| locks | POST | `/locks/release` | Libera lock |
| locks | GET | `/locks/me` | Lista meus locks |
| locks | GET | `/locks/status` | Status de um lock |
| locks | POST | `/locks/batch-status` | Status de multiplos locks |
| programas | GET | `/dados-programas` | Le `dados_programas.json` do S3 |
| programas | POST | `/dados-programas` | Salva `dados_programas.json` no S3 |
| jobs | GET | `/jobs/{job_id}` | Status de job assincrono |
| internal | GET | `/internal/airflow-check` | Diagnostico Airflow |
| internal | POST | `/internal/airflow/trigger-sigfapes` | Dispara DAG `SigFapes2Conecta` |
| internal | POST | `/internal/planilha-audit/backfill` | Backfill de auditoria de planilha |

---

## Publicos

### `GET /health`

Retorna `{"ok": true}`. Nao requer autenticacao.

### `GET /status`

```json
{
  "ok": true,
  "time_utc": "2026-04-18T15:00:00.000Z",
  "s3_bucket_configured": true
}
```

### `POST /auth/login`

Body:

```json
{ "email": "usuario@dominio.com", "password": "..." }
```

Resposta 200:

```json
{
  "ok": true,
  "token_type": "bearer",
  "access_token": "eyJ...",
  "refresh_token": "...",
  "expires_in": 3600,
  "user": { "id": "uuid", "email": "usuario@dominio.com" }
}
```

Tambem define cookies HttpOnly `sb-access-token` (TTL = `expires_in`) e `sb-refresh-token` (TTL = `AUTH_REFRESH_COOKIE_MAX_AGE`, default 30 dias). Flags de cookie controladas por `AUTH_COOKIE_SECURE`, `AUTH_COOKIE_SAMESITE`, `AUTH_COOKIE_DOMAIN`, `AUTH_COOKIE_PATH`.

Erros: `400` (payload invalido), `401` (credenciais), `502` (falha Supabase).

---

## Editais

### `GET /editais-latest`

Lista o ultimo `editais.json` do dump SIGFAPES, com agregacoes:

- `edital_id`, `edital_nome`, `edital_data_cadastro`, `total_bolsistas`
- `novo_este_mes` (cadastrado nos ultimos 60 dias)
- `importado` (flag se ja foi importado no Conecta)

Query opcionais de log: controladas por `EDITAIS_LATEST_LOG_REMOVED` e `EDITAIS_LATEST_LOG_REMOVED_LIMIT`.

Erros: `404` se nao houver dump completo, `502` S3.

### `GET /editais-grafico-metricas`

Calcula metricas do ultimo dump SIGFAPES + ultimo dump Conecta:

- `allocation_importacao` — total de linhas FAPES vs importadas
- `allocation_auditoria` — matched/unmatched entre dumps
- `allocation_importacao_ativos_por_edital` — contagem por id comum

Modo degradado: se `S3_BUCKET` nao estiver configurado, retorna `degraded: true` com zeros.

---

## Planilhas

### `GET /planilha-selecionada?edital_id=7777`

Busca a ultima planilha versionada do edital no mes corrente (timezone `FAKE_TODAY_TZ`), devolvendo em base64 junto com metadados de auditoria:

```json
{
  "ok": true,
  "key": "editais_corrigidos/04_2026/editais/7777/historicoCorrecoesPlanilhas/3_18_04_2026_....xlsx",
  "filename": "3_18_04_2026_....xlsx",
  "kind": "editais",
  "is_programa": "NAO",
  "month_year": "04_2026",
  "resource_key": "04_2026/editais/7777",
  "current_version": 3,
  "last_action": "upload_corrigida",
  "last_action_at": "2026-04-18T12:10:00Z",
  "last_actor_email": "ops@fapes.es.gov.br",
  "last_actor_user_id": "uuid",
  "base64": "UEsDB..."
}
```

### `POST /cria-planilha-edital`

Gera XLSX base do edital/programa e salva no S3 se ainda nao existir no mes atual. Body:

```json
{ "edital_id": "7777", "is_programa": false }
```

Query opcional: `async=true` — quando `ASYNC_JOBS_ENABLED=1`, enfileira job e retorna 202 com `job_id`.

Fluxo sincrono:

1. Resolve ultimo dump completo (marcador `dump_complete.json`).
2. Carrega em paralelo (ThreadPoolExecutor) os Parquets de bolsistas/projetos/editais + `relatorio_beneficiario.json` + CSV Banestes.
3. Monta planilha com ate `MAX_NIVEIS_BOLSA=5` niveis de bolsa por bolsista (colunas `BOLSA NIVEL_N`, `BOLSA VALOR_N`, `60 DA BOLSA_N`, `MESES DE ATIVIDADE_N`, `TOTAL DEVE RECEBER_N`).
4. Salva em `<EDITAIS_CORRIGIDOS_PREFIX><MM_YYYY>/<kind>/<edital_id>/planilhaBase/base_<edital_id>_<DD_MM_YYYY>.xlsx`.
5. Registra evento `create_initial` em `planilha_version_audit`.

Erros: `409` se ja existir recurso do outro tipo no mes, `404` sem dump, `502` S3.

### `POST /recurso-kind/switch`

Troca o tipo ativo (editais ↔ programas) no mes atual. Requer `lock_token` valido e `confirm: true`. O sistema clona a ultima versao do historico para o novo tipo e migra o lock para a nova `resource_key`. Grava linha em `resource_kind_switch_log`.

### `GET /recurso-kind?edital_id=7777`

Descobre se o edital tem historico em `editais/` ou `programas/` no mes atual. Retorna `409` se existir em ambos (estado inconsistente que precisa ser resolvido manualmente).

### `GET /planilhas-mes-passado?edital_id=7777` e `GET /planilhas-mes-passado/download`

Lista XLSX do mes anterior nos dois tipos. Download retorna o arquivo com `Content-Disposition: attachment`.

### `GET /bolsista-dump-json?edital_id=7777&formulario_bolsa_id=123`

Le `bolsistas_projeto.parquet` do ultimo dump e filtra por `edital_id` + `formulario_bolsa_id`. Util para diagnostico de campos faltantes.

---

## Upload

### `POST /validate-upload-planilha`

Valida layout e regras de negocio **sem salvar**. Nunca retorna 4xx por falha de validacao — erros aparecem no campo `errors`.

Body:

```json
{
  "edital_id": "7777",
  "kind": "editais",
  "data_url": "data:application/vnd.openxmlformats-...;base64,UEsDB..."
}
```

Resposta:

```json
{
  "ok": true,
  "errors": [{"message": "...", "summary": "...", "bolsista_ids": ["123"]}],
  "warnings": [{"message": "..."}],
  "diff": {
    "changed_cells": 42,
    "changed_rows": 7,
    "added_count": 0,
    "removed_count": 0,
    "no_current_version": false
  }
}
```

Regras validadas por [`geraArquivosImportacao.py:collect_all_planilha_validation_errors`](https://github.com/MateusLannes/importacao-conecta-backend/blob/main/geraArquivosImportacao.py):

- layout novo (5 niveis) — rejeita legado 2 niveis
- datas validas e intervalos coerentes
- `BOLSA VALOR_*` inteiros
- campos obrigatorios (`ID SIGFAPES BOLSISTA`, `CPF`, `BOLSISTA`)
- `edital_id` bate com a coluna na planilha

### `POST /upload-planilha-corrigida`

Salva a planilha corrigida no S3. Body inclui `edital_id`, `kind`, `lock_token` (se `LOCKS_ENABLED=1`), `base_version` (controle otimista) e `data_url`.

- Reexecuta validacao antes de escrever (`validate_planilha_corrigida_layout_bytes`).
- Compara `base_version` com a ultima versao do historico; retorna `409` em conflito.
- Grava em `historicoCorrecoesPlanilhas/<N>_<DD_MM_YYYY>_....xlsx` com metadados S3 (`x-amz-meta-*`) contendo request_id, user_id e email.
- Registra evento `upload_corrigida` em `planilha_version_audit`.

### `POST /upload`

Upload generico de arquivos arbitrarios. Usa prefixo `S3_PREFIX` + `path` do body. Aceita qualquer tipo de arquivo (base64 em `data_url`).

---

## Importacao

### `POST /gerar-jsonl`

Gera os JSONLs de importacao e salva no S3. Body:

```json
{
  "edital_id": "7777",
  "is_programa": false,
  "dados_programas": null,
  "lock_token": "uuid"
}
```

Quando `is_programa=true`, `dados_programas` deve trazer mapeamento projeto → area tecnica (`GEPED`, `NUPEX`, `GECAP`, `GEINOV`).

Fluxo:

1. Valida lock (se `LOCKS_ENABLED=1`).
2. Resolve tipo ativo e ultima planilha corrigida.
3. Chama `generate_importacao_jsonl_to_s3` (gateway legado) — calcula datas, preenche dados bancarios de `RelatorioBeneficiarioLimpo.json` e do CSV Banestes, produz os JSONL.
4. Salva saidas no S3 e retorna lista de keys.

Query `async=true` agenda job quando `ASYNC_JOBS_ENABLED=1`.

Erros: `403` (sem lock), `404` (planilha ausente), `409` (tipo inconsistente), `502` (S3).

---

## Locks

> Todas exigem `LOCKS_ENABLED=1` + migration `20260227_create_resource_locks.sql` aplicada.

`resource_key` tem formato `<MM_YYYY>/<kind>/<edital_id>`, por exemplo `04_2026/editais/7777`.

### `POST /locks/acquire`

Body: `{"edital_id": "7777", "kind": "editais"}`. Retorna `LockResponse` com `resource_key`, `lock_token`, `expires_at` (TTL `LOCK_TTL_SECONDS`, default 1800s) e `heartbeat_at`. Retorna `409` com JSON detalhado se ja estiver bloqueado por outro usuario:

```json
{
  "detail": "Recurso em uso por outro usuario",
  "resource_key": "04_2026/editais/7777",
  "locked_by": "usuario@dominio.com",
  "expires_at": "2026-04-18T15:30:00Z"
}
```

### `POST /locks/heartbeat`

Body: `{"resource_key": "...", "lock_token": "uuid"}`. Renova TTL. O frontend chama a cada `HEARTBEAT_INTERVAL_MS=45_000` via hook `useLock`. Se falhar `LOCK_HEARTBEAT_GRACE_SECONDS` (120s) consecutivos, o lock expira.

### `POST /locks/release`

Libera lock com `reason` opcional (`manual`, `completed`, `abandon`).

### `GET /locks/me`

Lista locks ativos do usuario autenticado.

### `GET /locks/status` e `POST /locks/batch-status`

Consulta status (livre/ocupado + dono + expiracao). `batch-status` aceita lista de `edital_ids` — usado pelo `EditaisPage` para badge de lock na lista.

---

## Programas

### `GET /dados-programas?edital_id=465`

Le `dados_programas.json` do S3 na pasta `programas/<edital_id>/`. Retorna lista de `{edital, areaTecnica, projetos[]}`. Apenas quando tipo ativo do recurso for `programas`; caso contrario retorna `409`.

### `POST /dados-programas`

Salva configuracao de programas. Valida:

- `areaTecnica` ∈ `{GEPED, NUPEX, GECAP, GEINOV}`
- nenhum projeto repetido entre areas
- lock valido (se `LOCKS_ENABLED=1`)

Grava com metadata S3 de auditoria e chama `record_version_event` para trackear a edicao.

---

## Jobs

### `GET /jobs/{job_id}`

Retorna status do job assincrono criado por endpoints com `?async=true`. Estados: `pending`, `running`, `completed`, `failed`.

Autorizacao: dono do job (`created_by == sub` do JWT) **ou** usuario com role em `INTERNAL_ALLOWED_ROLES`.

Resposta:

```json
{
  "ok": true,
  "job": {
    "id": "uuid",
    "job_type": "gerar_jsonl",
    "status": "completed",
    "payload": {...},
    "result": {...},
    "error": null,
    "attempts": 1,
    "created_by": "uuid",
    "worker_id": "job-worker",
    "created_at": "...",
    "updated_at": "...",
    "started_at": "...",
    "finished_at": "..."
  }
}
```

---

## Internal

### `GET /internal/airflow-check`

Executa `run_airflow_check` (health + auth + list DAGs). Equivalente a CLI `python scripts/check_airflow.py`. Retorna:

```json
{
  "detected": true,
  "authenticated": true,
  "healthy": true,
  "health": {...},
  "dags": ["SigFapes2Conecta", ...],
  "exit_code": 0
}
```

### `POST /internal/airflow/trigger-sigfapes`

Dispara a DAG definida em `AIRFLOW_SIGFAPES_DAG_ID` (default `SigFapes2Conecta`) com `conf = {mes, tipo, numero}`. Se `mes` omitido, usa mes atual (`FAKE_TODAY_TZ`); se `tipo` omitido, detecta via `resolve_historico_kind_and_keys`.

### `POST /internal/planilha-audit/backfill`

Preenche eventos `legacy_backfill` em `planilha_version_audit` varrendo o historico S3 de um escopo (`month_year`, opcional `edital_id`/`kind`). Usado para migrar planilhas geradas antes da migration `20260406_create_planilha_version_audit.sql`.

---

## Headers globais

Todas as respostas incluem:

- `X-Request-ID` — valor do header recebido ou UUID gerado. Usado em logs estruturados (`"event": "request_started" / "request_finished"`).

CORS controlado por `CORS_ORIGINS` e `CORS_ALLOW_CREDENTIALS`. Para uso com cookies de auth em browsers, exigir `CORS_ALLOW_CREDENTIALS=1` + origem explicita (nao `*`).
