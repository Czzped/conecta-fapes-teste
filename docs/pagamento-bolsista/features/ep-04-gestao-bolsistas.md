# EP-04 — Gestao de Bolsistas

**Bounded Context:** Gestao de Bolsistas
**Status:** Done
**Dependencias:** EP-03

## Descricao

Permitir que operadores possam gerenciar cotas de pagamento de bolsistas, incluindo adicao de cotas, suspensao de pagamentos e registro de pagamentos externos. O epico garante o controle granular sobre as cotas individuais de cada alocacao.

## Criterios de aceite

- Operadores podem adicionar, suspender e registrar pagamentos externos de cotas.
- A adicao de cota nao permite duplicidade de mes de competencia.
- A cota adicionada deve ser adjacente (diferenca de exatamente 1 mes) a primeira ou ultima cota existente.
- Nao e possivel adicionar cota com status ALOCADO se ja existe folha gerada para o mes.
- O valor original da cota e calculado automaticamente, com reducao se aplicavel.
- Bonus existentes sao aplicados automaticamente a nova cota.
- A adicao atualiza a DataFimPrevistaAtividade ou DataInicio da alocacao.
- Cada operacao gera um registro de PagamentoBolsistaDecisaoAdmin para auditoria.
- A suspensao utiliza o dia de corte 15: se o dia de inicio for > 15, a suspensao inicia no mes seguinte.
- Somente cotas com status ALOCADO podem ser suspensas.
- Pagamento externo altera o status da cota para PAGAMENTO_EXTERNO.

---

## Casos de Uso

### Gerenciar Cotas de Pagamento

```gherkin
Feature: Gerenciar Cotas de Pagamento de Bolsistas
  Como operador da FAPES
  Quero adicionar, suspender e controlar cotas de pagamento
  Para garantir o pagamento correto de cada bolsista

  Background:
    Given que estou autenticado como usuario com papel "OPERADOR"
    And existe uma alocacao ativa com cotas de pagamento

  Scenario: Adicionar cota adjacente ao periodo existente
    Given a ultima cota existente e do mes "2026-06"
    When adiciono uma cota para o mes "2026-07"
    Then a cota e criada com status "ALOCADO"
    And o valor original e calculado com base na VersaoNivel
    And bonus existentes para o mes sao aplicados automaticamente
    And a DataFimPrevistaAtividade da alocacao e atualizada
    And um registro de decisao administrativa e criado

  Scenario: Impedir adicao de cota com mes duplicado
    Given ja existe uma cota para o mes "2026-06"
    When tento adicionar outra cota para o mes "2026-06"
    Then o sistema retorna erro "Ja existe cota para este mes de competencia"

  Scenario: Impedir adicao de cota nao adjacente
    Given a ultima cota e do mes "2026-06"
    When tento adicionar uma cota para o mes "2026-09"
    Then o sistema retorna erro de validacao sobre adjacencia de meses

  Scenario: Impedir adicao de cota quando ja existe folha gerada
    Given ja existe folha gerada para o mes "2026-07"
    When tento adicionar uma cota para o mes "2026-07"
    Then o sistema retorna erro indicando que a folha ja foi gerada para o periodo

  Scenario: Suspender cotas de pagamento
    Given existem cotas com status "ALOCADO" no periodo de "2026-03" a "2026-06"
    When suspendo as cotas do periodo "2026-04" a "2026-05"
    Then as cotas do periodo sao suspensas com status "SUSPENSAO_POR_SOLICITACAO"
    And cotas com dia de inicio > 15 tem a suspensao iniciada no mes seguinte

  Scenario: Impedir suspensao de cotas ja pagas
    Given existe uma cota com status "PAGO"
    When tento suspender esta cota
    Then o sistema retorna erro "Somente cotas com status ALOCADO podem ser suspensas"

  Scenario: Registrar pagamento externo
    Given existe uma cota com status "ALOCADO"
    When registro a cota como pagamento externo
    Then o status da cota e alterado para "PAGAMENTO_EXTERNO"

  Scenario: Consultar cotas de pagamento por alocacao
    When consulto as cotas de pagamento da alocacao pelo CPF
    Then o sistema retorna todas as cotas com seus respectivos status e valores
```
