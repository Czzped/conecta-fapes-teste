## Título
[Bug] Ícone de exclusão de anexo da Nota Fiscal gera erro ao confirmar edição, não remove a Seção 3 e mantém o arquivo após reload

## ID
BUG-M014-FO-NF-012

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — Tipo de Documento: **Nota Fiscal**
- Regra Canônica: M014: `RN05` / `RI-NFE01` (Integridade da edição e remoção do `DocumentoFiscal` vinculado à `JustificativaDespesa`) / `RN07` (Associação de itens da compra à categoria do Edital — a Seção 3 deve depender estritamente da existência e consistência do anexo de Nota Fiscal)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #4 (Consistência e Padrões)**: Coexistência de dois elementos redundantes para manipulação do anexo ("Trocar nota fiscal" e o ícone de exclusão `✕`), onde um funciona parcialmente e o outro quebra o fluxo com erro.
  - **Heurística #3 (Controle e Liberdade do Usuário)**: O usuário tenta excluir a nota fiscal anexada pelo controle direto do arquivo (`✕`), mas o sistema falha e reverte a ação.
  - **Heurística #9 (Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros)**: Disparo de toast genérico *"Erro ao editar nota fiscal"* sem orientação sobre como proceder.
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
6. Observar o toast de erro exibido na tela: *"Erro ao editar nota fiscal"*.
7. Notar que a Seção `3. Associar Compra *` não é excluída nem ocultada, permanecendo renderizada abaixo.
8. Recarregar a página (`F5`).
9. Constatar que a nota fiscal que havia sido excluída continua anexada e confirmada na interface, demonstrando que a remoção não persistiu.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Ação executada: Modo de edição da Seção 2 → Clique no ícone `✕` do anexo de NF-e → Clique em *"Confirmar edição"*

## Comportamento Esperado
- O fluxo de remoção e substituição da nota fiscal deve ser unificado e consistente:
  - Se o ícone de exclusão (`✕`) estiver disponível, ao utilizá-lo e confirmar a edição, o anexo deve ser excluído com sucesso no backend, a Seção `3. Associar Compra *` deve ser removida da tela e a exclusão deve persistir após o recarregamento da página.
  - Conforme previsto no protótipo de UX, a funcionalidade do botão avulso *"Trocar nota fiscal"* deve ser incorporada diretamente no botão de excluir (`✕`), garantindo que a remoção do anexo limpe em cascata os itens associados da Seção 3 e libere a nova área de upload sem elementos visuais redundantes.

## Comportamento Atual
- O botão de exclusão (`✕`) permanece na tela sem propósito funcional:
  - Ao utilizá-lo para remover a NF-e e clicar em *"Confirmar edição"*, é exibido o toast de erro *"Erro ao editar nota fiscal"*.
  - A Seção 3 (Associar Compra) não é excluída e continua em tela com itens da nota anterior.
  - Ao recarregar a página (`F5`), a nota fiscal reaparece anexada, não persistindo a exclusão no servidor.

## Evidências
- 📷 **Novo botão "Trocar nota fiscal" coexistindo com o ícone de exclusão:**
  ![Botão Trocar nota fiscal](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-012-botao-trocar-nota-fiscal.png)

- 📷 **Ícone de exclusão (`✕`) presente no card do arquivo:**
  ![Ícone Excluir Anexo](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-012-icone-excluir-anexo.png)

- 📷 **Toast de erro ao excluir a nota fiscal e confirmar a edição:**
  <img width="1728" height="701" alt="Toast de erro ao excluir nota fiscal" src="https://github.com/user-attachments/assets/effd31ec-7982-47b4-9978-34c67b95a60a" />

- 📷 **Nota fiscal se mantendo após recarregar a página (`F5`):**
  <img width="1717" height="729" alt="Nota fiscal se mantendo apos reload" src="https://github.com/user-attachments/assets/a6f7c3aa-b274-43f2-bac8-fadd29365877" />

## Sugestão de Investigação
- Comparar a lógica executada no clique de *"Trocar nota fiscal"* com a do ícone `✕`:
  - O botão *"Trocar nota fiscal"* executa o reset da Seção 3 e a limpeza de estado necessária no composable `usePrestacao`.
  - O ícone `✕` apenas limpa a referência local do arquivo no formulário, fazendo com que o `Confirmar edição` envie uma requisição `PUT /api/prestacao-de-contas/documento-fiscal` inconsistente (ou tente um `DELETE` malformado), gerando o erro de edição no servidor e impedindo a exclusão em cascata da Seção 3.
- Sugere-se unificar o comportamento conforme o protótipo: acoplar a limpeza da Seção 3 e a troca do anexo diretamente ao acionamento do ícone de exclusão (`✕`), eliminando o botão secundário *"Trocar nota fiscal"*.
