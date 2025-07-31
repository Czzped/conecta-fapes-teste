---
title: Introdução
sidebar_position: 1
---

# Propósito

Este módulo refere-se ao Portal do Pesquisador e tem como objetivo principal oferecer aos pesquisadores um ambiente centralizado para:

    - Acompanhar o status de implementação de suas bolsas, incluindo prazos e próximos passos.

    - Visualizar pendências cadastrais e receber notificações para atualização de dados pessoais e documentos.

    - Facilitar o acesso a informações detalhadas sobre seus projetos e comunicação direta com coordenadores e área técnica.

Com isso, garante-se que o pesquisador mantenha-se sempre informado e possa cumprir requisitos e prazos sem distrações, ampliando a eficiência e transparência do processo de gestão de bolsas.

## Minimundo

O Portal do Pesquisador destina-se a formalizar e automatizar todo o ciclo de vida das bolsas de pesquisa desde a solicitação pelo coordenador até a aprovação e o efetivo pagamento ao bolsista, garantindo que cada etapa seja claramente registrada e visível ao usuário pesquisador. Neste contexto, o pesquisador interage com o sistema através de dois principais fluxos: 1) no momento do login, são apresentadas notificações sobre o status de implementação das bolsas e eventuais pendências cadastrais que precisam ser resolvidas para viabilizar o processo administrativo; e 2) no módulo “Meu Perfil”, o pesquisador pode completar dados pessoais, bancários e acadêmicos e anexar documentos obrigatórios, assegurando que todas as informações estejam consistentes e de acordo com os requisitos da FAPES.

A descrição do minimundo engloba regras de negócio como a obrigatoriedade do preenchimento de dados bancários exclusivos do BANESTES antes da solicitação de bolsa pelo coordenador, a apresentação de mensagens de alerta para solicitações feitas fora do prazo estipulado, e a exigência de assinatura eletrônica do Termo de Responsabilidade da FAPES antes do envio de documentos. Além disso, o sistema deve respeitar as restrições de visibilidade definidas: o pesquisador vê apenas suas próprias bolsas e projetos, sem acesso a informações de outros usuários, e os avisos são marcados como lidos após a interação, garantindo um histórico claro de notificações.

Por fim, é ideal que a aplicação seja desenvolvida seguindo boas práticas de modelagem de domínio, realizando a abstração dos elementos essenciais — como Usuário, Projeto e Bolsa — e traduzindo-os em componentes de software que suportem escalabilidade, segurança e usabilidade, de modo a refletir com precisão as regras de negócio coletadas durante as fases iniciais de requisitos.
