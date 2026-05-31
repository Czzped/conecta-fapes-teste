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

