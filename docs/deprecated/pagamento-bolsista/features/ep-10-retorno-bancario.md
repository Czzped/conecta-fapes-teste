> **Documento depreciado.** A documentacao canonica migrou para [implementation/modules/M004-pagamento-bolsista/](../../implementation/modules/M004-pagamento-bolsista/backlog.md).

# EP-10 — Processamento de Retorno Bancario

**Bounded Context:** Remessa
**Status:** Done
**Dependencias:** EP-09

## Descricao

Permitir que operadores possam processar os arquivos de retorno bancario (DP1 e DP9) recebidos do banco, atualizando o status de cadastro e pagamento dos bolsistas conforme o resultado do processamento. O epico garante o fechamento do ciclo de pagamento com rastreabilidade de erros.

## Criterios de aceite

- O sistema processa retornos DP1 de cadastro, atualizando StatusCadastroBaneste para CADASTRADO (sucesso) ou registrando erros.
- O sistema processa retornos DP1 de pagamento, atualizando PagamentoBolsista para PAGO (sucesso) ou registrando erros de agendamento.
- O sistema processa retornos DP9, atualizando o status da RemessaPagamento conforme progresso bancario: ENVIADA -> AGENDADA -> AUTORIZADA -> EFETIVADA.
- Quando a RemessaPagamento atinge status EFETIVADA, a Folha e atualizada para PAGA.
- Arquivos de retorno podem ser enviados via upload e sao armazenados no MinIO antes do processamento.
- Erros de cadastro (ErroCadastro) e de agendamento (ErroAgendamentoPagamento) sao registrados com codigos de erro.
- E possivel consultar erros de retorno por folha e por tipo de remessa.

---

## Casos de Uso

### Processar Retorno Bancario

```gherkin
Feature: Processar Retorno Bancario
  Como operador da FAPES
  Quero processar os arquivos de retorno do banco
  Para atualizar o status de cadastro e pagamento dos bolsistas

  Background:
    Given que estou autenticado como usuario com papel "OPERADOR"

  Scenario: Processar retorno DP1 de cadastro com sucesso
    Given existe uma remessa de cadastro enviada
    When processo o retorno DP1 de cadastro
    Then as alocacoes processadas com sucesso tem StatusCadastroBaneste atualizado para "CADASTRADO"

  Scenario: Processar retorno DP1 de cadastro com erros
    When processo o retorno DP1 de cadastro com registros com erro
    Then os erros sao registrados como ErroCadastro com codigos de erro
    And as alocacoes com erro mantem o status anterior

  Scenario: Upload de arquivo de retorno de cadastro
    When faco upload do arquivo de retorno de cadastro
    Then o arquivo e armazenado no MinIO
    And o sistema inicia o processamento do retorno

  Scenario: Processar retorno DP1 de pagamento com sucesso
    Given existe uma remessa de pagamento enviada
    When processo o retorno DP1 de pagamento
    Then os pagamentos processados com sucesso passam para status "PAGO"
    And o status da RemessaPagamento e atualizado

  Scenario: Processar retorno DP1 de pagamento com erros
    When processo o retorno DP1 de pagamento com registros com erro
    Then os erros sao registrados como ErroAgendamentoPagamento com codigos de erro

  Scenario: Processar retorno DP9 com atualizacao de status
    Given existe uma remessa de pagamento com status "ENVIADA"
    When processo o retorno DP9
    Then o status da RemessaPagamento e atualizado conforme o progresso bancario

  Scenario: Folha atualizada para PAGA apos efetivacao
    Given a RemessaPagamento atinge status "EFETIVADA"
    Then a Folha vinculada e atualizada para status "PAGA"

  Scenario: Consultar erros de retorno de pagamento por folha
    When consulto os erros de retorno de pagamento da folha
    Then o sistema retorna os registros de ErroAgendamentoPagamento com detalhes

  Scenario: Consultar erros de retorno de cadastro
    When consulto os erros de retorno de cadastro
    Then o sistema retorna os registros de ErroCadastro com codigos e alocacoes afetadas
```
