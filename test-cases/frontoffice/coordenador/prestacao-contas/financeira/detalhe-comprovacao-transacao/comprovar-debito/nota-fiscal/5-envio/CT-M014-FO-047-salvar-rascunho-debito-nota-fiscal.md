## ID do Cenário
[CT-M014-FO-047]

## Título
Salvar rascunho da comprovação de débito com Nota Fiscal

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014: `RN05` / `RN08` (Manutenção do estado Em Rascunho para débitos)
- Contrato/API: `M014: SalvarRascunhoComprovacao`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Formulário de comprovação de débito preenchido parcialmente ou totalmente.

## Passo a Passo
1. Clicar no botão `Salvar rascunho` no canto inferior direito da tela.
2. Observar a notificação e a manutenção das informações na tela.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Status Inicial: `Em Rascunho`

## Resultado Esperado
- O sistema exibe notificação de confirmação ("Rascunho salvo com sucesso").
- O badge no banner de cabeçalho mantém o status `Em Rascunho` (badge cinza).
- Os dados e anexos salvos continuam editáveis ao retornar à página.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
