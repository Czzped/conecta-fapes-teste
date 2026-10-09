## Título
[Bug] Falha de responsividade, quebra de layout e sobreposição de elementos nos cards da Seção 2 (Nota Fiscal) em resoluções mobile abaixo de 320px

## ID
BUG-M014-FO-NF-024

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Seção 2 (Adicionar Descrição e Anexar Nota Fiscal / Cards de Documento Fiscal Anexado)**
- Regra Canônica: M014: `RN06` / `RN07` / Padrão de Design Responsivo e Diretrizes Mobile-First do Frontoffice (Critério WCAG 1.4.10 - Reflow)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #4 (Consistência e Padrões)**: Falha de adaptação do layout do card em dispositivos móveis estreitos (resoluções abaixo de 320px, como telas compactas ou dispositivos dobráveis em modo fechado).
  - **Heurística #8 (Design Estético e Minimalista)**: Colisão visual severa onde a barra de ações com 5 botões (`Visualizar`, `Recarregar`, `Editar`, `Excluir` e `Expandir`) sobrepõe o rótulo `Emitente`, causando truncamento agressivo da razão social para duas letras (`LE...`, `FA...`) e quebra palavra por palavra do rótulo `Chave de Acesso` empilhado verticalmente.
  - **Heurística #5 (Prevenção de Erros)**: O agrupamento comprimido dos ícones de ação em viewport estreita sobrepõe áreas de clique e toque (touch targets), aumentando expressivamente o risco de toques acidentais em ações críticas ou destrutivas (como o botão de lixeira para exclusão da nota fiscal).
- Casos de Teste Relacionados:
  - `CT-M014-FO-023` (Validar responsividade mobile da prestação financeira)
  - `CT-M014-FO-040` (Verificar informações extraídas da NFe)
  - `CT-M014-FO-010` (Validar envio e exibição de nota fiscal)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / `NotaFiscalCard.vue` / Cabeçalho do Card de Nota Fiscal Anexada)

## Ambiente
[ ] Produção  [x] Staging  [ ] Homologação

## Dispositivo/SO
Mobile Viewport (< 320px, ex.: 280px–319px) / Chrome DevTools Mobile Emulation / Frontoffice Vue-Nuxt UI em `https://stage.conectafapes.leds.dev.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o sistema com perfil de Coordenador no ambiente de Staging (`https://stage.conectafapes.leds.dev.br`).
2. Navegar até o extrato em `/coordenador/financeira` e abrir a comprovação de uma transação de débito em `/coordenador/prestacao-financeira/detalhes/:paymentId`.
3. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, anexar uma ou mais Notas Fiscais eletrônicas (ou acessar uma transação com notas já anexadas).
4. Abrir as Ferramentas de Desenvolvedor (`F12`) e ativar a emulação de dispositivos móveis (Device Toolbar).
5. Reduzir a largura da viewport para resoluções abaixo de `320px` (ex.: `280px` a `300px`, padrão de dispositivos compactos / telas dobráveis).
6. Inspecionar o cabeçalho e a organização dos dados nos cards de Nota Fiscal anexada na Seção 2.
7. Observar a sobreposição dos botões de ação sobre o texto `Emitente`, a quebra vertical fragmentada do rótulo `Chave de Acesso` e o truncamento excessivo dos dados fiscais.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Seção: `2. Adicionar Descrição e Anexar Nota Fiscal *`
- Cards afetados: Cards de Nota Fiscal Anexada (`Nota 1 de 2` e `Nota 2 de 2`)
- Resoluções testadas: Viewport Mobile com largura `< 320px` (ex.: `280px × 653px`)
- Elementos afetados:
  - Rótulo `Emitente` e Razão Social (`LE...`, `FA...`)
  - Barra de ações superior direita: Ícones de visualização (olho), refresh, edição (lápis), exclusão (lixeira) e chevron
  - Rótulo e valor de `Chave de Acesso` (`41...`, `32...`)

## Comportamento Esperado
- Em resoluções móveis reduzidas (inclusive `< 320px`), o card de Nota Fiscal deve reorganizar seus elementos de forma fluida e adaptável (Mobile-First):
  - A barra de ações (ícones de visualizar, recarregar, editar, excluir e expandir) deve quebrar para uma linha própria ou posicionar-se abaixo dos dados do emitente com espaçamento adequado (`flex-wrap: wrap`), sem invadir nem sobrepor os rótulos textuais.
  - O rótulo `Emitente` e a razão social devem dispor de espaço horizontal suficiente para exibição legível, evitando truncamento extremo para apenas duas letras.
  - O rótulo `Chave de Acesso` deve manter formatação coesa sem quebras de linha palavra por palavra (`Chave` / `de` / `Acesso`), e seu valor deve utilizar quebra de linha inteligente ou truncamento proporcional no meio/fim.
  - Os touch targets dos botões de ação devem respeitar dimensões mínimas sem risco de toques acidentais sobrepostos.

## Comportamento Atual
- A Seção 2 não possui regras de responsividade adequadas para viewports abaixo de 320px, apresentando quebra severa de layout:
  - **Sobreposição de ações sobre texto**: A barra de ícones de ação (`[olho]`, `[refresh]`, `[lápis]`, `[lixeira]`, `[chevron]`) colide diretamente sobre o rótulo `Emitente`, sobrepondo o ícone de olho em cima da palavra e tornando a leitura confusa.
  - **Truncamento extremo do Emitente**: A razão social do fornecedor é cortada quase que integralmente, mostrando apenas as duas primeiras letras seguidas de reticências (`LE...` e `FA...`).
  - **Quebra vertical monopalavra em Chave de Acesso**: O rótulo sofre quebra linha a linha (`Chave` \n `de` \n `Acesso`), e a chave numérica é comprimida a ponto de exibir apenas os dois dígitos iniciais (`41...` e `32...`).
  - **Conflito de áreas de toque**: O agrupamento espremido dos 5 ícones cria zonas de clique extremamente próximas e sobrepostas, facilitando o acionamento indevido de exclusão ou edição no mobile.

## Evidências
- 📷 **Quebra de layout e sobreposição dos ícones sobre o Emitente nos cards da Seção 2 abaixo de 320px:**
  ![Quebra de Responsividade Mobile 320px](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-024-01-quebra-responsividade-mobile-320px.png)

## Sugestão de Investigação
- Inspecionar a estrutura CSS/Tailwind do cabeçalho do card em `NotaFiscalCard.vue` (ou componente equivalente de resumo do documento fiscal):
  - No contêiner flex do cabeçalho, permitir flexão em múltiplas linhas (`flex-wrap: wrap`) ou utilizar media query/container query para empilhar os metadados (`Emitente`, `Chave de Acesso`, `Valor`) e a barra de ações em linhas separadas quando a largura for inferior a `360px` / `320px`.
  - Definir largura mínima e truncamento adequado para o texto do emitente (`min-width: 0`, `truncate` com `title` acessível via tooltip).
  - Garantir `white-space: nowrap` no rótulo `Chave de Acesso` e ajustar a exibição do hash/chave para quebrar em blocos ou exibir formato condensado padronizado (ex.: `41...9880`).
  - Assegurar área de toque mínima acessível de `44px x 44px` ou `36px x 36px` com espaçamento entre os ícones de ação no mobile.
