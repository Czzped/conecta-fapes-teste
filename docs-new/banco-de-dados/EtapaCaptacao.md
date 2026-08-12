---
title: EtapaCaptacao
tipo: tabela
---

# EtapaCaptacao

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| DataFim | DateTimeOffset |
| DataInicio | DateTimeOffset |
| EtapaCaptacaoCaptacaoId | Guid |
| EtapaCaptacaoEtapaFomentoId | Guid |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Captacao]]
- [[EtapaFomento]]
