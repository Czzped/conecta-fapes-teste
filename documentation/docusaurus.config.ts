import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'ConectaFapes Docs',
  favicon: 'img/favicon.ico',

  url: 'https://leds-conectafapes.com/',
  baseUrl: '/conectafapes-project/',

  organizationName: 'leds-conectafapes',
  projectName: 'conectafapes-project',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  markdown: {
    mermaid: true,
  
  },
  themes: ['@docusaurus/theme-mermaid'],
  plugins: [
    require.resolve('docusaurus-lunr-search'),    
  ],


  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          breadcrumbs: true,          
          showLastUpdateTime: true, 
          includeCurrentVersion:true,   
          docsRootComponent: '@theme/DocsRoot',
          docVersionRootComponent: '@theme/DocVersionRoot',
          docRootComponent: '@theme/DocRoot',
          docItemComponent: '@theme/DocItem',  
          routeBasePath: '/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        
      } satisfies Preset.Options,
      
    ],
  ],

  themeConfig: {

    footer: {

      style: 'light',      
    copyright: `
    <div style="display: flex; align-items: center; justify-content: center;">
      <img src="/img/leds.png" alt="Powered by LEDS" style="height: 24px; margin-right: 8px;" />
      <span>Copyright © ${new Date().getFullYear()}. Powered by <a href="https://www.instagram.com/ledsifes/">LEDS</a>, created with Docusaurus.</span>
    </div>
  `,

    },

    mermaid: {
      options: {
        fontSize: 18,
      },
    },

    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      }
    },

    image: 'img/leds-social-card.jpg',
    navbar: {
      title: 'Documentação ',
      logo: {
        src: 'img/fapes1.svg',
      },

      items: [
         {
          type: 'docSidebar',
          sidebarId: 'administrativo',
          position: 'left',
          label: 'Administrativo',
        },
        {
          type: 'docSidebar',
          sidebarId: 'desenvolvimento',
          position: 'left',
          label: 'Desenvolvimento',
        }, 
        {
          type: 'docSidebar',
          sidebarId: 'gestao',
          position: 'left',
          label: 'Gestão',
        },
        {
          type: 'dropdown',
          label: 'Módulos',          
          position: 'left',
          items: [
              {
                type: 'doc',
                label: 'M001 - Modalidades de Bolsa',
                docId: 'desenvolvimento/modulos/modalidade_bolsa/minimundo',
              },
              {
                type: 'doc',
                label: 'M002 - Importação de Editais',
                docId: 'desenvolvimento/modulos/importacao_editais/minimundo',
              },
              {
                type: 'doc',
                label: 'M003 - Gerenciar Editais',
                docId: 'desenvolvimento/modulos/gerenciar_editais/minimundo'
              },
              {
                type: 'doc',
                label: 'M004 - Pagamento de Bolsistas',
                docId: 'desenvolvimento/modulos/pagamento_bolsista/minimundo'
              },
              {
                type: 'doc',
                label: 'M005 - Autenticação, Autorização e Auditoria',
                docId: 'desenvolvimento/modulos/autenticacao/minimundo'
              },
              {
                type: 'doc',
                label: 'M006 - Portal do ConectaFapes',
                docId: 'desenvolvimento/modulos/portal_fapes/introducao'
              }
            ],
        },
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'processonegocio',
        //   position: 'left',
        //   label: 'Processo de Negócio',
        // }, 
        {
            type: 'docSidebar',
            sidebarId: 'referencias',
            position: 'left',
            label: 'Referências',
        },       
        {
          type: 'dropdown',
          label: 'SDD',          
          position: 'left',
          items: [
            {
              type: 'doc',
              label: 'Conecta Fapes',
              docId: 'sdd_conecta_admin/introducao'              
            }, 
          ],
        },
        {
          type: 'dropdown',
          label: 'Times',          
          position: 'left',
          items: [
              {
                type: 'doc',
                label: 'BI',
                docId: 'bi/visao_geral',
              },
              {
                type: 'doc',
                docId: 'colatina/intro',
                label: 'Colatina',
              },
              {
                type: 'doc',
                label: 'DevOps',
                docId: 'devops/intro',
              },
              {
                type: 'doc',
                docId: 'qualidade/intro',
                label: 'QA',
              },
            ],
        },
        {
          href: 'https://gitlab.com/ledsifes',
          label: 'Github',
          position: 'right',
        },
      ],
    },
  },
};

export default config;