# Modelo Estrutural — P1 Fomento

Contexto: [README.md](../README.md) | Modelo consolidado: [modelo-estrutural.md](modelo-estrutural.md) | Por processo: [P2](modelo-estrutural-p2-configuracao-selecao.md) | [P3](modelo-estrutural-p3-selecao-projetos.md)

---

## P1 - Fomento

```mermaid
classDiagram
    direction LR

    %% Atores e Classes de Negócio Principais
    class AnalistaTecnico {
        <<actor>>
        +String nome
        +AreaTecnica area
        +criarFomento()
        +criarCaptacao()
        +adicionarAporte()
    }

    class Fomento {
        +String codigo
        +String titulo
        +String descricao
        +EstadoFomento estado
        +Date dataInicio
        +Date dataFim
        +String resultadoEsperado
        +EixoEstrategico eixo
        +AreaTecnica area
        +TipoProjeto tipoProjeto
        +salvar()
        +publicar()
        +cancelar()
        +encerrar()
        +adicionarAporte()
    }

    class Edital {
        +String nome
        +String url
    }

    class EstadoFomento {
        <<enumeration>>
        EM_ELABORACAO
        APROVADO
        VIGENTE
        INTERROMPIDO
        ENCERRADO
        CONCLUIDO
    }

    class Faixa {
        +String nome
        +String descricao
    }

    class AporteFomento {
        +Decimal valorAportado
        +Date dataAporte
        +Boolean isAditivo
        +String justificativa
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

    %% Classes de Infraestrutura de Fases e Formulários (V1)
    class FaseFomento {
        +String nome
        +String codigo
        +Boolean temRecurso
        +Boolean ehEliminatoria
        +Boolean ehClassificatoria
    }

    class CriterioSelecao {
        +String nome
        +Float notaCorte
        +Int qteSelecionadores
        +TipoSelecao tipoSelecao
        +TipoSelecionadores tipoSelecionadores
        +Formulario formSelecao
    }

    class TipoSelecao {
        <<enumeration>>
        CLASSIFICACAO
        ELIMINACAO
    }

    class TipoSelecionadores {
        <<enumeration>>
        AVALIADOR_ADHOC
        RESPONSAVEL_AREA_TECNICA
    }

    class Formulario {
        <<externo>>
        +String nome
        +String descricao
        +TipoForm tipoForm
    }

    class TipoFase {
        +String nome
        +Boolean temRecurso
        +Boolean ehEliminatoria
        +Boolean ehClassificatoria
    }

    %% Classes com Integrações e Módulos Externos (V1 e V2)
    class Origem {
        <<abstract>>
    }
    class Programa {
        <<externo M010>>
    }
    class Parceria {
        <<externo M010>>
    }
    class ContaContabil {
        <<externo M016>>
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
   
    

    %% --- RELACIONAMENTOS ---

    %% Ações de Ator
    AnalistaTecnico ..> Fomento : gerencia / depende de

    %% Estrutura Base do Fomento
    Fomento "1" --> "1" Edital : associado a
    Fomento "*" --> "1" EstadoFomento : possui estado
    Fomento "*" --> "1" EixoEstrategico : atinge
    Fomento "*" --> "1" AreaTecnica : gerenciado por
    Fomento "*" --> "1" TipoProjeto : tipos de projeto
    

    %% Composição de Itens Financeiros e de Escopo do Fomento
    Fomento "1" *-- "1..*" Faixa : possui / faixas
    Fomento "1" *-- "0..*" AporteFomento : recebe / aportes

    %% Detalhamento das Faixas (Regras V2)
    Faixa "1" --> "*" RubricaPermitidaFaixa : rubricas permitidas
    Faixa "1" --> "*" BolsaPermitidaFaixa : bolsas permitidas
    RubricaPermitidaFaixa "*" --> "1" Rubrica : rubrica
    BolsaPermitidaFaixa "*" --> "1" VersaoNivel : versao nivel

    %% Fluxo de Aportes e Origens Orçamentárias (Abstração V1 unificada com referências V2)
    AporteFomento --> "1" Origem : relacionado com
    Origem <|-- Programa
    Origem <|-- Parceria
    Origem <|-- ContaContabil
    
    

    %% Estrutura de Ciclo de Avaliação, Fases e Formulários (V1)
    Fomento "1" *-- "1..*" FaseFomento : possui (uma é inicial)
    FaseFomento "1" *-- "0..*" CriterioSelecao : possui
    FaseFomento "*" --> "1" TipoFase : possui
    FaseFomento "*" --> "*" FaseFomento : pre-requisito
    CriterioSelecao "*" --> "1" TipoSelecao
    CriterioSelecao "*" --> "1" TipoSelecionadores
    CriterioSelecao "*" --> "1" Formulario : utiliza
    FaseFomento "*" *-- "*" Formulario : possui

    TipoFase "0..*" --> "0..*" TipoFase : pre-requisito

    %% Estilização Requerida Simplificada
    style Fomento fill:lightgreen
    style EstadoFomento fill:lightgreen
    style Faixa fill:lightgreen
    style AporteFomento fill:lightgreen
    style FaseFomento fill:lightgreen
    style Origem fill:lightgreen
```

