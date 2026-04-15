> **Documento depreciado.** A documentacao canonica migrou para [implementation/modules/M004-pagamento-bolsista/](../../implementation/modules/M004-pagamento-bolsista/backlog.md).

# EP-01 — Gestao de Calendario e Plano Mensal

**Bounded Context:** Planejamento
**Status:** Done
**Dependencias:** Nenhuma

## Descricao

Permitir que operadores possam criar e gerenciar o calendario anual de planos mensais para definir os marcos de solicitacao de bolsa, geracao de folha e pagamento. O epico garante que o planejamento temporal esteja disponivel como base para todas as operacoes de folha de pagamento e liberacao de editais.

## Criterios de aceite

- Operadores podem criar, visualizar, editar e excluir planos mensais.
- Planos mensais podem ser criados em lote (bulk) para um ano inteiro.
- Cada plano mensal possui tres marcos obrigatorios: MarcoSolicitacaoBolsa, MarcoGeracaoFolha e MarcoPagamento.
- A ordem dos marcos e respeitada: MarcoSolicitacaoBolsa <= MarcoGeracaoFolha <= MarcoPagamento.
- MarcoSolicitacaoBolsa deve estar no mes de vigencia ou no mes anterior.
- MarcoGeracaoFolha deve estar dentro do mes de vigencia.
- MarcoPagamento pode estar no mes de vigencia ou no mes seguinte.
- MarcoGeracaoFolha deve ser anterior ao MarcoSolicitacaoBolsa do mes seguinte.
- Nao e possivel alterar MarcoPagamento se ja existem folhas geradas ou autorizadas.
- Nao e possivel alterar MarcoSolicitacaoBolsa se a data ja passou.
- Somente um plano mensal pode estar marcado como atual (EhAtual = true).
- O calendario pode ser consultado por ano, exibindo planos mensais com suas folhas.

---

## Casos de Uso

### Criar e Gerenciar Calendario Anual

```gherkin
Feature: Criar e Gerenciar Calendario Anual de Planos Mensais
  Como operador da FAPES
  Quero cadastrar e gerenciar o calendario anual de planos mensais
  Para definir os marcos temporais de solicitacao, geracao de folha e pagamento

  Background:
    Given que estou autenticado como usuario com papel "OPERADOR"

  Scenario: Criar calendario anual em lote
    When crio planos mensais em lote para o ano "2026" com:
      | Mes        | MarcoSolicitacaoBolsa | MarcoGeracaoFolha | MarcoPagamento |
      | 2026-01-01 | 2025-12-20            | 2026-01-10        | 2026-01-25     |
      | 2026-02-01 | 2026-01-20            | 2026-02-10        | 2026-02-25     |
    Then os planos mensais sao criados com sucesso
    And cada plano mensal registra o usuario e horario da criacao

  Scenario: Impedir criacao com marcos fora de ordem
    When tento criar um plano mensal com:
      | Mes        | MarcoSolicitacaoBolsa | MarcoGeracaoFolha | MarcoPagamento |
      | 2026-03-01 | 2026-03-15            | 2026-03-10        | 2026-03-25     |
    Then o sistema retorna erro de validacao sobre a ordem dos marcos

  Scenario: Impedir alteracao de MarcoSolicitacaoBolsa ja ultrapassado
    Given existe um plano mensal com MarcoSolicitacaoBolsa "2026-01-20" e a data atual e posterior
    When tento alterar o MarcoSolicitacaoBolsa
    Then o sistema retorna erro "Nao e possivel alterar o marco de solicitacao de bolsa apos a data ter passado"

  Scenario: Impedir alteracao de MarcoPagamento com folhas geradas
    Given existe um plano mensal com folhas no status "GERADA"
    When tento alterar o MarcoPagamento
    Then o sistema retorna erro "Nao e possivel alterar o marco de pagamento com folhas ja geradas"

  Scenario: Consultar calendario por ano
    Given existem planos mensais cadastrados para o ano "2026"
    When consulto o calendario do ano "2026"
    Then o sistema retorna todos os planos mensais do ano com suas respectivas folhas

  Scenario: Consultar plano mensal atual
    Given existe um plano mensal com EhAtual = true
    When consulto o plano mensal atual
    Then o sistema retorna o plano mensal vigente

  Scenario: Consultar anos disponiveis
    When consulto os anos do calendario
    Then o sistema retorna a lista de anos que possuem planos mensais cadastrados
```
