---
title: ContaBancaria
tipo: tabela
---

# ContaBancaria

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Agencia | string |
| Banco | string |
| ContaBancariaProjetoId | Guid? |
| Numero | string |
| SaldoAtual | decimal |
| Titular | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[ProjetoRef]]
