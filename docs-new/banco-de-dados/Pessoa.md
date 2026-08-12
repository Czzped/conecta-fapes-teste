---
title: Pessoa
tipo: tabela
aliases: [pessoa]
---

# Pessoa

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Cpf | string |
| CurriculoLattesUrl | string |
| DataNascimento | DateTimeOffset |
| Email | string |
| EstadoCivil | int |
| IdSigfapes | int? |
| NivelAcademico | int |
| Nome | string |
| NomeCivil | string |
| NomeMae | string |
| NomePai | string |
| NomeResponsavel | string |
| PessoaUserId | Guid? |
| Raca | int |
| RegimeCasamento | int |
| ResponsavelLegalPessoaId | Guid? |
| Sexo | int |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[User]]
