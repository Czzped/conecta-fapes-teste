## ID do Cenário
[CT-M014-FO-096]

## Título
Validar exibição e comportamento da transação com status Em Rascunho na listagem do extrato

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Extrato de Prestação Financeira (`/coordenador/financeira`)
- Regra Canônica: M014: `RI4` (Status de transação com prestação em RASCUNHO: EM_RASCUNHO)
- Contrato/API: `M014: ConsultarExtratoFinanceiro`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação com comprovantes/dados salvos parcialmente em rascunho pelo coordenador.

## Passo a Passo
1. Acessar a rota da prestação financeira (`/coordenador/financeira`).
2. Localizar na listagem a transação salva em rascunho.
3. Observar a exibição do badge de `Status`.
4. Clicar no registro para acessar os detalhes.

## Dados de Entrada
- Rota: `/coordenador/financeira`
- Status Esperado: `Em Rascunho` (badge cinza)

## Resultado Esperado
- A transação exibe o badge de status `Em Rascunho`.
- Ao clicar no registro, o formulário de comprovação é aberto com os dados previamente salvos e liberado para continuação da edição.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
