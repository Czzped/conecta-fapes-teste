# Modelo Estrutural

Dominio e regras de negocio: ver [README.md](README.md)

## Descricao do Modelo

Este modelo representa a `Iniciativa` como o conceito central do modulo M003. Uma iniciativa e o item apoiado pela agencia apos a contratacao, podendo representar projeto de pesquisa, projeto de inovacao, visita tecnica ou outro tipo cadastrado em `TipoIniciativa`.

O modelo estrutural do M003 representa a **estrutura maxima possivel** de uma iniciativa. A obrigatoriedade de tipo de iniciativa, objetivos, resultados, riscos, beneficios, equipe, cronograma, orcamento, rubricas e demais blocos planejaveis e definida pela configuracao da captacao no M011. Portanto, esses blocos podem existir ou nao, e podem ser obrigatorios ou opcionais conforme a regra da captacao que originou a iniciativa.

A `Iniciativa` concentra os dados estaveis do apoio: codigo, titulo, resumo, restricoes, viabilidade tecnica, datas gerais, valor aprovado, estado atual e o `Ortogado` responsavel pela outorga. O `Ortogado` e um papel assumido por uma `PessoaFisica` cadastrada no M008 e registra a data da outorga.

Os elementos planejaveis da iniciativa ficam em `VersaoPlanoIniciativa`. Essa classe existe para permitir alteracoes ao longo da execucao sem apagar o historico. Resultados, cronograma, objetivos, riscos, beneficios, orcamento agregado e papeis planejados da equipe pertencem a uma versao do plano quando tiverem sido exigidos ou informados. Quando algum desses elementos configurados muda, uma nova versao deve ser criada com justificativa, mantendo a versao anterior como historico.

Quando a captacao exigir objetivos, a versao do plano pode possuir objetivo geral e objetivos especificos. Os objetivos especificos podem indicar percentual de importancia e podem estar associados a `Resultado`, quando resultados forem exigidos ou informados. O `Resultado` descreve entregas esperadas da iniciativa e pode ser classificado por `TipoResultado`, como servico, processo ou produto.

Os `Risco` tambem podem ser vinculados aos resultados, pois um risco pode ameacar uma ou mais entregas esperadas. Impacto e probabilidade usam a mesma classe de referencia, `NivelRisco`, permitindo configurar niveis como pequeno, medio e grande sem duplicar estruturas.

Os `Beneficio` representam ganhos esperados ou gerados pela iniciativa e podem se conectar aos resultados que os sustentam. Cada beneficio pode possuir `IndicadorBeneficio`, usado para medir seu alcance por unidade de medida, valor base, valor meta, periodicidade e fonte de verificacao.

O `OrcamentoPlanejado` representa a previsao aprovada de recursos necessarios para implementar a iniciativa quando a captacao exigir orcamento. Ele pode ter valores agregados para total, bolsas e capital, e tambem pode possuir `ItemOrcamento` em nivel inicial. Cada item de orcamento, quando informado, deve estar associado a uma `RubricaOrcamentaria`. O detalhamento por nivel de bolsa, subrubricas de capital ou itens especificos de compra nao foi incluido neste momento.

O `OrcamentoExecutado` representa uma visao consolidada da execucao financeira da iniciativa. Como o valor executado muda ao longo do tempo, ele e calculado a partir de `LancamentoExecucao`, preservando historico, data, rubrica, tipo de movimento e origem do registro. Dessa forma, o total executado nao e sobrescrito manualmente; ele deriva dos lancamentos de execucao, estorno, comprometimento ou rendimento.

O `Ortogado` pode solicitar a inclusao ou retirada de rubrica por meio de `SolicitacaoAlteracaoRubrica`. Essa solicitacao nao altera automaticamente o orcamento planejado; ela passa por analise e, quando aprovada, deve gerar uma nova `VersaoPlanoIniciativa` para refletir a mudanca autorizada no planejamento de recursos.

A equipe e planejada por `PapelEquipe`, que define o papel esperado e a quantidade prevista de pessoas para esse papel. Depois, `MembroEquipe` associa pessoas reais (`PessoaFisica`) aos papeis planejados. Dessa forma, primeiro se define a necessidade da equipe e depois se preenche essa necessidade com pessoas.

