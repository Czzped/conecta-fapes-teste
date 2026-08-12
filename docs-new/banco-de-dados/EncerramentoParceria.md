---
title: EncerramentoParceria
tipo: tabela
---

# EncerramentoParceria

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| DataEncerramento | DateTimeOffset |
| EncerramentoParceriaAreaTecnicaId | Guid |
| EncerramentoParceriaParceriaId | Guid |
| EncerramentoParceriaUsuarioEncerramentoId | Guid |
| Justificativa | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[AreaTecnica]]
- [[Parceria]]
