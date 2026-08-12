---
title: Prestação de Contas
tipo: requisito
---

# Prestação de Contas

<contexto>
A Prestação de Contas é o processo pelo qual o coordenador de um projeto financiado comprova, perante a FAPES, o uso adequado dos recursos recebidos. Numa mesma prestação o coordenador reúne as movimentações bancárias do projeto (o que entrou e o que saiu da conta), justifica cada despesa com o documento comprobatório correspondente (nota fiscal, fatura internacional, diária, passagem), classifica cada gasto numa rúbrica do orçamento e, quando exigido, apresenta cotações de fornecedores para comprovar melhor preço. Depois de montada, a prestação é submetida e a FAPES a analisa, podendo aprová-la, devolvê-la para correção ou negá-la. Uma prestação negada ainda pode ser contestada uma única vez pelo coordenador, dentro de um prazo, abrindo uma última rodada de decisão pela área técnica.

A prestação funciona como um "envelope" que consolida despesas e recebimentos de um projeto para um ciclo de avaliação. Ela nasce vazia e editável, vai sendo preenchida, é fechada para análise no momento da submissão e percorre uma sequência de estados bem definida até chegar a um desfecho (aprovada ou negada). O documento a seguir descreve os atores, o caminho normal, todas as regras de negócio, a máquina de estados completa e os casos de exceção.
</contexto>

## Atores

- **Coordenador** — responsável pelo projeto financiado. Monta a prestação: vincula transações financeiras, cadastra justificativas e documentos comprobatórios, cadastra cotações de fornecedores e submete a prestação para análise. É também quem pode contestar uma prestação negada. Só consegue montar/editar enquanto a prestação está em *rascunho* ou em *revisão*.
- **Responsável FAPES (Analista)** — avalia as prestações submetidas. Aprova, nega ou devolve para revisão. Também administra os dados de base que a prestação consome (orçamento anual do projeto, contas contábeis/rúbricas, contas bancárias e importação das transações financeiras). Não monta prestações nem vincula transações — apenas analisa e configura a base.
- **Área técnica** — atua no desfecho de uma prestação **contestada**. Depois que o coordenador contesta uma prestação negada, a área técnica decide: validar (aprova e finaliza), reprovar (nega novamente) ou devolver para revisão. Na prática exerce o mesmo papel decisório da análise, aplicado ao ciclo de contestação.

> As permissões de análise (aprovar, negar, solicitar revisão) e as de edição (montar/submeter) são mutuamente exclusivas: quem monta não decide, quem decide não monta.

## Fluxo principal

1. **Criação.** O coordenador cria uma nova prestação. Ela nasce em **rascunho**, totalmente editável.
2. **Composição.** Ainda em rascunho, o coordenador:
   - **vincula transações financeiras** do projeto à prestação (as movimentações que serão prestadas de contas);
   - **cadastra justificativas de despesa** — de nota fiscal, de fatura internacional, de diária e de passagem — cada uma com seu documento comprobatório;
   - para justificativas de nota fiscal, cadastra o **documento fiscal**, cujos dados são **extraídos automaticamente** e cujos **itens** são revisados e associados a uma **rúbrica** (conta contábil);
   - quando exigido, cadastra as **cotações de fornecedores** (orçamentos) da despesa.
3. **Submissão.** O coordenador **submete** a prestação. Nesse momento o sistema confere um conjunto de regras de completude (ver *Regras de negócio*); se tudo estiver conforme, a prestação passa para **em análise** e fica bloqueada para edição.
4. **Análise.** O responsável FAPES examina a prestação e decide por um de três caminhos:
   - **aprovar** → a prestação vai para **finalizado** (desfecho positivo, encerra o ciclo);
   - **devolver para revisão** → a prestação volta para **revisão**, com uma **mensagem obrigatória** explicando o que precisa ser corrigido; o coordenador ajusta e **submete novamente**;
   - **negar** → a prestação vai para **negado**, também com **mensagem obrigatória** justificando a recusa.
