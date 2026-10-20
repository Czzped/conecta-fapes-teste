## ID do Cenário
[CT-M009-BO-002]

## Título
Reprovar solicitação de alteração de nível mantendo a bolsa de origem ativa e descongelada

## Requisito/História Relacionada
- Requisito/Issue: https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/714 (Feature: https://github.com/leds-conectafapes/conectafapes-project/issues/2550, Subtarefas: #2676, #3024)
- Regra Canônica: M009: RN05 (Tratamento de reprovação), FR-013 (Descongelamento da origem na reprovação)
- Contrato/API: `POST /api/solicitacoes-alteracao-nivel/{id}/reprovar`

## Pré-condições
- Usuário autenticado com o perfil `analista_fapes` ou `administrador`.
- Solicitação de alteração de nível em análise com documentação reprovada ou requisitos não atendidos.
- Bolsa de origem do bolsista permanece `ATIVA` e congelada.

## Passo a Passo
1. Acessar `/gestao-bolsa/visualizar-pendencias` e abrir a pendência de alteração de nível do bolsista.
2. Na tela de `Documentos do Bolsista`, descer até o rodapé e clicar no botão `Reprovar Solicitação`.
3. No modal de reprovação, verificar o campo obrigatório de justificativa.
4. Tentar submeter com a justificativa vazia ou com menos de 3 caracteres (validar bloqueio).
5. Preencher uma justificativa válida e detalhada (ex.: "Comprovante de titulação não atende aos requisitos mínimos exigidos para o nível BPIG-I.").
6. Clicar no botão de confirmação `Confirmar Reprovação`.
7. Aguardar a resposta da API.

## Dados de Entrada
- Rota: `/gestao-bolsa/documentos-bolsista/{idAlocacao}`
- Justificativa informada: "Comprovante de titulação não atende aos requisitos mínimos exigidos para o nível BPIG-I."

## Resultado Esperado
- A requisição `POST /api/solicitacoes-alteracao-nivel/{id}/reprovar` é executada com sucesso (`HTTP 200`).
- No banco de dados:
  - A nova `AlocacaoBolsista` passa ao status `REPROVADA` (permanece no banco de dados para preservação de rastreabilidade e histórico, sem hard-delete).
  - A `SolicitacaoAlteracaoNivel` passa ao status `REPROVADA`, armazenando a justificativa e o identificador do analista.
  - A bolsa de origem **continua com status `ATIVA`**, sem nenhuma interrupção de pagamentos ou necessidade de reativação manual.
- O congelamento da bolsa de origem é cancelado (FR-013), permitindo ao coordenador realizar novas ações ou submeter nova solicitação no portal.
- A tela passa ao estado somente leitura exibindo a faixa: "Alteração de nível reprovada", com data, avaliador e justificativa.

## Tipo de Teste
[x] Positivo  [x] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
