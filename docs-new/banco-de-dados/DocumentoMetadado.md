---
title: DocumentoMetadado
tipo: tabela
aliases: [documento-metadado]
---

# DocumentoMetadado

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| AlocacaoBolsistaId | Guid? |
| Autenticado | bool? |
| ContentType | string |
| EnviadoParaValidacaoExterna | bool? |
| JustificativaPedidoRevisao | string |
| JustificativaReprovacao | string |
| JustificativaValidacaoExterna | string |
| NomeOriginal | string |
| ObjectName | string |
| PessoaId | Guid? |
| RequisistoBolsaId | Guid? |
| Status | int |
| Validado | bool? |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[AlocacaoBolsista]]
- [[Pessoa]]
- [[RequisitoBolsa]]
