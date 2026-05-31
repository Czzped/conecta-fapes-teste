# Modelo Estrutural — P1 Fomento

Contexto: [README.md](../README.md) | Modelo consolidado: [modelo-estrutural.md](modelo-estrutural.md) | Por processo: [P2](modelo-estrutural-p2-configuracao-selecao.md) | [P3](modelo-estrutural-p3-selecao-projetos.md)

---

## P1 - Fomento

```mermaid
classDiagram
    direction TB

    class Fomento {
        +String codigo
        +String titulo
        +String descricao
        +EstadoFomento estado
        +Date dataInicio
        +Date dataFim
    }

    class AporteFomento {
        +TipoOrigemAporte origemTipo
        +Decimal valorAportado
        +Date dataAporte
        +Boolean isAditivo
        +String justificativa
    }

    class Faixa {
        +String nome
        +String descricao
    }

    class RubricaPermitidaFaixa {
        +Decimal percentualMinimo
        +Decimal percentualMaximo
        +String restricoes
        +String observacao
    }

    class BolsaPermitidaFaixa {
        +Integer quantidadeMinimaCotas
        +Integer minimoBolsistas
        +String observacao
    }

    class ResultadoEsperadoFomento {
        +TipoResultado tipo
        +String descricao
        +String indicador
    }

    class RemanejamentoFaixas {
        +Decimal valor
        +String justificativa
        +Date dataRegistro
        +Decimal valorOrigemAnterior
        +Decimal valorDestinoAnterior
    }

    class EstadoFomento {
        <<enumeration>>
        EM_ELABORACAO
        APROVADO
        INTERROMPIDO
        ENCERRADO
        CONCLUIDO
    }

    class TipoOrigemAporte {
        <<enumeration>>
        PROGRAMA
        PARCERIA
        RECURSO_INTERNO
    }

    class TipoResultado {
        <<externo shared>>
    }

    class Programa {
        <<externo M010>>
    }

    class Parceria {
        <<externo M010>>
    }

    class EixoEstrategico {
        <<externo M010>>
    }

    class AreaTecnica {
        <<externo M008>>
    }

    class TipoProjeto {
        <<externo M008>>
    }

    class Rubrica {
        <<externo M008>>
    }

    class VersaoNivel {
        <<externo M001>>
    }

    class ContaContabil {
        <<externo M016>>
    }

    Fomento "1" --> "1" EixoEstrategico : atinge
    Fomento "1" --> "1" AreaTecnica : gerenciado por
    Fomento "1" --> "1..*" AporteFomento : aportes
    Fomento "1" --> "1..*" Faixa : faixas
    Fomento "1" --> "*" ResultadoEsperadoFomento : resultados esperados
    Fomento "1" --> "*" RemanejamentoFaixas : remanejamentos
    Fomento "*" --> "1" TipoProjeto : tipos de projeto

    AporteFomento "*" --> "0..1" Programa : origem programa
    AporteFomento "*" --> "0..1" Parceria : origem parceria
    AporteFomento "*" --> "0..1" ContaContabil : recurso interno

    Faixa "1" --> "*" RubricaPermitidaFaixa : rubricas permitidas
    Faixa "1" --> "*" BolsaPermitidaFaixa : bolsas permitidas
    RubricaPermitidaFaixa "*" --> "1" Rubrica : rubrica
    RubricaPermitidaFaixa "0..1" --> "*" RubricaPermitidaFaixa : subrubricas
    BolsaPermitidaFaixa "*" --> "1" VersaoNivel : versao nivel

    RemanejamentoFaixas "*" --> "1" Faixa : origem
    RemanejamentoFaixas "*" --> "1" Faixa : destino
```

---

## Dicionario de Dados

