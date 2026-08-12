---
title: JustificativaDespesa
tipo: tabela
---

# JustificativaDespesa

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Descricao | string |
| JustificativaDespesaPrestacaoId | Guid |
| UrlArquivo | string |
| ValorTotal | decimal |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Prestacao]]
