# Epicos — Taxa de Gestao de Parcerias

[<< Voltar ao Subdominio](../README.md)

## Visao Geral

Os epicos da Taxa de Gestao de Parcerias cobrem o ciclo completo de parametrizacao normativa, recebimento da taxa calculada pelo M010 e repasse para conta bancaria BANESTES. A execucao dos recursos custodiados pertence ao subdominio Acao Transversal (EPIC-M016-007 a 010).

| ID | Titulo | Prioridade | Status | Documento |
|----|--------|------------|--------|-----------|
| EPIC-M016-011 | Parametrizacao da Politica, Versoes e Faixas | Must | To Do | [EPIC-M016-011](EPIC-M016-011.md) |
| EPIC-M016-012 | Recebimento e Classificacao da TaxaGestaoParcerias | Must | To Do | [EPIC-M016-012](EPIC-M016-012.md) |
| EPIC-M016-013 | Repasse para Conta Bancaria BANESTES | Must | To Do | [EPIC-M016-013](EPIC-M016-013.md) |
| EPIC-M016-014 | Vinculacao com AcaoTransversal | Must | To Do | [EPIC-M016-014](EPIC-M016-014.md) |
| EPIC-M016-015 | Dashboard e Relatorios | Should | To Do | [EPIC-M016-015](EPIC-M016-015.md) |

## Rastreabilidade

```text
EPIC-M016-011 Parametrizacao da Politica
└── PoliticaTaxaGestaoParcerias (master estavel)
└── VersaoPoliticaTaxaGestao (criada por Resolucao, com vigencia e estado derivado)
└── FaixaPercentualTaxaGestao (faixa master estavel)
└── VersaoFaixaPercentual (percentual por faixa por versao)

EPIC-M016-012 Recebimento e Classificacao
└── TaxaGestaoParcerias (snapshot imutavel: versaoPoliticaId, versaoFaixaId, percentualAplicado)
└── ClassificacaoContabilTGP (conta contabil / fundo financeiro / centro de custo)

EPIC-M016-013 Repasse para Conta BANESTES
└── TaxaGestaoParcerias.contaBancariaId → ContaBancaria BANESTES (M008)

EPIC-M016-014 Vinculacao com AcaoTransversal
└── TaxaGestaoParcerias → AcaoTransversal (N:N via OutorgaAcaoTransversal)

EPIC-M016-015 Dashboard e Relatorios
└── Consultas consolidadas por parceria, versao da politica, faixa, periodo e estado
└── Auditoria historica via snapshots desnormalizados (versaoPoliticaSigla, faixaSigla)
```

## Fronteira com Acao Transversal

Os EPICs 011-014 cuidam da **retencao e custodia** do recurso. A partir de VINCULADA (EPIC-M016-014), a execucao do recurso pertence ao subdominio Acao Transversal (EPIC-M016-007 a 010): plano de aplicacao, despesas, prestacao de contas.
