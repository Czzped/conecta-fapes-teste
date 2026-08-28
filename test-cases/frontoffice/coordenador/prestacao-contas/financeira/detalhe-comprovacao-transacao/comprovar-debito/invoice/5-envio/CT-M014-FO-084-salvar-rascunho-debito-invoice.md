## ID do Cenário
[CT-M014-FO-084]

## Título
Salvar rascunho da comprovação de débito de Invoice

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RN01` / `RN08` (Manutenção do estado Em Rascunho para edição posterior)
- Contrato/API: `M014: SalvarRascunhoComprovacao`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Dados do Invoice parcialmente preenchidos.

## Passo a Passo
1. Com o formulário de Invoice parcialmente preenchido, clicar no botão `Salvar rascunho` no rodapé da página.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_invoice_01`
- Status Inicial: `Em Rascunho`

## Resultado Esperado
- O sistema exibe notificação de sucesso (*"Rascunho salvo com sucesso"*).
- O badge `Status` permanece como `Em Rascunho`.
- Os dados preenchidos são persistidos e podem ser retomados em um próximo acesso.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
