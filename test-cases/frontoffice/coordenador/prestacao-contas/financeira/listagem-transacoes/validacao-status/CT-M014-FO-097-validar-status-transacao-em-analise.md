## ID do Cenário
[CT-M014-FO-097]

## Título
Validar exibição e bloqueio de edições na transação com status Em Análise na listagem do extrato

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Extrato de Prestação Financeira (`/coordenador/financeira`)
- Regra Canônica: M014: `RN03` / `RI4` (Status de transação com prestação em EM_ANALISE: bloqueio total de edição)
- Contrato/API: `M014: ConsultarExtratoFinanceiro`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação com comprovação submetida finalizada e sob análise da equipe técnica FAPES.

## Passo a Passo
1. Acessar a rota da prestação financeira (`/coordenador/financeira`).
2. Localizar na listagem a transação sob análise.
3. Observar a exibição do badge de `Status`.
4. Clicar no registro para visualizar os detalhes.

## Dados de Entrada
- Rota: `/coordenador/financeira`
- Status Esperado: `Em Análise` (badge azul)

## Resultado Esperado
- A transação exibe o badge de status `Em Análise`.
- Ao acessar os detalhes, a tela é aberta em modo de **somente leitura**, com formulários, anexos e botões de ação totalmente bloqueados contra edições (conforme `RN03`).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
