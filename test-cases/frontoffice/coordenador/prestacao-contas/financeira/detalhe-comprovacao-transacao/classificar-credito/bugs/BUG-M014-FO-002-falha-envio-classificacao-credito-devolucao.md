## Título
Falha no envio da classificação de crédito ao escolher Devolução devido à validação indevida de débito obrigatório

## ID
BUG-M014-FO-002

## Requisito/Regra Violada
- Regra Canônica: M014: `RN11` / `RN13` (Classificação de crédito — pareamento de débito aplicável apenas a Estorno)
- Rota/Componente: `/coordenador/prestacao-financeira/classificar-credito/:paymentId` (`ClassificarCredito.vue`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
[Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`]

## Gravidade/Prioridade
[x] 🔴 Bloqueante  [ ] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar a tela de classificação de uma transação de crédito em `/coordenador/prestacao-financeira/classificar-credito/:paymentId`.
2. Na seção `1. Informações Gerais *`, selecionar a opção `Devolução` no dropdown `Classificação`.
3. Preencher o campo de descrição do crédito.
4. Clicar no botão `Salvar rascunho` ou `Enviar`.
5. Na modal de confirmação (*"Tem certeza que deseja enviar as informações?"*), clicar no botão `Enviar`.
6. Observar o comportamento do formulário.

## Dados de Entrada
- Campo Classificação: `Devolução`
- Campo Descrição: `Devolução referente a saldo não utilizado`
- Campo Associe a um Débito: `(vazio / não selecionado)`

## Comportamento Esperado
- A opção `Devolução` deve permitir o salvamento de rascunho e a submissão final sem exigir a seleção de um débito pareado.
- A validação de obrigatoriedade do campo *"Associe esse Crédito (entrada) a um Débito (saída)"* não deve ser aplicada quando a classificação for `Devolução`.

## Comportamento Atual
- Ao confirmar o envio na modal, a submissão falha e nada acontece (o modal é fechado ou a ação é interrompida silenciosamente).
- O campo de associação de débito exibe a mensagem de validação de erro em vermelho: `"Selecione um débito"`, mesmo quando a classificação selecionada é `Devolução`.

## Evidências
- 📷 **Validação Indevida de Débito em Vermelho:**
  ![Mensagem Selecione um débito em vermelho](file:///C:/Users/phcos/.gemini/antigravity/brain/e9551114-8ca4-4c72-bf40-c8f0aa579ac7/.user_uploaded/media_1788211518033.png)

## Sugestão de Investigação (Opcional)
- Verificar a condicional do schema de validação do formulário para tornar a seleção do débito obrigatória apenas quando a opção de classificação for `Estorno`.
