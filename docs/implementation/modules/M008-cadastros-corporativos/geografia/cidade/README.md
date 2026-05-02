# Cidade

[Contexto Geografia](../README.md) | [M008](../../README.md) | [Modelo estrutural consolidado](../../modelo-estrutural.md)

## Responsabilidade

`Cidade` e a referencia geografica de municipios usada para enderecos, regioes, abrangencia territorial, editais e indicadores.

## Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| nome | Nome da cidade | Sim | String | Ex: Vitoria | 200 | |
| codigoIBGE | Codigo IBGE da cidade | Sim | String | Ex: 3205309 | 10 | Sim |

## Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| regiao | 0..1 | Regiao de agrupamento territorial, via [Regiao](../regiao/README.md) |

## Regras

- RN09: cidades devem pertencer a uma regiao quando houver agrupamento territorial definido.
- Codigo IBGE deve ser unico.
- A cidade deve permanecer consultavel para historico mesmo se deixar de ser usada em novas operacoes.
