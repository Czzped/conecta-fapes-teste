---
title: SuspensaoPrograma
tipo: tabela
---

# SuspensaoPrograma

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Ativa | bool |
| DataReativacao | DateTimeOffset? |
| DataSuspensao | DateTimeOffset |
| SuspensaoProgramaParceriaId | Guid? |
| SuspensaoProgramaProgramaId | Guid |
| SuspensaoProgramaSuspensaoParceriaId | Guid? |
| SuspensaoProgramaUsuarioReativacaoId | Guid? |
| SuspensaoProgramaUsuarioSuspensaoId | Guid |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Parceria]]
- [[Programa]]
- [[SuspensaoParceria]]
