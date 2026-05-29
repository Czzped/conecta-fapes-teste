# Modelo Estrutural por Processo

Dominio e regras de negocio: ver [README.md](README.md).  
Modelo estrutural consolidado: ver [modelo-estrutural.md](modelo-estrutural.md).

Este documento separa o modelo do M011 pelos tres processos do modulo:

- **P1 - Fomento**: cria a base financeira e as regras de investimento.
- **P2 - Configuracao da Selecao**: configura uma Captacao sobre um Fomento aprovado.
- **P3 - Selecao dos Projetos**: executa a captacao publicada ate o resultado final.

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

    class TipoIniciativa {
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
    Fomento "*" --> "1" TipoIniciativa : tipos de projeto

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

## P2 - Configuracao da Selecao

```mermaid
classDiagram
    direction TB

    class Captacao {
        +String codigo
        +String titulo
        +String descricao
        +TipoCaptacao tipoCaptacao
        +TipoOutorgado tipoOutorgado
        +EstadoConfiguracaoCaptacao estadoConfiguracao
    }

    class Edital {
        +String titulo
        +String descricao
        +String link
        +String nomeArquivo
        +String urlArquivo
        +String versao
    }

    class OutorgadoDestinatario {
        +TipoOutorgado tipo
        +String cpf
        +String nome
        +String cnpj
        +String razaoSocial
    }

    class CategoriaProjeto {
        +String nome
        +String descricao
        +Boolean selecionavelNoCadastro
    }

    class CronogramaCaptacao {
        +String descricao
    }

    class PeriodoCronograma {
        +String nome
        +TipoPeriodo tipo
        +Date dataInicio
        +Date dataFim
    }

    class AdiamentoPeriodoCronograma {
        +Integer dias
        +String justificativa
        +Date dataRegistro
        +Date dataInicioOriginal
        +Date dataFimOriginal
        +Date dataInicioNova
        +Date dataFimNova
    }

    class RegraSubmissao {
        +Boolean permiteMultiplasPropostas
        +Boolean permiteParticiparEmOutraProposta
        +Boolean permiteAcumularBolsa
        +Boolean submissaoRestritaAEscolhidos
        +Boolean exigeAprovacaoInstitucional
    }

    class ProponenteEscolhido {
        +TipoProponenteEscolhido tipo
    }

    class RequisitoProponente {
        +TipoDirecionamentoProposta direcionamento
        +Boolean permiteParceriaInstituicoes
        +Boolean exigeVinculoEmpregaticio
        +Boolean exigeGestorInstitucional
    }

    class RegraAvaliacao {
        +Boolean exigeAvaliacaoAdHoc
        +Integer quantidadeMinimaRevisores
    }

    class PrestacaoExigida {
        +Boolean exigePrestacaoTecnica
        +Boolean exigePrestacaoFinanceira
    }

    class RevisorAdHoc {
        +Date dataInclusao
        +String areaAtuacao
        +String titulacao
    }

    class DocumentoExigido {
        +String nome
        +String descricao
        +Boolean obrigatorio
        +Boolean reutilizarCadastroCorporativo
        +Boolean exigirNovoEnvioSeVencido
    }

    class FormatoArquivo {
        +String extensao
    }

    class MatrizConfiguracaoProjeto {
        +ObrigatoriedadeBloco equipe
        +ObrigatoriedadeBloco resultados
        +ObrigatoriedadeBloco riscos
        +ObrigatoriedadeBloco cronogramaProj
        +ObrigatoriedadeBloco orcamento
        +ObrigatoriedadeBloco objetivos
        +ObrigatoriedadeBloco beneficios
    }

    class FormularioSubmissaoRef {
        +String formularioId
        +String versaoFormularioId
    }

    class FormularioAvaliacaoRef {
        +String formularioId
        +String versaoFormularioId
    }

    class FormularioRevisaoRef {
        +String formularioId
        +String versaoFormularioId
    }

    class FormularioAnexoRef {
        +String formularioId
        +String versaoFormularioId
    }

    class TipoCaptacao {
        <<enumeration>>
        CHAMADA_PUBLICA
        DEMANDA_INDUZIDA
    }

    class TipoOutorgado {
        <<enumeration>>
        PESSOA_FISICA
        PESSOA_JURIDICA
    }

    class EstadoConfiguracaoCaptacao {
        <<enumeration>>
        EM_ANDAMENTO
        PUBLICADO
        NAO_PUBLICADO
        PAUSADO
        ENCERRADO
        CANCELADO
    }

    class TipoPeriodo {
        <<enumeration>>
        PUBLICACAO_CAPTACAO
        RECEBIMENTO_PROPOSTAS
        AVALIACAO_DOCUMENTAL
        AVALIACAO_AD_HOC
        RESULTADO_PRELIMINAR
        RECEBIMENTO_REVISAO
        RESULTADO_APOS_REVISAO
        RESULTADO_FINAL
    }

    class TipoProponenteEscolhido {
        <<enumeration>>
        INSTITUICAO
        PESSOA
    }

    class TipoDirecionamentoProposta {
        <<enumeration>>
        ABERTA
        INSTITUICAO
        TIPO_INSTITUICAO
    }

    class ObrigatoriedadeBloco {
        <<enumeration>>
        EXIGIDO
        DISPENSADO
    }

    class Fomento {
        <<P1>>
    }

    class Faixa {
        <<P1>>
    }

    class TipoIniciativa {
        <<externo M008>>
    }

    class AreaTecnica {
        <<externo M008>>
    }

    class Instituicao {
        <<externo M008>>
    }

    class TipoInstituicao {
        <<externo M008>>
    }

    class NivelAcademico {
        <<externo M008>>
    }

    class PessoaFisica {
        <<externo shared.people>>
    }

    Captacao "*" --> "1" Fomento : baseada em
    Captacao "1" --> "1..*" Faixa : ativa faixas
    Captacao "1" --> "1" AreaTecnica : area tecnica
    Captacao "1" --> "1" Edital : edital
    Captacao "1" --> "0..1" OutorgadoDestinatario : destinatario
    Captacao "1" --> "1..*" TipoIniciativa : tipos aceitos
    Captacao "1" --> "1..*" CategoriaProjeto : categorias
    Captacao "1" --> "1" CronogramaCaptacao : cronograma
    Captacao "1" --> "1" RegraSubmissao : regra submissao
    Captacao "1" --> "*" ProponenteEscolhido : proponentes escolhidos
    Captacao "1" --> "1" RequisitoProponente : requisito
    Captacao "1" --> "1" RegraAvaliacao : regra avaliacao
    Captacao "1" --> "1" PrestacaoExigida : prestacao
    Captacao "1" --> "1..*" RevisorAdHoc : pool revisores
    Captacao "1" --> "*" DocumentoExigido : documentos
    Captacao "1" --> "1" MatrizConfiguracaoProjeto : matriz
    Captacao "1" --> "1" FormularioSubmissaoRef : submissao
    Captacao "1" --> "1" FormularioAvaliacaoRef : avaliacao
    Captacao "1" --> "1" FormularioRevisaoRef : revisao
    Captacao "1" --> "0..1" FormularioAnexoRef : anexos

    CronogramaCaptacao "1" --> "8" PeriodoCronograma : periodos
    PeriodoCronograma "1" --> "*" AdiamentoPeriodoCronograma : adiamentos
    OutorgadoDestinatario "0..1" --> "1" PessoaFisica : contato PF
    RequisitoProponente "0..1" --> "1" Instituicao : instituicao
    RequisitoProponente "0..1" --> "1" TipoInstituicao : tipo instituicao
    RequisitoProponente "0..1" --> "1" NivelAcademico : nivel minimo
    ProponenteEscolhido "*" --> "0..1" Instituicao : instituicao
    ProponenteEscolhido "*" --> "0..1" PessoaFisica : pessoa
    RevisorAdHoc "*" --> "1" PessoaFisica : pessoa
    DocumentoExigido "*" --> "*" FormatoArquivo : formatos
```

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

    class TipoIniciativa {
        <<externo M008>>
    }

    Captacao "1" --> "*" Proposta : recebe
    Captacao "1" --> "*" ResultadoSelecao : publica
    Captacao "1" --> "*" PeriodoCronograma : rege etapas

    Proposta "*" --> "1" Proponente : proponente
    Proposta "*" --> "1" Faixa : faixa escolhida
    Proposta "*" --> "1" TipoIniciativa : tipo projeto
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
