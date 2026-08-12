---
title: Contestacao
tipo: tabela
---

# Contestacao

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Ativa | bool |
| ContestacaoPrestacaoId | Guid |
| Mensagem | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Prestacao]]
