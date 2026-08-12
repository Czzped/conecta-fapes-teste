---
title: RespostaFormulario
tipo: tabela
---

# RespostaFormulario

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Codigo | string |
| DataRegistro | DateTimeOffset |
| DataUltimaAlteracao | DateTimeOffset? |
| Estado | int |
| RespostaFormularioCaptacaoId | Guid |
| RespostaFormularioFormularioId | Guid |
| RespostaFormularioProjetoId | Guid |
| Respostas | string |
| ResultadoAvaliacao | decimal? |
| ResultadoHabilitacao | int? |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Captacao]]
- [[Formulario]]
- [[Projeto]]
