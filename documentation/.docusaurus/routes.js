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
    component: ComponentCreator('/', 'd94'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '050'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'a2b'),
            routes: [
              {
                path: '/bi/gestao/',
                component: ComponentCreator('/bi/gestao/', '90b'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/bi/gestao/backlogs',
                component: ComponentCreator('/bi/gestao/backlogs', 'fdc'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/bi/gestao/overview',
                component: ComponentCreator('/bi/gestao/overview', '9a7'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/bi/gestao/process/',
                component: ComponentCreator('/bi/gestao/process/', '215'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/bi/gestao/process/processocriacaodashboard/',
                component: ComponentCreator('/bi/gestao/process/processocriacaodashboard/', '5a7'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/bi/gestao/roadmap',
                component: ComponentCreator('/bi/gestao/roadmap', 'c28'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/bi/gestao/sprints/sprin1',
                component: ComponentCreator('/bi/gestao/sprints/sprin1', '582'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/bi/gestao/sprints/sprint2',
                component: ComponentCreator('/bi/gestao/sprints/sprint2', '4c4'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/bi/gestao/sprints/sprint3',
                component: ComponentCreator('/bi/gestao/sprints/sprint3', 'f07'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/bi/gestao/sprints/sprint4',
                component: ComponentCreator('/bi/gestao/sprints/sprint4', '5c5'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/bi/gestao/sprints/sprint5',
                component: ComponentCreator('/bi/gestao/sprints/sprint5', 'efc'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/bi/visao_geral',
                component: ComponentCreator('/bi/visao_geral', '23a'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/category/--sprints',
                component: ComponentCreator('/category/--sprints', '621'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/category/arquitetura',
                component: ComponentCreator('/category/arquitetura', '94b'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/category/gestão',
                component: ComponentCreator('/category/gestão', '2a5'),
                exact: true,
                sidebar: "bi"
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
                component: ComponentCreator('/category/material-cypress', '34f'),
                exact: true,
                sidebar: "qa"
              },
              {
                path: '/category/processo',
                component: ComponentCreator('/category/processo', 'cf0'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/category/processos-de-garantia-da-qualidade',
                component: ComponentCreator('/category/processos-de-garantia-da-qualidade', '307'),
                exact: true,
                sidebar: "qa"
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
                path: '/category/trilha-de-estudos',
                component: ComponentCreator('/category/trilha-de-estudos', '5d9'),
                exact: true,
                sidebar: "colatina"
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
                path: '/category/visão-geral-do-conecta',
                component: ComponentCreator('/category/visão-geral-do-conecta', 'd81'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/colatina/intro',
                component: ComponentCreator('/colatina/intro', '1ba'),
                exact: true,
                sidebar: "colatina"
              },
              {
                path: '/colatina/trilhasestudos/config_eslint',
                component: ComponentCreator('/colatina/trilhasestudos/config_eslint', 'd9b'),
                exact: true,
                sidebar: "colatina"
              },
              {
                path: '/colatina/trilhasestudos/crud_basico_back',
                component: ComponentCreator('/colatina/trilhasestudos/crud_basico_back', '480'),
                exact: true,
                sidebar: "colatina"
              },
              {
                path: '/colatina/trilhasestudos/crud_basico_front',
                component: ComponentCreator('/colatina/trilhasestudos/crud_basico_front', '875'),
                exact: true,
                sidebar: "colatina"
              },
              {
                path: '/desenvolvimento/equipe',
                component: ComponentCreator('/desenvolvimento/equipe', '4d0'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/intro',
                component: ComponentCreator('/desenvolvimento/intro', '220'),
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
                path: '/desenvolvimento/processosoftware/modelostacy',
                component: ComponentCreator('/desenvolvimento/processosoftware/modelostacy', '683'),
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
                path: '/desenvolvimento/visaogeral/',
                component: ComponentCreator('/desenvolvimento/visaogeral/', 'a7a'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/devops/ambientes',
                component: ComponentCreator('/devops/ambientes', '657'),
                exact: true,
                sidebar: "devops"
              },
              {
                path: '/devops/intro',
                component: ComponentCreator('/devops/intro', '90a'),
                exact: true,
                sidebar: "devops"
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
                component: ComponentCreator('/modulos/api_gateway/architecture', '54c'),
                exact: true
              },
              {
                path: '/modulos/api_gateway/minimundo',
                component: ComponentCreator('/modulos/api_gateway/minimundo', '602'),
                exact: true
              },
              {
                path: '/modulos/api_gateway/processos',
                component: ComponentCreator('/modulos/api_gateway/processos', '091'),
                exact: true
              },
              {
                path: '/modulos/api_gateway/requirements',
                component: ComponentCreator('/modulos/api_gateway/requirements', 'fc0'),
                exact: true
              },
              {
                path: '/modulos/api_gateway/usecase',
                component: ComponentCreator('/modulos/api_gateway/usecase', '4fa'),
                exact: true
              },
              {
                path: '/modulos/autenticacao/minimundo',
                component: ComponentCreator('/modulos/autenticacao/minimundo', 'b40'),
                exact: true
              },
              {
                path: '/modulos/autenticacao/requirements',
                component: ComponentCreator('/modulos/autenticacao/requirements', 'bb7'),
                exact: true
              },
              {
                path: '/modulos/autenticacao/usecase',
                component: ComponentCreator('/modulos/autenticacao/usecase', '3ff'),
                exact: true
              },
              {
                path: '/modulos/gerenciar_editais/minimundo',
                component: ComponentCreator('/modulos/gerenciar_editais/minimundo', '4ae'),
                exact: true
              },
              {
                path: '/modulos/gerenciar_editais/requisitos',
                component: ComponentCreator('/modulos/gerenciar_editais/requisitos', '5ea'),
                exact: true
              },
              {
                path: '/modulos/gestao_bolsa_pesquisa/casos_uso',
                component: ComponentCreator('/modulos/gestao_bolsa_pesquisa/casos_uso', '45d'),
                exact: true
              },
              {
                path: '/modulos/gestao_bolsa_pesquisa/minimundo',
                component: ComponentCreator('/modulos/gestao_bolsa_pesquisa/minimundo', '39b'),
                exact: true
              },
              {
                path: '/modulos/gestao_bolsa_pesquisa/modelo_comportamental',
                component: ComponentCreator('/modulos/gestao_bolsa_pesquisa/modelo_comportamental', 'd6c'),
                exact: true
              },
              {
                path: '/modulos/gestao_bolsa_pesquisa/modelo_estrutural',
                component: ComponentCreator('/modulos/gestao_bolsa_pesquisa/modelo_estrutural', '772'),
                exact: true
              },
              {
                path: '/modulos/gestao_bolsa_pesquisa/requirements',
                component: ComponentCreator('/modulos/gestao_bolsa_pesquisa/requirements', '915'),
                exact: true
              },
              {
                path: '/modulos/importacao_editais/arquitetura',
                component: ComponentCreator('/modulos/importacao_editais/arquitetura', 'f96'),
                exact: true
              },
              {
                path: '/modulos/importacao_editais/casos-uso',
                component: ComponentCreator('/modulos/importacao_editais/casos-uso', 'd89'),
                exact: true
              },
              {
                path: '/modulos/importacao_editais/minimundo',
                component: ComponentCreator('/modulos/importacao_editais/minimundo', 'f25'),
                exact: true
              },
              {
                path: '/modulos/importacao_editais/modelo-comportamental',
                component: ComponentCreator('/modulos/importacao_editais/modelo-comportamental', 'ef0'),
                exact: true
              },
              {
                path: '/modulos/importacao_editais/modelo-estrutural',
                component: ComponentCreator('/modulos/importacao_editais/modelo-estrutural', '763'),
                exact: true
              },
              {
                path: '/modulos/importacao_editais/processos/integracao_edital',
                component: ComponentCreator('/modulos/importacao_editais/processos/integracao_edital', '5bc'),
                exact: true
              },
              {
                path: '/modulos/importacao_editais/processos/integracao_edital_projeto',
                component: ComponentCreator('/modulos/importacao_editais/processos/integracao_edital_projeto', 'c15'),
                exact: true
              },
              {
                path: '/modulos/importacao_editais/processos/integracao_projeto',
                component: ComponentCreator('/modulos/importacao_editais/processos/integracao_projeto', 'eb3'),
                exact: true
              },
              {
                path: '/modulos/importacao_editais/prototipo_telas',
                component: ComponentCreator('/modulos/importacao_editais/prototipo_telas', '9c9'),
                exact: true
              },
              {
                path: '/modulos/importacao_editais/requisitos',
                component: ComponentCreator('/modulos/importacao_editais/requisitos', '935'),
                exact: true
              },
              {
                path: '/modulos/intro',
                component: ComponentCreator('/modulos/intro', 'fb8'),
                exact: true
              },
              {
                path: '/modulos/modalidade_bolsa/arquitetura',
                component: ComponentCreator('/modulos/modalidade_bolsa/arquitetura', '0fb'),
                exact: true
              },
              {
                path: '/modulos/modalidade_bolsa/casos-uso',
                component: ComponentCreator('/modulos/modalidade_bolsa/casos-uso', '17c'),
                exact: true
              },
              {
                path: '/modulos/modalidade_bolsa/minimundo',
                component: ComponentCreator('/modulos/modalidade_bolsa/minimundo', 'e36'),
                exact: true
              },
              {
                path: '/modulos/modalidade_bolsa/modelo-comportamental',
                component: ComponentCreator('/modulos/modalidade_bolsa/modelo-comportamental', '46b'),
                exact: true
              },
              {
                path: '/modulos/modalidade_bolsa/modelo-estrutural',
                component: ComponentCreator('/modulos/modalidade_bolsa/modelo-estrutural', '051'),
                exact: true
              },
              {
                path: '/modulos/modalidade_bolsa/requisitos',
                component: ComponentCreator('/modulos/modalidade_bolsa/requisitos', 'ebe'),
                exact: true
              },
              {
                path: '/modulos/pagamento_bolsista/casos_uso',
                component: ComponentCreator('/modulos/pagamento_bolsista/casos_uso', 'ce6'),
                exact: true
              },
              {
                path: '/modulos/pagamento_bolsista/minimundo',
                component: ComponentCreator('/modulos/pagamento_bolsista/minimundo', '9fc'),
                exact: true
              },
              {
                path: '/modulos/pagamento_bolsista/modelo_comportamental',
                component: ComponentCreator('/modulos/pagamento_bolsista/modelo_comportamental', 'a22'),
                exact: true
              },
              {
                path: '/modulos/pagamento_bolsista/modelo_estrutural',
                component: ComponentCreator('/modulos/pagamento_bolsista/modelo_estrutural', '0a4'),
                exact: true
              },
              {
                path: '/modulos/pagamento_bolsista/requirements',
                component: ComponentCreator('/modulos/pagamento_bolsista/requirements', 'b62'),
                exact: true
              },
              {
                path: '/modulos/portal_fapes/diagramafluxo',
                component: ComponentCreator('/modulos/portal_fapes/diagramafluxo', '81f'),
                exact: true
              },
              {
                path: '/modulos/portal_fapes/introducao',
                component: ComponentCreator('/modulos/portal_fapes/introducao', 'd97'),
                exact: true
              },
              {
                path: '/modulos/portal_fapes/modeloestrutural',
                component: ComponentCreator('/modulos/portal_fapes/modeloestrutural', '2ed'),
                exact: true
              },
              {
                path: '/modulos/portal_fapes/requirements',
                component: ComponentCreator('/modulos/portal_fapes/requirements', '72a'),
                exact: true
              },
              {
                path: '/modulos/portal_fapes/usecase',
                component: ComponentCreator('/modulos/portal_fapes/usecase', 'ebb'),
                exact: true
              },
              {
                path: '/qualidade/cypress/boas_praticas_cypress',
                component: ComponentCreator('/qualidade/cypress/boas_praticas_cypress', '422'),
                exact: true,
                sidebar: "qa"
              },
              {
                path: '/qualidade/cypress/padrao_scripts_cypress',
                component: ComponentCreator('/qualidade/cypress/padrao_scripts_cypress', '114'),
                exact: true,
                sidebar: "qa"
              },
              {
                path: '/qualidade/intro',
                component: ComponentCreator('/qualidade/intro', 'b32'),
                exact: true,
                sidebar: "qa"
              },
              {
                path: '/qualidade/processos/boas-praticas-github',
                component: ComponentCreator('/qualidade/processos/boas-praticas-github', '948'),
                exact: true,
                sidebar: "qa"
              },
              {
                path: '/qualidade/processos/novo-processo',
                component: ComponentCreator('/qualidade/processos/novo-processo', '4b3'),
                exact: true,
                sidebar: "qa"
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
