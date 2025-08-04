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
    component: ComponentCreator('/', '6f9'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'caa'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'b4d'),
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
                path: '/category/-2-importação-de-editais',
                component: ComponentCreator('/category/-2-importação-de-editais', '4f0'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/category/1-modalidades-de-bolsas',
                component: ComponentCreator('/category/1-modalidades-de-bolsas', '4df'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/category/4-pagamento-de-bolsistas',
                component: ComponentCreator('/category/4-pagamento-de-bolsistas', 'cc4'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/category/5-autenticacação-e-autorização',
                component: ComponentCreator('/category/5-autenticacação-e-autorização', 'bff'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/category/api-gateway',
                component: ComponentCreator('/category/api-gateway', 'fe9'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/category/arquitetura',
                component: ComponentCreator('/category/arquitetura', '94b'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/category/gerenciar-editais',
                component: ComponentCreator('/category/gerenciar-editais', 'f5e'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/category/gestão',
                component: ComponentCreator('/category/gestão', '2a5'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/category/gestao-bolsa-pesquisa',
                component: ComponentCreator('/category/gestao-bolsa-pesquisa', '77b'),
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
                component: ComponentCreator('/category/material-cypress', '34f'),
                exact: true,
                sidebar: "qa"
              },
              {
                path: '/category/módulos',
                component: ComponentCreator('/category/módulos', 'd95'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/category/portal-fapes',
                component: ComponentCreator('/category/portal-fapes', '8e7'),
                exact: true,
                sidebar: "desenvolvimento"
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
                path: '/category/processos-de-integração',
                component: ComponentCreator('/category/processos-de-integração', '9fe'),
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
                path: '/desenvolvimento/modulos/api_gateway/architecture',
                component: ComponentCreator('/desenvolvimento/modulos/api_gateway/architecture', '6e1'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/api_gateway/minimundo',
                component: ComponentCreator('/desenvolvimento/modulos/api_gateway/minimundo', '412'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/api_gateway/processos',
                component: ComponentCreator('/desenvolvimento/modulos/api_gateway/processos', 'a14'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/api_gateway/requirements',
                component: ComponentCreator('/desenvolvimento/modulos/api_gateway/requirements', 'c49'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/api_gateway/usecase',
                component: ComponentCreator('/desenvolvimento/modulos/api_gateway/usecase', '92a'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/autenticacao/minimundo',
                component: ComponentCreator('/desenvolvimento/modulos/autenticacao/minimundo', '501'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/autenticacao/requirements',
                component: ComponentCreator('/desenvolvimento/modulos/autenticacao/requirements', '892'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/autenticacao/usecase',
                component: ComponentCreator('/desenvolvimento/modulos/autenticacao/usecase', 'f84'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/gerenciar_editais/minimundo',
                component: ComponentCreator('/desenvolvimento/modulos/gerenciar_editais/minimundo', '69a'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/gerenciar_editais/requisitos',
                component: ComponentCreator('/desenvolvimento/modulos/gerenciar_editais/requisitos', 'ed9'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/gestao_bolsa_pesquisa/casos_uso',
                component: ComponentCreator('/desenvolvimento/modulos/gestao_bolsa_pesquisa/casos_uso', '5c5'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/gestao_bolsa_pesquisa/minimundo',
                component: ComponentCreator('/desenvolvimento/modulos/gestao_bolsa_pesquisa/minimundo', '263'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/gestao_bolsa_pesquisa/modelo_comportamental',
                component: ComponentCreator('/desenvolvimento/modulos/gestao_bolsa_pesquisa/modelo_comportamental', '8aa'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/gestao_bolsa_pesquisa/modelo_estrutural',
                component: ComponentCreator('/desenvolvimento/modulos/gestao_bolsa_pesquisa/modelo_estrutural', '87f'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/gestao_bolsa_pesquisa/requirements',
                component: ComponentCreator('/desenvolvimento/modulos/gestao_bolsa_pesquisa/requirements', 'a13'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/importacao_editais/arquitetura',
                component: ComponentCreator('/desenvolvimento/modulos/importacao_editais/arquitetura', '97a'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/importacao_editais/casos-uso',
                component: ComponentCreator('/desenvolvimento/modulos/importacao_editais/casos-uso', '882'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/importacao_editais/minimundo',
                component: ComponentCreator('/desenvolvimento/modulos/importacao_editais/minimundo', 'c89'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/importacao_editais/modelo-comportamental',
                component: ComponentCreator('/desenvolvimento/modulos/importacao_editais/modelo-comportamental', '116'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/importacao_editais/modelo-estrutural',
                component: ComponentCreator('/desenvolvimento/modulos/importacao_editais/modelo-estrutural', '3e8'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/importacao_editais/processos/integracao_edital',
                component: ComponentCreator('/desenvolvimento/modulos/importacao_editais/processos/integracao_edital', 'c59'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/importacao_editais/processos/integracao_edital_projeto',
                component: ComponentCreator('/desenvolvimento/modulos/importacao_editais/processos/integracao_edital_projeto', 'e65'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/importacao_editais/processos/integracao_projeto',
                component: ComponentCreator('/desenvolvimento/modulos/importacao_editais/processos/integracao_projeto', '847'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/importacao_editais/prototipo_telas',
                component: ComponentCreator('/desenvolvimento/modulos/importacao_editais/prototipo_telas', 'c6b'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/importacao_editais/requisitos',
                component: ComponentCreator('/desenvolvimento/modulos/importacao_editais/requisitos', 'b5c'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/intro',
                component: ComponentCreator('/desenvolvimento/modulos/intro', '203'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/modalidade_bolsa/arquitetura',
                component: ComponentCreator('/desenvolvimento/modulos/modalidade_bolsa/arquitetura', '1e2'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/modalidade_bolsa/casos-uso',
                component: ComponentCreator('/desenvolvimento/modulos/modalidade_bolsa/casos-uso', '81f'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/modalidade_bolsa/minimundo',
                component: ComponentCreator('/desenvolvimento/modulos/modalidade_bolsa/minimundo', '372'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/modalidade_bolsa/modelo-comportamental',
                component: ComponentCreator('/desenvolvimento/modulos/modalidade_bolsa/modelo-comportamental', '46a'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/modalidade_bolsa/modelo-estrutural',
                component: ComponentCreator('/desenvolvimento/modulos/modalidade_bolsa/modelo-estrutural', '7cd'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/modalidade_bolsa/requisitos',
                component: ComponentCreator('/desenvolvimento/modulos/modalidade_bolsa/requisitos', '8b0'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/pagamento_bolsista/casos_uso',
                component: ComponentCreator('/desenvolvimento/modulos/pagamento_bolsista/casos_uso', 'e3a'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/pagamento_bolsista/minimundo',
                component: ComponentCreator('/desenvolvimento/modulos/pagamento_bolsista/minimundo', '105'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/pagamento_bolsista/modelo_comportamental',
                component: ComponentCreator('/desenvolvimento/modulos/pagamento_bolsista/modelo_comportamental', 'aae'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/pagamento_bolsista/modelo_estrutural',
                component: ComponentCreator('/desenvolvimento/modulos/pagamento_bolsista/modelo_estrutural', '6ae'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/pagamento_bolsista/requirements',
                component: ComponentCreator('/desenvolvimento/modulos/pagamento_bolsista/requirements', '6d9'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/portal_fapes/diagramafluxo',
                component: ComponentCreator('/desenvolvimento/modulos/portal_fapes/diagramafluxo', '389'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/portal_fapes/introducao',
                component: ComponentCreator('/desenvolvimento/modulos/portal_fapes/introducao', 'a5e'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/portal_fapes/modeloestrutural',
                component: ComponentCreator('/desenvolvimento/modulos/portal_fapes/modeloestrutural', '47b'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/portal_fapes/requirements',
                component: ComponentCreator('/desenvolvimento/modulos/portal_fapes/requirements', 'd09'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/desenvolvimento/modulos/portal_fapes/usecase',
                component: ComponentCreator('/desenvolvimento/modulos/portal_fapes/usecase', 'f42'),
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
