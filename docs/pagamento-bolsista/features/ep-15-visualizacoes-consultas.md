# EP-15 — Visualizacoes e Consultas

**Bounded Context:** Consultas
**Status:** Done
**Dependencias:** Multiplos epicos (transversal)

## Descricao

Disponibilizar telas e endpoints de consulta transversais que agregam informacoes de multiplos contextos do sistema, permitindo que operadores e gestores visualizem dados consolidados de folhas, projetos, alocacoes e remessas. O epico garante visibilidade operacional e suporte a tomada de decisao.

## Criterios de aceite

- Operadores podem monitorar a data de consolidacao de dados para geracao de folha.
- Operadores podem monitorar o status de liberacao de editais por area tecnica.
- Operadores podem consultar o resumo consolidado de uma folha (valores, quantidades, status).
- Operadores podem consultar detalhes de editais agrupados por area tecnica dentro de uma folha.
- Operadores podem consultar o historico de decisoes (auditoria) de uma folha.
- Operadores podem visualizar projetos de um edital com seus bolsistas.
- Operadores podem visualizar projetos e valores pagos em uma folha especifica.
- Operadores podem visualizar alocacoes pagas em uma folha especifica.
- Operadores podem consultar bancos alternativos (nao padrao).
- Operadores podem visualizar bonus detalhados por plano mensal.
- Operadores podem consultar remessas de pagamento vinculadas a uma folha.

---

## Casos de Uso

### Consultas e Visualizacoes Transversais

```gherkin
Feature: Consultas e Visualizacoes Transversais
  Como operador da FAPES
  Quero consultar dados consolidados de diferentes contextos do sistema
  Para ter visibilidade operacional e suporte a tomada de decisao

  Background:
    Given que estou autenticado como usuario com papel "OPERADOR"

  Scenario: Monitorar data de consolidacao para geracao de folha
    When consulto a data de consolidacao de dados da folha
    Then o sistema retorna a data limite para consolidacao dos editais liberados

  Scenario: Monitorar liberacao de editais por area tecnica
    When consulto o monitoramento de liberacao por area tecnica
    Then o sistema retorna o status de liberacao agrupado por AreaTecnica
    And cada area exibe a quantidade de editais liberados e pendentes

  Scenario: Consultar resumo de folha de pagamento
    When consulto o resumo da folha
    Then o sistema retorna:
      | Campo           | Descricao                     |
      | ValorPrevisto   | Valor total previsto           |
      | ValorPago       | Valor total pago               |
      | Status          | Status atual da folha          |
      | TotalPagamentos | Quantidade de pagamentos       |

  Scenario: Consultar detalhes de folha por area tecnica
    When consulto os detalhes da folha por area tecnica
    Then o sistema retorna os editais agrupados por AreaTecnica
    And cada edital exibe valor previsto, valor pago e quantidade de bolsistas

  Scenario: Consultar historico de decisoes da folha
    When consulto o historico de decisoes da folha
    Then o sistema retorna todas as DecisaoFolha
    And cada decisao exibe tipo de acao, usuario, data e justificativa

  Scenario: Visualizar projetos de um edital com bolsistas
    When consulto os projetos de um edital
    Then o sistema retorna a lista de projetos com seus bolsistas alocados

  Scenario: Visualizar projetos pagos em uma folha
    When consulto os projetos pagos na folha
    Then o sistema retorna os projetos com valores pagos na folha especifica

  Scenario: Visualizar alocacoes pagas em uma folha
    When consulto as alocacoes pagas na folha
    Then o sistema retorna as alocacoes com detalhes de pagamento da folha

  Scenario: Consultar bancos alternativos
    When consulto os bancos que nao sao o banco padrao
    Then o sistema retorna a lista de bancos alternativos disponiveis

  Scenario: Visualizar bonus por plano mensal
    When consulto os bonus do plano mensal
    Then o sistema retorna os bonus com tipo, valor e modalidades associadas

  Scenario: Consultar remessas de pagamento por folha
    When consulto as remessas de pagamento da folha
    Then o sistema retorna as RemessaPagamento vinculadas com status e detalhes
```
