---
title: ParticipacaoEvento
tipo: tabela
---

# ParticipacaoEvento

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Ano | int |
| Cidade | string |
| Natureza | string |
| Nome | string |
| Papel | int |
| ParticipacaoEventoCurriculoId | Guid |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Curriculo]]
