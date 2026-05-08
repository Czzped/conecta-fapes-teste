# Modelo Estrutural

Dominio e regras de negocio: ver [README.md](README.md)

## Organizacao por Contexto

Para facilitar a leitura, o modelo esta dividido em contextos de negocio. Cada contexto mantem seu proprio `README.md`, `modelo-estrutural.md`, `backlog.md` e EPICs quando aplicavel.

| Contexto | Entidades | Descricao |
|------------|-----------|-----------|
| [Pessoas](pessoas/modelo-estrutural.md) | PessoaFisica, NivelAcademico, HistoricoPessoa | Cadastro de individuos, titulacao e auditoria |
| [Instituicoes](instituicoes/modelo-estrutural.md) | Instituicao, UnidadeOrganizacional, TipoInstituicao, Responsavel | Instituicoes juridicamente identificaveis, suas unidades organizacionais internas e mandatos |
| [Diarias](diarias/modelo-estrutural.md) | Abrangencia, TipoDiaria, ParametroCalculoDiaria | Cadastros corporativos para calculo de diarias por abrangencia e parametros normativos |
| [Rubricas](rubricas/modelo-estrutural.md) | Rubrica | Catalogo corporativo de rubricas |
| [Geografia](geografia/modelo-estrutural.md) | Cidade, Regiao | Tabelas territoriais |
| [Classificacoes](classificacoes/modelo-estrutural.md) | AreaConhecimento, Finalidade | Classificacoes transversais |
| [Cadastros de Referencia](modelo-estrutural-referencia.md) | Diarias, Rubricas, Geografia e Classificacoes | Indice consolidado das referencias por contexto |

## Indice dos Contextos

| Contexto | Entidades |
|----------|-----------|
| [Pessoas](pessoas/README.md) | [PessoaFisica](pessoas/pessoa-fisica/README.md), [NivelAcademico](pessoas/nivel-academico/README.md), [HistoricoPessoa](pessoas/historico-pessoa/README.md) |
| [Instituicoes](instituicoes/README.md) | Instituicao, UnidadeOrganizacional, TipoInstituicao, Responsavel |
| [Diarias](diarias/README.md) | Abrangencia, TipoDiaria, ParametroCalculoDiaria |
| [Rubricas](rubricas/README.md) | [Rubrica](rubricas/rubrica/README.md) |
| [Geografia](geografia/README.md) | [Cidade](geografia/cidade/README.md), [Regiao](geografia/regiao/README.md) |
| [Classificacoes](classificacoes/README.md) | [AreaConhecimento](classificacoes/area-conhecimento/README.md), [Finalidade](classificacoes/finalidade/README.md) |

---

### Diagrama Consolidado

