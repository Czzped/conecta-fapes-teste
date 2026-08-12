---
title: DadosBancarios
tipo: tabela
---

# DadosBancarios

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Agencia | string |
| Conta | string |
| DadosBancariosBancoId | Guid |
| DadosBancariosPessoaId | Guid |
| EhAtual | bool? |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Banco]]
- [[Pessoa]]
