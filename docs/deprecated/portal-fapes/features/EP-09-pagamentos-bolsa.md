> **Documento depreciado.** A documentacao canonica migrou para [products/portal-coordenador/features/](../../products/portal-coordenador/features/).

# EP-09 — Pagamentos de Bolsa

`Bounded Context:` Pagamento de Bolsistas `Status:` Done `Dependências:` EP-01, EP-02, EP-06

## Descrição

Disponibilizar ao usuário uma visão filtrável do histórico de pagamentos da bolsa, considerando projeto, competência, modalidade e status.

## Critérios de aceite

- A página de pagamentos exibe filtros de projeto, data, modalidade e status.
- O sistema lista pagamentos conforme o contexto do projeto e filtros selecionados.
- A interface trata carregamento, erro e estado vazio.
- Cada item da listagem apresenta referência, competência e status do pagamento.

## Casos de Uso

### Consultar histórico de pagamentos

```gherkin
Feature: Consultar pagamentos da bolsa
  Como usuário autenticado
  Quero visualizar meu histórico de pagamentos
  Para acompanhar competências e status financeiros da bolsa

  Background:
    Given que estou autenticado
    And acesso "/pagamentos"

  Scenario: Carregar lista de pagamentos
    When a página é aberta
    Then o sistema consulta os pagamentos disponíveis no contexto atual
    And exibe a listagem correspondente

  Scenario: Exibir estado vazio
    Given que não existem pagamentos para os filtros selecionados
    When a consulta é concluída
    Then o sistema exibe mensagem de nenhum pagamento encontrado
```

### Filtrar pagamentos

```gherkin
Feature: Filtrar histórico de pagamentos
  Como usuário autenticado
  Quero combinar filtros na listagem de pagamentos
  Para localizar pagamentos específicos

  Scenario: Filtrar por data, modalidade e status
    Given que existem pagamentos no histórico
    When seleciono data, modalidade e status
    Then o sistema atualiza a listagem conforme os filtros escolhidos
```
