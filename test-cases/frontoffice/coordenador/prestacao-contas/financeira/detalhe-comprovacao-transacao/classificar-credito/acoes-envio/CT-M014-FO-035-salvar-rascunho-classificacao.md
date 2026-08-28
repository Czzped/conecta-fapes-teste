## ID do Cenário
[CT-M014-FO-035]

## Título
Salvar rascunho da classificação de crédito e transicionar status

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Tela Classificar Crédito (`/coordenador/prestacao-financeira/classificar-credito/:paymentId`)
- Regra Canônica: M014: `RN08` / `RN09` (Transição de estado para Em Rascunho)
- Contrato/API: `M014: SalvarRascunhoComprovacao`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de crédito aberta na rota `/coordenador/prestacao-financeira/classificar-credito/:paymentId` com dados preenchidos no formulário (`Estorno` ou `Devolução`).
- Status inicial da transação: `Pendente`.

## Passo a Passo
1. Preencher a `Classificação` (ex: `Devolução` com o texto no campo `Descrição`).
2. Clicar no botão `Salvar Rascunho`.
3. Observar a notificação de confirmação e a atualização do badge no cabeçalho.
4. Sair da página e retornar à rota do pagamento (`/coordenador/prestacao-financeira/classificar-credito/:paymentId`).

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/classificar-credito/paymentId_credito_01`
- Classificação: `Devolução`
- Descrição: `Devolução referente ao saldo remanescente de diárias.`

## Resultado Esperado
- O sistema exibe notificação de confirmação ("Rascunho salvo com sucesso").
- O badge de status no banner de cabeçalho atualiza de `Pendente` para **`Em Rascunho`**.
- Ao recarregar a página ou navegar de volta a ela, os dados salvos permanecem preenchidos e editáveis.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
