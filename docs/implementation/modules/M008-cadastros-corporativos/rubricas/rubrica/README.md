# Rubrica

[Contexto Rubricas](../README.md) | [M008](../../README.md) | [Modelo estrutural consolidado](../../modelo-estrutural.md) | [Discovery FAPES](../../../../../discovery/rubricas-subrubricas-fapes.md)

## Responsabilidade

`Rubrica` e o cadastro mestre de categorias normativas/orcamentarias usadas para classificar despesas. Ela possui codigo, nome, descricao e pode ter hierarquia por `rubricaPai`. Subrubrica nao e entidade separada: e uma Rubrica filha de outra Rubrica.

Rubrica nao representa movimentacao financeira. A movimentacao de saldo fica em M013 como `Transacao`; pagamentos e movimentos bancarios ficam em M014/M016 como `TransacaoFinanceira` ou `MovimentacaoFinanceira`.

## Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| codigo | Codigo canonico da rubrica | Sim | String | Ex: RUB-DIARIAS | 40 | Sim |
| nome | Nome de exibicao da rubrica | Sim | String | Ex: Diarias | 150 | |
| descricao | Descricao da rubrica | Sim | String | | 500 | |
| natureza | Natureza da despesa | Sim | NaturezaDespesa | CUSTEIO, CAPITAL | | |
| categoriaOrcamentaria | Categoria orcamentaria vinculada, quando aplicavel | Nao | String | | 200 | |
| documentoFonte | Norma, edital ou resolucao que fundamenta a rubrica | Nao | String | Ex: Resolucao CCAF no 309/2022 | 300 | |
| vigenciaInicio | Data de inicio da vigencia cadastral | Nao | Date | | | |
| vigenciaFim | Data de fim da vigencia cadastral | Nao | Date | | | |
| ativa | Indica se a rubrica esta ativa | Sim | Boolean | true/false | | |

## Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| rubricaPai | 0..1 | Rubrica superior quando esta rubrica detalha uma categoria maior |
| subrubricas | 0..* | Rubricas filhas vinculadas |
| sinonimos | 0..* | Termos alternativos, via [SinonimoRubrica](../sinonimo-rubrica/README.md) |
| mapeamentosContabeis | 0..* | Mapeamentos opcionais para M016, via [MapeamentoContabilRubrica](../mapeamento-contabil-rubrica/README.md) |

## Enumeracoes

| Enum | Valores |
|------|---------|
| NaturezaDespesa | CUSTEIO, CAPITAL |

## Regras

- RN16: toda Rubrica deve possuir codigo canonico unico, nome, descricao, natureza e situacao ativa/inativa.
- RN17: subrubricas sao representadas por relacao opcional com `rubricaPai`; nao ha campo adicional para classificar nivel.
- RN18: rubrica inativa nao deve ser ofertada em novas configuracoes, mas permanece consultavel para historico.
- RN19: sinonimos apontam para uma rubrica canonica e nao substituem o nome oficial.
- RN20: mapeamento contabil e opcional, versionado por vigencia e referencia contas do M016.
- RN21: rubrica nao deve armazenar transacoes financeiras nem movimentos de saldo.
