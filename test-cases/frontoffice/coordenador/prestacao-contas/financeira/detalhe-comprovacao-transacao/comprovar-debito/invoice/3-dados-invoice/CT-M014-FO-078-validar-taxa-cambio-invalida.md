## ID do Cenário
[CT-M014-FO-078]

## Título
Validar rejeição de taxa de câmbio inválida (zero, negativa ou não numérica)

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RI1` (Valores monetários e taxas devem ser > 0)
- Contrato/API: `M014: RegistrarDadosInvoice`

## Pré-condições
- Seção `3. Informações do Invoice *` visível.
- `Valor Original*` e `Data do Invoice*` preenchidos corretamente.

## Passo a Passo
1. No campo `Taxa de Câmbio*`, inserir o valor `0` e tentar confirmar.
2. Repetir com valor negativo (ex: `-5`).
3. Repetir com texto não numérico (ex: `abc`).

## Dados de Entrada
- Cenário A: Taxa de Câmbio = `0`
- Cenário B: Taxa de Câmbio = `-5`
- Cenário C: Taxa de Câmbio = `abc`

## Resultado Esperado
- Cenário A e B: O sistema exibe *"A taxa de câmbio deve ser maior que zero."*.
- Cenário C: O sistema exibe *"Informe um valor numérico válido para a taxa de câmbio."*.
- O campo `Valor Total (BRL)*` permanece como `R$ 0,00` e o botão `Enviar` é bloqueado.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [x] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
