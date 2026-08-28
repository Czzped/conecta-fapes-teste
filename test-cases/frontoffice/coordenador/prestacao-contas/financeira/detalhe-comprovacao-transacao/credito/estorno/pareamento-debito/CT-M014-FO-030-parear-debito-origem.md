## ID do Cenário
[CT-M014-FO-030]

## Título
Parear transação de crédito com débito de origem

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Detalhe e Comprovação de Transação
- Regra Canônica: M014: `RN08` / `RI-EST02` (Pareamento e vínculo mudo de estorno)
- Contrato/API: `M014: ParearTransacaoEstorno`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de crédito aberta no modo de edição/rascunho.
- Existe um débito anterior registrado no extrato do projeto com valor idêntico ou compatível referente ao fornecedor/compra cancelada.

## Passo a Passo
1. Na tela de detalhe do crédito (`/coordenador/prestacao-financeira/:paymentId`), selecionar a opção "Estorno de Fornecedor".
2. Clicar no botão "Selecionar Débito de Origem".
3. Na modal de busca, localizar a transação de débito correspondente à compra cancelada.
4. Marcar a transação de débito desejada e clicar em "Vincular e Parear".

## Dados de Entrada
- Valor do Crédito: `R$ 450,00`
- Transação Débito Selecionada: `ID_DEBITO_1042` (Valor: `R$ 450,00`, Data: `10/05/2026`).

## Resultado Esperado
- O sistema estabelece o vínculo entre o crédito e o débito selecionado.
- O indicador de "Saldo Líquido do Par" exibe o valor calculado de `R$ 0,00` (anulação mútua).
- O débito vinculado é exibido no card de resumo de pareamento.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
