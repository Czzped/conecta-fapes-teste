# Domain 05 — Financeiro

Execucao financeira, controle de contas bancarias, fluxo de caixa, pagamentos, contabilidade e prevencao a lavagem de dinheiro. Glossario dos conceitos centrais em [../glossario.md](../glossario.md).

**Modulos que implementam este domain:** M004, M016, M017

---

## 5.1 Contabilidade

Escrituracao contabil da agencia: cadastro de contas, vinculacao a programas e projetos, e painel de monitoramento financeiro.

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 5.1.1 | Cadastro de Contas-Contabeis | Organizar escrituracao contabil da agencia conforme LOA/LDO/PPA | Analista da Area Tecnica da Agencia | Art. 5, III; Art. 25, I e II |
| 5.1.2 | Associar Contas com Iniciativas/Programas/Editais/Parcerias | Vincular registros contabeis a programas, projetos e parcerias | Analista da Area Tecnica da Agencia | Art. 25, III |
| 5.1.3 | Dashboard Contabil e Financeiro | Painel para monitorar registros contabeis e financeiros | Analista da Area Tecnica da Agencia, SECONT | Art. 25, III; Art. 3, 3 |

## 5.2 Financeiro

Controle de contas bancarias, fluxo de caixa e gestao financeira dos recursos da agencia, programas, projetos e parcerias.

### Rubricas e Subrubricas FAPES

O catalogo de Rubricas usado para planejamento, execucao e prestacao de contas deve partir da base normativa da FAPES e ser restringido por edital/instrumento. O discovery canonico esta em [Rubricas e Subrubricas FAPES](../rubricas-subrubricas-fapes.md). Essa classificacao nao substitui conta contabil nem movimento bancario: Rubrica organiza o orcamento aprovado do projeto; `Transacao` movimenta o saldo da rubrica; conta contabil organiza escrituracao e demonstrativos; transacao financeira registra movimento bancario para conciliacao.

As naturezas de despesa principais sao **Custeio** e **Capital**. Em custeio, o catalogo contempla bolsas, auxilios, material de consumo, servicos de terceiros, despesa de locomocao, diarias, adequacao de espaco fisico, DOACI, vencimentos/vantagens fixas e obrigacoes patronais. Em capital, contempla equipamentos e material permanente, material bibliografico e software. A Rubrica possui `codigo`, `nome`, `descricao`, `naturezaDespesa` e hierarquia por `rubricaPai`/`subrubricas`; subrubrica e sempre Rubrica filha, sem campo de nivel. O sistema deve preservar a Rubrica aprovada e as restricoes do edital para que M013/M014 consigam controlar saldo, comprovantes e prestacao de contas de forma rastreavel.

### Taxa de Gestao de Parcerias

A Taxa de Gestao de Parcerias e o percentual retido sobre o valor de cada aporte de uma Parceria, destinado a custear despesas operacionais e administrativas da FAPES relacionadas a execucao dos programas e projetos apoiados. Conforme a Resolucao CCAF n. 334/2023, esses recursos apoiam, estruturam, organizam e capacitam as areas meio e finalisticas da Fundacao.

A Taxa **nao e** rubrica do projeto nem recurso disponivel ao coordenador da iniciativa apoiada. Ela nasce automaticamente ao registrar um AporteFinanceiro na Parceria (M010) e e custodiada pelo M016. Quando houver repasse, a transferencia ocorre em conta bancaria especifica no BANESTES, cadastrada no M008 como ContaBancaria.

### Acao Transversal

A Acao Transversal e o projeto ou acao institucional interna da FAPES que gasta os recursos custodiados pela Taxa de Gestao de Parcerias. Ela tem objetivo, periodo, area responsavel, Coordenador Outorgado designado via Termo de Outorga, plano de aplicacao por rubrica permitida, despesas institucionais e prestacao de contas financeira.

#### Coordenador Outorgado

O Coordenador Outorgado e o servidor publico vinculado a FAPES que recebe autorizacao formal da Diretoria Executiva para gerir os recursos de uma Acao Transversal por meio de Termo de Outorga (TO). Esse papel existe para operacionalizar a movimentacao, utilizacao e prestacao de contas dos recursos. O outorgado NAO deve ser inferido automaticamente do coordenador da Parceria, Programa ou Projeto. A designacao depende do ato da Diretoria Executiva e do respectivo TO. Quando necessario, o Coordenador Outorgado pode indicar membros para executar atividades previstas no TO, mas a responsabilidade permanece vinculada ao outorgado.

