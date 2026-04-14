# EP-10 — Remanejamento de Bolsas

`Bounded Context:` Portal FAPES (Remanejamento) `Status:` Partial `Dependências:` EP-01, EP-02, EP-06, EP-07

## Descrição

Permitir ao coordenador redistribuir cotas de bolsas com simulação financeira, validação de saldo e envio do remanejamento ao backend, mantendo também abas ainda não operacionalizadas para remanejamento interno e FAPES.

## Critérios de aceite

- A aba `Bolsa` apresenta orçamento, saldo, total previsto e percentual utilizado.
- O coordenador pode incrementar e decrementar cotas por modalidade.
- O sistema bloqueia o envio quando o remanejamento gera saldo negativo.
- O fluxo de confirmação envia o remanejamento validado ao backend.
- As abas `Interno` e `FAPES` existem na interface, mas hoje permanecem como placeholder visual.

## Casos de Uso

### Remanejar cotas de bolsas

```gherkin
Feature: Remanejar cotas do projeto
  Como coordenador do projeto
  Quero redistribuir cotas entre modalidades
  Para ajustar a alocação do orçamento de bolsas

  Background:
    Given que sou coordenador do projeto ativo
    And acesso "/remanejamento"

  Scenario: Ajustar cotas com simulação financeira
    When altero as quantidades de cotas por modalidade
    Then o sistema recalcula saldo, total previsto e percentual utilizado

  Scenario: Confirmar remanejamento válido
    Given que o saldo permanece não negativo
    When confirmo o remanejamento
    Then o sistema envia a solicitação ao backend
    And apresenta feedback de sucesso
```

### Bloquear cenários inválidos

```gherkin
Feature: Validar restrições do remanejamento
  Como coordenador do projeto
  Quero ser impedido de enviar remanejamentos inválidos
  Para preservar a consistência orçamentária do projeto

  Scenario: Bloquear envio com saldo negativo
    Given que o ajuste proposto excede o orçamento disponível
    When tento salvar o remanejamento
    Then o sistema bloqueia a ação
    And exibe alerta de saldo negativo

  Scenario: Consultar abas ainda não implementadas
    When acesso as abas "Interno" ou "FAPES"
    Then o sistema exibe apenas o placeholder visual dessas frentes
```
