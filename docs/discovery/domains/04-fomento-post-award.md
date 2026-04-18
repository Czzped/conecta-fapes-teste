# Domain 04 — Fomento Post-Award (Execucao e Acompanhamento)

Fluxo de execucao do projeto contratado ate a sua finalizacao. Glossario dos conceitos centrais em [../glossario.md](../glossario.md).

**Modulos que implementam este domain:** M003, M009, M012, M013, M014, M015

---

## 4.0 Gestao de Iniciativas Captadas

Apos a contratacao, as iniciativas aprovadas passam a ser gerenciadas operacionalmente pelo M003. Este sub-dominio concentra o ownership de editais operacionais, projetos contratados, cotas de bolsa e alocacoes de bolsistas.

**Implementado por:** [M003 — Gestao de Iniciativas Captadas](../../implementation/modules/M003-gestao-iniciativas-captadas/README.md)

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 4.0.1 | Registrar Edital Operacional | Registrar edital com area tecnica e vinculos de programa/parceria | Analista da Area Tecnica da Agencia | Art. 15, I |
| 4.0.2 | Registrar Projeto Contratado | Registrar projeto vinculado a edital com coordenador e datas | Analista da Area Tecnica da Agencia | Art. 28, I |
| 4.0.3 | Gestao de Cotas de Bolsa | Cadastrar cotas por versao de nivel de bolsa no edital | Analista da Area Tecnica da Agencia | Art. 3, VII |
| 4.0.4 | Alocacao Operacional de Bolsistas | Registrar alocacao consumindo cota do edital, vinculando bolsista e orientador | Analista da Area Tecnica da Agencia | Art. 3, VII; Art. 14, VIII |
| 4.0.5 | Visao Operacional Consolidada | Consultar visao do edital com projetos, cotas e alocacoes | Analista da Area Tecnica da Agencia | Art. 3, II |

---

## 4.1 Acompanhamento de Iniciativas

Paineis de acompanhamento para os diferentes perfis: coordenador monitora seus projetos, agencia monitora todas as iniciativas, e SECONT fiscaliza externamente.

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 4.1.1 | Dashboard de Iniciativas (Coordenador) | Painel do coordenador para acompanhar seus projetos contratados | Coordenador | Art. 3, II; Art. 3, 3 |
| 4.1.2 | Dashboard de Iniciativas (agencia de fomento) | Painel da agencia para monitorar todas as iniciativas contratadas | Analista da Area Tecnica da Agencia | Art. 3, II; Art. 3, 3 |
| 4.1.3 | Dashboard de Iniciativas (SECONT) | Painel de fiscalizacao para acompanhamento externo das iniciativas | SECONT | Art. 3, 3; Art. 15, III |

## 4.2 Gestao de Resultados

Gestao dos resultados esperados e entregues pelo projeto: solicitacao de mudancas, submissao de relatorios tecnicos, analise pela agencia e contestacao pelo coordenador.

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 4.2.1 | Solicitar Mudancas de Resultados | Coordenador solicita alteracao nos resultados esperados da iniciativa, registrando a justificativa e os novos valores propostos | Coordenador | — |
| 4.2.2 | Aprovar Mudancas de Resultados | Analista da area tecnica avalia a solicitacao com visibilidade comparativa entre a linha base (resultados prometidos na proposta original), os valores solicitados pelo coordenador e os resultados ja entregues, decidindo pela aprovacao ou rejeicao | Analista da Area Tecnica da Agencia | — |
| 4.2.3 | Submissao dos Resultados | Coordenador submete relatorios tecnicos para apreciacao | Coordenador | Art. 12, 2; Art. 18 |
| 4.2.4 | Analisar Resultados | Agencia avalia relatorios tecnicos e prestacao de contas | Analista da Area Tecnica da Agencia | Art. 12, 2; Art. 18; Art. 15, III |
| 4.2.5 | Contestar Prestacao de Contas | Coordenador contesta parecer da prestacao de contas | Coordenador | — |

## 4.3 Gestao Orcamentaria do Projeto

