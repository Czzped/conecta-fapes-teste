---
title: Captação de Projetos e Parcerias
tipo: requisito
---

# Captação de Projetos e Parcerias

Este é o módulo administrativo em que a FAPES organiza, de ponta a ponta, como o dinheiro entra e é distribuído: dos grandes objetivos institucionais até o formulário que um proponente preenche para concorrer a recursos. Tudo se encaixa numa cadeia única, do mais amplo ao mais específico:

**Planejamento Estratégico → Eixo Estratégico → Programa → Parceria / Fomento → Captação → Formulário**

- O **planejamento estratégico** é o ciclo institucional (por exemplo, um quadriênio) e reúne os **eixos estratégicos** — as grandes frentes temáticas da fundação.
- Um **programa** vive dentro de um planejamento, responde a uma **instituição demandante** e se liga a um ou mais eixos.
- As **parcerias** formalizam a entrada de recursos de instituições externas; um programa é financiado por **aportes** que vêm dessas parcerias.
- Um **fomento** define as regras de uma oferta de recursos (área técnica, eixo, documentos exigidos, faixas de valor e o formulário a ser respondido).
- Uma **captação** é a execução concreta de um fomento, organizada em **etapas**, e é por meio dela que os proponentes respondem os **formulários dinâmicos**.

O documento descreve o comportamento esperado de cada elo dessa cadeia, com foco no que é regra de negócio e no que muda de estado. O ponto mais rico em regras — e o coração operacional do módulo — é o **ciclo de vida da parceria** e sua relação de mão dupla com os programas.

## Atores

- **Operador administrativo / gestor de parcerias**: cadastra e edita parcerias, publica, registra aditivos, encerra.
- **Usuário da área técnica**: representa uma das áreas técnicas da fundação (identificado por um papel do tipo gerente de uma sigla de área). Suspende e reativa parcerias em nome de sua área técnica.
- **Gestor de programas**: cria, edita e publica programas dentro de um planejamento.
- **Gestor de planejamento estratégico**: cria o ciclo institucional e seus eixos.
- **Operador de fomentos e captações**: define fomentos, suas faixas e etapas, e abre captações.
- **Proponente / candidato**: responde aos formulários dinâmicos de uma captação (rascunho e envio definitivo).
- **Avaliador**: registra o resultado da avaliação e da habilitação sobre as respostas enviadas.

Todo o módulo exige que o usuário esteja autenticado. As operações de suspensão, reativação e encerramento de parceria dependem, além disso, de o usuário pertencer a uma área técnica reconhecida.

## Fluxo principal

### 1. Estruturar o planejamento e seus eixos

O gestor cria um **planejamento estratégico** informando nome, período (início e fim), descrição e, no mesmo passo, os **eixos estratégicos** que o compõem — cada eixo com nome e descrição. O planejamento nasce **em edição**. Os eixos são criados e vinculados ao planejamento numa única operação; não se reaproveita um eixo que já pertença a outro planejamento.

### 2. Criar o programa

Dentro de um planejamento, o gestor cria um **programa**, associando-o a uma **instituição demandante**, a um ou mais eixos, ao período de vigência, ao resumo, aos aportes financeiros que o sustentam e ao seu comitê de governança. O programa também nasce **em edição**.

### 3. Cadastrar a parceria

O operador cadastra uma **parceria** entre a FAPES e uma ou mais instituições externas. Informa nome, número do processo, nível (federal, estadual, municipal ou internacional), setor (público, privado ou misto), datas de início e fim, objetivo, as instituições parceiras com o valor investido por cada uma (os **aportes**) e os documentos obrigatórios (o termo de cooperação e o termo de descentralização). O valor total investido é a soma dos aportes. A parceria nasce **em edição**.

### 4. Publicar

Tanto a parceria quanto o programa passam por uma **publicação**, que é o ato que os torna formalmente vigentes. A publicação só é aceita quando todas as pré-condições estão satisfeitas (ver Regras de negócio). Publicada, a parceria fica **vigente**; o mesmo vale para o programa.

### 5. Manter durante a vigência

