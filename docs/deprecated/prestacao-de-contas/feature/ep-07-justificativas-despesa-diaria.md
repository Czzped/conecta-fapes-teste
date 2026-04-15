> **Documento depreciado.** A documentacao canonica migrou para [implementation/modules/M014-prestacao-contas/](../../implementation/modules/M014-prestacao-contas/backlog.md).

# EP-07 — Cadastro e Gestao de Justificativas de Despesa por Diaria

**Bounded Context:** Comprovacao de Despesas
**Status:** Done
**Dependencias:** EP-05

## Descricao

Permitir que o coordenador do projeto possa cadastrar e gerenciar justificativas de despesa por diarias para comprovar gastos com deslocamentos de bolsistas. O epico garante o registro de diarias com valor unitario, quantidade e vinculo com a alocacao do bolsista.

## Criterios de aceite

- Usuarios podem criar, visualizar, editar e excluir justificativas de diaria.
- Cada justificativa esta obrigatoriamente vinculada a uma prestacao de contas (PrestacaoId).
- Os campos obrigatorios sao: PrestacaoId, Descricao, ValorTotal, ValorDiaria, Quantidade e AlocacaoBolsistaId.
- ValorDiaria deve ser maior ou igual a 0.
- Quantidade deve ser maior que 0.
- AlocacaoBolsistaId deve ser valido (referencia a AlocacaoBolsistaRef).
- Justificativas herdam a capacidade de vinculacao de orcamentos de fornecedor.
- A exclusao e logica (soft delete via DateDeleted).

---

## Casos de Uso

### Cadastrar e Gerenciar Justificativa de Despesa por Diaria

```gherkin
Feature: Cadastrar e Gerenciar Justificativa de Despesa por Diaria
  Como coordenador do projeto
  Quero cadastrar justificativas de despesa por diarias
  Para comprovar gastos com deslocamentos de bolsistas

  Background:
    Given que estou autenticado como usuario com token JWT valido
    And existe uma prestacao de contas em status RASCUNHO
    And existe uma alocacao de bolsista valida

  Scenario: Criar justificativa de diaria com dados validos
    When crio uma justificativa de diaria com:
      | Campo                | Valor                        |
      | PrestacaoId          | {id-da-prestacao}            |
      | Descricao            | Viagem a conferencia         |
      | ValorTotal           | 1500.00                      |
      | ValorDiaria          | 500.00                       |
      | Quantidade           | 3                            |
      | AlocacaoBolsistaId   | {id-da-alocacao}             |
    Then o registro e criado com sucesso

  Scenario: Impedir criacao com ValorDiaria negativo
    When tento criar uma justificativa de diaria com ValorDiaria = -100.00
    Then o sistema retorna erro de validacao "ValorDiaria deve ser maior ou igual a 0"

  Scenario: Impedir criacao com Quantidade zero
    When tento criar uma justificativa de diaria com Quantidade = 0
    Then o sistema retorna erro de validacao "Quantidade deve ser maior que 0"

  Scenario: Impedir criacao sem alocacao de bolsista
    When tento criar uma justificativa de diaria sem informar AlocacaoBolsistaId
    Then o sistema retorna erro de validacao "AlocacaoBolsistaId e obrigatorio"

  Scenario: Listar justificativas de diaria
    Given existem justificativas de diaria cadastradas
    When solicito a listagem
    Then o sistema retorna todas as justificativas de diaria ativas

  Scenario: Buscar justificativa por ID
    Given existe uma justificativa de diaria com ID conhecido
    When busco a justificativa pelo ID
    Then o sistema retorna os dados completos incluindo ValorDiaria, Quantidade e AlocacaoBolsistaId

  Scenario: Atualizar justificativa de diaria
    Given existe uma justificativa de diaria cadastrada
    When atualizo os dados da justificativa
    Then os dados sao atualizados com sucesso

  Scenario: Excluir justificativa (soft delete)
    Given existe uma justificativa de diaria
    When excluo a justificativa
    Then o campo DateDeleted e preenchido com a data atual
```
