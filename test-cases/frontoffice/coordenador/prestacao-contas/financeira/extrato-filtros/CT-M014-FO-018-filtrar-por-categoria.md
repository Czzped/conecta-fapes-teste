## ID do Cenário
[CT-M014-FO-018]

## Título
Filtrar transações por categoria de rubrica orçamentária

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, filtros do Extrato do Projeto.
- M013: `RubricaProjeto` / M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado com transações associadas a diferentes categorias de despesa (ex.: Material Permanente, Material de Consumo, Passagem, Diária).

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. Localizar o seletor dropdown `Categoria` na barra de filtros.
4. Selecionar a opção `Material Permanente`.
5. Inspecionar a listagem de transações.

## Dados de Entrada
- Perfil: `coordenador`.
- Categoria selecionada: `Material Permanente`.

## Resultado Esperado
- A listagem exibe somente os pagamentos/transações classificados ou vinculados à rubrica `Material Permanente`.
- Despesas vinculadas a outras categorias são ocultadas.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
