# EPI-05 — Metricas e Cobertura de Importacao

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |
| **Fonte no codigo** | `app/routers/editais.py:get_editais_grafico_metricas`, `app/services/editais.py:get_editais_grafico_metricas`, `frontend/src/pages/EditaisPage.tsx` (modo grafico) |

## Jornada

Na pagina `/editais`, o operador alterna entre modo "lista" (cards) e modo "grafico". No modo grafico, o frontend chama `GET /editais-grafico-metricas` que cruza o ultimo dump SIGFAPES (`editais.parquet`, `bolsistas_projeto.parquet`) com o ultimo dump Conecta (`alocacoes.parquet`) e calcula tres blocos de metricas: **importacao de alocacoes** (total FAPES vs importadas), **auditoria de linhas** (matched/unmatched) e **ativos por edital** (IDs presentes em um lado e ausentes no outro). A UI mostra barras comparativas com cobertura percentual. Quando `S3_BUCKET` nao esta configurado, a resposta entra em modo degradado retornando zeros e warnings em vez de erro.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [M002](../../../implementation/modules/M002-importacao-editais/README.md) | Metricas de cobertura | Done |

## User Stories

| ID | User Story |
|----|-----------|
| US-05-01 | Como operador, quero visualizar em modo grafico a cobertura de importacao por edital. |
| US-05-02 | Como operador, quero alternar entre modo lista e modo grafico mantendo filtros e ordenacao. |
| US-05-03 | Como operador, quero identificar editais com baixa cobertura para priorizar importacoes pendentes. |
| US-05-04 | Como sistema, quero cruzar IDs do SIGFAPES com IDs do Conecta para detectar inconsistencias. |
| US-05-05 | Como operador, quero ver a diferenca entre IDs presentes no SIGFAPES e ausentes no Conecta (e vice-versa). |
| US-05-06 | Como sistema, quero entrar em modo degradado (zeros + warnings) quando dumps nao estiverem disponiveis. |

## Cenarios de aceitacao do produto

- **Endpoint `GET /editais-grafico-metricas`**: retorna tres blocos — `allocation_importacao`, `allocation_auditoria`, `allocation_importacao_ativos_por_edital`.
- **`allocation_importacao`**: `total_fapes_rows`, `imported_rows`, `not_imported_rows`, `effective_total_for_chart`.
- **`allocation_auditoria`**: `total_alocacoes_rows`, `matched_rows`, `unmatched_rows`.
- **`allocation_importacao_ativos_por_edital`**: `active_editais_count`, `total_sigfapes_ids`, `total_conecta_ids`, `matched_ids`, `sigfapes_not_in_conecta_ids`, `conecta_not_in_sigfapes_ids`, `effective_total_for_chart`.
- **Modo degradado**: `S3_BUCKET` ausente retorna `{ok: true, degraded: true, warnings: [...]}` com todos os contadores zerados.
- **Alternancia lista/grafico**: botao no topo da pagina preserva filtro por texto e ordenacao ao trocar modo.
- **Atualizacao de metricas**: ao entrar no modo grafico, a UI mostra `chartMetricsLoading` ate receber resposta.
