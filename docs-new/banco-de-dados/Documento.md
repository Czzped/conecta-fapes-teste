---
title: Documento
tipo: tabela
---

# Documento

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| DataEmissao | DateTimeOffset |
| DocumentoPessoaId | Guid |
| Numero | string |
| OrgaoEmissor | string |
| TipoDocumento | int |
| UfOrgaoEmissor | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Pessoa]]
