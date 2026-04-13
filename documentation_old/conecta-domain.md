# ConectaFAPES - Domínios de Software

> Arquivo gerado a partir de `conecta_overall.md` para segregação de contextos de microserviços.

## Domínio: Corporativo / Administrativo (Core Services)
Contexto responsável pelos dados mestres transversais a toda a organização, gestão de identidades e estrutura organizacional.

### Gestão de Acesso e Segurança (IAM)
#### Plataformas e Acesso
- [Done] Utilizacao de Acesso Cidadao (Sistema de Autenticacao)
- [Done] Ambiente de acesso dos Usuarios da FAPES
- [Done] Ambiente de acesso dos Pesquisadores da FAPES (separado do Funcionarios)
- [Done] Implementacao de conceitos, estruturas e linguagem utilizadas pela PRODEST
- [To Do ] Cadastro automtica de pessoas no Portal Fapes Front-office
- [To Do ] Cadastro automtica de pessoas no Portal Fapes Back-office usando API do Organograma do Governo.

### Gestão de Pessoas e Organizações
#### Gestão de Pessoa
- [Done] Cadastro do Pessoa
- [To Do] Suspender o Pessoa (FAPES)

#### Gestao de Instituições de Ensino (Fapes)
- [To Do] Cadastro de Instituições de Ensino e Pesquisa
- [To Do] Cadastro de Unidades Organizacionais das Instituições de Ensino e Pesquisa e hierarquia
- [To Do] Cadastro de Reitor, Diretores e Chefes de das Unidades Organizacionais
- [To Do] Dashboard de Iniciativas (Projetos, ICs, Recursos, Bolsas) por unidade organizacional

### Parâmetros Gerais
#### Gestao de Cadastros de Comuns (Fapes)
- [To Do] Casdastrar o Area Tecnica
- [To Do] Cadastro de Cidades
- [To Do] Cadastro de Regiões (Conjunto de Cidades)
- [To Do] Cadastro de Areas de Conhecimento (e.g. Ciencias Exatas e da Terra)
- [To Do] Rubricas Financeiras
- Gestao de Modalidade 
  - [Done] Cadastro de Requisitos de Niveis de Bolsa
  - [Done] Cadastro de Modalidade
  - [Done] Atualizar Valores
  - [Done] Refatorando
  - [Done] Cadastro de Modalidades (Bolsas/Niveis)
  - [Done] Cadastro de Resolucaoes (p/ Gestao das bolsas)
  - [Done] Cadastro Nivel

---

## Domínio: Planejamento e Estratégia
Contexto focado na definição de diretrizes, orçamentos macro e programas de fomento.

#### Gestao de Planejamento Estratégico (Fapes)
- [To Do] Casdastrar o Plano Estratégico
- [To Do] Casdastrar o Eixo Estratégico

#### Gestao do Programa (Fapes)
  - [To Do] Casdastrar o Programa 
  - [To Do] Associar a Eixo Estratégico
  - [To Do] Cadastro de Comitê Gestor 
  - [To Do] Adicionar Recursos Financeiros
  - [To Do] Visualizar Captações de Iniciativas
  - [To Do] Dashboard de Programas 

---

## Domínio: Fomento e Ciclo de Vida (Grant Management)
Core business da agência. Gerencia desde a captação (editais) até a execução e finalização das iniciativas.

### Contexto de Captação e Seleção (Pre-Award)
#### Gestão de Capitação de propostas de Iniciativas (Fapes)
  - [To Do] Dashboard do Processo seletivo
  - [To Do] Gestão de Templates de Formulários
    - [To Do] Template de Formulário de Avaliação de propostas de Iniciativas  
    - [To Do] Template de Formulário de Submissão de propostas de Iniciativas
  - [To Do] Gestão de Revisores Ad Hoc
  - [To Do] Gestão do Processo Capitação de Iniciativas de chamada publica ou demandas induzidas
    - [To Do] Configurar/Parametrizar o Processo de capitação de Iniciativas
    - [To Do] Instanciar o Processo de capitação de Iniciativas
      - [To Do] Associar a chamada publica ou demanda induzida a um programa
      - [To Do] Associar um documento com as regras (edital) ao processo
      - [To Do] Submeter Proposta de Iniciativas (Pesquisador)
      - [To Do] Avaliacao de Habilitacao
        - [To Do] Analisar a documentacao de habilitacao
      - [To Do] Avaliacao de Merito
        - [To Do] Identificar consultores ad hoc para analisar um projeto
        - [To Do] Receber avaliação dos consultores Ad Hoc
        - [To Do] Avaliar a qualidade da valiação dos consultores Ad Hoc (Revisor)
      - [To Do] Publicar Reultado  Intermediário
      - [To Do] Receber/responder solicitação de revisão  
      - [To Do] Publicar Resultado Final   
      - [To Do] Contratar Iniciativa 
        - [To Do] Gerar Termo de Outorga da Iniciativa (FAPES)
        - [To Do] Assinar Termo de Outorga da Iniciativa (Coordenador)
        - [To Do] Mudar o Status da Iniciativa para Contratada (FAPES)
        - [To Do] Abrir conta do projeto no banco (Coordenador)

