## ID do Cenário
[CT-M014-FO-059]

## Título
Validar badge de status Em Rascunho na comprovação de débito

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (`/coordenador/prestacao-financeira/detalhes/:paymentId`)
- Regra Canônica: M014: `RN05` / `RN08` (Ciclo de vida e máquina de estados da comprovação de débito)
- Contrato/API: `M014: ConsultarTransacaoFinanceira`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de débito aberta que se encontra no estado inicial ou em rascunho de preenchimento.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira/detalhes/:paymentId`.
2. Observar o canto direito da barra `Detalhes do Pagamento`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`

## Resultado Esperado
- O campo `Status` exibe um badge visual cinza com o texto `Em Rascunho`.
- Os formulários abaixo continuam habilitados para edição e preenchimento dos anexos/comprovações.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
