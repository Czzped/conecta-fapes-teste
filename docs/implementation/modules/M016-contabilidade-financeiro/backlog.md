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
| EPIC-M016-004 | Gestao de Fundos Financeiros | UC02 | Must | Deferido (pos-M014) | — |
| EPIC-M016-005 | Politicas e Faixas de Acao Transversal | UC04 | Must | To Do | [EPIC-M016-005](acao-transversal/epics/EPIC-M016-005.md) |
| EPIC-M016-006 | Recebimento e Classificacao da Reserva | UC04 | Must | To Do | [EPIC-M016-006](acao-transversal/epics/EPIC-M016-006.md) |
| EPIC-M016-007 | Outorga, Conta Especifica e Repasse | UC04 | Must | To Do | [EPIC-M016-007](acao-transversal/epics/EPIC-M016-007.md) |
| EPIC-M016-008 | Plano de Aplicacao e Execucao de Despesas | UC04 | Must | To Do | [EPIC-M016-008](acao-transversal/epics/EPIC-M016-008.md) |
| EPIC-M016-009 | Prestacao Financeira Institucional | UC04 | Must | To Do | [EPIC-M016-009](acao-transversal/epics/EPIC-M016-009.md) |
| EPIC-M016-010 | Dashboard e Relatorios da Acao Transversal | UC04 | Should | To Do | [EPIC-M016-010](acao-transversal/epics/EPIC-M016-010.md) |

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

EPIC-M016-004 (Gestao de Fundos Financeiros)  <- deferido para pos-M014
├── US-M016-010 Criar Fundo Financeiro
├── US-M016-011 Associar Conta Bancaria a Fundo (N:1)
└── US-M016-012 Consultar Saldo Consolidado por Fundo

EPIC-M016-005 (Politicas e Faixas de Acao Transversal)
├── US-M016-020 Cadastrar politica normativa
├── US-M016-021 Cadastrar faixas percentuais
├── US-M016-022 Ativar politica vigente
└── US-M016-023 Consultar politica vigente pelo M010

EPIC-M016-006 (Recebimento e Classificacao da Reserva)
├── US-M016-024 Receber reserva calculada pelo M010
├── US-M016-025 Classificar reserva em conta/fundo/centro
├── US-M016-026 Tratar reserva de aditivo financeiro
└── US-M016-027 Garantir idempotencia do recebimento

EPIC-M016-007 (Outorga, Conta Especifica e Repasse)
├── US-M016-028 Registrar Termo de Outorga da Acao Transversal
├── US-M016-029 Designar Coordenador Outorgado
├── US-M016-030 Registrar conta especifica BANESTES
└── US-M016-031 Registrar repasse para conta especifica

EPIC-M016-008 (Plano de Aplicacao e Execucao de Despesas)
├── US-M016-032 Cadastrar plano de aplicacao
├── US-M016-033 Aprovar plano de aplicacao
├── US-M016-034 Registrar despesa institucional
└── US-M016-035 Vincular documento comprobatório

EPIC-M016-009 (Prestacao Financeira Institucional)
├── US-M016-036 Submeter prestacao financeira
├── US-M016-037 Analisar despesas e documentos
├── US-M016-038 Registrar glosa ou ajuste
└── US-M016-039 Encerrar prestacao financeira

EPIC-M016-010 (Dashboard e Relatorios da Acao Transversal)
├── US-M016-040 Consultar consolidado da Acao Transversal
├── US-M016-041 Filtrar por parceria, periodo, rubrica e outorgado
├── US-M016-042 Exportar relatorio gerencial
└── US-M016-043 Exibir alertas de saldo, glosa e prestacao pendente
```
