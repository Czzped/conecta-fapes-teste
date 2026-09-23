## ID do Cenário
[CT-M014-FO-117]

## Título
Desvincular uma transação de débito de uma prestação de contas com múltiplas transações

## Requisito/História Relacionada
- Requisito/Issue: #2943 / #2165 (Desvinculação de transações adicionais)
- Regra Canônica: M014: `RN02` / `RN13` (Remoção de vínculo entre TransacaoFinanceira e JustificativaDespesa)
- Contrato/API: `M014: DesvincularTransacaoJustificativaDespesa`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas em estado `Em Rascunho`.
- Prestação contendo exatamente **duas ou mais transações de débito** vinculadas.

## Passo a Passo
1. Acessar a tela de detalhes da prestação contendo 2 transações de débito vinculadas.
2. Na lista de transações vinculadas, localizar o ícone de desvincular (desfazer vínculo/lixeira) da 2ª transação.
3. Clicar no ícone para desvincular a transação.
4. Confirmar a ação na modal de confirmação.
5. Inspecionar a lista de transações vinculadas e abrir a modal de vincular transação.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Transação a desvincular: Débito ID `tx_debito_02` (R$ 400,00)

## Resultado Esperado
- A transação `tx_debito_02` é removida da lista de transações da prestação.
- O total somado das transações é recalculado instantaneamente.
- A transação desvinculada volta a ficar disponível na modal de vinculação e na listagem do extrato geral.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
