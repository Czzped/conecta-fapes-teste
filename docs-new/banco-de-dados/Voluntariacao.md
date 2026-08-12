---
title: Voluntariacao
tipo: tabela
aliases: [voluntariacao-tabela]
---

# Voluntariacao

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| DataFim | DateTimeOffset? |
| DataInicio | DateTimeOffset |
| DataUltimaMudancaDeStatus | DateTimeOffset? |
| JustificativaCancelamento | string |
| JustificativaReprovacao | string |
| Status | int |
| VoluntariacaoPessoaId | Guid |
| VoluntariacaoProjetoId | Guid |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Pessoa]]
- [[Projeto]]
