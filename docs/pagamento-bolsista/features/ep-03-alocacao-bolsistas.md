# EP-03 — Alocacao de Bolsistas

**Bounded Context:** Alocacao
**Status:** Done
**Dependencias:** EP-02

## Descricao

Permitir que operadores possam alocar bolsistas a projetos vinculados a editais, definindo periodo de atividade, cotas de pagamento e vinculo com modalidade/nivel de bolsa. O epico garante que as alocacoes estejam disponiveis como base para pagamentos e gestao de bolsistas.

## Criterios de aceite

- Operadores podem criar, visualizar e cancelar alocacoes de bolsistas.
- Cada alocacao esta vinculada a um Projeto, uma Pessoa e uma VersaoNivel.
- A alocacao possui DataInicio, DataFimPrevistaAtividade e QtdeCotasAlocadas.
- O status da alocacao segue o ciclo: EM_EDICAO -> DOCUMENTACAO_PENDENTE -> AGUARDANDO_ACEITES -> PENDENTE_DE_AVALIACAO -> EM_AVALIACAO -> ATIVA -> CANCELADA | FINALIZADA.
- O cadastro bancario (Banestes) segue o ciclo: PENDENTE -> ENVIADO -> CADASTRADO.
- O cancelamento requer justificativa e registra o nome do solicitante.
- A flag deveCancelarCotaDataFim controla se a cota do mes de encerramento e cancelada (somente se status ALOCADO).
- Bolsistas podem ser consultados por CPF, nome ou por projeto.
- A matricula e unica por alocacao.

---

## Casos de Uso

### Alocar Bolsista a Projeto

```gherkin
Feature: Alocar Bolsista a Projeto
  Como operador da FAPES
  Quero alocar bolsistas a projetos de editais
  Para viabilizar o pagamento de bolsas conforme o periodo de atividade

  Background:
    Given que estou autenticado como usuario com papel "OPERADOR"
    And existe um edital com projeto ativo
    And existe uma pessoa cadastrada com dados bancarios

  Scenario: Criar alocacao com dados validos
    When crio uma alocacao de bolsista com:
      | Campo                    | Valor      |
      | DataInicio               | 2026-01-01 |
      | DataFimPrevistaAtividade | 2026-12-31 |
      | QtdeCotasAlocadas        | 12         |
      | PossuiReducaoBolsa       | false      |
    Then a alocacao e criada com status "EM_EDICAO"
    And o sistema registra a matricula unica
    And o StatusCadastroBaneste e definido como "PENDENTE"

  Scenario: Cancelar alocacao com justificativa
    Given existe uma alocacao com status "ATIVA"
    When cancelo a alocacao com:
      | Campo                    | Valor                        |
      | Justificativa            | Desistencia do bolsista      |
      | DeveCancelarCotaDataFim  | true                         |
    Then a alocacao passa para o status "CANCELADA"
    And a justificativa registra o nome do solicitante
    And as cotas com status "ALOCADO" do mes de encerramento sao canceladas

  Scenario: Impedir cancelamento de alocacao ja cancelada
    Given existe uma alocacao com status "CANCELADA"
    When tento cancelar a alocacao
    Then o sistema retorna erro "Alocacao ja se encontra cancelada"

  Scenario: Consultar bolsistas por CPF
    When consulto alocacoes pelo CPF "123.456.789-00"
    Then o sistema retorna as alocacoes vinculadas a pessoa com o CPF informado

  Scenario: Consultar bolsistas por projeto
    Given existe um projeto com bolsistas alocados
    When consulto os bolsistas do projeto
    Then o sistema retorna a lista de bolsistas alocados ao projeto

  Scenario: Estender periodo de alocacao
    Given existe uma alocacao com DataFimPrevistaAtividade "2026-06-30"
    When estendo a alocacao para "2026-12-31"
    Then a DataFimPrevistaAtividade e atualizada
    And novas cotas de pagamento sao criadas para o periodo estendido
    And cotas com inicio apos o dia 15 iniciam no mes seguinte
```