O `AtividadeCronograma` representa uma atividade planejada na versao do plano quando a captacao exigir cronograma. Cada atividade pode possuir nome, descricao, datas inicial e final, estado, papel responsavel e resultados que ajuda a construir, conforme a configuracao da captacao.

### Obrigatoriedade Configuravel

A obrigatoriedade dos blocos abaixo nao e fixa no M003. Ela deve ser herdada da configuracao da captacao no M011:

| Bloco | Pode ser exigido pela captacao? | Observacao |
|-------|----------------------------------|------------|
| Tipo de iniciativa | Sim | A captacao pode fixar ou dispensar a classificacao por `TipoIniciativa`. |
| Objetivos | Sim | Pode exigir objetivo geral, especificos ou nenhum detalhamento de objetivos. |
| Resultados | Sim | Pode exigir resultados esperados ou permitir iniciativa sem resultados declarados. |
| Riscos | Sim | Pode exigir matriz de riscos ou dispensar riscos na proposta. |
| Beneficios e indicadores | Sim | Pode exigir beneficios, indicadores ou ambos como opcionais. |
| Equipe | Sim | Pode exigir papeis de equipe, membros ou nenhum detalhamento de equipe. |
| Cronograma | Sim | Pode exigir atividades e datas ou dispensar cronograma. |
| Orcamento e rubricas | Sim | Pode exigir orcamento agregado, itens, rubricas ou dispensar detalhamento orcamentario. |

### Diagrama de Classes

#### Visao Geral da Iniciativa

