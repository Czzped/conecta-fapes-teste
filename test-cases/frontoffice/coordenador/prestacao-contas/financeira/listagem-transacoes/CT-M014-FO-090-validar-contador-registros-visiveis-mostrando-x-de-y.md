## ID do Cenário
[CT-M014-FO-090]

## Título
Validar contador e indicador de registros visíveis (Mostrando X de Y) na listagem de transações

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Extrato de Prestação Financeira (`/coordenador/financeira`)
- Regra Canônica: M014: `RN02` (Paginação e exibição quantitativa de movimentos bancários do extrato)
- Contrato/API: `M014: ConsultarExtratoFinanceiro`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto com lista de transações financeiras cadastradas que excedam o limite por página (ex: 111 transações).

## Passo a Passo
1. Acessar a rota da prestação financeira (`/coordenador/financeira`).
2. Observar o rodapé/cabeçalho da tabela de listagem de transações onde o componente de contagem é exibido.
3. Verificar o texto inicial exibido no formato `Mostrando X de Y` (ex: `Mostrando 10 de 111`).
4. Navegar para a próxima página da tabela.
5. Observar a atualização da contagem de itens visíveis.
6. Aplicar um filtro de busca ou filtro por categoria (ex: filtrar por `Crédito`).
7. Verificar se o número total `Y` é recalculado conforme o resultado filtrado.

## Dados de Entrada
- Rota: `/coordenador/financeira`
- Exemplo de dados: Total de 111 registros na base, 10 itens exibidos por página.

## Resultado Esperado
- O componente exibe corretamente o formato `Mostrando X de Y`, onde:
  - `X` representa a quantidade de itens atualmente visíveis na página da tabela.
  - `Y` representa o total geral de registros encontrados na consulta.
- Ao mudar de página ou alterar o limite de itens exibidos, a contagem `X` reflete a página atual.
- Ao aplicar um filtro, o valor total `Y` é recalculado dinamicamente para refletir apenas os registros correspondentes ao filtro ativo.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
