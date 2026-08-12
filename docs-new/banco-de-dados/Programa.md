---
title: Programa
tipo: tabela
---

# Programa

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| DataFim | DateTimeOffset |
| DataInicio | DateTimeOffset |
| Nome | string |
| ProgramaInstituicaoDemandanteId | Guid |
| ProgramaPlanejamentoEstrategicoId | Guid |
| Resumo | string |
| Status | int |
| TotalAportado | decimal |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Instituicao]]
- [[PlanejamentoEstrategico]]
