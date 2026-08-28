## ID do Cenário
[CT-M014-FO-029]

## Título
Validar exibição dos dados de crédito para estorno

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Detalhe e Comprovação de Transação
- Regra Canônica: M014: `RN08` / `RI-EST01` (Crédito de estorno)
- Contrato/API: `M014: ConsultarTransacaoFinanceira`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação do tipo CRÉDITO (entrada financeira) selecionada no extrato do projeto.
- Status da comprovação em `RASCUNHO`.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira/:paymentId` referente a um lançamento de crédito.
2. Aguardar o carregamento da página de detalhe.
3. Inspecionar o cabeçalho e o card principal da transação.
4. Verificar se a opção de classificação como "Estorno de Fornecedor / Devolução de Compra" está disponível.

## Dados de Entrada
- Perfil: `coordenador`.
- Transação ID: `paymentId_credito_01`
- Valor do Crédito: `R$ 450,00`
- Natureza: Crédito bancário.

## Resultado Esperado
- Os dados gerais do crédito (valor, data, banco, conta) são exibidos corretamente.
- O sistema identifica o lançamento como CRÉDITO e apresenta as opções exclusivas de conciliação de entrada (Estorno ou Devolução Voluntária).
- A seção de anexar nota fiscal/invoice de débito permanece oculta ou desativada.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
