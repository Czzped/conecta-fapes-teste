# EP-05 — Importação e Gestão de Editais

**Bounded Context:** ImportacaoEditais
**Status:** Done
**Dependências:** EP-02 (CadastroModalidadesBolsas)

## Descrição

Permitir que operadores possam importar editais, projetos e alocações de bolsistas a partir do sistema externo SIGFAPES, gerenciando o ciclo completo de dados relacionados a editais de fomento. O épico garante que todas as entidades (editais, projetos, pessoas, alocações, dados bancários, documentos, etc.) estejam disponíveis como base para a gestão de bolsas.

## Critérios de aceite

- Operadores podem importar editais do SIGFAPES e definir a área técnica responsável.
- Projetos são importados com seus coordenadores, planejamentos e alocações.
- Alocações de bolsistas seguem um ciclo de vida com múltiplos estados.
- O sistema resolve automaticamente a versão de nível de bolsa (VersaoNivel) com base na modalidade, valor e flag de redução.
- Matrículas são geradas automaticamente e são únicas no sistema.
- Integração com sistema de pagamento externo para histórico e geração de cotas.
- Cada entidade importada mantém referência ao IdSigfapes original.
- Dados pessoais (endereço, telefone, documentos, dados bancários, naturalidade) são importados e gerenciados.
- Listagens de editais, projetos e alocações suportam paginação.

---

## Casos de Uso

### Importar e Gerenciar Editais

```gherkin
Feature: Importar e Gerenciar Editais
  Como operador da FAPES
  Quero importar e gerenciar editais do SIGFAPES
  Para organizar os editais de fomento no sistema

  Background:
    Given que estou autenticado como usuário com papel "OPERADOR"

  Scenario: Criar edital com dados válidos
    When crio um edital com:
      | Campo                  | Valor                        |
      | Nome                   | "Edital FAPES 01/2024"       |
      | DataCriacao            | "2024-01-01"                 |
      | IdSigfapes             | 12345                        |
      | NumeroProcessoPagamento| "2024.001"                   |
    Then o edital é criado com StatusImportacao "NAOIMPORTAR"
    And o StatusEdital é "ATIVO"

  Scenario: Marcar edital para importação com área técnica
    Given existe um edital com StatusImportacao "NAOIMPORTAR"
    When marco o edital para importação com AreaTecnicaId válido
    Then o StatusImportacao muda para "AIMPORTAR"
    And a AreaTecnica é associada ao edital

  Scenario: Finalizar importação do edital
    Given existe um edital com StatusImportacao "AIMPORTAR"
    When a importação é concluída
    Then o StatusImportacao muda para "IMPORTADO"
    And a data de última sincronização é registrada

  Scenario: Listar editais com paginação
    When consulto a lista de editais
    Then o sistema retorna uma lista paginada incluindo a AreaTecnica

  Scenario: Sincronizar edital
    Given existe um edital importado
    When sincronizo o edital
    Then a data de última sincronização é atualizada
```

### Gerenciar Projetos

