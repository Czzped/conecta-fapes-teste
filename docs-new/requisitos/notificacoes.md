---
title: Notificações
tipo: requisito
---

# Notificações

O ConectaFapes avisa as pessoas envolvidas quando acontecem fatos importantes no fluxo das bolsas. Os avisos chegam de duas formas: **em tela**, dentro do próprio portal, e **por e-mail**. Este requisito descreve quais eventos geram notificação, quem recebe cada aviso, como o texto de cada mensagem é montado e as garantias de comportamento — em especial a de que uma falha ao notificar nunca desfaz a ação de negócio que originou o aviso.

## Atores

- **Bolsista** — recebe avisos sobre a própria bolsa e sobre documentos da sua solicitação (em tela e por e-mail).
- **Coordenador do projeto** — recebe avisos sobre as bolsas dos bolsistas sob sua coordenação (em tela e, nos eventos previstos, também por e-mail). O destinatário é sempre o **coordenador atual** do projeto.
- **Equipe da área técnica (FAPES)** — pratica as ações que disparam os eventos (implementar, recusar, pedir revisão de documento).
- **Sistema** — monta e envia as notificações, aplicando as regras de destinatário, ambiente e melhor esforço.

## Fluxo principal

1. A equipe da área técnica executa uma ação de negócio (implementa uma bolsa, recusa uma solicitação ou pede revisão de um documento).
2. A ação de negócio é concluída e registrada primeiro.
3. **Somente após a ação estar efetivada**, o sistema monta as notificações correspondentes.
4. Para cada destinatário e cada canal (tela e/ou e-mail), o sistema resolve quem deve receber e prepara o texto a partir de um modelo padronizado.
5. O sistema encaminha as notificações para entrega. Avisos em tela ficam disponíveis no portal do destinatário; e-mails são enviados ao endereço do destinatário.
6. Se algo falhar no envio, a falha é apenas registrada — a ação de negócio já concluída permanece intacta.

## Regras de negócio

### Eventos que geram notificação

- **Bolsa implementada (ativada)**: quando a área técnica ativa a bolsa de um bolsista em um projeto.
  - O **bolsista** é avisado em tela e por e-mail (assunto "ConectaFapes - Bolsa Implementada").
  - O **coordenador atual** do projeto é avisado em tela e por e-mail. O e-mail do coordenador cita o nome do bolsista e menciona que a bolsa é "sob sua coordenação".
  - O e-mail inclui um bloco "Detalhes da bolsa" com a **vigência** (no formato dia/mês/ano a dia/mês/ano) e o **valor mensal** (em reais, no padrão brasileiro).
- **Bolsa recusada (reprovada)**: quando a área técnica reprova a solicitação de bolsa.
  - O **bolsista** é avisado em tela e por e-mail (assunto "ConectaFapes - Bolsa Recusada").
  - O **coordenador atual** é avisado em tela e por e-mail, citando o nome do bolsista.
  - O e-mail traz a "Justificativa da recusa" com o motivo informado na reprovação.
- **Pedido de revisão de documento**: quando a área técnica pede revisão de um documento enviado na solicitação de bolsa.
  - O **bolsista** é avisado em tela e por e-mail (assunto "ConectaFapes - Documento Rejeitado"), com o "Motivo da rejeição" e a orientação de corrigir e reenviar o documento pelo sistema.
  - O **coordenador atual** passa a ser avisado por e-mail (com o mesmo motivo e a informação de que o bolsista foi orientado a corrigir e reenviar).

### Conteúdo dos e-mails

- Todos os e-mails seguem modelos padronizados, em pares bolsista/coordenador, com saudação "Olá,", um parágrafo de "Caso tenha dúvidas..." e um rodapé padrão (aviso de que o e-mail não deve ser respondido e assinatura "Atenciosamente, / Equipe de Gestão de Bolsas").
- **Datas** sempre no formato dia/mês/ano; **valores monetários** sempre com prefixo "R$" no padrão brasileiro.
- No e-mail de bolsa implementada, o bloco "Detalhes da bolsa" é montado apenas com o que existir: se faltarem tanto a vigência quanto o valor mensal, o bloco é omitido por inteiro.

### Destinatários

- O destinatário coordenador é sempre o **coordenador atual** do projeto. Se não houver coordenador atual resolvível (projeto sem coordenador atual, coordenador sem pessoa vinculada ou pessoa sem usuário), o aviso ao coordenador é simplesmente pulado, sem afetar os demais.
- Os avisos ao bolsista e ao coordenador são **independentes**: se não for possível resolver um dos destinatários, o outro ainda recebe normalmente.

### Garantia de melhor esforço (a notificação nunca desfaz a ação)

- O envio de notificação é de **melhor esforço**: qualquer falha ao entregar um aviso é registrada e **nunca** é propagada.
- A ação de negócio que disparou o evento (implementar, recusar, pedir revisão) **jamais é revertida** por causa de uma falha de notificação. As notificações só são disparadas depois que a ação está efetivada.

### Redirecionamento fora de produção

- Fora do ambiente de produção, os e-mails **não são enviados aos endereços reais**: o destinatário é substituído por uma **caixa de teste**. Essa proteção evita que e-mails de teste cheguem a bolsistas e coordenadores reais.
- Os avisos em tela não dependem de endereço de e-mail e não são afetados por essa substituição.

## Estados e transições

- Cada notificação tem um ciclo simples: **montada → encaminhada para entrega → entregue** (ou **falha registrada**, sem reversão da ação de negócio).
- O comportamento dos avisos já existentes (títulos, textos, canais e destinatários) é preservado; a evolução recente apenas acrescentou o e-mail ao coordenador nos três eventos e corrigiu a exibição de caracteres acentuados nos textos.

## Casos especiais e exceções

- **Projeto sem coordenador atual** (ou coordenador sem pessoa/usuário): o e-mail ao coordenador é pulado silenciosamente (com registro), e as demais notificações seguem normalmente.
- **Destinatário sem e-mail** (endereço em branco): as mensagens por e-mail para ele não são enviadas (apenas registradas); as mensagens em tela não são afetadas, pois dependem só da identificação do usuário.
- **Vigência ou valor mensal indisponíveis** na implementação: o bloco "Detalhes da bolsa" é montado só com o dado que existir, ou omitido quando não há nenhum dos dois.
- **Falha ou indisponibilidade do meio de entrega**: o erro é registrado e não propaga; a transação de negócio nunca é revertida.
- **Textos com acentuação**: as mensagens preservam os caracteres acentuados corretamente.
- **Ambiente fora de produção**: nenhum e-mail é enviado a endereço real de destinatário — tudo vai para a caixa de teste.

## Dados envolvidos

[[AlocacaoBolsista]] · [[Projeto]] · [[Coordenacao]] · [[Pessoa]] · [[User]] · [[DocumentoMetadado]] · [[VersaoNivel]] · [[VersaoModalidade]] · [[OutboxEvent]] · [[Aplicacao]]

## Funcionalidades relacionadas

- [[implementacao-de-bolsa]] — dispara os avisos de bolsa implementada e de bolsa recusada.
- [[gestao-de-documentos]] — origem do pedido de revisão de documento que gera notificação.
- [[solicitacao-de-bolsa]] — contexto em que os documentos são enviados e a bolsa é solicitada.
- [[painel-e-indicadores]] — reflete, em contagens, os mesmos eventos que geram notificação.
- [[autenticacao-autorizacao]] — identifica os usuários destinatários dos avisos.
