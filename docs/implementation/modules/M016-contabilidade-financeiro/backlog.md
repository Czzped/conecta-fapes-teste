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
| EPIC-M016-008 | Plano de Aplicacao e Execucao de Despesas | UC04 | Must | To Do | [EPIC-M016-008](acao-transversal/epics/EPIC-M016-008.md) |
| EPIC-M016-009 | Prestacao Financeira Institucional | UC04 | Must | To Do | [EPIC-M016-009](acao-transversal/epics/EPIC-M016-009.md) |
| EPIC-M016-010 | Dashboard e Relatorios da Acao Transversal | UC04 | Should | To Do | [EPIC-M016-010](acao-transversal/epics/EPIC-M016-010.md) |
| EPIC-M016-011 | Parametrizacao da Politica, Versoes e Faixas | UC04 | Must | To Do | [EPIC-M016-011](taxa-gestao/epics/EPIC-M016-011.md) |
| EPIC-M016-012 | Recebimento e Classificacao da TaxaGestaoParcerias | UC04 | Must | To Do | [EPIC-M016-012](taxa-gestao/epics/EPIC-M016-012.md) |
| EPIC-M016-013 | Repasse para Conta Bancaria BANESTES | UC04 | Must | To Do | [EPIC-M016-013](taxa-gestao/epics/EPIC-M016-013.md) |
| EPIC-M016-014 | Vinculacao com AcaoTransversal | UC04 | Must | To Do | [EPIC-M016-014](taxa-gestao/epics/EPIC-M016-014.md) |
| EPIC-M016-015 | Dashboard e Relatorios da Taxa de Gestao | UC04 | Should | To Do | [EPIC-M016-015](taxa-gestao/epics/EPIC-M016-015.md) |

---

## Rastreabilidade

```
EPIC-M016-001 (Plano de Contas)
├── US-M016-001 Cadastrar Conta Contabil
├── US-M016-002 Associar Conta a Iniciativa/Programa/Parceria
├── US-M016-003 Dashboard Contabil
└── US-M016-044 Disponibilizar Conta Contabil para Mapeamento de Rubrica

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

EPIC-M016-011 a 015 (Taxa de Gestao de Parcerias)  <- subdominio proprio, auto-contido
├── EPIC-M016-011 Parametrizacao da Politica, Versoes e Faixas
├── EPIC-M016-012 Recebimento e Classificacao da TaxaGestaoParcerias
├── EPIC-M016-013 Repasse para Conta Bancaria BANESTES
├── EPIC-M016-014 Vinculacao com AcaoTransversal
└── EPIC-M016-015 Dashboard e Relatorios da Taxa de Gestao
    (US detalhadas em taxa-gestao/epics/ — fonte de verdade)
```
