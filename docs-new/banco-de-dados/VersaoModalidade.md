---
title: VersaoModalidade
tipo: tabela
aliases: [versao-modalidade]
---

# VersaoModalidade

## Colunas

| Coluna | Tipo |
|---|---|
| DataFimVigencia | DateTimeOffset? |
| DataInicioVigencia | DateTimeOffset |
| Descricao | string |
| Estado | int |
| ReducaoPorVinculo | decimal |
| Sigla | string |
| VersaoModalidadeModalidadeBolsaId | Guid |
| VersaoModalidadeResolucaoId | Guid |

## Relacionamentos (chaves estrangeiras)

- [[ModalidadeBolsa]]
- [[Resolucao]]
- [[Versao]]
