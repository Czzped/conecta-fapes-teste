# Funcionalidade de Diaria

Dominio e regras gerais de prestacao de contas: ver [README.md](README.md).

## Objetivo

A funcionalidade de Diaria organiza duas jornadas complementares do frontoffice:

- **Solicitacoes > Diaria**: permite ao Coordenador solicitar diaria para bolsistas ou para si proprio, acompanhar o aceite do bolsista, consultar detalhes da diaria e registrar o relatorio da atividade apos a viagem.
- **Prestacao de Contas Financeira > Diaria**: permite ao Coordenador associar uma diaria ja cadastrada a uma prestacao de contas financeira, anexar comprovantes e evidenciar que a despesa declarada corresponde a uma viagem realizada no projeto.

No dominio do M014, a diaria aparece como `JustificativaDiaria`, um tipo de `JustificativaDespesa` usado para comprovar a aplicacao de recursos com deslocamento. A solicitacao operacional da diaria e o aceite do bolsista ficam fora do agregado principal de `Prestacao`, mas o M014 referencia essa informacao para impedir prestacoes sem lastro e para evitar que uma mesma diaria seja usada indevidamente em mais de uma comprovacao.

## Atores

| Ator | Responsabilidades na funcionalidade |
|------|-------------------------------------|
| Coordenador | Solicita diarias, acompanha status, exclui solicitacoes ainda pendentes de aceite, registra relatorio quando aplicavel e associa diarias a prestacao de contas financeira. |
| Bolsista | Visualiza diarias destinadas a ele, aceita ou recusa a diaria quando ha pendencia, e pode enviar o relatorio da atividade quando a diaria ja estiver disponivel para comprovacao. |
| Responsavel FAPES | Analisa a prestacao de contas financeira submetida, incluindo a justificativa de diaria e seus comprovantes. |

## Solicitacoes > Diaria

### Visao geral

A area **Solicitacoes > Diaria** concentra o ciclo operacional da diaria antes de sua entrada formal na prestacao de contas. O usuario consegue criar uma solicitacao, consultar diarias solicitadas, consultar suas proprias diarias e acessar a tela **Detalhes da Diaria**.

Para Coordenador, a tela apresenta:

- indicadores financeiros da rubrica de diaria no projeto;
- abas de **Diarias Solicitadas** e **Minhas Diarias**;
- listagem de diarias com bolsista, valor total, periodo, destino, status e indicacao de relatorio enviado;
- acao para criar nova diaria;
- detalhes completos da diaria selecionada.

Para Bolsista, a tela apresenta:

- diarias vinculadas ao usuario;
- status de aceite;
- possibilidade de aceitar ou recusar quando a diaria esta aguardando resposta;
- acesso ao relatorio da diaria quando a atividade ja pode ser comprovada.

### Criar Diaria

Ao criar uma diaria, o Coordenador informa os dados necessarios para calcular e registrar a solicitacao:

- tipo de viagem;
- origem;
- data e horario de partida;
- destino;
- data e horario de chegada;
- equipe/bolsistas beneficiarios;
- motivo da diaria;
- distancia minima quando aplicavel;
- consumo previsto da rubrica de diaria;
- saldo projetado apos a solicitacao.

O sistema calcula a quantidade de diarias e o valor total conforme o periodo informado, o tipo de viagem e a regra de diaria vigente. O resumo financeiro mostra o impacto da solicitacao no saldo disponivel do projeto.

Quando a diaria e criada para um bolsista diferente do Coordenador, ela fica pendente de aceite. Quando a diaria e criada para o proprio Coordenador, ela pode entrar diretamente como aprovada, conforme a regra operacional do prototipo.

### Listas de Diarias

Nas listas de **Diarias Solicitadas** e **Minhas Diarias**, a coluna **Periodo** mostra o intervalo entre a data de partida e a data de chegada. Essa coluna substitui a apresentacao isolada de **Data de Partida**, pois a prestacao e a comprovacao dependem do afastamento completo, nao apenas do inicio da viagem.

Cada item de diaria apresenta:

- bolsista/beneficiario;
- valor total;
- periodo;
- destino;
- status;
- se o relatorio da diaria foi enviado.

A indicacao **Relatorio Enviado** considera se a diaria ja passou da data de partida e se ha comprovacao de atividade registrada. Antes da data de partida, o relatorio ainda nao e esperado.

