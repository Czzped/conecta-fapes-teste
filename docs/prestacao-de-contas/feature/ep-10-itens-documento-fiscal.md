# EP-10 — Cadastro e Gestao de Itens de Documento Fiscal

**Bounded Context:** Comprovacao de Despesas
**Status:** Done
**Dependencias:** EP-09, EP-03

## Descricao

Permitir que o coordenador do projeto possa cadastrar e gerenciar itens de documentos fiscais e vincula-los a contas contabeis para classificacao orcamentaria. O epico garante que cada item de nota fiscal esteja corretamente classificado e impacte o saldo da conta contabil correspondente.

## Criterios de aceite

- Usuarios podem criar, visualizar, editar e excluir itens de documento fiscal.
- Cada item esta obrigatoriamente vinculado a um documento fiscal (DocumentoFiscalId).
- Os campos incluem: Descricao, Quantidade, ValorUnitario, ValorTotal, NCM (opcional) e CFOP (opcional).
- Itens podem ser vinculados a uma conta contabil (VincularContaContabil).
- Itens podem ser desvinculados de uma conta contabil (DesvincularContaContabil).
- Ao vincular, o ContaContabilId deve ser valido e nao vazio.
- E possivel listar itens por documento fiscal (ListarPorDocumentoFiscal).
- O vinculo com conta contabil impacta o calculo de saldo da conta (Saldo = Limite - soma dos itens).
- A exclusao e logica (soft delete via DateDeleted).

---

## Casos de Uso

### Cadastrar e Gerenciar Itens de Documento Fiscal

```gherkin
Feature: Cadastrar e Gerenciar Itens de Documento Fiscal
  Como coordenador do projeto
  Quero cadastrar itens de documentos fiscais e vincula-los a contas contabeis
  Para classificar orcamentariamente cada item de despesa

  Background:
    Given que estou autenticado como usuario com token JWT valido
    And existe um documento fiscal cadastrado
    And existe uma conta contabil cadastrada

  Scenario: Criar item de documento fiscal
    When crio um item de documento fiscal com:
      | Campo           | Valor                  |
      | DocumentoFiscalId | {id-do-documento}    |
      | Descricao       | Reagente quimico       |
      | Quantidade      | 10                     |
      | ValorUnitario   | 150.00                 |
      | ValorTotal      | 1500.00                |
      | NCM             | 2933.39.99             |
      | CFOP            | 5102                   |
    Then o registro e criado com sucesso

  Scenario: Criar item sem NCM e CFOP (opcionais)
    When crio um item de documento fiscal sem NCM e CFOP
    Then o registro e criado com sucesso
    And NCM e CFOP sao nulos

  Scenario: Vincular item a conta contabil
    Given existe um item de documento fiscal sem conta contabil vinculada
    When vinculo o item a conta contabil
    Then o item e vinculado a conta contabil
    And o saldo da conta contabil e reduzido pelo valor do item

  Scenario: Impedir vinculacao com ContaContabilId vazio
    When tento vincular um item com ContaContabilId vazio
    Then o sistema retorna erro de validacao

  Scenario: Desvincular item de conta contabil
    Given existe um item vinculado a uma conta contabil
    When desvinculo o item da conta contabil
    Then o ContaContabilId e redefinido
    And o saldo da conta contabil e restaurado

  Scenario: Listar itens por documento fiscal
    Given existem itens vinculados a um documento fiscal
    When listo os itens pelo DocumentoFiscalId
    Then o sistema retorna todos os itens do documento

  Scenario: Atualizar item de documento fiscal
    Given existe um item de documento fiscal cadastrado
    When atualizo os dados do item
    Then os dados sao atualizados com sucesso

  Scenario: Excluir item (soft delete)
    Given existe um item de documento fiscal
    When excluo o item
    Then o campo DateDeleted e preenchido com a data atual
```