5. **Contestação (opcional).** Se a prestação foi negada, o coordenador pode **contestar uma única vez**, dentro de **15 dias corridos** da rejeição, apresentando uma justificativa (e, se quiser, documentos). A prestação passa para **contestada**.
6. **Decisão da contestação.** A área técnica avalia a contestação e decide: **validar** (→ finalizado), **reprovar** (→ negado) ou **devolver para revisão** (→ revisão, com nova mensagem). Reprovar **não devolve** o direito de contestar — a contestação é consumida na primeira vez.

## Regras de negócio

### Composição da prestação

Uma prestação é composta por:

- **Transações financeiras.** Cada transação representa uma movimentação bancária do projeto (uma saída/despesa ou uma entrada/recebimento). Uma transação só pode estar vinculada a **uma prestação por vez**; vincular a mesma transação a outra prestação é recusado enquanto houver o vínculo. Vincular e desvincular só é permitido quando a prestação está em **rascunho** ou **revisão**. Desvincular nunca apaga a transação — apenas remove o vínculo. Vincular uma transação já vinculada àquela mesma prestação não gera efeito nem duplicidade. O *status* de exibição de cada transação acompanha o estado da prestação a que ela pertence (pendente quando sem vínculo; em rascunho, em análise, em revisão, aprovada, rejeitada ou contestada conforme o estado da prestação).
- **Classificação de recebimentos.** As entradas de recurso (créditos) importadas do extrato chegam como **pendentes de classificação** e precisam ser classificadas (como despesa, rendimento ou estorno) pelo coordenador ou analista. Só recebimentos podem ser classificados — despesas não. No caso de **estorno**, informa-se qual despesa está sendo estornada; a despesa apontada precisa ainda não ter sido estornada (cada despesa é estornada no máximo uma vez) e o valor do recebimento precisa ser **igual** ao da despesa estornada. A classificação pode ser refeita, exceto quando a transação já pertence a uma prestação submetida.
- **Justificativas de despesa.** Cada gasto é comprovado por uma justificativa, em quatro modalidades:
  - **Justificativa de nota fiscal** — para despesas nacionais, apoiada num **documento fiscal** (nota de produto ou de serviço);
  - **Justificativa de fatura internacional** — para despesas em moeda estrangeira, com valor na moeda original, **taxa de câmbio** e valor convertido para reais;
  - **Justificativa de diária** — para diárias de viagem;
  - **Justificativa de passagem** — para passagens, descrevendo **uma viagem** (origem, destino, datas, horários e comprovantes) com **um ou mais passageiros**.
- **Documento fiscal e seus itens.** Ver *Notas fiscais e extração automática*.
- **Cotações de fornecedor (orçamentos).** Ver *Orçamentos e cotações*.
- **Rúbricas (contas contábeis).** Cada item de nota fiscal e cada item de fatura internacional é classificado numa rúbrica do orçamento; a passagem é classificada por uma rúbrica no nível da própria justificativa; a diária não usa rúbrica.

### Notas fiscais e extração automática

- Ao cadastrar um documento fiscal, informa-se explicitamente o **tipo da nota**: **de produto** ou **de serviço** (o padrão é produto). O tipo determina a validação da **chave de acesso**: para nota de produto, exatamente 44 dígitos; para nota de serviço, no mínimo 44 dígitos (cada município emite em formato próprio). A chave de acesso é obrigatória.
- Os dados da nota são **extraídos automaticamente**: notas de produto são consultadas e validadas junto ao serviço oficial da Receita; notas de serviço são extraídas por um serviço de leitura automática de documentos, com um mecanismo de leitura interna de reserva caso o serviço externo falhe — o coordenador recebe o resultado sem precisar saber qual caminho foi usado. Nota de serviço enviada como imagem não é suportada.
- O documento fiscal tem **itens**. Cada item precisa ser **associado a uma rúbrica** e seu valor total deve ser coerente com quantidade × valor unitário. Os itens extraídos são **revisados** pelo coordenador antes de fechar a prestação.

### Fatura internacional (câmbio)

