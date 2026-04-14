# EP-11 — Cadastro e Gestao de Orcamentos de Fornecedor

**Bounded Context:** Comprovacao de Despesas
**Status:** Done
**Dependencias:** EP-06, EP-07, EP-08

## Descricao

Permitir que o coordenador do projeto possa cadastrar e gerenciar orcamentos de fornecedores vinculados a justificativas de despesa para comprovar a pesquisa de precos e selecao do melhor orcamento. O epico cobre o cadastro individual e em lote, upload de PDFs e selecao do orcamento vencedor.

## Criterios de aceite

- Usuarios podem criar, visualizar, editar e excluir orcamentos de fornecedor.
- Cada orcamento esta obrigatoriamente vinculado a uma justificativa de despesa (JustificativaDespesaId).
- Os campos obrigatorios sao: JustificativaDespesaId, Fornecedor, Valor (>= 0), Data e UrlArquivoPDF.
- E possivel criar orcamentos em lote (CreateBatch) para uma mesma justificativa.
- E possivel fazer upload do PDF do orcamento para o MinIO (UploadArquivo).
- E possivel obter URL pre-assinada para upload direto do cliente (GetPresignedUrl).
- Somente um orcamento por justificativa pode ser marcado como escolhido (Selecionar).
- E possivel listar orcamentos por justificativa (ListarPorJustificativa).
- A exclusao e logica (soft delete via DateDeleted).

---

## Casos de Uso

### Cadastrar e Gerenciar Orcamentos de Fornecedor

```gherkin
Feature: Cadastrar e Gerenciar Orcamentos de Fornecedor
  Como coordenador do projeto
  Quero cadastrar orcamentos de fornecedores vinculados a justificativas
  Para comprovar pesquisa de precos e selecao do melhor orcamento

  Background:
    Given que estou autenticado como usuario com token JWT valido
    And existe uma justificativa de despesa cadastrada

  Scenario: Criar orcamento de fornecedor com dados validos
    When crio um orcamento de fornecedor com:
      | Campo                  | Valor                    |
      | JustificativaDespesaId | {id-da-justificativa}    |
      | Fornecedor             | Fornecedor ABC Ltda      |
      | Valor                  | 12000.00                 |
      | Data                   | 2026-03-10               |
      | UrlArquivoPDF          | orcamento-abc.pdf        |
    Then o registro e criado com sucesso
    And Escolhido e inicializado como false

  Scenario: Criar orcamentos em lote (batch)
    When crio orcamentos em lote com 3 fornecedores para a mesma justificativa
    Then os 3 registros sao criados com sucesso

  Scenario: Impedir criacao com valor negativo
    When tento criar um orcamento com Valor = -500.00
    Then o sistema retorna erro de validacao "Valor deve ser maior ou igual a 0"

  Scenario: Impedir criacao sem fornecedor
    When tento criar um orcamento sem informar o Fornecedor
    Then o sistema retorna erro de validacao "Fornecedor e obrigatorio"

  Scenario: Upload de PDF do orcamento
    Given existe um orcamento de fornecedor cadastrado
    When faco upload do PDF do orcamento
    Then o arquivo e armazenado no MinIO
    And a URL do PDF e atualizada no registro

  Scenario: Obter URL pre-assinada para upload
    When solicito uma URL pre-assinada para upload
    Then o sistema retorna uma URL temporaria para upload direto ao MinIO

  Scenario: Selecionar orcamento como vencedor
    Given existem 3 orcamentos para uma mesma justificativa
    When seleciono o orcamento do Fornecedor ABC como escolhido
    Then o orcamento selecionado tem Escolhido = true
    And os demais orcamentos permanecem com Escolhido = false

  Scenario: Listar orcamentos por justificativa
    Given existem orcamentos vinculados a uma justificativa
    When listo os orcamentos pela justificativa
    Then o sistema retorna todos os orcamentos da justificativa

  Scenario: Atualizar orcamento de fornecedor
    Given existe um orcamento de fornecedor cadastrado
    When atualizo Fornecedor, Valor, Data e ArquivoPDF
    Then os dados sao atualizados com sucesso

  Scenario: Desmarcar orcamento como escolhido
    Given existe um orcamento marcado como escolhido
    When desmarco o orcamento
    Then Escolhido passa a ser false

  Scenario: Excluir orcamento (soft delete)
    Given existe um orcamento de fornecedor
    When excluo o orcamento
    Then o campo DateDeleted e preenchido com a data atual
```
