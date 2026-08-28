## ID do Cenário
[CT-M014-FO-032]

## Título
Validar obrigatoriedade de associação de débito no Estorno

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Tela Classificar Crédito (`/coordenador/prestacao-financeira/classificar-credito/:paymentId`)
- Regra Canônica: M014: `RN08` (Obrigatoriedade de vínculo para estorno de valor)
- Contrato/API: `M014: SubmeterComprovacaoCredito`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de crédito aberta na rota `/coordenador/prestacao-financeira/classificar-credito/:paymentId` com `Classificação = Estorno` selecionada, porém sem nenhum débito selecionado no campo de associação.

## Passo a Passo
1. Garantir que a `Classificação` esteja como `Estorno`.
2. Deixar o campo `Associe esse Crédito (entrada) a um Débito (saída).` com o valor `Selecione um pagamento`.
3. Clicar no botão `Enviar`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/classificar-credito/paymentId_credito_01`
- Classificação: `Estorno`
- Associação a Débito: `Vazio / Selecione um pagamento`

## Resultado Esperado
- O envio é bloqueado pelo sistema.
- É exibida mensagem/alerta de validação indicando que a associação a um débito de saída é obrigatória para a classificação de estorno.
- O formulário permanece na tela mantendo o status `Pendente`.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