OBS: Classes me verde fazem parte do V1!

### Estados Fomento

```mermaid
stateDiagram-v2
    [*] --> EM_ELABORACAO : criarFomento()
    
    EM_ELABORACAO --> APROVADO : salvar() / validar
    EM_ELABORACAO --> [*] : cancelar()
    
    APROVADO --> VIGENTE : publicar() [dataInicio atingida]
    APROVADO --> INTERROMPIDO : cancelar()
    
    state VIGENTE {
        [*] --> RecebendoAportes
        RecebendoAportes --> RecebendoAportes : adicionarAporte()
    }
    
    VIGENTE --> ENCERRADO : encerrar() [dataFim atingida]
    VIGENTE --> INTERROMPIDO : cancelar()
    
    ENCERRADO --> CONCLUIDO : finalizarAnalise()
    INTERROMPIDO --> [*]
    CONCLUIDO --> [*]


```


---

## Dicionario de Dados

| Classe | Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|--------|----------|-----------|--------|------|---------|---------|-------|
| **Fomento** | codigo | Codigo do fomento | Gerado | String | | | Sim |
| | titulo | Titulo do fomento | Sim | String | | 200 | |
| | descricao | Descricao do fomento | Nao | String | | 1000 | |
| | estado | Estado do fomento | Sim | EstadoFomento | EM_ELABORACAO, APROVADO, VIGENTE, INTERROMPIDO, ENCERRADO, CONCLUIDO | | |
| | dataInicio | Data de inicio da vigencia do fomento | Sim | Date | | | |
| | dataFim | Data de fim da vigencia do fomento | Sim | Date | | | |
| | resultadoEsperado | Descricao livre dos resultados esperados dos projetos financiados | Nao | String | | 1000 | |
| | edital (relacao) | Edital associado ao fomento | Sim | FK → Edital | | | |
| | eixoEstrategico (relacao) | Eixo estrategico ao qual o fomento esta vinculado | Sim | FK → EixoEstrategico | Via M010 | | |
| | areaTecnica (relacao) | Area tecnica responsavel pelo fomento | Sim | FK → AreaTecnica | Via M008 | | |
| | tipoProjeto (relacao) | Tipo de projeto aceito pelo fomento | Sim | FK → TipoProjeto | Via M008 | | |
| **Edital** | nome | Nome ou identificacao do edital associado ao fomento | Sim | String | | 200 | |
| | url | Endereco externo do edital publicado ou minuta validada | Sim | String | URL valida | 500 | |
| **AporteFomento** | valorAportado | Valor financeiro aportado | Sim | Double | > 0 | | |
| | dataAporte | Data do registro do aporte | Sim | Date | | | |
| | isAditivo | Indica se e aporte adicional ao original da mesma origem | Sim | Boolean | true/false | | |
| | justificativa | Motivo do aporte; obrigatorio quando isAditivo=true ou Origem.tipo=RECURSO_INTERNO | Cond. | String | | 500 | |
| | origem (relacao) | Origem unica do aporte, especializada em Programa, Parceria ou ContaContabil | Sim | FK → Origem | Programa/Parceria via M010; ContaContabil via M016 | | |
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
| **FaseFomento** | nome | Nome da fase do ciclo de avaliacao ou selecao do fomento | Sim | String | | 200 | |
| | codigo | Codigo funcional da fase dentro do fomento | Sim | String | Unico no Fomento | 80 | Sim dentro do Fomento |
| | temRecurso | Indica se a fase permite recurso administrativo | Sim | Boolean | true/false | | |
| | ehEliminatoria | Indica se a fase pode eliminar projetos ou propostas | Sim | Boolean | true/false | | |
| | ehClassificatoria | Indica se a fase contribui para classificacao final | Sim | Boolean | true/false | | |
| | tipoFase (relacao) | Tipo padronizado que parametriza a fase | Sim | FK → TipoFase | | | |
| | preRequisito (relacao) | Fase que deve ser concluida antes desta fase | Nao | FK → FaseFomento | Mesmo Fomento | | |
| | formulario (relacao) | Formulario externo usado ou apresentado na fase | Nao | FK → Formulario | Formulario externo publicado | | |
| **TipoFase** | nome | Nome do tipo padronizado de fase | Sim | String | | 200 | Sim |
| | temRecurso | Padrao que indica se fases deste tipo permitem recurso | Sim | Boolean | true/false | | |
| | ehEliminatoria | Padrao que indica se fases deste tipo eliminam projetos ou propostas | Sim | Boolean | true/false | | |
| | ehClassificatoria | Padrao que indica se fases deste tipo classificam projetos ou propostas | Sim | Boolean | true/false | | |
| | preRequisito (relacao) | Tipo de fase que deve anteceder este tipo | Nao | FK → TipoFase | | | |
| **CriterioSelecao** | nome | Nome do criterio usado na fase | Sim | String | | 200 | |
| | notaCorte | Nota minima exigida quando o criterio for eliminatorio ou classificatorio | Nao | Float | >= 0 | | |
| | qteSelecionadores | Quantidade de selecionadores exigida para aplicar o criterio | Sim | Int | >= 1 | | |
| | tipoSelecao | Natureza do criterio de selecao | Sim | TipoSelecao | CLASSIFICACAO, ELIMINACAO | | |
| | tipoSelecionadores | Perfil responsavel pela avaliacao do criterio | Sim | TipoSelecionadores | AVALIADOR_ADHOC, RESPONSAVEL_AREA_TECNICA | | |
| | formSelecao (relacao) | Formulario externo usado para registrar a avaliacao do criterio | Sim | FK → Formulario | Formulario externo publicado | | |
| **Formulario** | nome | Nome do formulario externo referenciado pela fase ou criterio | Sim | String | | 200 | |
| | descricao | Descricao do formulario externo | Nao | String | | 500 | |
| | tipoForm | Tipo do formulario externo | Sim | TipoForm | Dominio do modulo proprietario | | |
| **Origem** | tipo | Tipo concreto da origem orcamentaria do aporte | Sim | Enum | PROGRAMA, PARCERIA, RECURSO_INTERNO | | |

