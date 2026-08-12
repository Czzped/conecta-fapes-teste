---
title: HistoricoRemanejamento
tipo: tabela
---

# HistoricoRemanejamento

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| DataHora | DateTimeOffset |
| ExecutorCpf | string |
| ExecutorNome | string |
| ExecutorUserId | Guid |
| Justificativa | string |
| OrcamentoBolsa | decimal |
| PlanejamentoAlocacaoAnteriorId | Guid? |
| PlanejamentoAlocacaoNovoId | Guid |
| ProjetoId | Guid |
| ValorAlocado | decimal |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Projeto]]
