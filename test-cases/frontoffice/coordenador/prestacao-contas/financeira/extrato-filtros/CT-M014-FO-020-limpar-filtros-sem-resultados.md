## ID do Cenário
[CT-M014-FO-020]

## Título
Comportamento ao aplicar filtros sem correspondência e recuperação da listagem

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, filtros do Extrato do Projeto.
- M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado no contexto do portal.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. No campo `Pesquisar`, digitar um termo inexistente no extrato (ex.: `TermoInexistenteXYZ123`).
4. Observar o estado da listagem.
5. Apagar o texto do campo de busca.
6. Observar o estado da listagem após a limpeza.

## Dados de Entrada
- Perfil: `coordenador`.
- Termo de busca sem correspondência: `TermoInexistenteXYZ123`.

## Resultado Esperado
- Ao buscar pelo termo inexistente, a lista fica vazia (ou exibe mensagem indicando nenhum registro encontrado), sem quebrar a interface ou a paginação.
- Ao limpar o campo de busca, a listagem completa de transações do projeto é restaurada com sucesso.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
