## ID do Cenário
[CT-M014-FO-046]

## Título
Validar seleção obrigatória da cotação de menor valor correspondente à compra efetuada

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014: `RN07` / `RI-COT03` (A compra realizada deve corresponder ao orçamento de menor valor selecionado)
- Contrato/API: `M014: ValidarMenorValorCotacao`

## Pré-condições
- 3 cotações cadastradas e confirmadas na seção `4. Cotação`.

## Passo a Passo
1. Observar os radio buttons de seleção nos cards das cotações.
2. Identificar a cotação com o menor valor registrado.
3. Marcar o radio button da cotação de menor valor.

## Dados de Entrada
- Cotação 1 (Menor Valor): `R$ 5.826,00` (Selecionada)
- Cotação 2: `R$ 5.854,83`
- Cotação 3: `R$ 8.764,00`

## Resultado Esperado
- O radio button da cotação de menor valor fica selecionado.
- O sistema valida que a cotação escolhida é a de menor montante entre as 3 apresentadas, atendendo à exigência legal do fomento.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
