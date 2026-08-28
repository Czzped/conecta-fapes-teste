## ID do Cenário
[CT-M014-FO-036]

## Título
Enviar classificação de crédito com sucesso

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Tela Classificar Crédito
- Regra Canônica: M014: `RN10` (Submissão final da comprovação e transição de estado)
- Contrato/API: `M014: SubmeterComprovacaoCredito`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Formulário de classificação (`1. Informações Gerais *`) totalmente preenchido conforme a modalidade escolhida (Estorno com Débito associado OU Devolução com Descrição válida).

## Passo a Passo
1. Preencher corretamente os campos da classificação escolhida.
2. Clicar no botão primário ciano `Enviar`.
3. Confirmar o envio se houver modal de confirmação.

## Dados de Entrada
- Classificação: `Estorno` (com débito associado) OU `Devolução` (com descrição válida)

## Resultado Esperado
- O sistema processa o envio com sucesso.
- O status da comprovação transiciona de `Pendente` para `Em Análise`.
- O formulário fica bloqueado para novas edições pelo coordenador.
- O usuário é redirecionado ou recebe feedback claro de conclusão.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
