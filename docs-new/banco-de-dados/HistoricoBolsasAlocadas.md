---
title: HistoricoBolsasAlocadas
tipo: tabela
---

# HistoricoBolsasAlocadas

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| DataFim | DateTimeOffset |
| DataInicio | DateTimeOffset |
| HistoricoBolsasAlocadasAlocacaoBolsistaId | Guid |
| HistoricoBolsasAlocadasVersaoNivelId | Guid |
| PossuiReducaoBolsa | bool |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[AlocacaoBolsista]]
- [[VersaoNivel]]
