---
title: Gestão de Usuários do Backoffice
tipo: requisito
---

# Gestão de Usuários do Backoffice

O ConectaFapes tem uma área administrativa usada pela equipe interna da FAPES. Para controlar quem entra nessa área e o que cada pessoa pode fazer, o administrador cadastra os **usuários internos** e os **papéis** (perfis administrativos) que definem as permissões. Este requisito descreve o cadastro e a manutenção desses usuários e papéis, e as regras que garantem a integridade do controle de acesso.

## Atores

- **Administrador** — usuário interno responsável por cadastrar, visualizar, editar e excluir tanto os usuários administrativos quanto os papéis.
- **Usuário interno (backoffice)** — pessoa da equipe FAPES que recebe acesso à área administrativa e é associada a um ou mais papéis.
- **Sistema** — valida os dados informados, aplica as regras de unicidade e integridade e mantém as associações entre usuários e papéis.

## Fluxo principal

1. O administrador acessa a gestão de usuários do backoffice.
2. Para **criar um usuário**, informa nome, e-mail, CPF e os papéis que ele deve ter. O sistema valida os dados, cria o usuário, associa os papéis informados e prepara o acesso do usuário.
3. Para **consultar**, o administrador busca um usuário específico (que retorna com seus papéis) ou lista todos com paginação e filtros.
4. Para **editar**, o administrador altera os dados e a lista de papéis; o sistema ajusta as associações, adicionando os papéis novos e removendo os que saíram da lista.
5. Para **excluir**, o administrador remove o usuário e suas associações de papéis.
6. Em paralelo, o administrador **gerencia os papéis**: cria, lista, edita o nome e exclui papéis, respeitando a regra de que um papel em uso não pode ser removido.

## Regras de negócio

### Usuários internos

- Cada usuário possui **Nome**, **E-mail** e **CPF** obrigatórios.
- O **e-mail** deve ter formato válido. E-mail ausente ou em formato inválido impede a criação.
- O **CPF** deve conter exatamente 11 dígitos numéricos e ser válido pelo algoritmo de verificação. CPF ausente, com formato inválido (menos de 11 dígitos ou com letras) ou que não passa na validação impede a criação.
- O **CPF é único** no sistema: não é possível cadastrar dois usuários com o mesmo CPF.
- Um usuário pode ser associado a **múltiplos papéis**.
- Ao criar o usuário, o acesso dele é preparado automaticamente (geração do mecanismo de renovação de sessão) e os papéis informados são associados.
- Na **edição**, a lista de papéis é tratada de forma inteligente: os papéis que já estavam e continuam na nova lista permanecem; os que entram na lista são adicionados; os que saem da lista são removidos.
- A **exclusão** de um usuário remove também suas associações de papéis.

### Papéis (perfis administrativos)

- Cada papel possui um **Nome** obrigatório.
- O nome do papel é sempre armazenado em **letras maiúsculas** (por exemplo, "admin" é gravado como "ADMIN").
- Papel sem nome não pode ser criado.
- Tentar criar um papel com nome que já existe **não gera novo papel** (a criação simplesmente não acontece, sem erro explícito).
- Um papel **não pode ser excluído enquanto estiver associado a algum usuário**.
- As listagens de usuários e de papéis suportam **paginação** e **filtros**.

## Estados e transições

- **Usuário**: criado → (editado, com ajuste de dados e de papéis) → excluído. A cada edição, o conjunto de papéis é reconciliado (adiciona os novos, remove os ausentes, mantém os comuns).
- **Papel**: criado (nome em maiúsculas) → (nome editado) → excluído, sendo que a exclusão só é permitida quando o papel não está em uso.

## Casos especiais e exceções

- **CPF duplicado**: bloqueado com aviso "Usuário já cadastrado no sistema".
- **CPF com quantidade errada de dígitos ou com letras**: bloqueado com aviso de que o CPF deve conter exatamente 11 dígitos numéricos.
- **CPF que não passa na validação** (por exemplo, todos os dígitos iguais): bloqueado com aviso de que o CPF informado é inválido.
- **E-mail ausente**: bloqueado com aviso de que o e-mail é obrigatório.
- **E-mail em formato inválido**: bloqueado com aviso de formato inválido.
- **CPF ausente**: bloqueado com aviso de que o CPF é obrigatório.
- **Excluir usuário inexistente**: aviso "Usuário não encontrado no sistema".
- **Criar papel sem nome**: aviso de que o nome é obrigatório.
- **Criar papel com nome já existente**: nada acontece (falha silenciosa, sem novo papel).
- **Editar papel inexistente**: aviso de que o papel não foi encontrado.
- **Excluir papel em uso**: aviso "Não foi possível deletar a role pois está em uso".
- **Excluir papel inexistente**: aviso de que o papel não foi encontrado no sistema.

## Dados envolvidos

[[User]] · [[Role]] · [[RoleUser]]

## Funcionalidades relacionadas

- [[autenticacao-autorizacao]] — os papéis cadastrados aqui determinam as permissões aplicadas no acesso ao portal.
- [[gestao-pessoas-fisicas]] — a visão administrativa dos bolsistas é acessada por usuários internos com os papéis apropriados.
