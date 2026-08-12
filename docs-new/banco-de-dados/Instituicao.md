---
title: Instituicao
tipo: tabela
---

# Instituicao

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Ativa | bool |
| Cnpj | string |
| Email | string |
| Endereco | string |
| InstituicaoSuperiorId | Guid? |
| InstituicaoTipoInstituicaoId | Guid? |
| IsExterna | bool |
| IsPublica | bool? |
| Nome | string |
| RazaoSocial | string |
| Sigla | string |
| Telefone | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[TipoInstituicao]]