| Classe | Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|--------|----------|-----------|--------|------|---------|---------|-------|
| **Fomento** | codigo | Codigo do fomento | Gerado | String | | | Sim |
| | titulo | Titulo do fomento | Sim | String | | 200 | |
| | descricao | Descricao do fomento | Nao | String | | 1000 | |
| | estado | Estado do fomento | Sim | EstadoFomento | EM_ELABORACAO, APROVADO, INTERROMPIDO, ENCERRADO, CONCLUIDO | | |
| | dataInicio | Data de inicio da vigencia do fomento | Sim | Date | | | |
| | dataFim | Data de fim da vigencia do fomento | Sim | Date | | | |
| | eixoEstrategico (relacao) | Eixo estrategico ao qual o fomento esta vinculado | Sim | FK → EixoEstrategico | Via M010 | | |
| | areaTecnica (relacao) | Area tecnica responsavel pelo fomento | Sim | FK → AreaTecnica | Via M008 | | |
| **AporteFomento** | origemTipo | Tipo da origem que aporta recurso no fomento | Sim | TipoOrigemAporte | PROGRAMA, PARCERIA, RECURSO_INTERNO | | |
| | valorAportado | Valor financeiro aportado | Sim | Double | > 0 | | |
| | dataAporte | Data do registro do aporte | Sim | Date | | | |
| | isAditivo | Indica se e aporte adicional ao original da mesma origem | Sim | Boolean | true/false | | |
| | justificativa | Motivo do aporte; obrigatorio quando isAditivo=true ou origemTipo=RECURSO_INTERNO | Cond. | String | | 500 | |
| | programa (relacao) | Programa de origem quando origemTipo=PROGRAMA | Cond. | FK → Programa | Via M010 | | |
| | parceria (relacao) | Parceria de origem quando origemTipo=PARCERIA | Cond. | FK → Parceria | Via M010 | | |
| | contaContabil (relacao) | Conta contabil interna quando origemTipo=RECURSO_INTERNO | Cond. | FK → ContaContabil | Via M016 | | |
| **Faixa** | nome | Nome da faixa | Sim | String | | 200 | |
| | descricao | Descricao da finalidade ou recorte da faixa | Nao | String | | 500 | |
| **RubricaPermitidaFaixa** | rubrica (relacao) | Rubrica autorizada para propostas da faixa | Sim | FK → Rubrica | Via M008 | | |
| | percentualMinimo | Percentual minimo permitido para a rubrica na faixa | Nao | Double | 0 a 100 | | |
| | percentualMaximo | Percentual maximo permitido; deve ser >= percentualMinimo quando ambos informados | Nao | Double | 0 a 100 | | |
| | restricoes | Exclusoes ou restricoes especificas | Nao | String | | 1000 | |
| | observacao | Orientacao de uso da rubrica na faixa | Nao | String | | 500 | |
| | rubricaPai (relacao) | Rubrica pai quando representar subrubrica; nulo para rubrica raiz | Cond. | FK → RubricaPermitidaFaixa | | | |
| **BolsaPermitidaFaixa** | versaoNivel (relacao) | Versao do nivel de bolsa permitida na faixa | Sim | FK → VersaoNivel | Via M001 | | |
| | quantidadeMinimaCotas | Quantidade minima de cotas exigida | Sim | Int | >= 0 | | |
| | minimoBolsistas | Quantidade minima de bolsistas exigida | Sim | Int | >= 0 | | |
| | observacao | Orientacao de uso da versao de bolsa na faixa | Nao | String | | 500 | |
| **ResultadoEsperadoFomento** | tipo | Tipo do resultado esperado | Sim | TipoResultado | PRODUTO, SERVICO, PROCESSO | | |
| | descricao | Descricao do resultado esperado | Sim | String | | 500 | |
| | indicador | Indicador de medicao do resultado | Nao | String | | 300 | |
| **RemanejamentoFaixas** | faixaOrigem (relacao) | Faixa de origem do remanejamento | Sim | FK → Faixa | | | |
| | faixaDestino (relacao) | Faixa de destino do remanejamento | Sim | FK → Faixa | | | |
| | valor | Valor remanejado entre as faixas | Sim | Double | > 0 | | |
| | justificativa | Motivo do remanejamento | Sim | String | | 500 | |
| | dataRegistro | Data de registro do remanejamento | Gerado | Date | | | |
| | valorOrigemAnterior | Valor da faixa de origem antes do remanejamento | Gerado | Double | | | |
| | valorDestinoAnterior | Valor da faixa de destino antes do remanejamento | Gerado | Double | | | |

