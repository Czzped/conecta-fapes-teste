## ID do Cenário
[CT-M014-FO-042]

## Título
Abrir modal de associação de compra para itens da Nota Fiscal

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014 / M013: `RN06` (Vinculação de itens de despesa a categorias contábeis e rubricas)
- Contrato/API: `M014: ConsultarItemNotaFiscal`

## Pré-condições
- Nota Fiscal enviada e confirmada na seção de verificação.
- Seção `3. Associar Compra *` visível com o subtítulo *"Associe os itens da Nota Fiscal às categorias contábeis correspondentes para melhor organização financeira."*.

## Passo a Passo
1. Localizar o item listado na tabela da seção `3. Associar Compra *`.
2. Clicar sobre a linha do item para iniciar a associação.

## Dados de Entrada
- Item: `NB I7 16GB1TB SSD ARC A350M` (Valor Total: `R$ 21.599,60`)

## Resultado Esperado
- A modal `Associar Compra` é aberta sobrepondo a tela.
- Exibe o subtítulo *"Confirme as informações da compra selecionada antes de prosseguir."*.
- Apresenta os selects `Selecione a categoria do item` e `Selecione a subcategoria do item`.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
