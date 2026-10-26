## Título
[Bug] Baixo contraste e leiturabilidade comprometida no texto da mensagem informativa de Invoice (deve seguir Preto em LightMode e Branco em DarkMode)

## ID
BUG-M014-FO-INV-009

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Seção 1 (Informações Gerais - Banner informativo da modalidade Invoice)**
- Regra Canônica / Padrões de Acessibilidade:
  - M014: `RN05` (Inclusão e comprovação de despesa internacional via Invoice)
  - Critério WCAG 2.1 — 1.4.3 Contraste Mínimo (Nível AA - taxa mínima de contraste de 4.5:1 para texto normal)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #8 (Design Estético e Minimalista)**: O texto das orientações do Invoice apresenta contraste insuficiente com o fundo do banner, forçando a vista do usuário e prejudicando a clareza das instruções.
  - **Heurística #4 (Consistência e Padrões)**: O texto interno do banner deve acompanhar a semântica de cores tipográficas padrão da aplicação (`text-foreground`).
- Casos de Teste Relacionados:
  - `CT-M014-FO-135` (Validar contraste, leiturabilidade e cores de texto da mensagem informativa de Invoice em Light e Dark Mode)
  - `CT-M014-FO-071` (Selecionar tipo de documento Invoice (Pagamento Internacional) na comprovação de débito)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Banner informativo de orientações da modalidade Invoice)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Desktop / Google Chrome / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [ ] 🟡 Média  [x] 🟢 Baixa

## Passo a Passo
1. Acessar o sistema com perfil de `coordenador` no ambiente de Homologação.
2. Acessar o extrato em `Prestação de Contas > Financeiro` e abrir uma transação de débito pendente (`/coordenador/prestacao-financeira/detalhes/:paymentId`).
3. Na seção `1. Informações Gerais *`, selecionar a opção `Invoice (Pagamento Internacional)` no dropdown `Documento`.
4. Observar a caixa/banner informativo exibido logo abaixo do seletor.
5. Inspecionar a cor e a leiturabilidade do texto explicativo (*"Envie o comprovante de pagamento (Invoice)..."*).

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Documento selecionado: `Invoice (Pagamento Internacional)`
- Elemento inspecionado: Caixa/banner informativo azul com instruções sobre Invoice e fatura de cartão

## Comportamento Esperado
- Para assegurar máxima leiturabilidade e conformidade com critérios de acessibilidade, o texto dentro da mensagem informativa deve adotar a cor padrão do texto da tela:
  - **Preto em Light Mode** (`text-black` / `text-zinc-900` ou token `text-foreground`).
  - **Branco em Dark Mode** (`text-white` / `text-zinc-100` ou token `text-foreground`).
- O texto não deve utilizar tom azulado de baixo contraste sobre o fundo escuro do container.

## Comportamento Atual
- O texto interno da mensagem informativa está estilizado com uma cor azul esmaecida de baixo contraste, dificultando a leitura sobre o fundo escuro da caixa (especialmente no Dark Mode) e exigindo esforço visual desnecessário do coordenador para ler instruções críticas de comprovação.

## Evidências
- 📷 **Texto da mensagem informativa com baixo contraste e legibilidade prejudicada:**
  ![Baixo contraste texto mensagem informativa Invoice](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/invoice/evidencias-BUG-INV-009-01-contraste-texto-informativo.png)

## Sugestão de Investigação
- No componente que renderiza o banner informativo de Invoice em `ComprovarDebito.vue`:
  - Substituir a classe de cor estática do texto (ex.: `text-blue-400`, `text-sky-300`) por classes adaptativas ao tema: `text-zinc-900 dark:text-white` ou a variável semântica de tipografia `text-foreground`.