```mermaid
classDiagram
    direction TB

    class PessoaFisica {
        +String cpf
        +String nome
        +String email
        +String telefone
        +Date dataNascimento
        +String lattes
        +EstadoPessoa estado
    }

    class EstadoPessoa {
        <<enumeration>>
        ATIVA
        SUSPENSA
    }

    class NivelAcademico {
        +String nome
        +String descricao
    }

    class Instituicao {
        +String nome
        +String sigla
        +String cnpj
        +String razaoSocial
        +String email
        +String telefone
        +String endereco
        +boolean ativa
        +boolean isExterna
        +boolean isPublica
    }

    class TipoInstituicao {
        +String nome
        +String descricao
    }

    class Responsavel {
        +Date dataInicioMandato
        +Date dataFimMandato
        +boolean ativo
    }

    class UnidadeOrganizacional {
        +String nome
        +String sigla
        +String descricao
        +String email
        +String telefone
        +boolean ativa
    }

    class AreaConhecimento {
        +String codigo
        +String nome
        +NivelArea nivel
    }

    class NivelArea {
        <<enumeration>>
        GRANDE_AREA
        AREA
        SUBAREA
        ESPECIALIDADE
    }

    class Rubrica {
        +String codigo
        +String nome
        +String descricao
        +NaturezaDespesa naturezaDespesa
        +boolean ativa
    }

    class TipoDiaria {
        +Abrangencia abrangencia
        +Decimal valorUnitario
        +Date vigenciaInicio
        +Date vigenciaFim
        +boolean ativo
    }

    class ParametroCalculoDiaria {
        +TipoDiaria tipoDiaria
        +String normaReferencia
        +Decimal percentualDiariaSemPernoite
        +Integer horasMinimasSemPernoite
        +Integer horaLimiteRetornoAcrescimo
        +Decimal percentualAcrescimoRetorno
        +Integer distanciaMinimaKm
        +Integer limiteDiasConsecutivos
        +Integer limiteDiariasMes
        +Decimal percentualComplementoTransporte
        +boolean bloqueiaRegiaoMetropolitanaSemPernoite
        +boolean bloqueiaMunicipioLimitrofeSemPernoite
        +boolean ativo
        +Date vigenciaInicio
        +Date vigenciaFim
    }

    class Abrangencia {
        +String codigo
        +String nome
        +String descricao
        +boolean ativo
    }

    class NaturezaDespesa {
        <<enumeration>>
        CUSTEIO
        CAPITAL
    }

    class Cidade {
        +String nome
        +String codigoIBGE
    }

    class Regiao {
        +String nome
        +String descricao
    }

    class Finalidade {
        +String nome
        +String descricao
    }

    class HistoricoPessoa {
        +Date data
        +TipoEventoPessoa tipo
        +String descricao
        +String justificativa
    }

    class TipoEventoPessoa {
        <<enumeration>>
        CADASTRO
        ATUALIZACAO
        SUSPENSAO
        REATIVACAO
    }

    Instituicao "0..1" *-- "0..*" Instituicao : matriz/subInstituicoes
    Instituicao "1" *-- "0..*" UnidadeOrganizacional : unidades
    UnidadeOrganizacional "0..1" *-- "0..*" UnidadeOrganizacional : subUnidades
    Instituicao "0..1" --> "0..*" Responsavel : responsaveis
    UnidadeOrganizacional "0..1" --> "0..*" Responsavel : responsaveis
    Instituicao "0..*" --> "0..1" TipoInstituicao : classificadaComo
    PessoaFisica "1" --> "0..*" Responsavel : assume
    PessoaFisica "1" --> "*" HistoricoPessoa : historico
    PessoaFisica "0..1" --> "1" NivelAcademico : nivel academico
    AreaConhecimento "0..1" --> "*" AreaConhecimento : subareas
    Rubrica "0..1" --> "*" Rubrica : subrubricas
    Rubrica "*" --> "0..1" NaturezaDespesa : natureza
    Abrangencia "1" --> "*" TipoDiaria : tipos
    TipoDiaria "1" --> "*" ParametroCalculoDiaria : parametros

    Regiao "1" --> "*" Cidade : cidades
```

## Dicionario de Dados

