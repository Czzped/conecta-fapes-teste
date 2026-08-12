---
title: AporteParceriaInstituicao
tipo: tabela
---

# AporteParceriaInstituicao

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| AporteParceriaInstituicaoInstituicaoId | Guid |
| AporteParceriaInstituicaoParceriaId | Guid |
| DataAporte | DateTimeOffset |
| IsAditivo | bool |
| Justificativa | string |
| ValorInvestido | decimal |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Instituicao]]
- [[Parceria]]
