## Título
[Bug] Divergência com protótipo: Associação de compra na Seção 3 exige abertura de modal em vez de preenchimento direto em tela

## ID
BUG-M014-FO-NF-026

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Seção 3 (Associar Compra)**
- Regra Canônica / Design: Fidelidade ao Protótipo Oficial de UX/UI (`prototype/frontOffice/src/app/components/FinanceiraDetalhes.tsx`), M014 / M013: `RN06` / `RN07` (Vinculação de itens da despesa aos itens aprovados no plano de trabalho/edital e categorias contábeis).
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #4 (Consistência e Padrões)**: Divergência entre o padrão desenhado no protótipo de UX e a implementação do Frontoffice. O protótipo estabelece que a associação do item da Nota Fiscal com o item aprovado no edital deve ser feita diretamente na tela principal (inline).
  - **Heurística #8 (Design Estético e Minimalista)**: Sobrecarga visual e fricção cognitiva decorrente do uso de janelas modais intermediárias para uma tarefa primária do fluxo de preenchimento. A necessidade de abrir modal para cada item fragmenta o contexto do usuário.
  - **Heurística #7 (Flexibilidade e Eficiência de Uso)**: Perda de agilidade no preenchimento pelo Coordenador de Projeto, exigindo cliques repetitivos (abrir modal, selecionar, salvar/fechar) em vez de navegar diretamente entre os campos já dispostos na página.
- Casos de Teste Relacionados:
  - `CT-M014-FO-042` (Abrir modal de associação de compra para itens da Nota Fiscal)
  - `CT-M014-FO-043` (Selecionar categoria e subcategoria do item)
  - `CT-M014-FO-041` (Validar tabela de itens da nota fiscal)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção 3 - `Associar Compra`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Desktop (1920×1080 / 1440×900) / Chrome v120+ / Frontoffice Vue-Nuxt UI em Homologação

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar a aplicação Frontoffice com perfil de Coordenador no Ambiente de Homologação.
2. Navegar até o extrato em `/coordenador/financeira` e abrir a tela de comprovação de uma transação de débito em `/coordenador/prestacao-financeira/detalhes/:paymentId`.
3. Preencher a Seção 1 (Identificação) e anexar/confirmar a Nota Fiscal na Seção 2.
4. Rolar a página até a Seção `3. Associar Compra *`.
5. Observar que a seção renderiza apenas o resumo em tabela do item da Nota Fiscal (`Descrição`, `Quantidade`, `Valor Unitário`, `Valor Total`).
6. Para associar a compra a uma categoria contábil ou item do edital, clicar sobre a linha/card do item.
7. Constatar que o sistema dispara a abertura de um modal sobreposto intitulado *"Associar Compra"*, obrigando o usuário a realizar a seleção da categoria/subcategoria dentro desse modal.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Seção: `3. Associar Compra *`
- Item de teste importado da NF: `Smart TV Philips Ambilight 55" 4K 55PUG7908/78` (Qtd: 1, Valor Unitário: R$ 2.449,47, Valor Total: R$ 2.328,99)

## Comportamento Esperado
- Conforme definido no protótipo de referência oficial (`prototype/frontOffice/src/app/components/FinanceiraDetalhes.tsx`), a associação de compra deve ocorrer **diretamente na tela (inline)**, sem necessidade de abertura de qualquer modal intermediário:
  - Subtítulo da seção: *"Associe o item comprado ao item aprovado no seu Edital."*
  - Exibição direta dos campos de entrada na tela principal para cada item:
    - Dropdown: `Selecione a Categoria do item` (ex.: *Material Permanente*)
    - Dropdown: `Selecione o Item` (itens aprovados no edital, ex.: *Notebook Dell Inspiron 15*)
    - Inputs lado a lado: `Quantidade` e `Valor`
  - Card/tabela com os detalhes importados da Nota Fiscal exibido logo abaixo dos campos de associação.
- Esse padrão torna o fluxo direto, contínuo, reduz cliques e elimina confusão relatada pelos usuários.

## Comportamento Atual
- A implementação atual não disponibiliza os campos de associação na tela principal:
  - Exibe apenas o resumo do item na Seção 3 e obriga o usuário a clicar para abrir uma janela modal (`Associar Compra`).
  - No modal, exige a confirmação das informações e a seleção de categoria/subcategoria, seguida de ação de confirmação/edição para retornar à tela principal.
  - Esse desvio do protótipo quebra a expectativa de navegação contínua, aumenta o atrito e gera dúvidas frequentes para os coordenadores durante a comprovação.

## Evidências
- 📷 **Seção 3 atual na tela de Comprovação de Débito (exibição apenas da listagem do item da NF sem campos de associação inline):**
  ![Seção 3 Atual](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/Nota%20Fiscal/evidencias-BUG-NF-026-01-secao-3-associar-compra-atual.png)

- 📷 **Modal intermediário 'Associar Compra' exigido na implementação atual para associar categoria/subcategoria:**
  ![Modal Associar Compra Atual](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/Nota%20Fiscal/evidencias-BUG-NF-026-02-modal-associar-compra-aberto.png)

- 📷 **Protótipo oficial de referência com formulário de associação direto na tela (inline, campos Categoria, Item, Quantidade, Valor e dados do item abaixo):**
  ![Protótipo Associação Inline](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/Nota%20Fiscal/evidencias-BUG-NF-026-03-prototipo-associacao-direta-inline.png)

## Sugestão de Investigação
- Inspecionar a Seção 3 em `ComprovarDebito.vue` (ou componente filho responsável por `Associar Compra`):
  - Alinhar a estrutura visual e de componentes à implementação do protótipo oficial (`prototype/frontOffice/src/app/components/FinanceiraDetalhes.tsx`, linhas 1610 a 1730).
  - Substituir o gatilho que abre a modal `Associar Compra` por um formulário inline renderizado para cada item da nota (`nfItens`).
  - Posicionar os campos `Selecione a Categoria do item`, `Selecione o Item`, `Quantidade` e `Valor` diretamente na tela, mantendo o card com a descrição e valores do item fiscal logo abaixo.
  - Atualizar os casos de teste correspondentes (`CT-M014-FO-042` e `CT-M014-FO-043`) para refletir o comportamento inline sem abertura de modal.