Com a parceria vigente, o operador pode registrar **aditivos**: de valor (um novo aporte formalizado) e de vigência (nova data de prazo). Em situações que exijam, a área técnica pode **suspender** a parceria e depois **reativá-la**. Ao fim, a parceria é **encerrada**.

### 6. Ofertar recursos: fomento e captação

O operador define um **fomento** (as regras de uma oferta) e abre uma **captação** sob esse fomento, dividida em **etapas**. Os proponentes respondem os **formulários dinâmicos** vinculados; cada resposta começa como rascunho, é enviada definitivamente e depois recebe resultado de avaliação e de habilitação.

## Regras de negócio

### Hierarquia e vínculos

- Um **eixo pertence a no máximo um planejamento**. Um eixo já vinculado não pode ser reaproveitado em outro planejamento; a criação de planejamento cria os eixos novos junto, na mesma operação.
- O **nome do planejamento é único** e o **nome do eixo é único** (comparação sem diferenciar maiúsculas/minúsculas e ignorando espaços nas pontas). Nomes repetidos são recusados, tanto dentro do mesmo envio quanto contra o que já existe.
- Um **programa** obrigatoriamente pertence a um planejamento e a uma instituição demandante, e liga-se a pelo menos um eixo.

### Cadastro de parceria

- A parceria exige **pelo menos uma instituição** com **valor investido maior que zero**. A mesma instituição não pode aparecer duas vezes.
- Quando informada, a **data de fim deve ser maior ou igual à data de início** (datas iguais são aceitas); a data de fim é opcional (parceria de vigência indefinida).
- São exigidos exatamente os **dois documentos obrigatórios** — termo de cooperação e termo de descentralização. Faltar um, repetir um tipo ou enviar um tipo fora desse conjunto é recusado. Cada documento anexado é verificado: o arquivo precisa existir de fato no armazenamento e não pode já estar vinculado a outra parceria.
- O **valor total investido** é sempre a soma dos aportes informados e é guardado na própria parceria, para que a tela de visualização o mostre diretamente.
- A criação é **tudo-ou-nada**: a parceria, seus aportes e seus documentos são gravados juntos; se qualquer parte falhar, nada é gravado.

### Publicação da parceria

Para publicar uma parceria em edição, todas as condições abaixo precisam estar satisfeitas, verificadas **nesta ordem** (a publicação para no primeiro problema encontrado):

1. A **data de assinatura do termo** está preenchida.
2. Existe **pelo menos um aporte** vinculado.
3. Existe **pelo menos um documento** anexado.
4. A **data atual está dentro da vigência**: já passou (ou é) a data de início e, se houver data de fim, ainda não a ultrapassou. Se não houver data de fim, basta a data de início já ter chegado.

Atendidas as condições, a parceria passa de **em edição** para **vigente**. Publicar uma parceria que não esteja em edição é recusado.

### Aditivo de valor (novo aporte)

- Só é permitido em parceria **vigente**.
- Cria um novo aporte marcado como aditivo, com **justificativa obrigatória**. Os aportes originais do cadastro continuam sem justificativa.
- Exige **exatamente um documento do tipo termo de descentralização**, com a mesma verificação de existência no armazenamento e de não reaproveitamento.
- O **valor total investido** da parceria é atualizado somando o valor do aditivo.

### Aditivo de vigência (novo prazo)

- Só é permitido em parceria **vigente**.
- Registra um novo período de vigência marcado como aditivo, com **justificativa obrigatória**, e atualiza as datas de início e fim vigentes da parceria.
- Exige um documento do tipo **termo de aditivo de vigência**, também verificado quanto à existência e ao não reaproveitamento.
- Cada mudança de prazo fica guardada como histórico, preservando os períodos anteriores.

### Atualização de parceria em edição

- Só é possível editar uma parceria que ainda esteja **em edição**; parceria já publicada não é editável por este caminho.
- A edição altera os campos principais e os **valores dos aportes existentes**, mas **não cria novos aportes**. Um aporte que for omitido da lista é **removido**, junto com seus documentos.
- O número do processo não pode estar em uso por outra parceria.
- O valor total investido é recalculado a partir dos aportes que permaneceram.

### Suspensão e reativação da parceria

