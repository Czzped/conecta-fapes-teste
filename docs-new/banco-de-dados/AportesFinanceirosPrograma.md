---
title: AportesFinanceirosPrograma
tipo: tabela
---

# AportesFinanceirosPrograma

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| AporteFinanceiroProgramaParceriaId | Guid |
| AporteFinanceiroProgramaProgramaId | Guid |
| DataAporte | DateTimeOffset |
| ValorAportado | decimal |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Parceria]]
- [[Programa]]
