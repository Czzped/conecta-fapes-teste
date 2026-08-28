## ID do Cenário
[CT-M014-FO-056]

## Título
Salvar rascunho da comprovação de débito de passagem

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014: `RN05` / `RN08` (Manutenção do estado Em Rascunho)
- Contrato/API: `M014: SalvarRascunhoComprovacao`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Dados e anexos da passagem preenchidos parcialmente no formulário.

## Passo a Passo
1. Clicar no botão `Salvar rascunho` no canto inferior direito da tela.
2. Observar a notificação e a manutenção das informações salvas.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_passagem_01`
- Status Inicial: `Em Rascunho`

## Resultado Esperado
- O sistema exibe notificação de confirmação ("Rascunho salvo com sucesso").
- O badge no banner de cabeçalho mantém o status `Em Rascunho` (badge cinza).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
