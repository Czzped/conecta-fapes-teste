---
title: PagamentoBolsista
tipo: tabela
aliases: [pagamento-bolsista]
---

# PagamentoBolsista

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| DataPagamento | DateTimeOffset? |
| MesCompetencia | DateTimeOffset |
| Ordem | int |
| PagamentoBolsistaAlocacaoBolsistaId | Guid |
| Status | int |
| ValorBonus | decimal |
| ValorOriginal | decimal |
| ValorPago | decimal |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[AlocacaoBolsista]]
