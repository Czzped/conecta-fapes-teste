---
title: AporteFomento
tipo: tabela
---

# AporteFomento

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| AporteFomentoFomentoId | Guid |
| AporteFomentoParceriaId | Guid? |
| AporteFomentoProgramaId | Guid? |
| DataAporte | DateTimeOffset |
| IsAditivo | bool |
| Justificativa | string |
| ValorAportado | decimal |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Fomento]]
- [[Parceria]]
- [[Programa]]
