## ID do Cenário
[CT-M014-FO-014]

## Título
Validar exibição do Controle de Gastos com orçamento zerado no início do projeto

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, seção Controle de Gastos.
- M013: RN06 / RI-SLD1 (invariante de saldos do orçamento).
- M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo recém-iniciado selecionado, com orçamento total aprovado de R$ 500.000,00 e nenhuma despesa executada/consumida até o momento (R$ 0,00).

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. Localizar a seção `Controle de Gastos`.
4. Inspecionar o percentual, valor gasto, barra de progresso e saldos por categoria.

## Dados de Entrada
- Perfil: `coordenador`.
- Orçamento Total: R$ 500.000,00.
- Despesas Consumidas: R$ 0,00.

## Resultado Esperado
- O percentual exibe `0.00% utilizado` (ou `0% utilizado`).
- O campo `Valor gasto` exibe `R$ 0,00`.
- A barra de progresso é renderizada com preenchimento zerado (0%).
- O campo `Total:` exibe `Total: R$ 500.000,00`.
- Na coluna `Total Consumido por Categoria`, todas as rubricas exibem `R$ 0,00`.
- Na coluna `Total Restante por Categoria`, todas as rubricas exibem seus valores integrais aprovados.

## Tipo de Teste
[ ] Positivo  [ ] Negativo  [x] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
