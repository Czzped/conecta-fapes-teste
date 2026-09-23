## ID do Cenário
[CT-M014-FO-116]

## Título
Vincular uma nova transação de débito a uma prestação de contas em rascunho via modal

## Requisito/História Relacionada
- Requisito/Issue: #2943 / #2165 (Vincular transações adicionais à mesma prestação)
- Regra Canônica: M014: `RN02` / `RN13` (Adição de TransacaoFinanceira a JustificativaDespesa existente)
- Contrato/API: `M014: VincularTransacaoJustificativaDespesa`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas de débito em estado `Em Rascunho`.
- Transações adicionais de débito sem prestação vinculada disponíveis no projeto.

## Passo a Passo
1. Acessar a tela de detalhes da prestação de contas de débito em rascunho.
2. Na seção de transações vinculadas, clicar no botão `Vincular transação`.
3. Verificar a abertura da modal contendo o texto explicativo sobre vinculação e a lista paginada de débitos disponíveis.
4. Selecionar um débito disponível na lista e clicar em `Vincular`.
5. Inspecionar a atualização do painel de transações e a barra de conciliação.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Transação selecionada para vincular: Débito ID `tx_debito_03` (R$ 850,00)

## Resultado Esperado
- A modal exibe o texto explicativo e a listagem de débitos sem prestação.
- Ao confirmar o vínculo, o débito `tx_debito_03` passa a figurar na lista de transações vinculadas da prestação.
- O total somado das transações da prestação é recalculado imediatamente.
- A transação vinculada é removida da listagem de débitos disponíveis na modal.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
