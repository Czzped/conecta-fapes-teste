---
title: DeclaracaoOutraBolsa
tipo: tabela
---

# DeclaracaoOutraBolsa

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| ModalidadeDaBolsa | string |
| NomeDaInstituicao | string |
| TermoDeResponsabilidadeMetadadoId | Guid |
| VigenciaDaBolsa | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[TermoResponsabilidadeMetadado]]
