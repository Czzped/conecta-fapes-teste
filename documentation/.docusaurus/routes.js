import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/conectafapes-project/bpmn',
    component: ComponentCreator('/conectafapes-project/bpmn', '536'),
    exact: true
  },
  {
    path: '/conectafapes-project/markdown-page',
    component: ComponentCreator('/conectafapes-project/markdown-page', '45d'),
    exact: true
  },
  {
    path: '/conectafapes-project/',
    component: ComponentCreator('/conectafapes-project/', '31d'),
    routes: [
      {
        path: '/conectafapes-project/',
        component: ComponentCreator('/conectafapes-project/', '622'),
        routes: [
          {
            path: '/conectafapes-project/',
            component: ComponentCreator('/conectafapes-project/', '4d3'),
            routes: [
              {
                path: '/conectafapes-project/category/-2-importação-de-editais',
                component: ComponentCreator('/conectafapes-project/category/-2-importação-de-editais', '72f'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/category/1-modalidades-de-bolsas',
                component: ComponentCreator('/conectafapes-project/category/1-modalidades-de-bolsas', 'a94'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/category/4-pagamento-de-bolsistas',
                component: ComponentCreator('/conectafapes-project/category/4-pagamento-de-bolsistas', '12d'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/category/5-autenticacação-e-autorização',
                component: ComponentCreator('/conectafapes-project/category/5-autenticacação-e-autorização', '972'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/category/6-gerenciar-editais',
                component: ComponentCreator('/conectafapes-project/category/6-gerenciar-editais', '102'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/category/7-api-gateway',
                component: ComponentCreator('/conectafapes-project/category/7-api-gateway', '0cd'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/category/8-portal-fapes',
                component: ComponentCreator('/conectafapes-project/category/8-portal-fapes', 'b79'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/category/9-gestão-de-bolsa-de-pesquisa',
                component: ComponentCreator('/conectafapes-project/category/9-gestão-de-bolsa-de-pesquisa', '01f'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/category/arquitetura',
                component: ComponentCreator('/conectafapes-project/category/arquitetura', 'e31'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/category/garantia-de-qualidade-qa',
                component: ComponentCreator('/conectafapes-project/category/garantia-de-qualidade-qa', '4be'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/category/gestão-orientada-a-dados',
                component: ComponentCreator('/conectafapes-project/category/gestão-orientada-a-dados', '47d'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/category/governo',
                component: ComponentCreator('/conectafapes-project/category/governo', '2d4'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/category/material-cypress',
                component: ComponentCreator('/conectafapes-project/category/material-cypress', '0d1'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/category/processos',
                component: ComponentCreator('/conectafapes-project/category/processos', 'ae8'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/category/processos-de-integração',
                component: ComponentCreator('/conectafapes-project/category/processos-de-integração', 'a0b'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/category/processos-qa',
                component: ComponentCreator('/conectafapes-project/category/processos-qa', '192'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/category/trilha-de-capacitação',
                component: ComponentCreator('/conectafapes-project/category/trilha-de-capacitação', 'e89'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/category/trilha-de-desenvolvimento',
                component: ComponentCreator('/conectafapes-project/category/trilha-de-desenvolvimento', '389'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/category/trilha-de-pesquisa',
                component: ComponentCreator('/conectafapes-project/category/trilha-de-pesquisa', 'cfc'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/category/trilhas-de-estudo',
                component: ComponentCreator('/conectafapes-project/category/trilhas-de-estudo', 'ec5'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/category/tutoriais',
                component: ComponentCreator('/conectafapes-project/category/tutoriais', '69a'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/category/visão-de-negócio',
                component: ComponentCreator('/conectafapes-project/category/visão-de-negócio', '66f'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/category/visão-de-plataforma',
                component: ComponentCreator('/conectafapes-project/category/visão-de-plataforma', 'f70'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/category/visão-geral',
                component: ComponentCreator('/conectafapes-project/category/visão-geral', '676'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/processosoftware/exemplo_documentacao_squad',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/processosoftware/exemplo_documentacao_squad', '789'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/processosoftware/processo_definir_design_sprint',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/processosoftware/processo_definir_design_sprint', '13f'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/processosoftware/processo_definir_produto_desenvolvido',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/processosoftware/processo_definir_produto_desenvolvido', '849'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/processosoftware/processo_desenvolvimento',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/processosoftware/processo_desenvolvimento', '48f'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/processosoftware/processo_mapear_processos',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/processosoftware/processo_mapear_processos', 'fad'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/processosoftware/visao_geral',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/processosoftware/visao_geral', '3cd'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/qualidade/cypress/boas_praticas_cypress',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/qualidade/cypress/boas_praticas_cypress', 'bf5'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/qualidade/cypress/padrao_scripts_cypress',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/qualidade/cypress/padrao_scripts_cypress', '48b'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/qualidade/intro',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/qualidade/intro', 'a10'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/qualidade/processos/boas-praticas-github',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/qualidade/processos/boas-praticas-github', 'ae0'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/qualidade/processos/novo-processo',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/qualidade/processos/novo-processo', '737'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/visaogeral/intro',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/visaogeral/intro', '3e9'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/gestao/data_driven/metricas',
                component: ComponentCreator('/conectafapes-project/gestao/data_driven/metricas', '576'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/data_driven/tratamento-de-issues',
                component: ComponentCreator('/conectafapes-project/gestao/data_driven/tratamento-de-issues', '48d'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/data_driven/visao_geral',
                component: ComponentCreator('/conectafapes-project/gestao/data_driven/visao_geral', '3cb'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/modelostacy',
                component: ComponentCreator('/conectafapes-project/gestao/modelostacy', 'ada'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/processogestaomacro',
                component: ComponentCreator('/conectafapes-project/gestao/processogestaomacro', '04c'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_capacitacao/aquisicao_talento',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_capacitacao/aquisicao_talento', 'cbc'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_capacitacao/visaogeral',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_capacitacao/visaogeral', '80f'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_desenvolvimento/negocio/backlog_negocio',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_desenvolvimento/negocio/backlog_negocio', 'cd2'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_desenvolvimento/negocio/controlar_recursos_projeto',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_desenvolvimento/negocio/controlar_recursos_projeto', '9ad'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_desenvolvimento/negocio/entrega_pagamento_bolsista',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_desenvolvimento/negocio/entrega_pagamento_bolsista', '1b4'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_desenvolvimento/negocio/implementacao_bolsa',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_desenvolvimento/negocio/implementacao_bolsa', '71f'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_desenvolvimento/negocio/relatorio_analitico_leds-conectafapes',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_desenvolvimento/negocio/relatorio_analitico_leds-conectafapes', 'fb5'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_desenvolvimento/negocio/stakeholders',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_desenvolvimento/negocio/stakeholders', '875'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_desenvolvimento/plataforma/backlog_plataforma',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_desenvolvimento/plataforma/backlog_plataforma', 'eb3'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_desenvolvimento/plataforma/geracao_codigo',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_desenvolvimento/plataforma/geracao_codigo', 'cff'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_pesquisa/visaogeral',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_pesquisa/visaogeral', 'ab2'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/modulos/api_gateway/architecture',
                component: ComponentCreator('/conectafapes-project/modulos/api_gateway/architecture', 'de3'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/api_gateway/minimundo',
                component: ComponentCreator('/conectafapes-project/modulos/api_gateway/minimundo', '7f4'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/api_gateway/processos',
                component: ComponentCreator('/conectafapes-project/modulos/api_gateway/processos', '4a4'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/api_gateway/requirements',
                component: ComponentCreator('/conectafapes-project/modulos/api_gateway/requirements', 'ba5'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/api_gateway/usecase',
                component: ComponentCreator('/conectafapes-project/modulos/api_gateway/usecase', '696'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/autenticacao/minimundo',
                component: ComponentCreator('/conectafapes-project/modulos/autenticacao/minimundo', '161'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/autenticacao/requirements',
                component: ComponentCreator('/conectafapes-project/modulos/autenticacao/requirements', '726'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/autenticacao/usecase',
                component: ComponentCreator('/conectafapes-project/modulos/autenticacao/usecase', 'c82'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/gerenciar_editais/minimundo',
                component: ComponentCreator('/conectafapes-project/modulos/gerenciar_editais/minimundo', '3cc'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/gerenciar_editais/requisitos',
                component: ComponentCreator('/conectafapes-project/modulos/gerenciar_editais/requisitos', '7b4'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/gestao_bolsa_pesquisa/casos_uso',
                component: ComponentCreator('/conectafapes-project/modulos/gestao_bolsa_pesquisa/casos_uso', '0b1'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/gestao_bolsa_pesquisa/minimundo',
                component: ComponentCreator('/conectafapes-project/modulos/gestao_bolsa_pesquisa/minimundo', '873'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/gestao_bolsa_pesquisa/modelo_comportamental',
                component: ComponentCreator('/conectafapes-project/modulos/gestao_bolsa_pesquisa/modelo_comportamental', 'c79'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/gestao_bolsa_pesquisa/modelo_estrutural',
                component: ComponentCreator('/conectafapes-project/modulos/gestao_bolsa_pesquisa/modelo_estrutural', 'ba4'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/gestao_bolsa_pesquisa/requirements',
                component: ComponentCreator('/conectafapes-project/modulos/gestao_bolsa_pesquisa/requirements', 'ec2'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/importacao_editais/arquitetura',
                component: ComponentCreator('/conectafapes-project/modulos/importacao_editais/arquitetura', 'b60'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/importacao_editais/casos-uso',
                component: ComponentCreator('/conectafapes-project/modulos/importacao_editais/casos-uso', 'abe'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/importacao_editais/minimundo',
                component: ComponentCreator('/conectafapes-project/modulos/importacao_editais/minimundo', '0fc'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/importacao_editais/modelo-comportamental',
                component: ComponentCreator('/conectafapes-project/modulos/importacao_editais/modelo-comportamental', 'acf'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/importacao_editais/modelo-estrutural',
                component: ComponentCreator('/conectafapes-project/modulos/importacao_editais/modelo-estrutural', 'ebe'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/importacao_editais/processos/integracao_edital',
                component: ComponentCreator('/conectafapes-project/modulos/importacao_editais/processos/integracao_edital', '22b'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/importacao_editais/processos/integracao_edital_projeto',
                component: ComponentCreator('/conectafapes-project/modulos/importacao_editais/processos/integracao_edital_projeto', '9cd'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/importacao_editais/processos/integracao_projeto',
                component: ComponentCreator('/conectafapes-project/modulos/importacao_editais/processos/integracao_projeto', '207'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/importacao_editais/prototipo_telas',
                component: ComponentCreator('/conectafapes-project/modulos/importacao_editais/prototipo_telas', '80b'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/importacao_editais/requisitos',
                component: ComponentCreator('/conectafapes-project/modulos/importacao_editais/requisitos', 'b6e'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/intro',
                component: ComponentCreator('/conectafapes-project/modulos/intro', '023'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/modalidade_bolsa/arquitetura',
                component: ComponentCreator('/conectafapes-project/modulos/modalidade_bolsa/arquitetura', 'dc0'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/modalidade_bolsa/casos-uso',
                component: ComponentCreator('/conectafapes-project/modulos/modalidade_bolsa/casos-uso', 'f3f'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/modalidade_bolsa/minimundo',
                component: ComponentCreator('/conectafapes-project/modulos/modalidade_bolsa/minimundo', '8ca'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/modalidade_bolsa/modelo-comportamental',
                component: ComponentCreator('/conectafapes-project/modulos/modalidade_bolsa/modelo-comportamental', 'e95'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/modalidade_bolsa/modelo-estrutural',
                component: ComponentCreator('/conectafapes-project/modulos/modalidade_bolsa/modelo-estrutural', '219'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/modalidade_bolsa/requisitos',
                component: ComponentCreator('/conectafapes-project/modulos/modalidade_bolsa/requisitos', '87a'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/pagamento_bolsista/casos_uso',
                component: ComponentCreator('/conectafapes-project/modulos/pagamento_bolsista/casos_uso', '745'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/pagamento_bolsista/minimundo',
                component: ComponentCreator('/conectafapes-project/modulos/pagamento_bolsista/minimundo', '31c'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/pagamento_bolsista/modelo_comportamental',
                component: ComponentCreator('/conectafapes-project/modulos/pagamento_bolsista/modelo_comportamental', 'edf'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/pagamento_bolsista/modelo_estrutural',
                component: ComponentCreator('/conectafapes-project/modulos/pagamento_bolsista/modelo_estrutural', '345'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/pagamento_bolsista/requirements',
                component: ComponentCreator('/conectafapes-project/modulos/pagamento_bolsista/requirements', 'a10'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/portal_fapes/diagramafluxo',
                component: ComponentCreator('/conectafapes-project/modulos/portal_fapes/diagramafluxo', 'be2'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/portal_fapes/introducao',
                component: ComponentCreator('/conectafapes-project/modulos/portal_fapes/introducao', 'e75'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/portal_fapes/modeloestrutural',
                component: ComponentCreator('/conectafapes-project/modulos/portal_fapes/modeloestrutural', '561'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/portal_fapes/requirements',
                component: ComponentCreator('/conectafapes-project/modulos/portal_fapes/requirements', '4a7'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/modulos/portal_fapes/usecase',
                component: ComponentCreator('/conectafapes-project/modulos/portal_fapes/usecase', '9ad'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/conectafapes-project/referencias/arquitetura/arquitetura',
                component: ComponentCreator('/conectafapes-project/referencias/arquitetura/arquitetura', 'eb7'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/arquitetura/componentes_arquitetura',
                component: ComponentCreator('/conectafapes-project/referencias/arquitetura/componentes_arquitetura', '7d5'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/arquitetura/conceitos',
                component: ComponentCreator('/conectafapes-project/referencias/arquitetura/conceitos', 'e3d'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/arquitetura/tecnologias',
                component: ComponentCreator('/conectafapes-project/referencias/arquitetura/tecnologias', '791'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/governo/acesso_cidadao',
                component: ComponentCreator('/conectafapes-project/referencias/governo/acesso_cidadao', '56c'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/governo/api_notificacao',
                component: ComponentCreator('/conectafapes-project/referencias/governo/api_notificacao', '104'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/governo/banestes',
                component: ComponentCreator('/conectafapes-project/referencias/governo/banestes', '8bc'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/governo/sigfapes',
                component: ComponentCreator('/conectafapes-project/referencias/governo/sigfapes', '8a5'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/intro',
                component: ComponentCreator('/conectafapes-project/referencias/intro', 'ae0'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/trilhas/roadmap-backend',
                component: ComponentCreator('/conectafapes-project/referencias/trilhas/roadmap-backend', '3f2'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/trilhas/roadmap-frontend',
                component: ComponentCreator('/conectafapes-project/referencias/trilhas/roadmap-frontend', '345'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/tutoriais/dibb',
                component: ComponentCreator('/conectafapes-project/referencias/tutoriais/dibb', 'f74'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/tutoriais/escrita_issues',
                component: ComponentCreator('/conectafapes-project/referencias/tutoriais/escrita_issues', 'd71'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/tutoriais/integracao-acesso-cidadao',
                component: ComponentCreator('/conectafapes-project/referencias/tutoriais/integracao-acesso-cidadao', '022'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/tutoriais/intro',
                component: ComponentCreator('/conectafapes-project/referencias/tutoriais/intro', '0b4'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/tutoriais/less',
                component: ComponentCreator('/conectafapes-project/referencias/tutoriais/less', 'f3e'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/tutoriais/prompt',
                component: ComponentCreator('/conectafapes-project/referencias/tutoriais/prompt', '329'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/tutoriais/six_paper',
                component: ComponentCreator('/conectafapes-project/referencias/tutoriais/six_paper', 'c5a'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/tutoriais/token-jwt-interno',
                component: ComponentCreator('/conectafapes-project/referencias/tutoriais/token-jwt-interno', 'dff'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/banco_dados',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/banco_dados', '912'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/descricao_geral',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/descricao_geral', '4be'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/design_detalhado',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/design_detalhado', '5c2'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/diretrizes_design',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/diretrizes_design', '49d'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/glossario',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/glossario', '01d'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/interfaces_externas',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/interfaces_externas', '2e4'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/introducao',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/introducao', 'baf'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/plano_de_testes',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/plano_de_testes', 'af1'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/requisitos_funcionais',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/requisitos_funcionais', '3a7'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/seguranca',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/seguranca', '5f1'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/',
                component: ComponentCreator('/conectafapes-project/', 'f20'),
                exact: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
