---
title: Livro
tipo: tabela
---

# Livro

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Ano | int |
| AutoresCitacao | string |
| Isbn | string |
| LivroCurriculoId | Guid |
| NomeEditora | string |
| Papel | string |
| Tipo | int |
| Titulo | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Curriculo]]
