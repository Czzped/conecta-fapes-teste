## ID do Cenário
[CT-M014-FO-003]

## Título
Paginar o extrato financeiro do projeto

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, paginação do extrato.
- M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto selecionado com mais de 12 transações importadas (ex.: 24 transações divididas em 2 páginas).

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página 1.
3. Rolar até o final da listagem e localizar o controle de paginação (`UPagination`).
4. Clicar no número da página `2` (ou botão de próxima página).

## Dados de Entrada
- Perfil: `coordenador`.
- Massa de dados: 24 transações financeiras cadastradas.

## Resultado Esperado
- A página 2 é carregada exibindo as transações subsequentes (do 13º ao 24º registro).
- O indicador da página 2 fica selecionado/ativo.
- A navegação entre páginas não perde os filtros eventualmente aplicados.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
