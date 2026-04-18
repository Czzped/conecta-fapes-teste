# Domain 03 — Fomento Pre-Award (Captacao e Selecao)

Fluxo desde a publicacao do edital ate a contratacao da iniciativa. Glossario dos conceitos centrais em [../glossario.md](../glossario.md).

**Modulos que implementam este domain:** M011, M002

---

## 3.1 Configuracao da Captacao

Preparacao e configuracao dos instrumentos necessarios para a captacao de iniciativas. Uma captacao e formalizada por meio de um documento chamado **Edital** e pode estar associada a um **Programa** ou a uma **Parceria**. Ha dois tipos de captacao: **Chamada Publica** (edital aberto a qualquer proponente elegivel) e **Demanda Induzida** (solicitacao direcionada a instituicoes ou pesquisadores especificos). A configuracao inclui definicao de periodo, cronograma, formularios, valor aportado e cadastro de revisores.

**Ciclo de vida da Captacao:**

A captacao percorre os seguintes estados em sequencia: **(1) Em Elaboracao** — captacao criada e sendo configurada internamente; **(2) Aberta** — edital publicado e periodo de submissao de propostas em andamento; **(3) Em Analise** — submissao encerrada e propostas em avaliacao documental e de merito; **(4) Publicada** — resultado final homologado e divulgado; **(5) Em Execucao** — iniciativas aprovadas contratadas e em andamento; **(6) Fechada** — captacao encerrada apos conclusao de todas as iniciativas.

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 3.1.1 | Criar Captacao | Configurar uma nova captacao (Chamada Publica ou Demanda Induzida) definindo tipo, periodo de inscricao, cronograma de etapas e valor aportado | Analista da Area Tecnica da Agencia | Art. 15, I; Art. 14, VII |
| 3.1.2 | Elaborar Edital | Formalizar as regras da captacao em um documento publico contendo publico alvo, cronograma, requisitos e condicoes | Analista da Area Tecnica da Agencia | Art. 15, I |
| 3.1.3 | Definir Tipo de Captacao | Classificar a captacao como Chamada Publica (aberta) ou Demanda Induzida (direcionada) | Analista da Area Tecnica da Agencia | Art. 15, I |
| 3.1.4 | Definir Cronograma da Captacao | Estabelecer datas de abertura, encerramento de inscricoes, avaliacao, resultado intermediario e resultado final | Analista da Area Tecnica da Agencia | Art. 15, I |
| 3.1.5 | Associar Captacao a Programa ou Parceria | Vincular a captacao a um programa de fomento ou a uma parceria e seu respectivo orcamento | Analista da Area Tecnica da Agencia | Art. 14, VII; Art. 25; Art. 3, X |
| 3.1.6 | Definir Valor Aportado da Captacao | Informar o valor total disponivel para a captacao a partir dos recursos do programa ou da parceria | Analista da Area Tecnica da Agencia | Art. 25, III; Art. 28, II |
| 3.1.7 | Cadastro de Categorias de Formulario | Criar e manter categorias para classificar formularios (ex: submissao, avaliacao, habilitacao, prestacao de contas) | Analista da Area Tecnica da Agencia | Art. 4, 1; Art. 15, I |
| 3.1.8 | Buscar Formulario no Dynamic Forms | Consultar e importar formularios do sistema externo Dynamic Forms, categorizando-os conforme a finalidade | Analista da Area Tecnica da Agencia | Art. 4, 1; Art. 3, 1 |
| 3.1.9 | Associar Formulario de Submissao a Captacao | Vincular um formulario de submissao (importado do Dynamic Forms) a captacao para recebimento de propostas | Analista da Area Tecnica da Agencia | Art. 4, 1; Art. 3, 1 |
| 3.1.10 | Associar Formulario de Avaliacao a Captacao | Vincular um formulario de avaliacao de merito (importado do Dynamic Forms) a captacao para uso pelos revisores | Analista da Area Tecnica da Agencia | Art. 4, 2; Art. 15, III |
| 3.1.11 | Gestao de Revisores Ad Hoc | Cadastrar e selecionar especialistas para avaliacao de merito | Analista da Area Tecnica da Agencia | Art. 4, 2; Art. 6, par. unico |
| 3.1.12 | Configurar/Parametrizar Captacao | Definir regras, prazos e etapas da captacao; permite sobrescrever o minimo de avaliadores ad hoc definido nos cadastros basicos (1.3.8) com um valor especifico para esta captacao | Analista da Area Tecnica da Agencia | Art. 15, I; Art. 3, 3 |
| 3.1.13 | Dashboard da Captacao | Painel para acompanhar etapas de habilitacao, merito e resultados | Analista da Area Tecnica da Agencia | Art. 4, 1 e 2; Art. 14, IX |

## 3.2 Fases da Captacao de Iniciativas

Uma iniciativa e qualquer proposta de trabalho apoiada pela agencia: projeto de pesquisa, visita tecnica, publicacao de livro, participacao em evento cientifico, organizacao de evento cientifico, entre outros tipos. Uma captacao possui as seguintes fases executadas em sequencia: **Submissao → Analise Documental → Analise de Merito → Contratacao → Deposito do Aporte**. Aplica-se tanto a Chamadas Publicas quanto a Demandas Induzidas.

### Fase 1: Periodo de Submissao

