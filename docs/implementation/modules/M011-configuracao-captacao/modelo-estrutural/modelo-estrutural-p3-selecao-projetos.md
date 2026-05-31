# Modelo Estrutural — P3 Selecao dos Projetos

Contexto: [README.md](../README.md) | Modelo consolidado: [modelo-estrutural.md](modelo-estrutural.md) | Por processo: [P1](modelo-estrutural-p1-fomento.md) | [P2](modelo-estrutural-p2-configuracao-selecao.md)

---

## P3 - Selecao dos Projetos

Este recorte modela os artefatos conceituais da execucao da selecao. A configuracao base vem da
`Captacao` publicada no P2; a contratacao/outorga posterior pertence ao M022.

```mermaid
classDiagram
    direction TB

    class Captacao {
        +String codigo
        +EstadoConfiguracaoCaptacao estadoConfiguracao
    }

    class Proposta {
        +String codigo
        +EstadoProposta estado
        +Date dataCriacao
        +Date dataSubmissao
        +String formularioSubmissaoSnapshot
    }

    class RespostaFormularioSubmissao {
        +String formularioId
        +String versaoFormularioId
        +Json respostas
    }

    class DocumentacaoProposta {
        +EstadoDocumentacao estado
        +String justificativa
        +Date dataAnalise
    }

    class AssinaturaInstitucional {
        +EstadoAssinatura estado
        +Date dataSolicitacao
        +Date dataDecisao
        +String justificativaRecusa
    }

    class DistribuicaoAvaliacao {
        +Date dataDistribuicao
        +EstadoDistribuicao estado
    }

    class AvaliacaoAdHoc {
        +Decimal nota
        +String parecer
        +String recomendacao
        +Date dataRegistro
    }

    class ResultadoSelecao {
        +TipoResultadoSelecao tipo
        +Date dataPublicacao
        +Integer classificacao
        +String decisao
    }

    class RevisaoResultado {
        +String motivo
        +String descricao
        +EstadoRevisao estado
        +String decisao
        +String justificativaDecisao
        +Date dataSolicitacao
        +Date dataDecisao
    }

    class AnexoRevisao {
        +String nomeArquivo
        +String urlArquivo
    }

    class EstadoProposta {
        <<enumeration>>
        EM_ELABORACAO
        AGUARDANDO_ASSINATURA
        SUBMETIDA
        HABILITADA
        INABILITADA
        EM_AVALIACAO
        CLASSIFICADA
        APROVADA
        REPROVADA
        DESCARTADA
    }

    class EstadoDocumentacao {
        <<enumeration>>
        PENDENTE
        HABILITADA
        INABILITADA
    }

    class EstadoAssinatura {
        <<enumeration>>
        SOLICITADA
        ASSINADA
        RECUSADA
        EXPIRADA
    }

    class EstadoDistribuicao {
        <<enumeration>>
        DISTRIBUIDA
        AVALIADA
        CANCELADA
    }

    class TipoResultadoSelecao {
        <<enumeration>>
        PRELIMINAR
        APOS_REVISAO
        FINAL
    }

    class EstadoRevisao {
        <<enumeration>>
        SUBMETIDA
        ADMISSIVEL
        INADMISSIVEL
        DEFERIDA
        INDEFERIDA
    }

    class Proponente {
        <<externo shared.people/M008>>
    }

    class ResponsavelInstitucional {
        <<externo M008>>
    }

    class RevisorAdHoc {
        <<P2>>
    }

    class PeriodoCronograma {
        <<P2>>
    }

    class FormularioAvaliacaoRef {
        <<P2/M021>>
    }

    class FormularioRevisaoRef {
        <<P2/M021>>
    }

    class Faixa {
        <<P1>>
    }

    class TipoProjeto {
        <<externo M008>>
    }

    Captacao "1" --> "*" Proposta : recebe
    Captacao "1" --> "*" ResultadoSelecao : publica
    Captacao "1" --> "*" PeriodoCronograma : rege etapas

    Proposta "*" --> "1" Proponente : proponente
    Proposta "*" --> "1" Faixa : faixa escolhida
    Proposta "*" --> "1" TipoProjeto : tipo projeto
    Proposta "1" --> "1" RespostaFormularioSubmissao : submissao
    Proposta "1" --> "1" DocumentacaoProposta : documentacao
    Proposta "1" --> "0..1" AssinaturaInstitucional : assinatura
    Proposta "1" --> "*" DistribuicaoAvaliacao : distribuicoes
    Proposta "1" --> "*" RevisaoResultado : revisoes

    AssinaturaInstitucional "*" --> "1" ResponsavelInstitucional : responsavel
    DistribuicaoAvaliacao "*" --> "1" RevisorAdHoc : revisor
    DistribuicaoAvaliacao "1" --> "0..1" AvaliacaoAdHoc : parecer
    AvaliacaoAdHoc "*" --> "1" FormularioAvaliacaoRef : formulario
    RevisaoResultado "*" --> "1" FormularioRevisaoRef : formulario
    RevisaoResultado "1" --> "*" AnexoRevisao : anexos
    ResultadoSelecao "*" --> "*" Proposta : classificacao
```
