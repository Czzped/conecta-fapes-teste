## ID do Cenário
[CT-M014-FO-002]

## Título
Abrir o detalhe de uma transação elegível no extrato

## Requisito/História Relacionada
- Produto: EP-11 — cenário de aceitação `Abrir detalhe da prestação`.
- M014: `ConsultarPrestacaoContas`.
- M014: RN02.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto selecionado no contexto do portal.
- Existe uma transação exibida no extrato com status navegável pela interface, por exemplo `Pendente`.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Localizar uma transação com status `Pendente`.
3. Selecionar a linha da transação.

## Dados de Entrada
- Perfil: `coordenador`.
- Transação: movimento bancário importado com status `Pendente`.

## Resultado Esperado
- O portal abre a rota `/coordenador/prestacao-financeira/:paymentId` correspondente à transação selecionada.
- O detalhe preserva a identificação da transação selecionada e apresenta o fluxo visual da prestação.
- A navegação não altera o vínculo, o status ou o valor da `TransacaoFinanceira`.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
