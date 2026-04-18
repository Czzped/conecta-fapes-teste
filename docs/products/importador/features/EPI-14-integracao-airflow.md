# EPI-14 — Integracao com Airflow

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |
| **Fonte no codigo** | `app/routers/internal.py`, `app/services/airflow_check.py`, `app/services/airflow_trigger.py`, `scripts/check_airflow.py` |

## Jornada

Dois caminhos de integracao com o Airflow: **diagnostico** via `GET /internal/airflow-check` (equivalente CLI: `python scripts/check_airflow.py`), que testa conectividade (`/api/v2/monitor/health`), autenticacao basica e listagem de DAGs; e **trigger** via `POST /internal/airflow/trigger-sigfapes`, que dispara a DAG configurada em `AIRFLOW_SIGFAPES_DAG_ID` (default `SigFapes2Conecta`) com conf `{mes, tipo, numero}`. Se `mes` nao for informado, usa o mes atual (`FAKE_TODAY_TZ`). Se `tipo` nao for informado mas `numero` sim, o backend tenta descobrir automaticamente via `resolve_historico_kind_and_keys`. Ambos os endpoints ficam sob `/internal/` e exigem role em `INTERNAL_ALLOWED_ROLES`.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [M002](../../../implementation/modules/M002-importacao-editais/README.md) | Orquestracao via Airflow | Done |

## User Stories

| ID | User Story |
|----|-----------|
| US-14-01 | Como infra, quero diagnosticar conectividade, autenticacao e listagem de DAGs no Airflow. |
| US-14-02 | Como infra, quero executar o mesmo diagnostico via CLI (exit code 0/1/2). |
| US-14-03 | Como operador interno, quero disparar a DAG `SigFapes2Conecta` com `conf={mes, tipo, numero}`. |
| US-14-04 | Como sistema, quero inferir automaticamente o `tipo` quando nao informado. |
| US-14-05 | Como sistema, quero restringir os endpoints a usuarios com role interno. |

## Cenarios de aceitacao do produto

- **`GET /internal/airflow-check`**: retorna `{detected, authenticated, healthy, health, dags, exit_code}`. Status codes de saida correspondem ao CLI:
  - `0` conectado e autenticado com DAGs listadas
  - `1` conectado mas sem autenticacao ou permissao
  - `2` nao conectou ou falha nao relacionada a auth
- **`POST /internal/airflow/trigger-sigfapes`**: body `{mes?, tipo?, numero?, dag_run_id?, logical_date?, conf?}`. Usa `AIRFLOW_SIGFAPES_DAG_ID` (default `SigFapes2Conecta`).
- **Defaults**: quando `mes` ausente, usa `current_month_year()` (fuso `FAKE_TODAY_TZ`); quando `tipo` ausente mas `numero` presente, chama `resolve_historico_kind_and_keys` no S3.
- **CLI equivalente**: `python scripts/check_airflow.py [--base-url ...] [--username ...] [--password ...] [--timeout ...]`.
- **Configuracao**: `AIRFLOW_BASE_URL`, `AIRFLOW_USERNAME`, `AIRFLOW_PASSWORD`, `AIRFLOW_TIMEOUT`, `AIRFLOW_SIGFAPES_DAG_ID`.
- **Restricao**: os endpoints exigem `require_authenticated_user` + `require_internal_role`.
- **Erros**: 500 quando configuracao incompleta, 502 em falha de comunicacao/autenticacao.
