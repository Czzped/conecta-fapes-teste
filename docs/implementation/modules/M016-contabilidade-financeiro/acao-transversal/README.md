# Acao Transversal - Gestao Financeira Institucional

[<< Voltar ao M016](../README.md)

## Proposito

Este subdominio controla **apenas a execucao** dos recursos custodiados da Acao Transversal: planejamento de uso, execucao financeira, documentos, glosas, estornos, saldos e prestacao de contas institucional. A taxa em si — calculo, recebimento, classificacao, repasse e custodia — nao vive aqui. O M010 calcula a `TaxaGestaoParcerias` sobre o aporte da Parceria; o subdominio [Taxa de Gestao de Parcerias](../taxa-gestao/README.md) (M016) recebe, classifica, repassa e custodia esse valor. Quando a taxa entra no estado VINCULADA, cria-se uma `OutorgaAcaoTransversal` que liga a taxa custodiada a uma `AcaoTransversal`. A partir dai, a Acao Transversal planeja (`PlanoAplicacaoAT`), executa (`DespesaAcaoTransversal`) e presta contas (`PrestacaoContasAcaoTransversal`).

## Referencia Normativa

A modelagem deste subdominio usa como base a **Resolucao CCAF nº 334/2023**, que regulamenta a utilizacao de recursos financeiros de projetos e/ou programas em parcerias destinados a Acao Transversal para a FAPES.

