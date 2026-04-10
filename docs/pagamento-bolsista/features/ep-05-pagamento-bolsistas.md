# EP-05 — Pagamento de Bolsistas

**Bounded Context:** Pagamento
**Status:** Done
**Dependencias:** EP-04

## Descricao

Permitir que o sistema gere e gerencie os registros de pagamento de bolsistas a partir das alocacoes ativas, calculando valores com base na modalidade, nivel e bonus aplicaveis. O epico garante que os pagamentos estejam disponiveis para inclusao em folhas de pagamento.

## Criterios de aceite

- O sistema gera registros de PagamentoBolsista para todas as alocacoes ativas.
- O valor original e calculado com base no VersaoNivel vinculado a alocacao.
- Quando o bolsista possui reducao por vinculo, o valor e: ReducaoPorVinculo * Valor.
- O valor de bonus e somado ao valor original: ValorPago = ValorOriginal + ValorBonus.
- Bonus do tipo VALOR_FIXO aplica valor direto; tipo PORCENTAGEM aplica fracao decimal (valor/100).
- Cada pagamento possui MesCompetencia, Ordem e Status.
- O status inicial do pagamento e ALOCADO.
- Historicos de pagamento podem ser importados para registros pre-existentes.

---

## Casos de Uso

### Gerar e Gerenciar Pagamentos de Bolsistas

```gherkin
Feature: Gerar e Gerenciar Pagamentos de Bolsistas
  Como operador da FAPES
  Quero gerar os registros de pagamento para alocacoes ativas
  Para viabilizar a inclusao dos pagamentos nas folhas mensais

  Background:
    Given que estou autenticado como usuario com papel "OPERADOR"
    And existem alocacoes com status "ATIVA"

  Scenario: Gerar pagamentos para alocacoes ativas
    When gero os pagamentos de bolsistas
    Then o sistema cria registros de PagamentoBolsista para cada alocacao ativa
    And cada registro possui status "ALOCADO"
    And o MesCompetencia corresponde ao periodo da cota

  Scenario: Calcular valor sem reducao por vinculo
    Given a alocacao possui PossuiReducaoBolsa = false
    And a VersaoNivel possui Valor "2000.00"
    When o pagamento e gerado
    Then o ValorOriginal e "2000.00"

  Scenario: Calcular valor com reducao por vinculo
    Given a alocacao possui PossuiReducaoBolsa = true
    And a VersaoNivel possui Valor "2000.00" e ReducaoPorVinculo "0.70"
    When o pagamento e gerado
    Then o ValorOriginal e "1400.00"

  Scenario: Calcular valor com bonus fixo
    Given o pagamento possui ValorOriginal "2000.00"
    And existe um bonus do tipo VALOR_FIXO com valor "500.00"
    When o valor pago e calculado
    Then o ValorBonus e "500.00"
    And o ValorPago e "2500.00"

  Scenario: Calcular valor com bonus percentual
    Given o pagamento possui ValorOriginal "2000.00"
    And existe um bonus do tipo PORCENTAGEM com valor "10"
    When o valor pago e calculado
    Then o ValorBonus e "200.00"
    And o ValorPago e "2200.00"

  Scenario: Importar historico de pagamento
    When importo um historico de pagamento com dados de periodos anteriores
    Then o sistema registra os pagamentos historicos vinculados a alocacao
    And as cotas pre-importacao sao contabilizadas
```
