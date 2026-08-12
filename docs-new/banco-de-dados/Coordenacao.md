---
title: Coordenacao
tipo: tabela
---

# Coordenacao

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| CoordenacaoPessoaId | Guid |
| CoordenacaoProjetoId | Guid |
| CoordenadorAtual | bool |
| DataFim | DateTimeOffset? |
| DataInicio | DateTimeOffset |
| JustificativaDeSubstituicao | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Pessoa]]
- [[Projeto]]
