> **Documento depreciado.** A documentacao canonica migrou para [implementation/modules/M004-pagamento-bolsista/](../../implementation/modules/M004-pagamento-bolsista/backlog.md).

# EP-07 — Liberacao de Editais por Competencia

**Bounded Context:** Liberacao
**Status:** Done
**Dependencias:** EP-02

## Descricao

Permitir que gerentes de area tecnica possam liberar ou bloquear editais por competencia mensal, controlando quais editais serao incluidos na proxima folha de pagamento. O epico garante que somente editais liberados participem da geracao de folha.

## Criterios de aceite

- Gerentes podem visualizar e decidir sobre a liberacao de editais de suas areas tecnicas.
- A liberacao e filtrada pelo papel do usuario (roles contendo "GERENTE").
- Decisoes em lote (bulk) permitem liberar ou nao liberar multiplos editais de uma vez.
- A decisao NAO_LIBERADO requer justificativa obrigatoria.
- O status do EditalCompetencia segue o ciclo: PENDENTE -> LIBERADO | NAO_LIBERADO -> INCLUIDO_EM_FOLHA.
- O status INCLUIDO_EM_FOLHA e definido automaticamente na geracao da folha.
- Os contadores BolsasVigentes e BolsasPendentes sao gerenciados automaticamente.
- E possivel monitorar o status de liberacao por AreaTecnica.
- O sistema permite visualizar a previa da folha antes da geracao.
- Cada decisao registra o usuario, horario e justificativa (quando aplicavel).

---

## Casos de Uso

### Liberar Editais por Competencia

```gherkin
Feature: Liberar Editais por Competencia
  Como gerente de area tecnica da FAPES
  Quero liberar ou bloquear editais para a competencia mensal
  Para controlar quais editais serao incluidos na folha de pagamento

  Background:
    Given que estou autenticado como usuario com papel "GERENTE"
    And existem editais com EditalCompetencia no status "PENDENTE"

  Scenario: Visualizar editais pendentes de liberacao
    When consulto os editais pendentes de liberacao
    Then o sistema retorna os editais das areas tecnicas vinculadas ao meu papel
    And cada edital exibe ValorPrevisto, BolsasVigentes e BolsasPendentes

  Scenario: Liberar editais em lote
    When libero os editais em lote com:
      | EditalCompetenciaId | Decisao  |
      | {edital-1}          | LIBERADO |
      | {edital-2}          | LIBERADO |
    Then os editais passam para o status "LIBERADO"
    And cada decisao registra o usuario e horario

  Scenario: Nao liberar edital com justificativa
    When decido nao liberar um edital com:
      | Campo         | Valor                              |
      | Decisao       | NAO_LIBERADO                       |
      | Justificativa | Pendencia documental do coordenador |
    Then o edital passa para o status "NAO_LIBERADO"
    And a justificativa e registrada na DecisaoLiberacao

  Scenario: Impedir nao-liberacao sem justificativa
    When tento nao liberar um edital sem justificativa
    Then o sistema retorna erro "Justificativa e obrigatoria para decisao de nao liberacao"

  Scenario: Monitorar liberacao por area tecnica
    When consulto o monitoramento de liberacao por area tecnica
    Then o sistema retorna o status de liberacao agrupado por AreaTecnica

  Scenario: Visualizar previa da folha
    When consulto a previa da folha antes da geracao
    Then o sistema exibe os editais que serao incluidos e seus valores previstos

  Scenario: Confirmar dados para geracao de folha
    When consulto a confirmacao de geracao de folha
    Then o sistema retorna o resumo por AreaTecnica dos editais liberados

  Scenario: Consultar historico de liberacoes
    When consulto o historico de geracoes de folha
    Then o sistema retorna o historico de liberacoes com datas e decisoes
```
