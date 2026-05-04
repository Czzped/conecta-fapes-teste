# M008 - Cadastros Corporativos

[<< Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 01 -- Corporativo e Administrativo](../../../discovery/domains/01-corporativo.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclos de vida de Pessoa e Instituicao |

---

## Sobre o Modulo

Atualmente, os cadastros de pessoas fisicas, instituicoes e dados de referencia sao mantidos em planilhas e sistemas legados sem integracao, gerando duplicidade de registros, inconsistencias e retrabalho. Este modulo resolve esse problema ao centralizar o cadastro e a manutencao de pessoas, organizacoes e dados basicos de referencia em uma unica plataforma, garantindo unicidade (CPF/CNPJ), hierarquia organizacional e coerencia entre a estrutura institucional da agencia e as demais organizacoes cadastradas. O sucesso sera medido pela reducao de cadastros duplicados e pelo tempo necessario para localizar e validar dados cadastrais.

---

## Dominio

A agencia de fomento interage com diversos atores externos -- pesquisadores, bolsistas, consultores ad hoc, instituicoes de ensino e pesquisa e parceiros institucionais -- e precisa manter registros confiaveis sobre cada um deles para operacionalizar editais, iniciativas, bolsas e pagamentos.

Neste contexto, a propria agencia de fomento e representada como uma `Instituicao`. Toda organizacao, matriz, filial, campus ou unidade com CNPJ proprio e cadastrada como `Instituicao` com CNPJ; setores internos sem CNPJ proprio tambem sao `Instituicao`, mas devem possuir uma instituicao superior. Assim, IFES matriz, IFES Campus Serra, UFES, Centro Tecnologico e Departamento de Informatica usam o mesmo modelo, diferenciados por regras de negocio e pela presenca ou ausencia de CNPJ.

Pessoas fisicas sao cadastradas com dados pessoais, academicos e profissionais. No front-office, o cadastro e feito automaticamente via Acesso Cidadao (SSO do governo do ES). No back-office, servidores podem cadastrar ou atualizar pessoas manualmente. Uma pessoa pode ser suspensa, o que bloqueia todas as operacoes vinculadas a ela.

Alem dos cadastros de pessoas e organizacoes, o sistema mantem dados basicos de referencia: areas de conhecimento seguindo a classificacao do CNPq, rubricas para classificacao de despesas e tabelas geograficas de cidades e regioes do ES. O cadastro de Rubricas e canonico para a plataforma: M011 seleciona o que cada edital permite, M013 materializa a Rubrica no orcamento do projeto e M014 usa a Rubrica do projeto na prestacao de contas.

Rubrica e dado mestre de classificacao. Ela nao representa o movimento em si: a movimentacao da rubrica fica em M013 como `Transacao`. Pagamentos e movimentos bancarios ficam em M014/M016 como `TransacaoFinanceira`/`MovimentacaoFinanceira`, referenciando a rubrica quando for necessario classificar o valor.

No cadastro corporativo, a Rubrica possui `codigo`, `nome`, `descricao`, `naturezaDespesa`, indicador booleano `ativa` e hierarquia opcional por `rubricaPai`/`subrubricas`. Subrubrica nao e entidade separada: e uma Rubrica filha de outra Rubrica.

Tambem pertencem ao M008 os cadastros corporativos usados pelo fluxo de diarias: `Abrangencia`, que classifica o deslocamento, `TipoDiaria`, que mantem valor vigente, vigencia e abrangencia da viagem, e `ParametroCalculoDiaria`, que versiona os parametros normativos de calculo vinculados ao tipo de diaria, como percentuais, limites, bloqueios e norma de referencia. Esses dados ficam no [contexto Diarias](diarias/README.md). O M003 apenas referencia os cadastros vigentes ao criar uma solicitacao e grava snapshots para preservar o calculo historico.

Os documentos detalhados do M008 sao organizados por contexto de negocio, nao por uma pasta generica de entidades:

| Contexto | Entidades |
|----------|-----------|
| [Pessoas](pessoas/README.md) | PessoaFisica, NivelAcademico, HistoricoPessoa |
| [Instituicoes](instituicoes/README.md) | Instituicao, TipoInstituicao, Dirigente |
| [Diarias](diarias/README.md) | Abrangencia, TipoDiaria, ParametroCalculoDiaria |
| [Rubricas](rubricas/README.md) | Rubrica |
| [Geografia](geografia/README.md) | Cidade, Regiao |
| [Classificacoes](classificacoes/README.md) | AreaConhecimento, Finalidade |

Cada contexto e dono do seu `README.md`, `modelo-estrutural.md`, `backlog.md` e pasta `epics/` quando houver EPICs especificos. O arquivo [modelo-estrutural.md](modelo-estrutural.md) funciona como visao consolidada do modulo; os submodelos contextuais sao a fonte de detalhe para atributos, relacionamentos e regras locais.

> Autenticacao e controle de acesso (IAM) sao tratados no modulo M005. Este modulo consome a identidade autenticada para associar ao cadastro da pessoa.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Uma pessoa fisica e identificada unicamente pelo CPF; nao pode haver duplicidade. | Must |
| RN02 | Uma instituicao com CNPJ proprio e identificada unicamente pelo CNPJ; nao pode haver duplicidade. | Must |
| RN03 | Instituicoes podem possuir hierarquia superior-subestrutura. | Must |
| RN04 | Um dirigente e o vinculo temporal entre uma pessoa fisica e uma instituicao, com mandato de inicio e fim. | Must |
| RN05 | A suspensao de uma pessoa bloqueia todas as operacoes vinculadas (submissao, bolsas, pagamentos). | Must |
| RN06 | Areas de conhecimento seguem a classificacao hierarquica do CNPq (grande area, area, subarea, especialidade). | Must |
| RN07 | Rubricas devem possuir referencia canonica estavel para uso por editais, orcamentos, transacoes e prestacoes de contas. | Must |
| RN09 | Cidades devem pertencer a uma regiao; regioes agrupam cidades do estado. | Should |
| RN10 | O cadastro automatico via Acesso Cidadao deve criar a pessoa caso nao exista, ou vincular a existente pelo CPF. | Should |
| RN11 | Instituicao com CNPJ proprio deve possuir exatamente um dirigente ativo. | Must |
| RN12 | Toda organizacao, campus, filial ou unidade com CNPJ proprio deve ser cadastrada como Instituicao com CNPJ. | Must |
| RN13 | Setor interno sem CNPJ proprio deve ser cadastrado como Instituicao sem CNPJ e com superior informado. | Must |
| RN14 | Instituicao sem superior deve possuir CNPJ proprio. | Must |
| RN15 | Instituicao sem CNPJ proprio e tratada como setor interno para fins de cadastro, consulta e hierarquia. | Must |
| RN16 | Toda Rubrica deve possuir codigo canonico unico, nome, descricao, natureza da despesa e indicador booleano `ativa`. | Must |
| RN17 | Subrubricas sao representadas por relacao opcional com `rubricaPai`; nao ha campo adicional para classificar a hierarquia. | Must |
| RN18 | Rubrica inativa nao deve ser ofertada em novas configuracoes de edital/projeto, mas deve permanecer consultavel para historico. | Must |
| RN21 | Rubrica nao deve armazenar transacoes financeiras nem movimentos de saldo; deve ser referenciada por `Transacao` e movimentos bancarios apenas como classificacao. | Must |
| RN22 | Abrangencia da diaria e classe corporativa com codigo canonico unico, nome, descricao e situacao ativa/inativa. | Must |
| RN23 | TipoDiaria deve possuir abrangencia, valor unitario, vigencia e situacao ativa/inativa, sem vigencias sobrepostas para a mesma abrangencia. | Must |
| RN24 | ParametroCalculoDiaria deve estar vinculado a um TipoDiaria e possuir norma de referencia, percentuais, limites, bloqueios, vigencia e situacao ativa/inativa, sem vigencias sobrepostas para o mesmo TipoDiaria. | Must |
| RI1 | Uma instituicao so pode ter um dirigente ativo ao mesmo tempo. | Must |
| RI2 | Uma pessoa suspensa nao pode ser reativada sem justificativa registrada. | Must |
