---
title: SuspensaoParceria
tipo: tabela
---

# SuspensaoParceria

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Ativa | bool |
| DataReativacao | DateTimeOffset? |
| DataSuspensao | DateTimeOffset |
| Motivo | string |
| SuspensaoParceriaAreaTecnicaId | Guid? |
| SuspensaoParceriaAreaTecnicaReativacaoId | Guid? |
| SuspensaoParceriaInstituicaoId | Guid? |
| SuspensaoParceriaInstituicaoReativacaoId | Guid? |
| SuspensaoParceriaParceriaId | Guid |
| SuspensaoParceriaUsuarioReativacaoId | Guid? |
| SuspensaoParceriaUsuarioSuspensaoId | Guid |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[AreaTecnica]]
- [[Instituicao]]
- [[Parceria]]
