# EP-01 — Cadastro e Gestão de Aplicações

**Bounded Context:** Aplicacoes
**Status:** Done
**Dependências:** Nenhuma

## Descrição

Permitir que operadores possam cadastrar, visualizar, editar e excluir aplicações para fins de organização interna do sistema. O épico garante que as aplicações estejam disponíveis como base para integrações e configurações do ConectaFapes.

## Critérios de aceite

- Operadores podem criar, visualizar, editar e excluir aplicações.
- Cada aplicação possui um Nome e uma Descrição obrigatórios.
- O sistema registra automaticamente o usuário e horário da criação e atualização.
- Exclusão é feita via soft delete (registro de data de exclusão).
- Consultas suportam OData com paginação (PageSize=25) e profundidade máxima de expansão 3.
- Todas as operações requerem autenticação JWT Bearer.

---

## Casos de Uso

### Cadastrar e Gerenciar Aplicações

```gherkin
Feature: Cadastrar e Gerenciar Aplicações
  Como operador do ConectaFapes
  Quero cadastrar, editar e excluir aplicações
  Para organizar e controlar as aplicações internas do sistema

  Background:
    Given que estou autenticado como usuário com token JWT válido

  Scenario: Criar aplicação com dados válidos
    When crio uma aplicação com:
      | Campo     | Valor                          |
      | Nome      | "Aplicação de Bolsas"          |
      | Descricao | "Gestão de bolsas acadêmicas"  |
    Then o registro é criado com status ativo
    And o sistema registra o usuário e horário da criação

  Scenario: Impedir criação sem nome
    When tento criar uma aplicação sem informar o Nome
    Then o sistema retorna erro de validação "O nome da aplicação é obrigatório."

  Scenario: Impedir criação sem descrição
    When tento criar uma aplicação sem informar a Descrição
    Then o sistema retorna erro de validação "A descrição da aplicação é obrigatória."

  Scenario: Listar todas as aplicações com paginação OData
    When consulto todas as aplicações
    Then o sistema retorna uma lista paginada com PageSize=25
    And suporta filtros, ordenação e expansão OData com profundidade máxima 3

  Scenario: Buscar aplicação por ID
    Given existe uma aplicação cadastrada com Id válido
    When consulto a aplicação pelo Id
    Then o sistema retorna os dados completos da aplicação

  Scenario: Atualizar aplicação existente
    Given existe uma aplicação cadastrada
    When atualizo o Nome e a Descrição da aplicação
    Then os dados são atualizados com sucesso
    And o sistema registra o horário da atualização

  Scenario: Excluir aplicação (soft delete)
    Given existe uma aplicação cadastrada
    When excluo a aplicação
    Then o sistema registra a data de exclusão (soft delete)
    And a aplicação não aparece mais nas consultas padrão
```