```mermaid
classDiagram
    direction LR

    class Iniciativa {
        +String codigo
        +String titulo
        +String resumo
        +String restricoes
        +String viabilidadeTecnica
        +TipoIniciativa tipo
        +Date dataInicio
        +Date dataFim
        +Date dataContratacao
        +double valorAprovado
        +EstadoIniciativa estado
    }

    class EstadoIniciativa {
        <<enumeration>>
        CONTRATADA
        EM_EXECUCAO
        CONCLUIDA
        CANCELADA
    }

    class TipoIniciativa {
        +String nome
        +String descricao
    }

    class VersaoPlanoIniciativa {
        +int numero
        +Date dataCriacao
        +Date dataVigenciaInicio
        +String justificativa
        +EstadoVersaoPlano estado
    }

    class EstadoVersaoPlano {
        <<enumeration>>
        RASCUNHO
        VIGENTE
        SUBSTITUIDA
        CANCELADA
    }

    class Ortogado {
        +String codigo
        +Date dataOutorga
        +boolean ativo
    }

    class Objetivo {
        +String descricao
        +TipoObjetivo tipo
        +double percentualImportancia
    }

    class TipoObjetivo {
        <<enumeration>>
        GERAL
        ESPECIFICO
    }

    class Resultado {
        +String nome
        +String descricao
        +TipoResultado tipo
    }

    class TipoResultado {
        +String nome
        +String descricao
    }

    class Risco {
        +String descricao
        +NivelRisco impacto
        +NivelRisco probabilidade
        +String planoMitigacao
    }

    class NivelRisco {
        +String nome
        +String descricao
    }

    class Beneficio {
        +String nome
        +String descricao
        +String publicoBeneficiado
    }

    class IndicadorBeneficio {
        +String nome
        +String descricao
        +String unidadeMedida
        +double valorBase
        +double valorMeta
        +String periodicidadeMedicao
        +String fonteVerificacao
    }

    class OrcamentoPlanejado {
        +double valorTotal
        +double valorBolsas
        +double valorCapital
    }

    class OrcamentoExecutado {
        +double valorExecutadoTotal
        +double valorExecutadoBolsas
        +double valorExecutadoCapital
        +Date dataAtualizacao
    }

    class SolicitacaoAlteracaoRubrica {
        +Date dataSolicitacao
        +TipoAlteracaoRubrica tipoAlteracao
        +String justificativa
        +EstadoSolicitacaoRubrica estado
    }

    class TipoAlteracaoRubrica {
        <<enumeration>>
        INCLUSAO
        RETIRADA
    }

    class EstadoSolicitacaoRubrica {
        <<enumeration>>
        SOLICITADA
        EM_ANALISE
        APROVADA
        REJEITADA
        CANCELADA
    }

    class AtividadeCronograma {
        +String nome
        +String descricao
        +Date dataInicio
        +Date dataFim
        +EstadoAtividadeCronograma estado
    }

    class PapelEquipe {
        +String nome
        +String descricao
        +int quantidadePrevista
    }

    class MembroEquipe {
        +Date dataInicio
        +Date dataFim
        +boolean ativo
    }

    Iniciativa "*" --> "0..1" TipoIniciativa : classificada por
    Iniciativa "*" --> "1" Ortogado : outorgada a
    Iniciativa "1" --> "0..*" VersaoPlanoIniciativa : versoes do plano
    VersaoPlanoIniciativa "1" --> "0..1" Objetivo : objetivo geral
    VersaoPlanoIniciativa "1" --> "0..*" Objetivo : objetivos especificos
    VersaoPlanoIniciativa "1" --> "*" Resultado : resultados
    Objetivo "1" --> "*" Resultado : resultados
    Resultado "*" --> "0..1" TipoResultado : classificado por
    VersaoPlanoIniciativa "1" --> "*" Risco : riscos
    Risco "*" --> "*" Resultado : ameaca
    Risco "*" --> "0..1" NivelRisco : possui impacto
    Risco "*" --> "0..1" NivelRisco : possui probabilidade
    VersaoPlanoIniciativa "1" --> "*" Beneficio : beneficios
    Beneficio "*" --> "*" Resultado : gerado por
    Beneficio "1" --> "*" IndicadorBeneficio : medido por
    VersaoPlanoIniciativa "1" --> "0..1" OrcamentoPlanejado : orcamento planejado
    Iniciativa "1" --> "1" OrcamentoExecutado : orcamento executado
    Iniciativa "1" --> "*" SolicitacaoAlteracaoRubrica : solicitacoes de rubrica
    SolicitacaoAlteracaoRubrica "*" --> "1" Ortogado : solicitada por
    SolicitacaoAlteracaoRubrica "*" --> "1" RubricaOrcamentaria : rubrica
    SolicitacaoAlteracaoRubrica "1" --> "0..1" VersaoPlanoIniciativa : gera versao
    VersaoPlanoIniciativa "1" --> "*" AtividadeCronograma : cronograma
    AtividadeCronograma "*" --> "0..1" PapelEquipe : papel responsavel
    AtividadeCronograma "*" --> "*" Resultado : constroi
    VersaoPlanoIniciativa "1" --> "*" PapelEquipe : papeis da equipe
    PapelEquipe "1" --> "*" MembroEquipe : membros
```

#### Orcamento

```mermaid
classDiagram
    direction LR

    class OrcamentoPlanejado {
        +double valorTotal
        +double valorBolsas
        +double valorCapital
    }

    class OrcamentoExecutado {
        +double valorExecutadoTotal
        +double valorExecutadoBolsas
        +double valorExecutadoCapital
        +Date dataAtualizacao
    }

    class SolicitacaoAlteracaoRubrica {
        +Date dataSolicitacao
        +TipoAlteracaoRubrica tipoAlteracao
        +String justificativa
        +EstadoSolicitacaoRubrica estado
    }

    class TipoAlteracaoRubrica {
        <<enumeration>>
        INCLUSAO
        RETIRADA
    }

    class EstadoSolicitacaoRubrica {
        <<enumeration>>
        SOLICITADA
        EM_ANALISE
        APROVADA
        REJEITADA
        CANCELADA
    }

    class ItemOrcamento {
        +String descricao
        +double valorPrevisto
    }

    class LancamentoExecucao {
        +Date data
        +String descricao
        +double valor
        +TipoLancamentoExecucao tipo
        +String origem
    }

    class TipoLancamentoExecucao {
        <<enumeration>>
        COMPROMETIMENTO
        EXECUCAO
        ESTORNO
        RENDIMENTO
    }

    class RubricaOrcamentaria {
        +String nome
        +String descricao
    }

    class Ortogado {
        +String codigo
        +Date dataOutorga
        +boolean ativo
    }

    class VersaoPlanoIniciativa {
        +int numero
        +Date dataCriacao
        +Date dataVigenciaInicio
        +String justificativa
        +EstadoVersaoPlano estado
    }

    OrcamentoPlanejado "1" --> "*" ItemOrcamento : itens planejados
    ItemOrcamento "*" --> "1" RubricaOrcamentaria : rubrica
    OrcamentoExecutado "1" --> "*" LancamentoExecucao : lancamentos
    LancamentoExecucao "*" --> "1" RubricaOrcamentaria : rubrica
    SolicitacaoAlteracaoRubrica "*" --> "1" Ortogado : solicitada por
    SolicitacaoAlteracaoRubrica "*" --> "1" RubricaOrcamentaria : rubrica
    SolicitacaoAlteracaoRubrica "1" --> "0..1" VersaoPlanoIniciativa : gera versao
```

