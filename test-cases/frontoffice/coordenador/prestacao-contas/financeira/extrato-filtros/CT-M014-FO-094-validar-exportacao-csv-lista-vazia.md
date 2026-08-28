## ID do Cenário
[CT-M014-FO-094]

## Título
Validar comportamento do botão Exportar CSV quando a listagem de transações estiver vazia

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Extrato de Prestação Financeira (`/coordenador/financeira`)
- Regra Canônica: M014: `RN02` (Exportação com resultado de busca sem registros)
- Contrato/API: `M014: ExportarExtratoCSV`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Extrato financeiro sem registros ou com filtro aplicado que não retorne nenhum resultado (ex: busca por valor `R$ 999.999.999,00`).

## Passo a Passo
1. Acessar `/coordenador/financeira`.
2. Aplicar um filtro no painel que resulte em 0 transações encontradas.
3. Observar o estado do botão `Exportar CSV` ou clicar nele.

## Dados de Entrada
- Filtro Valor Mínimo: `R$ 999.999.999,00`
- Registros na tela: `0` (`Mostrando 0 de 0`)

## Resultado Esperado
- **Comportamento Esperado A:** O botão `Exportar CSV` fica desabilitado (disabled) quando a lista resultante for igual a 0.
- **Comportamento Esperado B (caso habilitado):** Ao clicar, o sistema exibe notificação informativa (*"Nenhuma transação encontrada para exportação."*) e não gera arquivo `.csv` vazio.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [x] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
