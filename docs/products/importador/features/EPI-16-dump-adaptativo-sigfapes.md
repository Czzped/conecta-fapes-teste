# EPI-16 — Dump Adaptativo do SIGFAPES

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |
| **Fonte no codigo** | `scripts/sigfapes_dump_job.py`, `app/services/sigfapes_dump.py` |

## Jornada

Job offline agendado (cron/Airflow) que consome a API HTTP do SIGFAPES e publica Parquets no S3. Executa **3 fases paralelas** — EDITAIS, PROJETOS, BOLSISTAS — cada uma com seu proprio `AdaptiveRateController` que ajusta RPM dinamicamente em janelas de `SIGFAPES_CONTROL_WINDOW_SECONDS` (default 60s): se a P95 de latencia fica abaixo do target (`SIGFAPES_TARGET_P95_MS`, default 2500ms) e taxa de erro fica baixa, aumenta RPM por `SIGFAPES_INCREASE_FACTOR` (default 1.10); se recebe 429 ou timeout, reduz por `SIGFAPES_DECREASE_FACTOR` (default 0.70). Cada fase pode ter overrides individuais via `SIGFAPES_<PHASE>_*`. Phase markers permitem retomar dumps interrompidos. Ao fim, escreve marker `dump_complete.json` que torna o dump visivel para o backend.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [M002](../../../implementation/modules/M002-importacao-editais/README.md) | Dump SIGFAPES com rate adaptativo | Done |

## User Stories

| ID | User Story |
|----|-----------|
| US-16-01 | Como sistema, quero baixar editais, projetos e bolsistas do SIGFAPES em fases paralelas. |
| US-16-02 | Como sistema, quero ajustar RPM dinamicamente para maximizar throughput sem sobrecarregar o SIGFAPES. |
| US-16-03 | Como infra, quero configurar limites minimo/maximo de RPM e fator de aumento/reducao por env. |
| US-16-04 | Como infra, quero overrides por fase (EDITAIS, PROJETOS, BOLSISTAS). |
| US-16-05 | Como sistema, quero escrever marker `dump_complete.json` somente quando todas as fases terminarem. |
| US-16-06 | Como sistema, quero retomar dumps interrompidos via phase markers. |
| US-16-07 | Como infra, quero logs JSON estruturados por fase (RPM, P95, retries) para tuning. |
| US-16-08 | Como sistema, quero exportar `adaptive_rate_stats.json` com historico das janelas para analise. |

## Cenarios de aceitacao do produto

- **3 fases**: `EDITAIS`, `PROJETOS`, `BOLSISTAS`. Cada uma le config via `get_sigfapes_phase_config(phase)`.
- **AdaptiveRateController** — estrategia de ajuste:
  - janela = `SIGFAPES_CONTROL_WINDOW_SECONDS` (default 60s)
  - se P95 < target e erro < 5%: RPM *= `SIGFAPES_INCREASE_FACTOR`
  - se 429 ou erro alto: RPM *= `SIGFAPES_DECREASE_FACTOR`
  - limites `SIGFAPES_RATE_MIN_RPM`..`SIGFAPES_RATE_MAX_RPM`
  - aumenta so apos `SIGFAPES_CONSECUTIVE_HEALTHY_WINDOWS_TO_INCREASE` janelas saudaveis (default 2)
- **Overrides por fase**: `SIGFAPES_<PHASE>_MAX_WORKERS`, `SIGFAPES_<PHASE>_RATE_INITIAL_RPM`, etc.
- **Autenticacao**: `FAPES_URL_AUTH` + `FAPES_USUARIO` + `FAPES_SENHA`; retry `RETRY_AUTH_MAX=3`.
- **Retry 429**: `RETRY_429_MAX=2` com backoff exponencial + jitter.
- **Output S3**: Parquets em `dados_input/dump_sigfapes/<DD_MM_YYYY>/`:
  - `editais.json`, `editais.parquet`
  - `projetos_por_edital.parquet`
  - `bolsistas_projeto.parquet`
  - `adaptive_rate_stats.json`
  - `dump_complete.json` (marker)
- **Phase markers**: arquivos intermediarios indicam fase concluida; permitem retomar apos crash.
- **Buffered I/O**: `_BufferedBolsistasOutputs` faz flush a cada 100 projetos para reduzir syscalls.
- **Descoberta pelo backend**: `select_latest_complete_dump_prefix` lista prefixos `<DD_MM_YYYY>/` e filtra pelos que tem `dump_complete.json`.
