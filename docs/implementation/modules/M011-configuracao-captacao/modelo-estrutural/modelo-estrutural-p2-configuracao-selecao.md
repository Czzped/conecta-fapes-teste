# Modelo Estrutural — P2 Configuracao da Selecao

Contexto: [README.md](../README.md) | Modelo consolidado: [modelo-estrutural.md](modelo-estrutural.md) | Por processo: [P1](modelo-estrutural-p1-fomento.md) | [P3](modelo-estrutural-p3-selecao-projetos.md)

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

    class TipoProjeto {
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
    Captacao "1" --> "1..*" TipoProjeto : tipos aceitos
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

## Dicionario de Dados

| Classe | Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|--------|----------|-----------|--------|------|---------|---------|-------|
| **Captacao** | codigo | Codigo da captacao | Gerado | String | | | Sim |
| | titulo | Titulo da captacao | Sim | String | | 200 | |
| | descricao | Descricao resumida do objetivo e escopo da captacao | Nao | String | | 1000 | |
| | tipoCaptacao | Tipo da captacao | Sim | TipoCaptacao | CHAMADA_PUBLICA, DEMANDA_INDUZIDA | | |
| | tipoOutorgado | Tipo do outorgado da captacao | Sim | TipoOutorgado | PESSOA_FISICA, PESSOA_JURIDICA | | |
| | estadoConfiguracao | Status da configuracao da captacao | Sim | EstadoConfiguracaoCaptacao | EM_ANDAMENTO, PUBLICADO, NAO_PUBLICADO, PAUSADO, ENCERRADO, CANCELADO | | |
| | fomento (relacao) | Fomento ao qual a captacao esta vinculada; deve estar no estado APROVADO | Sim | FK → Fomento | Fomento.estado = APROVADO | | |
| | faixasSelecionadas (relacao) | Faixas do fomento selecionadas para esta captacao | Sim | List<FK → Faixa> | >= 1; cada faixa deve pertencer ao Fomento vinculado | | |
| | areaTecnica (relacao) | Area tecnica responsavel pela captacao | Sim | FK → AreaTecnica | Via M008 | | |
| | edital (relacao) | Edital publicado vinculado a captacao | Sim | FK → Edital | | | |
| | outorgadoDestinatario (relacao) | Destinatario da demanda induzida | Cond. | FK → OutorgadoDestinatario | Obrigatorio para DEMANDA_INDUZIDA | | |
| **Edital** | titulo | Titulo do edital | Sim | String | | 200 | |
| | descricao | Descricao do edital | Nao | String | | 1000 | |
| | link | URL externa do edital | Cond. | String | Ao menos link ou nomeArquivo deve ser preenchido | 500 | |
| | nomeArquivo | Nome do arquivo do edital anexado | Cond. | String | | 300 | |
| | urlArquivo | URL de acesso ao arquivo anexado | Cond. | String | | 500 | |
| | versao | Versao do edital; incrementada a cada retificacao | Sim | String | | 50 | |
| **OutorgadoDestinatario** | cpf | CPF da pessoa para demanda induzida PF | Cond. | String | Obrigatorio para DEMANDA_INDUZIDA PF | 11 | |
| | nome | Nome da pessoa para demanda induzida | Cond. | String | | 300 | |
| **CategoriaProjeto** | nome | Categoria de projeto aceita pela captacao | Sim | String | Ex: Pesquisa, Inovacao, Extensao | 200 | Sim |
| | descricao | Descricao da categoria | Nao | String | | 500 | |
| | selecionavelNoCadastro | Indica se a categoria esta disponivel para selecao no cadastro | Sim | Boolean | true/false | | |
| **CronogramaCaptacao** | descricao | Descricao geral do cronograma | Sim | String | | 500 | |
| **PeriodoCronograma** | nome | Nome descritivo da fase | Sim | String | Ex: Periodo de Recebimento de Propostas | 200 | |
| | tipo | Tipo da fase no fluxo da captacao | Sim | TipoPeriodo | PUBLICACAO_CAPTACAO, RECEBIMENTO_PROPOSTAS, AVALIACAO_DOCUMENTAL, AVALIACAO_AD_HOC, RESULTADO_PRELIMINAR, RECEBIMENTO_REVISAO, RESULTADO_APOS_REVISAO, RESULTADO_FINAL | | |
| | dataInicio | Data de inicio do periodo | Sim | Date | | | |
| | dataFim | Data de fim do periodo | Sim | Date | | | |
| **AdiamentoPeriodoCronograma** | dias | Quantidade de dias acrescida a etapa e as etapas posteriores | Sim | Int | > 0 | | |
| | justificativa | Motivo do adiamento | Sim | String | | 500 | |
| | dataRegistro | Data em que o adiamento foi registrado | Gerado | Date | | | |
| | dataInicioOriginal | Data inicial antes do adiamento | Sim | Date | | | |
| | dataFimOriginal | Data final antes do adiamento | Sim | Date | | | |
| | dataInicioNova | Data inicial apos o adiamento | Sim | Date | | | |
| | dataFimNova | Data final apos o adiamento | Sim | Date | | | |
| **RegraSubmissao** | permiteMultiplasPropostas | Indica se o proponente pode enviar mais de uma proposta | Sim | Boolean | true/false | | |
| | permiteParticiparEmOutraProposta | Indica se o coordenador pode participar de outra proposta da mesma captacao | Sim | Boolean | true/false | | |
| | permiteAcumularBolsa | Indica se o coordenador pode acumular bolsa ativa em outro projeto | Sim | Boolean | true/false | | |
| | submissaoRestritaAEscolhidos | Indica se apenas pessoas previamente escolhidas podem submeter | Sim | Boolean | true/false | | |
| **ProponenteEscolhido** | tipo | Tipo de proponente escolhido | Sim | TipoProponenteEscolhido | INSTITUICAO, PESSOA | | |
| | instituicao (relacao) | Instituicao autorizada quando tipo=INSTITUICAO | Cond. | FK → Instituicao | Via M008 | | |
| | pessoa (relacao) | Pessoa autorizada quando tipo=PESSOA | Cond. | FK → PessoaFisica | Via M008 | | |
| **RequisitoProponente** | direcionamento | Define se a proposta e aberta, direcionada a instituicao ou tipo de instituicao | Sim | TipoDirecionamentoProposta | ABERTA, INSTITUICAO, TIPO_INSTITUICAO | | |
| | permiteParceriaInstituicoes | Indica se a proposta pode envolver mais de uma instituicao | Sim | Boolean | true/false | | |
| | exigeVinculoEmpregaticio | Indica se o proponente deve ter vinculo empregaticio ativo | Sim | Boolean | true/false | | |
| | exigeGestorInstitucional | Indica se a proposta deve informar gestor institucional | Sim | Boolean | true/false | | |
| | instituicao (relacao) | Instituicao permitida quando direcionamento=INSTITUICAO | Cond. | FK → Instituicao | Via M008 | | |
| | tipoInstituicao (relacao) | Tipo de instituicao quando direcionamento=TIPO_INSTITUICAO | Cond. | FK → TipoInstituicao | Via M008 | | |
| | nivelAcademicoMinimo (relacao) | Nivel academico minimo exigido do proponente | Nao | FK → NivelAcademico | Via M008 | | |
| **RegraAvaliacao** | exigeAvaliacaoAdHoc | Indica se a captacao exige avaliacao ad hoc | Sim | Boolean | true/false | | |
| | quantidadeMinimaRevisores | Quantidade minima de revisores ad hoc por proposta | Sim | Int | >= 0 | | |
| **PrestacaoExigida** | exigePrestacaoTecnica | Indica se os projetos exigirao prestacao tecnica | Sim | Boolean | true/false | | |
| | exigePrestacaoFinanceira | Indica se os projetos exigirao prestacao financeira | Sim | Boolean | true/false | | |
| **DocumentoExigido** | nome | Nome do documento exigido do proponente | Sim | String | | 200 | |
| | descricao | Descricao ou orientacao de envio | Nao | String | | 500 | |
| | obrigatorio | Indica se o documento e obrigatorio na submissao | Sim | Boolean | true/false | | |
| | reutilizarCadastroCorporativo | Indica se o documento deve ser reaproveitado do M008 quando valido | Sim | Boolean | true/false | | |
| | exigirNovoEnvioSeVencido | Indica se novo upload e exigido quando o documento no M008 estiver vencido | Sim | Boolean | true/false | | |
| **FormatoArquivo** | extensao | Extensao de arquivo permitida para o documento | Sim | String | Ex: PDF, DOCX, XLSX | 20 | |
| **RevisorAdHoc** | pessoa (relacao) | Pessoa fisica que atua como revisor ad hoc | Sim | FK → PessoaFisica | Via M008 | | |
| | dataInclusao | Data em que a pessoa foi incluida no pool de revisores | Gerado | Date | | | |
| | areaAtuacao | Area de conhecimento para distribuicao de propostas | Sim | String | | 200 | |
| | titulacao | Titulacao academica do revisor | Sim | String | Ex: Doutor, Mestre | 100 | |
| **MatrizConfiguracaoProjeto** | equipe | Obrigatoriedade do bloco equipe na proposta | Sim | ObrigatoriedadeBloco | EXIGIDO, DISPENSADO | | |
| | resultados | Obrigatoriedade do bloco resultados | Sim | ObrigatoriedadeBloco | EXIGIDO, DISPENSADO | | |
| | riscos | Obrigatoriedade do bloco riscos | Sim | ObrigatoriedadeBloco | EXIGIDO, DISPENSADO | | |
| | cronogramaProj | Obrigatoriedade do bloco cronograma do projeto | Sim | ObrigatoriedadeBloco | EXIGIDO, DISPENSADO | | |
| | orcamento | Obrigatoriedade do bloco orcamento | Sim | ObrigatoriedadeBloco | EXIGIDO, DISPENSADO | | |
| | objetivos | Obrigatoriedade do bloco objetivos | Sim | ObrigatoriedadeBloco | EXIGIDO, DISPENSADO | | |
| | beneficios | Obrigatoriedade do bloco beneficios | Sim | ObrigatoriedadeBloco | EXIGIDO, DISPENSADO | | |
| **FormularioSubmissaoRef** | formularioId | Identificador do formulario no M021 | Sim | String | | | |
| | versaoFormularioId | Identificador da versao publicada no M021 | Sim | String | | | |
| **FormularioAvaliacaoRef** | formularioId | Identificador do formulario de avaliacao no M021 | Sim | String | | | |
| | versaoFormularioId | Identificador da versao publicada no M021 | Sim | String | | | |
| **FormularioRevisaoRef** | formularioId | Identificador do formulario de revisao no M021 | Sim | String | | | |
| | versaoFormularioId | Identificador da versao publicada no M021 | Sim | String | | | |
| **FormularioAnexoRef** | formularioId | Identificador do formulario de anexos no M021 | Nao | String | | | |
| | versaoFormularioId | Identificador da versao publicada no M021 | Nao | String | | | |

---

## Regras de Negocio

### Configuracao da Captacao

| ID | Responsavel | Regra |
|----|-------------|-------|
| RN-CS00 | AnalistaTecnico | Rubricas e tipos de projetos sao definidos no Fomento e herdados pela Captacao pelas faixas selecionadas. Nao sao reconfigurados neste processo. |
| RN-CS01 | AnalistaTecnico | A Captacao deve referenciar um Fomento com estado APROVADO. |
| RN-CS02 | AnalistaTecnico | A Captacao deve ter tipo CHAMADA_PUBLICA ou DEMANDA_INDUZIDA. |
| RN-CS03 | AnalistaTecnico | Quando DEMANDA_INDUZIDA, deve ser indicado o outorgado destinatario (PF ou PJ). |
| RN-CS04 | AnalistaTecnico | OutorgadoDestinatario PJ deve ter pessoa fisica de contato informada. |
| RN-CS05 | AnalistaTecnico | A Captacao deve selecionar ao menos uma faixa do Fomento. |
| RN-CS06 | AnalistaTecnico | As faixas selecionadas devem pertencer ao Fomento referenciado. |
| RN-CS07 | AnalistaTecnico | A Captacao deve ter link do edital preenchido antes da publicacao. |
| RN-CS08 | AnalistaTecnico | O cronograma deve conter as 8 etapas obrigatorias antes da publicacao: PUBLICACAO_CAPTACAO, RECEBIMENTO_PROPOSTAS, AVALIACAO_DOCUMENTAL, AVALIACAO_AD_HOC, RESULTADO_PRELIMINAR, RECEBIMENTO_REVISAO, RESULTADO_APOS_REVISAO e RESULTADO_FINAL. |
| RN-CS09 | AnalistaTecnico | Todas as datas do cronograma devem estar dentro da vigencia do Fomento. |
| RN-CS10 | AnalistaTecnico | Toda Captacao deve selecionar formulario de submissao, avaliacao ad hoc e revisao de resultado no M021. |
| RN-CS11 | AnalistaTecnico | Quando submissao restrita a escolhidos, deve ser selecionada ao menos uma instituicao ou pessoa autorizada. |
| RN-CS14 | AnalistaTecnico | A Captacao so pode ser publicada quando toda a configuracao obrigatoria estiver preenchida. |
| RN-CS15 | AnalistaTecnico | A Captacao so pode ser despublicada quando nenhuma proposta estiver submetida no periodo ativo. |
| RN-CS16 | AnalistaTecnico | O tipo do outorgado deve ser definido em qualquer tipo de chamamento. |
| RN-CS17 | AnalistaTecnico | O edital deve conter ao menos um link externo ou um arquivo anexado antes da publicacao. |
| RN-CS18 | AnalistaTecnico | O edital pode ser retificado informando nova versao. O historico de versoes deve ser preservado. |
| RN-CS19 | AnalistaTecnico | Cada bloco fixo da proposta deve ser configurado como EXIGIDO ou DISPENSADO antes da publicacao. |
| RN-CS20 | Sistema | Blocos configurados como DISPENSADO nao aparecem no formulario de submissao. |
| RN-CS21 | Sistema | Blocos configurados como EXIGIDO sao obrigatorios — a proposta nao pode ser submetida sem que estejam preenchidos. |
| RN-CS22 | AnalistaTecnico | O AnalistaTecnico pode exigir documentos adicionais especificos do edital, independentes dos blocos da matriz. |
| RN-CS23 | Sistema | Documentos marcados como obrigatorios bloqueiam a submissao da proposta quando ausentes. |
| RN-CS24 | Sistema | Quando reutilizarCadastroCorporativo=true, o sistema verifica se o proponente ja possui o documento valido no M008 e o reaproveita. Se vencido e exigirNovoEnvioSeVencido=true, novo upload e solicitado. |
| RN-CS25 | Sistema | Quando exigeAprovacaoInstitucional=true, a assinatura do ResponsavelInstitucional deve ocorrer dentro do periodo de submissao. |
| RN-CS26 | Sistema | Proposta sem assinatura institucional nao pode ser submetida quando exigeAprovacaoInstitucional=true. |
| RN-CS27 | ResponsavelInstitucional | O responsavel assina ou recusa a proposta antes da dataFim do periodo de submissao. Recusa deve ter justificativa. |

### Prorrogacao de Cronograma

| ID | Responsavel | Regra |
|----|-------------|-------|
| RN-PR01 | AnalistaTecnico | Prorrogacao pode ser aplicada a qualquer etapa do cronograma de Captacao com estado PUBLICADO. |
| RN-PR02 | AnalistaTecnico | A quantidade de dias deve ser maior que zero. |
| RN-PR03 | AnalistaTecnico | Justificativa e obrigatoria para toda prorrogacao. |
| RN-PR04 | Sistema | Ao prorrogar uma etapa, todas as etapas com ordem posterior sao deslocadas pelo mesmo numero de dias. |
| RN-PR05 | Sistema | O registro da prorrogacao e imutavel — preserva dataInicioOriginal, dataFimOriginal, dataInicioNova e dataFimNova. |
| RN-PR06 | Sistema | As novas datas nao podem ultrapassar a dataFim do Fomento. Se ultrapassarem, a prorrogacao e bloqueada. |
