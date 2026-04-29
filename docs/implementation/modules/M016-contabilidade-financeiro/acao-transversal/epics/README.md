# Epicos - Acao Transversal

[<< Voltar ao Subdominio](../README.md)

## Visao Geral

Os epicos da Acao Transversal separam a capacidade em seis blocos implementaveis. A reserva nasce no M010, mas a gestao financeira institucional pertence ao M016.

| ID | Titulo | Prioridade | Status | Documento |
|----|--------|------------|--------|-----------|
| EPIC-M016-005 | Politicas e Faixas de Acao Transversal | Must | To Do | [EPIC-M016-005](EPIC-M016-005.md) |
| EPIC-M016-006 | Recebimento e Classificacao da Reserva | Must | To Do | [EPIC-M016-006](EPIC-M016-006.md) |
| EPIC-M016-007 | Outorga, Conta Especifica e Repasse | Must | To Do | [EPIC-M016-007](EPIC-M016-007.md) |
| EPIC-M016-008 | Plano de Aplicacao e Execucao de Despesas | Must | To Do | [EPIC-M016-008](EPIC-M016-008.md) |
| EPIC-M016-009 | Prestacao Financeira Institucional | Must | To Do | [EPIC-M016-009](EPIC-M016-009.md) |
| EPIC-M016-010 | Dashboard e Relatorios da Acao Transversal | Should | To Do | [EPIC-M016-010](EPIC-M016-010.md) |

## Rastreabilidade

```text
EPIC-M016-005 Politicas e Faixas
└── PoliticaAcaoTransversal, FaixaAcaoTransversal

EPIC-M016-006 Recebimento e Classificacao
└── ReservaAcaoTransversal, ContaContabil, FundoFinanceiro, CentroCusto

EPIC-M016-007 Outorga, Conta Especifica e Repasse
└── OutorgaAcaoTransversal, ContaBancariaAcaoTransversal, RepasseAcaoTransversal

EPIC-M016-008 Plano e Execucao
└── PlanoAplicacaoAcaoTransversal, ItemPlanoAplicacaoAcaoTransversal, DespesaAcaoTransversal

EPIC-M016-009 Prestacao Financeira
└── PrestacaoFinanceiraAcaoTransversal

EPIC-M016-010 Dashboard e Relatorios
└── Consultas consolidadas por parceria, periodo, rubrica, outorgado e estado
```
