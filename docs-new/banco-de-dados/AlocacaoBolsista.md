---
title: AlocacaoBolsista
tipo: tabela
aliases: [alocacao-bolsista]
---

# AlocacaoBolsista

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| AlocacaoBolsistaAreaConhecimentoId | Guid? |
| AlocacaoBolsistaPessoaId | Guid? |
| AlocacaoBolsistaProjetoId | Guid? |
| AlocacaoBolsistaVersaoNivelId | Guid? |
| Atividade | string |
| DataFimAtividade | DateTimeOffset? |
| DataFimPrevistaAtividade | DateTimeOffset? |
| DataInicio | DateTimeOffset? |
| DataLimiteEnvio | DateTimeOffset? |
| DataSolicitacaoCancelamento | DateTimeOffset? |
| DataUltimaMudancaDeStatusAlocacao | DateTimeOffset? |
| EhPagamentoAvancado | bool |
| IdSigfapes | int? |
| JustificativaCancelamento | string |
| JustificativaReprovacao | string |
| Matricula | string |
| MesAprovacao | DateTimeOffset? |
| MesReprovacao | DateTimeOffset? |
| NomeBolsista | string |
| ObjetivosMetas | string |
| PossuiReducaoBolsa | bool |
| QtdeCotasAlocadas | int? |
| QtdeCotasPagasPreImportacao | int |
| RevisaoDocumentosSolicitada | bool |
| Status | int? |
| StatusCadastroBaneste | int |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[AreaConhecimento]]
- [[Pessoa]]
- [[Projeto]]
- [[VersaoNivel]]