#### Cronograma

```mermaid
classDiagram
    direction LR

    class VersaoPlanoIniciativa {
        +int numero
        +Date dataCriacao
        +Date dataVigenciaInicio
        +String justificativa
        +EstadoVersaoPlano estado
    }

    class AtividadeCronograma {
        +String nome
        +String descricao
        +Date dataInicio
        +Date dataFim
        +EstadoAtividadeCronograma estado
    }

    class PapelEquipe {
        +String nome
        +String descricao
        +int quantidadePrevista
    }

    class Resultado {
        +String nome
        +String descricao
        +TipoResultado tipo
    }

    class EstadoVersaoPlano {
        <<enumeration>>
        RASCUNHO
        VIGENTE
        SUBSTITUIDA
        CANCELADA
    }

    class EstadoAtividadeCronograma {
        <<enumeration>>
        PREVISTA
        EM_EXECUCAO
        CONCLUIDA
        CANCELADA
    }

    VersaoPlanoIniciativa "1" --> "*" AtividadeCronograma : cronograma
    VersaoPlanoIniciativa "1" --> "*" Resultado : resultados
    AtividadeCronograma "*" --> "0..1" PapelEquipe : papel responsavel
    AtividadeCronograma "*" --> "*" Resultado : constroi
```

#### Equipe e Papeis

```mermaid
classDiagram
    direction LR

    class MembroEquipe {
        +Date dataInicio
        +Date dataFim
        +boolean ativo
    }

    class PapelEquipe {
        +String nome
        +String descricao
        +int quantidadePrevista
    }

    class Ortogado {
        +String codigo
        +Date dataOutorga
        +boolean ativo
    }

    class PessoaFisica {
        <<fora do escopo - M008>>
    }

    PapelEquipe "1" --> "*" MembroEquipe : membros
    MembroEquipe "*" --> "1" PessoaFisica : pessoa
    Ortogado "*" --> "1" PessoaFisica : pessoa
```

## Dicionario de Dados

O dicionario de dados detalha as classes do modelo, seus atributos, obrigatoriedade, tipo de dado, dominio esperado, tamanho recomendado e regra de unicidade quando aplicavel. Classes marcadas como referencia, como `TipoIniciativa`, `TipoResultado` e `NivelRisco`, representam cadastros controlados usados para classificar os dados principais.

Na coluna **Obrig.**, o valor `Cond.` indica obrigatoriedade condicional: o campo ou bloco e obrigatorio apenas quando a configuracao da captacao no M011 exigir aquela informacao. Quando a captacao dispensar o bloco, a iniciativa pode existir sem esse detalhamento.

