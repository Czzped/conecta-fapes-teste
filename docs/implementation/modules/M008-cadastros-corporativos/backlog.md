# Sub-Backlog: M008 - Cadastros Corporativos

[<< Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

Atualmente, os cadastros de pessoas fisicas, instituicoes e dados de referencia sao mantidos em planilhas e sistemas legados sem integracao, gerando duplicidade de registros e inconsistencias. Este modulo centraliza o cadastro e a manutencao de pessoas, organizacoes e dados basicos de referencia em uma unica plataforma, garantindo unicidade, hierarquia organizacional e conformidade com classificacoes oficiais.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M008-001 | Cadastro de Pessoas Fisicas | UC01 | Must | In Progress | [Pessoas](pessoas/backlog.md) |
| EPIC-M008-002 | Cadastro de Instituicoes | UC02 | Must | In Progress | [Instituicoes](instituicoes/backlog.md) |
| EPIC-M008-003 | Classificacoes Corporativas | UC03 | Must | In Progress | [Classificacoes](classificacoes/backlog.md) |
| EPIC-M008-004 | Catalogo de Rubricas | UC04 | Must | To Do | [Rubricas](rubricas/backlog.md) |
| EPIC-M008-005 | Gestao Corporativa de Diarias | UC05 | Must | To Do | [Diarias](diarias/backlog.md) |
| EPIC-M008-006 | Cadastros Geograficos | UC06 | Should | To Do | [Geografia](geografia/backlog.md) |

---

## Rastreabilidade

```
EPIC-M008-001 (Cadastro de Pessoas Fisicas)
├── US-M008-001 Cadastrar Pessoa Fisica
├── US-M008-002 Listar e Consultar Pessoas
├── US-M008-003 Atualizar Pessoa Fisica
├── US-M008-004 Suspender Pessoa
└── US-M008-028 Vincular numeroLattes ao cadastrar Pessoa Fisica como Pesquisador

EPIC-M008-002 (Cadastro de Instituicoes e Unidades Organizacionais)  <- depende de EPIC-M008-001  GitHub: #1748
├── US-M008-005 Cadastrar Instituicao                   #1749
├── US-M008-006 Cadastrar UnidadeOrganizacional         #1750
├── US-M008-007 Cadastrar Responsavel                   #1751
└── US-M008-008 Listar e Consultar Instituicoes        #1752

EPIC-M008-003 (Classificacoes Corporativas)
├── US-M008-009 Gerenciar Areas de Conhecimento
├── US-M008-013 Cadastrar Finalidade                   #1746
└── US-M008-014 Listar Finalidades                     #1747

EPIC-M008-004 (Catalogo de Rubricas)
├── US-M008-015 Cadastrar Rubrica
├── US-M008-016 Editar Rubrica e Ativacao
├── US-M008-017 Vincular Rubrica Filha
└── US-M008-020 Consultar Catalogo de Rubricas

EPIC-M008-005 (Gestao Corporativa de Diarias)
├── US-M008-021 Gerenciar valores vigentes de diaria por abrangencia
├── US-M008-022 Gerenciar abrangencias de diaria
├── US-M008-023 Bloquear vigencias sobrepostas para a mesma abrangencia
├── US-M008-024 Consultar diaria vigente para consumo do M003
├── US-M008-025 Ativar e inativar valores de diaria preservando historico
├── US-M008-026 Auditar alteracoes dos cadastros de diaria
└── US-M008-027 Gerenciar parametros normativos de calculo de diaria

EPIC-M008-006 (Cadastros Geograficos)
└── US-M008-011 Gerenciar Cidades e Regioes
```
