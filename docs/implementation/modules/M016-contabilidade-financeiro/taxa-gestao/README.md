# Taxa de Gestao de Parcerias

[<< Voltar ao M016](../README.md)

---

## Proposito

A Taxa de Gestao de Parcerias e o percentual retido sobre cada `AporteFinanceiro` recebido por uma Parceria, destinado a custear despesas operacionais e administrativas da FAPES. Calculada pelo M010 no momento do registro do aporte; custodiada, classificada contabilmente e gerida pelo M016.

Nao e rubrica do projeto nem recurso do coordenador da iniciativa. Nao compoe o saldo alocavel em Programas.

---

## Referencia Normativa

**[Resolucao CCAF n. 334/2023 — FAPES](https://fapes.es.gov.br/Media/fapes/Resolu%C3%A7%C3%B5es/Resolu%C3%A7%C3%A3o_CCAF_n%C2%BA_334.2023_-_utiliza%C3%A7%C3%A3o_recursos_financeiros_de_projetos_e-ou_programas_em_parcerias_destinados_a_A%C3%A7%C3%A3o_Transversal_para_a_FAPES..pdf)**

Regulamenta a utilizacao de recursos financeiros de projetos e/ou programas em parcerias destinados a Acao Transversal para a FAPES. Define as faixas de valor e os percentuais aplicaveis.

---

## Modelo de Versioning

A politica de taxa segue o mesmo padrao de versionamento de `ModalidadeBolsa/VersaoModalidade` do M001: entidade master estavel + versoes temporalmente delimitadas por Resolucao.

```
PoliticaTaxaGestaoParcerias          ← master estavel (sem percentuais, sem vigencia)
│
├── VersaoPoliticaTaxaGestao         ← versao por Resolucao
│    sigla: TGP-2023, TGP-2024...
│    baseLegal, numeroResolucao
│    dataInicioVigencia, dataFimVigencia
│    estado: VIGENTE | ENCERRADA | REVOGADA
│    rubricasPermitidas[]
│
│    └── VersaoFaixaPercentual       ← percentual por faixa por versao
│         valorMinimo, valorMaximo
│         percentual (ex: 0.05)
│         → faixa: FaixaPercentualTaxaGestao
│
└── FaixaPercentualTaxaGestao        ← faixa master estavel
     sigla: FAIXA-1, FAIXA-2, FAIXA-3
     descricao (ex: "Ate R$ 2.000.000")
```

**Regra de versioning:** quando uma nova Resolucao alterar os percentuais, cria-se uma nova `VersaoPoliticaTaxaGestao` e encerra-se a anterior. Somente uma versao pode estar vigente simultaneamente (INV-TGP04). Taxas ja calculadas com versao anterior mantem snapshot imutavel — sem recalculo retroativo.

---

## Faixas Vigentes (Resolucao CCAF 334/2023)

| Sigla | Valor do aporte | Percentual |
|-------|-----------------|------------|
| FAIXA-1 | R$ 50.000 a R$ 2.000.000 | 5% |
| FAIXA-2 | R$ 2.000.000,01 a R$ 5.000.000 | 4% |
| FAIXA-3 | Acima de R$ 5.000.000 | 3% |

Esses percentuais devem ser cadastrados como `VersaoPoliticaTaxaGestao` + `VersaoFaixaPercentual` — nunca como constantes fixas no codigo.

---

## TaxaGestaoParcerias — Snapshot Imutavel

Ao registrar um `AporteFinanceiro` no M010, o sistema:

1. Identifica `VersaoPoliticaTaxaGestao` com `estado = VIGENTE` na `dataAporte`
2. Identifica `VersaoFaixaPercentual` correspondente ao valor do aporte
3. Calcula `valorTaxaGestao = valorBase * percentualAplicado`
4. Grava `TaxaGestaoParcerias` com snapshot imutavel:

```
TaxaGestaoParcerias {
  aporteFinanceiroId
  parceiraId
  valorBase
  versaoPoliticaId       ← snapshot: ID da versao usada
  versaoPoliticaSigla    ← "TGP-2023" (desnormalizado para auditoria)
  versaoFaixaId          ← snapshot: ID da faixa usada
  faixaSigla             ← "FAIXA-2" (desnormalizado para auditoria)
  percentualAplicado     ← 0.04 (congelado)
  valorTaxaGestao        ← valorBase * percentualAplicado
  estado: CALCULADA
}
```

Nenhum campo do snapshot pode ser alterado apos criacao (INV-TGP05, INV-TGP06).

---

## Exemplo Concreto

```
VersaoPoliticaTaxaGestao TGP-2023 (Res. CCAF 334/2023) vigente 2023-01..2024-06
  FAIXA-1: 0 – 2M     → 5%
  FAIXA-2: 2M – 5M    → 4%
  FAIXA-3: >5M         → 3%

VersaoPoliticaTaxaGestao TGP-2024 (Res. CCAF 335/2024) vigente 2024-07..
  FAIXA-1: 0 – 2M     → 4%  ← alterou
  FAIXA-2: 2M – 5M    → 3%  ← alterou
  FAIXA-3: >5M         → 2%  ← alterou

AporteFinanceiro em 2024-03 (R$ 3M)
  → TaxaGestaoParcerias { versaoPoliticaSigla: "TGP-2023", faixaSigla: "FAIXA-2", percentual: 4% }
  → valorTaxaGestao = R$ 120.000  ← congelado para sempre

AporteFinanceiro em 2024-09 (R$ 3M)
  → TaxaGestaoParcerias { versaoPoliticaSigla: "TGP-2024", faixaSigla: "FAIXA-2", percentual: 3% }
  → valorTaxaGestao = R$ 90.000
```

---

## Ciclo de Vida da TaxaGestaoParcerias

```
CALCULADA → CLASSIFICADA → REPASSADA → VINCULADA → ENCERRADA
```

| Estado | Descricao |
|--------|-----------|
| CALCULADA | Emitida pelo M010 no registro do aporte; aguarda classificacao contabil. |
| CLASSIFICADA | Classificada em conta contabil, fundo financeiro e centro de custo (ClassificacaoContabilTGP). |
| REPASSADA | Valor repassado para conta bancaria BANESTES (M008/ContaBancaria — INV-TGP03). |
| VINCULADA | Vinculada a uma ou mais AcoesTransversais via OutorgaAcaoTransversal. |
| ENCERRADA | PrestacaoContasAcaoTransversal correspondente aprovada. |

---

## Fronteiras

| Contexto | Responsabilidade |
|----------|------------------|
| M010 — Parcerias | Calcula `TaxaGestaoParcerias`, emite evento `TaxaGestaoParcelasCalculada`, bloqueia `valorTaxaGestao` do `saldoAlocavelEmProgramas`. |
| M016 — Taxa de Gestao (este subdominio) | Parametriza `PoliticaTaxaGestaoParcerias` e versoes; recebe taxa; classifica contabilmente; vincula a `AcaoTransversal`. |
| M016 — Acao Transversal | Gasta os recursos custodiados pela taxa via plano de aplicacao, despesas e prestacao de contas. |
| M008 — Cadastros Corporativos | Fornece `ContaBancaria` (conta BANESTES para repasse — INV-TGP03). |
| M014 | Presta contas das Iniciativas/Projetos — NAO e dono da prestacao da AcaoTransversal. |

---

## Invariantes Principais

| ID | Regra |
|----|-------|
| INV-TGP03 | Conta bancaria para repasse deve ser BANESTES (Resolucao CCAF 334/2023). |
| INV-TGP04 | Somente uma `VersaoPoliticaTaxaGestao` vigente ao mesmo tempo. |
| INV-TGP05 | `TaxaGestaoParcerias.versaoPoliticaId` imutavel apos criacao. |
| INV-TGP06 | `TaxaGestaoParcerias.versaoFaixaId` imutavel apos criacao. |

---

## Capacidades

| Capacidade | Descricao |
|------------|-----------|
| Parametrizar politica | Criar e versionar `PoliticaTaxaGestaoParcerias` com `VersaoPoliticaTaxaGestao` e `VersaoFaixaPercentual` por Resolucao. |
| Receber taxa calculada | Receber `TaxaGestaoParcerias` emitida pelo M010 e classificar contabilmente. |
| Repassar ao Coordenador | Registrar repasse para conta bancaria BANESTES vinculada ao escopo da outorga. |
| Vincular a Acao Transversal | Associar taxa a uma ou mais `AcoesTransversais` via `OutorgaAcaoTransversal`. |
| Consultar historico | Auditar snapshot de versao, faixa e percentual de qualquer taxa historica. |

---

## Backlog

| ID | Titulo | Prioridade | Documento |
|----|--------|------------|-----------|
| EPIC-M016-011 | Parametrizacao da Politica, Versoes e Faixas | Must | [EPIC-M016-011](epics/EPIC-M016-011.md) |
| EPIC-M016-012 | Recebimento e Classificacao da TaxaGestaoParcerias | Must | [EPIC-M016-012](epics/EPIC-M016-012.md) |
| EPIC-M016-013 | Repasse para Conta Bancaria BANESTES | Must | [EPIC-M016-013](epics/EPIC-M016-013.md) |
| EPIC-M016-014 | Vinculacao com AcaoTransversal | Must | [EPIC-M016-014](epics/EPIC-M016-014.md) |
| EPIC-M016-015 | Dashboard e Relatorios | Should | [EPIC-M016-015](epics/EPIC-M016-015.md) |
