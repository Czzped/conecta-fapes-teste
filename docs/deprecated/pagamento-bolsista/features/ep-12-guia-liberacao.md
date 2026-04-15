> **Documento depreciado.** A documentacao canonica migrou para [implementation/modules/M004-pagamento-bolsista/](../../implementation/modules/M004-pagamento-bolsista/backlog.md).

# EP-12 — Guia de Liberacao (PDF)

**Bounded Context:** Documentos
**Status:** Done
**Dependencias:** EP-08

## Descricao

Permitir que operadores possam gerar guias de liberacao em formato PDF para envio ao banco, contendo os dados de pagamento consolidados da folha. O epico garante a emissao de documentos oficiais para liberacao de pagamentos nos bancos Banestes e Bandes.

## Criterios de aceite

- Operadores podem gerar guias de liberacao nos formatos Banestes (normal) e Bandes (alternativo).
- Cada guia esta vinculada a uma Folha e possui tipo NORMAL ou ALTERNATIVA.
- O TextoEmail deve ter menos de 500 caracteres.
- A QuantPagamentos deve ser >= 1.
- O ValorTotal deve ser > 0.
- A guia Bandes segue nomenclatura: "GuiaLiberacaoBandes-{Ano}-{MES}-INDIVIDUAL.pdf".
- Os arquivos PDF sao armazenados no MinIO (bucket BUCKET_GUIAS).
- E possivel consultar as guias de liberacao geradas por folha.

---

## Casos de Uso

### Gerar Guia de Liberacao

```gherkin
Feature: Gerar Guia de Liberacao em PDF
  Como operador da FAPES
  Quero gerar guias de liberacao para envio ao banco
  Para formalizar a autorizacao de pagamento dos bolsistas

  Background:
    Given que estou autenticado como usuario com papel "OPERADOR"
    And existe uma folha com pagamentos consolidados

  Scenario: Gerar guia de liberacao Banestes
    When gero a guia de liberacao no formato Banestes com:
      | Campo           | Valor                          |
      | TextoEmail      | Segue guia de liberacao ref. 01/2026 |
      | QuantPagamentos | 150                            |
      | ValorTotal      | 350000.00                      |
    Then a guia e gerada como PDF com tipo "NORMAL"
    And o arquivo e armazenado no MinIO
    And a guia e vinculada a folha e aos pagamentos

  Scenario: Gerar guia de liberacao Bandes
    When gero a guia de liberacao no formato Bandes com:
      | Campo           | Valor     |
      | QuantPagamentos | 10        |
      | ValorTotal      | 25000.00  |
    Then a guia e gerada como PDF com tipo "ALTERNATIVA"
    And o nome do arquivo segue o padrao "GuiaLiberacaoBandes-2026-JAN-INDIVIDUAL.pdf"
    And o arquivo e armazenado no MinIO

  Scenario: Impedir geracao com TextoEmail excedendo limite
    When tento gerar uma guia com TextoEmail de 500 ou mais caracteres
    Then o sistema retorna erro "TextoEmail deve ter menos de 500 caracteres"

  Scenario: Impedir geracao com QuantPagamentos zero
    When tento gerar uma guia com QuantPagamentos "0"
    Then o sistema retorna erro "QuantPagamentos deve ser maior ou igual a 1"

  Scenario: Impedir geracao com ValorTotal zero
    When tento gerar uma guia com ValorTotal "0.00"
    Then o sistema retorna erro "ValorTotal deve ser maior que zero"

  Scenario: Consultar guias de liberacao por folha
    When consulto as guias de liberacao da folha
    Then o sistema retorna as guias geradas com tipo, data de envio e valores
```
