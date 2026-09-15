## Título
[Bug] Ícone de exclusão de anexo da Nota Fiscal gera erro ao confirmar edição, não remove a Seção 3 e mantém o arquivo após reload

## ID
BUG-M014-FO-NF-012

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — Tipo de Documento: **Nota Fiscal**
- Regra Canônica: M014: `RN05` / `RI-NFE01` (Integridade da edição e remoção do `DocumentoFiscal` vinculado à `JustificativaDespesa`) / `RN07` (Associação de itens da compra à categoria do Edital — a Seção 3 deve depender estritamente da existência e consistência do anexo de Nota Fiscal)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #4 (Consistência e Padrões)**: Coexistência de dois elementos redundantes para manipulação do anexo ("Trocar nota fiscal" e o ícone de exclusão `✕`), onde um opera parcialmente e o outro quebra o fluxo com erro.
  - **Heurística #3 (Controle e Liberdade do Usuário)**: O usuário tenta excluir a nota fiscal anexada pelo controle direto do arquivo (`✕`), mas o sistema impede a ação e não persiste a remoção.
  - **Heurística #9 (Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros)**: Disparo de toast impeditivo *"Erro ao editar nota fiscal - Anexe a nota fiscal antes de prosseguir."* que não permite confirmar a exclusão sem reanexar outro arquivo imediatamente.
- Caso de Teste Relacionado: `CT-M014-FO-039` / `CT-M014-FO-103` (Edição e exclusão de arquivo da nota fiscal)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `2. Adicionar Descrição e Anexar Nota Fiscal *` e Seção `3. Associar Compra *`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar uma comprovação de débito com nota fiscal previamente anexada e confirmada (com a Seção `3. Associar Compra *` já gerada com base nos itens da NF-e).
2. Na Seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, observar que foi adicionado o botão *"Trocar nota fiscal"*, mas o ícone de exclusão (`✕`) permanece presente no card do arquivo anexado.
3. Clicar no botão de edição da Seção 2 para liberar as alterações.
4. Clicar no ícone de exclusão (`✕`) do arquivo de nota fiscal anexado.
5. Clicar no botão ciano *"Confirmar edição"*.
6. Observar o toast de erro exibido na tela: *"Erro ao editar nota fiscal: Anexe a nota fiscal antes de prosseguir."*.
7. Notar que a Seção `3. Associar Compra *` não é excluída nem ocultada, permanecendo renderizada abaixo.
8. Recarregar a página (`F5`).
9. Constatar que a nota fiscal que havia sido excluída continua anexada e confirmada na interface, demonstrando que a remoção não persistiu.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Ação executada: Modo de edição da Seção 2 → Clique no ícone `✕` do anexo de NF-e → Clique em *"Confirmar edição"*

## Comportamento Esperado
- Ao remover o anexo de nota fiscal utilizando o ícone de exclusão (`✕`) e acionar *"Confirmar edição"*:
  - O sistema deve processar a exclusão sem apresentar erro de validação impeditivo exigindo anexo prévio imediato.
  - A Seção `3. Associar Compra *` deve ser removida ou limpa em cascata, visto que seus itens dependem dos dados da nota fiscal.
  - A exclusão deve ser persistida no banco, mantendo a área de upload vazia após recarregar a página (`F5`).
- **Sugestão de melhoria de UX (não mandatória / conforme protótipo):** Avaliar a oportunidade de unificar as ações, integrando as funcionalidades do botão *"Trocar nota fiscal"* diretamente ao comportamento do próprio botão/ícone de excluir (`✕`), evitando redundância visual.

## Comportamento Atual
- O botão de exclusão (`✕`) permanece na tela, porém sua operação falha:
  - Ao utilizá-lo para remover a NF-e e clicar em *"Confirmar edição"*, é exibido o toast de erro: *"Erro ao editar nota fiscal. Anexe a nota fiscal antes de prosseguir."*.
  - A Seção 3 (Associar Compra) não é excluída nem resetada, continuando em tela com itens da nota fiscal anterior.
  - Ao recarregar a página (`F5`), a nota fiscal reaparece anexada e confirmada, não persistindo a exclusão no servidor.

## Evidências
- 📷 **Novo botão "Trocar nota fiscal" coexistindo com o ícone de exclusão:**
  ![Botão Trocar nota fiscal](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-012-botao-trocar-nota-fiscal.png)

- 📷 **Ícone de exclusão (`✕`) presente no card do arquivo:**
  ![Ícone Excluir Anexo](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-012-icone-excluir-anexo.png)

- 📷 **Toast detalhado de erro ("Erro ao editar nota fiscal - Anexe a nota fiscal antes de prosseguir"):**
  ![Toast Erro Anexe a nota fiscal](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-012-toast-erro-anexe-nota-fiscal.png)

- 📷 **Toast de erro ao excluir a nota fiscal e confirmar a edição (visão completa da tela):**
  <img width="1728" height="701" alt="Toast de erro ao excluir nota fiscal" src="https://github.com/user-attachments/assets/effd31ec-7982-47b4-9978-34c67b95a60a" />

- 📷 **Nota fiscal se mantendo após recarregar a página (`F5`):**
  <img width="1717" height="729" alt="Nota fiscal se mantendo apos reload" src="https://github.com/user-attachments/assets/a6f7c3aa-b274-43f2-bac8-fadd29365877" />

## Sugestão de Investigação
- Verificar a validação no frontend que dispara o erro *"Anexe a nota fiscal antes de prosseguir"* ao submeter o formulário de edição da Seção 2 sem arquivo:
  - A validação de obrigatoriedade do arquivo de nota fiscal está sendo executada antes de permitir salvar o estado de exclusão da despesa.
  - A remoção via `✕` limpa a variável local mas não dispara a limpeza dos dados vinculados da Seção 3 nem envia a requisição de deleção (`DELETE /documento-fiscal/{id}`) de forma independente.
- **Sugestões para o time de desenvolvimento/design (não mandatórias):**
  - **Opção 1:** Corrigir o tratamento do ícone `✕` para que, ao confirmar a edição, execute a deleção do documento no backend e o reset em cascata da Seção 3, sem exigir anexo imediato.
  - **Opção 2 (Alinhada ao protótipo):** Avaliar a substituição ou fusão dos fluxos, inserindo o comportamento do botão *"Trocar nota fiscal"* para dentro do próprio botão de exclusão (`✕`), mantendo a interface limpa e intuitiva.
