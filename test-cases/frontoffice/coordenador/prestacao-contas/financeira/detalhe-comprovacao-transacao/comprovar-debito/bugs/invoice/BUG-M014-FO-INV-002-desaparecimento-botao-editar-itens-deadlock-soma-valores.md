## Título
[Bug] Botão de edição de itens desaparece ao adicionar novo item gerando deadlock de validação da soma de valores na Seção 4

## ID
BUG-M014-FO-INV-002

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — Tipo de Documento: **Invoice (Pagamento Internacional)**
- Regra Canônica: M014: `RN02` (Conciliação obrigatória entre transações bancárias e despesas) / `RN07` (Classificação e associação de itens do Edital) / Invariante de Conciliação Financeira (A soma do valor total dos itens deve corresponder rigorosamente ao valor total da transação bancária)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #3 (Controle e Liberdade do Usuário)**: O usuário fica preso na interface sem ação de contorno viável para redistribuir os valores.
  - **Heurística #5 (Prevenção de Erros)**: A interface induz o usuário a um estado de erro irrecuperável (deadlock).
- Caso de Teste Relacionado: `CT-M014-FO-081` (Associar item do Invoice à categoria do Edital)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Fluxo: Débito > Invoice / Seção `4. Associar Itens do Invoice *`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar a comprovação de débito de invoice que já possua um primeiro item associado com o valor total da transação (ex.: `Material de Consumo - Clips de Papel` com `Valor unitário: R$ 1.380,40`).
2. Na seção `4. Associar Itens do Invoice *`, notar que os campos da primeira linha estão em modo de leitura (`disabled`).
3. Sem acionar previamente um botão de edição global de itens, clicar no botão de adicionar novo item (`+`).
4. Observar que a segunda linha de item é aberta para preenchimento, porém a linha anterior permanece bloqueada para edição e o botão de edição de itens desaparece, restando apenas o botão ciano `Enviar` no canto inferior direito.
5. Preencher os dados do segundo item informando categoria, item, quantidade `1` e valor unitário (ex.: `R$ 12,00`).
6. Clicar no botão ciano `Enviar`.
7. Observar a exibição da mensagem de erro impeditiva em linha vermelha e no toast: *"A soma dos itens (R$ 1.392,40) deve ser igual ao total das transações (R$ 1.380,40)"*.
8. Constatar que não é possível editar o valor do primeiro item para rebalancear a soma com a transação, mantendo a interface bloqueada (deadlock).

## Dados de Entrada
- Valor Total da Transação Bancária: `R$ 1.380,40`
- Item 1 (bloqueado em modo somente leitura): `Material de Consumo` - `Clips de Papel` | Qtd: `1` | Valor: `R$ 1.380,40`
- Item 2 (novo registro inserido): `Material Permanente` - `Fechadura Eletrônica` | Qtd: `1` | Valor: `R$ 12,00`
- Soma Total Calculada pelo Sistema: `R$ 1.392,40` (Divergência excedente de `R$ 12,00`)

## Comportamento Esperado
- Ao clicar no botão de adicionar novo item (`+`), o sistema deve colocar automaticamente todos os itens já cadastrados em modo de edição (ou fornecer um botão/ícone de edição inline por linha), permitindo que o usuário reduza o valor do primeiro item antes de acionar `Enviar`.

## Comportamento Atual
- O botão de edição desaparece ao adicionar uma nova linha.
- Os campos do Item 1 permanecem travados para edição.
- A validação de soma total barra o envio dos itens e o usuário não consegue corrigir o valor do item anterior, sendo forçado a deletar a nova linha para destravar a tela.

## Evidências
- 📷 **Linha 1 bloqueada para edição, linha 2 preenchida e validação impeditiva de soma total:**
  ![Bloqueio de edição de item e erro de soma total](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/invoice/evidencias-BUG-INV-002-bloqueio-edicao-item-anterior-deadlock-soma.png)

## Sugestão de Investigação
- Padrão arquitetural idêntico ao registrado no fluxo de passagens (`BUG-M014-FO-PAS-003`).
- No componente `AssociarItensInvoice.vue`, ao disparar a ação de adicionar nova linha (`addItem()`), alternar o estado booleano de edição de todos os itens existentes para `true` (`isEditingAll = true`) ou manter um botão de ação de edição individual (`isEditingItem[index] = true`) em cada linha renderizada.
