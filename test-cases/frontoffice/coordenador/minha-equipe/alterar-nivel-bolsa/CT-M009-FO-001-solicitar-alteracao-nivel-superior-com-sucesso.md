## ID do Cenário
[CT-M009-FO-001]

## Título
Solicitar alteração de nível de bolsa para nível superior com sucesso

## Requisito/História Relacionada
- Requisito/Issue: https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/714 (Feature: https://github.com/leds-conectafapes/conectafapes-project/issues/2550, Subtarefas: #2674, #2675)
- Regra Canônica: M009: RN01 (Cotas e orçamento), RN04 (Avaliação documental), RI1 (Acúmulo pareado derivado no servidor), FR-013 (Congelamento da origem)
- Contrato/API: `POST /api/alocacoes-bolsistas/{id}/alterar-nivel`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado no contexto do portal.
- Bolsista com alocação ativa (`Status = ATIVA`), sem outra solicitação de troca em andamento.
- Projeto possui saldo orçamentário e cota disponível para comportar a coexistência da bolsa nova durante o período de análise (FR-005).

## Passo a Passo
1. Acessar o menu lateral e navegar para `Minha Equipe` (`/coordenador/minha-equipe`).
2. Localizar o bolsista ativo na listagem e clicar para abrir a tela de Detalhes (`Minha Equipe › Bolsistas do Projeto › Detalhes`).
3. Na aba `Informações`, localizar e clicar no botão de ação `Alterar Nível da Bolsa`.
4. No modal `Alterar Nível da Bolsa`, abrir o seletor `Novo Nível` e escolher um nível superior da mesma modalidade (ex.: transição de `BPIG-III` para `BPIG-I`).
5. No campo `Data de Início`, selecionar ou preencher uma data válida (primeiro dia do mês de início desejado, ex.: `01/11/2026`).
6. Clicar no botão primário `Confirmar`.
7. Aguardar a resposta da requisição e o toast de confirmação.

## Dados de Entrada
- Rota: `/coordenador/minha-equipe`
- Modalidade atual: `BPIG` (Nível `BPIG-III` 100%)
- Novo Nível selecionado: `BPIG-I` (100%)
- Data de Início: `01/11/2026`

## Resultado Esperado
- A requisição `POST /api/alocacoes-bolsistas/{id}/alterar-nivel` é disparada com sucesso (`HTTP 200/201`).
- O sistema cria o registro `SolicitacaoAlteracaoNivel` com status `PENDENTE` e a nova `AlocacaoBolsista` vinculada com status `DOCUMENTACAO_PENDENTE`.
- A bolsa de origem permanece com status de domínio `ATIVA` e continua gerando pagamentos normalmente.
- Na interface, a bolsa de origem passa a exibir o selo de UI "Em espera" (derivado da existência da solicitação pendente).
- O bolsista permanece exibido como uma única alocação na listagem de `Minha Equipe` (sem duplicação de linha), e a tela de Detalhes exibe o bloco da alteração de nível em andamento ("Em análise").
- Os botões de Cancelar bolsa, Estender bolsa e Editar da bolsa de origem são desabilitados com tooltip explicativo (FR-013).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
