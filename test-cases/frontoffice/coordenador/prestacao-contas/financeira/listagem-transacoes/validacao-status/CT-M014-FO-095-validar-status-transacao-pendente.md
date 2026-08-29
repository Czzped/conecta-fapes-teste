## ID do Cenário
[CT-M014-FO-095]

## Título
Validar exibição e comportamento da transação com status Pendente na listagem do extrato

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Extrato de Prestação Financeira (`/coordenador/financeira`)
- Regra Canônica: M014: `RI4` (Status de transação sem vínculo com prestação: PENDENTE)
- Contrato/API: `M014: ConsultarExtratoFinanceiro`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação bancária importada (via CNAB 240) que ainda não foi associada a nenhuma comprovação/prestação.

## Passo a Passo
1. Acessar a rota da prestação financeira (`/coordenador/financeira`).
2. Localizar na listagem uma transação sem comprovação iniciada.
3. Observar a exibição do badge de `Status`.
4. Clicar na seta/linha da transação (`>`).

## Dados de Entrada
- Rota: `/coordenador/financeira`
- Status Esperado: `Pendente` (badge amarelo ou neutro)

## Resultado Esperado
- A transação exibe o badge de status `Pendente`.
- Ao clicar no registro, o coordenador é redirecionado para a tela de classificação/comprovação correspondente com o formulário limpo e liberado para preenchimento.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
