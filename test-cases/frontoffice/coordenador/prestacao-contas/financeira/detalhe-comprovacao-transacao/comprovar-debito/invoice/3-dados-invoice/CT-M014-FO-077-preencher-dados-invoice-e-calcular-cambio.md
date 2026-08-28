## ID do Cenário
[CT-M014-FO-077]

## Título
Preencher dados do Invoice e validar cálculo automático do Valor Total em BRL

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RI3` (Valor Total BRL = Valor Original × Taxa de Câmbio)
- Contrato/API: `M014: RegistrarDadosInvoice`

## Pré-condições
- Seção `3. Informações do Invoice *` visível.
- Arquivo do Invoice já anexado na seção 2.

## Passo a Passo
1. Preencher `Valor Original*` (ex: `USD 500,00`).
2. Verificar/ajustar o campo `Moeda*` (padrão exibido: `BRL`; alterar para `USD`).
3. Preencher `Taxa de Câmbio*` (ex: `5,20`).
4. Observar o campo `Valor Total (BRL)*` ser calculado automaticamente (`R$ 2.600,00`).
5. Preencher `Data do Invoice*` (formato `dd/mm/aaaa`).
6. Clicar no botão ciano `Enviar` da seção.

## Dados de Entrada
- Valor Original: `500,00`
- Moeda: `USD`
- Taxa de Câmbio: `5,20`
- Valor Total BRL (esperado automático): `R$ 2.600,00`
- Data do Invoice: `10/05/2026`

## Resultado Esperado
- O campo `Valor Total (BRL)*` é calculado automaticamente como `500,00 × 5,20 = R$ 2.600,00`.
- Ao clicar em `Enviar`, os dados da seção são confirmados.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