---

## Regras de Negocio

### Fomento

| ID | Responsavel | Regra |
|----|-------------|-------|
| RN-F01 | GestorFomento | Todo Fomento deve possuir ao menos um aporte financeiro originado de Programa, Parceria ou recurso interno. |
| RN-F02 | GestorFomento | Todo Fomento deve estar vinculado a exatamente um eixo estrategico do M010. |
| RN-F03 | GestorFomento | Todo Fomento deve possuir ao menos uma faixa antes de ser aprovado. |
| RN-F04 | GestorFomento | Todo Fomento deve possuir um Edital associado antes de ser aprovado. |
| RN-F05 | GestorFomento | Cada aporte deve indicar exatamente uma origem, possuir valor > 0, data do aporte e justificativa quando aplicavel. |
| RN-F06 | GestorFomento | O total financeiro do Fomento e calculado pela soma dos aportes; nao ha total manual. |
| RN-F07 | GestorFomento | Todo Fomento deve possuir ao menos um tipo de projeto aceito. |
| RN-F08 | Sistema | O TipoProjeto de um Projeto captado deve estar na lista de tipos permitidos do Fomento vinculado. |
| RN-F09 | AnalistaTecnico | Rubricas e subrubricas sao configuradas por faixa. |
| RN-F10 | AnalistaTecnico | Quando a rubrica Bolsa estiver permitida em uma faixa, devem ser configuradas as modalidades e niveis de bolsa permitidos. |
| RN-F11 | AnalistaTecnico | BolsaPermitidaFaixa so pode ser configurada em faixa que permite rubrica do tipo Bolsa. |
| RN-F12 | AnalistaTecnico | RubricaPermitidaFaixa com rubrica DOACI: o percentualMaximo, quando informado, nao pode superar a tabela normativa aplicavel. |
| RN-F13 | GestorFomento | Somente Fomento com estado APROVADO ou VIGENTE pode ser referenciado por nova Captacao. |
| RN-F14 | GestorFomento | Fomento APROVADO ou VIGENTE pode ser interrompido com justificativa; Captacoes e projetos vinculados sao suspensos em cascata. |
| RN-F15 | GestorFomento | Fomento INTERROMPIDO pode ser retomado; Captacoes e projetos retomam o estado anterior. |
| RN-F16 | GestorFomento | Fomento APROVADO, VIGENTE ou INTERROMPIDO pode ser encerrado com justificativa; Captacoes e projetos vinculados sao cancelados em cascata. |
| RN-F17 | Sistema | Fomento transita automaticamente para CONCLUIDO quando dataFim e atingida. Nenhuma nova Captacao pode ser criada a partir de Fomento CONCLUIDO. |
| RN-F18 | Sistema | Nenhuma data do cronograma de uma Captacao pode ser anterior a `Fomento.dataInicio` nem posterior a `Fomento.dataFim`. |
| RN-F19 | Sistema | Fomento APROVADO transita para VIGENTE quando publicado e a `dataInicio` for atingida. |
| RN-F20 | Sistema | Aportes adicionais so podem ser registrados em Fomento APROVADO ou VIGENTE, preservando historico e recalculando o total financeiro. |
| RN-F21 | GestorFomento | Todo Fomento deve possuir ao menos uma FaseFomento marcada como fase inicial por nao possuir pre-requisito. |
| RN-F22 | GestorFomento | Pre-requisitos entre FaseFomento devem pertencer ao mesmo Fomento e nao podem formar ciclo. |
| RN-F23 | Sistema | As flags de FaseFomento (`temRecurso`, `ehEliminatoria`, `ehClassificatoria`) devem ser coerentes com o TipoFase selecionado. |
| RN-F24 | GestorFomento | FaseFomento pode possuir zero ou mais criterios; quando possuir CriterioSelecao, cada criterio deve informar tipo de selecao, perfil de selecionadores, quantidade de selecionadores e formulario de selecao. |
| RN-F25 | GestorFomento | CriterioSelecao do tipo ELIMINACAO deve possuir `notaCorte` quando a eliminacao depender de pontuacao. |
| RN-F26 | GestorFomento | CriterioSelecao com `tipoSelecionadores=AVALIADOR_ADHOC` deve exigir `qteSelecionadores >= 1`. |
| RN-F27 | Sistema | Formularios referenciados por FaseFomento ou CriterioSelecao pertencem ao modulo proprietario externo e devem estar publicados/ativos no momento da aprovacao do Fomento. |

### Aportes Adicionais

| ID | Responsavel | Regra |
|----|-------------|-------|
| RN-A01 | GestorFomento | Aporte aditivo so pode ser registrado em Fomento com estado APROVADO ou VIGENTE. |
| RN-A02 | GestorFomento | Aporte aditivo deve possuir valor > 0, data do aporte e justificativa. |
| RN-A03 | GestorFomento | Quando a origem for RECURSO_INTERNO, o aporte deve referenciar uma ContaContabil interna da FAPES. |
| RN-A04 | Sistema | O total financeiro do Fomento e recalculado pela soma de todos os AporteFomento, incluindo os com isAditivo=true. |

## Historico de Alteracoes

| Commit | Data | Autor | Descricao |
|--------|------|-------|-----------|
| `de606b0` | 2026-05-31 | Paulo Sergio Santos Junior | Adiciona dicionario de dados e regras de negocio ao modelo P1 Fomento |
| `23d82e4` | 2026-05-31 | Paulo Sergio Santos Junior | Reorganizacao dos modelos estruturais em pasta modelo-estrutural/ |
