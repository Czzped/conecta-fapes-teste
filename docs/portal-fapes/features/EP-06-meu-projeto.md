# EP-06 — Meu Projeto

`Bounded Context:` Portal FAPES (Projetos) `Status:` Done `Dependências:` EP-01, EP-02

## Descrição

Apresentar a visão do projeto ou da bolsa do usuário conforme o papel exercido no projeto ativo, destacando resumo financeiro, orçamento e informações principais de acompanhamento.

## Critérios de aceite

- Coordenadores visualizam um resumo financeiro do projeto selecionado.
- Coordenadores visualizam itens orçamentários do projeto.
- Participantes visualizam a bolsa prioritária conforme status de relevância.
- A página trata estados de carregamento, erro e ausência de bolsa.
- O conteúdo exibido muda conforme o papel do usuário no projeto ativo.

## Casos de Uso

### Visualizar Meu Projeto como coordenador

```gherkin
Feature: Consultar Meu Projeto no papel de coordenador
  Como coordenador do projeto
  Quero visualizar o resumo financeiro do projeto ativo
  Para acompanhar orçamento e execução financeira

  Background:
    Given que estou autenticado
    And possuo um projeto ativo no cabeçalho

  Scenario: Exibir resumo financeiro
    Given que sou coordenador do projeto ativo
    When acesso "/meu-projeto"
    Then o sistema exibe o resumo financeiro do projeto
    And exibe os itens orçamentários vinculados ao projeto
```

### Visualizar Meu Projeto como participante

```gherkin
Feature: Consultar Minha Bolsa em Meu Projeto
  Como bolsista ou participante
  Quero visualizar minha bolsa principal
  Para acompanhar meu vínculo atual no portal

  Scenario: Exibir bolsa priorizada por status
    Given que possuo bolsas vinculadas ao meu usuário
    When acesso "/meu-projeto"
    Then o sistema seleciona a bolsa mais relevante por status
    And exibe o card correspondente

  Scenario: Exibir estado sem bolsa
    Given que não possuo bolsa disponível
    When acesso "/meu-projeto"
    Then o sistema exibe uma mensagem indicando ausência de bolsa
```
