# Design System

Este documento registra os padroes de design aplicados ao back-office do Conecta FAPES. O objetivo e manter consistencia visual, linguagem de produto e criterios de acessibilidade nas proximas evolucoes da interface.

## Principios

| Principio | Aplicacao |
|-----------|-----------|
| Clareza operacional | Telas administrativas devem priorizar leitura rapida, tarefas pendentes e proximas acoes. |
| Hierarquia visual | Conteudo principal vem primeiro; controles globais ficam em barras persistentes; informacoes secundarias ficam em cards ou paineis. |
| Densidade controlada | Interfaces de trabalho devem ser compactas, mas com espaco suficiente entre grupos para facilitar varredura visual. |
| Consistencia | Componentes equivalentes devem usar os mesmos tamanhos, raios, cores, estados e pesos tipograficos. |
| Acessibilidade | Controles com icones devem ter nome acessivel; foco de teclado deve ser visivel; cor nao deve ser o unico indicador de estado. |

As referencias conceituais sao Apple Human Interface Guidelines e Microsoft Fluent 2: layout adaptavel, hierarquia clara, materiais/superficies, elevacao consistente, tipografia legivel e estados de interacao previsiveis.

## Base Tecnologica e Referencias

O design system do Conecta FAPES adota **Nuxt UI** como referencia de biblioteca de componentes para os portais em Nuxt/Vue, combinada com **Tailwind CSS** e tokens proprios do produto. Mesmo quando um prototipo estiver implementado em outra stack, como o back-office atual em React/Vite, os padroes visuais devem seguir a mesma linguagem para preservar consistencia entre produtos.

| Referencia | Uso no Conecta FAPES |
|------------|----------------------|
| Nuxt UI | Componentes de base, estados, densidade, tokens e composicao para portais Nuxt/Vue. |
| Tailwind CSS | Utilitarios de layout, espacamento, responsividade e aplicacao dos tokens. |
| Apple Human Interface Guidelines | Clareza, hierarquia, espaco, foco na tarefa, adaptabilidade e familiaridade com plataformas Apple. |
| Microsoft Fluent 2 | Superficies, elevacao, tipografia, estados de interacao, acessibilidade e padroes de produtividade administrativa. |
| Tokens Conecta FAPES | Cores, raios, sombras, tipografia e semantica de estados especificos do produto. |

### Como combinar as referencias

- **Nuxt UI** define o ponto de partida dos componentes: botoes, formularios, modais, menus, tabelas, badges e navegacao.
- **Apple HIG** orienta clareza, agrupamento, foco visual e adaptacao a diferentes tamanhos de tela.
- **Microsoft Fluent 2** orienta interfaces administrativas: produtividade, densidade organizada, elevacao, estados, acessibilidade e uso consistente de superficies.
- **Tokens Conecta FAPES** adaptam essas referencias para a marca, a linguagem institucional e os dominios do produto.

Quando houver conflito entre uma referencia generica e a necessidade operacional do produto, prevalece a clareza da tarefa do usuario.

## Linguagem de Produto

Usar a terminologia abaixo em textos de interface, menus, cards e avisos:

| Usar | Evitar | Contexto |
|------|--------|----------|
| Captacao | Edital como area de menu | Area de configuracao, publicacao, submissao e triagem de oportunidades. |
| Captacoes | Editais | Listas, indicadores e pendencias relacionadas a chamadas em andamento. |
| Iniciativa | Projeto | Unidade apoiada/acompanhada pela plataforma. |
| Iniciativas | Projetos | Indicadores, filtros, avaliacoes e prestacao de contas. |
| Analise de bolsas | Avaliacao de bolsa sem contexto | Fila operacional de enquadramento, documentos, renovacoes e pareceres. |

Quando um termo juridico ou documental exigir "edital" ou "projeto", ele pode aparecer no conteudo especifico do documento, mas nao deve nomear a navegacao principal do produto.

## Estrutura do Shell

O back-office usa uma estrutura persistente:

- Sidebar lateral para navegacao primaria.
- Barra superior para marca institucional FAPES e controles globais.
- Conteudo principal com largura controlada e cards organizados por prioridade.

Padroes aplicados:

