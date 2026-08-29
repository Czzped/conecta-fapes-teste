## ID do Cenário
[CT-M014-FO-099]

## Título
Validar exibição e estado terminal da transação com status Validado / Aprovada na listagem do extrato

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Extrato de Prestação Financeira (`/coordenador/financeira`)
- Regra Canônica: M014: `RN08` / `RI4` (Status terminal APROVADA / FINALIZADO — irreversível)
- Contrato/API: `M014: ConsultarExtratoFinanceiro`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação analisada e aprovada com parecer favorável emitido pela FAPES.

## Passo a Passo
1. Acessar a rota da prestação financeira (`/coordenador/financeira`).
2. Localizar na listagem a transação aprovada.
3. Observar a exibição do badge de `Status`.
4. Clicar no registro para inspecionar os detalhes.

## Dados de Entrada
- Rota: `/coordenador/financeira`
- Status Esperado: `Validado` ou `Aprovada` (badge verde)

## Resultado Esperado
- A transação exibe o badge de status `Validado` / `Aprovada` na cor verde.
- Ao acessar a tela de detalhes, a comprovação é exibida como finalizada/aprovada em caráter irreversível (conforme `RN08`), permanecendo bloqueada contra qualquer edição posterior.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
