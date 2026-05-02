# Regiao

[Contexto Geografia](../README.md) | [M008](../../README.md) | [Modelo estrutural consolidado](../../modelo-estrutural.md)

## Responsabilidade

`Regiao` agrupa cidades para analises territoriais, configuracoes de editais, acompanhamento de cobertura e organizacao geografica do estado.

## Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| nome | Nome da regiao | Sim | String | Ex: Grande Vitoria | 200 | Sim |
| descricao | Descricao da regiao | Nao | String | | 500 | |

## Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| cidades | 0..* | Cidades agrupadas na regiao |

## Regras

- RN09: regioes agrupam cidades do estado.
- Nome da regiao deve ser unico.
- A regiao nao substitui o cadastro oficial da cidade; apenas organiza agrupamentos.
