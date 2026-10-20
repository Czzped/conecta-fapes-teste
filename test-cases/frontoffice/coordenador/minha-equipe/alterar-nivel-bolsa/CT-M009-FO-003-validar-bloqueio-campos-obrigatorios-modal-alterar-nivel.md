## ID do Cenário
[CT-M009-FO-003]

## Título
Validar bloqueio de submissão por campos obrigatórios não preenchidos no modal de alteração de nível

## Requisito/História Relacionada
- Requisito/Issue: https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/714 (Feature: https://github.com/leds-conectafapes/conectafapes-project/issues/2550, Subtarefas: #2674, #2686)
- Regra Canônica: M009: RN08 (Definição de vigência), Schema Zod de validação de formulário
- Contrato/API: `useAlterarNivelSchema`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Contexto de projeto ativo selecionado.
- Bolsista com alocação ativa na tela de Detalhes (`Minha Equipe › Bolsistas do Projeto › Detalhes`).

## Passo a Passo
1. Na aba `Informações` dos Detalhes do bolsista, clicar no botão `Alterar Nível da Bolsa`.
2. Observar a abertura do modal `Alterar Nível da Bolsa`.
3. Sem selecionar nenhuma opção no dropdown `Novo Nível` (permanecendo com placeholder "Selecione o nível") e sem preencher a `Data de Início`, clicar no botão primário `Confirmar`.
4. Observar o comportamento e as mensagens de validação.
5. Selecionar um nível no dropdown `Novo Nível`, mas manter o campo `Data de Início` em branco ou com formato inválido (ex.: `31/02/2026`).
6. Clicar novamente em `Confirmar`.
7. Limpar a seleção do nível e informar uma data válida no campo `Data de Início`.
8. Clicar em `Confirmar`.

## Dados de Entrada
- Tentativa 1: Novo Nível = vazio, Data de Início = vazio.
- Tentativa 2: Novo Nível = `BPIG-I`, Data de Início = `31/02/2026` (inválida).
- Tentativa 3: Novo Nível = vazio, Data de Início = `01/11/2026`.

## Resultado Esperado
- O formulário bloqueia a submissão e não realiza nenhuma requisição HTTP de envio ao backend.
- O campo `Novo Nível` exibe mensagem de validação de campo obrigatório (ex.: "O novo nível é obrigatório").
- O campo `Data de Início` exibe mensagem de erro quando vazio ou com formato/valor inválido (ex.: "Data de início obrigatória" / "Informe uma data válida").
- O botão `Confirmar` permanece habilitado para correção, sem entrar em estado de carregamento permanente.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
