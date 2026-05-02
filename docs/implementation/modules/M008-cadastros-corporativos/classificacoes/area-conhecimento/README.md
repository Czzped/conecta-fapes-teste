# AreaConhecimento

[Contexto Classificacoes](../README.md) | [M008](../../README.md) | [Modelo estrutural consolidado](../../modelo-estrutural.md)

## Responsabilidade

`AreaConhecimento` representa a classificacao hierarquica de areas do conhecimento, seguindo referencia CNPq, para uso em editais, avaliacao, cotas, enquadramento de propostas e indicadores.

## Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| codigo | Codigo da area conforme CNPq | Sim | String | Ex: 1.03.04 | 20 | Sim |
| nome | Nome da area de conhecimento | Sim | String | Ex: Ciencia da Computacao | 200 | |
| nivel | Nivel hierarquico da area | Sim | NivelArea | GRANDE_AREA, AREA, SUBAREA, ESPECIALIDADE | | |

## Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| areaPai | 0..1 | Area superior na hierarquia CNPq |
| subareas | 0..* | Areas filhas vinculadas |

## Enumeracoes

| Enum | Valores |
|------|---------|
| NivelArea | GRANDE_AREA, AREA, SUBAREA, ESPECIALIDADE |

## Regras

- RN06: areas de conhecimento seguem classificacao hierarquica CNPq.
- O codigo CNPq deve ser unico.
- Alteracoes devem preservar rastreabilidade para editais e propostas historicas.
