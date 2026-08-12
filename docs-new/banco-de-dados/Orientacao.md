---
title: Orientacao
tipo: tabela
---

# Orientacao

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| DataFim | DateTimeOffset? |
| DataInicio | DateTimeOffset |
| OrientacaoAlocacaoBolsistaId | Guid |
| OrientacaoAtual | bool |
| OrientacaoPessoaId | Guid |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[AlocacaoBolsista]]
- [[Pessoa]]
