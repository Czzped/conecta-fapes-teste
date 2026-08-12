---
title: Acompanhamento da Equipe
tipo: requisito
---

# Acompanhamento da Equipe

O coordenador precisa de uma visão do seu projeto e das pessoas alocadas nele. Este requisito descreve as áreas de **consulta e acompanhamento** disponíveis para o coordenador: a visão consolidada do projeto (situação geral, resumo financeiro e orçamento), a lista da equipe (bolsistas e voluntários, com busca, filtros e paginação), o acompanhamento dos pagamentos da equipe e a consulta aos documentos de cada bolsa. Aqui o foco é **consultar e acompanhar** — o cadastro de bolsas é tratado em [[solicitacao-de-bolsa]] e a inclusão de voluntários em [[voluntariacao]].

## Atores

- **Coordenador de projeto** — usuário que consulta seus projetos, a equipe alocada, os pagamentos e os documentos. Só enxerga os projetos dos quais é coordenador.
- **Sistema** — verifica se o usuário é coordenador do projeto consultado, reúne bolsistas e voluntários em uma visão única, aplica busca, filtros e paginação, e apresenta indicadores e resumos.

## Fluxo principal

1. Quando o coordenador tem mais de um projeto, ele **seleciona o projeto ativo**. Essa escolha determina o que aparece na página inicial, no meu projeto, na minha equipe e nos pagamentos.
2. Em **Meu projeto**, o coordenador consulta a situação geral do projeto, o resumo financeiro e o orçamento por itens ou categorias, incluindo valores utilizados e disponíveis.
3. Em **Minha equipe**, na **visão de bolsas**, consulta orçamento total, utilizado e disponível, indicadores de bolsas ativas, planejadas, utilizadas e disponíveis, uso por modalidade e a tendência mensal da equipe por ano.
4. Ainda em **Minha equipe**, na **lista da equipe**, consulta bolsistas e voluntários do projeto, com busca por nome, filtros e navegação por páginas.
5. Ao abrir uma bolsa, consulta seus **detalhes** (dados do bolsista, modalidade, valor mensal, situação, orientador, período, plano de trabalho, objetivos e metas) e os **documentos vinculados**.
6. Em **Pagamentos**, acompanha o histórico de pagamentos da equipe, com filtros por projeto, data, modalidade e situação.

## Regras de negócio

### Acesso e contexto

- Somente o **coordenador do projeto** pode consultar as bolsas e a equipe daquele projeto.
- O **projeto ativo** define o conteúdo exibido nas áreas dependentes de projeto (página inicial, meu projeto, minha equipe, pagamentos, prestação financeira e remanejamento).
- Bolsas e voluntários de **outros projetos** nunca aparecem no resultado do projeto consultado.

### Lista da equipe (bolsistas e voluntários juntos)

- A lista da equipe reúne, em um **único resultado**, os **bolsistas** e os **voluntários** do mesmo projeto.
- Cada **voluntário** aparece com a modalidade "VOLUNTÁRIO"; os campos exclusivos de bolsa (valor, cotas alocadas, cotas pagas e redução) ficam **vazios** para voluntários.
- A ordenação segue uma **regra única de prioridade por situação**, encaixando as situações próprias de voluntário nas faixas equivalentes às das bolsas, independentemente da origem do registro.
- Em caso de empate na prioridade, o desempate segue a **data da última mudança de situação** (mais recente primeiro) e, depois, a data de atualização.
- A **paginação** é aplicada sobre o conjunto combinado, e a contagem total corresponde à soma das duas origens já filtradas.
- Os filtros de **data de início** e de **nome** são aplicados igualmente a bolsistas e voluntários.
- É possível **buscar por nome** do bolsista e **filtrar por data de início, por modalidade e por situação**, além de navegar entre páginas.
- O filtro por **modalidade de bolsa** usa a modalidade/nível da bolsa e, por isso, **não alcança voluntários**: quando esse filtro está ativo, voluntários ficam de fora do resultado.
- Existe um filtro **"somente voluntários"** que traz apenas voluntários e desconsidera bolsistas, tanto na página quanto na contagem.
- As situações informadas nos filtros são **reinterpretadas para cada origem**: uma situação que só existe em bolsa filtra apenas bolsas; uma que só existe em voluntário filtra apenas voluntários; a outra origem é excluída do resultado, sem quebrar a consulta.

