# Acao Transversal - Gestao Financeira Institucional

[<< Voltar ao M016](../README.md)

## Proposito

Este subdominio controla a gestao financeira institucional da Acao Transversal. A reserva nasce no M010, na Parceria, a partir da politica normativa aplicavel. Depois de calculada e bloqueada para Programas, a reserva passa a ser gerida pelo M016 para planejamento de uso, execucao financeira, documentos, glosas, estornos, saldos e prestacao financeira institucional.

## Referencia Normativa

A modelagem inicial deste subdominio usa como base a **Resolucao CCAF nº 334/2023**, que regulamenta a utilizacao de recursos financeiros de projetos e/ou programas em parcerias destinados a Acao Transversal para a FAPES.

Fonte oficial: [Resolucao CCAF nº 334/2023 - FAPES](https://fapes.es.gov.br/Media/fapes/Resolu%C3%A7%C3%B5es/Resolu%C3%A7%C3%A3o_CCAF_n%C2%BA_334.2023_-_utiliza%C3%A7%C3%A3o_recursos_financeiros_de_projetos_e-ou_programas_em_parcerias_destinados_a_A%C3%A7%C3%A3o_Transversal_para_a_FAPES..pdf)

### Percentuais Parametrizados

| Valor total do projeto/programa/parceria | Percentual de Acao Transversal |
|------------------------------------------|--------------------------------|
| R$ 50.000,00 a R$ 2.000.000,00 | 5% |
| R$ 2.000.000,01 a R$ 5.000.000,00 | 4% |
| Acima de R$ 5.000.000,00 | 3% |

Esses percentuais devem ser cadastrados como `PoliticaAcaoTransversal` e `FaixaAcaoTransversal`, nunca como constantes fixas no codigo. A politica aplicada deve ficar registrada como snapshot na `ReservaAcaoTransversal`, preservando a base legal, a faixa, o percentual e o valor calculado mesmo que uma norma futura altere os parametros.

## Fronteiras

| Contexto | Responsabilidade |
|----------|------------------|
| M010 - Planejamento e Estrategia | Calcula a reserva na Parceria, desconta do saldo alocavel em Programas e registra a origem normativa. |
| M016 - Contabilidade e Financeiro | Recebe a reserva em conta contabil/fundo/centro financeiro institucional, planeja por rubricas, executa, controla e presta financeiramente a reserva de Acao Transversal. |
| M014 - Prestacao de Contas | Presta contas da Iniciativa/Projeto. Nao e dono da prestacao financeira institucional da Acao Transversal. |
| M008 - Cadastros Corporativos | Fornece documentos, tipos documentais, instituicoes e rubricas financeiras de referencia. |

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
| `PoliticaAcaoTransversal` | Norma vigente que define base de calculo e faixas percentuais. |
| `FaixaAcaoTransversal` | Intervalo de valor e percentual aplicavel. |
| `ReservaAcaoTransversal` | Valor reservado na Parceria e transferido para gestao financeira institucional. Cada reserva deve estar vinculada ao AporteFinanceiro que a originou, seja aporte original ou aditivo, e classificada em conta contabil/fundo/centro financeiro. |
| `PlanoAplicacaoAcaoTransversal` | Previsao de uso da reserva por rubrica e unidade responsavel. |
| `DespesaAcaoTransversal` | Despesa efetiva da agencia feita com recurso da reserva. |
| `PrestacaoFinanceiraAcaoTransversal` | Processo institucional de consolidacao, analise, glosa e encerramento das despesas da reserva. |

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

## Fluxo Macro

```text
M010 Parceria
  calcula reserva de Acao Transversal
  bloqueia reserva para Programas
  publica/expõe ReservaAcaoTransversal

M016 Acao Transversal
  recebe reserva
  classifica em conta contabil/fundo/centro financeiro
  define plano de aplicacao
  registra despesas
  analisa documentos
  aprova/glosa/reprova
  encerra prestacao financeira institucional
```

## Backlog

| ID | Titulo | Prioridade | Documento |
|----|--------|------------|-----------|
| EPIC-M016-005 | Gestao Financeira da Acao Transversal | Must | [EPIC-M016-005](epics/EPIC-M016-005.md) |

## Documentos

| Documento | Descricao |
|-----------|-----------|
| [Processo](processo.md) | Fluxos de recebimento/classificacao da reserva, plano por rubrica, execucao e prestacao financeira institucional. |
| [Proposta de Tela e Impacto no Codigo](proposta-tela-e-impacto-codigo.md) | Analise do impacto no prototipo de Parcerias e desenho da tela do M016 para Acao Transversal. |
| [EPIC-M016-005](epics/EPIC-M016-005.md) | Backlog funcional da Gestao Financeira da Acao Transversal. |
