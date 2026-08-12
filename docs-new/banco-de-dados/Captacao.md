---
title: Captacao
tipo: tabela
---

# Captacao

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| CaptacaoEtapaAtualId | Guid? |
| CaptacaoFomentoId | Guid |
| DataFim | DateTimeOffset? |
| DataInicio | DateTimeOffset |
| Nome | string |
| Status | int |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[EtapaCaptacao]]
- [[Fomento]]
