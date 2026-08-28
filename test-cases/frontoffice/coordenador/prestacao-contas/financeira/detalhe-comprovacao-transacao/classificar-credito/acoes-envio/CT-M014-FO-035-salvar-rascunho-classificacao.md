## ID do Cenário
[CT-M014-FO-035]

## Título
Salvar rascunho da classificação de crédito

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Tela Classificar Crédito
- Regra Canônica: M014: `RN08` / `RN09` (Manutenção do estado rascunho)
- Contrato/API: `M014: SalvarRascunhoComprovacao`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de crédito com dados preenchidos no formulário (Estorno ou Devolução).

## Passo a Passo
1. Preencher a `Classificação` (ex: `Devolução` com a `Descrição`).
2. Clicar no botão `Salvar Rascunho`.
3. Sair da página e retornar à rota do pagamento (`/coordenador/prestacao-financeira/:paymentId`).

## Dados de Entrada
- Classificação: `Devolução`
- Descrição: `Teste de salvamento de rascunho.`

## Resultado Esperado
- O sistema exibe notificação de confirmação ("Rascunho salvo com sucesso").
- O status da transação permanece em amarelo como `Pendente`.
- Ao recarregar a página, as opções previamente selecionadas permanecem preenchidas.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
