# M014 - Prestacao de Contas

[<< Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 04 — Fomento Post-Award](../../../discovery/domains/04-fomento-post-award.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e debito tecnico |
| [Arquitetura](arquitetura.md) | Avaliacao da arquitetura atual do backend e lacunas frente ao processo revisado |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclos de vida de PrestacaoContas e Contestacao |
| [Processo](processo.md) | Fluxos de processo em diagramas de sequencia Mermaid |

> **Nota sobre implementacao:** Este modulo possui um backend independente (`ConectaFapes.PrestacaoContas.*`) com AppDbContext, SQL Server e integracoes proprias (SERPRO, MinIO). Detalhes de infraestrutura em [architecture/04-dados-e-operacao.md](../../../architecture/04-dados-e-operacao.md). Entidades financeiras (ContaBancaria, Orcamento, RubricaOrcamentaria, TransacaoFinanceira) estao implementadas neste backend mas pertencem conceitualmente a M016/M013 — ver [debito tecnico](backlog.md#debito-tecnico).

> **Linguagem de Rubricas:** No modelo conceitual alvo, o M014 classifica despesas contra a `RubricaProjeto` do M013. O termo `RubricaOrcamentaria` permanece documentado como compatibilidade do backend atual/legado ate a migracao, mas nao deve ser confundido com a Rubrica canonica do M008 nem com conta contabil do M016.

> **Rubrica x transacao:** `RubricaProjeto` classifica a despesa no orcamento aprovado; `Transacao` movimenta o saldo dessa rubrica no M013. `TransacaoFinanceira` representa o movimento bancario importado/conciliado. A prestacao deve manter esses conceitos separados: selecionar/validar rubrica para a despesa e selecionar/validar movimento bancario/transacao financeira para o pagamento.

> **Dependencia de M016 — FundoFinanceiro:** A entidade `FundoFinanceiro` e a relacao N:1 entre `ContaBancaria` e `FundoFinanceiro` estao modeladas em M016 mas sua implementacao esta deferida ate que M014 (Prestacao de Contas) esteja concluido, pois os requisitos de segregacao de fundos surgem naturalmente do fluxo de prestacao de contas. Ver [M016 backlog](../M016-contabilidade-financeiro/backlog.md).

> **Aderencia do backend atual:** A API `leds-conectafapes-prestacao-de-contas` em `develop` esta adequada para uma V1 nuclear de prestacao de contas, com `Prestacao`, `JustificativaNF`, `JustificativaDiaria`, `JustificativaInvoice`, `DocumentoFiscal`, `ItemDocumentoFiscal`, `TransacaoFinanceira`, SERPRO para NF-e, extracao interna de NFS-e e MinIO. Ela ainda nao cobre completamente o processo revisado deste modulo: faltam `JustificativaProdutoSemNota`, fluxo proprio de passagens, campos de PIX, referencia a solicitacao de diaria aprovada no M003, bloqueio de reutilizacao de diaria ja prestada contas, importacao CNAB 240 com EDI Banestes -> API/Base M014 -> MinIO -> fila -> workers, e migracao conceitual de `ContaContabil` para `RubricaOrcamentaria`. Ver avaliacao completa em [arquitetura.md](arquitetura.md).

---

## Sobre o Modulo

Coordenadores ou ortogados submetem documentos fiscais que comprovam a aplicacao dos recursos da iniciativa, e a agencia de fomento (Responsavel FAPES) analisa e aprova, nega ou devolve para revisao. O modulo digitaliza todo o ciclo de prestacao de contas — desde as importacoes de integracao (iniciativa/conta bancaria, orcamento planejado do SIGFAPES e movimentos bancarios CNAB 240) ate a analise final — substituindo o processo atual baseado em papel e e-mail por um fluxo rastreavel com reconciliacao entre movimentos bancarios e despesas declaradas. O sucesso sera medido pela reducao do tempo medio de analise e pela taxa de prestacoes aprovadas na primeira submissao.

---

## Dominio

A prestacao de contas e organizada como um agregado `Prestacao` que agrupa `JustificativaDespesa` (de tipos NF, Diaria, Passagem, Invoice internacional ou Produto sem Nota Fiscal) e `TransacaoFinanceira` (movimentos bancarios importados via CNAB 240 e vinculados a prestacao). Cada justificativa pode ter ate tres `OrcamentoFornecedor` como comprovacao de melhor preco, dos quais no maximo um e marcado como escolhido. A classificacao orcamentaria da despesa fica na justificativa/item/rubrica do projeto, nao na transacao.

O fluxo opera em duas frentes:

- **Backoffice / Integracoes**: jobs de integracao importam movimentos bancarios da iniciativa, orcamento planejado e rubricas orcamentarias hierarquicas com limites. Toda iniciativa possui uma `ContaBancaria` obrigatoria vinculada a uma referencia operacional.
- **Frontoffice (Coordenador)**: cria a `Prestacao` em RASCUNHO, vincula transacoes bancarias, registra justificativas, anexa orcamentos de fornecedor, classifica itens de nota fiscal em rubricas orcamentarias e submete para analise.

O ciclo de estados da prestacao e `RASCUNHO → EM_ANALISE → {FINALIZADO | NEGADO | REVISAO → EM_ANALISE}`. Enquanto a prestacao esta `EM_ANALISE`, toda edicao e exclusao das entidades do agregado e bloqueada para preservar a integridade da analise. `FINALIZADO` e `NEGADO` sao estados terminais.

Notas fiscais eletronicas (NF-e) sao validadas via API SERPRO pela `ChaveAcesso` de 44 digitos; NFS-e sao processadas a partir do XML. O `Status` de `TransacaoFinanceira` e derivado do `Status` da `Prestacao` vinculada (ou `PENDENTE` se nao vinculada). O `Saldo` da prestacao e calculado como `ValorTotalTransacoes - ValorTotalJustificativas`.

> Iniciativas sao gerenciadas por M003. Editais e chamadas sao gerenciados por M011. A prestacao de contas detalhada, documentos fiscais, extratos e transacoes pertencem ao M014; a visao consolidada de execucao pode alimentar o M003.

> **Fronteira com Acao Transversal:** a prestacao financeira institucional da Acao Transversal pertence ao M016, pois trata de despesas internas da agencia de fomento vinculadas a reserva calculada na Parceria. O M014 nao deve criar prestacao de contas de Iniciativa para despesas de Acao Transversal.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Uma `Prestacao` so pode ser submetida se estiver em `RASCUNHO` ou `REVISAO`. | Must |
| RN02 | Uma `Prestacao` so pode ser submetida, aprovada ou finalizada se houver movimentos bancarios importados e conciliacao entre `TransacaoFinanceira` e `JustificativaDespesa`. | Must |
| RN03 | Enquanto a `Prestacao` esta em `EM_ANALISE`, operacoes de edicao e exclusao nas entidades do agregado (justificativas, documentos fiscais, itens, orcamentos de fornecedor e transacoes vinculadas) sao bloqueadas com erro `PRESTACAO_EM_ANALISE`, exceto associacao de estorno prevista na RN13, que deve ser registrada como ajuste conciliatorio auditavel. | Must |
| RN04 | Uma `TransacaoFinanceira` so pode estar vinculada a uma `Prestacao` por vez; nova vinculacao e rejeitada se ja houver prestacao associada. | Must |
| RN05 | Cada `JustificativaDespesa` pode ter ate 3 `OrcamentoFornecedor`, dos quais no maximo um e marcado como escolhido. | Must |
| RN06 | NF-e sao validadas via API SERPRO por `ChaveAcesso` (44 digitos numericos) antes de vincular o `DocumentoFiscal` a `JustificativaNF`. | Must |
| RN07 | Cada `ItemDocumentoFiscal` deve ser classificado em uma `RubricaOrcamentaria`. | Must |
| RN08 | `FINALIZADO` e `NEGADO` sao estados terminais — prestacoes nesses estados sao irreversiveis. | Must |
| RN09 | Operacoes relevantes de submissao, analise, importacao e jobs de integracao devem registrar historico/auditoria. | Must |
| RN10 | Uma `Prestacao` so pode ser aprovada, negada ou ter revisao solicitada se estiver em `EM_ANALISE`. | Must |
| RN11 | Creditos bancarios importados via CNAB 240 devem ser classificados como `ESTORNO`, `RENDIMENTO` ou `PENDENTE_CLASSIFICACAO` conforme origem e pareamento com debitos; `ESTORNO` e um credito de terceiro que anula um debito anterior do mesmo valor, como devolucao de vendedor/fornecedor por compra nao concluida, mesmo quando o debito ainda nao foi vinculado a uma prestacao ou validado pela FAPES. | Must |
| RN12 | Na prestacao de contas de passagem, o Coordenador deve informar obrigatoriamente o valor da passagem comprada, associar a justificativa a uma RubricaProjeto de passagem e anexar o comprovante de pagamento e o comprovante/registro da viagem realizada. | Must |
| RN13 | Durante a elaboracao ou apos a criacao da prestacao, o Coordenador pode associar um credito classificado como `ESTORNO` ao debito estornado correspondente; o sistema deve vincular ambos a mesma `Prestacao`, manter `TransacaoEstornadaId`, preservar historico e exibir o efeito liquido `R$ 0,00` na conciliacao. Se a prestacao ja estiver submetida ou finalizada, a associacao deve ser registrada como ajuste conciliatorio pos-prestacao, sem apagar a submissao original. | Must |
| RI1 | Valores monetarios (`TransacaoFinanceira.Valor`, `JustificativaDespesa.ValorTotal`, `OrcamentoFornecedor.Valor`, `ContaBancaria.SaldoAtual`, `RubricaOrcamentaria.Limite`) devem ser sempre >= 0. | Must |
| RI2 | A soma dos valores vinculados a uma `RubricaOrcamentaria` nao pode exceder seu limite aprovado sem alerta de estouro de rubrica. | Must |
| RI3 | `ItemDocumentoFiscal.ValorTotal` = `Quantidade × ValorUnitario`. | Must |
| RI4 | `StatusTransacao` e derivado do `Status` da `Prestacao` vinculada: `RASCUNHO→EM_RASCUNHO`, `EM_ANALISE→EM_ANALISE`, `REVISAO→EM_REVISAO`, `FINALIZADO→APROVADA`, `NEGADO→REJEITADA`; sem vinculo: `PENDENTE`. | Must |

---

## Escopo Pos-MVP (fora do backend atual)

O backend atual (`ConectaFapes.PrestacaoContas.*`) implementa o ciclo nuclear `RASCUNHO → EM_ANALISE → {FINALIZADO | NEGADO | REVISAO}` com dois atores (Coordenador e Responsavel FAPES). Os temas abaixo **aparecem em issues de discovery e em iteracoes anteriores da documentacao** mas **nao estao no backend atual** e sao classificados como evolucao pos-MVP. Cada tema esta formalizado como EPIC com User Stories e cenarios Gherkin, aguardando decisao para entrar em desenvolvimento.

| Tema Pos-MVP | EPIC | User Stories |
|--------------|------|--------------|
| **Contestacao de parecer (coordenador contesta recusa em ate 15 dias)** | [EPIC-M014-003 — Contestacao e Auditoria](epics/EPIC-M014-003.md) | US-M014-008 Contestar Recusa; US-M014-009 Analisar Contestacao |
| **Auditoria SECONT (orgao externo audita prestacoes finalizadas)** | [EPIC-M014-003 — Contestacao e Auditoria](epics/EPIC-M014-003.md) | US-M014-010 Auditar Prestacao SECONT |
| **Recusa formal com justificativa detalhada (prazo para contestacao)** | [EPIC-M014-002 — Analise de Prestacao](epics/EPIC-M014-002.md) | US-M014-005 Analisar Documentos; US-M014-006 Recusar com Justificativa; US-M014-007 Aprovar Prestacao |
| **Prazo de 30 dias para submeter prestacao apos encerramento do periodo** | [EPIC-M014-009 — Prazos Temporais](epics/EPIC-M014-009.md) | US-M014-030 Validar Prazo de Submissao |
| **Prazo de 30 dias para reposicao de valores apos recusa** (citado em issue [#1723](https://github.com/leds-conectafapes/conectafapes-project/issues/1723)) | [EPIC-M014-009 — Prazos Temporais](epics/EPIC-M014-009.md) | US-M014-031 Validar e Registrar Reposicao; US-M014-032 Notificar Prazos em Aberto |
| **Maquina de estados expandida (11 estados: inclui EmContestacao, EmReanalise, AprovadaFinal, RecusadaFinal, EmAuditoria, Auditada)** | Transversal (DT-M014-002 no [backlog](backlog.md#debito-tecnico)) | Infraestrutura que habilita EPIC-M014-002 + EPIC-M014-003 |

> Qualquer issue que pressuponha esses conceitos (ex.: [#1756](https://github.com/leds-conectafapes/conectafapes-project/issues/1756) discovery de contestacao/SECONT) deve declarar explicitamente que depende de reintegrar o escopo ao backend.
