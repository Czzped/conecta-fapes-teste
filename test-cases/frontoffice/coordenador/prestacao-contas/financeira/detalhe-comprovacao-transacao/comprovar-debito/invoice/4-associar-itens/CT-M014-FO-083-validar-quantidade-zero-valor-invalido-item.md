## ID do Cenário
[CT-M014-FO-083]

## Título
Validar rejeição de item do Invoice com quantidade zero ou valor unitário inválido

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RI1` / `RI3` (Quantidade e valor unitário devem ser > 0; ValorTotal = Quantidade × ValorUnitário)
- Contrato/API: `M014: AssociarItemInvoice`

## Pré-condições
- Seção `4. Associar Itens do Invoice *` visível.
- `Categoria do Item*` e `Item*` selecionados corretamente.

## Passo a Passo
1. No campo `Quantidade*`, inserir `0` e tentar enviar.
2. Repetir com `Valor unitário*` = `R$ 0,00` e quantidade válida.
3. Repetir com valor unitário negativo (ex: `-100`).

## Dados de Entrada
- Cenário A: Quantidade = `0`, Valor Unitário = `R$ 500,00`
- Cenário B: Quantidade = `2`, Valor Unitário = `R$ 0,00`
- Cenário C: Quantidade = `2`, Valor Unitário = `-100`

## Resultado Esperado
- Cenário A: Mensagem *"A quantidade deve ser maior que zero."*.
- Cenário B e C: Mensagem *"O valor unitário deve ser maior que zero."*.
- Em todos os casos, o item não é adicionado à lista.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [x] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
