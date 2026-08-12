---
title: RequisitoVersao
tipo: tabela
---

# RequisitoVersao

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| RequisitoBolsaId | Guid? |
| RequisitoVersaoRequisitoBolsaId | Guid |
| RequisitoVersaoVersaoId | Guid |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[RequisitoBolsa]]
- [[Versao]]
