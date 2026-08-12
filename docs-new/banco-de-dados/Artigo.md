---
title: Artigo
tipo: tabela
---

# Artigo

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Ano | int |
| ArtigoCurriculoId | Guid |
| AutoresCitacao | string |
| Doi | string |
| Issn | string |
| NomePeriodico | string |
| Qualis | string |
| Titulo | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Curriculo]]
