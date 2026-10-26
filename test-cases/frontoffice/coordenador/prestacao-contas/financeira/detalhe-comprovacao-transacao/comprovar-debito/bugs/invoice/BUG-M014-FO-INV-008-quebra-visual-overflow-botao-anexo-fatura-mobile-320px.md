## Título
[Bug] Quebra visual e transbordo (overflow) do botão 'Anexar fatura do cartão' sobre as bordas do container de upload em resolução mobile de 320px

## ID
BUG-M014-FO-INV-008

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Seção 2 (Anexar Arquivos do Invoice / Comprovante da fatura do cartão)**
- Regra Canônica: M014: `RN05` (Inclusão e comprovação de despesa via invoice com anexo opcional de fatura de cartão de crédito) / Padrão de Design Responsivo e Mobile-First do Frontoffice (Critério WCAG 2.1 - 1.4.10 Reflow)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #4 (Consistência e Padrões)**: Falha de consistência no encapsulamento visual de componentes de upload; enquanto o container superior (`Anexar Arquivos do Invoice`) acomoda seu botão com margens confortáveis, o container de fatura quebra suas bordas em 320px.
  - **Heurística #8 (Design Estético e Minimalista)**: O botão de ação vaza para fora das linhas tracejadas da caixa de upload (`overflow`), gerando ruído visual e quebra de acabamento estético em smartphones compactos.
- Casos de Teste Relacionados:
  - `CT-M014-FO-074` (Ativar e anexar comprovante da fatura do cartão)
  - `CT-M014-FO-023` (Validar layout responsivo da listagem e formulários em dispositivos móveis)
  - `CT-M014-FO-086` (Validar fatura de cartão inválida)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Dropzone `Comprovante da fatura do cartão` / Botão `Anexar fatura do cartão`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Mobile Viewport (Responsive 320px × 949px - padrão iPhone SE / Mobile Small) / Chrome DevTools Mobile Emulation / Frontoffice Vue-Nuxt UI em Homologação

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [ ] 🟡 Média  [x] 🟢 Baixa

## Passo a Passo
1. Acessar o sistema com perfil de Coordenador no Ambiente de Homologação.
2. Navegar até o extrato em `/coordenador/financeira` e abrir a comprovação de uma transação com modalidade Invoice em `/coordenador/prestacao-financeira/detalhes/:paymentId`.
3. Abrir as Ferramentas de Desenvolvedor (`F12`) e ativar a emulação mobile com largura de `320px` (ex.: `320px × 949px`).
4. Na seção `2. Anexar Arquivos do Invoice`, marcar o checkbox `Deseja enviar o comprovante da fatura do cartão?`.
5. Observar a exibição da área de upload delimitada por borda tracejada (`Comprovante da fatura do cartão`).
6. Constatar que o botão `Anexar fatura do cartão` é mais largo que a área interna útil do contêiner, transbordando horizontalmente e sobrepondo as bordas tracejadas esquerda e direita.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Seção: `2. Anexar Arquivos do Invoice`
- Checkbox acionado: `[x] Deseja enviar o comprovante da fatura do cartão?`
- Resolução testada: `320px × 949px` (Mobile Small)
- Elemento com falha: Botão `[clip] Anexar fatura do cartão` dentro da dropzone tracejada

## Comportamento Esperado
- Em qualquer resolução mobile (incluindo telas compactas de `320px`), o botão `Anexar fatura do cartão` deve permanecer totalmente contido dentro do contêiner tracejado de dropzone:
  - O botão deve respeitar as margens internas (`padding`) da caixa tracejada sem vazar para fora das bordas laterais.
  - A largura do botão deve ajustar-se dinamicamente (`max-width: 100%`) com redução proporcional de padding ou tamanho de fonte caso necessário.

## Comportamento Atual
- Em resolução de `320px`, o botão `Anexar fatura do cartão` excede a largura disponível dentro da dropzone tracejada:
  - As bordas laterais do botão (esquerda e direita) cruzam e sobrepõem diretamente as linhas tracejadas delimitadoras do contêiner.
  - O elemento não possui contenção de largura adaptativa (`max-width: 100%`), provocando quebra visual de layout e aspecto desalinhado.

## Evidências
- 📷 **Quebra visual e transbordo (overflow) do botão 'Anexar fatura do cartão' sobre as bordas do container em 320px:**
  ![Quebra Visual Anexo Fatura 320px](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/invoice/evidencias-BUG-INV-008-01-quebra-visual-anexo-fatura-320px.png)

## Sugestão de Investigação
- Inspecionar as classes CSS/Tailwind aplicadas ao contêiner de upload e ao botão em `ComprovarDebito.vue` (ou componente filho de upload de fatura):
  - No botão `Anexar fatura do cartão`, aplicar `max-w-full w-auto` ou `w-full` com `px-3` para evitar tamanho horizontal fixo que ultrapasse o elemento pai.
  - No contêiner tracejado, revisar se os paddings laterais (`p-4` ou `px-6`) não estão estrangulando o espaço interno disponível a ponto de forçar o overflow do botão em viewports de `320px`.
  - Avaliar a redução do tamanho da tipografia do botão para `text-xs sm:text-sm` em telas pequenas.
