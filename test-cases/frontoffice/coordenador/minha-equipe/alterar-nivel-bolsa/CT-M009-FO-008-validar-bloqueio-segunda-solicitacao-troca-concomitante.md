## ID do Cenário
[CT-M009-FO-008]

## Título
Validar bloqueio de abertura de segunda solicitação de alteração de nível concomitante para a mesma bolsa

## Requisito/História Relacionada
- Requisito/Issue: https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/714 (Feature: https://github.com/leds-conectafapes/conectafapes-project/issues/2550, Subtarefas: #2674, #2675)
- Regra Canônica: M009: Invariante de Unicidade de Par Aberto (no máximo uma solicitação ativa por alocação de origem)
- Contrato/API: `POST /api/alocacoes-bolsistas/{id}/alterar-nivel`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Bolsista já possui uma solicitação de alteração de nível em andamento (`Status = PENDENTE` ou `EM_AVALIACAO`).

## Passo a Passo
1. Acessar `/coordenador/minha-equipe`.
2. Acessar os Detalhes do bolsista que já possui troca em andamento.
3. Verificar a disponibilidade do botão `Alterar Nível da Bolsa`.
4. (Simulação de requisição concorrente ou bypass de interface) Submeter diretamente um payload `POST /api/alocacoes-bolsistas/{id}/alterar-nivel` para o mesmo `alocacaoId` que já possui a solicitação em aberto.
5. Observar a resposta e o código de status retornado pelo servidor.

## Dados de Entrada
- `alocacaoId`: ID da bolsa que já tem `SolicitacaoAlteracaoNivel` pendente
- Payload: `{ versaoNivelId: "novo-nivel-id", dataInicio: "2026-12-01" }`

## Resultado Esperado
- Na interface gráfica, a ação `Alterar Nível da Bolsa` não deve estar disponível para abertura de novo pedido enquanto houver processo aberto.
- No backend, a tentativa de submissão concorrente ou duplicada é rejeitada com erro de conflito (`HTTP 409 Conflict`), disparado pela regra de negócio e pela restrição de índice único do par.
- O sistema retorna mensagem descritiva de erro: "Já existe uma solicitação de alteração de nível em andamento para esta bolsa."
- Nenhum segundo registro de `SolicitacaoAlteracaoNivel` ou nova alocação é persistido no banco de dados.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [x] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
