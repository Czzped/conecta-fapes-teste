# EP-08 — Cadastro e Gestao de Justificativas de Despesa por Invoice

**Bounded Context:** Comprovacao de Despesas
**Status:** Done
**Dependencias:** EP-05

## Descricao

Permitir que o coordenador do projeto possa cadastrar e gerenciar justificativas de despesa por invoice internacional para comprovar gastos realizados em moeda estrangeira. O epico garante o registro do valor de cambio e tipo de moeda utilizados na conversao.

## Criterios de aceite

- Usuarios podem criar, visualizar, editar e excluir justificativas de invoice.
- Cada justificativa esta obrigatoriamente vinculada a uma prestacao de contas (PrestacaoId).
- Os campos obrigatorios sao: PrestacaoId, Descricao e ValorTotal.
- A justificativa armazena o valor de cambio (ValorCambio) e o tipo de moeda (Moeda: BRL, USD, EUR, GBP).
- Justificativas herdam a capacidade de vinculacao de orcamentos de fornecedor.
- A exclusao e logica (soft delete via DateDeleted).

---

## Casos de Uso

### Cadastrar e Gerenciar Justificativa de Despesa por Invoice

```gherkin
Feature: Cadastrar e Gerenciar Justificativa de Despesa por Invoice
  Como coordenador do projeto
  Quero cadastrar justificativas de despesa por invoice internacional
  Para comprovar gastos realizados em moeda estrangeira

  Background:
    Given que estou autenticado como usuario com token JWT valido
    And existe uma prestacao de contas em status RASCUNHO

  Scenario: Criar justificativa de invoice com dados validos
    When crio uma justificativa de invoice com:
      | Campo       | Valor                         |
      | PrestacaoId | {id-da-prestacao}             |
      | Descricao   | Licenca de software           |
      | ValorTotal  | 2500.00                       |
      | ValorCambio | 5.20                          |
      | Moeda       | USD                           |
    Then o registro e criado com sucesso

  Scenario: Criar invoice com diferentes moedas
    When crio justificativas de invoice com moedas:
      | Moeda | Descricao            |
      | USD   | Dolar americano      |
      | EUR   | Euro                 |
      | GBP   | Libra esterlina      |
      | BRL   | Real brasileiro      |
    Then todos os registros sao criados com sucesso

  Scenario: Impedir criacao sem prestacao vinculada
    When tento criar uma justificativa de invoice sem informar o PrestacaoId
    Then o sistema retorna erro de validacao "PrestacaoId e obrigatorio"

  Scenario: Listar justificativas de invoice
    Given existem justificativas de invoice cadastradas
    When solicito a listagem
    Then o sistema retorna todas as justificativas de invoice ativas

  Scenario: Buscar justificativa por ID
    Given existe uma justificativa de invoice com ID conhecido
    When busco a justificativa pelo ID
    Then o sistema retorna os dados completos incluindo ValorCambio e Moeda

  Scenario: Atualizar justificativa de invoice
    Given existe uma justificativa de invoice cadastrada
    When atualizo os dados da justificativa
    Then os dados sao atualizados com sucesso

  Scenario: Excluir justificativa (soft delete)
    Given existe uma justificativa de invoice
    When excluo a justificativa
    Then o campo DateDeleted e preenchido com a data atual
```
