# Finalidade

[Contexto Classificacoes](../README.md) | [M008](../../README.md) | [Modelo estrutural consolidado](../../modelo-estrutural.md)

## Responsabilidade

`Finalidade` e uma tabela corporativa de propositos institucionais usada para classificar parcerias, programas, editais e outras configuracoes transversais.

## Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| nome | Nome da finalidade | Sim | String | Ex: Pesquisa, Inovacao, Extensao | 200 | Sim |
| descricao | Descricao do proposito | Nao | String | | 500 | |

## Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| consumidores | 0..* | Modulos que usam a finalidade como classificacao |

## Regras

- Nome da finalidade deve ser unico.
- Finalidades sao referencia corporativa e devem ser reutilizadas por modulos consumidores.
- Finalidade inativa nao deve ser ofertada em novas configuracoes, mas deve permanecer consultavel para historico.
