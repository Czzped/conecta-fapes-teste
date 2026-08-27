## ID do Cenário
[CT-M014-FO-019]

## Título
Combinar múltiplos filtros simultâneos no Extrato do Projeto

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, filtros do Extrato do Projeto.
- M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado com base de transações variadas.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. No campo `Pesquisar`, digitar `Amazon`.
4. No campo `Status`, selecionar `Pendente`.
5. Inspecionar as transações filtradas.

## Dados de Entrada
- Perfil: `coordenador`.
- Busca: `Amazon`.
- Status: `Pendente`.

## Resultado Esperado
- O sistema aplica a conjunção lógica (AND) dos filtros.
- A listagem exibe unicamente transações que contenham o termo `Amazon` E que possuam o status `Pendente`.
- Transações com `Amazon` mas com outros status (ex.: `Validado`), ou transações `Pendente` de outros terceiros não são exibidas.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