```gherkin
Feature: Gerenciar Projetos de Editais
  Como operador da FAPES
  Quero gerenciar projetos vinculados a editais
  Para controlar os projetos de pesquisa e suas alocações

  Background:
    Given que estou autenticado como usuário com papel "OPERADOR"

  Scenario: Criar projeto com dados válidos
    When crio um projeto com:
      | Campo                    | Valor                     |
      | Nome                     | "Pesquisa em IA"          |
      | DataInicio               | "2024-02-01"              |
      | DataFimPrevistaAtividade | "2025-02-01"              |
      | EditalId                 | <guid-edital-válido>      |
      | OrcamentoTotal           | 500000.00                 |
    Then o projeto é criado com sucesso
    And o StatusPreenchimento é "INCOMPLETO"

  Scenario: Impedir data fim anterior a data início
    When tento criar projeto com DataFimPrevistaAtividade anterior a DataInicio
    Then o sistema retorna erro de validação

  Scenario: Impedir IdSigfapes duplicado
    Given já existe um projeto com IdSigfapes 67890
    When tento criar outro projeto com o mesmo IdSigfapes
    Then o sistema retorna erro de unicidade

  Scenario: Completar projeto
    Given todos os bolsistas do projeto possuem cotas pagas preenchidas
    When o sistema verifica a completude
    Then o projeto é marcado como AlocacoesCompletas = true

  Scenario: Listar projetos com paginação
    When consulto a lista de projetos
    Then o sistema retorna lista paginada incluindo Coordenadores e Pessoas

  Scenario: Atualização parcial de projeto
    Given existe um projeto cadastrado
    When atualizo parcialmente o status do projeto
    Then apenas os campos informados são atualizados

  Scenario: Substituir projeto por IdSigfapes
    Given existe um projeto de origem com IdSigfapes 12345
    And existe um projeto de destino com IdSigfapes 67890
    And o projeto de origem possui alocações de bolsistas
    When substituo o projeto informando:
      | Campo            | Valor |
      | IdSigfapesOrigem | 12345 |
      | IdSigfapesDestino| 67890 |
    Then todas as alocações de bolsistas do projeto de origem são transferidas para o projeto de destino
    And a DataUpdated de cada alocação é atualizada

  Scenario: Impedir substituição com projeto de origem inexistente
    Given não existe projeto com IdSigfapes 99999
    When tento substituir informando IdSigfapesOrigem 99999
    Then o sistema retorna erro "Projeto não encontrado"

  Scenario: Impedir substituição com projeto de destino inexistente
    Given existe um projeto com IdSigfapes 12345
    And não existe projeto com IdSigfapes 99999
    When tento substituir informando IdSigfapesDestino 99999
    Then o sistema retorna erro "Projeto não encontrado"

  Scenario: Impedir substituição quando origem e destino são iguais
    When tento substituir com IdSigfapesOrigem e IdSigfapesDestino iguais
    Then o sistema retorna erro "O projeto de origem e destino não podem ser o mesmo"

  Scenario: Impedir substituição com IdSigfapes inválido
    When tento substituir com IdSigfapesOrigem ou IdSigfapesDestino menor ou igual a 0
    Then o sistema retorna erro de validação
```

### Gerenciar Coordenação de Projetos

```gherkin
Feature: Gerenciar Coordenação de Projetos
  Como operador da FAPES
  Quero gerenciar a coordenação dos projetos
  Para controlar quem é o responsável atual por cada projeto

  Scenario: Atribuir coordenador ao projeto
    When atribuo um coordenador ao projeto com:
      | Campo            | Valor                  |
      | PessoaId         | <guid-pessoa-válido>   |
      | ProjetoId        | <guid-projeto-válido>  |
      | DataInicio       | "2024-02-01"           |
      | CoordenadorAtual | true                   |
    Then o coordenador é associado ao projeto
    And o coordenador anterior (se existir) é desativado com DataFim preenchida

  Scenario: Substituir coordenador atual
    Given existe um coordenador atual para o projeto
    When atribuo um novo coordenador
    Then o anterior tem CoordenadorAtual = false e DataFim preenchida
    And o novo coordenador tem CoordenadorAtual = true

  Scenario: Manter histórico de coordenadores
    Given um projeto teve 3 coordenadores ao longo do tempo
    When consulto o projeto
    Then vejo todos os coordenadores com suas datas de início e fim
```

### Importar e Gerenciar Alocações de Bolsistas

