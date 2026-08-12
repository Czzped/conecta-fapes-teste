---
title: OrcamentoFornecedor
tipo: tabela
---

# OrcamentoFornecedor

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Data | DateTime |
| Escolhido | bool |
| Fornecedor | string |
| OrcamentoFornecedorJustificativaDespesaId | Guid |
| UrlArquivoPDF | string |
| Valor | decimal |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[JustificativaDespesa]]
