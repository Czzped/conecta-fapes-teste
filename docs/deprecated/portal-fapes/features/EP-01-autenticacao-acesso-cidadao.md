> **Documento depreciado.** A documentacao canonica migrou para [products/portal-coordenador/features/](../../products/portal-coordenador/features/).

# EP-01 — Autenticação com Acesso Cidadão

`Bounded Context:` Identidade e Acesso `Status:` Done `Dependências:` Nenhuma

## Descrição

Permitir que usuários do Portal FAPES iniciem sessão por meio do Acesso Cidadão, concluam o callback de autenticação e acessem apenas áreas protegidas quando houver sessão válida.

## Critérios de aceite

- Usuários sem sessão são direcionados para `/login` ao tentar acessar áreas internas.
- A página de login disponibiliza a ação de entrada via Acesso Cidadão.
- O callback em `/login/AuthAcessoCidadao/portal` processa o retorno da autenticação e conclui a entrada no portal.
- Usuários já autenticados não permanecem na tela de login e são redirecionados para a home.
- O logout encerra a sessão e retorna o usuário ao fluxo de autenticação.

## Casos de Uso

### Iniciar login federado

```gherkin
Feature: Iniciar sessão no Portal FAPES
  Como visitante do portal
  Quero autenticar com Acesso Cidadão
  Para acessar as áreas protegidas do sistema

  Background:
    Given que estou sem sessão autenticada

  Scenario: Acessar a página de login
    When acesso "/login"
    Then o sistema exibe a tela de boas-vindas do portal
    And exibe a ação "Login com Acesso Cidadão"

  Scenario: Iniciar autenticação externa
    Given que estou na tela de login
    When aciono "Login com Acesso Cidadão"
    Then o sistema inicia o fluxo de autenticação externa
```

### Concluir callback e proteger rotas

```gherkin
Feature: Concluir sessão autenticada
  Como usuário autenticado
  Quero retornar do provedor de identidade com sessão válida
  Para navegar pelas áreas internas do portal

  Scenario: Processar callback do provedor
    Given que retornei do Acesso Cidadão
    When acesso "/login/AuthAcessoCidadao/portal"
    Then o sistema processa os dados do usuário
    And conclui a autenticação no frontend

  Scenario: Bloquear rota protegida sem sessão
    Given que não possuo sessão válida
    When tento acessar uma rota interna do portal
    Then o sistema me redireciona para "login"
```
