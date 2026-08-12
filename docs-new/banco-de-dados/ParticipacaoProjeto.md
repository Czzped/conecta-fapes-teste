---
title: ParticipacaoProjeto
tipo: tabela
---

# ParticipacaoProjeto

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Papel | int |
| ParticipacaoProjetoCurriculoId | Guid |
| ParticipacaoProjetoPessoaId | Guid |
| ParticipacaoProjetoProjetoId | Guid |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Curriculo]]
- [[Pessoa]]
- [[ProjetoCurriculo]]
