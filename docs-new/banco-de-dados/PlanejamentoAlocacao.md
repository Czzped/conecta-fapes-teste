---
title: PlanejamentoAlocacao
tipo: tabela
---

# PlanejamentoAlocacao

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Data | DateTimeOffset |
| EhAtual | bool |
| OrcamentoBolsa | decimal? |
| PlanejamentoAlocacaoProjetoId | Guid |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Projeto]]