### Contexto de Execução e Acompanhamento (Post-Award)
#### Gestao da Iniciativa Contratadas
  - [To Do] Dashboard de Iniciativas Contratadas 
    - [Doing] Dashboard de Iniciativas Contratadas (Coordenador)
    - [Doing] Dashboard de Iniciativas Contratadas (FAPES)
  - [To Do] Gestão de Resultados
    - [To Do] Solicitar mudanças de resultados do projeto  (Coordenador)
    - [To Do] Aprovar as  mudanças de resultados do projeto  (Fapes)
    - [To Do] Submição dos resultados do projeto  (Coordenador)
    - [To Do] Analisar os resultados do projeto (FAPES)
    - [To Do] Contestar Prestação de Contas (Coordenador)
  - [To Do] Gestão de Recursos
    - [To Do] Gestão de Orçamento
      - [To Do] Gestão da Adição do Projeto 
        - [To Do] Solicitar adição orçamentaria do projeto (Coordenador)
        - [To Do] Aprovar adição orçamentaria do projeto (FAPES)
        - [To Do] Cancelar adição orçamentaria do projeto (FAPES)
      - Gestão de Rubricas 
        - [To Do] Solicitar adição de um nova rubrica (Coordenador)
        - [To Do] Aprovar adição de um nova rubrica (FAPES)
        - [To Do] Cancelar adição de um nova rubrica (FAPES)
      - [To Do] Remanejamento Orçamento
        - [To Do] Remanejamento Orçamento (Coordenador)
        - [To Do] Aprovar Remanejamento Orçamento (FAPES)
        - [To Do] Visualizar Remanejamento Orçamento (FAPES)  
      - [To Do] Prestacao de Contas
        - [Done] Leitura do extrado bancario do projeto
        - [Doing] Submição da Prestação de Contas (Coordenador)
        - [To Do] Analisar a documentacao da prestacao de contas (FAPES)
        - [To Do] Contestar Prestação de Contas (Coordenador)
    - [To Do] Gestão de Bolsas  
      - [Done] Remanejar de Bolsa (Coordenador)
      - [Done] Visualizar Remanejamento de Bolsa (FAPES)
      - [Done] Gestão de Implementação de bolsa 
        - [Done] Solicitar bolsa (Mestrado, Doutorado, IC, Projetos) (Coordenador)
        - [Done] Submissão de documentos da Bolsa (Bolsista)
        - [Done] Aprovar solicitação de bolsa e documentos (FAPES)
        - [Done] Cancelar solicitação de bolsa (Coordenador)
        - [To Do] Supender solicitação de bolsa (Coordenador)
    - [To Do] Gestão de Equipe
      - [To Do] Gerir Voluntário (Coordenador)
      - [To Do] Gerir Gestor do Projeto (Coordenador)
    - [To Do] Suspender os Projetos
      - [To Do] Solicitar Suspender Projeto (Coordenador/FAPES)
      - [To Do] Aprovar solicitação Suspender Projeto (FAPES)
      - [To Do] Cancelar solicitação Suspender Projeto (Coordenador/FAPES)
      - [To Do] Supender Projeto (FAPES) 
    - [To Do] Finalizar o Projeto
      - [To Do] Solicitar Finalizar Projeto (Coordenador/FAPES)
      - [To Do] Aprovar solicitação Finalizar Projeto (FAPES)
      - [To Do] Cancelar solicitação Finalizar Projeto (Coordenador/FAPES)
      - [To Do] Finalizar Projeto (FAPES) 

---

## Domínio: Financeiro
Contexto responsável pela execução financeira, pagamentos e contabilidade.

#### Gestao Financeira
- [To Do] Cadastro de Contas-Contabeis
- [To Do] Associar Contas-Contabeis com Iniciativas, Programas e Editais e Orçamentos
- [To Do] Dashboard Contabil e Financeiro da Fapes

#### Gestao Pagamento
- [To Do] Dashboard de Pagamentos
- [Done] Gestao dos Marcos de Pagamento
- [To Do] Solicitar Pagamento
  - [To Do] Pagamento das Parcelas do Orçamento dos Projetos
  - [Done] Bolsas Padrao (Bolsa Seriada)
  - [To Do] Bolsas Unac (Bolsa não seriada) (Bolsa de Programa)
  - [To Do] Bolsas Mestrado e Doutorado (Bolsa de Programa)
  - [To Do] Pagamento de auxilios
  
- [Done] Aprovar pagamento de parcelas de bolsas de iniciativas
- [Done] Geração do documento de pagamento  para o Bandes  
- [To Do] Monitorar Folha de Pagamento
- [To Do] Servico de Gestao de Arquivos de Remessa e Retorno do Banestes (@-EDI)

---

## Domínio: Suporte e Inteligência
Serviços transversais de apoio, análise de dados e integrações legadas.

#### BI e Analise
- [To Do] BI (versao simplificada)
- [To Do] Analise de Resultados
- [To Do] Dashboard com dados dos projetos

#### Comunicação
- [Doing] Envio de email 

#### Gestão da Importação de Dados do Sigpesq
- [To Do] Servico de Importacao de Dados (SIGFAPES)
  - [To Do] Atualizar o Servico de Importacao de Dados (SIGFAPES)
- [To Do] Servico de Importacao de Dados (SIGFAPES)
