# Epicos — Acao Transversal

[<< Voltar ao Subdominio](../README.md)

## Visao Geral

Os epicos da Acao Transversal cobrem o ciclo de **execucao** dos recursos custodiados pela Taxa de Gestao de Parcerias: plano de aplicacao, despesas institucionais e prestacao financeira.

A parametrizacao de politica, recebimento, classificacao e repasse da taxa pertencem ao subdominio [Taxa de Gestao de Parcerias](../../taxa-gestao/epics/README.md) (EPIC-M016-011 a 015).

| ID | Titulo | Prioridade | Status | Documento |
|----|--------|------------|--------|-----------|
| EPIC-M016-008 | Plano de Aplicacao e Execucao de Despesas | Must | To Do | [EPIC-M016-008](EPIC-M016-008.md) |
| EPIC-M016-009 | Prestacao Financeira da Acao Transversal | Must | To Do | [EPIC-M016-009](EPIC-M016-009.md) |
| EPIC-M016-010 | Dashboard e Relatorios da Acao Transversal | Should | To Do | [EPIC-M016-010](EPIC-M016-010.md) |

## Rastreabilidade

```text
EPIC-M016-008 Plano e Execucao
└── AcaoTransversal (recebe recursos via OutorgaAcaoTransversal)
└── PlanoAplicacaoAT (distribuicao por rubrica)
└── ItemPlanoAplicacaoAT (linha por rubrica)
└── DespesaAcaoTransversal (execucao + documento comprobatorio)

EPIC-M016-009 Prestacao Financeira
└── PrestacaoContasAcaoTransversal (escopo = OutorgaAcaoTransversal)
└── DespesaAcaoTransversal (analisadas na prestacao)
└── TaxaGestaoParcerias (transita para ENCERRADA quando prestacao APROVADA)

EPIC-M016-010 Dashboard AT
└── Consolidado: vinculado / planejado / executado / aprovado / glosado / saldo
└── Filtros: Coordenador Outorgado, AcaoTransversal, periodo
```

## Fronteira com Taxa de Gestao

A retencao, custodia, classificacao contabil, repasse e vinculacao da taxa a esta subpasta pertencem ao subdominio **Taxa de Gestao de Parcerias**:

```text
TaxaGestaoParcerias (taxa-gestao/)
  Recebida → Classificada → Repassada → Vinculada → Encerrada (marcos derivados)
                                               ↓
                                       AcaoTransversal (acao-transversal/)
                                         EM_ELABORACAO → ATIVA → EM_PRESTACAO → ENCERRADA
                                                   ↓
                                          PlanoAplicacaoAT
                                          DespesaAcaoTransversal
                                          PrestacaoContasAcaoTransversal
```