- São obrigatórios: descrição, valor total na moeda original, taxa de câmbio, moeda, arquivo do documento e data da fatura. O valor total e a taxa de câmbio devem ser maiores que zero. A moeda deve ser uma das suportadas (real, dólar, euro, libra).
- O **valor em reais é sempre calculado pelo próprio sistema** (valor na moeda × câmbio, arredondado a duas casas), nunca aceito diretamente do coordenador. Se a moeda for o real, a taxa de câmbio precisa ser 1.
- A fatura pode ter **itens**, cada um com sua própria rúbrica. Os itens são cadastrados um a um, depois que a fatura já existe (não são exigidos na criação). A soma dos itens **não pode ultrapassar** o valor da fatura em nenhum momento; e **na submissão** a soma dos itens tem que **fechar exatamente** com o valor da fatura — se sobrar ou faltar, a prestação não é submetida.
- Opcionalmente pode-se anexar o **comprovante da fatura do cartão** (print do lançamento) quando a despesa foi paga no cartão do prestador.

### Passagens e passageiros

- Uma justificativa de passagem descreve **uma viagem** e precisa ter **ao menos um passageiro** em qualquer situação. Cada passageiro tem nome, valor, localizador e data de emissão próprios; nome e localizador são obrigatórios e o valor deve ser maior que zero.
- O **valor total da passagem é derivado**: é sempre a soma dos valores dos passageiros, recalculado a cada mudança na lista.
- Os dados da viagem e a composição de passageiros são editados por caminhos separados: alterar a viagem não mexe nos passageiros, e mexer nos passageiros não altera a viagem. É possível **acrescentar** passageiros, **sincronizar** a lista inteira (o que enviar vira o estado final: itens conhecidos são atualizados, novos são criados, ausentes são removidos) ou **remover** um passageiro pontualmente. Não se pode remover o último passageiro (a passagem nunca fica vazia). A soma dos valores dos passageiros não pode ultrapassar o saldo disponível na rúbrica de passagem.

### Orçamentos e cotações

- Cada justificativa pode ter **até 3 cotações** de fornecedor, e **no máximo uma** delas pode ser marcada como **escolhida** (a de melhor preço).
- **Fornecedor único por justificativa**: duas cotações da mesma justificativa não podem ser do mesmo fornecedor (comparação que ignora maiúsculas/minúsculas e espaços nas pontas). A regra vale no cadastro (avulso ou em conjunto) e na edição, e uma violação recusa a operação inteira sem gravar nada parcial.
- **Extração assistida da cotação**: é possível enviar o PDF de uma cotação para leitura automática, que devolve fornecedor e valor sugeridos — apenas para preencher o formulário; não cadastra nem guarda nada por si só.
- **Exigência na submissão**: por padrão, submeter a prestação exige as **3 cotações** cadastradas, **uma escolhida** e **fornecedores distintos**.
- **Dispensa por valor**: quando o valor total das transações da prestação é **menor que R$ 1.400,00**, essa exigência de cotações deixa de ser cobrada — a prestação pode ser submetida sem cotações, com apenas uma ou duas, sem escolhida ou com fornecedores repetidos. As demais regras (documento fiscal, vínculo de item com rúbrica etc.) continuam valendo normalmente.

### Rúbricas (contas contábeis) e saldos

- A rúbrica é a categoria contábil do orçamento onde a despesa é classificada. As rúbricas formam uma árvore de dois níveis (categoria → subrúbrica) e cada uma tem um **limite** de gasto. O saldo de uma rúbrica é o limite menos a soma dos itens classificados nela; saldo negativo sinaliza estouro do limite.
- Cada item de nota fiscal e de fatura precisa estar vinculado a uma rúbrica para que a prestação seja aprovável.

### Submissão

Ao submeter (a partir de *rascunho* ou de *revisão*), o sistema confere as regras de completude: transações vinculadas, justificativas com seus comprovantes, itens de nota/fatura classificados em rúbrica, cotações conforme a regra de exigência (respeitada a dispensa por valor), soma dos itens da fatura fechando com o valor da fatura e o **saldo da prestação zerado** (ver abaixo). Faltando qualquer requisito, a submissão é recusada e a prestação permanece onde estava, editável.

