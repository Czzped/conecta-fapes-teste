---
title: JustificativaPassagem
tipo: tabela
---

# JustificativaPassagem

## Colunas

| Coluna | Tipo |
|---|---|
| DataChegada | DateOnly |
| DataSaida | DateOnly |
| Destino | string |
| HorarioChegada | TimeOnly |
| HorarioSaida | TimeOnly |
| JustificativaPassagemContaContabilId | Guid |
| Origem | string |
| UrlComprovantePagamento | string |
| UrlComprovanteRealizacao | string |

## Relacionamentos (chaves estrangeiras)

- [[ContaContabil]]
- [[JustificativaDespesa]]
