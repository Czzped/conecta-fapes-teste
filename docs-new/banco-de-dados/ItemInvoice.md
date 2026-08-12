---
title: ItemInvoice
tipo: tabela
---

# ItemInvoice

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Descricao | string |
| ItemInvoiceContaContabilId | Guid |
| ItemInvoiceJustificativaInvoiceId | Guid |
| Quantidade | int |
| ValorTotal | decimal |
| ValorUnitario | decimal |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[JustificativaInvoice]]
