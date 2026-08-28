## ID do Cenário
[CT-M014-FO-048]

## Título
Enviar comprovação final de débito com Nota Fiscal com sucesso

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014: `RN10` (Submissão final da comprovação de débito e transição para Em Análise)
- Contrato/API: `M014: SubmeterComprovacaoDebito`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Todas as 4 seções obrigatoriamente concluídas:
  1. `1. Informações Gerais *` (Documento selecionado)
  2. `2. Adicionar Descrição e Anexar Nota Fiscal *` (Descrição preenchida e NF-e enviada/confirmada)
  3. `3. Associar Compra *` (Todos os itens associados a categorias contábeis)
  4. `4. Cotação` (3 cotações enviadas e menor valor selecionado, se item > R$ 1.400)

## Passo a Passo
1. Revisar o preenchimento de todas as seções do formulário.
2. Clicar no botão primário ciano `Enviar` no rodapé da página.
3. Confirmar o envio na modal de confirmação.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`

## Resultado Esperado
- O sistema processa o envio da comprovação.
- O status transiciona de `Em Rascunho` para `Em Análise`.
- O formulário e seus anexos são bloqueados contra edições adicionais.
- O usuário é redirecionado de volta ao extrato ou recebe notificação de sucesso.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
