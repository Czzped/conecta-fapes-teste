---
title: Gestão de Aplicações
tipo: requisito
---

# Gestão de Aplicações

O ConectaFapes mantém um cadastro de **aplicações** usado para organização interna do sistema. Cada aplicação representa um item que serve de base para integrações e configurações internas. Este requisito descreve como a equipe interna cadastra, consulta, edita e remove essas aplicações, além das regras que garantem que cada registro tenha nome e descrição e que o histórico de quem criou e alterou fique registrado.

## Atores

- **Operador (equipe interna)** — usuário da área administrativa responsável por criar, visualizar, editar e excluir as aplicações.
- **Sistema** — valida os dados informados, registra automaticamente autoria e horários, aplica a exclusão sem apagar o registro e organiza as consultas com paginação.

## Fluxo principal

1. O operador acessa a gestão de aplicações, já autenticado.
2. Para **criar**, informa o **Nome** e a **Descrição** da aplicação. O sistema valida os campos, cria o registro com situação ativa e guarda automaticamente quem criou e o horário da criação.
3. Para **consultar**, o operador lista todas as aplicações (em páginas de 25 registros, com apoio de filtros e ordenação) ou busca uma aplicação específica pelo seu identificador, recebendo os dados completos.
4. Para **editar**, o operador altera o Nome e a Descrição de uma aplicação existente. O sistema salva as mudanças e registra o horário da atualização.
5. Para **excluir**, o operador remove a aplicação. O sistema registra a data de exclusão e a aplicação deixa de aparecer nas consultas normais, sem que o registro seja apagado de fato.

## Regras de negócio

- Cada aplicação possui **Nome** e **Descrição**, ambos obrigatórios.
- Não é possível criar uma aplicação **sem nome**: o sistema impede e informa que o nome é obrigatório.
- Não é possível criar uma aplicação **sem descrição**: o sistema impede e informa que a descrição é obrigatória.
- Ao criar, a aplicação nasce com situação **ativa**.
- O sistema registra **automaticamente** o usuário e o horário da criação, e o horário de cada atualização, sem que o operador precise informar esses dados.
- A **exclusão preserva o histórico**: o registro não é apagado, apenas marcado com a data de exclusão (exclusão suave). Após excluída, a aplicação não aparece mais nas consultas comuns.
- As consultas são apresentadas em **páginas de 25 registros** e permitem filtrar, ordenar e trazer informações relacionadas com um limite de profundidade nesse detalhamento.
- Todas as operações exigem que o operador esteja **autenticado**.

## Estados e transições

- **Ativa** — situação do registro logo após a criação; a aplicação aparece nas consultas.
- **Editada** — a aplicação continua ativa; apenas Nome e/ou Descrição mudam, e o horário da atualização é registrado.
- **Excluída** — a aplicação recebe uma data de exclusão e some das consultas comuns, mas o registro permanece guardado no sistema.

Transições: criada (ativa) → editada (permanece ativa) → excluída (marcada com data de exclusão).

## Casos especiais e exceções

- **Criar sem nome**: bloqueado, com aviso "O nome da aplicação é obrigatório."
- **Criar sem descrição**: bloqueado, com aviso "A descrição da aplicação é obrigatória."
- **Buscar por identificador válido**: retorna os dados completos da aplicação.
- **Aplicação excluída**: continua guardada no sistema, porém não aparece nas consultas padrão.

## Dados envolvidos

[[Aplicacao]]

## Funcionalidades relacionadas

- [[autenticacao-autorizacao]] — todas as operações de aplicações exigem que o operador esteja autenticado na área administrativa.
