## ID do Cenário
[CT-M014-FO-118]

## Título
Validar ausência do ícone de desvincular quando a prestação de contas possuir apenas 1 transação vinculada

## Requisito/História Relacionada
- Requisito/Issue: #2943 / Seção B7 (Garantia de ao menos uma transação por prestação)
- Regra Canônica: M014: `RN02` (Invariante: toda JustificativaDespesa requer ao menos uma TransacaoFinanceira vinculada)
- Contrato/API: `M014: DesvincularTransacaoJustificativaDespesa`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas de débito em estado `Em Rascunho`.
- Prestação contendo exatamente **uma única transação de débito** vinculada.

## Passo a Passo
1. Acessar a tela de detalhes da prestação de contas de débito contendo apenas 1 transação.
2. Navegar até o card/linha da transação vinculada.
3. Inspecionar a presença dos ícones e botões de ação na linha da transação.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Quantidade de transações vinculadas: 1

## Resultado Esperado
- O ícone de desvincular transação **não é exibido** (ou aparece oculto/removido da interface).
- A interface impede que o coordenador deixe a prestação com zero transações vinculadas.
- Para substituir a única transação vinculada, o coordenador deve vincular a nova transação primeiro para que o botão de desvincular a anterior seja liberado.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