Periodo em que a captacao esta aberta para recepcao de propostas de iniciativas.

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 3.2.1 | Publicar Captacao | Publicar a captacao (edital ou demanda induzida) no sitio eletronico, abrindo o periodo de submissao | Analista da Area Tecnica da Agencia | Art. 15, I; Art. 3, 3 |
| 3.2.2 | Submeter Proposta de Iniciativa | Enviar proposta de iniciativa para avaliacao pela agencia dentro do periodo de submissao | Cidadao | Art. 4 |
| 3.2.3 | Prorrogar Periodo de Submissao | Estender o prazo de recepcao de propostas, publicando a nova data no sitio eletronico | Analista da Area Tecnica da Agencia | Art. 15, I; Art. 3, 3 |
| 3.2.4 | Encerrar Periodo de Submissao | Fechar o recebimento de propostas conforme cronograma vigente | Analista da Area Tecnica da Agencia | Art. 15, I |

### Fase 2: Analise Documental

Verificacao da documentacao de habilitacao do coordenador e da proposta submetida.

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 3.2.5 | Analisar Documentacao do Coordenador | Verificar habilitacao, documentacao e elegibilidade do coordenador proponente, consultando API de nada consta e API de empregabilidade | Analista da Area Tecnica da Agencia | Art. 4, 1 |
| 3.2.6 | Aprovar ou Reprovar Habilitacao | Registrar decisao sobre a habilitacao documental da proposta | Analista da Area Tecnica da Agencia | Art. 4, 1; Art. 6, par. unico |
| 3.2.7 | Publicar Resultado da Analise Documental | Divulgar lista de propostas habilitadas e inabilitadas | Analista da Area Tecnica da Agencia | Art. 3, 3 |
| 3.2.8 | Receber/Responder Recurso da Analise Documental | Processar recursos administrativos dos proponentes inabilitados | Analista da Area Tecnica da Agencia | Art. 14, IX; Art. 6, par. unico |

### Fase 3: Analise de Merito

Avaliacao tecnico-cientifica das propostas habilitadas por consultores ad hoc e camaras de assessoramento.

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 3.2.9 | Encaminhar Propostas para Avaliacao de Merito | Distribuir propostas habilitadas para consultores ad hoc; o avaliador recebe notificacao por e-mail com a lista de propostas e link de acesso ao sistema, onde realiza a avaliacao diretamente | Analista da Area Tecnica da Agencia | Art. 4, 2; Art. 12 |
| 3.2.10 | Avaliar Merito da Proposta | Consultor ad hoc avalia a proposta e emite parecer tecnico-cientifico | Consultor Ad Hoc | Art. 4, 2; Art. 12 |
| 3.2.11 | Receber Parecer dos Consultores Ad Hoc | Registrar pareceres dos avaliadores externos | Analista da Area Tecnica da Agencia | Art. 4, 2 e 3; Art. 15, II |
| 3.2.12 | Substituir Avaliador Ad Hoc | Caso o avaliador nao responda a solicitacao dentro do prazo, o servidor agencia de fomento designa outro consultor, que recebe nova notificacao por e-mail com link de acesso ao sistema | Analista da Area Tecnica da Agencia | Art. 4, 2; Art. 12 |
| 3.2.13 | Pagar Avaliador Ad Hoc | Registrar e processar o pagamento do avaliador ad hoc somente se a avaliacao tiver sido concluida, integrado ao sistema de pagamento da agencia | Analista da Area Tecnica da Agencia | Art. 16; Art. 25, III |
| 3.2.14 | Publicar Resultado Intermediario | Divulgar classificacao parcial das propostas avaliadas | Analista da Area Tecnica da Agencia | Art. 3, 3 |
| 3.2.15 | Receber/Responder Recurso da Analise de Merito | Processar recursos administrativos sobre a avaliacao de merito | Analista da Area Tecnica da Agencia | Art. 14, IX; Art. 6, par. unico |
| 3.2.16 | Publicar Resultado Final | Divulgar resultado definitivo homologado da captacao | Analista da Area Tecnica da Agencia | Art. 14, IX; Art. 3, 3 |
| 3.2.17 | Receber/Responder Recurso do Resultado Final | Processar recursos administrativos interpostos contra o resultado final homologado e publicar a resposta oficial | Analista da Area Tecnica da Agencia | Art. 14, IX; Art. 6, par. unico |

### Fase 4: Contratacao

Formalizacao das iniciativas aprovadas: emissao e assinatura do termo de outorga e abertura de conta bancaria.

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 3.2.18 | Gerar Termo de Outorga | Emitir o instrumento formal de fomento para a iniciativa aprovada | Analista da Area Tecnica da Agencia | Art. 28, I |
| 3.2.19 | Assinar Termo de Outorga | Coordenador assina o termo formalizando o compromisso | Coordenador | Art. 28, I; Art. 3, X |
| 3.2.20 | Mudar Status para Contratada | Alterar o status da iniciativa para contratada apos assinatura | Analista da Area Tecnica da Agencia | — |
| 3.2.21 | Abrir Conta da Iniciativa no Banco | Coordenador providencia a abertura de conta bancaria da iniciativa contratada | Coordenador | — |

### Fase 5: Deposito do Aporte Financeiro

Transferencia dos recursos financeiros para a conta da iniciativa, quando aplicavel. Esta fase so ocorre se a captacao possuir aporte financeiro definido.

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 3.2.22 | Depositar Aporte Financeiro | Efetuar a transferencia dos recursos da agencia para a conta da iniciativa contratada | Analista da Area Tecnica da Agencia | Art. 28, II; Art. 25, III |
| 3.2.23 | Confirmar Recebimento do Aporte | Coordenador confirma o recebimento dos recursos na conta da iniciativa | Coordenador | Art. 27, II |
