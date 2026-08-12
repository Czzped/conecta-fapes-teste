---
title: HistoricoRemanejamentoItem
tipo: tabela
---

# HistoricoRemanejamentoItem

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| CotasAlocadas | int |
| CotasPlanejadasAntes | int |
| CotasPlanejadasDepois | int |
| HistoricoRemanejamentoId | Guid |
| ModalidadeSigla | string |
| NivelBolsaId | Guid |
| NivelSigla | string |
| PossuiReducao | bool |
| VersaoModalidadeId | Guid |
| VersaoNivelId | Guid |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[HistoricoRemanejamento]]
- [[NivelBolsa]]
- [[VersaoModalidade]]
- [[VersaoNivel]]
