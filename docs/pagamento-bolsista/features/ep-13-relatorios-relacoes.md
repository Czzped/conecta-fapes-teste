# EP-13 — Relatorios e Relacoes de Pagamento

**Bounded Context:** Documentos
**Status:** Done
**Dependencias:** EP-08

## Descricao

Permitir que operadores possam gerar relatorios e relacoes de pagamento em formato PDF, CSV e ZIP, consolidando informacoes de editais e bolsistas por folha de pagamento. O epico garante a producao de documentos para prestacao de contas e auditoria.

## Criterios de aceite

- Operadores podem gerar a Relacao de Editais por Pagamento em PDF, listando todos os editais da folha com valores.
- Operadores podem gerar a Relacao de Bolsistas por Pagamento em PDF (um por edital), retornados como ZIP.
- Operadores podem exportar os dados da folha em formato CSV.
- Operadores podem exportar e baixar todos os documentos de relacao de uma folha em formato ZIP.
- Os PDFs sao armazenados no MinIO (bucket BUCKET_RELACOES).
- A Relacao de Editais e armazenada em "relacao-editais-pagamento/".
- A Relacao de Bolsistas e armazenada em "relacao-bolsistas/".
- O ZIP consolidado e armazenado em "documentos-relacao-pagamento/Relacao-Pagamento-{FolhaId}.zip".

---

## Casos de Uso

### Gerar Relatorios e Relacoes de Pagamento

```gherkin
Feature: Gerar Relatorios e Relacoes de Pagamento
  Como operador da FAPES
  Quero gerar relatorios e relacoes de pagamento
  Para documentar e prestar contas sobre os pagamentos realizados

  Background:
    Given que estou autenticado como usuario com papel "OPERADOR"
    And existe uma folha com pagamentos consolidados

  Scenario: Gerar relacao de editais por pagamento
    When gero a relacao de editais por pagamento da folha
    Then o sistema gera um PDF listando todos os editais com valores
    And o arquivo e armazenado no MinIO em "relacao-editais-pagamento/"

  Scenario: Gerar relacao de bolsistas por pagamento
    When gero a relacao de bolsistas por pagamento da folha
    Then o sistema gera um PDF por edital com a lista de bolsistas
    And os PDFs sao retornados como um arquivo ZIP
    And os arquivos sao armazenados no MinIO em "relacao-bolsistas/"

  Scenario: Exportar folha em CSV
    When exporto a folha em formato CSV
    Then o sistema retorna um arquivo CSV com os dados dos bolsistas
    And o CSV contem: nome, CPF, matricula, valor, modalidade, projeto e edital

  Scenario: Exportar documentos de relacao da folha
    When exporto todos os documentos de relacao da folha
    Then o sistema gera um ZIP consolidado com todas as relacoes
    And o ZIP e armazenado em "documentos-relacao-pagamento/Relacao-Pagamento-{FolhaId}.zip"

  Scenario: Fazer download de documentos de relacao da folha
    Given os documentos de relacao ja foram exportados
    When faco download dos documentos de relacao da folha
    Then o sistema retorna o arquivo ZIP armazenado no MinIO
```
