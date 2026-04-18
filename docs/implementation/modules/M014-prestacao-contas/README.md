# M014 - Prestacao de Contas

[<< Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 04 — Fomento Post-Award](../../../discovery/domains/04-fomento-post-award.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs (8 total, 6 Done), rastreabilidade e debito tecnico |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclos de vida de PrestacaoContas e Contestacao |

> **Nota sobre implementacao:** Este modulo possui um backend independente (`ConectaFapes.PrestacaoContas.*`) com AppDbContext, SQL Server e integracoes proprias (SERPRO, MinIO). Detalhes de infraestrutura em [architecture/04-dados-e-operacao.md](../../../architecture/04-dados-e-operacao.md). Entidades financeiras (ContaBancaria, Orcamento, ContaContabil, TransacaoFinanceira) estao implementadas neste backend mas pertencem conceitualmente a M016/M013 — ver [debito tecnico](backlog.md#debito-tecnico).

---

## Sobre o Modulo

Coordenadores submetem documentos fiscais que comprovam a aplicacao dos recursos do projeto, e a agencia de fomento (Responsavel FAPES) analisa e aprova, nega ou devolve para revisao. O modulo digitaliza todo o ciclo de prestacao de contas — desde a preparacao backoffice (importacao de extrato, orcamento anual, contas contabeis, conta bancaria) ate a analise final — substituindo o processo atual baseado em papel e e-mail por um fluxo rastreavel com reconciliacao entre extrato bancario e despesas declaradas. O sucesso sera medido pela reducao do tempo medio de analise e pela taxa de prestacoes aprovadas na primeira submissao.

---

## Dominio

A prestacao de contas e organizada como um agregado `Prestacao` que agrupa `JustificativaDespesa` (de tipos NF, Diaria ou Invoice internacional) e `TransacaoFinanceira` (lancamentos do extrato bancario vinculados a prestacao). Cada justificativa pode ter ate tres `OrcamentoFornecedor` como comprovacao de melhor preco, dos quais no maximo um e marcado como escolhido.

O fluxo opera em duas frentes:

- **Backoffice (Responsavel FAPES)**: importa transacoes do extrato bancario do projeto, cadastra `Orcamento` anual, `ContaContabil` hierarquica com limites e `ContaBancaria` do projeto.
- **Frontoffice (Coordenador)**: cria a `Prestacao` em RASCUNHO, vincula transacoes bancarias, registra justificativas, anexa orcamentos de fornecedor, classifica itens de nota fiscal em contas contabeis e submete para analise.

O ciclo de estados da prestacao e `RASCUNHO → EM_ANALISE → {FINALIZADO | NEGADO | REVISAO → EM_ANALISE}`. Enquanto a prestacao esta `EM_ANALISE`, toda edicao e exclusao das entidades do agregado e bloqueada para preservar a integridade da analise. `FINALIZADO` e `NEGADO` sao estados terminais.

Notas fiscais eletronicas (NF-e) sao validadas via API SERPRO pela `ChaveAcesso` de 44 digitos; NFS-e sao processadas a partir do XML. O `Status` de `TransacaoFinanceira` e derivado do `Status` da `Prestacao` vinculada (ou `PENDENTE` se nao vinculada). O `Saldo` da prestacao e calculado como `ValorTotalTransacoes - ValorTotalJustificativas`.

> Projetos e editais sao gerenciados por M003 (referenciados via `ProjetoRef` e `AlocacaoBolsistaRef` como views externas). Orcamento, ContaContabil, ContaBancaria e TransacaoFinanceira pertencem conceitualmente a M013/M016 mas estao implementados neste backend como debito tecnico — ver [backlog.md](backlog.md#debito-tecnico).

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Uma `Prestacao` so pode ser submetida se estiver em `RASCUNHO` ou `REVISAO`. | Must |
| RN02 | Uma `Prestacao` so pode ser aprovada, negada ou ter revisao solicitada se estiver em `EM_ANALISE`. | Must |
| RN03 | Enquanto a `Prestacao` esta em `EM_ANALISE`, operacoes de edicao e exclusao nas entidades do agregado (justificativas, documentos fiscais, itens, orcamentos de fornecedor e transacoes vinculadas) sao bloqueadas com erro `PRESTACAO_EM_ANALISE`. | Must |
| RN04 | Uma `TransacaoFinanceira` so pode estar vinculada a uma `Prestacao` por vez; nova vinculacao e rejeitada se ja houver prestacao associada. | Must |
| RN05 | Cada `JustificativaDespesa` pode ter ate 3 `OrcamentoFornecedor`, dos quais no maximo um e marcado como escolhido. | Must |
| RN06 | NF-e sao validadas via API SERPRO por `ChaveAcesso` (44 digitos numericos) antes de vincular o `DocumentoFiscal` a `JustificativaNF`. | Must |
| RN07 | Cada `ItemDocumentoFiscal` deve ser classificado em uma `ContaContabil`. | Must |
| RN08 | `FINALIZADO` e `NEGADO` sao estados terminais — prestacoes nesses estados sao irreversiveis. | Must |
| RI1 | Valores monetarios (`TransacaoFinanceira.Valor`, `JustificativaDespesa.ValorTotal`, `OrcamentoFornecedor.Valor`, `ContaBancaria.SaldoAtual`, `ContaContabil.Limite`) devem ser sempre >= 0. | Must |
| RI2 | `StatusTransacao` e derivado do `Status` da `Prestacao` vinculada: `RASCUNHO→EM_RASCUNHO`, `EM_ANALISE→EM_ANALISE`, `REVISAO→EM_REVISAO`, `FINALIZADO→APROVADA`, `NEGADO→REJEITADA`; sem vinculo: `PENDENTE`. | Must |
| RI3 | `ItemDocumentoFiscal.ValorTotal` = `Quantidade × ValorUnitario`. | Must |

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
