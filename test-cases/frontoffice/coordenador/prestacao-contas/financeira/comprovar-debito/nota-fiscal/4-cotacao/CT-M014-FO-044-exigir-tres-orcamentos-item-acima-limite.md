## ID do Cenário
[CT-M014-FO-044]

## Título
Validar regra de obrigatoriedade de 3 orçamentos para itens com valor superior a R$ 1.400,00

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014: `RN07` / `RI-COT01` (Obrigatoriedade de 3 cotações de fornecedores para itens > R$ 1.400)
- Contrato/API: `M014: ValidarRegraCotacao`

## Pré-condições
- Nota Fiscal com item de valor unitário/total superior a R$ 1.400,00 associado no formulário.
- Seção `4. Cotação` visível com a orientação *"Se você comprou um item de valor superior a R$ 1.400, envie 3 orçamentos e selecione o de menor valor..."*.

## Passo a Passo
1. Observar o painel da seção `4. Cotação`.
2. Verificar o componente de upload indicando a contagem progressiva (`Anexar Cotação 1/3`).
3. Tentar submeter sem enviar as 3 cotações completas.

## Dados de Entrada
- Valor do Item na Nota: `R$ 21.599,60` (Superior a R$ 1.400,00)

## Resultado Esperado
- O sistema exige obrigatoriamente o envio de 3 orçamentos (cotações de fornecedores distintos).
- O envio final é bloqueado enquanto não forem anexadas e confirmadas as 3 cotações (`3/3`).

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
