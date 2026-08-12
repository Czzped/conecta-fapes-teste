---
title: ContaContabil
tipo: tabela
---

# ContaContabil

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| ContaContabilOrcamentoId | Guid |
| ContaContabilParentId | Guid? |
| Descricao | string |
| Limite | decimal |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Orcamento]]