- Só uma parceria **vigente** pode ser **suspensa**; a suspensão exige um **motivo** e registra quem suspendeu, quando e em nome de qual área técnica.
- A reativação só se aplica a uma parceria **suspensa**, devolvendo-a a **vigente** e encerrando o registro de suspensão (marcando data e responsável pela reativação).

### Cascata parceria ↔ programa

Esta é a regra que mantém a coerência entre a fonte do recurso e o que ela financia:

- Quando uma parceria é **suspensa**, todos os **programas vigentes** financiados por ela são suspensos por consequência (passam ao estado **suspenso por parceria**) e ganham seu próprio registro de suspensão vinculado ao da parceria. Programas que estejam em edição ou encerrados **não são afetados**.
- Quando a parceria é **reativada**, os programas que haviam sido suspensos por causa dela **voltam a vigente**. Programas encerrados durante o período de suspensão **não ressuscitam**.
- Toda a operação de suspender (ou reativar) a parceria e propagar aos programas acontece de forma conjunta: ou tudo é aplicado, ou nada é.

### Publicação de programa

Para publicar um programa em edição, o sistema verifica, parando no primeiro problema: instituição demandante e planejamento definidos; período válido (fim depois do início e data atual dentro do intervalo); resumo preenchido; e pelo menos um eixo, um aporte e um membro de comitê. Atendidas as condições, o programa passa de **em edição** para **vigente**.

### Fomentos, faixas e etapas

- Um **fomento** reúne as regras de uma oferta: título, descrição, resultado esperado, tipo de chamamento, período, área técnica, eixos, documentos exigidos, **faixas de valor** e o **formulário** a ser respondido.
- Um fomento tem uma sequência de **etapas** ordenadas.

### Captação e formulários dinâmicos

- Uma **captação** roda sob um fomento, tem um período e caminha por **etapas** (guardando qual é a etapa atual).
- Os **formulários** têm um tipo e uma categoria e passam pelo próprio ciclo: **rascunho → publicado**, podendo ser **inativado** ou ter a publicação **revertida** de volta a rascunho. Um formulário publicado é o que fica disponível para ser respondido.
- Cada **resposta de formulário** liga-se a uma captação, a um formulário e a um projeto. Ela começa como **rascunho**, é **enviada** definitivamente e depois recebe **resultado de avaliação** e **resultado de habilitação**.

## Estados e transições

### Parceria

Ciclo de vida: **em edição → vigente → encerrada**, com o desvio **vigente ⇄ suspensa**.

| De | Ação | Para | Condições principais |
|---|---|---|---|
| (nova) | Cadastrar | Em edição | ao menos 1 aporte > 0; 2 documentos obrigatórios |
| Em edição | Publicar | Vigente | termo assinado, ao menos 1 aporte e 1 documento, data atual dentro da vigência |
| Em edição | Atualizar | Em edição | número de processo não usado por outra; aportes existentes apenas |
| Vigente | Aditivar valor | Vigente | justificativa + termo de descentralização |
| Vigente | Aditivar vigência | Vigente | justificativa + termo de aditivo de vigência |
| Vigente | Suspender | Suspensa | motivo obrigatório; suspende programas vigentes por cascata |
| Suspensa | Reativar | Vigente | reativa programas suspensos por cascata |
| Vigente | Encerrar | Encerrada | justificativa; registra área técnica e responsável |

Publicar, aditivar, suspender, reativar ou encerrar fora do estado esperado é recusado com mensagem de negócio. Publicar é seguro sob concorrência: se dois pedidos chegarem juntos, o segundo falha porque a parceria já não está mais em edição.

### Programa

Ciclo de vida: **em edição → vigente → encerrado**, com os desvios de cascata **vigente → suspenso por parceria → vigente**.

- Nasce **em edição**; publica para **vigente**.
- É **suspenso por parceria** quando a parceria que o financia é suspensa, e volta a **vigente** quando ela é reativada.
- Um programa **encerrado** não é afetado por reativação de parceria.

### Planejamento estratégico e eixos

- Planejamento nasce **em edição** e é **publicado**; o ciclo previsto é **em edição → vigente → encerrado**.
- O eixo é vinculado ao planejamento no ato de criação e acompanha-o.

### Formulário

