---
title: DocumentosDefesa
tipo: tabela
---

# DocumentosDefesa

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| Caminho | string |
| ContentType | string |
| DefesaPrestacaoId | Guid |
| NomeArquivo | string |
| TamanhoBytes | long |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[DefesasPrestacao]]
