## ID do Cenário
[CT-M014-FO-031]

## Título
Associar transação de Crédito a um Débito de saída no fluxo de Estorno

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Tela Classificar Crédito (`/coordenador/prestacao-financeira/classificar-credito/:paymentId`)
- Regra Canônica: M014: `RN08` / `RI-EST02` (Pareamento de crédito de estorno com débito original)
- Contrato/API: `M014: ParearTransacaoEstorno`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de crédito em estado `Pendente` aberta na rota `/coordenador/prestacao-financeira/classificar-credito/:paymentId`.

## Passo a Passo
1. No campo `Classificação`, selecionar a opção `Estorno`.
2. Observar o surgimento do campo condicional `Associe esse Crédito (entrada) a um Débito (saída).`.
3. Clicar no select com o placeholder `Selecione um pagamento`.
4. Selecionar o lançamento de débito correspondente à compra estornada.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/classificar-credito/paymentId_credito_01`
- Classificação: `Estorno`
- Campo de Associação: `Associe esse Crédito (entrada) a um Débito (saída).`
- Débito Selecionado: `Débito #1042 - R$ 2.599,60`

## Resultado Esperado
- O campo `Associe esse Crédito (entrada) a um Débito (saída).` é exibido imediatamente ao selecionar `Estorno`.
- O select lista as transações de débito elegíveis do projeto.
- A seleção do pagamento é mantida no estado da página.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
