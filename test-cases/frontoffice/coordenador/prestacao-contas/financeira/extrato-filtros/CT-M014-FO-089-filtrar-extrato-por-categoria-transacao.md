## ID do Cenário
[CT-M014-FO-089]

## Título
Filtrar extrato financeiro por categoria da transação (Crédito ou Débito)

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Extrato de Prestação Financeira (`/coordenador/financeira`)
- Regra Canônica: M014: `RN02` / `RN11` (Filtro e listagem de movimentos bancários importados)
- Contrato/API: `M014: ConsultarExtratoFinanceiro`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto com movimentações financeiras de Crédito e Débito importadas do extrato bancário.

## Passo a Passo
1. Acessar a rota da prestação financeira (`/coordenador/financeira`).
2. Localizar o painel de filtros do extrato no topo da listagem.
3. No campo de filtro por `Categoria` / `Tipo de Transação`, selecionar a opção `Crédito`.
4. Observar a atualização da tabela de extrato.
5. Alterar a seleção do filtro para `Débito`.
6. Observar novamente a tabela.
7. Selecionar a opção `Todos` (ou limpar o filtro).

## Dados de Entrada
- Rota: `/coordenador/financeira`
- Filtro Categoria:
  - Opção 1: `Crédito`
  - Opção 2: `Débito`
  - Opção 3: `Todos`

## Resultado Esperado
- **Filtro `Crédito`:** A tabela de extrato exibe exclusivamente os lançamentos de entrada/crédito (ex: aportes, rendimentos, estornos).
- **Filtro `Débito`:** A tabela de extrato exibe exclusivamente os lançamentos de saída/débito (ex: pagamentos, compras, diárias, passagens).
- **Filtro `Todos`:** A tabela restaura a exibição completa contendo tanto créditos quanto débitos em ordem cronológica.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
