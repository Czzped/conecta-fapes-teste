---
title: TermoResponsabilidadeMetadado
tipo: tabela
---

# TermoResponsabilidadeMetadado

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| AlocacaoBolsistaId | Guid |
| Assinado | bool |
| DocumentoMetadadoId | Guid |
| PossuiVinculoParentescoCosanguineo | bool |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[AlocacaoBolsista]]
- [[DocumentoMetadado]]
