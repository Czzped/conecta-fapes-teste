---
title: DeclaracaoAtividadeRemunerada
tipo: tabela
---

# DeclaracaoAtividadeRemunerada

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| CargaHorariaSemanal | string |
| NomeCargo | string |
| NomeDaInstituicao | string |
| TermoResponsabilidadeMetadadoId | Guid |
| TipoDeAtividadeRemunerada | string |
| TipoDeVinculoComInstituicao | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[TermoResponsabilidadeMetadado]]
