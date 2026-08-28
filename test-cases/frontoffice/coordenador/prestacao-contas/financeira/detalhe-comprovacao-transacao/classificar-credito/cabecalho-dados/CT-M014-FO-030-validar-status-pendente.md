## ID do Cenário
[CT-M014-FO-030]

## Título
Validar badge de status Pendente na classificação de crédito

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Tela Classificar Crédito
- Regra Canônica: M014: `RN08` (Ciclo de vida e estados de transações de crédito)
- Contrato/API: `M014: ConsultarTransacaoFinanceira`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de crédito recém-importada do banco que ainda não foi submetida pelo coordenador.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira/:paymentId`.
2. Observar o canto direito da barra `Detalhes do Pagamento`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/paymentId_credito_01`

## Resultado Esperado
- O campo `Status` exibe um badge visual em destaque na cor amarela com o texto `Pendente`.
- O formulário abaixo (`1. Informações Gerais *`) permanece habilitado para edição e classificação.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
