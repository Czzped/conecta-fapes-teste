---
title: PassageiroPassagem
tipo: tabela
---

# PassageiroPassagem

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| DataEmissao | DateOnly |
| Localizador | string |
| Nome | string |
| PassageiroPassagemJustificativaPassagemId | Guid |
| Valor | decimal |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[JustificativaPassagem]]
