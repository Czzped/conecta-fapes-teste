> **Documento depreciado.** A documentacao canonica migrou para [implementation/modules/M014-prestacao-contas/](../../implementation/modules/M014-prestacao-contas/backlog.md).

# EP-06 — Cadastro e Gestao de Justificativas de Despesa por Nota Fiscal

**Bounded Context:** Comprovacao de Despesas
**Status:** Done
**Dependencias:** EP-05

## Descricao

Permitir que o coordenador do projeto possa cadastrar e gerenciar justificativas de despesa baseadas em notas fiscais para comprovar gastos realizados no ambito do projeto. O epico cobre tanto a justificativa base (JustificativaDespesa) quanto a especializada por nota fiscal (JustificativaNF), incluindo upload de arquivos comprovantes.

## Criterios de aceite

- Usuarios podem criar, visualizar, editar e excluir justificativas de despesa por NF.
- Cada justificativa esta obrigatoriamente vinculada a uma prestacao de contas (PrestacaoId).
- Os campos obrigatorios sao: PrestacaoId, Descricao.
- JustificativaNF possui vinculo com DocumentoFiscal.
- O valor total da JustificativaNF e inicializado como 0 (derivado do documento fiscal).
- E possivel fazer upload de arquivo comprovante para o MinIO.
- E possivel obter URL pre-assinada para download do arquivo.
- A descricao pode ser atualizada individualmente (PatchDescricao).
- Justificativas possuem colecao de orcamentos de fornecedor vinculados.
- A exclusao e logica (soft delete via DateDeleted).

---

## Casos de Uso

### Cadastrar e Gerenciar Justificativa de Despesa por NF

```gherkin
Feature: Cadastrar e Gerenciar Justificativa de Despesa por NF
  Como coordenador do projeto
  Quero cadastrar justificativas de despesa vinculadas a notas fiscais
  Para comprovar gastos realizados no ambito do projeto

  Background:
    Given que estou autenticado como usuario com token JWT valido
    And existe uma prestacao de contas em status RASCUNHO

  Scenario: Criar justificativa de despesa por NF
    When crio uma justificativa NF com:
      | Campo       | Valor                          |
      | PrestacaoId | {id-da-prestacao}              |
      | Descricao   | Compra de material de consumo  |
    Then o registro e criado com sucesso
    And o valor total e inicializado como 0

  Scenario: Impedir criacao sem prestacao vinculada
    When tento criar uma justificativa sem informar o PrestacaoId
    Then o sistema retorna erro de validacao "PrestacaoId e obrigatorio"

  Scenario: Upload de arquivo comprovante
    Given existe uma justificativa de despesa cadastrada
    When faco upload de um arquivo comprovante
    Then o arquivo e armazenado no MinIO
    And a URL do arquivo e atualizada na justificativa

  Scenario: Obter URL pre-assinada para download
    Given existe uma justificativa com arquivo comprovante
    When solicito a URL pre-assinada
    Then o sistema retorna uma URL temporaria para download direto

  Scenario: Atualizar descricao da justificativa (Patch)
    Given existe uma justificativa de despesa cadastrada
    When atualizo apenas a descricao via PatchDescricao
    Then a descricao e atualizada sem alterar outros campos

  Scenario: Listar justificativas de despesa
    Given existem justificativas cadastradas
    When solicito a listagem
    Then o sistema retorna todas as justificativas ativas

  Scenario: Excluir justificativa (soft delete)
    Given existe uma justificativa de despesa
    When excluo a justificativa
    Then o campo DateDeleted e preenchido com a data atual
```
