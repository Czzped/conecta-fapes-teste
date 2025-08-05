import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'ConectaFapes Docs',
  favicon: 'img/favicon.ico',

  url: 'https://ledsifes.gitlab.io/',
  baseUrl: '/conectafapes-project/',
  organizationName: 'leds-conectafapes', 
  projectName: 'Conecta Fapes',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  onDuplicateRoutes: 'warn',
  staticDirectories: ['static'],

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  
  plugins: [
    require.resolve('docusaurus-lunr-search'),    
  ],

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
      copyright:'Copyright © 2025. Desenvolvido por <a href=\"https://www.instagram.com/ledsifes/\">LEDS</a>, utilizando o Docusaurus.',
    },

    mermaid: {
      options: {
        fontSize: 18,
      },
    },

    docs: {
      sidebar: {
        autoCollapseCategories: true,
      }
    },

    image: 'img/leds-social-card.jpg',
    navbar: {
      title: 'Home',
      logo: {
        src: 'img/fapes1.svg',
      },

      items: [
        {
          type: 'docSidebar',
          sidebarId: 'gestao',
          position: 'left',
          label: 'Gestão',
        },
        {
          type: 'docSidebar',
          sidebarId: 'modulos',
          label: 'Módulos',          
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'desenvolvimento',
          position: 'left',
          label: 'Processos de Desenvolvimento',
        }, 
        {
            type: 'docSidebar',
            sidebarId: 'referencias',
            position: 'left',
            label: 'Referências',
        },       
        {
          type: 'dropdown',
          label: 'Software Design Documentation',          
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
          href: 'https://gitlab.com/ledsifes',
          label: 'Github',
          position: 'right',
        },
      ],
    },
  },
};

export default config;