### Saldo zerado para aprovar

- O **saldo da prestação** é a diferença entre o total das transações e o total das justificativas. Saldo positivo indica recursos ainda não justificados; saldo negativo indica justificativas acima das transações.
- Para uma prestação ser **aprovável** (na submissão e na aprovação), o **saldo precisa estar zerado** — ou seja, tudo que foi movimentado precisa estar integralmente justificado. As mesmas regras de completude que valem na submissão são reaplicadas no momento da aprovação.

### Bloqueio de edição durante a análise

Enquanto a prestação está **em análise** ou **contestada**, todo o seu conteúdo fica **bloqueado para edição** (justificativas, documentos fiscais e seus itens, cotações e o vínculo de transações não podem ser alterados nem removidos). O bloqueio garante que a FAPES avalie exatamente o que foi submetido. A edição volta a ser possível quando a prestação retorna para **revisão**. Tentar alterar conteúdo com a prestação em análise é recusado com aviso específico.

### Aprovação individual

Aprovar uma prestação exige que ela esteja **em análise** (ou **contestada**, no ciclo de contestação) e que passe em **todas** as regras de completude (as mesmas da submissão, incluindo o saldo zerado). Aprovada, a prestação vai para **finalizado**, que é definitivo.

### Aprovação em lote

O responsável FAPES pode aprovar **várias prestações de uma vez**, com semântica **tudo-ou-nada**:

- O lote aceita de **1 a 50** prestações, sem identificadores vazios e sem repetições; um lote fora dessas condições é recusado inteiro.
- Antes de qualquer gravação, o sistema analisa **todas** as prestações do lote e reúne **todos** os problemas encontrados de uma vez (não para no primeiro erro). Os motivos de falha possíveis, em linguagem de produto, são:
  - **não encontrada** — o identificador não corresponde a nenhuma prestação;
  - **estado inválido** — a prestação existe mas não está em análise;
  - **reprovada na conferência** — a prestação está em análise mas não passou nas regras de completude.
- A aprovação só é efetivada **se não houver nenhum problema** em nenhuma das prestações. Havendo qualquer falha, **nenhuma** prestação do lote é alterada — todas mantêm seu estado original.
- A aprovação em lote só atua sobre prestações **em análise** (não se aplica ao ciclo de contestação).

### Mensagem obrigatória ao negar e ao devolver

- **Devolver para revisão** e **negar** exigem uma **mensagem** explicando o motivo — o campo não pode ficar vazio nem conter apenas espaços. Sem mensagem válida, a operação é recusada sem efeito.
- Essa mensagem é a **mensagem da FAPES** (ver *Contestação × Defesa*). A cada devolução/negação, a mensagem anterior vira histórico e uma nova mensagem ativa é registrada; existe **no máximo uma mensagem ativa** por prestação a qualquer momento, e o histórico completo fica preservado. A FAPES pode **corrigir o texto** da mensagem ativa sem abrir um novo ciclo (sem mudar o estado da prestação).

### Contestação × Defesa (dois conceitos distintos)

O produto tem **dois** conceitos parecidos que **não devem ser confundidos**:

- **Mensagem da FAPES** — é o texto que a FAPES registra ao **devolver para revisão** ou **negar**, comunicando ao coordenador os motivos da decisão. Ator: FAPES. Cada prestação tem no máximo uma mensagem ativa por vez, mais o histórico das anteriores.
- **Defesa do coordenador** — é a **contestação formal** que o **coordenador** apresenta contra uma prestação **negada**, pedindo reavaliação. Ator: coordenador. Contém uma justificativa obrigatória e, opcionalmente, documentos de apoio.

### Regras da contestação (defesa do coordenador)

