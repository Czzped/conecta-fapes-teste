import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/bpmn',
    component: ComponentCreator('/bpmn', '880'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '34d'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '4c1'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '64d'),
            routes: [
              {
                path: '/category/-2-importação-de-editais',
                component: ComponentCreator('/category/-2-importação-de-editais', 'd26'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/category/1-modalidades-de-bolsas',
                component: ComponentCreator('/category/1-modalidades-de-bolsas', 'dff'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/category/4-pagamento-de-bolsistas',
                component: ComponentCreator('/category/4-pagamento-de-bolsistas', 'd8a'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/category/5-autenticacação-e-autorização',
                component: ComponentCreator('/category/5-autenticacação-e-autorização', 'bee'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/category/6-gerenciar-editais',
                component: ComponentCreator('/category/6-gerenciar-editais', '742'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/category/7-api-gateway',
                component: ComponentCreator('/category/7-api-gateway', '036'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/category/8-portal-fapes',
                component: ComponentCreator('/category/8-portal-fapes', '77e'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/category/9-gestão-de-bolsa-de-pesquisa',
                component: ComponentCreator('/category/9-gestão-de-bolsa-de-pesquisa', 'c5b'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/category/arquitetura',
                component: ComponentCreator('/category/arquitetura', '94b'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/category/garantia-de-qualidade-qa',
                component: ComponentCreator('/category/garantia-de-qualidade-qa', 'aba'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/category/gestão-orientada-a-dados',
                component: ComponentCreator('/category/gestão-orientada-a-dados', '03c'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/category/governo',
                component: ComponentCreator('/category/governo', '75d'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/category/material-cypress',
                component: ComponentCreator('/category/material-cypress', 'f3f'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/category/processos',
                component: ComponentCreator('/category/processos', '6e4'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/category/processos-de-integração',
                component: ComponentCreator('/category/processos-de-integração', '138'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/category/processos-qa',
                component: ComponentCreator('/category/processos-qa', '5db'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/category/trilha-de-capacitação',
                component: ComponentCreator('/category/trilha-de-capacitação', 'f89'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/category/trilha-de-desenvolvimento',
                component: ComponentCreator('/category/trilha-de-desenvolvimento', '3d6'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/category/trilha-de-pesquisa',
                component: ComponentCreator('/category/trilha-de-pesquisa', '854'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/category/trilhas-de-estudo',
                component: ComponentCreator('/category/trilhas-de-estudo', 'e3c'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/category/tutoriais',
                component: ComponentCreator('/category/tutoriais', '8f9'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/category/visão-de-negócio',
                component: ComponentCreator('/category/visão-de-negócio', '19a'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/category/visão-de-plataforma',
                component: ComponentCreator('/category/visão-de-plataforma', 'f38'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/category/visão-geral',
                component: ComponentCreator('/category/visão-geral', 'bbd'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/processosoftware/exemplo_documentacao_squad',
                component: ComponentCreator('/desenvolvimento/processosoftware/exemplo_documentacao_squad', 'c8d'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/processosoftware/processo_definir_design_sprint',
                component: ComponentCreator('/desenvolvimento/processosoftware/processo_definir_design_sprint', '259'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/processosoftware/processo_definir_produto_desenvolvido',
                component: ComponentCreator('/desenvolvimento/processosoftware/processo_definir_produto_desenvolvido', '5d4'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/processosoftware/processo_desenvolvimento',
                component: ComponentCreator('/desenvolvimento/processosoftware/processo_desenvolvimento', '615'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/processosoftware/processo_mapear_processos',
                component: ComponentCreator('/desenvolvimento/processosoftware/processo_mapear_processos', '12b'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/processosoftware/visao_geral',
                component: ComponentCreator('/desenvolvimento/processosoftware/visao_geral', 'e83'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/qualidade/cypress/boas_praticas_cypress',
                component: ComponentCreator('/desenvolvimento/qualidade/cypress/boas_praticas_cypress', '641'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/qualidade/cypress/padrao_scripts_cypress',
                component: ComponentCreator('/desenvolvimento/qualidade/cypress/padrao_scripts_cypress', '1c3'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/qualidade/intro',
                component: ComponentCreator('/desenvolvimento/qualidade/intro', '146'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/qualidade/processos/boas-praticas-github',
                component: ComponentCreator('/desenvolvimento/qualidade/processos/boas-praticas-github', '83d'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/qualidade/processos/novo-processo',
                component: ComponentCreator('/desenvolvimento/qualidade/processos/novo-processo', '5e5'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/visaogeral/intro',
                component: ComponentCreator('/desenvolvimento/visaogeral/intro', 'ddb'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/gestao/data_driven/metricas',
                component: ComponentCreator('/gestao/data_driven/metricas', '807'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/gestao/data_driven/tratamento-de-issues',
                component: ComponentCreator('/gestao/data_driven/tratamento-de-issues', '786'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/gestao/data_driven/visao_geral',
                component: ComponentCreator('/gestao/data_driven/visao_geral', 'ce1'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/gestao/modelostacy',
                component: ComponentCreator('/gestao/modelostacy', '599'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/gestao/processogestaomacro',
                component: ComponentCreator('/gestao/processogestaomacro', '305'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/gestao/trilha_capacitacao/aquisicao_talento',
                component: ComponentCreator('/gestao/trilha_capacitacao/aquisicao_talento', 'f79'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/gestao/trilha_capacitacao/visaogeral',
                component: ComponentCreator('/gestao/trilha_capacitacao/visaogeral', 'f94'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/gestao/trilha_desenvolvimento/negocio/backlog_negocio',
                component: ComponentCreator('/gestao/trilha_desenvolvimento/negocio/backlog_negocio', 'f2e'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/gestao/trilha_desenvolvimento/negocio/controlar_recursos_projeto',
                component: ComponentCreator('/gestao/trilha_desenvolvimento/negocio/controlar_recursos_projeto', '35e'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/gestao/trilha_desenvolvimento/negocio/entrega_pagamento_bolsista',
                component: ComponentCreator('/gestao/trilha_desenvolvimento/negocio/entrega_pagamento_bolsista', '281'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/gestao/trilha_desenvolvimento/negocio/implementacao_bolsa',
                component: ComponentCreator('/gestao/trilha_desenvolvimento/negocio/implementacao_bolsa', 'c1c'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/gestao/trilha_desenvolvimento/negocio/relatorio_analitico_leds-conectafapes',
                component: ComponentCreator('/gestao/trilha_desenvolvimento/negocio/relatorio_analitico_leds-conectafapes', 'c65'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/gestao/trilha_desenvolvimento/negocio/stakeholders',
                component: ComponentCreator('/gestao/trilha_desenvolvimento/negocio/stakeholders', '2ae'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/gestao/trilha_desenvolvimento/plataforma/backlog_plataforma',
                component: ComponentCreator('/gestao/trilha_desenvolvimento/plataforma/backlog_plataforma', '1d0'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/gestao/trilha_desenvolvimento/plataforma/geracao_codigo',
                component: ComponentCreator('/gestao/trilha_desenvolvimento/plataforma/geracao_codigo', 'cba'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/gestao/trilha_pesquisa/visaogeral',
                component: ComponentCreator('/gestao/trilha_pesquisa/visaogeral', '811'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/modulos/api_gateway/architecture',
                component: ComponentCreator('/modulos/api_gateway/architecture', '9d8'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/api_gateway/minimundo',
                component: ComponentCreator('/modulos/api_gateway/minimundo', '2ce'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/api_gateway/processos',
                component: ComponentCreator('/modulos/api_gateway/processos', 'f0d'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/api_gateway/requirements',
                component: ComponentCreator('/modulos/api_gateway/requirements', '8b5'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/api_gateway/usecase',
                component: ComponentCreator('/modulos/api_gateway/usecase', 'b1a'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/autenticacao/minimundo',
                component: ComponentCreator('/modulos/autenticacao/minimundo', '223'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/autenticacao/requirements',
                component: ComponentCreator('/modulos/autenticacao/requirements', '60c'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/autenticacao/usecase',
                component: ComponentCreator('/modulos/autenticacao/usecase', '261'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/gerenciar_editais/minimundo',
                component: ComponentCreator('/modulos/gerenciar_editais/minimundo', 'acc'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/gerenciar_editais/requisitos',
                component: ComponentCreator('/modulos/gerenciar_editais/requisitos', 'a69'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/gestao_bolsa_pesquisa/casos_uso',
                component: ComponentCreator('/modulos/gestao_bolsa_pesquisa/casos_uso', '64d'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/gestao_bolsa_pesquisa/minimundo',
                component: ComponentCreator('/modulos/gestao_bolsa_pesquisa/minimundo', 'f18'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/gestao_bolsa_pesquisa/modelo_comportamental',
                component: ComponentCreator('/modulos/gestao_bolsa_pesquisa/modelo_comportamental', '8c0'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/gestao_bolsa_pesquisa/modelo_estrutural',
                component: ComponentCreator('/modulos/gestao_bolsa_pesquisa/modelo_estrutural', '597'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/gestao_bolsa_pesquisa/requirements',
                component: ComponentCreator('/modulos/gestao_bolsa_pesquisa/requirements', '839'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/importacao_editais/arquitetura',
                component: ComponentCreator('/modulos/importacao_editais/arquitetura', 'a86'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/importacao_editais/casos-uso',
                component: ComponentCreator('/modulos/importacao_editais/casos-uso', 'a9f'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/importacao_editais/minimundo',
                component: ComponentCreator('/modulos/importacao_editais/minimundo', 'eef'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/importacao_editais/modelo-comportamental',
                component: ComponentCreator('/modulos/importacao_editais/modelo-comportamental', '7ae'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/importacao_editais/modelo-estrutural',
                component: ComponentCreator('/modulos/importacao_editais/modelo-estrutural', 'f83'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/importacao_editais/processos/integracao_edital',
                component: ComponentCreator('/modulos/importacao_editais/processos/integracao_edital', '3cf'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/importacao_editais/processos/integracao_edital_projeto',
                component: ComponentCreator('/modulos/importacao_editais/processos/integracao_edital_projeto', '90c'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/importacao_editais/processos/integracao_projeto',
                component: ComponentCreator('/modulos/importacao_editais/processos/integracao_projeto', 'b41'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/importacao_editais/prototipo_telas',
                component: ComponentCreator('/modulos/importacao_editais/prototipo_telas', 'f52'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/importacao_editais/requisitos',
                component: ComponentCreator('/modulos/importacao_editais/requisitos', '5b1'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/intro',
                component: ComponentCreator('/modulos/intro', '199'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/modalidade_bolsa/arquitetura',
                component: ComponentCreator('/modulos/modalidade_bolsa/arquitetura', 'f98'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/modalidade_bolsa/casos-uso',
                component: ComponentCreator('/modulos/modalidade_bolsa/casos-uso', '0c7'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/modalidade_bolsa/minimundo',
                component: ComponentCreator('/modulos/modalidade_bolsa/minimundo', 'e62'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/modalidade_bolsa/modelo-comportamental',
                component: ComponentCreator('/modulos/modalidade_bolsa/modelo-comportamental', 'fc7'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/modalidade_bolsa/modelo-estrutural',
                component: ComponentCreator('/modulos/modalidade_bolsa/modelo-estrutural', 'a97'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/modalidade_bolsa/requisitos',
                component: ComponentCreator('/modulos/modalidade_bolsa/requisitos', 'ea7'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/pagamento_bolsista/casos_uso',
                component: ComponentCreator('/modulos/pagamento_bolsista/casos_uso', '207'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/pagamento_bolsista/minimundo',
                component: ComponentCreator('/modulos/pagamento_bolsista/minimundo', 'ffd'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/pagamento_bolsista/modelo_comportamental',
                component: ComponentCreator('/modulos/pagamento_bolsista/modelo_comportamental', '933'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/pagamento_bolsista/modelo_estrutural',
                component: ComponentCreator('/modulos/pagamento_bolsista/modelo_estrutural', '8bf'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/pagamento_bolsista/requirements',
                component: ComponentCreator('/modulos/pagamento_bolsista/requirements', 'f60'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/portal_fapes/diagramafluxo',
                component: ComponentCreator('/modulos/portal_fapes/diagramafluxo', '29a'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/portal_fapes/introducao',
                component: ComponentCreator('/modulos/portal_fapes/introducao', '4f2'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/portal_fapes/modeloestrutural',
                component: ComponentCreator('/modulos/portal_fapes/modeloestrutural', '1f8'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/portal_fapes/requirements',
                component: ComponentCreator('/modulos/portal_fapes/requirements', '05c'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/modulos/portal_fapes/usecase',
                component: ComponentCreator('/modulos/portal_fapes/usecase', '048'),
                exact: true,
                sidebar: "modulos"
              },
              {
                path: '/referencias/arquitetura/arquitetura',
                component: ComponentCreator('/referencias/arquitetura/arquitetura', '463'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/arquitetura/componentes_arquitetura',
                component: ComponentCreator('/referencias/arquitetura/componentes_arquitetura', '2f6'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/arquitetura/conceitos',
                component: ComponentCreator('/referencias/arquitetura/conceitos', '8a4'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/arquitetura/tecnologias',
                component: ComponentCreator('/referencias/arquitetura/tecnologias', 'ee7'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/governo/acesso_cidadao',
                component: ComponentCreator('/referencias/governo/acesso_cidadao', 'b05'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/governo/api_notificacao',
                component: ComponentCreator('/referencias/governo/api_notificacao', '142'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/governo/banestes',
                component: ComponentCreator('/referencias/governo/banestes', '826'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/governo/sigfapes',
                component: ComponentCreator('/referencias/governo/sigfapes', '0d6'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/intro',
                component: ComponentCreator('/referencias/intro', 'e89'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/trilhas/roadmap-backend',
                component: ComponentCreator('/referencias/trilhas/roadmap-backend', '7e3'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/trilhas/roadmap-frontend',
                component: ComponentCreator('/referencias/trilhas/roadmap-frontend', 'b60'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/tutoriais/dibb',
                component: ComponentCreator('/referencias/tutoriais/dibb', 'a57'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/tutoriais/escrita_issues',
                component: ComponentCreator('/referencias/tutoriais/escrita_issues', '8d0'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/tutoriais/integracao-acesso-cidadao',
                component: ComponentCreator('/referencias/tutoriais/integracao-acesso-cidadao', 'da7'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/tutoriais/intro',
                component: ComponentCreator('/referencias/tutoriais/intro', 'f3c'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/tutoriais/less',
                component: ComponentCreator('/referencias/tutoriais/less', '256'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/tutoriais/prompt',
                component: ComponentCreator('/referencias/tutoriais/prompt', 'fcf'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/tutoriais/six_paper',
                component: ComponentCreator('/referencias/tutoriais/six_paper', 'fbd'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/referencias/tutoriais/token-jwt-interno',
                component: ComponentCreator('/referencias/tutoriais/token-jwt-interno', 'da8'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/sdd_conecta_admin/banco_dados',
                component: ComponentCreator('/sdd_conecta_admin/banco_dados', '617'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/sdd_conecta_admin/descricao_geral',
                component: ComponentCreator('/sdd_conecta_admin/descricao_geral', 'a95'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/sdd_conecta_admin/design_detalhado',
                component: ComponentCreator('/sdd_conecta_admin/design_detalhado', 'b8f'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/sdd_conecta_admin/diretrizes_design',
                component: ComponentCreator('/sdd_conecta_admin/diretrizes_design', '718'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/sdd_conecta_admin/glossario',
                component: ComponentCreator('/sdd_conecta_admin/glossario', 'bda'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/sdd_conecta_admin/interfaces_externas',
                component: ComponentCreator('/sdd_conecta_admin/interfaces_externas', 'd45'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/sdd_conecta_admin/introducao',
                component: ComponentCreator('/sdd_conecta_admin/introducao', 'ce4'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/sdd_conecta_admin/plano_de_testes',
                component: ComponentCreator('/sdd_conecta_admin/plano_de_testes', 'e5a'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/sdd_conecta_admin/requisitos_funcionais',
                component: ComponentCreator('/sdd_conecta_admin/requisitos_funcionais', '3ee'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/sdd_conecta_admin/seguranca',
                component: ComponentCreator('/sdd_conecta_admin/seguranca', 'f7d'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/',
                component: ComponentCreator('/', '6d3'),
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