| Classe | Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|--------|----------|-----------|--------|------|---------|---------|-------|
| **PessoaFisica** | cpf | CPF da pessoa (somente digitos) | Sim | String | Ex: 12345678901 | 11 | Sim |
| | nome | Nome completo da pessoa | Sim | String | | 300 | |
| | email | Email de contato | Sim | String | | 200 | |
| | telefone | Telefone de contato | Nao | String | | 20 | |
| | dataNascimento | Data de nascimento | Sim | Date | | | |
| | lattes | URL do curriculo Lattes | Nao | String | | 500 | |
| | estado | Estado atual da pessoa | Gerado | EstadoPessoa | Ativa, Suspensa | | |
| | nivelAcademico (relacao) | Maior nivel academico informado para a pessoa | Nao | FK -> NivelAcademico | Ex: Graduacao, Especializacao, Mestrado, Doutorado, Pos-Doutorado | | |
| **NivelAcademico** | nome | Nome do nivel academico | Sim | String | Ex: Doutorado | 100 | Sim |
| | descricao | Descricao do nivel academico | Nao | String | | 300 | |
| **Instituicao** | nome | Nome comum de exibicao da instituicao | Sim | String | Ex: UFES, IFES Campus Serra | 300 | |
| | sigla | Sigla comum da instituicao | Nao | String | Ex: UFES | 20 | |
| | cnpj | CNPJ proprio da instituicao (somente digitos) | Sim | String | Ex: 12345678000199 | 14 | Sim |
| | razaoSocial | Razao social da instituicao | Sim | String | | 300 | |
| | email | Email institucional ou de contato | Sim | String | | 200 | |
| | telefone | Telefone institucional ou de contato | Nao | String | | 20 | |
| | endereco | Endereco completo | Sim | String | | 500 | |
| | ativa | Indica se a instituicao esta ativa | Sim | Boolean | true/false | | |
| | isExterna | Indica se a instituicao e externa a agencia de fomento | Sim | Boolean | true/false | | |
| | isPublica | Indica se a instituicao e publica (`true`) ou privada (`false`) | Sim | Boolean | true/false | | |
| | instituicaoSuperior (relacao) | Instituicao matriz quando esta for filial juridicamente identificavel | Nao | FK → Instituicao | Via `matriz/subInstituicoes` | | |
| | subInstituicoes (relacao) | Instituicoes filhas ligadas a esta como matriz | Nao | Lista FK → Instituicao | Via `matriz/subInstituicoes` | | |
| | unidades (relacao) | Unidades organizacionais internas vinculadas diretamente a esta instituicao | Nao | Lista FK → UnidadeOrganizacional | Via `unidades` | | |
| | responsaveis (relacao) | Vinculos de responsavel associados a esta instituicao | Nao | Lista FK → Responsavel | Via `responsaveis` | | |
| | tipoInstituicao (relacao) | Classificacao institucional | Nao | FK → TipoInstituicao | Via `classificadaComo` | | |
| **UnidadeOrganizacional** | nome | Nome de exibicao da unidade | Sim | String | Ex: Centro Tecnologico, Departamento de Informatica | 300 | |
| | sigla | Sigla da unidade | Nao | String | Ex: CT, DI | 20 | |
| | descricao | Descricao da unidade | Nao | String | | 500 | |
| | email | Email de contato da unidade | Nao | String | | 200 | |
| | telefone | Telefone de contato da unidade | Nao | String | | 20 | |
| | ativa | Indica se a unidade esta ativa | Sim | Boolean | true/false | | |
| | instituicaoPai (relacao) | Instituicao a qual a unidade esta diretamente vinculada | Cond. | FK → Instituicao | Via `unidades`. Obrigatorio quando `unidadeSuperior` nao informada | | |
| | unidadeSuperior (relacao) | Unidade superior na hierarquia interna | Cond. | FK → UnidadeOrganizacional | Via `subUnidades`. Obrigatorio quando `instituicaoPai` nao informada | | |
| | subUnidades (relacao) | Unidades filhas vinculadas a esta unidade | Nao | Lista FK → UnidadeOrganizacional | Via `subUnidades` | | |
| | responsaveis (relacao) | Vinculos de responsavel associados a esta unidade | Nao | Lista FK → Responsavel | Via `responsaveis` | | |
| **TipoInstituicao** | nome | Nome do tipo de instituicao | Sim | String | Ex: Ensino, Empresa, Agencia de Fomento | 200 | Sim |
| | descricao | Descricao do tipo | Nao | String | | 500 | |
| **Responsavel** | dataInicioMandato | Data de inicio do mandato | Sim | Date | | | |
| | dataFimMandato | Data de termino do mandato | Sim | Date | | | |
| | ativo | Indica se o mandato esta vigente | Gerado | Boolean | true/false | | |
| | pessoa (relacao) | Pessoa fisica que assume o papel de responsavel | Sim | FK → PessoaFisica | Via `assume` | | |
| | instituicao (relacao) | Instituicao onde a pessoa exerce o mandato (xor com `unidade`) | Cond. | FK → Instituicao | Via `responsaveis`. Obrigatorio quando `unidade` nao informada | | |
| | unidade (relacao) | Unidade organizacional onde a pessoa exerce o mandato (xor com `instituicao`) | Cond. | FK → UnidadeOrganizacional | Via `responsaveis`. Obrigatorio quando `instituicao` nao informada | | |
| **AreaConhecimento** | codigo | Codigo da area conforme CNPq | Sim | String | Ex: 1.03.04 | 20 | Sim |
| | nome | Nome da area de conhecimento | Sim | String | Ex: Ciencia da Computacao | 200 | |
| | nivel | Nivel hierarquico da area | Sim | NivelArea | Grande Area, Area, Subarea, Especialidade | | |
| **Abrangencia** | codigo | Codigo canonico da abrangencia | Sim | String | DENTRO_ESTADO, NACIONAL, INTERNACIONAL | 40 | Sim |
| | nome | Nome de exibicao da abrangencia | Sim | String | Ex: Dentro do Estado | 150 | |
| | descricao | Descricao da abrangencia | Nao | String | | 500 | |
| | ativo | Indica se a abrangencia esta ativa para novos tipos de diaria | Sim | Boolean | true/false | | |
| **TipoDiaria** | abrangencia | Abrangencia administrativa do deslocamento | Sim | FK -> Abrangencia | Via `tipos` | | |
| | valorUnitario | Valor unitario vigente da diaria | Sim | Decimal | Maior que zero | | |
| | vigenciaInicio | Inicio da vigencia | Sim | Date | | | |
| | vigenciaFim | Fim da vigencia | Nao | Date | | | |
| | ativo | Indica se o cadastro esta ativo | Sim | Boolean | true/false | | |
| **ParametroCalculoDiaria** | tipoDiaria (relacao) | Tipo de diaria ao qual os parametros pertencem | Sim | FK -> TipoDiaria | Via `parametros` | | |
| | normaReferencia | Decreto, resolucao ou ato normativo que fundamenta os parametros | Sim | String | Ex: Decreto ES no 5533-R/2023 | 200 | |
| | percentualDiariaSemPernoite | Percentual aplicado em diaria sem pernoite, quando previsto na norma | Sim | Decimal | Ex: 0.40 | | |
| | horasMinimasSemPernoite | Quantidade minima de horas para caracterizar diaria sem pernoite | Sim | Integer | Ex: 6 | | |
| | horaLimiteRetornoAcrescimo | Hora limite de retorno que gera acrescimo, quando previsto | Nao | Integer | 0 a 23 | | |
| | percentualAcrescimoRetorno | Percentual de acrescimo aplicado pelo retorno apos hora limite | Nao | Decimal | Ex: 0.50 | | |
| | distanciaMinimaKm | Distancia minima em quilometros para elegibilidade, quando prevista | Nao | Integer | Maior ou igual a zero | | |
| | limiteDiasConsecutivos | Limite de dias consecutivos por viagem, quando previsto | Nao | Integer | Maior que zero | | |
| | limiteDiariasMes | Limite mensal de diarias, quando previsto | Nao | Integer | Maior que zero | | |
| | percentualComplementoTransporte | Percentual de complemento de transporte, quando previsto | Nao | Decimal | Ex: 0.20 | | |
| | bloqueiaRegiaoMetropolitanaSemPernoite | Indica se deslocamentos em regiao metropolitana sem pernoite sao bloqueados | Sim | Boolean | true/false | | |
| | bloqueiaMunicipioLimitrofeSemPernoite | Indica se municipios limitrofes sem pernoite sao bloqueados | Sim | Boolean | true/false | | |
| | ativo | Indica se os parametros estao vigentes para novas consultas | Sim | Boolean | true/false | | |
| | vigenciaInicio | Inicio da vigencia dos parametros | Sim | Date | | | |
| | vigenciaFim | Fim da vigencia dos parametros | Nao | Date | | | |
| **Rubrica** | codigo | Codigo canonico da rubrica | Sim | String | Ex: RUB-DIARIAS | 40 | Sim |
| | nome | Nome de exibicao da rubrica | Sim | String | Ex: Diarias | 150 | |
| | descricao | Descricao da rubrica | Sim | String | | 500 | |
| | rubricaPai (relacao) | Rubrica superior quando esta rubrica representar detalhamento/subrubrica | Nao | FK -> Rubrica | Via `subrubricas` | | |
| | subrubricas (relacao) | Rubricas filhas que detalham esta rubrica | Nao | Lista FK -> Rubrica | Via `rubricaPai` | | |
| | naturezaDespesa | Natureza da despesa | Sim | NaturezaDespesa | CUSTEIO, CAPITAL | | |
| | ativa | Indica se a rubrica esta ativa | Sim | Boolean | true/false | | |
| **Cidade** | nome | Nome da cidade | Sim | String | Ex: Vitoria | 200 | |
| | codigoIBGE | Codigo IBGE da cidade | Sim | String | Ex: 3205309 | 10 | Sim |
| **Regiao** | nome | Nome da regiao | Sim | String | Ex: Grande Vitoria | 200 | Sim |
| | descricao | Descricao da regiao | Nao | String | | 500 | |
| **Finalidade** | nome | Nome da finalidade | Sim | String | Ex: Pesquisa, Inovacao, Extensao | 200 | Sim |
| | descricao | Descricao do proposito | Nao | String | | 500 | |
| **HistoricoPessoa** | data | Data do evento | Gerado | Date | | | |
| | tipo | Tipo do evento registrado | Sim | TipoEventoPessoa | Cadastro, Atualizacao, Suspensao, Reativacao | | |
| | descricao | Descricao textual do evento | Sim | String | | 500 | |
| | justificativa | Justificativa (obrigatoria para suspensao e reativacao) | Cond. | String | | 500 | |

