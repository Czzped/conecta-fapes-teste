# EP-04 — Cadastro e Gestao de Transacoes Financeiras

**Bounded Context:** Financeiro
**Status:** Done
**Dependencias:** EP-01

## Descricao

Permitir que o coordenador do projeto possa cadastrar, importar e gerenciar transacoes financeiras vinculadas a contas bancarias para registrar todas as movimentacoes de debito e credito do projeto. O epico garante que transacoes financeiras estejam disponiveis para composicao de prestacoes de contas.

## Criterios de aceite

- Usuarios podem criar, visualizar, editar e excluir transacoes financeiras.
- Cada transacao esta obrigatoriamente vinculada a uma conta bancaria (ContaBancariaId).
- Transacoes podem estar opcionalmente vinculadas a uma prestacao de contas (PrestacaoId).
- Os campos obrigatorios sao: ContaBancariaId, Data, Valor, Descricao, Identificador e Tipo (DEBITO/CREDITO).
- O status da transacao e derivado automaticamente do status da prestacao vinculada.
- E possivel importar transacoes a partir de extrato bancario (formato CNAB).
- E possivel listar transacoes disponiveis (nao vinculadas a nenhuma prestacao).
- A listagem suporta paginacao e filtros.
- Transacoes podem ser associadas/desassociadas de prestacoes de contas.
- A exclusao e logica (soft delete via DateDeleted).

---

## Casos de Uso

### Cadastrar e Gerenciar Transacoes Financeiras

```gherkin
Feature: Cadastrar e Gerenciar Transacoes Financeiras
  Como coordenador do projeto
  Quero cadastrar, importar e gerenciar transacoes financeiras
  Para registrar todas as movimentacoes de debito e credito do projeto

  Background:
    Given que estou autenticado como usuario com token JWT valido
    And existe uma conta bancaria cadastrada

  Scenario: Criar transacao financeira com dados validos
    When crio uma transacao financeira com:
      | Campo           | Valor                |
      | ContaBancariaId | {id-da-conta}        |
      | Data            | 2026-03-15           |
      | Valor           | 5000.00              |
      | Descricao       | Pagamento fornecedor |
      | Identificador   | TXN-2026-001         |
      | Tipo            | DEBITO               |
    Then o registro e criado com sucesso
    And o status inicial e PENDENTE

  Scenario: Impedir criacao sem conta bancaria
    When tento criar uma transacao sem informar o ContaBancariaId
    Then o sistema retorna erro de validacao "ContaBancariaId e obrigatorio"

  Scenario: Importar transacoes de extrato bancario (CNAB)
    Given possuo um arquivo de extrato no formato CNAB
    When importo o extrato bancario
    Then as transacoes sao criadas automaticamente vinculadas a conta bancaria
    And o sistema retorna o resumo da importacao

  Scenario: Listar transacoes com paginacao
    Given existem transacoes financeiras cadastradas
    When solicito a listagem paginada com:
      | Parametro  | Valor |
      | PageNumber | 1     |
      | PageSize   | 10    |
    Then o sistema retorna a pagina com os registros e metadados de paginacao

  Scenario: Listar transacoes disponiveis (nao vinculadas)
    Given existem transacoes sem vinculo com prestacao
    When solicito a listagem de transacoes disponiveis
    Then o sistema retorna apenas transacoes com PrestacaoId nulo

  Scenario: Listar transacoes por projeto
    Given existem transacoes vinculadas a contas de um projeto
    When busco transacoes pelo ProjetoId
    Then o sistema retorna as transacoes do projeto com paginacao

  Scenario: Associar transacao a prestacao de contas
    Given existe uma transacao disponivel (sem vinculo)
    And existe uma prestacao de contas em status RASCUNHO
    When associo a transacao a prestacao
    Then a transacao e vinculada a prestacao
    And o status da transacao reflete o status da prestacao

  Scenario: Verificar status derivado da transacao
    Given existe uma transacao vinculada a uma prestacao em EM_ANALISE
    When consulto o status da transacao
    Then o status retornado e EM_ANALISE

  Scenario: Atualizar transacao financeira
    Given existe uma transacao financeira cadastrada
    When atualizo os dados da transacao
    Then os dados sao atualizados com sucesso

  Scenario: Excluir transacao financeira (soft delete)
    Given existe uma transacao financeira cadastrada
    When excluo a transacao
    Then o campo DateDeleted e preenchido com a data atual
```
