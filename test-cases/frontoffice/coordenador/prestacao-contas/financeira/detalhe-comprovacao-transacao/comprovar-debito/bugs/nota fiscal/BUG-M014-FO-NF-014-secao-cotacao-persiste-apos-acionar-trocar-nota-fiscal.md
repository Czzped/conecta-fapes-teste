## Título
[Bug] Seção de Cotação permanece exibida e com orçamentos anteriores vinculados após acionar "Trocar nota fiscal"

## ID
BUG-M014-FO-NF-014

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — Tipo de Documento: **Nota Fiscal**
- Regra Canônica: M014: `RN05` (Cada justificativa de despesa pode ter até 3 `OrcamentoFornecedor`, atrelados estritamente aos itens do documento fiscal) / `RN07` (Associação de itens à rubrica e exigência de cotações) / Fluxo 4 de `processo.md` (Linha 446: *"Se a compra for menor que 300 VRTE, a sessão de Cotação não deve aparecer para o usuário"* — a cotação depende dos itens reais da nota fiscal ativa)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: A interface exibe orçamentos e cotações preenchidas para uma compra cujos itens e documento fiscal já foram excluídos.
  - **Heurística #5 (Prevenção de Erros)**: A preservação indevida de cotações de uma nota anterior induz o usuário ao erro de vincular orçamentos incompatíveis à nova nota fiscal anexada (ex.: cotação de notebooks atrelada a uma nova compra de suprimentos ou serviços).
- Caso de Teste Relacionado: `CT-M014-FO-044` / `CT-M014-FO-045` (Exigência e anexo de cotações)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Ação: `Trocar nota fiscal`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar uma comprovação de débito que já possua Nota Fiscal anexada, com itens associados na Seção `3. Associar Compra *` e 3 orçamentos enviados na Seção `4. Cotação` (ex.: cotações de notebooks com valor total acima do teto).
2. Na Seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, clicar no botão *"Trocar nota fiscal"*.
3. Na modal de confirmação (*"Trocar a nota fiscal?"*), confirmar a operação clicando no botão ciano *"Trocar nota fiscal"*.
4. Observar que a nota fiscal é removida da Seção 2 e a Seção `3. Associar Compra *` é inteiramente descartada da tela.
5. Rolar a página até a Seção `4. Cotação`.
6. Constatar que a Seção `4. Cotação` permanece visível e com os 3 orçamentos antigos vinculados, mesmo sem nenhuma nota fiscal ou item associado no momento.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Estado prévio: NF anexada com 1 item (Notebook Samsung Galaxy Book - R$ 21.599,60) + 3 cotações anexadas na Seção 4
- Ação executada: Clicar em *"Trocar nota fiscal"* → Confirmar na modal de diálogo

## Comportamento Esperado
- As cotações de fornecedores (`OrcamentoFornecedor`) são registros filhos dos itens da compra (`ItemDocumentoFiscal`).
- Ao acionar *"Trocar nota fiscal"* e descartar os itens da compra (Seção 3), a Seção `4. Cotação` deve ser igualmente resetada/ocultada, uma vez que:
  1. Não há itens associados aos quais as cotações possam se referir;
  2. A nova nota fiscal que o usuário anexará pode ter itens completamente diferentes ou valor abaixo do teto de cotação (< 300 VRTE / R$ 1.400,00), dispensando o processo de cotação.
- O recálculo e a exibição da Seção 4 devem ocorrer apenas após a inserção e verificação da nova nota fiscal.

## Comportamento Atual
- A Seção 2 é limpa e a Seção 3 é descartada, porém a Seção `4. Cotação` **permanece ativa e renderizada em tela** com os 3 arquivos de orçamento da compra anterior.
- A modal de confirmação chega a explicitar esse comportamento (*"As cotações já enviadas em 'Cotação' são mantidas."*), consolidando uma inconsistência de regra de negócio onde orçamentos de um produto descartado ficam órfãos e previamente vinculados a uma futura nota fiscal ainda desconhecida.

## Evidências
- 📷 **Estado inicial com Nota Fiscal, Seção 3 (Associar Compra) e Seção 4 (Cotação com 3 orçamentos):**
  ![Estado Inicial](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-014-estado-inicial-com-nf-itens-e-cotacoes.png)

- 📷 **Modal de diálogo "Trocar a nota fiscal?" com aviso de que as cotações são mantidas:**
  ![Modal de Troca](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-014-modal-confirmacao-trocar-nota-fiscal.png)

- 📷 **Seção 4 (Cotação) mantida em tela após remoção da NF e exclusão da Seção 3:**
  ![Cotação Mantida Órfã](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-014-secao-cotacao-mantida-apos-trocar-nota.png)

## Sugestão de Investigação
- Analisar o fluxo de limpeza disparado pela ação `trocarNotaFiscal` no composable `usePrestacao`:
  - Atualmente a rotina descarta o `documentoFiscal` e os `itensAssociados`, mas preserva intencionalmente o array de `cotacoes`.
  - Como a cotação depende da pertinência e do valor do item da nota fiscal, recomenda-se que a ação de troca:
    1. Limpe o array reativo de cotações (`cotacoes.value = []`);
    2. Oculte a Seção 4 até que a nova nota fiscal seja enviada e o valor dos novos itens seja avaliado contra a regra de 300 VRTE (`valorTotalItem > LIMITE_COTACAO`);
    3. Atualize o texto da modal para informar que as cotações também serão reiniciadas devido à substituição do documento de compra.
