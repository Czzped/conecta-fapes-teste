# Acao Transversal - Gestao Financeira Institucional

[<< Voltar ao M016](../README.md)

## Proposito

Este subdominio controla a gestao financeira institucional da Acao Transversal. A reserva nasce no M010, na Parceria, a partir da politica normativa aplicavel. Depois de calculada e bloqueada para Programas, a reserva passa a ser gerida pelo M016 para planejamento de uso, execucao financeira, documentos, glosas, estornos, saldos e prestacao financeira institucional.

## Referencia Normativa

A modelagem inicial deste subdominio usa como base a **Resolucao CCAF nº 334/2023**, que regulamenta a utilizacao de recursos financeiros de projetos e/ou programas em parcerias destinados a Acao Transversal para a FAPES.

Fonte oficial: [Resolucao CCAF nº 334/2023 - FAPES](https://fapes.es.gov.br/Media/fapes/Resolu%C3%A7%C3%B5es/Resolu%C3%A7%C3%A3o_CCAF_n%C2%BA_334.2023_-_utiliza%C3%A7%C3%A3o_recursos_financeiros_de_projetos_e-ou_programas_em_parcerias_destinados_a_A%C3%A7%C3%A3o_Transversal_para_a_FAPES..pdf)

### Percentuais Parametrizados (Resolucao CCAF 334/2023)

| Faixa | Valor do aporte | Percentual |
|-------|-----------------|------------|
| FAIXA-1 | R$ 50.000 a R$ 2.000.000 | 5% |
| FAIXA-2 | R$ 2.000.000,01 a R$ 5.000.000 | 4% |
| FAIXA-3 | Acima de R$ 5.000.000 | 3% |

Esses percentuais sao parametrizados como `VersaoPoliticaTaxaGestao` + `VersaoFaixaPercentual` no M016 — nunca constantes fixas no codigo. Cada `VersaoPoliticaTaxaGestao` e criada por uma Resolucao e tem `dataInicioVigencia` / `dataFimVigencia`. Somente uma versao pode estar vigente ao mesmo tempo.

**Versioning:** quando uma nova Resolucao alterar os percentuais, cria-se uma nova `VersaoPoliticaTaxaGestao` (ex: TGP-2024) e encerra-se a anterior. Aportes registrados com a versao anterior mantem o snapshot original — sem recalculo retroativo (AX-TGP05).

## Fronteiras

| Contexto | Responsabilidade |
|----------|------------------|
| M010 - Planejamento e Estrategia | Calcula a reserva na Parceria, desconta do saldo alocavel em Programas e registra a origem normativa. |
| M016 - Contabilidade e Financeiro | Recebe a reserva em conta contabil/fundo/centro financeiro institucional, planeja por rubricas, executa, controla e presta financeiramente a reserva de Acao Transversal. |
| M014 - Prestacao de Contas | Presta contas da Iniciativa/Projeto. Nao e dono da prestacao financeira institucional da Acao Transversal. |
| M008 - Cadastros Corporativos | Fornece documentos, tipos documentais, instituicoes e rubricas de referencia. |

## Capacidades

| Capacidade | Descricao |
|------------|-----------|
| Parametrizar politica | Mantem a politica e as faixas percentuais, como a Resolucao CCAF nº 334/2023. |
| Receber reserva | Registra a reserva calculada pelo M010, com snapshot da regra aplicada e classificacao em conta contabil, fundo financeiro e centro de custo. |
| Planejar aplicacao | Distribui o valor reservado por rubricas permitidas, sem alterar a conta contabil de entrada da reserva. |
| Executar despesas | Registra despesas internas da agencia vinculadas a documentos comprobatórios. |
| Prestar financeiramente | Submete, analisa, aprova, glosa, reprova ou encerra a prestacao financeira institucional. |
| Acompanhar dashboard | Exibe reservado, planejado, executado, glosado e saldo por parceria, rubrica e periodo. |

## Conceitos

| Conceito | Definicao |
|----------|-----------|
| `PoliticaTaxaGestaoParcerias` | Entidade master estavel da politica. Nao contem percentuais — esses ficam nas versoes. |
| `VersaoPoliticaTaxaGestao` | Versao temporalmente delimitada da politica, criada por uma Resolucao. Contem `dataInicioVigencia`, `dataFimVigencia`, `baseLegal`, `rubricasPermitidas` e faixas com percentuais. Somente uma vigente ao mesmo tempo. |
| `FaixaPercentualTaxaGestao` | Faixa hierarquica master (FAIXA-1, FAIXA-2, FAIXA-3). Estavel, sem percentuais. |
| `VersaoFaixaPercentual` | Percentual especifico de uma faixa para uma versao da politica. Capturado como snapshot imutavel na `TaxaGestaoParcerias`. |
| `TaxaGestaoParcerias` | Valor retido sobre o `AporteFinanceiro` da Parceria. Contem snapshot imutavel de `versaoPoliticaId`, `versaoFaixaId`, `percentualAplicado` e `valorTaxaGestao`. Calculada pelo M010, custodiada pelo M016. |
| `AcaoTransversal` | Projeto institucional interno da FAPES financiado pelas taxas custodiadas. Tem `Coordenador Outorgado`, plano de aplicacao e prestacao de contas. |
| `PlanoAplicacaoAT` | Previsao de uso do recurso da AcaoTransversal por rubrica e unidade responsavel. |
| `DespesaAcaoTransversal` | Despesa efetiva da agencia feita com recurso da AcaoTransversal. |
| `PrestacaoContasAcaoTransversal` | Processo institucional de consolidacao, analise, glosa e encerramento das despesas da AcaoTransversal. |

### Conta, Fundo, Centro e Rubrica

Na Acao Transversal, a reserva segue esta ordem:

```text
Reserva calculada na Parceria
  -> Conta contabil / Fundo financeiro / Centro de custo
  -> Plano de aplicacao por rubrica
  -> Despesas executadas por rubrica
```

| Conceito | Uso na Acao Transversal |
|----------|-------------------------|
| Conta contabil | Classifica contabilmente a entrada ou despesa da Acao Transversal. |
| Fundo financeiro | Segrega a reserva em uma carteira/fonte institucional. |
| Centro de custo | Indica a area/finalidade interna responsavel pela gestao ou consumo. |
| Rubrica | Detalha como a reserva sera planejada e executada: diarias, passagens, publicacoes, servicos de terceiros, material permanente etc. |

A reserva nao e uma rubrica unica. Ela e reconhecida contabilmente no M016 e depois distribuida em rubricas no plano de aplicacao.

### Conta Bancaria Especifica

Quando houver repasse ao Coordenador Outorgado, a Acao Transversal tambem precisa de controle bancario. Pela Resolucao CCAF nº 334/2023, a transferencia deve ocorrer em conta bancaria especifica, aberta pela FAPES em nome do Coordenador Outorgado, no BANESTES.

Essa conta bancaria e diferente da conta contabil. A conta contabil classifica a natureza do recurso ou despesa; a conta bancaria e onde o dinheiro e efetivamente creditado e movimentado. Portanto, o M016 deve manter as duas perspectivas:

```text
TaxaGestaoParcerias (snapshot imutavel: versaoPoliticaId, versaoFaixaId, percentualAplicado)
  -> ClassificacaoContabilTGP (conta contabil / fundo financeiro / centro de custo)
  -> AcaoTransversal
  -> OutorgaAcaoTransversal (Coordenador Outorgado designado pela Diretoria Executiva)
  -> ContaBancaria BANESTES (M008 — INV-TGP03)
```

A conta especifica nao deve ser modelada como uma conta unica global da FAPES para toda Acao Transversal. Tambem nao deve ser travada como exatamente uma conta por parceria. Ela deve estar vinculada ao escopo formal da outorga ou do repasse, podendo cobrir uma reserva, uma parceria, um conjunto de reservas ou outro agrupamento definido no Termo de Outorga.

## Regras

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN-AT-01 | A Acao Transversal e calculada uma unica vez na Parceria pelo M010; M016 recebe a reserva ja calculada. | Must |
| RN-AT-02 | A reserva de Acao Transversal deve ser registrada em conta contabil, fundo financeiro e centro de custo institucional antes de ser planejada por rubricas. | Must |
| RN-AT-03 | Despesas so podem usar rubricas permitidas para Acao Transversal. | Must |
| RN-AT-04 | Toda despesa exige documento comprobatório e justificativa. | Must |
| RN-AT-05 | Valores glosados retornam como saldo glosado/pendente de providencia, nao como saldo livre para Programas. | Must |
| RN-AT-06 | A prestacao financeira institucional da Acao Transversal nao se confunde com a prestacao de contas da Iniciativa no M014. | Must |
| RN-AT-07 | A reserva de um aditivo financeiro usa como base de calculo o valor do proprio aditivo; reservas anteriores nao sao recalculadas retroativamente, salvo determinacao normativa explicita. | Must |
| RN-AT-08 | O plano de aplicacao nao pode superar o valor reservado disponivel e seus itens devem usar rubricas permitidas para Acao Transversal. | Must |
| RN-AT-09 | Quando houver repasse, a conta bancaria deve ser especifica para o escopo autorizado no Termo de Outorga ou no repasse, aberta pela FAPES em nome do Coordenador Outorgado no BANESTES. | Must |

## Fluxo Macro

```text
M010 — Parceria
  identifica VersaoPoliticaTaxaGestao vigente + VersaoFaixaPercentual pelo valor do aporte
  calcula TaxaGestaoParcerias com snapshot imutavel (versaoPoliticaId, versaoFaixaId, percentualAplicado)
  bloqueia valorTaxaGestao — nao compoe saldoAlocavelEmProgramas
  emite evento TaxaGestaoParcelasCalculada

M016 — Taxa de Gestao de Parcerias
  recebe TaxaGestaoParcerias (CALCULADA)
  ClassificacaoContabilTGP: conta contabil / fundo / centro de custo (CLASSIFICADA)
  vincula a AcaoTransversal via OutorgaAcaoTransversal (VINCULADA)
  repassa para ContaBancaria BANESTES quando aplicavel (REPASSADA)

M016 — Acao Transversal
  elabora PlanoAplicacaoAT por rubrica permitida
  registra DespesaAcaoTransversal com documento comprobatorio
  submete / analisa / aprova ou glosa PrestacaoContasAcaoTransversal
  encerra AcaoTransversal (ENCERRADA)
```

## Backlog

| ID | Titulo | Prioridade | Documento |
|----|--------|------------|-----------|
| EPIC-M016-005 | Politicas e Faixas de Acao Transversal | Must | [EPIC-M016-005](epics/EPIC-M016-005.md) |
| EPIC-M016-006 | Recebimento e Classificacao da Reserva | Must | [EPIC-M016-006](epics/EPIC-M016-006.md) |
| EPIC-M016-007 | Outorga, Conta Especifica e Repasse | Must | [EPIC-M016-007](epics/EPIC-M016-007.md) |
| EPIC-M016-008 | Plano de Aplicacao e Execucao de Despesas | Must | [EPIC-M016-008](epics/EPIC-M016-008.md) |
| EPIC-M016-009 | Prestacao Financeira Institucional | Must | [EPIC-M016-009](epics/EPIC-M016-009.md) |
| EPIC-M016-010 | Dashboard e Relatorios da Acao Transversal | Should | [EPIC-M016-010](epics/EPIC-M016-010.md) |

## Documentos

| Documento | Descricao |
|-----------|-----------|
| [Modelo](modelo/README.md) | Diagrama e regras estruturais da reserva, outorga, conta especifica, repasse, plano, despesa e prestacao financeira. |
| [Processo](processo.md) | Fluxos de recebimento/classificacao da reserva, plano por rubrica, execucao e prestacao financeira institucional. |
| [Proposta de Tela e Impacto no Codigo](proposta-tela-e-impacto-codigo.md) | Analise do impacto no prototipo de Parcerias e desenho da tela do M016 para Acao Transversal. |
| [Epicos](epics/README.md) | Backlog funcional detalhado da Acao Transversal. |
