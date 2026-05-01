# Modelo Estrutural - Aditivos da Iniciativa

[← Voltar](README.md)

## Entidades

### VigenciaIniciativa

Read model consultivo da vigencia e dados originais do projeto.

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| iniciativaId | IniciativaRef | Sim | Iniciativa vinculada |
| dataAprovacaoOriginal | Date | Sim | Data de aprovacao original do projeto |
| dataInicio | Date | Sim | Data inicial formal da iniciativa |
| dataFimOriginal | Date | Sim | Data final originalmente aprovada |
| dataFimVigente | Date | Sim | Data final atual, considerando aditivos de tempo aprovados |
| orcamentoOriginal | Decimal | Sim | Orcamento originalmente aprovado |
| possuiAditivoTempo | Boolean | Sim | Indica se existe aditivo de tempo aprovado |
| possuiAditivoFinanceiro | Boolean | Sim | Indica se existe aditivo financeiro aprovado |
| valorAditivadoTotal | Decimal | Nao | Soma dos valores aditivados financeiramente |

### AditivoIniciativa

Registro consultivo de cada termo aditivo vinculado ao projeto.

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| id | String | Sim | Identificador do aditivo |
| iniciativaId | IniciativaRef | Sim | Iniciativa vinculada |
| tipo | TipoAditivoIniciativa | Sim | Tempo, financeiro ou tempo e financeiro |
| situacao | SituacaoAditivoIniciativa | Sim | Situacao atual do aditivo |
| dataFormalizacao | Date | Nao | Data de aprovacao, publicacao ou formalizacao |
| dataFimAnterior | Date | Condicional | Data final vigente antes do aditivo de tempo |
| dataFimAditada | Date | Condicional | Nova data final aprovada pelo aditivo de tempo |
| valorAditivado | Decimal | Condicional | Valor acrescido pelo aditivo financeiro |
| documentoReferencia | String | Nao | Numero, link ou identificacao do termo/documento |
| observacao | String | Nao | Observacao resumida do aditivo |

## Enumeracoes

### TipoAditivoIniciativa

```text
TEMPO
FINANCEIRO
TEMPO_E_FINANCEIRO
```

### SituacaoAditivoIniciativa

```text
RASCUNHO
EM_ANALISE
APROVADO
REJEITADO
CANCELADO
```

## Relacionamentos

```mermaid
classDiagram
    Iniciativa "1" --> "1" VigenciaIniciativa
    Iniciativa "1" --> "0..*" AditivoIniciativa
    AditivoIniciativa "*" --> "0..1" Documento : referencia
```

## Invariantes

- `dataFimVigente` deve ser igual a `dataFimOriginal` quando nao houver aditivo de tempo aprovado.
- `orcamentoOriginal` nao deve ser sobrescrito por aditivo financeiro.
- A existencia de aditivo financeiro nao altera a data final vigente.
- A existencia de aditivo de tempo nao altera automaticamente o orcamento original.
- A lista de aditivos deve ser filtrada pela iniciativa selecionada e pelo perfil do usuario.
