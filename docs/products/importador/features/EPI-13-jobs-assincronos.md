# EPI-13 — Processamento Assincrono de Jobs

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue (opt-in via flag) |
| **Fonte no codigo** | `app/routers/jobs.py`, `app/services/jobs.py`, `app/use_cases/job_executor.py`, `scripts/job_worker.py`, migration `migrations/20260402_create_import_jobs.sql` |

## Jornada

Para operacoes pesadas que podem estourar timeouts HTTP (geracao de planilha base com 5000+ bolsistas, geracao de JSONL), o operador pode usar o flag `?async=true` na requisicao. Quando `ASYNC_JOBS_ENABLED=1`, o backend cria linha em `import_jobs` com `status=pending` e retorna HTTP 202 com `job_id` imediatamente. Um worker dedicado (`python scripts/job_worker.py`) roda em loop infinito fazendo polling a cada `ASYNC_JOBS_POLL_INTERVAL_SECONDS` (default 5s), reclama o proximo job pendente (via `UPDATE ... SET status=running`), executa o use case correspondente atraves de `execute_job_payload` e marca `completed` com resultado ou `failed` com mensagem de erro. O frontend acompanha via `GET /jobs/{job_id}`, visivel ao dono do job (`created_by == sub` do JWT) ou a usuarios com role em `INTERNAL_ALLOWED_ROLES`.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [M002](../../../implementation/modules/M002-importacao-editais/README.md) | Jobs assincronos (opt-in) | Done |

## User Stories

| ID | User Story |
|----|-----------|
| US-13-01 | Como operador, quero enfileirar geracao de planilha ou JSONL e receber `job_id` em HTTP 202. |
| US-13-02 | Como operador, quero acompanhar o status do job via polling sem bloquear a UI. |
| US-13-03 | Como operador, quero ver o resultado ou a mensagem de erro quando o job terminar. |
| US-13-04 | Como sistema, quero restringir consulta aos jobs ao dono ou a usuarios com role interno. |
| US-13-05 | Como infra, quero worker rodando continuamente com logs estruturados por evento. |
| US-13-06 | Como sistema, quero suportar retries futuros via campo `attempts`. |

## Cenarios de aceitacao do produto

- **`POST /cria-planilha-edital?async=true`** e **`POST /gerar-jsonl?async=true`**: quando `ASYNC_JOBS_ENABLED=1`, retornam HTTP 202 `{ok: true, queued: true, job_id, job: {status: "pending", ...}}`.
- **Tabela `import_jobs`**: colunas `id` (uuid), `job_type` (`cria_planilha_edital` ou `gerar_jsonl`), `status` (`pending|running|completed|failed`), `payload` (jsonb), `result` (jsonb), `error` (text), `attempts` (integer), `created_by`, `worker_id`, `created_at`, `updated_at`, `started_at`, `finished_at`.
- **Claim atomico**: `claim_next_pending_job(worker_id)` faz `UPDATE` condicional para evitar que dois workers peguem o mesmo job.
- **Despacho**: `execute_job_payload(job_type, payload)` mapeia `job_type` para use case: `cria_planilha_edital` -> `CreatePlanilhaEditalUseCase`, `gerar_jsonl` -> `GenerateJsonlUseCase`.
- **`GET /jobs/{job_id}`**: dono (`sub == created_by`) tem acesso; qualquer outro usuario precisa de role em `INTERNAL_ALLOWED_ROLES`; 403 caso contrario.
- **Worker loop**: `scripts/job_worker.py` exibe eventos JSON (`worker_started`, `job_claimed`, `job_completed`, `job_failed`) via `print`.
- **Feature flag**: sem `ASYNC_JOBS_ENABLED=1`, `?async=true` e ignorado e o endpoint executa sincronamente.
- **Migration**: exige `migrations/20260402_create_import_jobs.sql` aplicada no Supabase antes de habilitar a flag.
