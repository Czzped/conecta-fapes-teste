# Sub-Backlog: M016 - Contabilidade e Financeiro

[<< Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

A agencia de fomento necessita de controle contabil (plano de contas, lancamentos vinculados a programas/projetos) e gestao financeira (contas bancarias, fluxo de caixa, conciliacao, controle de saldos). Atualmente esses processos estao dispersos em planilhas e sistemas externos sem integracao, gerando inconsistencias nos dados financeiros, dificuldade de rastreamento de recursos e atrasos na conciliacao bancaria. Este modulo visa resolver esses problemas ao centralizar a gestao contabil e financeira em uma unica plataforma integrada. O sucesso sera medido pela reducao do tempo de conciliacao bancaria e pela acuracia dos saldos contabeis.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M016-001 | Plano de Contas | UC01 | Must | To Do | [EPIC-M016-001](epics/EPIC-M016-001.md) |
| EPIC-M016-002 | Gestao de Contas Bancarias | UC02 | Must | To Do | [EPIC-M016-002](epics/EPIC-M016-002.md) |
| EPIC-M016-003 | Fluxo de Caixa e Conciliacao | UC03 | Must | To Do | [EPIC-M016-003](epics/EPIC-M016-003.md) |

---

## Rastreabilidade

```
EPIC-M016-001 (Plano de Contas)
├── US-M016-001 Cadastrar Conta Contabil
├── US-M016-002 Associar Conta a Iniciativa/Programa/Parceria
└── US-M016-003 Dashboard Contabil

EPIC-M016-002 (Gestao de Contas Bancarias)  <- depende de EPIC-M016-001
├── US-M016-004 Cadastrar Conta Bancaria
├── US-M016-005 Registrar Movimentacao
└── US-M016-006 Consultar Saldo por Conta

EPIC-M016-003 (Fluxo de Caixa e Conciliacao)  <- depende de EPIC-M016-002
├── US-M016-007 Visualizar Fluxo de Caixa
├── US-M016-008 Realizar Conciliacao Bancaria
└── US-M016-009 Dashboard Financeiro
```