### Validação dos filtros de situação

- Com o filtro **somente voluntários** ativo, o sistema aceita **apenas situações válidas de voluntário**; situações que só existem em bolsa são recusadas com aviso claro.
- Não é permitido combinar o filtro **somente voluntários** com o filtro por **modalidade de bolsa**; a combinação é recusada por conflito.
- No modo combinado, situações que **não existem em nenhuma das origens** são recusadas com aviso indicando a situação inválida.
- Quando **nenhuma situação** é informada, a consulta traz as duas origens (ou apenas voluntários, se o filtro somente voluntários estiver ativo), sem filtrar por situação.
- As mensagens de recusa são **claras e em português**, indicando a situação ou o filtro que causou o problema.

### Paginação e limites

- O tamanho máximo de página é **100** registros; pedir mais do que isso é recusado com aviso.
- A página precisa ser **válida** (a partir de 1); página inválida (por exemplo, 0) é recusada com aviso.

## Estados e transições

Este requisito é de **consulta**; ele não altera a situação de bolsas ou voluntários. As situações exibidas na lista e nos indicadores refletem o andamento tratado em [[solicitacao-de-bolsa]], [[implementacao-de-bolsa]], [[voluntariacao]] e [[pagamentos]]. A ordenação da lista organiza os registros por prioridade de situação, unificando bolsistas e voluntários em uma mesma escala.

## Casos especiais e exceções

- **Projeto com bolsistas e voluntários, sem filtros**: o resultado inclui as duas origens e a contagem soma ambas.
- **Filtro somente voluntários ativo**: apenas voluntários retornam; nenhum bolsista aparece.
- **Filtro por modalidade de bolsa ativo**: nenhum voluntário aparece.
- **Situação enviada existe só em uma origem**: filtra apenas aquela origem e exclui a outra, sem erro.
- **Somente voluntários + situação exclusiva de bolsa**: recusado, informando que a situação não vale para voluntário.
- **Somente voluntários + filtro por modalidade**: recusado por combinar filtros conflitantes.
- **Situação inexistente em qualquer origem (modo combinado)**: recusado, informando a situação inválida.
- **Página maior que 100**: recusado com aviso "Page size não pode ser maior que 100".
- **Página inválida (0)**: recusado com aviso "A página é inválida!".
- **Usuário que não é coordenador do projeto**: recusado com aviso "Você não é coordenador desse projeto".
- **Projeto inexistente**: recusado com aviso "Não existe projeto com esse Id".
- **Dados de acesso do usuário ausentes**: recusado com aviso de que as informações de acesso vieram vazias.

## Dados envolvidos

[[Projeto]] · [[AlocacaoBolsista]] · [[Voluntariacao]] · [[Pessoa]] · [[PagamentoBolsista]] · [[Documento]] · [[Orcamento]] · [[ModalidadeBolsa]] · [[VersaoNivel]]

## Funcionalidades relacionadas

- [[solicitacao-de-bolsa]] — o cadastro e o envio de bolsas pela equipe; aqui elas apenas são consultadas.
- [[voluntariacao]] — a inclusão e o vínculo de voluntários ao projeto; aqui eles aparecem na lista da equipe.
- [[implementacao-de-bolsa]] — o andamento das bolsas cujas situações e documentos são acompanhados nesta área.
- [[pagamentos]] — o detalhe dos pagamentos da equipe consultados no acompanhamento.
- [[remanejamento-de-cotas]] — o ajuste de cotas do projeto, área dependente do projeto ativo.
- [[prestacao-de-contas]] — a prestação financeira do projeto, também dependente do projeto ativo.
- [[painel-e-indicadores]] — os indicadores e resumos que apoiam a visão consolidada do projeto.