---

## Regras de Negocio

### Fomento

| ID | Responsavel | Regra |
|----|-------------|-------|
| RN-F01 | GestorFomento | Todo Fomento deve possuir ao menos um aporte financeiro originado de Programa, Parceria ou recurso interno. |
| RN-F02 | GestorFomento | Todo Fomento deve estar vinculado a exatamente um eixo estrategico do M010. |
| RN-F03 | GestorFomento | Todo Fomento deve possuir ao menos uma faixa antes de ser aprovado. |
| RN-F05 | GestorFomento | Cada aporte deve indicar exatamente uma origem, possuir valor > 0, data do aporte e justificativa quando aplicavel. |
| RN-F06 | GestorFomento | O total financeiro do Fomento e calculado pela soma dos aportes; nao ha total manual. |
| RN-F07 | GestorFomento | Todo Fomento deve possuir ao menos um tipo de projeto aceito. |
| RN-F09 | AnalistaTecnico | Rubricas e subrubricas sao configuradas por faixa. |
| RN-F10 | AnalistaTecnico | Quando a rubrica Bolsa estiver permitida em uma faixa, devem ser configuradas as modalidades e niveis de bolsa permitidos. |
| RN-F11 | AnalistaTecnico | BolsaPermitidaFaixa so pode ser configurada em faixa que permite rubrica do tipo Bolsa. |
| RN-F12 | AnalistaTecnico | RubricaPermitidaFaixa com rubrica DOACI: o percentualMaximo, quando informado, nao pode superar a tabela normativa aplicavel. |
| RN-F13 | GestorFomento | Somente Fomento com estado APROVADO pode ser referenciado por nova Captacao. |
| RN-F14 | GestorFomento | Fomento APROVADO pode ser interrompido com justificativa; Captacoes e projetos vinculados sao suspensos em cascata. |
| RN-F15 | GestorFomento | Fomento INTERROMPIDO pode ser retomado; Captacoes e projetos retomam o estado anterior. |
| RN-F16 | GestorFomento | Fomento APROVADO ou INTERROMPIDO pode ser encerrado com justificativa; Captacoes e projetos vinculados sao cancelados em cascata. |
| RN-F17 | Sistema | Fomento transita automaticamente para CONCLUIDO quando dataFim e atingida. Nenhuma nova Captacao pode ser criada a partir de Fomento CONCLUIDO. |
| RN-F18 | Sistema | Nenhuma data do cronograma de uma Captacao pode ser anterior a `Fomento.dataInicio` nem posterior a `Fomento.dataFim`. |

### Aportes Adicionais

| ID | Responsavel | Regra |
|----|-------------|-------|
| RN-A01 | GestorFomento | Aporte aditivo so pode ser registrado em Fomento com estado APROVADO. |
| RN-A02 | GestorFomento | Aporte aditivo deve possuir valor > 0, data do aporte e justificativa. |
| RN-A03 | GestorFomento | Quando a origem for RECURSO_INTERNO, o aporte deve referenciar uma ContaContabil interna da FAPES. |
| RN-A04 | Sistema | O total financeiro do Fomento e recalculado pela soma de todos os AporteFomento, incluindo os com isAditivo=true. |

### Remanejamento de Faixas

| ID | Responsavel | Regra |
|----|-------------|-------|
| RN-R01 | GestorFomento | Remanejamento so pode ser registrado em Fomento com estado APROVADO. |
| RN-R02 | GestorFomento | Faixa de origem e faixa de destino devem pertencer ao mesmo Fomento. |
| RN-R03 | GestorFomento | Faixa de origem e faixa de destino devem ser diferentes. |
| RN-R04 | GestorFomento | Valor remanejado deve ser > 0 e nao pode exceder o valorAportado efetivo da faixa de origem. |
| RN-R05 | Sistema | O registro e imutavel — preserva valorOrigemAnterior e valorDestinoAnterior para rastreabilidade. |
| RN-R06 | Sistema | Apos remanejamento, o valorAportado efetivo de cada faixa e recalculado considerando todos os remanejamentos registrados. |

