> **Documento depreciado.** A documentacao canonica migrou para [products/portal-coordenador/features/](../../products/portal-coordenador/features/).

# EP-11 — Prestação Financeira

`Bounded Context:` Portal FAPES (Prestação) `Status:` Partial `Dependências:` EP-01, EP-02, EP-06

## Descrição

Conduzir o coordenador pelo fluxo de prestação financeira a partir da listagem de transações do projeto, incluindo abertura do detalhe, processamento de nota fiscal, associação contábil, envio de cotações, observações e submissão final.

## Critérios de aceite

- A página principal lista transações e prestações do projeto com paginação.
- A listagem oferece filtros de data, status e categoria, embora parte do fechamento funcional ainda esteja pendente.
- O detalhe da prestação permite upload e processamento de nota fiscal em PDF/XML.
- O usuário pode revisar itens da nota e associá-los a conta e subconta contábil.
- O fluxo permite anexar até três cotações e marcar a escolhida.
- Há área de observações e botão de submissão final da prestação.
- O indicador orçamentário do módulo existe, mas ainda precisa evolução para refletir dados reais com maior confiança.

## Casos de Uso

### Consultar lista de prestações

```gherkin
Feature: Acessar prestação financeira do projeto
  Como coordenador do projeto
  Quero consultar as transações que demandam prestação
  Para iniciar ou acompanhar o fluxo financeiro do projeto

  Background:
    Given que sou coordenador do projeto ativo
    And acesso "/prestacao-financeira"

  Scenario: Listar transações e prestações
    When a página principal é carregada
    Then o sistema exibe a listagem paginada de transações
    And disponibiliza filtros por data, status e categoria

  Scenario: Abrir detalhe da prestação
    Given que existe uma transação listada
    When seleciono uma linha da listagem
    Then o sistema navega para o detalhe da prestação correspondente
```

### Concluir prestação financeira

```gherkin
Feature: Executar fluxo detalhado da prestação
  Como coordenador do projeto
  Quero preencher todas as etapas da prestação financeira
  Para submeter corretamente a documentação do gasto

  Scenario: Processar nota fiscal e associar itens
    Given que estou no detalhe da prestação
    When envio uma nota fiscal e confirmo os dados processados
    Then o sistema permite revisar os itens extraídos
    And permite associar cada item a conta e subconta contábil

  Scenario: Enviar cotações e submeter prestação
    Given que todos os itens foram associados
    When anexo as cotações exigidas e salvo as observações
    Then o sistema habilita a submissão final da prestação
```
