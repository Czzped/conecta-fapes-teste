> **Documento depreciado.** A documentacao canonica migrou para [implementation/modules/M004-pagamento-bolsista/](../../implementation/modules/M004-pagamento-bolsista/backlog.md).

# EP-11 — Encaminhamento de Pagamento (Bandes)

**Bounded Context:** Pagamento
**Status:** Done
**Dependencias:** EP-08

## Descricao

Permitir que operadores possam redirecionar o pagamento de um bolsista do banco padrao (Banestes) para o banco alternativo (Bandes) quando ocorrem erros de agendamento. O epico garante que pagamentos com falha possam ser efetivados por via alternativa.

## Criterios de aceite

- Operadores podem encaminhar o pagamento de um bolsista para o Bandes.
- A alocacao e localizada pela matricula; o pagamento e localizado por FolhaId + Matricula.
- O status do pagamento e alterado para PAGO.
- O campo EhPagamentoBancoPadrao da alocacao e definido como false.
- Novos dados bancarios (conta e agencia do Bandes) sao cadastrados para a pessoa.
- O registro de ErroAgendamentoPagamento e removido, se existente.

---

## Casos de Uso

### Encaminhar Pagamento para Bandes

```gherkin
Feature: Encaminhar Pagamento para Bandes
  Como operador da FAPES
  Quero redirecionar pagamentos com erro para o banco Bandes
  Para garantir que o bolsista receba o pagamento por via alternativa

  Background:
    Given que estou autenticado como usuario com papel "OPERADOR"
    And existe um pagamento com erro de agendamento bancario

  Scenario: Encaminhar pagamento para Bandes com sucesso
    When encaminho o pagamento para Bandes com:
      | Campo    | Valor        |
      | Matricula| 20260001     |
      | FolhaId  | {folha-id}   |
      | Conta    | 12345-6      |
      | Agencia  | 0001         |
      | BancoId  | {bandes-id}  |
    Then o status do pagamento e alterado para "PAGO"
    And o campo EhPagamentoBancoPadrao da alocacao e definido como false
    And novos dados bancarios sao criados para a pessoa
    And o registro de ErroAgendamentoPagamento e removido

  Scenario: Encaminhar pagamento sem erro de agendamento preexistente
    Given existe um pagamento sem erro de agendamento
    When encaminho o pagamento para Bandes
    Then o status do pagamento e alterado para "PAGO"
    And os dados bancarios sao atualizados
    And nenhum erro de agendamento e removido (nao existia)

  Scenario: Localizar pagamento por matricula e folha
    When busco o pagamento pela matricula "20260001" na folha
    Then o sistema retorna o pagamento correspondente com seus detalhes
```
