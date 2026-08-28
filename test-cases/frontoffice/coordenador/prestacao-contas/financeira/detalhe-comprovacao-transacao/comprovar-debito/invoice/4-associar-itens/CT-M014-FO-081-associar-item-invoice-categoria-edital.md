## ID do Cenário
[CT-M014-FO-081]

## Título
Associar item do Invoice à categoria do Edital com quantidade e valor unitário

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RN07` (Cada item deve ser classificado em uma RubricaProjeto do Edital)
- Contrato/API: `M014: AssociarItemInvoice`

## Pré-condições
- Seções 1, 2 e 3 do formulário de Invoice concluídas.
- Seção `4. Associar Itens do Invoice *` visível com a instrução *"Associe o item comprado ao item aprovado no seu Edital."*.

## Passo a Passo
1. No campo `Selecione a Categoria do Item*`, selecionar uma categoria (ex: `Material de Consumo`).
2. No campo `Selecione o Item*`, selecionar o item do edital correspondente.
3. Preencher o campo `Quantidade*`.
4. Preencher o campo `Valor unitário*`.
5. Clicar no botão `+` ou `Enviar` para adicionar o item à lista.

## Dados de Entrada
- Categoria: `Material de Consumo`
- Item: `Reagente Químico` (exemplo de item aprovado no edital)
- Quantidade: `2`
- Valor Unitário: `R$ 1.300,00`

## Resultado Esperado
- O item é adicionado com sucesso à listagem de itens associados.
- O sistema exibe o item com os dados inseridos na linha da tabela de associação.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
