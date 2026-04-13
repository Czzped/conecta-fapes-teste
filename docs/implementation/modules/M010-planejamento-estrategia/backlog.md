# Sub-Backlog: M010 - Planejamento e Estrategia

[<< Voltar ao Backlog Central](../../backlog-product.md)

## Sobre o Modulo

Atualmente, o planejamento estrategico, a gestao de parcerias e a gestao de programas de fomento sao feitos de forma isolada, sem integracao entre os instrumentos de cooperacao e os programas que executam as acoes. Este modulo centraliza a gestao do plano estrategico, parcerias institucionais e programas de fomento, desde o planejamento ate o encerramento, garantindo rastreabilidade de recursos e conformidade com a legislacao.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M010-001 | Gestao do Plano Estrategico | UC01 | Must | To Do | [EPIC-M010-001](epics/EPIC-M010-001.md) |
| EPIC-M010-002 | Gestao de Parcerias | UC02 | Must | To Do | [EPIC-M010-002](epics/EPIC-M010-002.md) |
| EPIC-M010-003 | Gestao de Programas | UC03 | Must | To Do | [EPIC-M010-003](epics/EPIC-M010-003.md) |

---

## Rastreabilidade

```
EPIC-M010-001 (Gestao do Plano Estrategico)
├── US-M010-001 Cadastrar Plano Estrategico
├── US-M010-002 Cadastrar Eixo Estrategico
└── US-M010-003 Dashboard de Plano Estrategico

EPIC-M010-002 (Gestao de Parcerias)  <- depende de EPIC-M010-003
├── US-M010-004 Cadastrar Parceria
├── US-M010-005 Registrar Aporte Financeiro
├── US-M010-006 Registrar Aditivo de Tempo
├── US-M010-007 Registrar Aditivo de Aporte
├── US-M010-008 Acompanhar Execucao da Parceria
└── US-M010-009 Encerrar Parceria

EPIC-M010-003 (Gestao de Programas)  <- depende de EPIC-M010-001
├── US-M010-010 Cadastrar Programa
├── US-M010-011 Cadastrar Comite Gestor
├── US-M010-012 Vincular Dotacao Orcamentaria
└── US-M010-013 Dashboard de Programas
```
