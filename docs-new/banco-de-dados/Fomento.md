---
title: Fomento
tipo: tabela
---

# Fomento

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Codigo | string |
| DataFim | DateTimeOffset? |
| DataInicio | DateTimeOffset? |
| Descricao | string |
| FomentoEditalId | Guid? |
| FomentoFormularioId | Guid? |
| ResultadoEsperado | string |
| Status | int |
| TipoChamamento | int |
| Titulo | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Edital]]
- [[Formulario]]
