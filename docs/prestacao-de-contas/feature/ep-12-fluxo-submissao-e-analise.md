# EP-12 — Fluxo de Submissao e Analise de Prestacao de Contas

**Bounded Context:** Prestacao de Contas
**Status:** Done
**Dependencias:** EP-05, EP-06, EP-07, EP-08, EP-09, EP-10

## Descricao

Permitir que o coordenador do projeto possa submeter prestacoes de contas para analise e que o analista FAPES possa aprovar, negar ou solicitar revisao da prestacao. O epico implementa a maquina de estados que governa o ciclo de vida da prestacao (RASCUNHO → EM_ANALISE → FINALIZADO/NEGADO/REVISAO) e inclui validacao pre-submissao.

## Criterios de aceite

- A prestacao so pode ser submetida quando esta em status RASCUNHO ou REVISAO.
- Ao submeter, o status transita para EM_ANALISE.
- O sistema valida a prestacao antes da submissao (Validar).
- A partir de EM_ANALISE, o analista pode: aprovar (FINALIZADO), negar (NEGADO) ou solicitar revisao (REVISAO).
- A partir de REVISAO, o coordenador pode resubmeter (volta para EM_ANALISE).
- Transicoes de estado invalidas sao bloqueadas com excecao de regra de negocio.
- O status das transacoes financeiras vinculadas reflete automaticamente o status da prestacao.
- Prestacoes em EM_ANALISE, FINALIZADO ou NEGADO nao podem ter transacoes/justificativas alteradas.

---

## Maquina de Estados

```
RASCUNHO ──Submeter()──> EM_ANALISE
EM_ANALISE ──Aprovar()──> FINALIZADO
EM_ANALISE ──Negar()──> NEGADO
EM_ANALISE ──SolicitarRevisao()──> REVISAO
REVISAO ──Submeter()──> EM_ANALISE
```

---

## Casos de Uso

### Fluxo de Submissao e Analise

```gherkin
Feature: Fluxo de Submissao e Analise de Prestacao de Contas
  Como coordenador do projeto e analista FAPES
  Quero submeter, analisar e decidir sobre prestacoes de contas
  Para garantir a correta comprovacao dos gastos do projeto

  Background:
    Given que estou autenticado como usuario com token JWT valido

  Scenario: Validar prestacao antes da submissao
    Given existe uma prestacao em status RASCUNHO
    When solicito a validacao da prestacao
    Then o sistema verifica se todas as justificativas possuem documentos
    And verifica se as transacoes estao balanceadas
    And retorna o resultado da validacao

  Scenario: Submeter prestacao em RASCUNHO
    Given existe uma prestacao em status RASCUNHO
    And a prestacao passou na validacao
    When submeto a prestacao
    Then o status transita para EM_ANALISE
    And as transacoes vinculadas refletem status EM_ANALISE

  Scenario: Aprovar prestacao em EM_ANALISE
    Given que estou autenticado como analista FAPES
    And existe uma prestacao em status EM_ANALISE
    When aprovo a prestacao
    Then o status transita para FINALIZADO
    And as transacoes vinculadas refletem status APROVADA

  Scenario: Negar prestacao em EM_ANALISE
    Given que estou autenticado como analista FAPES
    And existe uma prestacao em status EM_ANALISE
    When nego a prestacao
    Then o status transita para NEGADO
    And as transacoes vinculadas refletem status REJEITADA

  Scenario: Solicitar revisao de prestacao em EM_ANALISE
    Given que estou autenticado como analista FAPES
    And existe uma prestacao em status EM_ANALISE
    When solicito revisao da prestacao
    Then o status transita para REVISAO
    And as transacoes vinculadas refletem status EM_REVISAO

  Scenario: Resubmeter prestacao em REVISAO
    Given existe uma prestacao em status REVISAO
    When submeto novamente a prestacao
    Then o status transita para EM_ANALISE

  Scenario: Impedir submissao de prestacao FINALIZADA
    Given existe uma prestacao em status FINALIZADO
    When tento submeter a prestacao
    Then o sistema retorna erro de regra de negocio "Transicao de estado invalida"

  Scenario: Impedir submissao de prestacao NEGADA
    Given existe uma prestacao em status NEGADO
    When tento submeter a prestacao
    Then o sistema retorna erro de regra de negocio "Transicao de estado invalida"

  Scenario: Impedir aprovacao de prestacao em RASCUNHO
    Given existe uma prestacao em status RASCUNHO
    When tento aprovar a prestacao
    Then o sistema retorna erro de regra de negocio "Transicao de estado invalida"

  Scenario: Impedir alteracao de transacoes em prestacao EM_ANALISE
    Given existe uma prestacao em status EM_ANALISE
    When tento adicionar ou remover transacoes
    Then o sistema retorna erro de regra de negocio
```