Ver detalhamento completo em [Domain 08](08-acao-transversal.md).

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 5.2.1 | Cadastro de Contas Bancarias | Registrar e manter contas bancarias vinculadas a agencia, programas, projetos e parcerias | Analista da Area Tecnica da Agencia | Art. 25, I; Art. 27, II |
| 5.2.2 | Fluxo de Caixa | Acompanhar entradas e saidas financeiras por periodo, programa, projeto ou parceria, com projecoes de saldo | Analista da Area Tecnica da Agencia | Art. 25, III; Art. 5, III |
| 5.2.3 | Conciliacao Bancaria | Reconciliar extratos bancarios com os registros contabeis do sistema | Analista da Area Tecnica da Agencia | Art. 25, III; Art. 27, II |
| 5.2.4 | Controle de Saldo por Conta | Monitorar saldo disponivel por conta bancaria com alertas de limite minimo | Analista da Area Tecnica da Agencia | Art. 25, III |
| 5.2.5 | Dashboard Financeiro | Painel consolidado com posicao financeira, saldos, fluxo de caixa e movimentacoes por programa e projeto | Analista da Area Tecnica da Agencia, SECONT | Art. 25, III; Art. 3, 3 |
| 5.2.6 | Gestao de Fundos Financeiros | Criar e manter fundos financeiros que agregam recursos de multiplas contas bancarias; cada conta pertence a exatamente um fundo (N:1); implementacao deferida para pos-M014 | Analista da Area Tecnica da Agencia | Art. 25, I; Art. 27, II |

## 5.3 Pagamentos

Execucao financeira de pagamentos: marcos de liberacao, processamento de bolsas (padrao, Unac, mestrado/doutorado), parcelas de projetos, auxilios e integracao com Banestes e BANDES. Em caso de pagamento duplicado ao bolsista, o sistema registra a ocorrencia e notifica o bolsista para devolucao do valor na conta do projeto, acompanhando o status ate a regularizacao.

**Implementado por:** [M004 — Pagamento de Bolsistas](../../implementation/modules/M004-pagamento-bolsista/README.md)

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 5.3.1 | Gestao dos Marcos de Pagamento | Definir marcos e cronogramas de liberacao financeira | Analista da Area Tecnica da Agencia | Art. 28, II; Art. 25, I |
| 5.3.2 | Dashboard de Pagamentos | Painel para acompanhar pagamentos autorizados e executados | Analista da Area Tecnica da Agencia | Art. 16; Art. 25, III |
| 5.3.3 | Pagamento de Bolsas Padrao (Seriada) | Processar pagamento de bolsas com parcelas regulares | Analista da Area Tecnica da Agencia | Art. 3, VII; Art. 25, III |
| 5.3.4 | Pagamento de Bolsas Unac (nao seriada) | Processar pagamento de bolsas de programas especificos | Analista da Area Tecnica da Agencia | Art. 3, VII; Art. 14, VIII |
| 5.3.5 | Pagamento de Bolsas Mestrado e Doutorado | Processar pagamento de bolsas de capacitacao cientifica | Analista da Area Tecnica da Agencia | Art. 3, VII; Art. 15, III |
| 5.3.6 | Pagamento de Parcelas dos Projetos | Autorizar e executar pagamentos de parcelas orcamentarias | Analista da Area Tecnica da Agencia | Art. 16; Art. 25 e 26 |
| 5.3.7 | Pagamento de Auxilios | Processar pagamento de auxilios concedidos | Analista da Area Tecnica da Agencia | Art. 28, II; Art. 25 e 26 |
| 5.3.8 | Aprovar Pagamento de Parcelas de Bolsas | Area tecnica libera recursos para pagamento de bolsas | Area Tecnica | Art. 28, II; Art. 25, III |
| 5.3.9 | Geracao de Documento de Pagamento para Bandes | Gerar documento para transferencia de recursos via BANDES | Analista da Area Tecnica da Agencia | — |
| 5.3.10 | Monitorar Folha de Pagamento | Acompanhar execucao e status das folhas de pagamento | Analista da Area Tecnica da Agencia | Art. 16; Art. 25, III |
| 5.3.11 | Servico de Remessa/Retorno Banestes (@-EDI) | Integrar com Banestes para envio de remessas e conciliacao de retornos | Analista da Area Tecnica da Agencia | Art. 16; Art. 25, III |
| 5.3.12 | Gestao de Pagamento Duplicado | Detectar pagamentos duplicados ao bolsista, registrar a ocorrencia, notificar o bolsista para devolucao do valor na conta do projeto e acompanhar o status da regularizacao ate a confirmacao do estorno | Analista da Area Tecnica da Agencia, Bolsista | Art. 27, II; Art. 25, III |
| 5.3.13 | Gestao de Pagamento a Maior | Identificar pagamentos realizados acima do valor correto; o valor excedente e registrado como debito do bolsista e descontado automaticamente nos pagamentos futuros ate a quitacao total do saldo devedor | Analista da Area Tecnica da Agencia, Bolsista | Art. 27, II; Art. 25, III |

