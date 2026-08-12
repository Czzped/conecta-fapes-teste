---
title: ItemDocumentoFiscal
tipo: tabela
---

# ItemDocumentoFiscal

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| CFOP | string |
| ContaContabilId | Guid? |
| Descricao | string |
| ItemDocumentoFiscalContaContabilId | Guid |
| ItemDocumentoFiscalDocumentoFiscalId | Guid |
| NCM | string |
| Quantidade | int |
| ValorTotal | decimal |
| ValorUnitario | decimal |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[ContaContabil]]
- [[DocumentoFiscal]]
