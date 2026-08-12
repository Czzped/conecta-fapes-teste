---
title: ComiteGovernancaPrograma
tipo: tabela
---

# ComiteGovernancaPrograma

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| ComiteGovernancaProgramaPessoaId | Guid |
| ComiteGovernancaProgramaProgramaId | Guid |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Pessoa]]
- [[Programa]]
