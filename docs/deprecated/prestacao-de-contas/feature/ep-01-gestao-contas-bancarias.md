> **Documento depreciado.** A documentacao canonica migrou para [implementation/modules/M014-prestacao-contas/](../../implementation/modules/M014-prestacao-contas/backlog.md).

# EP-01 — Cadastro e Gestao de Contas Bancarias

**Bounded Context:** Financeiro
**Status:** Done
**Dependencias:** Nenhuma

## Descricao

Permitir que o coordenador do projeto possa cadastrar e gerenciar contas bancarias para registrar e acompanhar as movimentacoes financeiras do projeto. O epico garante que contas bancarias estejam disponiveis como base para o registro de transacoes financeiras.

## Criterios de aceite

- Usuarios podem criar, visualizar, editar e excluir contas bancarias.
- Cada conta bancaria pode estar vinculada a um projeto (ProjetoRef) de forma opcional.
- Os campos obrigatorios sao: Banco, Agencia, Numero e Titular.
- O saldo atual da conta pode ser atualizado.
- Contas bancarias sao utilizadas como referencia para transacoes financeiras.
- A exclusao e logica (soft delete via DateDeleted).

---

## Casos de Uso

### Cadastrar e Gerenciar Conta Bancaria

```gherkin
Feature: Cadastrar e Gerenciar Conta Bancaria
  Como coordenador do projeto
  Quero cadastrar, editar e excluir contas bancarias
  Para registrar e acompanhar as movimentacoes financeiras do projeto

  Background:
    Given que estou autenticado como usuario com token JWT valido

  Scenario: Criar conta bancaria com dados validos
    When crio uma conta bancaria com:
      | Campo    | Valor                |
      | Banco    | Banco do Brasil      |
      | Agencia  | 1234                 |
      | Numero   | 56789-0              |
      | Titular  | Universidade Federal |
    Then o registro e criado com sucesso
    And o sistema registra o usuario e horario da criacao

  Scenario: Criar conta bancaria vinculada a um projeto
    Given existe um projeto com ID valido
    When crio uma conta bancaria informando o ProjetoId
    Then a conta bancaria e criada vinculada ao projeto

  Scenario: Impedir criacao sem campo obrigatorio
    When tento criar uma conta bancaria sem informar o campo "Banco"
    Then o sistema retorna erro de validacao "Banco e obrigatorio"

  Scenario: Listar todas as contas bancarias
    Given existem contas bancarias cadastradas
    When solicito a listagem de todas as contas bancarias
    Then o sistema retorna todas as contas bancarias ativas

  Scenario: Buscar conta bancaria por ID
    Given existe uma conta bancaria com ID conhecido
    When busco a conta bancaria pelo ID
    Then o sistema retorna os dados completos da conta bancaria

  Scenario: Atualizar dados de conta bancaria
    Given existe uma conta bancaria cadastrada
    When atualizo os dados da conta bancaria
    Then os dados sao atualizados com sucesso
    And o campo DateUpdated e preenchido

  Scenario: Atualizar saldo da conta bancaria
    Given existe uma conta bancaria com saldo atual de R$ 10.000,00
    When atualizo o saldo para R$ 15.000,00
    Then o saldo da conta e atualizado para R$ 15.000,00

  Scenario: Excluir conta bancaria (soft delete)
    Given existe uma conta bancaria cadastrada
    When excluo a conta bancaria
    Then o campo DateDeleted e preenchido com a data atual
    And a conta nao aparece mais nas listagens
```