## 5.4 Prevencao a Lavagem de Dinheiro (PLD)

Controles e verificacoes para prevencao a lavagem de dinheiro e ao financiamento do terrorismo, conforme exigencias legais aplicaveis a entidades que gerenciam recursos publicos e de parceiros. A agencia de fomento, como entidade que administra aportes financeiros de entidades parceiras e executa pagamentos a bolsistas e projetos, deve implementar mecanismos de monitoramento, verificacao e reporte de operacoes suspeitas. Inclui tambem a analise de conflitos de interesse entre os membros do projeto e as pessoas juridicas (PJ) contratadas, impedindo que o coordenador ou participantes tenham vinculo societario, familiar ou empregaticio com os fornecedores contratados pelo projeto.

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 5.4.1 | Verificacao Cadastral (KYC) | Verificar dados cadastrais de beneficiarios, coordenadores e entidades parceiras contra bases publicas (CPF/CNPJ, PEP, sancoes) antes de efetuar pagamentos ou firmar parcerias | Analista da Area Tecnica da Agencia | Art. 4, 1; Art. 6, par. unico |
| 5.4.2 | Monitoramento de Transacoes Atipicas | Identificar automaticamente transacoes financeiras fora do padrao esperado (valores, frequencia, destino) em pagamentos de bolsas, auxilios e parcelas de projetos | Analista da Area Tecnica da Agencia | Art. 25, III; Art. 27, II |
| 5.4.3 | Alertas de Operacoes Suspeitas | Gerar alertas automaticos quando transacoes atenderem criterios de risco predefinidos para analise manual | Analista da Area Tecnica da Agencia, SECONT | Art. 25, III; Art. 6, par. unico |
| 5.4.4 | Analise e Tratamento de Alertas | Servidor analisa alertas gerados, registra parecer e decide sobre bloqueio ou liberacao da operacao | Analista da Area Tecnica da Agencia | Art. 6, par. unico; Art. 15, III |
| 5.4.5 | Bloqueio Preventivo de Pagamento | Bloquear preventivamente um pagamento quando identificada operacao suspeita, ate conclusao da analise | Analista da Area Tecnica da Agencia | Art. 16; Art. 25, III |
| 5.4.6 | Reporte ao COAF | Gerar comunicacao de operacoes suspeitas ao Conselho de Controle de Atividades Financeiras (COAF) conforme legislacao vigente | Analista da Area Tecnica da Agencia | Art. 25, III; Art. 6, par. unico |
| 5.4.7 | Consulta a Listas Restritivas | Verificar pessoas e entidades contra listas de sancoes nacionais e internacionais (OFAC, ONU, UE) | Analista da Area Tecnica da Agencia | Art. 4, 1; Art. 6, par. unico |
| 5.4.8 | Trilha de Auditoria PLD | Registrar log completo de todas as verificacoes, alertas, analises e decisoes de PLD para fiscalizacao | SECONT, Analista da Area Tecnica da Agencia | Art. 6, par. unico; Art. 15, III; Art. 27, II |
| 5.4.9 | Dashboard PLD | Painel com indicadores de risco, alertas pendentes, operacoes bloqueadas e reportes ao COAF | Analista da Area Tecnica da Agencia, SECONT | Art. 25, III; Art. 3, 3 |
| 5.4.10 | Analise de Conflito de Interesse com PJ | Verificar automaticamente se o coordenador ou qualquer participante do projeto possui vinculo com a pessoa juridica contratada — societario (socio ou administrador do CNPJ), familiar (parente ate segundo grau) ou empregaticio (funcionario ou prestador da PJ); a contratacao e bloqueada quando identificado conflito, exigindo analise manual e justificativa registrada pelo analista | Analista da Area Tecnica da Agencia | Art. 6, par. unico; Art. 4, 1 |