| Classe | Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|--------|----------|-----------|--------|------|---------|---------|-------|
| **Iniciativa** | codigo | Codigo identificador da iniciativa apoiada pela agencia | Gerado | String | Ex: INI-2026-001 | | Sim |
| | titulo | Titulo principal da iniciativa | Sim | String | | 300 | |
| | resumo | Resumo descritivo da iniciativa contratada | Sim | String | | 2000 | |
| | restricoes | Restricoes conhecidas para execucao da iniciativa | Nao | String | | 2000 | |
| | viabilidadeTecnica | Analise ou justificativa da viabilidade tecnica da iniciativa | Nao | String | | 2000 | |
| | tipo | Tipo da iniciativa apoiada | Cond. | TipoIniciativa | Obrigatorio quando a captacao exigir classificacao por tipo | | |
| | dataInicio | Data prevista ou efetiva de inicio da iniciativa | Sim | Date | | | |
| | dataFim | Data prevista ou efetiva de encerramento da iniciativa | Nao | Date | | | |
| | dataContratacao | Data em que a iniciativa foi formalmente contratada | Sim | Date | | | |
| | valorAprovado | Valor financeiro aprovado para a iniciativa, quando aplicavel | Nao | Double | | | |
| | estado | Estado atual da iniciativa no ciclo operacional | Gerado | EstadoIniciativa | Ver enumeracao | | |
| **TipoIniciativa** | nome | Nome do tipo de iniciativa | Sim | String | Ex: Projeto de Pesquisa, Projeto de Inovacao, Visita Tecnica | 150 | Sim |
| | descricao | Descricao do tipo de iniciativa e sua finalidade | Nao | String | | 500 | |
| **VersaoPlanoIniciativa** | numero | Numero sequencial da versao do plano da iniciativa | Cond. | Int | Obrigatorio quando houver plano configurado | | Sim por iniciativa |
| | dataCriacao | Data em que a versao do plano foi criada | Gerado | Date | | | |
| | dataVigenciaInicio | Data a partir da qual a versao do plano passa a valer | Sim | Date | | | |
| | justificativa | Justificativa para criacao ou alteracao da versao do plano | Nao | String | | 2000 | |
| | estado | Estado atual da versao do plano | Gerado | EstadoVersaoPlano | Ver enumeracao | | |
| **Objetivo** | descricao | Objetivo declarado para a iniciativa | Cond. | String | Obrigatorio quando objetivos forem exigidos | 1000 | |
| | tipo | Tipo do objetivo | Cond. | TipoObjetivo | `GERAL`/`ESPECIFICO`; obrigatorio quando objetivos forem exigidos | | |
| | percentualImportancia | Percentual de importancia do objetivo especifico em relacao aos demais objetivos especificos | Nao | Double | 0 a 100 | | |
| **Resultado** | nome | Nome do resultado esperado da iniciativa | Cond. | String | Obrigatorio quando resultados forem exigidos | 200 | |
| | descricao | Descricao do resultado esperado da iniciativa | Cond. | String | Obrigatorio quando resultados forem exigidos | 1000 | |
| | tipo | Tipo do resultado esperado | Cond. | TipoResultado | Obrigatorio quando a captacao exigir classificacao do resultado | | |
| **TipoResultado** | nome | Nome do tipo de resultado | Sim | String | Ex: Servico, Processo, Produto | 150 | Sim |
| | descricao | Descricao do tipo de resultado e sua finalidade | Nao | String | | 500 | |
| **Risco** | descricao | Risco identificado para a execucao da iniciativa | Cond. | String | Obrigatorio quando riscos forem exigidos | 1000 | |
| | impacto | Nivel de impacto previsto caso o risco ocorra | Cond. | NivelRisco | Obrigatorio quando a captacao exigir impacto | | |
| | probabilidade | Nivel de probabilidade estimada de ocorrencia | Cond. | NivelRisco | Obrigatorio quando a captacao exigir probabilidade | | |
| | planoMitigacao | Plano de mitigacao ou resposta ao risco | Nao | String | | 1000 | |
| **NivelRisco** | nome | Nome do nivel usado para impacto ou probabilidade do risco | Sim | String | Ex: Pequeno, Medio, Grande | 100 | Sim |
| | descricao | Descricao do nivel e seus criterios de enquadramento | Nao | String | | 500 | |
| **Beneficio** | nome | Nome do beneficio esperado ou gerado pela iniciativa | Cond. | String | Obrigatorio quando beneficios forem exigidos | 200 | |
| | descricao | Descricao do beneficio esperado ou gerado pela iniciativa | Cond. | String | Obrigatorio quando beneficios forem exigidos | 1000 | |
| | publicoBeneficiado | Publico, instituicao ou grupo beneficiado | Nao | String | | 300 | |
| **IndicadorBeneficio** | nome | Nome do indicador usado para medir o beneficio | Cond. | String | Obrigatorio quando indicadores forem exigidos | 200 | |
| | descricao | Descricao do que o indicador mede | Nao | String | | 1000 | |
| | unidadeMedida | Unidade usada na medicao do indicador | Cond. | String | Obrigatorio quando indicadores forem exigidos | 50 | |
| | valorBase | Valor de referencia antes da iniciativa ou no inicio da medicao | Nao | Double | | | |
| | valorMeta | Valor esperado para demonstrar o alcance do beneficio | Cond. | Double | Obrigatorio quando indicadores forem exigidos | | |
| | periodicidadeMedicao | Frequencia de medicao do indicador | Nao | String | Ex: Mensal, Trimestral, Anual, Final | 50 | |
| | fonteVerificacao | Fonte dos dados usados para verificar o indicador | Nao | String | | 300 | |
| **PapelEquipe** | nome | Nome do papel planejado para a equipe da iniciativa | Cond. | String | Obrigatorio quando equipe for exigida | 150 | |
| | descricao | Descricao das responsabilidades esperadas para o papel | Nao | String | | 500 | |
| | quantidadePrevista | Quantidade prevista de pessoas para este papel na equipe | Cond. | Int | Obrigatorio quando a captacao exigir quantidade por papel | | |
| **MembroEquipe** | dataInicio | Data de inicio da participacao da pessoa na equipe | Nao | Date | | | |
| | dataFim | Data de encerramento da participacao na equipe | Nao | Date | | | |
| | ativo | Indica se o membro esta ativo na equipe | Gerado | Boolean | true/false | | |
| **OrcamentoPlanejado** | valorTotal | Valor total planejado para a iniciativa | Cond. | Double | Obrigatorio quando orcamento for exigido | | |
| | valorBolsas | Valor planejado para bolsas | Nao | Double | | | |
| | valorCapital | Valor planejado para capital | Nao | Double | | | |
| **ItemOrcamento** | descricao | Descricao do item orcamentario planejado | Cond. | String | Obrigatorio quando item de orcamento for informado | 500 | |
| | valorPrevisto | Valor previsto para o item orcamentario | Cond. | Double | Obrigatorio quando item de orcamento for informado | | |
| **OrcamentoExecutado** | valorExecutadoTotal | Valor total executado consolidado a partir dos lancamentos | Gerado | Double | | | |
| | valorExecutadoBolsas | Valor executado consolidado em rubricas de bolsa | Gerado | Double | | | |
| | valorExecutadoCapital | Valor executado consolidado em rubricas de capital | Gerado | Double | | | |
| | dataAtualizacao | Data da ultima atualizacao da visao consolidada de execucao | Gerado | Date | | | |
| **LancamentoExecucao** | data | Data do lancamento de execucao financeira | Sim | Date | | | |
| | descricao | Descricao do movimento financeiro executado | Sim | String | | 500 | |
| | valor | Valor do lancamento financeiro | Sim | Double | Maior que zero | | |
| | tipo | Tipo do lancamento de execucao | Sim | TipoLancamentoExecucao | `COMPROMETIMENTO`/`EXECUCAO`/`ESTORNO`/`RENDIMENTO` | | |
| | origem | Origem do lancamento financeiro | Nao | String | Ex: Prestacao de contas, extrato bancario, importacao | 200 | |
| **SolicitacaoAlteracaoRubrica** | dataSolicitacao | Data em que o ortogado solicitou inclusao ou retirada de rubrica | Gerado | Date | | | |
| | tipoAlteracao | Tipo de alteracao solicitada para a rubrica | Sim | TipoAlteracaoRubrica | `INCLUSAO`/`RETIRADA` | | |
| | justificativa | Justificativa apresentada pelo ortogado para alterar a rubrica | Sim | String | | 2000 | |
| | estado | Estado atual da solicitacao de alteracao de rubrica | Gerado | EstadoSolicitacaoRubrica | Ver enumeracao | | |
| **RubricaOrcamentaria** | nome | Nome da rubrica associada ao item planejado ou lancamento executado | Sim | String | Ex: Bolsa, Capital | 150 | Sim |
| | descricao | Descricao da finalidade da rubrica orcamentaria | Nao | String | | 500 | |
| **AtividadeCronograma** | nome | Nome da atividade planejada no cronograma da iniciativa | Cond. | String | Obrigatorio quando cronograma for exigido | 200 | |
| | descricao | Descricao da atividade planejada no cronograma da iniciativa | Cond. | String | Obrigatorio quando cronograma for exigido | 500 | |
| | dataInicio | Data prevista ou efetiva de inicio da atividade | Cond. | Date | Obrigatorio quando cronograma exigir datas | | |
| | dataFim | Data prevista ou efetiva de encerramento da atividade | Cond. | Date | Obrigatorio quando cronograma exigir datas | | |
| | estado | Estado atual da atividade do cronograma | Gerado | EstadoAtividadeCronograma | Ver enumeracao | | |
| **Ortogado** | codigo | Codigo identificador do papel de ortogado no contexto operacional | Gerado | String | Ex: ORT-2026-001 | | Sim |
| | dataOutorga | Data em que a iniciativa foi outorgada ao ortogado | Sim | Date | | | |
| | ativo | Indica se o ortogado esta ativo para operacoes no contexto | Gerado | Boolean | true/false | | |