| Elemento | Padrao |
|----------|--------|
| Sidebar recolhida | Icones com `aria-label` e estados ativos visiveis. |
| Sidebar expandida | Icone + texto, agrupados por dominio operacional. |
| Topbar | Logo FAPES a esquerda; configuracoes, notificacoes, idioma e usuario a direita. |
| Dashboard inicial | Indicadores no topo, area de controle operacional, trabalho prioritario e acessos rapidos. |

## Dashboard Operacional

A tela inicial deve responder rapidamente a tres perguntas:

1. O que esta pendente?
2. Onde ha risco de prazo ou SLA?
3. Qual acao o usuario deve tomar agora?

Blocos atuais:

| Bloco | Conteudo |
|-------|----------|
| Indicadores | Captacoes em andamento, parcerias ativas, pagamentos em validacao e pendencias criticas. |
| Area de controle operacional | Analise de bolsas, processos de captacao e avisos de avaliacao. |
| Trabalho prioritario | Fila curta de itens que exigem decisao ou revisao. |
| Acessos rapidos | Atalhos para programas, parcerias, instituicoes e configuracoes. |

## Tipografia

Usar fonte nativa do sistema para desempenho e familiaridade:

```css
Inter, "Segoe UI", -apple-system, BlinkMacSystemFont, "SF Pro Text", Roboto, Arial, sans-serif
```

Diretrizes:

| Uso | Tamanho recomendado | Peso |
|-----|---------------------|------|
| Titulo de pagina | 32px | 600 |
| Titulo de secao | 20px | 600 |
| Titulo de card | 14px a 16px | 600-700 |
| Corpo | 14px a 16px | 400 |
| Metadados | 11px a 13px | 400-600 |

Evitar caixa alta em blocos longos. Usar caixa alta apenas em rotulos curtos de secao quando houver ganho de escaneabilidade.

## Cores

As cores devem reforcar hierarquia e estado, nao decorar sem funcao.

| Papel | Cor |
|-------|-----|
| Fundo escuro | `#0b1222` |
| Superficie escura | `rgba(255, 255, 255, 0.055)` |
| Borda escura | `rgba(255, 255, 255, 0.12)` |
| Acao primaria | `#00c1af` |
| Marca secundaria | `#4f6fce` |
| Critico | `#ef4444` |
| Atencao | `#f59e0b` |
| Informativo | `#3b82f6` |

Estados criticos devem combinar cor, texto e/ou icone. Nunca depender apenas da cor.

## Superficies e Elevacao

Usar elevacao para indicar camada e importancia:

| Uso | Tratamento |
|-----|------------|
| Cards de dashboard | Fundo de superficie, borda sutil e sombra baixa. |
| Topbar/sidebar | Superficie persistente com blur leve e borda divisoria. |
| Dropdowns e paineis | Fundo elevado, borda e sombra mais forte. |
| Botao primario | Cor primaria, contraste alto e sombra discreta. |

Cards devem ter raio de `8px` ou menor, salvo componentes existentes que exijam outro padrao.

## Componentes

| Componente | Padrao |
|------------|--------|
| Botao primario | Fundo `#00c1af`, texto escuro, icone opcional a esquerda. |
| Botao secundario | Fundo de superficie, borda sutil e texto primario. |
| Card de indicador | Icone, label, valor grande e metadado curto. |
| Lista operacional | Linha clicavel com indicador de severidade, titulo, metadado e contador. |
| Aviso/SLA | Badge compacto com texto claro e cor semantica. |
| Menu de icones | Sempre com `aria-label`; tooltip pode ser adicionado quando houver interacao hover. |

## Acessibilidade

Checklist minimo para novas telas:

- Botao com icone sem texto deve ter `aria-label`.
- Ordem de leitura deve seguir topo-esquerda para baixo-direita.
- Foco por teclado deve ser visivel.
- Contraste de texto normal deve mirar pelo menos 4.5:1.
- Estados como erro, alerta e sucesso devem usar cor + texto/icone.
- Textos de cards e botoes nao podem quebrar layout em viewport desktop ou mobile.

## Arquivos de Referencia

| Area | Arquivo |
|------|---------|
| Login | `prototype/backoffice/src/app/components/Login.tsx` |
| Shell e dashboard | `prototype/backoffice/src/app/components/Dashboard.tsx` |
| Tokens globais | `prototype/backoffice/src/styles/theme.css` |
| Assets de marca | `prototype/backoffice/src/assets/` |
