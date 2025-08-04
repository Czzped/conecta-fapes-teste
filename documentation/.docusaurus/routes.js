import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/conectafapes-project/__docusaurus/debug',
    component: ComponentCreator('/conectafapes-project/__docusaurus/debug', 'bbf'),
    exact: true
  },
  {
    path: '/conectafapes-project/__docusaurus/debug/config',
    component: ComponentCreator('/conectafapes-project/__docusaurus/debug/config', '6a6'),
    exact: true
  },
  {
    path: '/conectafapes-project/__docusaurus/debug/content',
    component: ComponentCreator('/conectafapes-project/__docusaurus/debug/content', '74f'),
    exact: true
  },
  {
    path: '/conectafapes-project/__docusaurus/debug/globalData',
    component: ComponentCreator('/conectafapes-project/__docusaurus/debug/globalData', '509'),
    exact: true
  },
  {
    path: '/conectafapes-project/__docusaurus/debug/metadata',
    component: ComponentCreator('/conectafapes-project/__docusaurus/debug/metadata', '6e2'),
    exact: true
  },
  {
    path: '/conectafapes-project/__docusaurus/debug/registry',
    component: ComponentCreator('/conectafapes-project/__docusaurus/debug/registry', '118'),
    exact: true
  },
  {
    path: '/conectafapes-project/__docusaurus/debug/routes',
    component: ComponentCreator('/conectafapes-project/__docusaurus/debug/routes', 'a7e'),
    exact: true
  },
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
    component: ComponentCreator('/conectafapes-project/', '3ab'),
    routes: [
      {
        path: '/conectafapes-project/',
        component: ComponentCreator('/conectafapes-project/', '46d'),
        routes: [
          {
            path: '/conectafapes-project/',
            component: ComponentCreator('/conectafapes-project/', '9aa'),
            routes: [
              {
                path: '/conectafapes-project/administrativo/bolsas-do-projeto',
                component: ComponentCreator('/conectafapes-project/administrativo/bolsas-do-projeto', 'ed4'),
                exact: true,
                sidebar: "administrativo"
              },
              {
                path: '/conectafapes-project/administrativo/contatos-whatsapp',
                component: ComponentCreator('/conectafapes-project/administrativo/contatos-whatsapp', 'd1c'),
                exact: true,
                sidebar: "administrativo"
              },
              {
                path: '/conectafapes-project/administrativo/intro',
                component: ComponentCreator('/conectafapes-project/administrativo/intro', '803'),
                exact: true,
                sidebar: "administrativo"
              },
              {
                path: '/conectafapes-project/bi/gestao/',
                component: ComponentCreator('/conectafapes-project/bi/gestao/', '690'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/conectafapes-project/bi/gestao/backlogs',
                component: ComponentCreator('/conectafapes-project/bi/gestao/backlogs', '45b'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/conectafapes-project/bi/gestao/overview',
                component: ComponentCreator('/conectafapes-project/bi/gestao/overview', '023'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/conectafapes-project/bi/gestao/process/',
                component: ComponentCreator('/conectafapes-project/bi/gestao/process/', '72f'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/conectafapes-project/bi/gestao/process/processocriacaodashboard/',
                component: ComponentCreator('/conectafapes-project/bi/gestao/process/processocriacaodashboard/', '23e'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/conectafapes-project/bi/gestao/roadmap',
                component: ComponentCreator('/conectafapes-project/bi/gestao/roadmap', 'df7'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/conectafapes-project/bi/gestao/sprints/sprin1',
                component: ComponentCreator('/conectafapes-project/bi/gestao/sprints/sprin1', 'da5'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/conectafapes-project/bi/gestao/sprints/sprint2',
                component: ComponentCreator('/conectafapes-project/bi/gestao/sprints/sprint2', '43a'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/conectafapes-project/bi/gestao/sprints/sprint3',
                component: ComponentCreator('/conectafapes-project/bi/gestao/sprints/sprint3', 'a25'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/conectafapes-project/bi/gestao/sprints/sprint4',
                component: ComponentCreator('/conectafapes-project/bi/gestao/sprints/sprint4', 'dda'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/conectafapes-project/bi/gestao/sprints/sprint5',
                component: ComponentCreator('/conectafapes-project/bi/gestao/sprints/sprint5', '552'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/conectafapes-project/bi/visao_geral',
                component: ComponentCreator('/conectafapes-project/bi/visao_geral', '487'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/conectafapes-project/category/--sprints',
                component: ComponentCreator('/conectafapes-project/category/--sprints', 'c56'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/conectafapes-project/category/api-gateway',
                component: ComponentCreator('/conectafapes-project/category/api-gateway', '843'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/category/arquitetura',
                component: ComponentCreator('/conectafapes-project/category/arquitetura', 'e31'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/category/autenticacação-e-autorização',
                component: ComponentCreator('/conectafapes-project/category/autenticacação-e-autorização', '44f'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/category/designux',
                component: ComponentCreator('/conectafapes-project/category/designux', '6df'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/category/diretrizes',
                component: ComponentCreator('/conectafapes-project/category/diretrizes', 'b9d'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/category/gerenciar-editais',
                component: ComponentCreator('/conectafapes-project/category/gerenciar-editais', 'bae'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/category/gestão',
                component: ComponentCreator('/conectafapes-project/category/gestão', '632'),
                exact: true,
                sidebar: "bi"
              },
              {
                path: '/conectafapes-project/category/gestao-bolsa-pesquisa',
                component: ComponentCreator('/conectafapes-project/category/gestao-bolsa-pesquisa', 'f09'),
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
                path: '/conectafapes-project/category/importação-de-editais',
                component: ComponentCreator('/conectafapes-project/category/importação-de-editais', '5dc'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/category/material-cypress',
                component: ComponentCreator('/conectafapes-project/category/material-cypress', '7b4'),
                exact: true,
                sidebar: "qa"
              },
              {
                path: '/conectafapes-project/category/modalidades-de-bolsas',
                component: ComponentCreator('/conectafapes-project/category/modalidades-de-bolsas', '612'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/category/módulos',
                component: ComponentCreator('/conectafapes-project/category/módulos', '2b3'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/category/pagamento-de-bolsistas',
                component: ComponentCreator('/conectafapes-project/category/pagamento-de-bolsistas', 'b95'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/category/portal-fapes',
                component: ComponentCreator('/conectafapes-project/category/portal-fapes', '01e'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/category/processo',
                component: ComponentCreator('/conectafapes-project/category/processo', '1a5'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/category/processos-de-garantia-da-qualidade',
                component: ComponentCreator('/conectafapes-project/category/processos-de-garantia-da-qualidade', '8ee'),
                exact: true,
                sidebar: "qa"
              },
              {
                path: '/conectafapes-project/category/processos-de-integração',
                component: ComponentCreator('/conectafapes-project/category/processos-de-integração', 'fe6'),
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
                path: '/conectafapes-project/category/trilha-de-estudos',
                component: ComponentCreator('/conectafapes-project/category/trilha-de-estudos', 'b01'),
                exact: true,
                sidebar: "colatina"
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
                path: '/conectafapes-project/category/visão-geral-do-conecta',
                component: ComponentCreator('/conectafapes-project/category/visão-geral-do-conecta', '171'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/colatina/intro',
                component: ComponentCreator('/conectafapes-project/colatina/intro', '411'),
                exact: true,
                sidebar: "colatina"
              },
              {
                path: '/conectafapes-project/colatina/trilhasestudos/config_eslint',
                component: ComponentCreator('/conectafapes-project/colatina/trilhasestudos/config_eslint', 'b7f'),
                exact: true,
                sidebar: "colatina"
              },
              {
                path: '/conectafapes-project/colatina/trilhasestudos/crud_basico_back',
                component: ComponentCreator('/conectafapes-project/colatina/trilhasestudos/crud_basico_back', 'e5d'),
                exact: true,
                sidebar: "colatina"
              },
              {
                path: '/conectafapes-project/colatina/trilhasestudos/crud_basico_front',
                component: ComponentCreator('/conectafapes-project/colatina/trilhasestudos/crud_basico_front', 'beb'),
                exact: true,
                sidebar: "colatina"
              },
              {
                path: '/conectafapes-project/desenvolvimento/design/design_system',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/design/design_system', '12d'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/design/diretrizes/acessibilidade-digital',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/design/diretrizes/acessibilidade-digital', '413'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/design/diretrizes/grid8pontos',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/design/diretrizes/grid8pontos', 'ef6'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/design/intro',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/design/intro', 'dcb'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/equipe',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/equipe', '58c'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/intro',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/intro', 'f1d'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/api_gateway/architecture',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/api_gateway/architecture', 'ff4'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/api_gateway/minimundo',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/api_gateway/minimundo', '3e8'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/api_gateway/processos',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/api_gateway/processos', '2ae'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/api_gateway/requirements',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/api_gateway/requirements', '526'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/api_gateway/usecase',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/api_gateway/usecase', '624'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/autenticacao/minimundo',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/autenticacao/minimundo', '168'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/autenticacao/requirements',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/autenticacao/requirements', '9e8'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/autenticacao/usecase',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/autenticacao/usecase', '2ed'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/gerenciar_editais/minimundo',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/gerenciar_editais/minimundo', '0f1'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/gerenciar_editais/requisitos',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/gerenciar_editais/requisitos', 'b80'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/gestao_bolsa_pesquisa/casos_uso',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/gestao_bolsa_pesquisa/casos_uso', 'f41'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/gestao_bolsa_pesquisa/minimundo',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/gestao_bolsa_pesquisa/minimundo', '413'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/gestao_bolsa_pesquisa/modelo_comportamental',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/gestao_bolsa_pesquisa/modelo_comportamental', 'df9'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/gestao_bolsa_pesquisa/modelo_estrutural',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/gestao_bolsa_pesquisa/modelo_estrutural', 'af7'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/gestao_bolsa_pesquisa/requirements',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/gestao_bolsa_pesquisa/requirements', 'deb'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/importacao_editais/arquitetura',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/importacao_editais/arquitetura', 'c39'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/importacao_editais/casos-uso',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/importacao_editais/casos-uso', 'f3a'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/importacao_editais/minimundo',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/importacao_editais/minimundo', 'be3'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/importacao_editais/modelo-comportamental',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/importacao_editais/modelo-comportamental', '964'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/importacao_editais/modelo-estrutural',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/importacao_editais/modelo-estrutural', 'a5a'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/importacao_editais/processos/integracao_edital',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/importacao_editais/processos/integracao_edital', 'b81'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/importacao_editais/processos/integracao_edital_projeto',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/importacao_editais/processos/integracao_edital_projeto', '55e'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/importacao_editais/processos/integracao_projeto',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/importacao_editais/processos/integracao_projeto', 'a67'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/importacao_editais/prototipo_telas',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/importacao_editais/prototipo_telas', '3aa'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/importacao_editais/requisitos',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/importacao_editais/requisitos', 'ea2'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/intro',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/intro', 'da0'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/modalidade_bolsa/arquitetura',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/modalidade_bolsa/arquitetura', 'aa5'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/modalidade_bolsa/casos-uso',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/modalidade_bolsa/casos-uso', '482'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/modalidade_bolsa/minimundo',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/modalidade_bolsa/minimundo', '267'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/modalidade_bolsa/modelo-comportamental',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/modalidade_bolsa/modelo-comportamental', '57a'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/modalidade_bolsa/modelo-estrutural',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/modalidade_bolsa/modelo-estrutural', '07f'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/modalidade_bolsa/requisitos',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/modalidade_bolsa/requisitos', 'df2'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/pagamento_bolsista/casos_uso',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/pagamento_bolsista/casos_uso', 'b9b'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/pagamento_bolsista/minimundo',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/pagamento_bolsista/minimundo', '8c9'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/pagamento_bolsista/modelo_comportamental',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/pagamento_bolsista/modelo_comportamental', '0f7'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/pagamento_bolsista/modelo_estrutural',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/pagamento_bolsista/modelo_estrutural', '531'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/pagamento_bolsista/requirements',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/pagamento_bolsista/requirements', '06c'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/portal_fapes/diagramafluxo',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/portal_fapes/diagramafluxo', 'dd3'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/portal_fapes/introducao',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/portal_fapes/introducao', 'faf'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/portal_fapes/modeloestrutural',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/portal_fapes/modeloestrutural', '386'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/portal_fapes/requirements',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/portal_fapes/requirements', 'b23'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/modulos/portal_fapes/usecase',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/modulos/portal_fapes/usecase', '6a9'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/processosoftware/exemplo_documentacao_squad',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/processosoftware/exemplo_documentacao_squad', 'b53'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/processosoftware/modelostacy',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/processosoftware/modelostacy', 'c2f'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/processosoftware/processo_definir_design_sprint',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/processosoftware/processo_definir_design_sprint', 'e4c'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/processosoftware/processo_definir_produto_desenvolvido',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/processosoftware/processo_definir_produto_desenvolvido', '4ab'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/processosoftware/processo_desenvolvimento',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/processosoftware/processo_desenvolvimento', 'ed8'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/processosoftware/processo_mapear_processos',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/processosoftware/processo_mapear_processos', '6ac'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/processosoftware/visao_geral',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/processosoftware/visao_geral', '881'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/desenvolvimento/visaogeral/',
                component: ComponentCreator('/conectafapes-project/desenvolvimento/visaogeral/', 'f8f'),
                exact: true,
                sidebar: "desenvolvimento"
              },
              {
                path: '/conectafapes-project/devops/ambientes',
                component: ComponentCreator('/conectafapes-project/devops/ambientes', '773'),
                exact: true,
                sidebar: "devops"
              },
              {
                path: '/conectafapes-project/devops/intro',
                component: ComponentCreator('/conectafapes-project/devops/intro', '800'),
                exact: true,
                sidebar: "devops"
              },
              {
                path: '/conectafapes-project/gestao/data_driven/metricas',
                component: ComponentCreator('/conectafapes-project/gestao/data_driven/metricas', '09e'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/data_driven/tratamento-de-issues',
                component: ComponentCreator('/conectafapes-project/gestao/data_driven/tratamento-de-issues', '3c2'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/data_driven/visao_geral',
                component: ComponentCreator('/conectafapes-project/gestao/data_driven/visao_geral', '5d8'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/processogestaomacro',
                component: ComponentCreator('/conectafapes-project/gestao/processogestaomacro', 'e2c'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_capacitacao/aquisicao_talento',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_capacitacao/aquisicao_talento', '51a'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_capacitacao/visaogeral',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_capacitacao/visaogeral', '856'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_desenvolvimento/negocio/backlog_negocio',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_desenvolvimento/negocio/backlog_negocio', '2c9'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_desenvolvimento/negocio/controlar_recursos_projeto',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_desenvolvimento/negocio/controlar_recursos_projeto', '595'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_desenvolvimento/negocio/entrega_pagamento_bolsista',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_desenvolvimento/negocio/entrega_pagamento_bolsista', '21f'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_desenvolvimento/negocio/implementacao_bolsa',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_desenvolvimento/negocio/implementacao_bolsa', 'a2c'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_desenvolvimento/negocio/relatorio_analitico_leds-conectafapes',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_desenvolvimento/negocio/relatorio_analitico_leds-conectafapes', '626'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_desenvolvimento/negocio/stakeholders',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_desenvolvimento/negocio/stakeholders', '99b'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_desenvolvimento/plataforma/backlog_plataforma',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_desenvolvimento/plataforma/backlog_plataforma', '3cf'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_desenvolvimento/plataforma/geracao_codigo',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_desenvolvimento/plataforma/geracao_codigo', '621'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/gestao/trilha_pesquisa/visaogeral',
                component: ComponentCreator('/conectafapes-project/gestao/trilha_pesquisa/visaogeral', '584'),
                exact: true,
                sidebar: "gestao"
              },
              {
                path: '/conectafapes-project/processonegocio/as_is/gestao_edital/',
                component: ComponentCreator('/conectafapes-project/processonegocio/as_is/gestao_edital/', '6b4'),
                exact: true
              },
              {
                path: '/conectafapes-project/processonegocio/as_is/gestao_edital/conceber_edital',
                component: ComponentCreator('/conectafapes-project/processonegocio/as_is/gestao_edital/conceber_edital', '5a7'),
                exact: true
              },
              {
                path: '/conectafapes-project/processonegocio/as_is/gestao_edital/gerenciar_projetos',
                component: ComponentCreator('/conectafapes-project/processonegocio/as_is/gestao_edital/gerenciar_projetos', 'e16'),
                exact: true
              },
              {
                path: '/conectafapes-project/processonegocio/as_is/gestao_edital/submeter_contratar_propostas',
                component: ComponentCreator('/conectafapes-project/processonegocio/as_is/gestao_edital/submeter_contratar_propostas', 'b18'),
                exact: true
              },
              {
                path: '/conectafapes-project/processonegocio/intro',
                component: ComponentCreator('/conectafapes-project/processonegocio/intro', '56e'),
                exact: true
              },
              {
                path: '/conectafapes-project/processonegocio/to_be/gestao_edital/gestao_projetos/gerar_folha_de_pagamento',
                component: ComponentCreator('/conectafapes-project/processonegocio/to_be/gestao_edital/gestao_projetos/gerar_folha_de_pagamento', '434'),
                exact: true
              },
              {
                path: '/conectafapes-project/processonegocio/to_be/gestao_edital/gestao_projetos/incluir_bolsista',
                component: ComponentCreator('/conectafapes-project/processonegocio/to_be/gestao_edital/gestao_projetos/incluir_bolsista', '937'),
                exact: true
              },
              {
                path: '/conectafapes-project/qualidade/cypress/boas_praticas_cypress',
                component: ComponentCreator('/conectafapes-project/qualidade/cypress/boas_praticas_cypress', '190'),
                exact: true,
                sidebar: "qa"
              },
              {
                path: '/conectafapes-project/qualidade/cypress/padrao_scripts_cypress',
                component: ComponentCreator('/conectafapes-project/qualidade/cypress/padrao_scripts_cypress', 'bab'),
                exact: true,
                sidebar: "qa"
              },
              {
                path: '/conectafapes-project/qualidade/intro',
                component: ComponentCreator('/conectafapes-project/qualidade/intro', 'ea8'),
                exact: true,
                sidebar: "qa"
              },
              {
                path: '/conectafapes-project/qualidade/processos/boas-praticas-github',
                component: ComponentCreator('/conectafapes-project/qualidade/processos/boas-praticas-github', '726'),
                exact: true,
                sidebar: "qa"
              },
              {
                path: '/conectafapes-project/referencias/arquitetura/arquitetura',
                component: ComponentCreator('/conectafapes-project/referencias/arquitetura/arquitetura', '0cf'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/arquitetura/componentes_arquitetura',
                component: ComponentCreator('/conectafapes-project/referencias/arquitetura/componentes_arquitetura', '91e'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/arquitetura/conceitos',
                component: ComponentCreator('/conectafapes-project/referencias/arquitetura/conceitos', '2a6'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/arquitetura/tecnologias',
                component: ComponentCreator('/conectafapes-project/referencias/arquitetura/tecnologias', '16c'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/governo/acesso_cidadao',
                component: ComponentCreator('/conectafapes-project/referencias/governo/acesso_cidadao', 'f7d'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/governo/api_notificacao',
                component: ComponentCreator('/conectafapes-project/referencias/governo/api_notificacao', 'b58'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/governo/banestes',
                component: ComponentCreator('/conectafapes-project/referencias/governo/banestes', '417'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/governo/sigfapes',
                component: ComponentCreator('/conectafapes-project/referencias/governo/sigfapes', 'fab'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/intro',
                component: ComponentCreator('/conectafapes-project/referencias/intro', 'e9a'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/trilhas/roadmap-backend',
                component: ComponentCreator('/conectafapes-project/referencias/trilhas/roadmap-backend', 'fe0'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/trilhas/roadmap-frontend',
                component: ComponentCreator('/conectafapes-project/referencias/trilhas/roadmap-frontend', 'e85'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/tutoriais/dibb',
                component: ComponentCreator('/conectafapes-project/referencias/tutoriais/dibb', '1c8'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/tutoriais/escrita_issues',
                component: ComponentCreator('/conectafapes-project/referencias/tutoriais/escrita_issues', 'd56'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/tutoriais/integracao-acesso-cidadao',
                component: ComponentCreator('/conectafapes-project/referencias/tutoriais/integracao-acesso-cidadao', '134'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/tutoriais/intro',
                component: ComponentCreator('/conectafapes-project/referencias/tutoriais/intro', 'f85'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/tutoriais/less',
                component: ComponentCreator('/conectafapes-project/referencias/tutoriais/less', '6be'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/tutoriais/prompt',
                component: ComponentCreator('/conectafapes-project/referencias/tutoriais/prompt', '164'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/tutoriais/six_paper',
                component: ComponentCreator('/conectafapes-project/referencias/tutoriais/six_paper', 'b92'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/referencias/tutoriais/token-jwt-interno',
                component: ComponentCreator('/conectafapes-project/referencias/tutoriais/token-jwt-interno', '01d'),
                exact: true,
                sidebar: "referencias"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/banco_dados',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/banco_dados', '74e'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/descricao_geral',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/descricao_geral', '1bd'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/design_detalhado',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/design_detalhado', 'd91'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/diretrizes_design',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/diretrizes_design', 'de7'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/glossario',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/glossario', 'ff0'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/interfaces_externas',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/interfaces_externas', '218'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/introducao',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/introducao', '19a'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/plano_de_testes',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/plano_de_testes', '46d'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/requisitos_funcionais',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/requisitos_funcionais', '7fa'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/sdd_conecta_admin/seguranca',
                component: ComponentCreator('/conectafapes-project/sdd_conecta_admin/seguranca', '12d'),
                exact: true,
                sidebar: "sdd_conecta_admin"
              },
              {
                path: '/conectafapes-project/',
                component: ComponentCreator('/conectafapes-project/', '943'),
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