Controle orcamentario do projeto em execucao: adicoes orcamentarias, inclusao de rubricas de despesa e remanejamento de recursos entre rubricas.

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 4.3.1 | Solicitar Adicao Orcamentaria | Coordenador solicita aumento do orcamento do projeto | Coordenador | Art. 25 e 26 |
| 4.3.2 | Aprovar Adicao Orcamentaria | Agencia avalia e aprova o acrescimo orcamentario | Analista da Area Tecnica da Agencia | Art. 25 e 26 |
| 4.3.3 | Cancelar Adicao Orcamentaria | Agencia cancela uma solicitacao de adicao orcamentaria | Analista da Area Tecnica da Agencia | — |
| 4.3.4 | Solicitar Adicao de Rubrica | Coordenador solicita inclusao de nova rubrica de despesa | Coordenador | — |
| 4.3.5 | Aprovar Adicao de Rubrica | Agencia avalia e aprova a nova rubrica | Analista da Area Tecnica da Agencia | — |
| 4.3.6 | Remanejamento Orcamentario | Coordenador solicita transferencia de recursos entre rubricas | Coordenador | Art. 25 e 26 |
| 4.3.7 | Aprovar Remanejamento | Agencia avalia e aprova o remanejamento solicitado; a aprovacao e automatica quando o remanejamento ocorre entre subrubricas dentro da mesma rubrica, dispensando analise manual | Analista da Area Tecnica da Agencia | — |
| 4.3.8 | Visualizar Remanejamento | Consultar historico de remanejamentos do projeto | Analista da Area Tecnica da Agencia | — |
| 4.3.9 | Remanejar Bolsa | Coordenador transfere bolsa entre participantes do projeto | Coordenador | Art. 3, VII; Art. 14, VIII |

## 4.4 Prestacao de Contas

Fluxo de prestacao de contas do projeto: backoffice FAPES prepara a base (extrato bancario, orcamento anual, contas contabeis, conta bancaria); o Coordenador monta a prestacao vinculando transacoes e registrando justificativas (NF, diaria ou invoice internacional); e o Responsavel FAPES analisa, aprovando, negando ou devolvendo para revisao. A edicao das entidades da prestacao e bloqueada enquanto o status e `EM_ANALISE`.

**Implementado por:** [M014 — Prestacao de Contas](../../implementation/modules/M014-prestacao-contas/README.md)

### Preparacao (Backoffice FAPES)

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 4.4.1 | Importar Extrato Bancario | Importar lancamentos do extrato bancario do projeto, criando `TransacaoFinanceira` (debito/credito) associadas a `ContaBancaria` | Responsavel FAPES | Art. 27, II |
| 4.4.2 | Gerir Orcamento Anual e Contas Contabeis | Cadastrar orcamento anual (`Orcamento`) com `ValorBolsasPrevisto` e `ValorCapitalPrevisto`, e criar `ContaContabil` hierarquica com limites por rubrica | Responsavel FAPES | — |
| 4.4.3 | Gerir Conta Bancaria do Projeto | Cadastrar/atualizar banco, agencia, numero e titular da `ContaBancaria` do projeto | Responsavel FAPES | — |

### Montagem da Prestacao (Frontoffice Coordenador)

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 4.4.4 | Criar Prestacao de Contas | Criar nova `Prestacao` em status `RASCUNHO` | Coordenador | Art. 27, II |
| 4.4.5 | Vincular Transacao Financeira a Prestacao | Vincular `TransacaoFinanceira` do extrato a uma `Prestacao` em `RASCUNHO` ou `REVISAO` — uma transacao so pode estar vinculada a uma prestacao por vez | Coordenador | Art. 27, II |
| 4.4.6 | Registrar Justificativa NF (produto/servico) | Cadastrar `JustificativaNF` com `DocumentoFiscal` validado via API SERPRO pela `ChaveAcesso` (44 digitos); cada item da nota e classificado em uma `ContaContabil` | Coordenador | Art. 27, II; Art. 3, 1 |
| 4.4.7 | Registrar Justificativa de Diaria | Cadastrar `JustificativaDiaria` com `ValorDiaria`, `Quantidade` e bolsista beneficiario (`AlocacaoBolsistaRef`) | Coordenador | Art. 27, II; Art. 3, 1 |
| 4.4.8 | Registrar Justificativa Invoice (internacional) | Cadastrar `JustificativaInvoice` para despesas em moeda estrangeira com `ValorCambio` e `TipoMoeda` | Coordenador | Art. 27, II; Art. 3, 1 |
| 4.4.9 | Adicionar Orcamentos de Fornecedor | Cadastrar ate 3 `OrcamentoFornecedor` por justificativa como comprovacao de melhor preco; no maximo um pode ser marcado como escolhido | Coordenador | — |
| 4.4.10 | Classificar Item de NF em Conta Contabil | Vincular cada `ItemDocumentoFiscal` a uma `ContaContabil`, permitindo apuracao de saldos por rubrica | Coordenador | — |
| 4.4.11 | Submeter Prestacao | Transicionar `Prestacao` de `RASCUNHO` ou `REVISAO` para `EM_ANALISE`, bloqueando edicao das entidades do agregado | Coordenador | Art. 27, II |

