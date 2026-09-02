## Título
Transição automática indevida do status de Débito de Pendente para Em Rascunho apenas pela visualização da tela

## ID
BUG-M014-FO-005

## Requisito/Regra Violada
- Regra Canônica: M014: `RN05` / `RI4` (Derivação do StatusTransacao — transações sem vínculo ativo com rascunho salvo devem permanecer PENDENTE)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
[Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`]

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato de prestação financeira em `/coordenador/financeira`.
2. Identificar uma transação de Débito com o status `Pendente`.
3. Clicar no registro para visualizar os detalhes da transação de débito em `/coordenador/prestacao-financeira/detalhes/:paymentId`.
4. Sem preencher nenhum campo ou clicar em "Salvar rascunho", retornar à listagem do extrato em `/coordenador/financeira`.
5. Inspecionar o status exibido para a transação na listagem.

## Dados de Entrada
- Transação de Débito com status inicial: `Pendente`

## Comportamento Esperado
- A simples abertura/visualização da tela de detalhes da transação de débito não deve alterar o status da transação.
- A transação deve permanecer com o status `Pendente` até que o coordenador execute uma ação afirmativa (ex: clicar no botão `Salvar rascunho` ou preencher e submeter o formulário), mantendo a consistência observada no fluxo de Crédito.

## Comportamento Atual
- Ao abrir os detalhes da transação de débito, o sistema altera automaticamente seu status de `Pendente` para `Em Rascunho`, mesmo sem nenhuma interação de salvamento ou edição por parte do usuário.
- Como consequência, todas as transações de débito que o usuário apenas visualizou passam a ser listadas no extrato com o badge cinza `Em Rascunho`, poluindo a listagem e gerando falsa impressão de rascunhos iniciados.

## Evidências
- 📷 **Listagem de Débitos Poluída com Status Em Rascunho:**
  ![Débitos Convertidos para Em Rascunho](file:///C:/Users/phcos/.gemini/antigravity/brain/e9551114-8ca4-4c72-bf40-c8f0aa579ac7/.user_uploaded/media_1788308191537.png)

## Sugestão de Investigação (Opcional)
- Verificar se a rota de detalhes de débito está disparando uma chamada automática de criação/vinculação de rascunho no evento de montagem (`onMounted` / GET) em vez de condicionar a criação do rascunho ao clique em "Salvar rascunho".
