## ID do Cenário
[CT-M014-FO-071]

## Título
Selecionar tipo de documento Invoice (Pagamento Internacional) na comprovação de débito

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (`/coordenador/prestacao-financeira/detalhes/:paymentId`)
- Regra Canônica: M014: `RN05` (Comprovação de despesas internacionais via Invoice)
- Contrato/API: `M014: ConsultarTransacaoFinanceira`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação do tipo Débito pendente de comprovação selecionada no extrato.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira/detalhes/:paymentId`.
2. Na seção `1. Informações Gerais *`, clicar no select `Documento`.
3. Selecionar a opção `Invoice (Pagamento Internacional)`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_invoice_01`
- Campo Documento: `Invoice (Pagamento Internacional)`

## Resultado Esperado
- A opção `Invoice (Pagamento Internacional)` é selecionada com sucesso.
- Um banner informativo azul é exibido com o texto: *"Envie o comprovante de pagamento (Invoice), que deve ter o nome do coordenador, descrição do item, quantidade, valor e identificação do fornecedor. Se foi usado um cartão de crédito para realizar o pagamento final, também envie a imagem fatura do Cartão do Coordenador em que consta a compra."*.
- O campo `Descrição` exibe o placeholder *"Descreva o contexto do Invoice"*.
- A tela exibe as seções `2. Anexar Arquivos do Invoice *`, `3. Informações do Invoice *` e `4. Associar Itens do Invoice *`.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
