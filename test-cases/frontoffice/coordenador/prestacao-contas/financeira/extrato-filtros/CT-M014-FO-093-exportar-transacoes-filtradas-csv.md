## ID do Cenário
[CT-M014-FO-093]

## Título
Exportar apenas as transações filtradas em arquivo CSV

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Extrato de Prestação Financeira (`/coordenador/financeira`)
- Regra Canônica: M014: `RN02` / `RN11` (Filtro e exportação seletiva de movimentos bancários)
- Contrato/API: `M014: ExportarExtratoCSV`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Extrato financeiro contendo diversas transações de Crédito, Débito e diferentes status.

## Passo a Passo
1. Acessar `/coordenador/financeira`.
2. Aplicar um conjunto de filtros no painel (ex: selecionar `Categoria` = `Débito` e `Status` = `Em Rascunho`).
3. Verificar que a tabela na tela exibe apenas os registros correspondentes (ex: 5 registros).
4. Clicar no botão `Exportar CSV`.
5. Abrir o arquivo baixado e verificar a contagem e conteúdo das linhas.

## Dados de Entrada
- Filtro Categoria: `Débito`
- Filtro Status: `Em Rascunho`

## Resultado Esperado
- O arquivo `.csv` baixado contém **exclusivamente os registros que satisfazem os filtros ativos** na tela no momento do clique (ex: apenas as 5 transações de débito em rascunho).
- Transações que foram ocultadas pelos filtros da tela **não são incluídas** no arquivo CSV.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