### Detalhes da Diaria

Na tela **Detalhes da Diaria**, o usuario consulta todas as informacoes da solicitacao:

- bolsista;
- tipo de viagem;
- quantidade de diarias;
- valor;
- origem;
- destino;
- partida;
- chegada;
- status;
- motivo;
- relatorio da diaria.

Depois que a diaria e criada, seus dados principais ficam somente para leitura. O usuario nao edita origem, destino, periodo, equipe ou motivo nessa tela. A regra operacional do frontoffice e que uma diaria criada nao deve ser alterada; quando for necessario desfazer a solicitacao, o fluxo esperado e excluir/cancelar a diaria quando isso ainda for permitido.

### Botao Excluir

Em **Coordenador > Solicitacoes > Diaria > Detalhes da Diaria**, o botao **Excluir** fica disponivel apenas quando a diaria esta com status **Aguardando Bolsista**. Esse status representa a diaria `ALOCADA`, ou seja, uma solicitacao criada pelo Coordenador que ainda depende do aceite do bolsista.

O botao nao aparece para diarias:

- aprovadas;
- recusadas;
- canceladas;
- ja iniciadas ou fora da etapa de aceite pendente;
- acessadas fora do contexto de Coordenador.

Ao acionar **Excluir**, o Coordenador deve informar o motivo do cancelamento/exclusao quando o fluxo solicitar justificativa. A confirmacao remove a diaria do fluxo ativo e evita que ela seja usada posteriormente na prestacao financeira.

### Relatorio da Diaria

A secao **Relatorio da Diaria** registra a comprovacao da atividade realizada no periodo da diaria. O campo textual orienta o usuario a descrever a atividade executada:

- rotulo: **Descreva a atividade realizada**;
- placeholder: **Contextualize o que foi executado**.

O usuario tambem pode anexar arquivos de suporte. A edicao do relatorio fica disponivel depois da data da diaria, pois antes da realizacao da viagem ainda nao ha atividade a comprovar.

O relatorio e importante para a prestacao financeira porque demonstra que a despesa com diaria corresponde a uma atividade efetivamente realizada no projeto.

## Prestacao de Contas Financeira > Diaria

### Visao geral

Em **Prestacao de Contas Financeira > Detalhes do Pagamento**, quando o usuario seleciona o tipo de documento **Diaria**, o fluxo muda para associar uma diaria ja cadastrada em vez de preencher uma descricao livre comum a outros documentos.

O objetivo e vincular a prestacao financeira a uma diaria existente, mantendo rastreabilidade entre:

- solicitacao operacional da diaria;
- bolsista beneficiario;
- periodo da viagem;
- destino;
- valor total;
- relatorio enviado;
- comprovantes anexados na prestacao.

### Selecionar Diaria

Ao selecionar **Diaria** como documento, o sistema lista as diarias elegiveis para prestacao de contas. A lista apresenta:

- bolsista;
- valor total;
- periodo;
- destino;
- relatorio enviado.

A coluna **Periodo** mostra partida e chegada na mesma linha, sem quebra, para preservar a leitura do intervalo completo. A coluna **Destino** e a coluna **Relatorio Enviado** possuem espacamento visual proprio para facilitar a leitura sem alterar o significado dos campos.

O Coordenador seleciona uma diaria da lista para continuar a prestacao. A diaria selecionada passa a ser o lastro da justificativa financeira.

### Relatorio pendente

Quando o Coordenador seleciona uma diaria que ainda nao possui relatorio enviado, o sistema exibe um aviso informando que, em **Detalhes da Diaria**, o bolsista ou o Coordenador devem enviar o relatorio da atividade.

Esse aviso nao substitui a prestacao financeira; ele orienta o usuario de que a diaria ainda precisa da comprovacao operacional da atividade para ficar completa.

### Anexar comprovantes

Depois de selecionar a diaria, o usuario anexa o comprovante da diaria. O fluxo de anexos aceita multiplos arquivos quando aplicavel. Esses arquivos compoem a justificativa de diaria na prestacao de contas e ficam associados ao documento financeiro submetido.

### Criar Diaria a partir da Prestacao

Quando o Coordenador esta em **Prestacao de Contas Financeira > Diaria** e ainda nao possui a diaria necessaria cadastrada, a interface oferece um caminho para criar a solicitacao de diaria. Esse caminho usa as mesmas informacoes essenciais da diaria:

