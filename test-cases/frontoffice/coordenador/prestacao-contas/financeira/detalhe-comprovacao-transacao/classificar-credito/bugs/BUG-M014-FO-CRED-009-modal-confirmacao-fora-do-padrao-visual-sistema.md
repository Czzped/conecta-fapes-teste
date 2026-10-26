## Título
[Bug] Modal de Confirmação de envio fora do padrão visual do sistema (presença de linha indevida, ausência de ícone de alerta e cor de fundo divergente)

## ID
BUG-M014-FO-CRED-009

## Requisito/Regra Violada
- Fluxo/Contexto: Prestação de Contas > Financeira > **Classificar Crédito** (`/coordenador/prestacao-financeira/classificar-credito/:paymentId`)
- Regras Canônicas / Padrões de Interface:
  - M014: `RN10` (Confirmação antes do envio e bloqueio de edição)
  - Padrão de Design System do Frontoffice Conecta FAPES (Componente Modal de Diálogo e Confirmação de Ações)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #4 (Consistência e Padrões)**: A modal de confirmação diverge da identidade visual estabelecida para os demais modais do sistema, os quais não possuem linha divisória, possuem ícone de alerta ao lado do título e seguem o token de cor de superfície padrão da aplicação.
  - **Heurística #8 (Design Estético e Minimalista)**: Presença de linha separadora desnecessária e contraste de fundo preto sólido desarmônico com a paleta do frontoffice.
- Casos de Teste Relacionados:
  - `CT-M014-FO-134` (Validar padrão visual, anatomia e elementos da modal de confirmação de envio da classificação de crédito)
  - `CT-M014-FO-036` (Enviar classificação de crédito com sucesso)
- Rota/Componente: `/coordenador/prestacao-financeira/classificar-credito/:paymentId` (`ClassificarCredito.vue` / Modal de Confirmação de Envio)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Google Chrome / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [ ] 🟡 Média  [x] 🟢 Baixa

## Passo a Passo
1. Acessar o sistema com perfil de `coordenador` no ambiente de Homologação.
2. Navegar até `Prestação de Contas > Financeira` e clicar em um lançamento de crédito pendente (`/coordenador/prestacao-financeira/classificar-credito/:paymentId`).
3. Preencher os dados obrigatórios da classificação (ex.: `Estorno` com débito associado ou `Devolução` com descrição).
4. Clicar no botão `Enviar` no rodapé da página.
5. Observar a modal de confirmação *"Tem certeza que deseja enviar as informações?"* exibida no centro da tela.
6. Notar a presença de linha divisória horizontal sobre os botões de ação, a ausência de ícone de alerta junto ao título e a cor de fundo preto sólido divergente do padrão.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/classificar-credito/:paymentId`
- Modal inspecionada: Modal de confirmação *"Tem certeza que deseja enviar as informações?"*
- Ação disparadora: Clique no botão `Enviar`

## Comportamento Esperado
- A modal de confirmação deve seguir estritamente o padrão de design do Conecta FAPES:
  1. **Remover a linha divisória:** Não deve haver linha separadora horizontal acima dos botões de ação (`Cancelar` e `Enviar`).
  2. **Incluir ícone de alerta:** Exibir um ícone de alerta (ex.: `AlertTriangle` / `AlertCircle` ou `icon button` de advertência) posicionado ao lado do título *"Tem certeza que deseja enviar as informações?"*.
  3. **Ajustar cor de fundo:** A cor de fundo da modal deve utilizar a cor de superfície padronizada do tema (Design System / dark mode do frontoffice), sem utilizar preto sólido despadronizado.

## Comportamento Atual
- A modal apresenta uma linha divisória horizontal separando o corpo do texto da área dos botões de ação.
- O título da modal não possui nenhum ícone de alerta associado.
- A cor de fundo da modal é preta sólida (`#000000` / `#121212`), destoando visualmente dos outros cards e modais da aplicação.

## Evidências
- 📷 **Modal de Confirmação exibindo linha indevida, ausência de ícone de alerta e fundo escuro divergente:**
  ![Modal de confirmação fora do padrão](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/classificar-credito/bugs/evidencias-BUG-CRED-009-01-modal-fora-padrao.png)

## Sugestão de Investigação
- Inspecionar a declaração da modal em `ClassificarCredito.vue` (ou componente filho de confirmação):
  - Retirar classes de borda divisória (ex.: `border-t`, `border-zinc-800` ou tags `<hr />` que separem o footer dos botões).
  - Inserir o componente de ícone de alerta no header da modal ao lado da tag do título (`<h3 class="...">`).
  - Atualizar a classe de background do container da modal para utilizar o token de superfície padrão do Design System (ex.: `bg-card`, `bg-[#1e1e1e]` ou variável semântica de tema).
