## ID do Cenário
[CT-M014-FO-032]

## Título
Validar exibição dos dados de crédito para devolução voluntária

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Detalhe e Comprovação de Transação
- Regra Canônica: M014: `RN09` (Restituição e devolução de saldo/rendimentos)
- Contrato/API: `M014: ConsultarTransacaoFinanceira`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de crédito decorrente de saldo não utilizado ou rendimento bancário.
- Status da comprovação em `RASCUNHO`.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira/:paymentId` referente a um crédito financeiro.
2. Na seção de classificação da entrada, selecionar o tipo "Devolução Voluntária / Restituição de Saldo".
3. Verificar a exibição dos campos de dados cadastrais da devolução.

## Dados de Entrada
- Perfil: `coordenador`.
- Transação ID: `paymentId_credito_02`
- Valor do Crédito: `R$ 150,00`

## Resultado Esperado
- A tela exibe as opções específicas para restituição de saldo.
- O campo de vínculo a notas fiscais é desativado.
- Os campos para classificação do motivo e anexo do documento oficial de recolhimento são disponibilizados.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
