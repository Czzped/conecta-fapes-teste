# EP-04 — Gestão de Usuários do Backoffice

**Bounded Context:** GestaoUsuarioBackoffice
**Status:** Done
**Dependências:** Nenhuma

## Descrição

Permitir que administradores possam cadastrar, visualizar, editar e excluir usuários e papéis (roles) do sistema backoffice. O épico garante que o controle de acesso esteja devidamente configurado, com usuários associados a papéis que determinam suas permissões no ConectaFapes.

## Critérios de aceite

- Administradores podem criar, visualizar, editar e excluir usuários do backoffice.
- Administradores podem criar, visualizar, editar e excluir papéis (roles).
- Cada usuário possui Nome, Email (formato válido) e CPF (11 dígitos, validado) obrigatórios.
- Cada papel possui um Nome obrigatório (armazenado em UPPERCASE).
- Usuários podem ser associados a múltiplos papéis.
- CPF é único por usuário no sistema.
- Papéis não podem ser excluídos se estiverem associados a usuários.
- Listagens suportam paginação e filtragem.

---

## Casos de Uso

### Cadastrar e Gerenciar Usuários

```gherkin
Feature: Cadastrar e Gerenciar Usuários do Backoffice
  Como administrador do ConectaFapes
  Quero cadastrar, editar e excluir usuários do backoffice
  Para controlar quem tem acesso ao sistema administrativo

  Background:
    Given que estou autenticado como administrador

  Scenario: Criar usuário com dados válidos
    When crio um usuário com:
      | Campo | Valor                    |
      | Name  | "João da Silva"          |
      | Email | "joao@fapes.es.gov.br"   |
      | Cpf   | "12345678901"            |
      | Roles | ["ADMIN", "OPERADOR"]    |
    Then o usuário é criado com sucesso
    And um RefreshToken é gerado automaticamente
    And os papéis são associados ao usuário

  Scenario: Impedir criação com CPF duplicado
    Given já existe um usuário com CPF "12345678901"
    When tento criar outro usuário com o mesmo CPF
    Then o sistema retorna erro "Usuário já cadastrado no sistema"

  Scenario: Impedir criação com CPF inválido
    When tento criar um usuário com CPF "123"
    Then o sistema retorna erro "O CPF deve conter exatamente 11 dígitos numéricos."

  Scenario: Impedir criação com CPF com formato inválido
    When tento criar um usuário com CPF "1234567890A"
    Then o sistema retorna erro "O CPF deve conter exatamente 11 dígitos numéricos."

  Scenario: Validação de CPF com algoritmo
    When tento criar um usuário com CPF "00000000000"
    Then o sistema retorna erro "O CPF informado é inválido."

  Scenario: Impedir criação com email inválido
    When tento criar um usuário com Email "email-invalido"
    Then o sistema retorna erro "Formato de e-mail inválido."

  Scenario: Impedir criação sem email
    When tento criar um usuário sem informar o Email
    Then o sistema retorna erro "O e-mail é obrigatório."

  Scenario: Impedir criação sem CPF
    When tento criar um usuário sem informar o CPF
    Then o sistema retorna erro "O CPF é obrigatório."

  Scenario: Buscar usuário por ID
    Given existe um usuário cadastrado
    When consulto o usuário pelo Id
    Then o sistema retorna os dados do usuário com seus papéis

  Scenario: Listar usuários com paginação
    When consulto a lista de usuários
    Then o sistema retorna uma lista paginada
    And cada usuário inclui seus papéis associados

  Scenario: Atualizar dados do usuário
    Given existe um usuário cadastrado com papéis ["ADMIN"]
    When atualizo o usuário com:
      | Campo | Valor                     |
      | Name  | "João da Silva Atualizado"|
      | Email | "joao.novo@fapes.es.gov.br"|
      | Cpf   | "12345678901"             |
      | Roles | ["ADMIN", "COORDENADOR"]  |
    Then os dados são atualizados com sucesso
    And o papel "COORDENADOR" é adicionado
    And papéis que não estão na nova lista são removidos

  Scenario: Gerenciamento inteligente de papéis na atualização
    Given existe um usuário com papéis ["ADMIN", "OPERADOR"]
    When atualizo os papéis para ["ADMIN", "COORDENADOR"]
    Then o papel "OPERADOR" é removido
    And o papel "COORDENADOR" é adicionado
    And o papel "ADMIN" permanece inalterado

  Scenario: Excluir usuário
    Given existe um usuário cadastrado
    When excluo o usuário
    Then o usuário e suas associações de papéis são removidos
    And o sistema retorna confirmação de exclusão

  Scenario: Impedir exclusão de usuário inexistente
    When tento excluir um usuário com Id inexistente
    Then o sistema retorna erro "Usuário não encontrado no sistema"
```

### Cadastrar e Gerenciar Papéis (Roles)

```gherkin
Feature: Cadastrar e Gerenciar Papéis (Roles)
  Como administrador do ConectaFapes
  Quero cadastrar, editar e excluir papéis
  Para definir as permissões disponíveis no sistema

  Background:
    Given que estou autenticado como administrador

  Scenario: Criar papel com dados válidos
    When crio um papel com:
      | Campo | Valor  |
      | Name  | "admin"|
    Then o papel é criado com Nome "ADMIN" (convertido para UPPERCASE)

  Scenario: Impedir criação com Nome duplicado
    Given já existe um papel com Nome "ADMIN"
    When tento criar outro papel com Nome "admin"
    Then a criação falha silenciosamente (sem erro explícito)

  Scenario: Impedir criação sem Nome
    When tento criar um papel sem informar o Nome
    Then o sistema retorna erro "O nome é obrigatório."

  Scenario: Listar papéis com paginação
    When consulto a lista de papéis
    Then o sistema retorna uma lista paginada com Id e Nome

  Scenario: Atualizar nome do papel
    Given existe um papel cadastrado
    When atualizo o Nome do papel
    Then o nome é atualizado com sucesso

  Scenario: Impedir atualização de papel inexistente
    When tento atualizar um papel com Id inexistente
    Then o sistema retorna erro "Role não encontrada"

  Scenario: Excluir papel sem usuários associados
    Given existe um papel sem usuários associados
    When excluo o papel
    Then o papel é removido com sucesso

  Scenario: Impedir exclusão de papel com usuários associados
    Given existe um papel associado a usuários
    When tento excluir o papel
    Then o sistema retorna erro "Não foi possível deletar a role pois está em uso"

  Scenario: Impedir exclusão de papel inexistente
    When tento excluir um papel com Id inexistente
    Then o sistema retorna erro "Role não encontrada no sistema"
```