- **Rascunho → publicado**; do publicado pode ir a **inativado** ou voltar a **rascunho** (reversão de publicação).

### Resposta de formulário

- **Rascunho → enviada**; depois de enviada recebe **resultado de avaliação** e **resultado de habilitação**.

## Casos especiais e exceções

- **Parceria de vigência indefinida**: sem data de fim, a publicação é aceita desde que a data de início já tenha chegado. Se a data de início ainda estiver no futuro, a publicação é recusada.
- **Publicação com várias pendências**: a mensagem devolvida é sempre a do **primeiro** problema na ordem definida (assinatura → aportes → documentos → datas), não uma lista.
- **Edição que remove aporte**: se o documento do aporte removido não puder ser apagado do armazenamento, a operação inteira é abortada e nada é alterado.
- **Documento reaproveitado**: anexar à parceria um arquivo que já pertence a outra parceria é recusado; a verificação ocorre antes de qualquer gravação.
- **Suspensão sem programas vigentes**: a parceria é suspensa normalmente; apenas não há cascata a aplicar.
- **Reativação e programas encerrados**: reativar a parceria nunca traz de volta um programa que foi encerrado durante a suspensão.
- **Número do processo duplicado**: recusado na atualização; no cadastro inicial, a v1 não valida unicidade nem formato do número.
- **Instituição na parceria**: o cadastro inicial trata a instituição informada como referência e não bloqueia por inexistência; já a atualização exige que a instituição exista.
- **Concorrência ao publicar/suspender**: vence o primeiro pedido; o segundo falha por o estado já ter mudado — sem dano.
- **Envio do campo de estado no cadastro**: se o cliente tentar informar o estado da parceria no cadastro, o valor é ignorado — a parceria sempre nasce em edição.

## Dados envolvidos

Cadeia estratégica e de programas:
[[PlanejamentoEstrategico]] · [[EixoEstrategico]] · [[Programa]] · [[AportesFinanceirosPrograma]] · [[ComiteGovernancaPrograma]] · [[SuspensaoPrograma]] · [[SuspensaoParceria]] · [[Instituicao]]

Parcerias e seu histórico:
[[Parceria]] · [[AporteParceriaInstituicao]] · [[VigenciaParceria]] · [[DocumentoParceria]] · [[TipoDocumento]] · [[EncerramentoParceria]]

Fomentos, captações e formulários:
[[Fomento]] · [[EtapaFomento]] · [[FomentoEixoEstrategico]] · [[FomentoAreaTecnica]] · [[FomentoTipoDocumento]] · [[Faixa]] · [[AporteFomento]] · [[Captacao]] · [[EtapaCaptacao]] · [[Formulario]] · [[FormularioTipo]] · [[CategoriaFormulario]] · [[RespostaFormulario]] · [[Projeto]]

Observações de leitura:
- A parceria guarda seu estado, o valor total investido e as datas de assinatura, início e fim. Seus aportes ficam em [[AporteParceriaInstituicao]] (com marca de aditivo e justificativa) e as mudanças de prazo em [[VigenciaParceria]] (também com marca de aditivo e justificativa).
- As suspensões guardam se estão ativas, o motivo, quem suspendeu e quem reativou; [[SuspensaoPrograma]] aponta para a [[SuspensaoParceria]] que a originou, permitindo desfazer a cascata na reativação.
- Os aportes que financiam um programa em [[AportesFinanceirosPrograma]] apontam tanto para o [[Programa]] quanto para a [[Parceria]] de origem — é esse vínculo que sustenta a cascata de suspensão/reativação.

## Funcionalidades relacionadas

- [[autenticacao-autorizacao]] — todo o módulo exige usuário autenticado; suspensão, reativação e encerramento dependem de vínculo com área técnica.
- [[importacao-de-editais]] — os editais vindos do SIGFAPES alimentam fomentos e projetos.
- [[gestao-de-documentos]] — anexos de parceria (termos) e sua verificação de existência.
- [[importacao-curriculo-lattes]] — avaliação de proponentes usa o currículo importado.
- [[painel-e-indicadores]] — consolida valores aportados e situação de parcerias e programas.
- [[notificacoes]] — eventos de mudança de estado de parcerias e programas.
