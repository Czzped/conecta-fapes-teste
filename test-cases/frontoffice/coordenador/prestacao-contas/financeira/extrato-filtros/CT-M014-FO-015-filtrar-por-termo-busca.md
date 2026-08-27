## ID do Cenário
[CT-M014-FO-015]

## Título
Filtrar transações por termo de busca no Extrato do Projeto

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, filtros do Extrato do Projeto.
- M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado no contexto do portal com múltiplas transações importadas no extrato.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. Localizar o campo de texto `Pesquisar` na barra de filtros do Extrato do Projeto.
4. Digitar o termo `Magazine Luiza`.
5. Inspecionar a listagem de transações resultante.

## Dados de Entrada
- Perfil: `coordenador`.
- Termo de busca: `Magazine Luiza`.

## Resultado Esperado
- A listagem é filtrada em tempo real (ou após confirmação), exibindo exclusivamente as transações cujo favorecido/terceiro, tipo de movimento ou dados contenham o termo `Magazine Luiza`.
- Transações de outros favorecidos são ocultadas da listagem.
- A contagem da paginação é recalculada com base nos registros filtrados.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
