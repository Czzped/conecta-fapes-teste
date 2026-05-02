# MapeamentoContabilRubrica

[Contexto Rubricas](../README.md) | [M008](../../README.md) | [Modelo estrutural consolidado](../../modelo-estrutural.md)

## Responsabilidade

`MapeamentoContabilRubrica` e a ponte opcional entre uma [Rubrica](../rubrica/README.md) canonica do M008 e a referencia de conta contabil mantida pelo M016. Esse mapeamento orienta classificacao, mas nao transforma rubrica em conta contabil.

## Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| contaContabilRef | Referencia da conta contabil no M016 | Sim | String | Ex: CONTA-339014 | 80 | |
| classificacaoContabil | Descricao ou codigo auxiliar de classificacao contabil | Nao | String | | 200 | |
| vigenciaInicio | Inicio da validade do mapeamento | Sim | Date | | | |
| vigenciaFim | Fim da validade do mapeamento | Nao | Date | | | |
| ativo | Indica se o mapeamento esta vigente para novas classificacoes | Sim | Boolean | true/false | | |

## Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| rubrica | 1 | Rubrica canonica vinculada ao mapeamento contabil |

## Regras

- RN20: mapeamento contabil e opcional e versionado por vigencia.
- O mapeamento referencia conta do M016 sem assumir ownership do plano de contas.
- Mapeamento inativo nao deve ser usado em novas classificacoes, mas deve permanecer consultavel.
