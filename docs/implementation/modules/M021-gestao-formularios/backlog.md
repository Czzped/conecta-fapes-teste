# Sub-Backlog: M021 - Gestao de Formularios

[Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

O M021 oferece uma base central de formularios reutilizaveis para uso pelos demais modulos.

Especificacao de referencia: [README.md](README.md)

---

## Backlog - Release 1

Nesta release, o foco sera dar suporte aos formularios de caracterizacao, pois eles atendem ao primeiro uso do M021 na submissao de propostas. Ainda assim, a estrutura do modulo sera preparada para evoluir para os demais tipos de formulario, mantendo o ciclo de vida, a classificacao, as respostas e os contratos alinhados para posterior inclusao de formularios de avaliacao e habilitacao.

O cadastro de categorias nao e fundamental para viabilizar a Release 1. Se isso ajudar a reduzir o tempo de entrega, a release pode ser implementada considerando categorias pre-cadastradas diretamente no banco de dados.

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M021-001 | Cadastrar Categoria de Formulario | RN14, RN15, RN27, RN31 | Should | To Do | [EPIC-M021-001](epics/EPIC-M021-001.md) |
| EPIC-M021-002 | Cadastrar Formulario de Caracterizacao | RN01-RN06, RN13, RN15-RN17, RN28-RN30 | Must | To Do | [EPIC-M021-002](epics/EPIC-M021-002.md) |
| EPIC-M021-003 | Gerenciar Ciclo de Vida de Formulario | RN07-RN12 | Must | To Do | [EPIC-M021-003](epics/EPIC-M021-003.md) |
| EPIC-M021-004 | Gerenciar Respostas de Formulario de Caracterizacao | RN09, RN12, RN17, RN24-RN26, RN28-RN29 | Must | To Do | [EPIC-M021-004](epics/EPIC-M021-004.md) |

## Backlog - Release 2

Esta release trata de adequar as funcionalidades de cadastro e respostas para formularios de avaliacao. A prioridade nao esta como Must apenas para reforcar que esses EPICs nao devem ser tratados em um primeiro momento.

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M021-005 | Cadastrar Formulario de Avaliacao | RN01-RN06, RN13, RN15, RN16, RN22, RN28-RN30 | Should | To Do | [EPIC-M021-005](epics/EPIC-M021-005.md) |
| EPIC-M021-006 | Gerenciar Respostas de Formulario de Avaliacao | RN09, RN12, RN22-RN26, RN28-RN29 | Should | To Do | [EPIC-M021-006](epics/EPIC-M021-006.md) |

## Backlog - Release 3

Esta release trata de adequar as funcionalidades de cadastro e respostas para formularios de habilitacao. A prioridade nao esta como Must apenas para reforcar que esses EPICs nao devem ser tratados em um primeiro momento.

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M021-007 | Cadastrar Formulario de Habilitacao | RN01-RN06, RN13, RN15, RN16, RN18, RN28-RN30 | Should | To Do | [EPIC-M021-007](epics/EPIC-M021-007.md) |
| EPIC-M021-008 | Gerenciar Respostas de Formulario de Habilitacao | RN09, RN12, RN18-RN21, RN24-RN26, RN28-RN29 | Should | To Do | [EPIC-M021-008](epics/EPIC-M021-008.md) |

---

## Rastreabilidade

```text
Release 1

EPIC-M021-001 (Cadastrar Categoria de Formulario)
|-- US-M021-001 Criar categoria
|-- US-M021-002 Consultar categoria
|-- US-M021-003 Atualizar categoria
|-- US-M021-004 Excluir categoria
`-- US-M021-005 Listar categorias

EPIC-M021-002 (Cadastrar Formulario de Caracterizacao)
|-- US-M021-006 Criar formulario de caracterizacao
|-- US-M021-007 Consultar formulario de caracterizacao
|-- US-M021-008 Atualizar formulario de caracterizacao
|-- US-M021-009 Excluir formulario de caracterizacao
`-- US-M021-010 Listar formularios de caracterizacao

EPIC-M021-003 (Gerenciar Ciclo de Vida de Formulario)
|-- US-M021-011 Publicar formulario
|-- US-M021-012 Reverter publicacao de formulario
|-- US-M021-013 Notificar uso de formulario
`-- US-M021-014 Inativar formulario

EPIC-M021-004 (Gerenciar Respostas de Formulario de Caracterizacao)
|-- US-M021-015 Iniciar resposta de formulario de caracterizacao
|-- US-M021-016 Editar resposta em rascunho
|-- US-M021-017 Enviar resposta
|-- US-M021-018 Consultar resposta
`-- US-M021-019 Listar respostas

Release 2

EPIC-M021-005 (Cadastrar Formulario de Avaliacao)
`-- US-M021-020 Cadastrar formulario de avaliacao

EPIC-M021-006 (Gerenciar Respostas de Formulario de Avaliacao)
`-- US-M021-021 Gerenciar respostas de formulario de avaliacao

Release 3

EPIC-M021-007 (Cadastrar Formulario de Habilitacao)
`-- US-M021-022 Cadastrar formulario de habilitacao

EPIC-M021-008 (Gerenciar Respostas de Formulario de Habilitacao)
`-- US-M021-023 Gerenciar respostas de formulario de habilitacao
```