- beneficiarios;
- tipo de viagem;
- origem;
- destino;
- periodo;
- motivo;
- quantidade calculada;
- valor total.

Apos criada, a diaria passa a poder ser associada ao fluxo de prestacao, respeitando os mesmos controles de status e relatorio.

## Regras funcionais consolidadas

| ID | Regra |
|----|-------|
| FD01 | Diaria criada nao deve ser editada nos detalhes; seus campos principais ficam em modo somente leitura. |
| FD02 | Diaria aguardando bolsista pode ser excluida/cancelada pelo Coordenador nos detalhes da diaria. |
| FD03 | O botao **Excluir** so aparece em **Coordenador > Solicitacoes > Diaria > Detalhes da Diaria** quando o status e **Aguardando Bolsista**. |
| FD04 | A listagem de diarias deve exibir **Periodo** em vez de apenas **Data de Partida**. |
| FD05 | O relatorio da diaria deve solicitar que o usuario descreva a atividade realizada e contextualize o que foi executado. |
| FD06 | A prestacao financeira de diaria deve referenciar uma diaria cadastrada, mantendo vinculo com bolsista, periodo, destino, valor e status do relatorio. |
| FD07 | Diarias ja prestadas contas devem ser contabilizadas como tendo relatorio enviado e nao devem ser reutilizadas indevidamente em outra prestacao. |
| FD08 | Quando o relatorio ainda nao foi enviado, o sistema deve orientar o usuario a completar o relatorio nos detalhes da diaria. |

## Relacao com o modelo do M014

No modelo estrutural, a comprovacao financeira da diaria e representada por `JustificativaDiaria`, especializacao de `JustificativaDespesa`. Ela carrega o valor da diaria, a quantidade e a referencia ao beneficiario/alocacao de bolsista.

A solicitacao operacional da diaria nao substitui a `Prestacao`; ela fornece o contexto de negocio para criar a justificativa financeira. A `Prestacao` continua sendo o agregado responsavel por reunir justificativas e transacoes financeiras, submeter para analise e bloquear edicoes quando estiver em `EM_ANALISE`.

Essa separacao evita misturar duas responsabilidades:

- **Solicitacoes > Diaria** controla pedido, aceite, cancelamento e relatorio da atividade.
- **Prestacao de Contas Financeira > Diaria** controla comprovacao financeira, anexos, conciliacao e submissao para analise.

## Estados observados na jornada de diaria

| Status exibido | Significado funcional | Acoes principais |
|----------------|-----------------------|------------------|
| Rascunho | Solicitacao ainda nao concluida. | Completar dados ou descartar antes da criacao definitiva. |
| Aguardando Bolsista | Diaria criada e aguardando aceite do bolsista. | Bolsista aceita/recusa; Coordenador pode excluir nos detalhes. |
| Aprovada | Diaria aceita ou aprovada para execucao. | Aguardar realizacao, enviar relatorio e associar a prestacao. |
| Recusada | Bolsista recusou a diaria. | Consultar justificativa de recusa; nao usar na prestacao. |
| Cancelada | Diaria foi excluida/cancelada antes de seguir. | Consultar historico/motivo; nao usar na prestacao. |

## Resultado esperado para o usuario

Com a funcionalidade completa, o Coordenador consegue:

- solicitar diarias para a equipe;
- acompanhar aceite dos bolsistas;
- consultar diarias solicitadas e proprias;
- excluir somente diarias que ainda aguardam bolsista;
- consultar detalhes sem alterar dados ja criados;
- registrar ou acompanhar o relatorio da atividade;
- selecionar a diaria correta na prestacao de contas financeira;
- anexar comprovantes da diaria;
- submeter a prestacao com rastreabilidade entre solicitacao, relatorio e comprovante financeiro.

O Bolsista consegue:

- visualizar diarias destinadas a ele;
- aceitar ou recusar diaria pendente;
- consultar detalhes da diaria;
- enviar relatorio da atividade quando a diaria estiver disponivel para comprovacao.

O Responsavel FAPES consegue, na analise da prestacao:

- verificar que a diaria prestada contas possui lastro operacional;
- conferir beneficiario, periodo, destino e valor;
- verificar se ha relatorio da atividade;
- analisar comprovantes anexados;
- aprovar, negar ou solicitar revisao da prestacao conforme as regras do M014.
