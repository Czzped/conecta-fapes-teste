# Sub-Backlog: M008 - Cadastros Corporativos

[<< Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

Atualmente, os cadastros de pessoas fisicas, instituicoes de ensino e pesquisa, unidades organizacionais e dados de referencia sao mantidos em planilhas e sistemas legados sem integracao, gerando duplicidade de registros e inconsistencias. Este modulo centraliza o cadastro e a manutencao de pessoas, organizacoes e dados basicos de referencia em uma unica plataforma, garantindo unicidade, hierarquia organizacional e conformidade com classificacoes oficiais.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M008-001 | Cadastro de Pessoas Fisicas | UC01 | Must | In Progress | [EPIC-M008-001](epics/EPIC-M008-001.md) |
| EPIC-M008-002 | Cadastro de Instituicoes e Unidades | UC02 | Must | In Progress | [EPIC-M008-002](epics/EPIC-M008-002.md) |
| EPIC-M008-003 | Cadastros Basicos de Referencia | UC03 | Must | In Progress | [EPIC-M008-003](epics/EPIC-M008-003.md) |

---

## Rastreabilidade

```
EPIC-M008-001 (Cadastro de Pessoas Fisicas)
├── US-M008-001 Cadastrar Pessoa Fisica
├── US-M008-002 Listar e Consultar Pessoas
├── US-M008-003 Atualizar Pessoa Fisica
└── US-M008-004 Suspender Pessoa

EPIC-M008-002 (Cadastro de Instituicoes e Unidades)  <- depende de EPIC-M008-001  GitHub: #1748
├── US-M008-005 Cadastrar Instituicao                 #1749
├── US-M008-006 Cadastrar Unidade Organizacional       #1750
├── US-M008-007 Cadastrar Dirigente                    #1751
├── US-M008-008 Listar e Consultar Instituicoes        #1752
├── US-M008-015 Vincular Pessoa a Instituicao/Unidade  #1753
└── US-M008-016 Cadastrar e Gerenciar Area Tecnica     #1754

EPIC-M008-003 (Cadastros Basicos de Referencia)  GitHub: #1745
├── US-M008-009 Gerenciar Areas de Conhecimento
├── US-M008-010 Gerenciar Rubricas Financeiras
├── US-M008-011 Gerenciar Cidades e Regioes
├── US-M008-012 Gerenciar Estrutura Organizacional da Agencia
├── US-M008-013 Cadastrar Finalidade                   #1746
└── US-M008-014 Listar Finalidades                     #1747
```