```gherkin
Feature: Importar e Gerenciar Alocações de Bolsistas
  Como operador da FAPES
  Quero importar e gerenciar alocações de bolsistas
  Para controlar a concessão de bolsas em projetos

  Background:
    Given que estou autenticado como usuário autorizado

  Scenario: Importar alocação de bolsista
    When importo uma alocação com dados do SIGFAPES incluindo:
      | Campo              | Valor                          |
      | ModalidadeBolsa    | "PG-M"                         |
      | ValorBolsa         | 2000.00                        |
      | PossuiReducaoBolsa | false                          |
      | PessoaId           | <guid-pessoa>                  |
      | ProjetoId          | <guid-projeto>                 |
    Then o sistema resolve a VersaoNivel pela Sigla da modalidade e valor
    And a alocação é criada com Matrícula gerada automaticamente
    And o histórico de pagamento é importado via API externa
    And as cotas de pagamento são geradas (se status não for FINALIZADA/CANCELADA/REPROVADA)

  Scenario: Resolver VersaoNivel com redução de bolsa
    Given a modalidade "PG-M" tem valor base 2000.00
    When importo uma alocação com PossuiReducaoBolsa = true
    Then o sistema busca VersaoNivel com valor = 1200.00 (60% do valor base)
    And a sigla da modalidade é identificada pelo sufixo "%" 

  Scenario: Aprovar bolsa
    Given existe uma alocação com status "EM_AVALIACAO", "DOCUMENTACAO_PENDENTE" ou "AGUARDANDO_ACEITES"
    And estou autenticado como administrador
    When aprovo a bolsa
    Then o status muda para "ATIVA"
    And o MesAprovacao é registrado com o mês/ano atual

  Scenario: Impedir aprovação de bolsa já ativa
    Given existe uma alocação com status "ATIVA"
    When tento aprovar a bolsa
    Then o sistema retorna erro "A bolsa já está aprovada"

  Scenario: Impedir aprovação de bolsa em status inválido
    Given existe uma alocação com status "SUSPENSA" ou "CANCELADA"
    When tento aprovar a bolsa
    Then o sistema retorna erro "A bolsa deve estar em avaliação, com documentação pendente ou aguardando aceites para que seja aprovada"

  Scenario: Impedir aprovação sem permissão de administrador
    Given estou autenticado como usuário sem papel "ADMIN"
    When tento aprovar uma bolsa
    Then o sistema retorna erro de permissão (403 Forbidden)

  Scenario: Ativar bolsa
    Given existe uma alocação com status "EM_AVALIACAO" ou "SUSPENSA"
    When ativo a bolsa
    Then o status muda para "ATIVA"

  Scenario: Suspender bolsa
    Given existe uma alocação com status "ATIVA"
    When suspendo a bolsa
    Then o status muda para "SUSPENSA"

  Scenario: Cancelar bolsa com justificativa
    Given existe uma alocação com status "ATIVA" ou "SUSPENSA"
    When cancelo a bolsa com justificativa e data de fim
    Then o status muda para "CANCELADA"
    And a DataFimAtividade é registrada

  Scenario: Reprovar bolsa com justificativa
    Given existe uma alocação com status "EM_AVALIACAO", "DOCUMENTACAO_PENDENTE" ou "AGUARDANDO_ACEITES"
    When reprovo a bolsa com justificativa
    Then o status muda para "REPROVADA"

  Scenario: Finalizar bolsa automaticamente
    Given a data atual é posterior à DataFimPrevistaAtividade
    When o sistema verifica a alocação
    Then o status muda para "FINALIZADA"

  Scenario: Reverter importação com falha
    Given ocorreu um erro durante a importação de uma alocação
    When o sistema detecta a falha
    Then a alocação criada é excluída (rollback)

  Scenario: Atualizar cotas pagas
    Given existe uma alocação ativa
    When atualizo as cotas pagas
    Then QtdeCotasPagas não pode exceder QtdeCotasAlocadas

  Scenario: Listar alocações com paginação
    When consulto a lista de alocações
    Then o sistema retorna lista paginada

  Scenario: Listar alocações simplificado
    When consulto a lista simplificada de alocações
    Then o sistema retorna dados básicos: DataInicio, DataPrevistaFimAtividade, DataFimAtividade, PossuiReducaoBolsa, QtdeCotasAlocadas, QtdeCotasPagasPreImportacao, IdSigfapes e Matricula
    And a resposta não inclui dados expandidos de Projeto, Pessoa ou Pagamentos
```

### Gerenciar Pessoas (Bolsistas)

