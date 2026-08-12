---
title: HistoricoEdicao
tipo: tabela
---

# HistoricoEdicao

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Campo | string |
| Data | DateTimeOffset |
| HistoricoEdicaoPessoaId | Guid |
| HistoricoEdicaoUsuarioId | Guid |
| Ip | string |
| ValorAnterior | string |
| ValorNovo | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Pessoa]]
- [[User]]
