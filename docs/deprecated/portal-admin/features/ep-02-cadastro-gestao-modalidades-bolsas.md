# EP-02 — Cadastro e Gestão de Modalidades de Bolsas

**Bounded Context:** CadastroModalidadesBolsas
**Status:** Done
**Dependências:** Nenhuma

## Descrição

Permitir que operadores possam cadastrar, versionar e gerenciar modalidades de bolsas acadêmicas, incluindo seus níveis, valores, moedas, resoluções e requisitos. O épico garante que as modalidades estejam disponíveis como base para alocação de bolsistas em editais e projetos.

## Critérios de aceite

- Operadores podem criar, visualizar, editar e inativar modalidades de bolsa.
- Cada modalidade possui uma Sigla (única, até 10 caracteres, uppercase) e um Nome (único, até 100 caracteres).
- Modalidades são versionadas com controle de ciclo de vida: EM_EDICAO → ATIVA → INATIVA.
- Somente versões em estado EM_EDICAO podem ser editadas ou excluídas.
- Cada versão possui níveis de bolsa com valores em moedas específicas.
- Requisitos podem ser associados a versões de modalidade e versões de nível.
- Resoluções fornecem a base legal para as versões de modalidade.
- Ao criar uma nova versão, requisitos e níveis da versão ativa anterior são copiados automaticamente.

---

## Casos de Uso

### Cadastrar e Gerenciar Modalidade de Bolsa

```gherkin
Feature: Cadastrar e Gerenciar Modalidade de Bolsa
  Como operador da FAPES
  Quero cadastrar, editar e inativar modalidades de bolsa
  Para definir os tipos de bolsa disponíveis no sistema

  Background:
    Given que estou autenticado como usuário com papel "OPERADOR"

  Scenario: Criar modalidade de bolsa com dados válidos
    When crio uma modalidade de bolsa com:
      | Campo | Valor       |
      | Sigla | "PG-M"      |
      | Nome  | "Mestrado"  |
    Then o registro é criado com sucesso
    And a Sigla é convertida para UPPERCASE

  Scenario: Impedir criação com Sigla duplicada
    Given já existe uma modalidade com Sigla "PG-M"
    When tento criar outra modalidade com a mesma Sigla
    Then o sistema retorna erro "Já existe um registro com esta sigla"

  Scenario: Impedir criação com Nome duplicado
    Given já existe uma modalidade com Nome "Mestrado"
    When tento criar outra modalidade com o mesmo Nome
    Then o sistema retorna erro "Já existe um registro com este nome"

  Scenario: Impedir edição de Sigla/Nome com múltiplas versões
    Given existe uma modalidade com mais de uma versão
    When tento alterar o Nome ou Sigla da modalidade
    Then o sistema retorna erro de restrição

  Scenario: Excluir modalidade sem versões
    Given existe uma modalidade sem versões associadas
    When excluo a modalidade
    Then o registro é removido com sucesso

  Scenario: Impedir exclusão de modalidade com versões
    Given existe uma modalidade com versões associadas
    When tento excluir a modalidade
    Then o sistema retorna erro "Não é possível excluir modalidade com versões"
```

### Gerenciar Versões de Modalidade

```gherkin
Feature: Gerenciar Versões de Modalidade
  Como operador da FAPES
  Quero criar e gerenciar versões de modalidades de bolsa
  Para controlar a vigência temporal e regras de cada modalidade

  Background:
    Given que estou autenticado como usuário com papel "OPERADOR"

  Scenario: Criar versão de modalidade
    When crio uma versão de modalidade com:
      | Campo              | Valor                    |
      | Descricao          | "Versão 2024 Mestrado"   |
      | DataInicioVigencia | "2024-01-01"             |
      | ReducaoPorVinculo  | 1.0                      |
      | ResolucaoId        | <guid-resolução-válida>  |
      | ModalidadeBolsaId  | <guid-modalidade-válida> |
    Then a versão é criada com estado "EM_EDICAO"
    And a Sigla é auto-gerada como "{SiglaModalidade}-{Ano}" se não informada
    And requisitos e níveis da versão ativa anterior são copiados automaticamente

  Scenario: Impedir criação com versão EM_EDICAO existente
    Given já existe uma versão em estado EM_EDICAO para a modalidade
    When tento criar outra versão
    Then o sistema retorna erro "Já existe uma versão em edição"

  Scenario: Impedir criação com data anterior à versão ativa
    Given existe uma versão ativa com DataInicioVigencia "2024-01-01"
    When tento criar uma nova versão com DataInicioVigencia "2023-06-01"
    Then o sistema retorna erro "Data de início deve ser posterior à versão ativa"

  Scenario: Ativar versão de modalidade
    Given existe uma versão com estado "EM_EDICAO"
    When ativo a versão
    Then a versão muda para estado "ATIVA"
    And a versão ativa anterior muda para "INATIVA" com DataFimVigencia preenchida

  Scenario: Desativar versão de modalidade
    Given existe uma versão com estado "ATIVA"
    When desativo a versão
    Then a versão muda para estado "INATIVA"
    And a DataFimVigencia é preenchida com a data atual

  Scenario: Editar versão em edição
    Given existe uma versão com estado "EM_EDICAO"
    When edito a Descrição e ReducaoPorVinculo
    Then os dados são atualizados com sucesso

  Scenario: Impedir edição de versão não em edição
    Given existe uma versão com estado "ATIVA"
    When tento editar a versão
    Then o sistema retorna erro "Somente versões em edição podem ser alteradas"

  Scenario: Excluir versão em edição
    Given existe uma versão com estado "EM_EDICAO"
    When excluo a versão
    Then a versão é removida
    And níveis órfãos são excluídos em cascata
```