## Notas de Implementacao

**Entidades externas:**
- PessoaFisica: gerenciada por M008 (Cadastros Corporativos)
- Edital: gerenciado por M011 (Configuracao da Captacao)
- Bolsas, bolsistas, cotas e alocacoes de bolsa: gerenciados por M009 (Gestao Bolsista)
- Documentos fiscais, extratos, transacoes bancarias e prestacao de contas detalhada: gerenciados por M014 (Prestacao de Contas)

**Restricoes estruturais:**
- A iniciativa pode possuir versoes do plano quando a captacao exigir ou quando houver planejamento registrado.
- Apenas uma versao do plano da iniciativa pode estar com estado `VIGENTE`.
- Alteracoes em resultados, cronograma, objetivos, riscos, beneficios, orcamento ou papeis planejados devem gerar uma nova versao do plano quando esses blocos existirem na iniciativa.
- O orcamento planejado pertence a uma versao do plano da iniciativa quando a captacao exigir orcamento.
- O orcamento executado pertence a iniciativa e deve ser calculado a partir dos lancamentos de execucao financeira.
- Todo lancamento de execucao deve estar associado a uma rubrica orcamentaria.
- O valor executado consolidado deve considerar os lancamentos do tipo `EXECUCAO`, deduzir `ESTORNO` e preservar `COMPROMETIMENTO` e `RENDIMENTO` como movimentos identificaveis para acompanhamento financeiro.
- Somente o `Ortogado` ativo da iniciativa pode solicitar inclusao ou retirada de rubrica orcamentaria.
- Toda solicitacao de alteracao de rubrica deve possuir justificativa e estar associada a uma rubrica.
- Aprovacao de solicitacao de inclusao ou retirada de rubrica deve gerar nova `VersaoPlanoIniciativa`.
- Retirada de rubrica deve ser bloqueada quando houver lancamento de execucao impeditivo para a rubrica.
- Objetivo geral, objetivos especificos, resultados, riscos, beneficios, equipe, cronograma e orcamento sao blocos condicionais definidos pela configuracao da captacao no M011.
- Quando objetivos especificos e resultados forem exigidos juntos, a configuracao pode exigir associacao entre eles.
- Quando riscos e resultados forem exigidos juntos, a configuracao pode exigir que riscos indiquem quais resultados podem ser impactados.
- Quando beneficios e resultados forem exigidos juntos, a configuracao pode exigir associacao entre beneficios e resultados.
- Quando equipe for exigida, membro da equipe deve estar associado a uma PessoaFisica e pode estar associado a um papel planejado.
- Quando a captacao definir quantidade prevista por papel, a quantidade de membros vinculados nao deve exceder a quantidade prevista para esse papel.
- Quando cronograma, equipe e resultados forem exigidos juntos, a configuracao pode exigir que atividades indiquem papel responsavel e resultados relacionados.

**Navegabilidade:**
- Cardinalidade 1: atributo do tipo da classe destino (ex: Iniciativa.ortogado: Ortogado)
- Cardinalidade N: atributo lista do tipo da classe destino (ex: Iniciativa.versoesPlano: List<VersaoPlanoIniciativa>)
