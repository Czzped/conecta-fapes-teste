---
title: Endereco
tipo: tabela
---

# Endereco

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Bairro | string |
| Cep | string |
| Complemento | string |
| EhEnderecoDeCorrespondencia | bool |
| EnderecoPessoaId | Guid |
| Logradouro | string |
| Municipio | string |
| Numero | string |
| Pais | string |
| TipoEndereco | int |
| UfLocalidade | string |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[Pessoa]]
