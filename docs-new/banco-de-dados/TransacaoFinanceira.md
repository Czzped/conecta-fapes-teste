---
title: TransacaoFinanceira
tipo: tabela
---

# TransacaoFinanceira

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| CategoriaLancamento | string |
| Classificacao | int? |
| CodigoHistorico | string |
| Data | DateTimeOffset |
| Descricao | string |
| Identificador | string |
| NaturezaLancamento | string |
| Tipo | int |
| TransacaoEstornadaId | Guid? |
| TransacaoFinanceiraArquivoControleId | Guid? |
| TransacaoFinanceiraContaBancariaId | Guid |
| TransacaoFinanceiraPrestacaoId | Guid? |
| Valor | decimal |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[ContaBancaria]]
- [[Prestacao]]
