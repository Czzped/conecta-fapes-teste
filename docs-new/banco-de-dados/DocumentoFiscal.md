---
title: DocumentoFiscal
tipo: tabela
---

# DocumentoFiscal

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| ChaveAcesso | string |
| Descricao | string |
| DocumentoFiscalJustificativaNFId | Guid |
| Identificador | string |
| NomeEmitente | string |
| Pais | string |
| TipoNota | int |
| TotalICMS | decimal |
| TotalIPI | decimal |
| TotalISS | decimal |
| TotalPIS | decimal |
| UF | string |
| ValorTotal | decimal |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[JustificativaNF]]
