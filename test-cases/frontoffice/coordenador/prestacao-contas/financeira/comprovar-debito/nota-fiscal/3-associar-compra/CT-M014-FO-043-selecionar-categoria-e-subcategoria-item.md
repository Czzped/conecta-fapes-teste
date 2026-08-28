## ID do Cenário
[CT-M014-FO-043]

## Título
Selecionar categoria e subcategoria contábil do item na modal de associação

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014 / M013: `RN06` (Classificação em categorias e subcategorias contábeis/rubrica)
- Contrato/API: `M014: AssociarItemRubrica`

## Pré-condições
- Modal `Associar Compra` aberta na tela.

## Passo a Passo
1. Clicar no select `Selecione a categoria do item` e escolher a categoria desejada (ex: `Material de Consumo`).
2. Clicar no select `Selecione a subcategoria do item` e escolher a subcategoria correspondente (ex: `Caneta Esferográfica` ou `Equipamento de Informática`).
3. Clicar no botão ciano `Editar` ou `Salvar` para confirmar a associação.

## Dados de Entrada
- Categoria: `Material de Consumo`
- Subcategoria: `Caneta Esferográfica`

## Resultado Esperado
- A subcategoria é filtrada dinamicamente com base na categoria selecionada.
- Ao clicar em confirmar, a modal fecha e a tabela exibe a badge/status de item associado.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