## Notas de Implementacao

**Hierarquia organizacional:**
- `Instituicao` representa entidade juridicamente identificavel (matriz, filial ou campus com CNPJ proprio). CNPJ e obrigatorio.
- `UnidadeOrganizacional` representa subdivisao interna sem CNPJ (centro, departamento, coordenacao, laboratorio, setor).
- Composicao: `Instituicao` pode ser composta por outras `Instituicao` (filiais juridicamente identificaveis) e/ou por `UnidadeOrganizacional`. `UnidadeOrganizacional` pode ser composta por outras `UnidadeOrganizacional`.
- Toda `UnidadeOrganizacional` deve ser rastreavel transitivamente a uma `Instituicao` raiz, atraves de `instituicaoPai` direto ou via cadeia de `unidadeSuperior`.
- `Responsavel` e o vinculo temporal entre `PessoaFisica` e uma entidade organizacional (`Instituicao` OU `UnidadeOrganizacional`). Cada `Responsavel` aponta exatamente para uma das duas entidades (xor).

**Entidades externas:**
- Acesso Cidadao (SSO): gerenciado por M005 (Autenticacao). A identidade autenticada e usada para vincular ao cadastro da pessoa.

**Rubrica x transacao:**
- `Rubrica` e dado mestre de classificacao normativa/orcamentaria, com `codigo`, `nome`, `descricao` e hierarquia por `rubricaPai`/`subrubricas`.
- Subrubrica nao e entidade separada; e uma Rubrica filha de outra Rubrica.
- Movimentos de saldo da rubrica nao pertencem ao catalogo de Rubricas; pertencem ao M013 como `Transacao`. Pagamentos e movimentos bancarios pertencem a M014/M016 como `TransacaoFinanceira`/`MovimentacaoFinanceira` e apenas referenciam a rubrica quando aplicavel.

**Navegabilidade:**
- Cardinalidade 1: atributo do tipo da classe destino (ex: Responsavel.pessoa: PessoaFisica)
- Cardinalidade N: atributo lista do tipo da classe destino (ex: Instituicao.subInstituicoes: List<Instituicao>, Instituicao.unidades: List<UnidadeOrganizacional>)
