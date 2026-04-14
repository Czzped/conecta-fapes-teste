# EP-03 — Cadastro e Gestao de Contas Contabeis

**Bounded Context:** Financeiro
**Status:** Done
**Dependencias:** EP-02

## Descricao

Permitir que o coordenador do projeto possa cadastrar e gerenciar contas contabeis hierarquicas vinculadas a um orcamento para classificar e controlar os limites de gasto por categoria. O epico garante que contas contabeis estejam disponiveis para vinculacao com itens de documento fiscal.

## Criterios de aceite

- Usuarios podem criar, visualizar, editar e excluir contas contabeis.
- Cada conta contabil esta obrigatoriamente vinculada a um orcamento (OrcamentoId).
- Contas contabeis suportam hierarquia (parent-child) via ContaContabilParentId opcional.
- Os campos obrigatorios sao: Descricao, Limite e OrcamentoId.
- O sistema calcula o saldo disponivel da conta (Limite - soma dos itens vinculados).
- Contas contabeis sao utilizadas para classificacao de itens de documento fiscal.
- A exclusao e logica (soft delete via DateDeleted).

---

## Casos de Uso

### Cadastrar e Gerenciar Conta Contabil

```gherkin
Feature: Cadastrar e Gerenciar Conta Contabil
  Como coordenador do projeto
  Quero cadastrar e gerenciar contas contabeis hierarquicas
  Para classificar e controlar os limites de gasto por categoria

  Background:
    Given que estou autenticado como usuario com token JWT valido
    And existe um orcamento cadastrado

  Scenario: Criar conta contabil com dados validos
    When crio uma conta contabil com:
      | Campo       | Valor              |
      | Descricao   | Material de Consumo|
      | Limite      | 50000.00           |
      | OrcamentoId | {id-do-orcamento}  |
    Then o registro e criado com sucesso

  Scenario: Criar sub-conta contabil (hierarquia)
    Given existe uma conta contabil pai cadastrada
    When crio uma conta contabil informando o ContaContabilParentId
    Then a sub-conta e criada vinculada a conta pai

  Scenario: Impedir criacao sem orcamento vinculado
    When tento criar uma conta contabil sem informar o OrcamentoId
    Then o sistema retorna erro de validacao "OrcamentoId e obrigatorio"

  Scenario: Consultar saldo disponivel da conta
    Given existe uma conta contabil com limite de R$ 50.000,00
    And existem itens de documento fiscal vinculados totalizando R$ 30.000,00
    When consulto o saldo da conta contabil
    Then o sistema retorna saldo de R$ 20.000,00

  Scenario: Listar todas as contas contabeis
    Given existem contas contabeis cadastradas
    When solicito a listagem de todas as contas contabeis
    Then o sistema retorna todas as contas contabeis com sua hierarquia

  Scenario: Atualizar conta contabil
    Given existe uma conta contabil cadastrada
    When atualizo a descricao e o limite da conta
    Then os dados sao atualizados com sucesso

  Scenario: Excluir conta contabil (soft delete)
    Given existe uma conta contabil sem itens vinculados
    When excluo a conta contabil
    Then o campo DateDeleted e preenchido com a data atual
```