- Só é possível contestar uma prestação que esteja **negada**. Tentar contestar em qualquer outro estado é recusado.
- **Uma única vez por prestação, em todo o seu ciclo de vida**: o direito de contestar é consumido na primeira defesa registrada. Mesmo que a prestação volte a ser negada depois (por reprovação da contestação ou por nova rejeição após revisão), não há segunda defesa.
- **Prazo de 15 dias corridos** contados da data da rejeição (dias de calendário, sem excluir fins de semana ou feriados; o 15º dia ainda é aceito). A data de referência é a data da mensagem que a FAPES registrou ao negar. Fora do prazo, a contestação é recusada.
- **Justificativa obrigatória** (não pode ser vazia nem só espaços).
- **Documentos são opcionais**; quando enviados, cada arquivo deve ser PDF, JPEG ou PNG, com até 10 MB, e seu conteúdo tem que corresponder ao tipo declarado. Arquivo inválido recusa o registro.
- Registrada uma contestação válida, a prestação passa de **negado** para **contestada**, de forma atômica (a defesa, seus documentos e a mudança de estado acontecem juntos; se algo falhar, nada é aplicado).
- A defesa registrada é preservada como histórico e não é sobrescrita.

## Estados e transições

Estados possíveis: **rascunho**, **em análise**, **revisão**, **contestada**, **finalizado** e **negado**.

| Estado | Significado | Ações permitidas | Quem |
|---|---|---|---|
| Rascunho | Prestação recém-criada, em montagem, totalmente editável | Vincular/desvincular transações; cadastrar/editar/remover justificativas, documentos, itens e cotações; **submeter** | Coordenador |
| Em análise | Submetida, aguardando decisão da FAPES; conteúdo bloqueado para edição | **Aprovar**, **negar**, **devolver para revisão** (individual ou aprovação em lote) | Responsável FAPES |
| Revisão | Devolvida para correção, com mensagem da FAPES; volta a ser editável | Corrigir conteúdo; **submeter** novamente | Coordenador |
| Contestada | Foi negada e o coordenador apresentou defesa; aguarda a área técnica; conteúdo bloqueado para edição | **Validar** (aprovar), **reprovar** (negar), **devolver para revisão** | Área técnica |
| Finalizado | Aprovada — estado final | Nenhuma | — |
| Negado | Negada, com mensagem da FAPES; pode ser contestada uma única vez, em até 15 dias | **Contestar** (se ainda não houve defesa e dentro do prazo) | Coordenador |

Transições válidas:

| De | Para | Ação | Quem |
|---|---|---|---|
| (criação) | Rascunho | Criar prestação | Coordenador |
| Rascunho | Em análise | Submeter | Coordenador |
| Em análise | Finalizado | Aprovar (individual ou em lote) | Responsável FAPES |
| Em análise | Negado | Negar (com mensagem obrigatória) | Responsável FAPES |
| Em análise | Revisão | Devolver para revisão (com mensagem obrigatória) | Responsável FAPES |
| Revisão | Em análise | Submeter novamente | Coordenador |
| Negado | Contestada | Contestar (defesa; ≤ 15 dias corridos; uma única vez) | Coordenador |
| Contestada | Finalizado | Validar (aprovar) | Área técnica |
| Contestada | Negado | Reprovar (negar, com mensagem obrigatória) | Área técnica |
| Contestada | Revisão | Devolver para revisão (com mensagem obrigatória) | Área técnica |

> Observações sobre o ciclo de contestação: aprovar/negar/devolver para revisão a partir de **contestada** aplicam as mesmas regras funcionais dos equivalentes a partir de *em análise*. Validar uma prestação contestada reexecuta a conferência de completude e o saldo zerado. **Reprovar não devolve o direito de contestar** — a defesa é consumida na primeira vez, mesmo que a prestação volte a ser negada por outro caminho. Devolver uma contestada para revisão reabre a edição e a prestação segue depois o ciclo normal (revisão → em análise via submissão), mantendo a defesa já registrada como histórico.

## Casos especiais e exceções

