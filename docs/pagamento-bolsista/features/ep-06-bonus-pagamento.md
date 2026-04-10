# EP-06 — Bonus de Pagamento

**Bounded Context:** Pagamento
**Status:** Done
**Dependencias:** EP-03

## Descricao

Permitir que operadores possam criar e gerenciar bonus de pagamento vinculados a planos mensais e modalidades de bolsa. O epico garante que bonus (valor fixo ou percentual) sejam aplicados automaticamente aos pagamentos de bolsistas elegiveis.

## Criterios de aceite

- Operadores podem criar, visualizar, editar e excluir bonus de pagamento.
- Cada bonus esta vinculado a um PlanoMensal e a uma ou mais VersaoModalidade.
- O bonus pode ser do tipo VALOR_FIXO (valor monetario direto) ou PORCENTAGEM (fracao sobre o valor original).
- O valor do bonus deve ser maior que zero.
- Nao e possivel criar bonus para um PlanoMensal que ja possui folhas geradas.
- Uma mesma VersaoModalidade nao pode ter dois bonus no mesmo PlanoMensal.
- Ao criar um bonus, o sistema aplica automaticamente o ValorBonus a todos os pagamentos ALOCADO das modalidades e competencia correspondentes.
- Ao excluir um bonus, o sistema reverte o valor aplicado nos pagamentos.
- O nome do bonus e gerado automaticamente: "Bonus - MM/YYYY - R$X" ou "Bonus - MM/YYYY - X%".
- O status do bonus segue o ciclo: AGUARDANDO_FOLHA -> INCLUSO_NA_FOLHA.

---

## Casos de Uso

### Criar e Gerenciar Bonus de Pagamento

```gherkin
Feature: Criar e Gerenciar Bonus de Pagamento
  Como operador da FAPES
  Quero cadastrar bonus de pagamento vinculados a planos mensais
  Para complementar o valor das bolsas de modalidades especificas

  Background:
    Given que estou autenticado como usuario com papel "OPERADOR"
    And existe um plano mensal sem folhas geradas

  Scenario: Criar bonus de valor fixo
    When crio um bonus de pagamento com:
      | Campo            | Valor      |
      | TipoBonus        | VALOR_FIXO |
      | ValorFixo        | 500.00     |
      | VersaoModalidade | MSC-V1     |
    Then o bonus e criado com status "AGUARDANDO_FOLHA"
    And o nome e gerado como "Bonus - 01/2026 - R$500,00"
    And o ValorBonus e aplicado a todos os pagamentos ALOCADO da modalidade no mes

  Scenario: Criar bonus percentual
    When crio um bonus de pagamento com:
      | Campo            | Valor       |
      | TipoBonus        | PORCENTAGEM |
      | Porcentagem      | 10          |
      | VersaoModalidade | DOC-V1      |
    Then o bonus e criado com status "AGUARDANDO_FOLHA"
    And o nome e gerado como "Bonus - 01/2026 - 10%"
    And o ValorBonus (10% do valor original) e aplicado aos pagamentos elegiveis

  Scenario: Impedir criacao com valor zero ou negativo
    When tento criar um bonus com ValorFixo "0.00"
    Then o sistema retorna erro "O valor do bonus deve ser maior que zero"

  Scenario: Impedir criacao quando PlanoMensal ja possui folha
    Given o plano mensal ja possui folhas geradas
    When tento criar um bonus
    Then o sistema retorna erro "Nao e possivel criar bonus para plano mensal com folhas geradas"

  Scenario: Impedir duplicidade de bonus por modalidade e plano mensal
    Given ja existe um bonus para VersaoModalidade "MSC-V1" no plano mensal atual
    When tento criar outro bonus para a mesma VersaoModalidade no mesmo plano mensal
    Then o sistema retorna erro "Ja existe bonus para esta modalidade no periodo"

  Scenario: Excluir bonus e reverter valores
    Given existe um bonus aplicado a pagamentos
    When excluo o bonus
    Then o bonus e removido
    And o ValorBonus e revertido nos pagamentos afetados

  Scenario: Listar bonus com paginacao e filtros
    When consulto os bonus de pagamento
    Then o sistema retorna a lista paginada de bonus com seus detalhes

  Scenario: Visualizar bonus por plano mensal
    When consulto os bonus do plano mensal "01/2026"
    Then o sistema retorna os bonus vinculados ao periodo com as modalidades associadas
```
