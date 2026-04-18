# EPI-10 — Historico de Planilhas Anteriores

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |
| **Fonte no codigo** | `app/routers/planilhas.py:list_previous_month_sheets`, `app/routers/planilhas.py:download_previous_month_sheet`, `frontend/src/components/correction/PreviousMonthModal.tsx`, `frontend/src/hooks/usePreviousMonthSheets.ts` |

## Jornada

Na pagina de correcao, o operador pode consultar o historico do mes anterior via `PreviousMonthModal`. O frontend chama `GET /planilhas-mes-passado?edital_id=...` e recebe listas de XLSX corrigidos do mes passado em **ambos** os tipos (editais e programas) — util quando houve troca de tipo no ciclo anterior. Cada item mostra filename, versao extraida do prefixo `<N>_`, `last_modified` (ISO 8601) e, quando `AUDIT_DB_ENABLED=1`, metadados de auditoria (ator, acao, timestamp). Para baixar, o operador chama `GET /planilhas-mes-passado/download` com `edital_id`, `kind` e `filename`; resposta retorna o XLSX com `Content-Disposition: attachment` e nome seguro `<MM_YYYY>_<kind>_<edital_id>_<filename>`.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [M002](../../../implementation/modules/M002-importacao-editais/README.md) | Consulta de historico | Done |

## User Stories

| ID | User Story |
|----|-----------|
| US-10-01 | Como operador, quero listar planilhas corrigidas do mes anterior para consulta. |
| US-10-02 | Como operador, quero ver ambos os tipos (editais e programas) no mesmo resultado. |
| US-10-03 | Como operador, quero baixar uma planilha historica em XLSX para referencia ou comparacao. |
| US-10-04 | Como operador, quero ver metadados de auditoria (ator, acao, timestamp) de cada versao. |
| US-10-05 | Como sistema, quero prevenir path traversal validando o filename recebido no download. |

## Cenarios de aceitacao do produto

- **`GET /planilhas-mes-passado?edital_id=...`**: lista arquivos XLSX em ambos os kinds (`editais` e `programas`) do mes anterior ao mes corrente (fuso `FAKE_TODAY_TZ`).
- **Metadados por item**: `filename`, `version` (parseada por regex `<N>_<DD_MM_YYYY>`), `last_modified`, `size`, e `action`/`actor_email`/`actor_user_id`/`created_at` quando auditoria DB disponivel.
- **Ordenacao**: descendente por `last_modified`; empate por `version` descendente.
- **`GET /planilhas-mes-passado/download`**: query `edital_id`, `kind`, `filename`; retorna XLSX com `Content-Type: application/vnd.openxmlformats-...sheet` e `Content-Disposition: attachment; filename="..."`.
- **Validacao anti-traversal**: filename nao pode conter `..`, `/` ou `\`.
- **Sem historico**: resposta valida com listas vazias (nao retorna 404).
- **Degradacao**: quando `AUDIT_DB_ENABLED=0`, campos de auditoria retornam `null`.
