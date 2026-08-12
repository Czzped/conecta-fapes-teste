---
title: DocumentoParceria
tipo: tabela
---

# DocumentoParceria

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| ContentType | string |
| DataEnvio | DateTimeOffset |
| DocumentoParceriaAporteId | Guid? |
| DocumentoParceriaTipoDocumentoId | Guid |
| DocumentoParceriaVigenciaParceriaId | Guid? |
| NomeArquivo | string |
| ObjectName | string |
| Url | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[AporteParceriaInstituicao]]
- [[TipoDocumento]]
- [[VigenciaParceria]]