- **Transação sem prestação.** Uma transação pode existir sem estar vinculada a nenhuma prestação (fica *pendente*). Nesse caso ela permanece livremente editável; o bloqueio de edição só se aplica quando está vinculada a uma prestação em análise/contestada.
- **Dispensa de cotações por valor.** Prestações cujo total de transações é menor que R$ 1.400,00 são submetíveis mesmo sem as 3 cotações / sem escolhida / com fornecedores repetidos.
- **Fatura internacional sem fechar.** Fora da submissão, os itens da fatura podem somar menos que o valor do cabeçalho (inclusive nenhum item); a igualdade exata só é cobrada na submissão/aprovação. Somar **mais** que o valor da fatura é sempre recusado.
- **Registro de nota fiscal.** Cadastrar e editar a fatura internacional e seus itens só é permitido em rascunho/revisão; nos demais estados a operação é recusada.
- **Aprovação em lote com identificadores repetidos ou lista fora de 1–50.** O lote é recusado inteiro, sem detalhar item a item.
- **Aprovação em lote com desfecho misto.** Se as falhas do lote são todas "não encontrada", o resultado sinaliza inexistência; qualquer mistura com "estado inválido" ou "reprovada na conferência" resulta em recusa geral listando cada item com seu motivo.
- **Contestação fora do prazo ou repetida.** Contestar depois de 15 dias corridos, ou uma segunda vez, é recusado com o motivo correspondente (prazo expirado ou defesa já registrada). A verificação de "defesa já registrada" precede a de prazo.
- **Extração automática indisponível.** Se o serviço externo de leitura de nota de serviço falha, o sistema recorre transparentemente à leitura interna de reserva; só devolve erro se ambos falharem. Nota de serviço enviada como imagem não é suportada.
- **Extração de cotação sem resultado.** Se a leitura automática do PDF de cotação não devolve dados, o coordenador é avisado; nada é cadastrado — o envio real da cotação continua sendo feito separadamente.
- **Correção da mensagem da FAPES.** A FAPES pode ajustar o texto da mensagem ativa a qualquer momento (mesmo com a prestação já negada ou finalizada) sem abrir novo ciclo, sem mudar o estado e sem criar histórico novo. As mensagens históricas nunca são alteradas por essa correção.
- **Estorno inválido.** Classificar um recebimento como estorno de uma despesa já estornada, ou com valor diferente do da despesa, é recusado.

## Dados envolvidos

- [[Prestacao]] — o envelope da prestação de contas, com seu estado e saldo.
- [[TransacaoFinanceira]] — movimentações bancárias vinculadas à prestação.
- [[ContaBancaria]] — conta do projeto de onde vêm as transações.
- [[JustificativaDespesa]] — base das justificativas de despesa.
- [[JustificativaNF]] — justificativa apoiada em nota fiscal.
- [[JustificativaInvoice]] — justificativa de fatura internacional (câmbio).
- [[JustificativaDiaria]] — justificativa de diárias.
- [[JustificativaPassagem]] — justificativa de passagem (viagem).
- [[PassageiroPassagem]] — passageiros de uma justificativa de passagem.
- [[DocumentoFiscal]] — nota fiscal (de produto ou de serviço) com dados extraídos automaticamente.
- [[ItemDocumentoFiscal]] — itens da nota fiscal, cada um classificado numa rúbrica.
- [[ItemInvoice]] — itens da fatura internacional, cada um com sua rúbrica.
- [[Orcamento]] — orçamento anual do projeto.
- [[OrcamentoFornecedor]] — cotações de fornecedor (até 3 por justificativa, uma escolhida).
- [[ContaContabil]] — rúbricas (contas contábeis) usadas para classificar os gastos.
- [[Contestacao]] — mensagem da FAPES ao devolver/negar (com histórico e uma ativa por vez).
- [[DefesasPrestacao]] — defesa do coordenador contra uma prestação negada.

## Funcionalidades relacionadas

- [[pagamentos]] — origem dos recursos e movimentações que alimentam as transações do projeto.
- [[solicitacao-de-bolsa]] — bolsas e alocações que geram parte das despesas justificadas.
- [[autenticacao-autorizacao]] — define quem atua como coordenador, responsável FAPES e área técnica e o que cada perfil pode fazer sobre a prestação.
- [[importacao-de-editais]] — origem dos projetos e editais que dão escopo às prestações.
