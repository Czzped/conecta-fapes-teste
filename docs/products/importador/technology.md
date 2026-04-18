# Tecnologia - Importador SIGFAPES

[← Voltar ao Importador](README.md)

> Stack tecnologico completo do produto Importador SIGFAPES. Fonte: [`MateusLannes/importacao-conecta-backend`](https://github.com/MateusLannes/importacao-conecta-backend) (`requirements.txt`, `frontend/package.json`, `render.yaml`, `.python-version`).

---

## Tabela resumo

| Categoria | Tecnologia | Versao | Papel |
|-----------|------------|--------|-------|
| **Runtime** | Python | 3.12.11 | Backend |
| **Web framework** | FastAPI | 0.128.0 | API REST assincrona |
| **App server** | Uvicorn `[standard]` | 0.40.0 | Servidor ASGI |
| **Validacao / serializacao** | Pydantic | 2.12.5 | Models de settings e DTOs |
| **Processamento de dados** | pandas | 3.0.0 | DataFrames vetorizados |
| **Parquet I/O** | pyarrow | 23.0.0 | Leitura dos dumps no S3 |
| **Geracao XLSX** | xlsxwriter | 3.2.9 | Monta planilhas base |
| **Leitura XLSX** | openpyxl | 3.1.5 | Parse na validacao de upload |
| **Cloud storage** | boto3 | 1.42.38 | Cliente S3/MinIO |
| **HTTP client** | httpx | 0.28.1 | Chamadas Supabase, Airflow, SIGFAPES |
| **JWT** | PyJWT `[crypto]` | 2.11.0 | Validacao de tokens Supabase |
| **Env loader** | python-dotenv | 1.2.1 | `.env` em dev |
| **Progress UI** | tqdm | 4.67.1 | Feedback nos scripts CLI |
| **UI framework** | React | 18.3.1 | Interface administrativa |
| **Type safety** | TypeScript | 5.8.2 | Tipagem da SPA |
| **Build** | Vite | 5.4.14 | Bundler + dev server |
| **Routing** | react-router-dom | 6.30.0 | SPA com `BrowserRouter` |
| **Date picker** | react-datepicker | 9.1.0 | Campos de data na planilha |
| **Date utils** | date-fns | 4.1.0 | Manipulacao de datas |
| **XLSX cliente** | xlsx (SheetJS) | 0.18.5 | Parse base64 ↔ workbook |
| **Testes backend** | pytest | - | 40+ arquivos |
| **Testes frontend** | vitest + jsdom + @testing-library/react | 2.1.9 / 24.1.3 / 16.3.2 | Unit + integration |
| **Plugin Vite React** | @vitejs/plugin-react | 4.4.1 | JSX transform + HMR |
| **Infra** | Render (plan free) | - | Deploy backend |
| **Auth / DB** | Supabase | - | Auth JWT + Postgres via PostgREST |
| **Object store** | AWS S3 / MinIO | - | Parquets, XLSX, JSONL |
| **Orquestracao** | Apache Airflow | - | DAG `SigFapes2Conecta` |

---

## Backend

### Por que cada biblioteca

**FastAPI 0.128** — framework HTTP principal. Injecao de dependencia via `Depends`, validacao com Pydantic, geracao automatica de OpenAPI em `/docs`. `create_app()` monta routers em [`app/factory.py`](https://github.com/MateusLannes/importacao-conecta-backend/blob/main/app/factory.py).

**Uvicorn[standard] 0.40** — servidor ASGI. Inclui `uvloop` e `httptools` (extras `standard`). Start em producao: `uvicorn main:app --host 0.0.0.0 --port $PORT`.

**Pydantic 2.12** — `AppSettings` em [`app/core/settings.py`](https://github.com/MateusLannes/importacao-conecta-backend/blob/main/app/core/settings.py) carrega e valida env vars; DTOs por endpoint garantem schema das requests.

**pandas 3.0 + pyarrow 23** — le Parquets do S3, monta DataFrames e opera vetorizadamente. O codigo usa explicitamente `np.where` e slicing em vez de `df.apply`, evitando iteracao row-a-row em planilhas de 5000+ bolsistas.

**xlsxwriter 3.2** — gera o XLSX base com formatacao, formulas e validacao. Usado em `planilha_edital.py:build_planilha_edital_xlsx_bytes`.

**openpyxl 3.1** — leitura de XLSX no upload para validar layout e computar diff entre versoes.

**boto3 1.42** — cliente S3. Suporta `S3_ENDPOINT_URL` para MinIO (ambiente FAPES usa `https://one.s3.es.gov.br`). Cliente instanciado em [`app/clients/s3.py`](https://github.com/MateusLannes/importacao-conecta-backend/blob/main/app/clients/s3.py).

**httpx 0.28** — cliente HTTP sincrono/async usado em:
- `app/security/jwt_auth.py` — fetch JWKS do Supabase (timeout, retries manuais)
- `app/services/airflow_check.py` + `airflow_trigger.py` — Airflow REST
- `app/clients/supabase_auth.py` — login password flow
- `scripts/sigfapes_dump_job.py` — coleta da API SIGFAPES

**PyJWT[crypto] 2.11** — decodifica JWTs usando JWKS publico do Supabase com algoritmos `ES256`/`RS256` (configuravel via `SUPABASE_ALLOWED_JWT_ALGORITHMS`). O extra `[crypto]` instala `cryptography` para EC keys.

**tqdm 4.67** — barra de progresso dos scripts de dump. Fallback stub se nao instalado.

**python-dotenv 1.2** — carrega `.env` no boot (dev); em producao o Render injeta via UI.

### Tecnicas-chave observadas

| Tecnica | Onde aparece | Ganho |
|---------|--------------|-------|
| `ThreadPoolExecutor` para 4 fetches S3 paralelos | `planilha_edital.py` | Reduz TTFB do XLSX base |
| Vetorizacao `np.where` em vez de `df.apply` | `planilha_edital.py` | Calculos em milhoes de celulas em O(n) |
| Cache por ETag + `threading.Lock` por chave | `app/services/editais.py` (singleflight) | Evita thundering herd na contagem de bolsistas |
| JWKS cache com TTL (default 3600s) | `app/security/jwt_auth.py` | Evita chamadas repetidas a Supabase |
| `lru_cache(maxsize=1)` em providers | `app/core/providers.py` | Adapters singleton |
| ContextVars (`request_id`, `user_id`) | `app/core/request_context.py` | Correlacao em logs estruturados |
| Logs JSON estruturados | `RequestContextMiddleware` + services | `elapsed_ms`, `event`, observabilidade pipeline-friendly |
| AdaptiveRateController (RPM dinamico por fase) | `scripts/sigfapes_dump_job.py` | Maximo throughput sem 429 no SIGFAPES |
| Virtual scroll manual 52px/linha, overscan 5 | `frontend/src/components/spreadsheet/SpreadsheetEditor.tsx` | Planilhas 5000+ linhas sem travar browser |
| Controle otimista por `base_version` | `app/routers/upload.py` | Evita sobrescrita de editor concorrente |

---

## Frontend

### Por que cada biblioteca

**React 18 + TypeScript 5.8** — base da SPA. Tipagem estrita em `frontend/tsconfig.app.json`.

**Vite 5.4** — dev server com HMR + build otimizado. Configuracao minima (so `@vitejs/plugin-react 4.4`).

**react-router-dom 6.30** — rotas em [`frontend/src/App.tsx`](https://github.com/MateusLannes/importacao-conecta-backend/blob/main/frontend/src/App.tsx): `/login`, `/editais`, `/correcao/:editalId`. `ProtectedRoute` guarda rotas internas.

**react-datepicker 9.1 + date-fns 4.1** — escolha de datas no editor de planilha (datas de inicio/fim de bolsa).

**xlsx (SheetJS) 0.18** — parse de `base64 → workbook` e build de `workbook → base64` **no browser**. Permite download client-side sem round-trip no backend.

**vitest 2.1 + jsdom 24 + @testing-library/react 16** — testes unitarios e de integracao com ambiente DOM sem headless browser. Rapido (milhares de testes em segundos).

### Escolhas deliberadas

- **CSS puro** (sem Tailwind/MUI) com tokens (`--text-muted`, `--surface`, `--line`) — reduz bundle size, evita custo de design system.
- **Virtual scroll manual** — escreve `<tr>` espacadores em vez de usar `react-window`/`tanstack-virtual`. Maximo controle; trade-off e a constante "magica" `SPREADSHEET_ROW_HEIGHT=52px`.
- **sessionStorage para token** — perde sessao ao fechar aba (mais seguro que `localStorage`).
- **Sem cliente HTTP de terceiros** — `fetch` nativo encapsulado em `lib/api.ts` com `ApiError` tipado.

---

## Infraestrutura

### Deploy (Render)

Configuracao em [`render.yaml`](https://github.com/MateusLannes/importacao-conecta-backend/blob/main/render.yaml):

```yaml
services:
  - type: web
    runtime: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Variaveis injetadas: `AWS_*`, `S3_BUCKET`, `SUPABASE_*`, `AUTH_COOKIE_*`, `CORS_*`, feature flags (`USE_CASES_ENABLED`, `ASYNC_JOBS_ENABLED`, `LOG_STRUCTURED`, `INTERNAL_ALLOWED_ROLES`).

Limitacoes do plano free: sleep apos 15 min inatividade, CPU/RAM limitados. O endpoint de geracao de planilha e sincrono e pode estourar 30s; recomendacao e habilitar `ASYNC_JOBS_ENABLED=1` e usar `?async=true` + worker dedicado.

### Supabase

- **Auth** — login email/senha via `/auth/v1/token?grant_type=password` (`app/clients/supabase_auth.py`); JWKS publico em `/.well-known/jwks.json`.
- **Database (PostgREST)** — acesso via HTTP, schema default `public`. Credenciais: resolve `SUPABASE_DB_API_KEY → SUPABASE_SERVICE_ROLE_KEY → SUPABASE_ANON_KEY`. RLS deve ser configurado fora do repositorio.

### S3 / MinIO

- Compatibilidade total — basta definir `S3_ENDPOINT_URL`.
- Estrutura de chaves:
  ```
  dados_input/dump_sigfapes/<dd_mm_yyyy>/{editais.json, editais.parquet, projetos_por_edital.parquet, bolsistas_projeto.parquet, dump_complete.json}
  dados_input/auxiliares/RelatorioBeneficiarioLimpo.json
  editais_corrigidos/<MM_YYYY>/<kind>/<edital_id>/planilhaBase/base_<id>_<DD_MM_YYYY>.xlsx
  editais_corrigidos/<MM_YYYY>/<kind>/<edital_id>/historicoCorrecoesPlanilhas/<N>_<DD_MM_YYYY>_*.xlsx
  dados_programas.json (por edital)
  ```
- **Versionamento manual** — prefixo numerico `<N>_` no filename. Nao usa S3 native versioning.
- **Metadata S3** — cada PUT grava `x-amz-meta-user-id`, `x-amz-meta-action`, `x-amz-meta-request-id` ([`s3_audit_metadata.py`](https://github.com/MateusLannes/importacao-conecta-backend/blob/main/app/services/s3_audit_metadata.py)).

### Airflow

- DAG `SigFapes2Conecta` (configuravel via `AIRFLOW_SIGFAPES_DAG_ID`).
- Conexao via REST API (`/api/v1/dags/<id>/dagRuns`, `/api/v2/monitor/health`).
- Diagnostico CLI: `python scripts/check_airflow.py`.
- Trigger interno: `POST /internal/airflow/trigger-sigfapes`.

---

## Scripts operacionais

| Script | Papel | Tecnicas |
|--------|-------|----------|
| `scripts/sigfapes_dump_job.py` | Dump da API SIGFAPES → Parquets S3 | AdaptiveRateController (RPM dinamico), 3 fases paralelas (EDITAIS/PROJETOS/BOLSISTAS) com configs separadas por env, phase markers (checkpoint), buffered I/O |
| `scripts/conecta_dump_job.py` | Copia MinIO → S3 destino | Streaming copy, verificacao com marker `dump_complete.json` |
| `scripts/job_worker.py` | Consumidor da fila `import_jobs` | Loop polling (`ASYNC_JOBS_POLL_INTERVAL_SECONDS`, default 5s), logs JSON por evento |
| `scripts/check_airflow.py` | Diagnostico CLI do Airflow | Exit code 0/1/2 conforme health/auth/DAGs |

---

## Migrations SQL (Supabase)

Aplicadas manualmente em `public` schema (CI valida apenas contrato estatico):

| Migration | Tabela(s) | Feature |
|-----------|-----------|---------|
| `20260227_create_resource_locks.sql` | `resource_locks` | Lock exclusivo por `resource_key` (feature flag `LOCKS_ENABLED`) |
| `20260402_create_import_jobs.sql` | `import_jobs` | Fila de jobs (`ASYNC_JOBS_ENABLED`) |
| `20260402_create_resource_kind_state.sql` | `resource_kind_state`, `resource_kind_switch_log` | Estado ativo e log de troca editais↔programas |
| `20260406_create_planilha_version_audit.sql` | `planilha_version_audit` | Auditoria de versoes (`AUDIT_DB_ENABLED`) |

---

## Observabilidade

Logs JSON estruturados habilitados por default (`LOG_STRUCTURED=1`). Campos padrao:

```json
{
  "event": "request_finished",
  "request_id": "uuid",
  "user_id": "uuid",
  "method": "POST",
  "path": "/cria-planilha-edital",
  "status_code": 200,
  "elapsed_ms": 8923.2
}
```

Eventos de negocio customizados:

- `lock_acquired`, `lock_heartbeat`, `lock_released`, `lock_conflict`
- `planilha_edital_timing` (etapas: `s3_fetch_bolsistas`, `build_df`, `xlsx_write`...)
- `resource_kind_state_missing_table` (degraded quando tabela nao existe)
- `job_claimed`, `job_completed`, `job_failed`
- `audit_write_skipped` (quando `AUDIT_DB_STRICT=0` e falha DB)

Propagacao end-to-end via header `X-Request-ID` (gerado se ausente) + ContextVars em `app/core/request_context.py`.
