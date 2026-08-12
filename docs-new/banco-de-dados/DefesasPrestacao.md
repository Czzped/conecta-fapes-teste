---
title: DefesasPrestacao
tipo: tabela
---

# DefesasPrestacao

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Estado | int |
| Justificativa | string |
| PrestacaoId | Guid |
| SubmetidaEm | DateTimeOffset |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Prestacao]]
