# EP-02 — Cadastro e Gestao de Orcamento

**Bounded Context:** Financeiro
**Status:** Done
**Dependencias:** Nenhuma

## Descricao

Permitir que o coordenador do projeto possa cadastrar e gerenciar orcamentos anuais para controlar a distribuicao financeira entre bolsas e capital. O epico garante que orcamentos estejam disponiveis como base para a criacao de contas contabeis e acompanhamento de saldos.

## Criterios de aceite

- Usuarios podem criar, visualizar, editar e excluir orcamentos.
- Cada orcamento pode estar vinculado a um projeto (ProjetoRef) de forma opcional.
- Os campos obrigatorios sao: Ano, ValorTotal, ValorBolsasPrevisto e ValorCapitalPrevisto.
- O sistema permite consultar o resumo financeiro do orcamento (saldo de bolsas, capital e total).
- E possivel buscar orcamentos por projeto (GetOrcamentoByProjetoId).
- Orcamentos possuem colecao de contas contabeis vinculadas.
- A exclusao e logica (soft delete via DateDeleted).

---

## Casos de Uso

### Cadastrar e Gerenciar Orcamento

```gherkin
Feature: Cadastrar e Gerenciar Orcamento
  Como coordenador do projeto
  Quero cadastrar e gerenciar orcamentos anuais
  Para controlar a distribuicao financeira entre bolsas e capital

  Background:
    Given que estou autenticado como usuario com token JWT valido

  Scenario: Criar orcamento com dados validos
    When crio um orcamento com:
      | Campo               | Valor      |
      | Ano                 | 2026       |
      | ValorTotal          | 500000.00  |
      | ValorBolsasPrevisto | 300000.00  |
      | ValorCapitalPrevisto| 200000.00  |
    Then o registro e criado com sucesso
    And o sistema registra o usuario e horario da criacao

  Scenario: Criar orcamento vinculado a um projeto
    Given existe um projeto com ID valido
    When crio um orcamento informando o ProjetoId
    Then o orcamento e criado vinculado ao projeto

  Scenario: Impedir criacao sem campo obrigatorio
    When tento criar um orcamento sem informar o campo "Ano"
    Then o sistema retorna erro de validacao "Ano e obrigatorio"

  Scenario: Consultar resumo financeiro do orcamento
    Given existe um orcamento cadastrado com contas contabeis
    When solicito o resumo financeiro do orcamento
    Then o sistema retorna:
      | Campo        | Descricao                    |
      | SaldoBolsas  | Saldo disponivel para bolsas |
      | SaldoCapital | Saldo disponivel para capital|
      | SaldoTotal   | Saldo total disponivel       |

  Scenario: Buscar orcamento por projeto
    Given existe um orcamento vinculado a um projeto
    When busco o orcamento pelo ProjetoId
    Then o sistema retorna o orcamento do projeto

  Scenario: Listar todos os orcamentos
    Given existem orcamentos cadastrados
    When solicito a listagem de todos os orcamentos
    Then o sistema retorna todos os orcamentos ativos

  Scenario: Atualizar orcamento
    Given existe um orcamento cadastrado
    When atualizo os valores do orcamento
    Then os dados sao atualizados com sucesso

  Scenario: Excluir orcamento (soft delete)
    Given existe um orcamento cadastrado
    When excluo o orcamento
    Then o campo DateDeleted e preenchido com a data atual
```
