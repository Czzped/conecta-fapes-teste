# Sub-Backlog: M010 - Planejamento e Estrategia

[<< Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

Planejamento estrategico, parcerias e programas sao gerenciados de forma isolada. Este modulo centraliza a gestao do plano estrategico, parcerias institucionais (com aportes, coordenacao e finalidade) e programas de fomento.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M010-001 | Gestao do Plano Estrategico | UC01 | Must | To Do | [EPIC-M010-001](epics/EPIC-M010-001.md) |
| EPIC-M010-002 | Gestao de Parcerias | UC02 | Must | In Progress | [EPIC-M010-002](epics/EPIC-M010-002.md) / [GitHub #1724](https://github.com/leds-conectafapes/conectafapes-project/issues/1724) |
| EPIC-M010-003 | Gestao de Programas | UC03 | Must | In Progress | [EPIC-M010-003](epics/EPIC-M010-003.md) |

---

## Rastreabilidade

```
EPIC-M010-001 (Gestao do Plano Estrategico)
├── US-M010-001 Cadastrar Plano Estrategico
├── US-M010-002 Cadastrar Eixo Estrategico
└── US-M010-003 Dashboard de Plano Estrategico

EPIC-M010-002 (Gestao de Parcerias)  GitHub: #1724
├── US-M010-004 Cadastrar Parceria                    #1739
├── US-M010-005 Registrar Aporte Financeiro            #1740
├── US-M010-006 Registrar Coordenacao de Parceria      #1741
├── US-M010-007 Associar Finalidade a Parceria         #1742
├── US-M010-008 Listar e Consultar Parcerias           #1743
└── US-M010-009 Encerrar Parceria                      #1744

EPIC-M010-003 (Gestao de Programas)  <- depende de EPIC-M010-001
├── US-M010-010 Cadastrar Programa
├── US-M010-011 Vincular Parceria de Referencia ao Programa
└── US-M010-012 Dashboard de Programas
```
