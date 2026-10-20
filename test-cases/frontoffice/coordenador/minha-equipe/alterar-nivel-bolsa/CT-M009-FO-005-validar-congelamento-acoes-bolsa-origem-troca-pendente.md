## ID do Cenário
[CT-M009-FO-005]

## Título
Validar congelamento de ações de cancelamento, aditivo e edição da bolsa de origem com troca pendente

## Requisito/História Relacionada
- Requisito/Issue: https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/714 (Feature: https://github.com/leds-conectafapes/conectafapes-project/issues/2550, Subtarefas: #2674, #2675)
- Regra Canônica: M009: FR-013 (Congelamento da bolsa origem enquanto a troca pende)
- Contrato/API: `POST /api/alocacoes-bolsistas/{id}/cancelar`, `POST /api/alocacoes-bolsistas/{id}/aditivo`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Bolsista possui alocação de origem com solicitação de alteração de nível em andamento (`Status = PENDENTE` ou `EM_AVALIACAO`).
- Bolsa de origem exibe o rótulo "Em espera".

## Passo a Passo
1. Acessar `/coordenador/minha-equipe`.
2. Acessar a tela de Detalhes do bolsista em questão (`Minha Equipe › Bolsistas do Projeto › Detalhes`).
3. Inspecionar a interface e os botões de ação da alocação (`Cancelar bolsa`, `Estender bolsa / Aditivo`, `Editar`).
4. Posicionar o cursor (hover) sobre cada uma das ações desabilitadas.
5. (Via inspeção de API / requisição direta) Tentar disparar uma chamada direta `POST /api/alocacoes-bolsistas/{id}/cancelar` ou `POST /api/alocacoes-bolsistas/{id}/aditivo` para o ID da bolsa de origem.
6. Observar a resposta do backend.

## Dados de Entrada
- `alocacaoId`: ID da bolsa de origem associada à `SolicitacaoAlteracaoNivel` pendente.
- Ação tentada: Cancelamento direto ou extensão por aditivo.

## Resultado Esperado
- Na interface, as ações `Cancelar bolsa`, `Estender bolsa` e `Editar` encontram-se desabilitadas.
- O tooltip em cada ação desabilitada informa expressamente o motivo: "Existe uma alteração de nível em andamento para este bolsista. Para executar esta ação, desista da troca primeiro."
- No backend, qualquer tentativa de cancelamento, aditivo, atualização ou exclusão direta da bolsa de origem é estritamente barrada retornando erro de domínio (`HTTP 409 Conflict` ou `422 Unprocessable Entity`), impedindo inconsistências no ciclo de vida da bolsa.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
