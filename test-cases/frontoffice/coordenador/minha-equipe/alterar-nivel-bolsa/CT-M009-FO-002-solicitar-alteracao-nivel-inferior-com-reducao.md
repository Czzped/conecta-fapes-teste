## ID do Cenário
[CT-M009-FO-002]

## Título
Solicitar alteração de nível de bolsa para nível inferior com redução de sessenta por cento

## Requisito/História Relacionada
- Requisito/Issue: https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/714 (Feature: https://github.com/leds-conectafapes/conectafapes-project/issues/2550, Subtarefas: #2639, #2674, #2675)
- Regra Canônica: M009: RN01 (Cotas e orçamento), RN08 (Vigência da bolsa), FR-005 (Dupla contagem), FR-013 (Origem congelada)
- Contrato/API: `POST /api/alocacoes-bolsistas/{id}/alterar-nivel`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado no contexto do portal.
- Bolsista com alocação ativa em nível integral (`PossuiReducaoBolsa = false`, ex.: `BPIG-I`).
- Projeto possui saldo orçamentário e cota no balde do nível destino reduzido (`BPIG-II (60%)`).

## Passo a Passo
1. Acessar `/coordenador/minha-equipe`.
2. Acessar a tela de Detalhes do bolsista ativo (`Minha Equipe › Bolsistas do Projeto › Detalhes`).
3. Na aba `Informações`, clicar no botão `Alterar Nível da Bolsa`.
4. No modal `Alterar Nível da Bolsa`, abrir o dropdown `Novo Nível`.
5. Selecionar a opção de nível inferior com redução de 60% (ex.: `BPIG-II (60%)`).
6. Preencher o campo `Data de Início` com uma data válida futura (ex.: `01/12/2026`).
7. Clicar no botão primário `Confirmar`.
8. Aguardar o processamento e a mensagem de retorno.

## Dados de Entrada
- Nível Atual: `BPIG-I` (100%, sem redução)
- Novo Nível selecionado: `BPIG-II (60%)`
- Data de Início: `01/12/2026`
- Payload enviado: `{ alocacaoId: "...", versaoNivelId: "...", dataInicio: "2026-12-01", possuiReducaoBolsa: true }`

## Resultado Esperado
- A solicitação é enviada e aceita pelo backend gravando os três campos necessários: `VersaoNivel`, `PossuiReducaoBolsa = true` e `DataInicio`.
- Criação da `SolicitacaoAlteracaoNivel` (`PENDENTE`) vinculando a origem à nova alocação (`DOCUMENTACAO_PENDENTE`).
- A bolsa de origem permanece `ATIVA`, exibindo na interface o badge "Em espera".
- O bloco de alteração na tela de Detalhes exibe o novo nível solicitado com a tag indicativa de redução de valor (60%).
- A bolsa de origem é congelada para edições, cancelamento e aditivos até a conclusão do fluxo (FR-013).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
