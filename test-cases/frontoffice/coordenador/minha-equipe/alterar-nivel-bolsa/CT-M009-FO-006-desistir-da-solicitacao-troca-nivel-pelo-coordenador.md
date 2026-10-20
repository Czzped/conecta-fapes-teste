## ID do Cenário
[CT-M009-FO-006]

## Título
Desistir da solicitação de alteração de nível pelo coordenador e descongelar a bolsa de origem

## Requisito/História Relacionada
- Requisito/Issue: https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/714 (Feature: https://github.com/leds-conectafapes/conectafapes-project/issues/2550, Subtarefas: #2674, #2675)
- Regra Canônica: M009: RN10 (Encerramento/Desistência), FR-013 (Descongelamento da origem)
- Contrato/API: `POST /api/solicitacoes-alteracao-nivel/{id}/desistir`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Bolsista possui solicitação de alteração de nível em andamento (`Status = PENDENTE` ou `EM_AVALIACAO`).
- Bolsa de origem está congelada exibindo rótulo "Em espera".

## Passo a Passo
1. Acessar `/coordenador/minha-equipe`.
2. Acessar a tela de Detalhes do bolsista (`Minha Equipe › Bolsistas do Projeto › Detalhes`).
3. No bloco que detalha a alteração de nível em andamento, localizar e clicar no botão `Cancelar solicitação de troca`.
4. Observar a exibição do modal de confirmação de desistência.
5. No modal, ler o aviso e clicar no botão de confirmação `Confirmar cancelamento da troca`.
6. Aguardar o processamento e retorno da aplicação.

## Dados de Entrada
- Rota: `/coordenador/minha-equipe` › Detalhes do bolsista
- ID da solicitação: `solicitacaoAlteracaoNivelId`
- Ação: Confirmação de desistência

## Resultado Esperado
- A requisição `POST /api/solicitacoes-alteracao-nivel/{id}/desistir` é executada com sucesso (`HTTP 200`).
- Em uma única transação no backend:
  - O registro `SolicitacaoAlteracaoNivel` é atualizado para o status `CANCELADA`.
  - A bolsa nova vinculada é atualizada para o status `DESCARTADO` (ou interino `INDEFINIDO`), sendo removida das contagens de orçamento e filas de avaliação.
- A bolsa de origem é descongelada imediatamente:
  - Remove o rótulo "Em espera", retornando ao status visual normal `Ativa`.
  - As ações normais (`Cancelar bolsa`, `Estender bolsa`, `Editar`) voltam a ficar habilitadas.
  - O sistema passa a permitir a criação de uma nova solicitação de alteração de nível para o bolsista, caso desejado.
- Exibição de mensagem/toast de sucesso: "Solicitação de alteração de nível cancelada com sucesso."

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
