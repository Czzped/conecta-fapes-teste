## ID do Cenário
[CT-M014-FO-085]

## Título
Enviar comprovação final de débito de Invoice com sucesso

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RN10` (Submissão final da comprovação de Invoice e transição para Em Análise)
- Contrato/API: `M014: SubmeterComprovacaoDebito`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Todas as 4 seções obrigatoriamente concluídas:
  1. `1. Informações Gerais *` (Documento e descrição preenchidos)
  2. `2. Anexar Arquivos do Invoice *` (Arquivo do Invoice anexado)
  3. `3. Informações do Invoice *` (Valor Original, Moeda, Taxa de Câmbio, Data confirmados)
  4. `4. Associar Itens do Invoice *` (Pelo menos um item associado a categoria/item do Edital)

## Passo a Passo
1. Revisar todas as 4 seções preenchidas do formulário.
2. Clicar no botão primário ciano `Enviar` no rodapé da página.
3. Confirmar o envio na modal de confirmação (se exibida).

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_invoice_01`

## Resultado Esperado
- O sistema processa e submete a comprovação de Invoice.
- O status da transação transiciona de `Em Rascunho` para `Em Análise`.
- O formulário e todos os anexos são bloqueados contra edições posteriores.
- O usuário recebe confirmação de sucesso ou é redirecionado ao extrato financeiro.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
