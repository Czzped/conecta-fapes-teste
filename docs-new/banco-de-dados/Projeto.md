---
title: Projeto
tipo: tabela
aliases: [projeto]
---

# Projeto

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| AlocacoesCompletas | int |
| DataFimPrevistaAtividade | DateTimeOffset |
| DataInicio | DateTimeOffset |
| IdSigfapes | int? |
| Nome | string |
| OrcamentoTotal | decimal? |
| ProjetoEditalId | Guid |
| Status | int |
| StatusPreenchimento | int |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Edital]]
