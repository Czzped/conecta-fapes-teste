## ID do Cenário
[CT-M009-FO-010]

## Título
Validar exibição unificada do par de bolsas na listagem de Minha Equipe sem duplicação de linha

## Requisito/História Relacionada
- Requisito/Issue: https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/714 (Feature: https://github.com/leds-conectafapes/conectafapes-project/issues/2550, Subtarefas: #2674, #2686)
- Regra Canônica: M009: Regra de Apresentação de Membros do Par (o par representa uma única alocação contínua para o coordenador)
- Contrato/API: `GET /api/projetos/{id}/bolsistas`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado.
- Existe pelo menos um bolsista com alteração de nível solicitada e em andamento (`SolicitacaoAlteracaoNivel` com status `PENDENTE` ou `EM_AVALIACAO`).

## Passo a Passo
1. Acessar `/coordenador/minha-equipe`.
2. Observar a listagem principal de bolsistas do projeto (`BolsistasTab.vue` / `BolsistaListItem.vue`).
3. Localizar o bolsista que está em processo de alteração de nível.
4. Verificar o número de linhas exibidas para o referido bolsista.
5. Inspecionar os badges e informações da linha do bolsista na listagem.
6. Clicar no bolsista para abrir a tela de Detalhes (`Minha Equipe › Bolsistas do Projeto › Detalhes`).
7. Inspecionar os blocos apresentados na aba `Informações`.

## Dados de Entrada
- Rota: `/coordenador/minha-equipe`
- Bolsista com solicitação de troca em andamento: Nome `João da Silva`

## Resultado Esperado
- Na listagem de `Minha Equipe`, o bolsista `João da Silva` é exibido em **uma única linha** (não deve haver duas linhas separadas para o mesmo bolsista representando a bolsa antiga e a nova).
- A linha do bolsista na listagem exibe claramente o badge "Em espera", indicando que a bolsa atual está aguardando desfecho de alteração.
- Ao entrar nos Detalhes do bolsista, a tela apresenta:
  - As informações da alocação atual (origem) com rótulo "Em espera".
  - Um bloco/card integrado informando a troca em andamento: novo nível solicitado, data de início prevista e status "Em análise".
  - A experiência do usuário transmite com clareza que se trata da mesma vaga/alocação contínua do bolsista, sem poluição visual ou duplicidade de registros.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa

## Bugs Relacionados
- [BUG-M009-FO-NIV-002](bugs/BUG-M009-FO-NIV-002-ausencia-rotulo-em-espera-card-troca-detalhes.md) (Issue [#736](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/736)): Ausência do rótulo "Em espera" e de card informativo da troca de nível em curso na listagem e detalhes do bolsista.
