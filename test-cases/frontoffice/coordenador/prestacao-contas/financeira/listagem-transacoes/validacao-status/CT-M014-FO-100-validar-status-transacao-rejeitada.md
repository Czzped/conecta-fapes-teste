## ID do Cenário
[CT-M014-FO-100]

## Título
Validar exibição e estado terminal da transação com status Rejeitada na listagem do extrato

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Extrato de Prestação Financeira (`/coordenador/financeira`)
- Regra Canônica: M014: `RN08` / `RI4` (Status terminal REJEITADA / NEGADO — parecer desfavorável)
- Contrato/API: `M014: ConsultarExtratoFinanceiro`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação analisada e rejeitada com parecer desfavorável pela FAPES.

## Passo a Passo
1. Acessar a rota da prestação financeira (`/coordenador/financeira`).
2. Localizar na listagem a transação recusada/rejeitada.
3. Observar a exibição do badge de `Status`.
4. Clicar no registro para inspecionar os detalhes e justificativas da rejeição.

## Dados de Entrada
- Rota: `/coordenador/financeira`
- Status Esperado: `Rejeitada` ou `Recusada` (badge vermelho)

## Resultado Esperado
- A transação exibe o badge de status `Rejeitada` na cor vermelha.
- Ao acessar a tela de detalhes, a comprovação é exibida como negada/rejeitada em caráter terminal (conforme `RN08`), exibindo os motivos da rejeição e bloqueada para novas edições diretas.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
