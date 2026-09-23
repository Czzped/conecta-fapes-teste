## ID do Cenário
[CT-M014-FO-120]

## Título
Validar alerta de conciliação quando a soma das Notas Fiscais for maior que o total das transações vinculadas

## Requisito/História Relacionada
- Requisito/Issue: #2943 / Seção C2 (Conciliação entre notas e transações)
- Regra Canônica: M014: `RN02` / `RN10` (Validação de conciliação de valores antes da submissão)
- Contrato/API: `M014: ValidarDadosJustificativaDespesa`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas de débito em estado `Em Rascunho`.
- Transação(ões) vinculada(s) somando R$ 1.000,00.
- Nota(s) Fiscal(is) anexada(s) somando R$ 1.400,00.

## Passo a Passo
1. Acessar a tela de comprovação de débito contendo transações de R$ 1.000,00 e notas de R$ 1.400,00.
2. Inspecionar o componente/barra de conciliação na tela.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Soma das Transações: R$ 1.000,00
- Soma das Notas: R$ 1.400,00 (Divergência: +R$ 400,00)

## Resultado Esperado
- A barra de conciliação exibe a mensagem de alerta: *"Notas somam mais do que saiu do extrato"*.
- Os dois totais (soma das notas e soma das transações) são destacados visualmente em tom vermelho.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
