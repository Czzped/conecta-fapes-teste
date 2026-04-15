> **Documento depreciado.** A documentacao canonica migrou para [implementation/modules/M004-pagamento-bolsista/](../../implementation/modules/M004-pagamento-bolsista/backlog.md).

# EP-08 — Geracao e Gestao de Folhas de Pagamento

**Bounded Context:** Folha de Pagamento
**Status:** Done
**Dependencias:** EP-03, EP-06, EP-07

## Descricao

Permitir que operadores possam gerar, autorizar e cancelar folhas de pagamento, consolidando os pagamentos de bolsistas de editais liberados. O epico garante que as folhas estejam disponiveis para geracao de remessas bancarias e documentos.

## Criterios de aceite

- Operadores podem gerar folhas de pagamento normais e complementares.
- A geracao so e permitida apos a data do MarcoGeracaoFolha ter passado.
- Nao e possivel gerar nova folha enquanto existir uma com status GERADA.
- Folha normal tem Ordem 0; folha complementar tem Ordem N (sequencial).
- Folha complementar requer DataPagamentoFolhaComplementar e so pode ser gerada ate o MarcoGeracaoFolha do PlanoMensal seguinte.
- Se existe folha cancelada/rejeitada, ela e reutilizada (re-geracao).
- A geracao inclui editais liberados de todos os PlanoMensais com competencias pendentes (retroativos).
- Na geracao: pagamentos elegiveis passam para EM_FOLHA, EditalCompetencia para INCLUIDO_EM_FOLHA, BonusPagamento para INCLUSO_NA_FOLHA.
- O titulo e gerado automaticamente: "FOLHA-NORMAL-DD/MM/YYYY" ou "FOLHA-COMPLEMENTAR-N-DD/MM/YYYY".
- Autorizacao requer papel DIRETOR_ADMINISTRATIVO e folha com status GERADA.
- Cancelamento requer justificativa obrigatoria.
- O status segue o ciclo: GERADA -> AUTORIZADA | REJEITADA | CANCELADA -> AGENDADA -> EM_AGENDAMENTO -> PAGA.

---

## Casos de Uso

### Gerar e Gerenciar Folhas de Pagamento

```gherkin
Feature: Gerar e Gerenciar Folhas de Pagamento
  Como operador da FAPES
  Quero gerar e gerenciar folhas de pagamento
  Para consolidar os pagamentos de bolsistas e encaminha-los ao banco

  Background:
    Given que estou autenticado como usuario com papel "OPERADOR"
    And o MarcoGeracaoFolha do plano mensal atual ja passou
    And existem editais liberados com pagamentos elegiveis

  Scenario: Gerar folha de pagamento normal
    When gero uma folha de pagamento normal
    Then a folha e criada com Ordem "0" e status "GERADA"
    And o titulo e "FOLHA-NORMAL-DD/MM/YYYY"
    And os pagamentos elegiveis passam para status "EM_FOLHA"
    And os EditalCompetencia passam para "INCLUIDO_EM_FOLHA"
    And os BonusPagamento passam para "INCLUSO_NA_FOLHA"
    And uma DecisaoFolha do tipo "GERAR" e registrada

  Scenario: Gerar folha complementar
    Given existe uma folha normal ja autorizada
    When gero uma folha complementar com DataPagamento "2026-02-15"
    Then a folha e criada com Ordem sequencial e status "GERADA"
    And o titulo e "FOLHA-COMPLEMENTAR-N-DD/MM/YYYY"

  Scenario: Impedir geracao antes do MarcoGeracaoFolha
    Given o MarcoGeracaoFolha ainda nao passou
    When tento gerar uma folha
    Then o sistema retorna erro indicando que o marco de geracao ainda nao foi atingido

  Scenario: Impedir geracao com folha existente em status GERADA
    Given ja existe uma folha com status "GERADA"
    When tento gerar outra folha
    Then o sistema retorna erro "Ja existe uma folha gerada para este periodo"

  Scenario: Regenerar folha a partir de folha cancelada
    Given existe uma folha com status "CANCELADA"
    When gero uma nova folha
    Then o sistema reutiliza a folha cancelada e atualiza seus dados

  Scenario: Incluir editais retroativos na folha
    Given existem EditalCompetencia de meses anteriores com status "LIBERADO"
    When gero a folha
    Then os pagamentos retroativos sao incluidos na folha

  Scenario: Autorizar folha de pagamento
    Given que estou autenticado como usuario com papel "DIRETOR_ADMINISTRATIVO"
    And existe uma folha com status "GERADA"
    When autorizo a folha
    Then a folha passa para o status "AUTORIZADA"
    And uma DecisaoFolha do tipo "AUTORIZAR" e registrada

  Scenario: Impedir autorizacao por usuario sem papel adequado
    Given que estou autenticado como usuario com papel "OPERADOR"
    When tento autorizar a folha
    Then o sistema retorna erro de autorizacao

  Scenario: Cancelar folha com justificativa
    When cancelo a folha com justificativa "Erro na consolidacao dos valores"
    Then a folha passa para o status "CANCELADA"
    And uma DecisaoFolha do tipo "CANCELAR" e registrada com a justificativa

  Scenario: Consultar resumo da folha
    When consulto o resumo da folha
    Then o sistema retorna valores totais, quantidade de pagamentos e status

  Scenario: Consultar detalhes por area tecnica
    When consulto os detalhes da folha por area tecnica
    Then o sistema retorna os editais agrupados por AreaTecnica com seus valores

  Scenario: Consultar historico de decisoes da folha
    When consulto o historico da folha
    Then o sistema retorna todas as DecisaoFolha com usuario, data e justificativa

  Scenario: Exportar folha em CSV
    When exporto a folha em formato CSV
    Then o sistema retorna um arquivo CSV com os dados dos bolsistas da folha
```
