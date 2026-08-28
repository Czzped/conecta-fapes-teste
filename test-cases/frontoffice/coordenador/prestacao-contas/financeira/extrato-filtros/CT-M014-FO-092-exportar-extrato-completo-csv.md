## ID do Cenário
[CT-M014-FO-092]

## Título
Exportar extrato completo de transações em arquivo CSV com sucesso

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Extrato de Prestação Financeira (`/coordenador/financeira`)
- Regra Canônica: M014: `RN02` / `RN09` (Exportação e auditoria de movimentações bancárias)
- Contrato/API: `M014: ExportarExtratoCSV`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transações financeiras cadastradas no projeto.
- Botão `Exportar CSV` com ícone de download visível no canto superior direito do painel de filtros.

## Passo a Passo
1. Acessar a rota da prestação financeira (`/coordenador/financeira`).
2. Sem aplicar nenhum filtro, clicar no botão `Exportar CSV`.
3. Observar o início do download do arquivo no navegador.
4. Abrir o arquivo `.csv` baixado e inspecionar a estrutura de colunas e dados.

## Dados de Entrada
- Rota: `/coordenador/financeira`
- Ação: Clique no botão `Exportar CSV`

## Resultado Esperado
- O navegador realiza o download de um arquivo com nome padronizado (ex: `extrato_financeiro_PROJETO_2026-08-28.csv`).
- O arquivo `.csv` gerado utiliza codificação UTF-8 e separador padrão de colunas (vírgula ou ponto-e-vírgula).
- O arquivo contém os cabeçalhos das colunas correspondentes ao extrato (`Pagamento`, `Valor`, `Data`, `Destinatário`, `Status`).
- Todos os registros da base do projeto são exportados no arquivo.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
