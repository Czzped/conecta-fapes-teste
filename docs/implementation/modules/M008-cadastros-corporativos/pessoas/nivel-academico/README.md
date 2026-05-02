# NivelAcademico

[Contexto Pessoas](../README.md) | [M008](../../README.md) | [Modelo estrutural consolidado](../../modelo-estrutural.md)

## Responsabilidade

`NivelAcademico` e uma tabela corporativa de referencia para registrar o maior nivel academico de uma pessoa e apoiar validacoes de elegibilidade em captacoes, bolsas, avaliacao e demais fluxos que usem escolaridade como criterio.

## Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| nome | Nome do nivel academico | Sim | String | Ex: Graduacao, Especializacao, Mestrado, Doutorado, Pos-Doutorado | 100 | Sim |
| descricao | Descricao do nivel academico | Nao | String | | 300 | |

## Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| pessoas | 0..* | Pessoas que informaram o nivel como maior titulacao |

## Regras

- O nome do nivel academico deve ser unico.
- A tabela deve ser mantida como referencia corporativa e consumida pelos modulos que precisam validar requisitos academicos.
- Alteracoes no cadastro nao devem apagar historico de pessoas que ja utilizaram o nivel.