```gherkin
Feature: Gerenciar Dados de Pessoas
  Como operador da FAPES
  Quero gerenciar dados cadastrais dos bolsistas
  Para manter informações pessoais atualizadas

  Scenario: Criar pessoa com dados completos
    When crio uma pessoa com:
      | Campo           | Valor                  |
      | Nome            | "Maria da Silva"       |
      | Cpf             | "98765432100"          |
      | Email           | "maria@email.com"      |
      | DataNascimento  | "1990-05-15"           |
      | EstadoCivil     | "Solteira"             |
      | Sexo            | "Feminino"             |
      | NivelAcademico  | "Mestrado"             |
    Then a pessoa é criada com sucesso

  Scenario: Impedir CPF duplicado
    Given já existe uma pessoa com CPF "98765432100"
    When tento criar outra pessoa com o mesmo CPF
    Then o sistema retorna erro de unicidade

  Scenario: Listar pessoas simplificado
    When consulto a lista simplificada de pessoas
    Then o sistema retorna dados básicos: IdSigfapes, Nome e Cpf
```

### Gerenciar Dados Bancários

```gherkin
Feature: Gerenciar Dados Bancários
  Como operador da FAPES
  Quero gerenciar dados bancários dos bolsistas
  Para viabilizar o pagamento das bolsas

  Scenario: Cadastrar dados bancários
    When cadastro dados bancários com:
      | Campo    | Valor                |
      | Conta    | "12345-6"            |
      | Agencia  | "0001"               |
      | BancoId  | <guid-banco-válido>  |
      | PessoaId | <guid-pessoa-válida> |
    Then os dados bancários são criados com sucesso

  Scenario: Atualizar dados bancários com regeneração de matrícula
    Given existe dados bancários cadastrados para uma pessoa
    And a pessoa possui alocações ativas
    When atualizo os dados bancários
    Then as matrículas das alocações ativas são regeneradas
    And o StatusCadastroBaneste muda para "PENDENTE"
    And cada matrícula gerada é única no sistema
```

### Gerenciar Planejamento de Alocação

```gherkin
Feature: Gerenciar Planejamento de Alocação
  Como operador da FAPES
  Quero gerenciar o planejamento orçamentário das alocações
  Para controlar a distribuição de recursos por projeto

  Scenario: Criar planejamento de alocação
    When crio um planejamento com:
      | Campo          | Valor                  |
      | Data           | "2024-01-01"           |
      | OrcamentoBolsa | 100000.00              |
      | ProjetoId      | <guid-projeto-válido>  |
    Then o planejamento é criado com sucesso

  Scenario: Importar planejamento por nível
    When importo um planejamento por nível com:
      | Campo               | Valor                       |
      | QuantidadeMeses     | 12                          |
      | QuantidadeBolsistas | 5                           |
      | VersaoNivelId       | <guid-versão-nível-válido>  |
    Then o planejamento de nível é criado
    And o total calculado é QuantidadeBolsistas x QuantidadeMeses
```

### Entidades de Suporte

```gherkin
Feature: Gerenciar Entidades de Suporte
  Como operador da FAPES
  Quero gerenciar entidades auxiliares
  Para manter os dados cadastrais completos

  Scenario: Gerenciar Áreas Técnicas
    When crio/edito/excluo uma Área Técnica com Nome e Descrição
    Then a operação CRUD é executada com sucesso
    And a área pode ser associada a editais

  Scenario: Gerenciar Atividades
    When crio/edito/excluo uma Atividade com Nome e Código
    Then a operação CRUD é executada com sucesso

  Scenario: Gerenciar Bancos
    When crio/edito/excluo um Banco com Nome e Código
    Then a operação CRUD é executada com sucesso

  Scenario: Gerenciar Documentos de Pessoa
    When crio/edito/excluo um Documento com Número, TipoDocumento, UfOrgaoEmissor e DataEmissão
    Then a operação CRUD é executada com sucesso

  Scenario: Gerenciar Endereços
    When crio/edito/excluo um Endereço com Logradouro, Número, CEP, Município e UF
    Then a operação CRUD é executada com sucesso

  Scenario: Gerenciar Telefones
    When crio/edito/excluo um Telefone com Número, TipoTelefone e flag EhAtual
    Then a operação CRUD é executada com sucesso

  Scenario: Gerenciar Naturalidade
    When crio/edito/excluo uma Naturalidade com Cidade e UF
    Then a operação CRUD é executada com sucesso
    And é vinculada 1:1 com Pessoa
```
