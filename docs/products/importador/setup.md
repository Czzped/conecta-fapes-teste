# Setup Local - Importador SIGFAPES

[← Voltar ao Importador](README.md)

> Guia passo a passo para rodar backend + frontend localmente. Referencia o repositorio [`MateusLannes/importacao-conecta-backend`](https://github.com/MateusLannes/importacao-conecta-backend).

---

## Pre-requisitos

| Dependencia | Versao | Observacao |
|-------------|--------|------------|
| Python | 3.12.11 | Fixada em `.python-version` |
| Node.js | 18+ | Recomendado 20 LTS |
| Credenciais AWS | - | Acesso ao bucket S3 (ou MinIO) |
| Projeto Supabase | - | URL + Service Role Key |
| Airflow | opcional | Apenas para testar `/internal/airflow-check` |

---

## 1. Clonar e preparar o backend

```bash
git clone https://github.com/MateusLannes/importacao-conecta-backend.git
cd importacao-conecta-backend

python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

O `requirements.txt` instala: FastAPI 0.128, Uvicorn 0.40, boto3 1.42, pandas 3.0, pyarrow 23, xlsxwriter 3.2, openpyxl 3.1, httpx 0.28, PyJWT 2.11, python-dotenv 1.2.

---

## 2. Configurar variaveis de ambiente

Copie `.env.example` para `.env` e preencha. Minimo para subir o servidor:

```env
# S3 / MinIO
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_ENDPOINT_URL=https://one.s3.es.gov.br
S3_BUCKET=pr-dl-fapes-conecta

# Prefixos S3
SIGFAPES_DUMP_PREFIX=dados_input/dump_sigfapes/
EDITAIS_CORRIGIDOS_PREFIX=editais_corrigidos/
EDITAIS_PREFIX=dados_input/dump_sigfapes/

# Supabase Auth + DB
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_JWKS_URL=https://<ref>.supabase.co/auth/v1/.well-known/jwks.json
SUPABASE_JWT_ISSUER=https://<ref>.supabase.co/auth/v1
SUPABASE_JWT_AUDIENCE=authenticated

# Desenvolvimento local (HTTP)
AUTH_COOKIE_SECURE=0
CORS_ALLOW_CREDENTIALS=1
CORS_ORIGINS=http://localhost:5173

# Feature flags desligadas ate aplicar migrations
LOCKS_ENABLED=0
ASYNC_JOBS_ENABLED=0
USE_CASES_ENABLED=0
```

> **Atencao:** se `LOCKS_ENABLED=1`, aplique antes a migration `20260227_create_resource_locks.sql` no Supabase. O mesmo vale para `ASYNC_JOBS_ENABLED=1` com `20260402_create_import_jobs.sql`.

Referencia completa das variaveis em [deployment.md](deployment.md#variaveis-de-ambiente).

---

## 3. Subir o backend

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Verificacoes rapidas:

```bash
curl http://localhost:8000/health                 # {"ok": true}
curl http://localhost:8000/status                 # inclui s3_bucket_configured
curl http://localhost:8000/docs                   # Swagger interativo
```

Rotas protegidas exigem login via `POST /auth/login` — ver [api-reference.md](api-reference.md#autenticacao).

---

## 4. Subir o frontend

```bash
cd frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
npm run dev
```

Acesse http://localhost:5173 e faca login com um usuario do projeto Supabase.

---

## 5. Rodar a suite de testes

**Backend (pytest):**

```bash
pip install pytest pytest-asyncio
pytest -q tests/
```

Testes cobrem: auth router, locks (service + router), upload validations, planilha audit, sigfapes dump, use cases, Airflow check/trigger, migrations contract.

**Frontend (vitest):**

```bash
cd frontend
npm test -- --run
```

Cobertura: hooks (`useLock`, `useSheetData`, `useProgramConfig`, `useUploadPlanilha`), componentes (`SpreadsheetEditor`, `ValidationSidebar`, modals), cliente HTTP (`lib/api.ts`), utilitarios de planilha.

---

## 6. Scripts operacionais

```bash
# Diagnostico Airflow (requer AIRFLOW_BASE_URL/USERNAME/PASSWORD no .env)
python scripts/check_airflow.py

# Dump SIGFAPES para S3 (consome API HTTP SIGFAPES)
python scripts/sigfapes_dump_job.py

# Dump Conecta (copia Parquets MinIO -> S3 destino)
python scripts/conecta_dump_job.py

# Worker de jobs assincronos (requer ASYNC_JOBS_ENABLED=1)
python scripts/job_worker.py
```

---

## 7. Estrutura de pastas do repositorio

```
importacao-conecta-backend/
├── app/                        # FastAPI em camadas
│   ├── adapters/               # Adaptadores para S3, Supabase, Airflow
│   ├── api/error_mapper.py     # DomainError -> HTTPException
│   ├── clients/                # Clientes HTTP/boto3 brutos
│   ├── core/                   # Settings, providers, validation, request context
│   ├── domain/errors.py        # Hierarquia DomainError
│   ├── factory.py              # Monta FastAPI e registra routers
│   ├── gateways/               # Bridges para scripts legados (planilha_edital, geraArquivos)
│   ├── middleware/             # RequestContextMiddleware (request_id + user_id)
│   ├── routers/                # auth, editais, importacao, internal, jobs, locks, planilhas, programas, status, upload
│   ├── security/jwt_auth.py    # Validacao JWT Supabase (JWKS cache)
│   ├── services/               # Regra de negocio (locks, editais, planilhas, auditoria, sigfapes dump, airflow)
│   ├── settings.py             # Variaveis de ambiente globais
│   └── use_cases/              # Use cases quando USE_CASES_ENABLED=1
├── frontend/                   # React + TypeScript + Vite
├── main.py                     # Entrypoint Uvicorn
├── migrations/                 # 4 SQLs Supabase (aplicacao manual)
├── planilha_edital.py          # Gera XLSX (fluxo atual)
├── geraArquivosImportacao.py   # Gera JSONL (fluxo legado ainda em uso)
├── scripts/                    # Scripts CLI (airflow, dumps, worker)
└── tests/                      # pytest
```

---

## 8. Fluxo completo em ambiente local

1. Aplicar migrations Supabase listadas em [deployment.md](deployment.md#migrations) (apenas se for habilitar features por flag).
2. Garantir que o bucket S3 contenha um dump completo em `SIGFAPES_DUMP_PREFIX/<dd_mm_yyyy>/` com `editais.json`, `editais.parquet`, `projetos_por_edital.parquet`, `bolsistas_projeto.parquet` e o marcador `dump_complete.json`.
3. Rodar backend (`uvicorn`) + frontend (`npm run dev`).
4. Logar na UI, escolher um edital em `/editais`, gerar a planilha (`POST /cria-planilha-edital`), corrigir na tela, salvar (`POST /upload-planilha-corrigida`) e gerar JSONLs (`POST /gerar-jsonl`).

Ver detalhes do fluxo em [architecture.md](architecture.md) e endpoints em [api-reference.md](api-reference.md).
