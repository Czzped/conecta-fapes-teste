## ID do Cenário
[CT-M014-FO-017]

## Título
Filtrar transações por status da prestação

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, filtros do Extrato do Projeto.
- M014: `ConsultarPrestacaoContas` / Estados da Prestação (`Rascunho`, `Em Validação`, `Validado`, `Reprovado`, etc.).

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado contendo transações com diferentes status (`Pendente`, `Em Validação`, `Validado`, `Reprovado`).

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. Localizar o seletor dropdown `Status` na barra de filtros.
4. Clicar no dropdown e selecionar a opção `Pendente`.
5. Inspecionar a listagem de transações.

## Dados de Entrada
- Perfil: `coordenador`.
- Status selecionado: `Pendente`.

## Resultado Esperado
- A listagem exibe exclusivamente as transações que possuem a badge de status `Pendente`.
- Transações com status `Validado`, `Em Validação` ou `Reprovado` são ocultadas da visualização.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
