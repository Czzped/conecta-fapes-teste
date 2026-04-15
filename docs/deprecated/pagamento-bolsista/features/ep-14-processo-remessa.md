> **Documento depreciado.** A documentacao canonica migrou para [implementation/modules/M004-pagamento-bolsista/](../../implementation/modules/M004-pagamento-bolsista/backlog.md).

# EP-14 — Monitoramento de Processos de Remessa

**Bounded Context:** Remessa
**Status:** Done
**Dependencias:** EP-09

## Descricao

Permitir que operadores possam monitorar o processamento assincrono de remessas bancarias, visualizando status, tentativas e erros. O epico garante visibilidade e controle sobre o ciclo de vida dos processos de remessa executados em background (Hangfire).

## Criterios de aceite

- Operadores podem listar processos de remessa com filtros e paginacao.
- Cada ProcessoRemessa possui DataInicio, DataFinalizacao, Tentativa, Limite, Status, Tipo e paths de armazenamento.
- O status segue o ciclo: AGUARDANDO_PROCESSAMENTO -> EM_PROCESSAMENTO -> PROCESSADA_COM_SUCESSO | PROCESSADA_COM_ERRO.
- O tipo identifica se e REMESSA_CADASTRO_BOLSISTAS ou REMESSA_PAGAMENTO.
- Operadores podem fazer retry de processos com erro, incrementando o Limite em 3.
- E possivel fazer download do arquivo original, do arquivo de retorno e do payload JSON do processo.
- Os processos sao executados via jobs assincrono (Hangfire).

---

## Casos de Uso

### Monitorar Processos de Remessa

```gherkin
Feature: Monitorar Processos de Remessa
  Como operador da FAPES
  Quero monitorar o status dos processos de remessa bancaria
  Para acompanhar o envio e identificar falhas no processamento

  Background:
    Given que estou autenticado como usuario com papel "OPERADOR"

  Scenario: Listar processos de remessa com filtros
    When consulto os processos de remessa com filtros
    Then o sistema retorna a lista paginada de processos
    And cada processo exibe Status, Tipo, DataInicio, Tentativa e Limite

  Scenario: Visualizar processo com status de sucesso
    Given existe um processo com status "PROCESSADA_COM_SUCESSO"
    When consulto os detalhes do processo
    Then o sistema retorna DataInicio, DataFinalizacao e detalhes do processamento

  Scenario: Visualizar processo com status de erro
    Given existe um processo com status "PROCESSADA_COM_ERRO"
    When consulto os detalhes do processo
    Then o sistema retorna os detalhes do erro e a quantidade de tentativas

  Scenario: Retry de processo com erro
    Given existe um processo com status "PROCESSADA_COM_ERRO"
    When faco retry do processo
    Then o Limite e incrementado em 3
    And o processo e reenfileirado para processamento

  Scenario: Download do arquivo original da remessa
    When faco download do arquivo original do processo de remessa de cadastro
    Then o sistema retorna o arquivo armazenado no MinIO

  Scenario: Download do arquivo de retorno
    When faco download do arquivo de retorno do processo
    Then o sistema retorna o arquivo de retorno armazenado no MinIO

  Scenario: Download do payload JSON do processo
    When faco download do payload JSON do processo
    Then o sistema retorna o JSON com os dados enviados no processamento
```
