# EPI-11 — Geracao da Planilha Base a partir do Dump

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |
| **Fonte no codigo** | `app/routers/planilhas.py:create_planilha_edital`, `app/use_cases/create_planilha_edital_use_case.py`, `planilha_edital.py:build_planilha_edital_xlsx_bytes`, `frontend/src/components/correction/SheetSetupModal.tsx` |

## Jornada

Ao selecionar um edital sem planilha no mes atual, o operador abre o `SheetSetupModal` e escolhe entre `editais` e `programas`. O frontend chama `POST /cria-planilha-edital` com `edital_id` e `is_programa`. O backend: (1) resolve o ultimo dump SIGFAPES via marker `dump_complete.json`; (2) faz **4 fetches S3 em paralelo** (`ThreadPoolExecutor`) para `bolsistas_projeto.parquet`, `projetos_por_edital.parquet`, `editais.parquet` e `RelatorioBeneficiarioLimpo.json`; (3) calcula campos derivados de forma **vetorizada com `np.where`** (`effective_end`, `MESES_DE_ATIVIDADE`); (4) cruza com CSV Banestes para contas bancarias quando disponivel; (5) monta XLSX com `xlsxwriter` contendo ate 5 niveis de bolsa por bolsista; (6) grava em `editais_corrigidos/<MM_YYYY>/<kind>/<edital_id>/planilhaBase/base_<id>_<DD_MM_YYYY>.xlsx` com metadata S3 de auditoria; (7) registra evento `create_initial` em `planilha_version_audit`. Se ja existir planilha no mes, retorna HTTP 409. Com `?async=true` e `ASYNC_JOBS_ENABLED=1`, enfileira job e retorna 202 com `job_id`.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [M002](../../../implementation/modules/M002-importacao-editais/README.md) | Geracao de planilha base | Done |

## User Stories

| ID | User Story |
|----|-----------|
| US-11-01 | Como operador, quero gerar planilha base a partir do dump mais recente do SIGFAPES. |
| US-11-02 | Como operador, quero que a planilha contenha ate 5 niveis de bolsa (layout novo). |
| US-11-03 | Como operador, quero que datas e meses de atividade sejam calculados automaticamente. |
| US-11-04 | Como operador, quero integrar dados bancarios do RelatorioBeneficiarioLimpo.json ou CSV Banestes. |
| US-11-05 | Como sistema, quero impedir recriacao de planilha se ja existir no mes atual (HTTP 409). |
| US-11-06 | Como operador, quero gerar planilha de forma assincrona para editais muito grandes. |
| US-11-07 | Como sistema, quero registrar a primeira versao como `action=create_initial` em auditoria. |
| US-11-08 | Como sistema, quero logs estruturados de timing de cada etapa (`event=planilha_edital_timing`). |

## Cenarios de aceitacao do produto

- **`POST /cria-planilha-edital`**: body `{edital_id, is_programa}`; query `?async=true` opcional.
- **Dump completo**: resolve via `select_latest_complete_dump_prefix` que verifica marker `dump_complete.json`; sem dump retorna HTTP 404.
- **Impedimento de duplicidade**: `ensure_first_planilha_can_be_created` verifica se ja existe planilha no mes (qualquer kind); se existir, HTTP 409.
- **4 fetches paralelos**: `ThreadPoolExecutor` carrega Parquets + JSON em paralelo antes do processamento.
- **Calculos vetorizados**: `effective_end`, `MESES_DE_ATIVIDADE`, `TOTAL_DEVE_RECEBER` via `np.where` (sem `df.apply`).
- **CSV Banestes**: quando `SIGFAPES_BANESTES_CSV_KEY` configurado, complementa dados bancarios.
- **5 niveis de bolsa**: colunas `BOLSA NIVEL_1..5`, `BOLSA VALOR_1..5`, `60 DA BOLSA_1..5`, `MESES DE ATIVIDADE_1..5`, `TOTAL DEVE RECEBER_1..5`.
- **Caminho S3**: `<EDITAIS_CORRIGIDOS_PREFIX><MM_YYYY>/<kind>/<edital_id>/planilhaBase/base_<id>_<DD_MM_YYYY>.xlsx`.
- **Metadata de auditoria**: `x-amz-meta-user-id`, `x-amz-meta-action=create_initial`, `x-amz-meta-request-id`.
- **Audit DB**: evento `create_initial` em `planilha_version_audit` com version=0 e ator.
- **Resposta sincrona**: HTTP 200 `{ok, bucket, key}` com timing total em log.
- **Resposta async**: HTTP 202 `{ok, queued: true, job_id, job: {...}}` quando `?async=true` + `ASYNC_JOBS_ENABLED=1`.
- **`resource_kind_state`**: atualiza `active_kind` para o tipo escolhido no mes corrente.
