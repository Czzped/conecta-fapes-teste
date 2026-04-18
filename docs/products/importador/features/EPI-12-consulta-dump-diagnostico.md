# EPI-12 — Consulta de Dados Brutos para Diagnostico

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |
| **Fonte no codigo** | `app/routers/planilhas.py:get_bolsista_dump_json`, `frontend/src/components/correction/BolsistaDumpModal.tsx` |

## Jornada

Durante a correcao, o operador suspeita de um campo inconsistente para um bolsista especifico. Abre o `BolsistaDumpModal` e informa o `formulario_bolsa_id` (ID SIGFAPES). O frontend chama `GET /bolsista-dump-json?edital_id=...&formulario_bolsa_id=...`. O backend le `bolsistas_projeto.parquet` do ultimo dump completo via `pyarrow`, filtra os registros por `edital_id` + `formulario_bolsa_id` e retorna **JSON bruto** sem transformacao alguma (JSON-encoded via `jsonable_encoder`). A resposta inclui `dump_prefix` e `source_key` para rastreabilidade. Util para validar por que um campo aparece vazio ou inesperado na planilha.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [M002](../../../implementation/modules/M002-importacao-editais/README.md) | Diagnostico de dados brutos | Done |

## User Stories

| ID | User Story |
|----|-----------|
| US-12-01 | Como operador tecnico, quero consultar o JSON bruto de um bolsista no dump SIGFAPES. |
| US-12-02 | Como operador, quero filtrar por `edital_id` e `formulario_bolsa_id` para localizar registros. |
| US-12-03 | Como sistema, quero retornar os dados sem transformacao para permitir debug. |
| US-12-04 | Como sistema, quero informar de qual dump (`dump_prefix`, `source_key`) os dados vieram. |

## Cenarios de aceitacao do produto

- **`GET /bolsista-dump-json`**: query `edital_id` (numerico) e `formulario_bolsa_id` (string).
- **Leitura Parquet**: `bolsistas_projeto.parquet` do dump mais recente via `pyarrow.parquet.read_table`.
- **Filtro exato**: match por `edital_id` + `formulario_bolsa_id`; nao aplica transformacao.
- **Resposta**: `{ok, edital_id, formulario_bolsa_id, dump_prefix, source_key, records: [...]}`.
- **404**: quando bolsista nao encontrado.
- **404/502**: quando dump incompleto ou Parquet ilegivel.
- **Validacoes**: `edital_id` deve ser numerico; `formulario_bolsa_id` nao pode ser vazio.
