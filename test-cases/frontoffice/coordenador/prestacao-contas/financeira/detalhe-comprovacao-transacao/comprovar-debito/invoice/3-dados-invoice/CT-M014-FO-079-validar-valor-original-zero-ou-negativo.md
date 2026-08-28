## ID do Cenário
[CT-M014-FO-079]

## Título
Validar rejeição de valor original do Invoice igual a zero ou negativo

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RI1` (Valores monetários devem ser sempre > 0 em justificativas de despesa)
- Contrato/API: `M014: RegistrarDadosInvoice`

## Pré-condições
- Seção `3. Informações do Invoice *` visível.
- `Moeda*` e `Taxa de Câmbio*` preenchidos corretamente.

## Passo a Passo
1. No campo `Valor Original*`, inserir `0` e tentar confirmar clicando em `Enviar`.
2. Repetir com um valor negativo (ex: `-200`).

## Dados de Entrada
- Cenário A: Valor Original = `0`
- Cenário B: Valor Original = `-200`

## Resultado Esperado
- O sistema exibe validação: *"O valor original deve ser maior que zero."*.
- O campo `Valor Total (BRL)*` exibe `R$ 0,00` e a confirmação é bloqueada.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [x] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
