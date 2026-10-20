## ID do Cenário
[CT-M009-BO-003]

## Título
Validar encerramento de par e descongelamento da bolsa de origem por expiração do prazo de documentação via job

## Requisito/História Relacionada
- Requisito/Issue: https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/714 (Feature: https://github.com/leds-conectafapes/conectafapes-project/issues/2550, Subtarefas: #2676, #3024)
- Regra Canônica: M009: RN04 (Prazo de envio de documentação), Invariante de encerramento de par por expiração, FR-013 (Descongelamento da origem)
- Contrato/API: Job agendado `VerificarExpiracaoPrazoDocumentosBolsistaJob`

## Pré-condições
- Solicitação de alteração de nível criada, com a nova bolsa em status `DOCUMENTACAO_PENDENTE`.
- Bolsista não realizou o envio ou a regularização dos documentos exigidos dentro do prazo regulamentar (prazo expirado).
- Bolsa de origem encontra-se `ATIVA` e congelada ("Em espera").

## Passo a Passo
1. (Execução agendada ou manual em ambiente de homologação) Disparar a execução do job `VerificarExpiracaoPrazoDocumentosBolsistaJob`.
2. Acompanhar a execução dos logs e o processamento da alocação pendente cujo prazo expirou.
3. Consultar no banco de dados / API os registros de `AlocacaoBolsista` (origem e nova) e da `SolicitacaoAlteracaoNivel`.
4. Acessar o Portal Coordenador em `Minha Equipe › Bolsistas do Projeto › Detalhes` do respectivo bolsista.
5. Inspecionar o status da bolsa de origem e a disponibilidade do botão `Alterar Nível da Bolsa`.

## Dados de Entrada
- Nova alocação: `status = DOCUMENTACAO_PENDENTE`, `DataLimiteEnvio < DataAtual`
- Bolsa de origem: `status = ATIVA`, `estaCongelada = true`

## Resultado Esperado
- O job identifica a expiração do prazo e executa as seguintes transições:
  - A nova `AlocacaoBolsista` é atualizada para o status `INVALIDADA`.
  - O par na `SolicitacaoAlteracaoNivel` é formalmente encerrado, liberando o índice único de par aberto.
  - A bolsa de origem permanece no status `ATIVA` (sem interrupção de pagamentos) e é **automaticamente descongelada** (FR-013).
- No Portal Coordenador:
  - O rótulo "Em espera" é removido da bolsa de origem.
  - As ações normais da bolsa voltam a ficar ativas.
  - O botão `Alterar Nível da Bolsa` volta a ficar habilitado, permitindo que o coordenador inicie um novo pedido de alteração de nível para o bolsista se desejar.
- No Backoffice, a pendência exibe o estado somente leitura de prazo expirado com opção de arquivamento.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [x] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
