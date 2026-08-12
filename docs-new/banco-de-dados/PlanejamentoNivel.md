---
title: PlanejamentoNivel
tipo: tabela
---

# PlanejamentoNivel

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| PlanejamentoNivelCotasPorNivelId | Guid |
| PlanejamentoNivelPlanejamentoAlocacaoId | Guid |
| PlanejamentoNivelVersaoNivelId | Guid |
| Quantidade | int |
| QuantidadeBolsistas | int |
| QuantidadeMeses | int |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[CotasPorNivel]]
- [[PlanejamentoAlocacao]]
- [[VersaoNivel]]