### Analise (Backoffice FAPES)

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 4.4.12 | Analisar Prestacao | Consultar detalhes completos da prestacao em `EM_ANALISE` (justificativas, documentos fiscais, itens, orcamentos de fornecedor, transacoes e classificacao contabil) | Responsavel FAPES | Art. 15, III |
| 4.4.13 | Aprovar Prestacao | Finalizar prestacao (`EM_ANALISE → FINALIZADO`); estado terminal irreversivel | Responsavel FAPES | Art. 15, III |
| 4.4.14 | Negar Prestacao | Negar prestacao (`EM_ANALISE → NEGADO`); estado terminal irreversivel | Responsavel FAPES | Art. 15, III |
| 4.4.15 | Solicitar Revisao | Devolver prestacao para correcao (`EM_ANALISE → REVISAO`), reabilitando edicao das entidades do agregado | Responsavel FAPES | Art. 15, III |
| 4.4.16 | Corrigir e Resubmeter Prestacao | Corrigir pendencias em `REVISAO` e resubmeter (`REVISAO → EM_ANALISE`) | Coordenador | Art. 27, II |

## 4.5 Gestao de Bolsistas de Equipe

Gestao dos bolsistas e membros da equipe do projeto: ciclo de vida das bolsas (solicitacao, submissao de documentos, aprovacao, cancelamento e suspensao), inclusao e remocao de voluntarios e designacao do gestor responsavel.

A solicitacao de bolsa e um processo em duas etapas: (1) o coordenador inicia a solicitacao e (2) o bolsista envia a documentacao dentro do prazo definido. A solicitacao somente e concluida apos o envio da documentacao. A competencia do pagamento e determinada pelo momento do envio: documentacao enviada dentro do prazo e aprovada para o mes corrente; enviada fora do prazo, e aprovada para o mes seguinte.

**Implementado por:** [M009 — Gestao Bolsa Pesquisa](../../implementation/modules/M009-gestao-bolsista/README.md)

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 4.5.1 | Solicitar Bolsa | Coordenador inicia a solicitacao de bolsa para um participante do projeto, informando obrigatoriamente: o papel que ele exercera no projeto e a entrega do projeto a qual sua atuacao esta relacionada; o bolsista possui uma secao dedicada ao seu plano de trabalho (4.5.9); a solicitacao so e concluida apos o bolsista enviar a documentacao (4.5.2) | Coordenador | Art. 4; Art. 3, VII |
| 4.5.2 | Submissao de Documentos da Bolsa | Bolsista envia documentacao para habilitacao dentro do prazo definido; se enviada no prazo, a bolsa e aprovada para o mes corrente; se fora do prazo, aprovada para o mes seguinte | Bolsista | Art. 4, 1 |
| 4.5.3 | Aprovar Solicitacao de Bolsa e Documentos | Agencia analisa e aprova a solicitacao e documentos | Analista da Area Tecnica da Agencia | — |
| 4.5.4 | Cancelar Solicitacao de Bolsa | Coordenador cancela uma solicitacao de bolsa | Coordenador | Art. 3, VII; Art. 15, III |
| 4.5.5 | Suspender Solicitacao de Bolsa | Coordenador suspende temporariamente uma bolsa ativa | Coordenador | Art. 3, VII; Art. 6, par. unico |
| 4.5.6 | Visualizar Remanejamento de Bolsa | Consultar historico de remanejamentos de bolsas | Analista da Area Tecnica da Agencia | — |
| 4.5.7 | Gerir Voluntario | Incluir, alterar ou remover voluntarios do projeto | Coordenador | — |
| 4.5.8 | Gerir Gestor do Projeto (Coordenador Adjunto) | Designar ou alterar o Coordenador Adjunto do projeto, responsavel por apoiar e substituir o coordenador principal na gestao das atividades | Coordenador | — |
| 4.5.9 | Plano de Trabalho do Bolsista | Secao dedicada ao plano de trabalho do bolsista, contendo as atividades previstas, cronograma de execucao, papel no projeto e entregas relacionadas; vinculado a solicitacao de bolsa (4.5.1) | Coordenador, Bolsista | Art. 4, 1 |

## 4.6 Suspensao e Finalizacao de Projetos

Fluxos administrativos para suspensao temporaria ou encerramento definitivo de projetos em execucao, com aprovacao da agencia e prestacao de contas final.

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 4.7.1 | Solicitar Suspensao de Projeto | Solicitar a suspensao temporaria de um projeto em execucao | Coordenador, Analista da Area Tecnica da Agencia | Art. 3, II; Art. 6, par. unico |
| 4.7.2 | Aprovar Suspensao | Agencia avalia e aprova a suspensao solicitada | Analista da Area Tecnica da Agencia | — |
| 4.7.3 | Suspender Projeto | Efetivar a suspensao do projeto, interrompendo atividades | Analista da Area Tecnica da Agencia | — |
| 4.7.4 | Solicitar Finalizacao de Projeto | Solicitar o encerramento formal de um projeto | Coordenador, Analista da Area Tecnica da Agencia | — |
| 4.7.5 | Aprovar Finalizacao | Agencia avalia e aprova o encerramento | Analista da Area Tecnica da Agencia | — |
| 4.7.6 | Finalizar Projeto | Efetivar o encerramento do projeto com prestacao de contas final | Analista da Area Tecnica da Agencia | — |