### Gerenciar Níveis de Bolsa e Valores

```gherkin
Feature: Gerenciar Níveis de Bolsa e Valores
  Como operador da FAPES
  Quero cadastrar níveis de bolsa e associar valores em moedas às versões
  Para definir os montantes pagos por nível em cada modalidade

  Background:
    Given que estou autenticado como usuário com papel "OPERADOR"

  Scenario: Criar nível de bolsa
    When crio um nível de bolsa com:
      | Campo | Valor  |
      | Sigla | "N1"   |
    Then o nível é criado com sucesso
    And a Sigla é convertida para UPPERCASE

  Scenario: Impedir criação com Sigla duplicada
    Given já existe um nível com Sigla "N1"
    When tento criar outro nível com a mesma Sigla
    Then o sistema retorna erro "Já existe um nível com esta sigla"

  Scenario: Associar nível a versão de modalidade (VersaoNivel)
    When associo um nível à versão de modalidade com:
      | Campo              | Valor                          |
      | Valor              | 2000.00                        |
      | NivelBolsaId       | <guid-nível-válido>            |
      | VersaoModalidadeId | <guid-versão-válida>           |
      | MoedaId            | <guid-moeda-válida>            |
    Then a associação é criada com sucesso

  Scenario: Impedir associação de nível duplicado na mesma versão
    Given a versão já possui o nível "N1"
    When tento associar "N1" novamente à mesma versão
    Then o sistema retorna erro "Nível já associado a esta versão"

  Scenario: Impedir valor menor ou igual a zero
    When tento criar VersaoNivel com Valor 0
    Then o sistema retorna erro de validação "Valor deve ser maior que zero"
```

### Gerenciar Moedas

```gherkin
Feature: Gerenciar Moedas
  Como operador da FAPES
  Quero cadastrar moedas
  Para definir a unidade monetária dos valores de bolsa

  Background:
    Given que estou autenticado como usuário com papel "OPERADOR"

  Scenario: Criar moeda com dados válidos
    When crio uma moeda com:
      | Campo   | Valor   |
      | Simbolo | "BRL"   |
      | Nome    | "REAL"  |
    Then a moeda é criada com sucesso
    And o Nome é convertido para UPPERCASE

  Scenario: Impedir criação com Símbolo duplicado
    Given já existe uma moeda com Símbolo "BRL"
    When tento criar outra moeda com o mesmo Símbolo
    Then o sistema retorna erro "Já existe uma moeda com este símbolo"

  Scenario: Impedir criação com Nome duplicado
    Given já existe uma moeda com Nome "REAL"
    When tento criar outra moeda com o mesmo Nome
    Then o sistema retorna erro "Já existe uma moeda com este nome"
```

### Gerenciar Resoluções

```gherkin
Feature: Gerenciar Resoluções
  Como operador da FAPES
  Quero cadastrar resoluções institucionais
  Para fornecer a base legal das modalidades de bolsa

  Background:
    Given que estou autenticado como usuário com papel "OPERADOR"

  Scenario: Criar resolução com dados válidos
    When crio uma resolução com:
      | Campo            | Valor                               |
      | Numero           | 123                                 |
      | Data             | "2024-01-15"                        |
      | Ementa           | "Dispõe sobre bolsas de mestrado"   |
      | Link             | "https://fapes.es.gov.br/res/123"   |
      | NumRastreioEdocs | "2024E-ABC123"                      |
    Then a resolução é criada com sucesso

  Scenario: Impedir criação com Número duplicado
    Given já existe uma resolução com Número 123
    When tento criar outra resolução com o mesmo Número
    Then o sistema retorna erro "Já existe uma resolução com este número"

  Scenario: Impedir exclusão de resolução com versões vinculadas
    Given existe uma resolução vinculada a versões de modalidade
    When tento excluir a resolução
    Then o sistema retorna erro "Não é possível excluir resolução com modalidades vinculadas"
```

### Gerenciar Requisitos de Bolsa

```gherkin
Feature: Gerenciar Requisitos de Bolsa
  Como operador da FAPES
  Quero cadastrar requisitos de bolsa
  Para definir os documentos e condições exigidos dos bolsistas

  Background:
    Given que estou autenticado como usuário com papel "OPERADOR"

  Scenario: Criar requisito de bolsa
    When crio um requisito com:
      | Campo              | Valor                    |
      | Tipo               | "Diploma"                |
      | Descricao          | "Diploma de graduação"   |
      | PossuiComprovante  | true                     |
      | Comprovante        | "PDF do diploma"         |
      | EhComprovantePerene| true                     |
    Then o requisito é criado com sucesso

  Scenario: Impedir criação sem Tipo
    When tento criar um requisito sem informar o Tipo
    Then o sistema retorna erro de validação "Tipo é obrigatório"

  Scenario: Associar requisito a versão de modalidade
    Given existe um requisito e uma versão de modalidade em edição
    When associo o requisito à versão
    Then a associação é criada via RequisitoVersao

  Scenario: Associar requisito a versão de nível
    Given existe um requisito e uma versão de nível
    When associo o requisito à versão de nível
    Then a associação é criada via RequisitoVersao

  Scenario: Remover requisito de versão
    Given existe um requisito associado a uma versão
    When removo a associação
    Then o RequisitoVersao é excluído
```
