## ID do Cenário
[CT-M014-FO-115]

## Título
Validar limpeza automática da seleção múltipla de débitos ao mudar de página ou alterar filtro no extrato

## Requisito/História Relacionada
- Requisito/Issue: #2943 / Seção B2 (Integridade da seleção múltipla na listagem de extrato)
- Regra Canônica: M014: `RN02` (Controle de estado reativo de seleção de transações no extrato)
- Contrato/API: `M014: ListarTransacoesFinanceiras`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Acessar a listagem de extrato com quantidade de lançamentos suficiente para gerar múltiplas páginas.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Na Página 1 da listagem de extrato, marcar o checkbox de 2 débitos pendentes.
3. Navegar para a Página 2 da paginação (ou aplicar um filtro de busca por descrição/categoria).
4. Verificar o estado da barra de ações de seleção e dos checkboxes da listagem.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira`
- Ação: Marcar checkboxes na Página 1 → Clicar na Página 2 de paginação

## Resultado Esperado
- A seleção prévia dos débitos da Página 1 é **limpa automaticamente** ao trocar de página ou alterar filtros.
- A aplicação impede que o usuário crie involuntariamente uma prestação associando transações invisíveis fora do viewport/página atual.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
