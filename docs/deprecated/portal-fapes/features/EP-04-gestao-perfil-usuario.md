> **Documento depreciado.** A documentacao canonica migrou para [products/portal-coordenador/features/](../../products/portal-coordenador/features/).

# EP-04 — Gestão de Perfil do Usuário

`Bounded Context:` Portal FAPES (Perfil) `Status:` Done `Dependências:` EP-01, EP-02

## Descrição

Permitir que usuários autenticados consultem e atualizem seus dados pessoais, sociais, acadêmicos, residenciais, profissionais e bancários, mantendo o cadastro necessário para operação no portal.

## Critérios de aceite

- O usuário pode acessar a aba `Meus Dados` em `Minhas Informações`.
- Dados pessoais essenciais como nome, CPF e email são exibidos e campos editáveis podem ser atualizados.
- O formulário permite gerenciar nome social, contatos e currículo Lattes.
- O usuário pode informar endereço residencial e, quando necessário, um endereço profissional distinto.
- O cadastro bancário considera regras específicas para contas Banestes e janelas de edição.
- O formulário oferece salvamento com validação e estado de submissão.

## Casos de Uso

### Atualizar dados cadastrais

```gherkin
Feature: Manter cadastro do usuário
  Como usuário autenticado
  Quero atualizar meus dados pessoais e acadêmicos
  Para manter meu perfil completo e atualizado no Portal FAPES

  Background:
    Given que estou autenticado
    And acesso "/minhas-informacoes?tab=meus-dados"

  Scenario: Atualizar dados pessoais básicos
    When informo celular, gênero, raça, currículo Lattes e nível acadêmico
    And salvo o formulário
    Then o sistema valida os dados preenchidos
    And persiste a atualização do perfil

  Scenario: Informar nome social
    When habilito a opção de nome social
    And preencho o nome social
    Then o sistema permite incluir esse dado no cadastro
```

### Gerenciar endereços e dados bancários

```gherkin
Feature: Manter endereços e dados bancários
  Como usuário autenticado
  Quero atualizar meus endereços e dados Banestes
  Para garantir conformidade cadastral e pagamento correto

  Scenario: Informar endereço profissional distinto
    Given que meu endereço profissional é diferente do residencial
    When habilito a opção correspondente
    Then o sistema exibe os campos adicionais de endereço profissional

  Scenario: Atualizar dados bancários Banestes
    Given que possuo conta Banestes
    When preencho agência e conta dentro da janela permitida
    Then o sistema aceita a atualização dos dados bancários
```
