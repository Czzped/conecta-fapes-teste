# EP-__ — Cadastro e Gestão de [Entidade]

**Bounded Context:** [Bounded Context]
**Status:** [Todo | In Progress | Done]
**Dependências:** [EP-XX | Nenhuma]

## Descrição

Permitir que [ator] possa [ação] para [finalidade]. O épico garante que [entidade] esteja disponível como base para [contexto de uso].

## Critérios de aceite

- Operadores podem criar, visualizar, editar e inativar [entidade].
- Cada [entidade] está obrigatoriamente vinculada a [dependência].
- O status é controlável e refletido em todas as consultas.
- Somente registros com status adequado podem ser associados a [contexto].
- [Campo obrigatório] é único por [entidade].

---

## Casos de Uso

### Cadastrar e Gerenciar [Entidade]

```gherkin
Feature: Cadastrar e Gerenciar [Entidade]
  Como operador da [Organização]
  Quero cadastrar, editar e inativar [entidade]
  Para [finalidade]

  Background:
    Given que estou autenticado como usuário com papel "OPERADOR"

  Scenario: Criar [entidade] com dados válidos
    When crio [entidade] com:
      | Campo             | Valor             |
      | [CampoObrigatorio1] | [Exemplo 1]     |
      | [CampoObrigatorio2] | [Exemplo 2]     |
      | [CampoObrigatorio3] | [Exemplo 3]     |
    Then o registro é criado com status "ATIVO"
    And o sistema registra o usuário e horário da criação

  Scenario: Impedir criação com [campo] duplicado
    Given já existe um registro com [Campo] "[valor]"
    When tento criar outro registro com o mesmo [Campo]
    Then o sistema retorna erro "Já existe um registro com este [campo]"

  Scenario: Impedir criação sem campo obrigatório
    When tento criar [entidade] sem informar o [CampoObrigatorio]
    Then o sistema retorna erro de validação "[Campo] é obrigatório"

  Scenario: Inativar [entidade] sem dependências vinculadas
    Given existe um registro com status "ATIVO" sem vínculos ativos
    When inativo o registro
    Then o registro passa para o status "INATIVO"
    And o registro não aparece como opção para associação a novos [contexto]

  Scenario: Impedir associação de [entidade] inativa a [contexto]
    Given existe um registro com status "INATIVO"
    When tento associar o registro a [contexto]
    Then o sistema retorna erro "Somente registros com status ATIVO podem ser associados a [contexto]"
```
