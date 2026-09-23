## ID do Cenário
[CT-M014-FO-127]

## Título
Validar regra de exigência de cotações com base na soma do valor de todas as transações vinculadas à prestação

## Requisito/História Relacionada
- Requisito/Issue: #2943 / Seção F4 (Regressão de cotações com múltiplas transações)
- Regra Canônica: M014: `RN07` / `RI-COT01` (Cálculo do limite de exigência de 3 cotações sobre a soma das transações vinculadas)
- Contrato/API: `M014: ValidarDadosJustificativaDespesa`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Limite editalício de exigência de 3 orçamentos/cotações definido em R$ 1.400,00.
- Prestação de contas contendo Débito 1 (R$ 800,00) e Débito 2 (R$ 700,00) vinculados (Soma: R$ 1.500,00).

## Passo a Passo
1. Acessar a prestação de contas de débito contendo o Débito 1 (R$ 800,00) e Débito 2 (R$ 700,00) vinculados.
2. Inspecionar a visibilidade e obrigatoriedade da etapa `4. Cotação`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Limite de cotação: R$ 1.400,00
- Débito 1: R$ 800,00 (< R$ 1.400,00 isoladamente)
- Débito 2: R$ 700,00 (< R$ 1.400,00 isoladamente)
- Valor Total Somado das Transações: R$ 1.500,00 (> R$ 1.400,00)

## Resultado Esperado
- O sistema calcula o limite de exigência sobre a **soma acumulada de todas as transações vinculadas** (R$ 1.500,00) e não isoladamente por débito.
- A etapa `4. Cotação` é ativada e torna-se **obrigatória** (exigindo o envio das 3 cotações de fornecedores e a seleção da menor proposta para aprovação).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
