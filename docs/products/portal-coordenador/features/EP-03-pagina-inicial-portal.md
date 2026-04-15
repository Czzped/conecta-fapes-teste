# EP-03 — Página Inicial do Portal

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M003, M009 |
| **Produto** | Portal Coordenador |

`Bounded Context:` Portal FAPES (Home) `Status:` Partial `Dependências:` EP-01, EP-02

## Descrição

Oferecer uma página inicial com visão resumida do projeto ativo para coordenadores, exibição das bolsas relevantes do usuário e um espaço de notificações do portal.

## Critérios de aceite

- Coordenadores visualizam um card consolidado do projeto na home.
- Usuários com bolsas ativas ou com documentação pendente visualizam cards de bolsa na home.
- A home carrega os dados do dashboard e exibe indicador de carregamento enquanto busca informações.
- O bloco de notificações existe visualmente e já exibe um card estático.
- O fluxo de notificações ainda não está ligado a eventos reais do backend.

## Casos de Uso

### Consultar visão inicial do portal

```gherkin
Feature: Visualizar home do Portal FAPES
  Como usuário autenticado
  Quero abrir a página inicial do portal
  Para consultar um resumo rápido do meu contexto atual

  Background:
    Given que possuo sessão ativa e um projeto selecionado

  Scenario: Coordenador visualiza resumo do projeto
    Given que sou coordenador do projeto ativo
    When acesso a home
    Then o sistema exibe o card consolidado do projeto

  Scenario: Participante visualiza suas bolsas ativas
    Given que possuo bolsas com status visível
    When acesso a home
    Then o sistema lista as bolsas ativas ou com documentação pendente
```

### Consultar notificações disponíveis

```gherkin
Feature: Exibir notificações da home
  Como usuário autenticado
  Quero consultar mensagens do portal na página inicial
  Para ter visibilidade rápida de ocorrências relevantes

  Scenario: Exibir bloco de notificações
    When acesso a home
    Then o sistema exibe a seção de notificações
    And apresenta ao menos um card visual no layout atual
```
