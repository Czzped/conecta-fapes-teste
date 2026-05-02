# SinonimoRubrica

[Contexto Rubricas](../README.md) | [M008](../../README.md) | [Modelo estrutural consolidado](../../modelo-estrutural.md)

## Responsabilidade

`SinonimoRubrica` registra termos alternativos usados em editais, planilhas, SIGFAPES ou sistemas legados para apontar para uma [Rubrica](../rubrica/README.md) canonica.

## Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| termo | Nome alternativo usado em fontes externas ou legadas | Sim | String | Ex: Passagens e Diarias | 200 | |
| origem | Origem do termo alternativo | Nao | String | Ex: Edital 08/2025, SIGFAPES | 200 | |
| ativo | Indica se o sinonimo continua valido para normalizacao | Sim | Boolean | true/false | | |

## Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| rubrica | 1 | Rubrica canonica a que o termo alternativo pertence |

## Regras

- RN19: sinonimos devem apontar para Rubrica canonica.
- Sinonimo apoia importacao e normalizacao, mas nao substitui o nome oficial da rubrica.
- Sinonimo inativo permanece consultavel para historico.
