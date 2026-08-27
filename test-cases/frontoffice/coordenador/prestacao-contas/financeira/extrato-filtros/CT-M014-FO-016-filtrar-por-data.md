## ID do Cenário
[CT-M014-FO-016]

## Título
Filtrar transações por data no Extrato do Projeto

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, filtros do Extrato do Projeto.
- M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado com transações ocorridas em datas distintas (ex.: 27/02/2026, 25/02/2026, 18/02/2026).

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. Localizar o campo `Data` na barra de filtros.
4. Selecionar a data `2026-02-27` (ou formato DD/MM/AAAA conforme localidade).
5. Inspecionar as transações exibidas na listagem.

## Dados de Entrada
- Perfil: `coordenador`.
- Data selecionada: `27/02/2026`.

## Resultado Esperado
- A listagem exibe apenas as transações bancárias cuja data do movimento corresponde ao dia `27/02/2026`.
- Transações com datas anteriores ou posteriores são filtradas e não aparecem na listagem.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
