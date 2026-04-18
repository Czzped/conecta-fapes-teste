# EPI-18 — Operacoes Internas e Administracao

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |
| **Fonte no codigo** | `app/routers/internal.py`, `app/security/jwt_auth.py:require_internal_role`, `app/core/validation.py:ensure_internal_role` |

## Jornada

Todas as rotas sob `/internal/*` exigem autenticacao valida **e** role no claim JWT `role` presente em `INTERNAL_ALLOWED_ROLES` (configuravel, default `admin,service_role`). Cobrem tres familias de operacoes privilegiadas: diagnostico/trigger de Airflow (EPI-14), backfill de auditoria (EPI-15) e observacao de jobs de outros usuarios (EPI-13). Todas as invocacoes sao logadas com `X-Request-ID` e `user_id` para rastreabilidade. O endpoint publico `GET /health` (sem auth) serve para probes de infraestrutura e esta explicitamente **fora** de `/internal/`.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [M002](../../../implementation/modules/M002-importacao-editais/README.md) | Rotas e controles administrativos | Done |

## User Stories

| ID | User Story |
|----|-----------|
| US-18-01 | Como admin, quero acessar rotas internas somente com role autorizada. |
| US-18-02 | Como admin, quero consultar status de job de qualquer usuario. |
| US-18-03 | Como admin, quero diagnostico e trigger de Airflow via `/internal/airflow-*`. |
| US-18-04 | Como admin, quero rodar backfill de auditoria em escopo arbitrario. |
| US-18-05 | Como sistema de monitoramento, quero endpoint publico `GET /health` sem autenticacao. |
| US-18-06 | Como sistema de monitoramento, quero endpoint publico `GET /status` com flag `s3_bucket_configured`. |
| US-18-07 | Como auditor, quero que toda chamada a `/internal/*` seja logada com request_id e user_id. |

## Cenarios de aceitacao do produto

- **Autenticacao**: todos os endpoints `/internal/*` requerem `require_authenticated_user` (JWT valido via cookie ou Bearer).
- **Autorizacao**: `require_internal_role` valida `claims.role in INTERNAL_ALLOWED_ROLES`; 403 caso contrario.
- **`INTERNAL_ALLOWED_ROLES`**: configuravel por env var, default `admin,service_role`. Comparacao case-insensitive.
- **Endpoints cobertos**:
  - `GET /internal/airflow-check` (EPI-14)
  - `POST /internal/airflow/trigger-sigfapes` (EPI-14)
  - `POST /internal/planilha-audit/backfill` (EPI-15)
- **Acesso privilegiado em `/jobs/{id}`**: admin pode ver jobs de outros usuarios (nao restrito apenas ao `created_by`).
- **Logs auditaveis**: todo request passa pelo `RequestContextMiddleware` que loga `event=request_started/request_finished` com `method`, `path`, `status_code`, `elapsed_ms`, `request_id`, `user_id`.
- **Publicos `/health` e `/status`**: sem autenticacao; `/status` inclui `s3_bucket_configured` para sanity check.
- **Root path nao sensivel**: `/docs` (Swagger) e `/redoc` sao publicos (expoem schema, nao dados).
