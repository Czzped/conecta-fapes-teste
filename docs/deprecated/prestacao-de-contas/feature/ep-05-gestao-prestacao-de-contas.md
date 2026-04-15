> **Documento depreciado.** A documentacao canonica migrou para [implementation/modules/M014-prestacao-contas/](../../implementation/modules/M014-prestacao-contas/backlog.md).

# EP-05 — Cadastro e Gestao de Prestacao de Contas

**Bounded Context:** Prestacao de Contas
**Status:** Done
**Dependencias:** EP-04

## Descricao

Permitir que o coordenador do projeto possa criar e gerenciar prestacoes de contas para organizar e agrupar transacoes financeiras e justificativas de despesa em um documento formal de prestacao. O epico garante que prestacoes de contas estejam disponiveis como agregador central do fluxo de comprovacao financeira.

## Criterios de aceite

- Usuarios podem criar, visualizar, editar e excluir prestacoes de contas.
- Prestacoes sao criadas com status inicial RASCUNHO.
- E possivel criar uma prestacao a partir de transacoes financeiras selecionadas (CreateFromTransacoes).
- Transacoes podem ser adicionadas ou removidas de prestacoes em status RASCUNHO.
- O sistema calcula automaticamente: ValorTotalJustificativas, ValorTotalTransacoes e Saldo.
- E possivel consultar a prestacao completa com todas as entidades relacionadas (GetCompleta).
- A listagem suporta paginacao e filtros (GetPaginated).
- E possivel buscar prestacoes por projeto (GetByProjeto).
- Apenas prestacoes em RASCUNHO ou REVISAO podem ter transacoes/justificativas alteradas.
- A exclusao e logica (soft delete via DateDeleted).

---

## Casos de Uso

### Cadastrar e Gerenciar Prestacao de Contas

```gherkin
Feature: Cadastrar e Gerenciar Prestacao de Contas
  Como coordenador do projeto
  Quero criar e gerenciar prestacoes de contas
  Para organizar transacoes e justificativas em documentos formais de prestacao

  Background:
    Given que estou autenticado como usuario com token JWT valido
    And existem transacoes financeiras disponiveis

  Scenario: Criar prestacao de contas
    When crio uma prestacao de contas com:
      | Campo | Valor      |
      | Data  | 2026-03-31 |
    Then o registro e criado com status RASCUNHO
    And o sistema registra o usuario e horario da criacao

  Scenario: Criar prestacao a partir de transacoes selecionadas
    Given existem transacoes disponiveis (sem vinculo com prestacao)
    When crio uma prestacao selecionando as transacoes
    Then a prestacao e criada com as transacoes vinculadas
    And o status e RASCUNHO

  Scenario: Adicionar transacoes a prestacao em RASCUNHO
    Given existe uma prestacao em status RASCUNHO
    And existem transacoes disponiveis
    When adiciono transacoes a prestacao
    Then as transacoes sao vinculadas a prestacao

  Scenario: Remover transacoes de prestacao em RASCUNHO
    Given existe uma prestacao em status RASCUNHO com transacoes vinculadas
    When removo transacoes da prestacao
    Then as transacoes sao desvinculadas da prestacao

  Scenario: Impedir alteracao de transacoes em prestacao EM_ANALISE
    Given existe uma prestacao em status EM_ANALISE
    When tento adicionar transacoes a prestacao
    Then o sistema retorna erro de regra de negocio

  Scenario: Consultar prestacao completa
    Given existe uma prestacao com justificativas e transacoes
    When solicito a prestacao completa
    Then o sistema retorna a prestacao com todas as entidades relacionadas

  Scenario: Consultar resumo da prestacao
    Given existe uma prestacao com transacoes e justificativas
    When consulto o resumo
    Then o sistema retorna:
      | Campo                   | Descricao                           |
      | ValorTotalJustificativas| Soma dos valores das justificativas |
      | ValorTotalTransacoes    | Soma dos valores das transacoes     |
      | Saldo                   | Diferenca entre transacoes e justificativas |

  Scenario: Listar prestacoes com paginacao
    Given existem prestacoes cadastradas
    When solicito a listagem paginada
    Then o sistema retorna a pagina com registros e metadados

  Scenario: Buscar prestacoes por projeto
    Given existem prestacoes vinculadas a um projeto
    When busco prestacoes pelo ProjetoId
    Then o sistema retorna as prestacoes do projeto

  Scenario: Excluir prestacao (soft delete)
    Given existe uma prestacao em RASCUNHO
    When excluo a prestacao
    Then o campo DateDeleted e preenchido com a data atual
```
