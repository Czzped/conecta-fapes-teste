---
title: FormacaoAcademica
tipo: tabela
---

# FormacaoAcademica

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| AnoConclusao | int? |
| AnoInicio | int |
| CodigoInstituicaoCnpq | string |
| Curso | string |
| FormacaoAcademicaCurriculoId | Guid |
| Nivel | int |
| NomeInstituicao | string |
| NomeOrientador | string |
| Status | int |
| TituloTrabalho | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Curriculo]]
