> **Documento depreciado.** A documentacao canonica migrou para [products/portal-coordenador/features/](../../products/portal-coordenador/features/).

# EP-02 — Shell do Portal e Contexto do Projeto

`Bounded Context:` Portal FAPES (Navegação) `Status:` Partial `Dependências:` EP-01

## Descrição

Organizar a navegação transversal do portal, incluindo seleção do projeto ativo, menu contextual por perfil, troca de idioma, alternância de tema, acesso rápido ao perfil e notificações no cabeçalho.

## Critérios de aceite

- O cabeçalho permite selecionar o projeto ativo que define o contexto das consultas do portal.
- O menu lateral oculta áreas exclusivas de coordenação quando o usuário não é coordenador do projeto.
- O usuário pode alternar idioma entre `pt-BR` e `en`.
- O shell permite alternar entre tema claro e escuro.
- O menu do usuário oferece acesso rápido a `Minhas Informações` e logout.
- O sino de notificações já existe na interface, mas ainda não está conectado a eventos reais do sistema.

## Casos de Uso

### Definir contexto do projeto

```gherkin
Feature: Selecionar projeto ativo
  Como usuário autenticado
  Quero escolher o projeto corrente
  Para navegar no portal com dados do projeto correto

  Background:
    Given que possuo sessão autenticada no portal

  Scenario: Selecionar projeto pelo cabeçalho
    When escolho um projeto na lista do cabeçalho
    Then o projeto selecionado passa a ser o contexto ativo do portal
    And as páginas dependentes utilizam esse contexto nas consultas

  Scenario: Exibir nome do projeto selecionado
    Given que já escolhi um projeto
    When visualizo o cabeçalho
    Then o sistema exibe o nome do projeto atualmente selecionado
```

### Adaptar navegação ao perfil

```gherkin
Feature: Navegação contextual do shell
  Como usuário do Portal FAPES
  Quero ver apenas as áreas compatíveis com meu papel no projeto
  Para acessar o que é permitido no contexto atual

  Scenario: Exibir menu reduzido para não coordenador
    Given que não sou coordenador do projeto ativo
    When visualizo o menu lateral
    Then o sistema oculta as rotas de coordenação

  Scenario: Acessar ações transversais do cabeçalho
    Given que estou autenticado
    When utilizo os controles do cabeçalho
    Then posso trocar idioma, alternar tema e abrir o menu do usuário
```
