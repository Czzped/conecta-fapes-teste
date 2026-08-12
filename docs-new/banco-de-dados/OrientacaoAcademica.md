---
title: OrientacaoAcademica
tipo: tabela
---

# OrientacaoAcademica

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| AnoConclusao | int |
| AnoInicio | int? |
| CodigoInstituicaoCnpq | string |
| IdLattesOrientando | string |
| Nivel | int |
| NomeInstituicao | string |
| NomeOrientando | string |
| OrientacaoAcademicaCurriculoId | Guid |
| Papel | string |
| Status | int |
| TituloTrabalho | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Curriculo]]