Fonte oficial: [Resolucao CCAF nº 334/2023 - FAPES](https://fapes.es.gov.br/Media/fapes/Resolu%C3%A7%C3%B5es/Resolu%C3%A7%C3%A3o_CCAF_n%C2%BA_334.2023_-_utiliza%C3%A7%C3%A3o_recursos_financeiros_de_projetos_e-ou_programas_em_parcerias_destinados_a_A%C3%A7%C3%A3o_Transversal_para_a_FAPES..pdf)

A parametrizacao da politica, das faixas e dos percentuais (`PoliticaTaxaGestaoParcerias`, `VersaoPoliticaTaxaGestao`, `FaixaPercentualTaxaGestao`, `VersaoFaixaPercentual`) e o calculo/versionamento da `TaxaGestaoParcerias` pertencem ao subdominio [Taxa de Gestao de Parcerias](../taxa-gestao/README.md). Este subdominio apenas executa o valor ja custodiado, sem remodelar a regra de calculo.

## Fronteiras

| Contexto | Responsabilidade |
|----------|------------------|
| M010 - Planejamento e Estrategia | Calcula a `TaxaGestaoParcerias` sobre o aporte da Parceria, desconta do saldo alocavel em Programas e emite `TaxaGestaoParceriasCalculada`. |
| M016 - Taxa de Gestao de Parcerias | Recebe, classifica, repassa e custodia a `TaxaGestaoParcerias`. Quando VINCULADA, cria a `OutorgaAcaoTransversal`. Ver [taxa-gestao](../taxa-gestao/README.md). |
| M016 - Acao Transversal | Executa o recurso custodiado: planeja por rubricas, registra despesas e presta contas institucional. |
| M014 - Prestacao de Contas | Presta contas da Iniciativa/Projeto. Nao e dono da prestacao de contas institucional da Acao Transversal. |
| M008 - Cadastros Corporativos | Fornece `ContaBancaria` BANESTES (INV-TGP03), documentos, tipos documentais, instituicoes e rubricas de referencia. |

## Capacidades

| Capacidade | Descricao |
|------------|-----------|
| Vincular financiamento | Recebe a `OutorgaAcaoTransversal` criada pela taxa-gestao (VINCULADA) e ativa a `AcaoTransversal`. |
| Planejar aplicacao | Distribui o valor custodiado por rubricas permitidas, dentro do escopo da outorga. |
| Executar despesas | Registra despesas internas da agencia vinculadas a documentos comprobatórios. |
| Prestar contas | Submete, analisa, aprova, glosa, reprova ou encerra a prestacao de contas institucional. |
| Acompanhar dashboard | Exibe vinculado, planejado, executado, glosado e saldo por outorga, rubrica e periodo. |

## Conceitos

| Conceito | Definicao |
|----------|-----------|
| `TaxaGestaoParcerias` | Valor retido sobre o `AporteFinanceiro` da Parceria. Calculada pelo M010, custodiada pelo subdominio [taxa-gestao](../taxa-gestao/README.md). Referenciada aqui via `OutorgaAcaoTransversal` — nao modelada neste subdominio. |
| `OutorgaAcaoTransversal` | Link de financiamento que vincula uma `TaxaGestaoParcerias` custodiada (taxa-gestao) a uma `AcaoTransversal`. Contem `numeroTermo`, `atoAutorizacao`, `dataAssinatura`, vigencia, `escopoGestao`, `valorVinculado`, `coordenadorOutorgado` (PessoaFisica M008) e `termoOutorga` (Documento M008). Relacao N:N entre taxa e acao. INV-TGP01: `SUM(valorVinculado) <= TaxaGestaoParcerias.valorTaxaGestao`. |
| `AcaoTransversal` | Projeto institucional interno da FAPES financiado pelas taxas custodiadas. Estados EM_ELABORACAO -> ATIVA -> EM_PRESTACAO -> ENCERRADA. Tem `coordenadorOutorgado` (via outorga), objetivo, plano de aplicacao e prestacao de contas. |
| `PlanoAplicacaoAT` | Previsao de uso do recurso da AcaoTransversal por rubrica e unidade responsavel. Ligado a outorga/acao. |
| `DespesaAcaoTransversal` | Despesa efetiva da agencia feita com recurso custodiado da AcaoTransversal. |
| `PrestacaoContasAcaoTransversal` | Processo institucional de consolidacao, analise, glosa e encerramento das despesas da AcaoTransversal, com escopo na `OutorgaAcaoTransversal`. |

### Conta, Fundo, Centro e Rubrica

Na Acao Transversal, o recurso custodiado segue esta ordem:

```text
Taxa de Gestao de Parcerias custodiada (taxa-gestao) VINCULADA
  -> OutorgaAcaoTransversal -> AcaoTransversal ATIVA
  -> Plano de aplicacao por rubrica
  -> Despesas executadas por rubrica
```

A classificacao contabil/financeira da taxa (conta contabil, fundo financeiro, centro de custo) ocorre na [taxa-gestao](../taxa-gestao/README.md) no momento da recepcao. A Acao Transversal opera sobre o valor ja classificado e custodiado.

| Conceito | Uso na Acao Transversal |
|----------|-------------------------|
| Conta contabil | Classifica contabilmente a despesa da Acao Transversal. A entrada da taxa e classificada na taxa-gestao. |
| Fundo financeiro | Carteira/fonte institucional onde a taxa custodiada esta segregada (definida na taxa-gestao). |
| Centro de custo | Indica a area/finalidade interna responsavel pela gestao ou consumo. |
| Rubrica | Detalha como o recurso sera planejado e executado: diarias, passagens, publicacoes, servicos de terceiros, material permanente etc. |

O recurso custodiado nao e uma rubrica unica. Ele e distribuido em rubricas no plano de aplicacao da Acao Transversal.

### Conta Bancaria Especifica

Quando a taxa-gestao repassa ao Coordenador Outorgado, a Acao Transversal tambem precisa de controle bancario. Pela Resolucao CCAF nº 334/2023, a transferencia deve ocorrer em conta bancaria especifica, aberta pela FAPES em nome do Coordenador Outorgado, no BANESTES.

Essa conta bancaria e diferente da conta contabil. A conta contabil classifica a natureza do recurso ou despesa; a conta bancaria e onde o dinheiro e efetivamente creditado e movimentado. O repasse e a custodia bancaria sao da [taxa-gestao](../taxa-gestao/README.md); a Acao Transversal apenas referencia o escopo da outorga ja repassada:

```text
TaxaGestaoParcerias custodiada (taxa-gestao: CLASSIFICADA -> REPASSADA -> VINCULADA)
  -> OutorgaAcaoTransversal (Coordenador Outorgado designado pela Diretoria Executiva)
  -> AcaoTransversal ATIVA
  -> ContaBancaria BANESTES (M008 — INV-TGP03)
```

A conta especifica nao deve ser modelada como uma conta unica global da FAPES para toda Acao Transversal. Tambem nao deve ser travada como exatamente uma conta por parceria. Ela deve estar vinculada ao escopo formal da outorga ou do repasse, podendo cobrir uma taxa custodiada, uma parceria, um conjunto de taxas ou outro agrupamento definido no Termo de Outorga.

## Regras

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN-AT-01 | A `AcaoTransversal` so e ativada apos a taxa-gestao criar a `OutorgaAcaoTransversal` (taxa VINCULADA); o calculo e o recebimento da taxa sao da [taxa-gestao](../taxa-gestao/README.md). | Must |
| RN-AT-02 | A `AcaoTransversal` opera sobre o valor custodiado e classificado pela taxa-gestao; a classificacao contabil/financeira da entrada nao se repete neste subdominio. | Must |
| RN-AT-03 | Despesas so podem usar rubricas permitidas para Acao Transversal. | Must |
| RN-AT-04 | Toda despesa exige documento comprobatório e justificativa. | Must |
| RN-AT-05 | Valores glosados retornam como saldo glosado/pendente de providencia, nao como saldo livre para Programas. | Must |
| RN-AT-06 | A prestacao de contas institucional da Acao Transversal nao se confunde com a prestacao de contas da Iniciativa no M014. | Must |
| RN-AT-07 | O plano de aplicacao nao pode superar o `valorVinculado` da outorga disponivel e seus itens devem usar rubricas permitidas para Acao Transversal. | Must |
| RN-AT-08 | Quando a taxa-gestao realiza o repasse, a conta bancaria deve ser especifica para o escopo autorizado no Termo de Outorga, aberta pela FAPES em nome do Coordenador Outorgado no BANESTES (INV-TGP03). | Must |

## Fluxo Macro

```text
M010 — Parceria
  calcula TaxaGestaoParcerias sobre o aporte; emite TaxaGestaoParceriasCalculada
  (detalhe do calculo em taxa-gestao)

M016 — Taxa de Gestao de Parcerias (subdominio taxa-gestao)
  Recebida -> Classificada -> Repassada -> Vinculada (marcos derivados)
  VINCULADA cria OutorgaAcaoTransversal -> AcaoTransversal

M016 — Acao Transversal (este subdominio)
  recebe a OutorgaAcaoTransversal e ativa a AcaoTransversal (EM_ELABORACAO -> ATIVA)
  elabora PlanoAplicacaoAT por rubrica permitida
  registra DespesaAcaoTransversal com documento comprobatorio
  submete / analisa / aprova ou glosa PrestacaoContasAcaoTransversal (EM_PRESTACAO)
  prestacao APROVADA -> emite PrestacaoAcaoTransversalSubmetida -> taxa-gestao encerra a taxa
  encerra AcaoTransversal (ENCERRADA)
```

## Backlog

> Parametrizacao de politica, recebimento, classificacao e repasse da taxa pertencem ao subdominio [Taxa de Gestao de Parcerias](../taxa-gestao/README.md) (EPIC-M016-011 a 015).

| ID | Titulo | Prioridade | Documento |
|----|--------|------------|-----------|
| EPIC-M016-008 | Plano de Aplicacao e Execucao de Despesas | Must | [EPIC-M016-008](epics/EPIC-M016-008.md) |
| EPIC-M016-009 | Prestacao Financeira Institucional | Must | [EPIC-M016-009](epics/EPIC-M016-009.md) |
| EPIC-M016-010 | Dashboard e Relatorios da Acao Transversal | Should | [EPIC-M016-010](epics/EPIC-M016-010.md) |

## Documentos

| Documento | Descricao |
|-----------|-----------|
| [Modelo](modelo/README.md) | Diagrama e regras estruturais da outorga, acao transversal, plano, despesa e prestacao de contas. |
| [Processo](processo.md) | Fluxos de vinculo via outorga, plano por rubrica, execucao e prestacao de contas institucional. |
| [Proposta de Tela e Impacto no Codigo](proposta-tela-e-impacto-codigo.md) | Analise do impacto no prototipo de Parcerias e desenho da tela do M016 para Acao Transversal. |
| [Epicos](epics/README.md) | Backlog funcional detalhado da Acao Transversal. |
