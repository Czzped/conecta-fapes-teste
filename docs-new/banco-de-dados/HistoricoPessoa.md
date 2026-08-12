---
title: HistoricoPessoa
tipo: tabela
---

# HistoricoPessoa

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Data | DateTimeOffset |
| Descricao | string |
| Evento | int |
| HistoricoPessoaPessoaId | Guid |
| HistoricoPessoaUsuarioId | Guid |
| Ip | string |
| Justificativa | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Pessoa]]
- [[User]]
