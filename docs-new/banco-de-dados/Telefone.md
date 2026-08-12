---
title: Telefone
tipo: tabela
---

# Telefone

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| EhAtual | bool |
| Numero | string |
| TelefonePessoaId | Guid |
| TipoTelefone | int |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Pessoa]]
