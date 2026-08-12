---
title: CotasPorNivel
tipo: tabela
---

# CotasPorNivel

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| CotasPorNivelPlanejamentoAlocacaoId | Guid |
| CotasPorNivelVersaoNivelId | Guid |
| QuantidadeCotasPlanejadasComReducao | int |
| QuantidadeCotasPlanejadasSemReducao | int |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[PlanejamentoAlocacao]]
- [[VersaoNivel]]
