## ID do Cenário
[CT-M014-FO-082]

## Título
Validar bloqueio ao tentar enviar item do Invoice sem selecionar categoria ou item do Edital

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RN07` (Classificação em RubricaProjeto é obrigatória para cada item)
- Contrato/API: `M014: AssociarItemInvoice`

## Pré-condições
- Seção `4. Associar Itens do Invoice *` visível.

## Passo a Passo
1. Deixar o campo `Selecione a Categoria do Item*` sem seleção.
2. Preencher `Quantidade*` e `Valor unitário*`.
3. Clicar no botão `+` / `Enviar`.
4. Repetir o teste selecionando a categoria, mas sem selecionar o `Item*`.

## Dados de Entrada
- Cenário A: Categoria = `(não selecionada)`, Item = `(não selecionado)`, Quantidade = `2`, Valor = `R$ 500,00`
- Cenário B: Categoria = `Material de Consumo`, Item = `(não selecionado)`, Quantidade = `2`, Valor = `R$ 500,00`

## Resultado Esperado
- Cenário A: Mensagem de validação no campo Categoria: *"Selecione uma categoria."*.
- Cenário B: Mensagem de validação no campo Item: *"Selecione um item do edital."*.
- Em ambos os casos, o item não é adicionado à lista.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
