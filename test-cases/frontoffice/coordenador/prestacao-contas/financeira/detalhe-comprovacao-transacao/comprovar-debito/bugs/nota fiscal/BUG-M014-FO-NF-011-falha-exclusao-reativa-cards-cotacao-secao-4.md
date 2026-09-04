# Título
[Bug] Exclusão de cards de cotação na Seção 4 falha visualmente para o 2º e 3º orçamentos e permite acumular mais de 3 cotações no painel

## ID
BUG-M014-FO-NF-011

## Requisito/Regra Violada
- Regra Canônica: M014: `RN05` / `RN07` — Limite máximo de 3 cotações (`OrcamentoFornecedor`) e gerenciamento reativo da exclusão de itens no lote de cotações
- Rota/Componente: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` — Seção `4. Cotação` (`ComprovarDebito.vue`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo

1. Acessar `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` com uma transação de débito pendente.
2. Na seção `4. Cotação`, anexar os 3 arquivos de cotação exigidos (`3/3`), preencher e confirmar as informações de cada orçamento.
3. Tentar excluir a 1ª cotação clicando no ícone de lixeira e confirmando na modal *"Excluir cotação"*.
4. Observar que a 1ª cotação é removida com sucesso.
5. Tentar excluir a 2ª cotação clicando na lixeira e confirmando na modal.
6. Tentar excluir a 3ª cotação clicando na lixeira e confirmando na modal.
7. Observar o painel visual da Seção 4.
8. Clicar novamente no botão de upload `Anexar Cotação` e enviar 3 novas cotações.
9. Tentar excluir os novos anexos recém-enviados.

## Dados de Entrada
- URL: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId`
- Lote inicial de cotações: 3 arquivos PDF de orçamento anexados e confirmados
- Ação: Clicar no ícone de lixeira de cada card → Confirmar exclusão na modal

## Comportamento Esperado
- Ao confirmar a exclusão de qualquer card de cotação na modal, o card correspondente deve ser **removido imediatamente da interface** e o contador de cotações atualizado (ex: de `3/3` para `2/3`, depois `1/3` até `0/3`).
- O sistema não deve permitir o acúmulo visual ou lógico de mais de 3 cotações no painel.

## Comportamento Atual
- A exclusão funciona **apenas para a 1ª cotação**.
- Ao tentar excluir a 2ª e a 3ª cotação, a modal de confirmação é exibida e o botão *"Excluir cotação"* é acionado, porém os cards das cotações **permanecem visíveis na tela**, falhando em atualizar a lista reativa no frontend.
- O contador libera novamente o upload para adicionar novas cotações, permitindo anexar mais 3 novos arquivos enquanto os 2 cards antigos presos permanecem visíveis na tela (acumulando múltiplos cards e violando o limite visual de 3 cotações).
- Os novos anexos inseridos posteriormente conseguem ser excluídos, mas as 2 cotações presas anteriormente **continuam presas e visíveis no painel**.

## Evidências
- 📹 **Gravação de vídeo em tempo real:** `2026-09-04 16-30-49.mkv` (demonstrando o fluxo completo de tentativa de exclusão dos 3 cards, falha visual no 2º e 3º card, re-anexo de novos arquivos e permanência dos cards fantasmas na interface).

## Sugestão de Investigação
- Verificar o índice (`index`) ou a chave única (`key`) utilizada no laço `v-for` que renderiza os cards de cotação na Seção 4. Ao excluir um item no meio da lista (splices no array reativo), a falta de uma chave única (`:key="cotacao.id"`) faz com que o Vue reutilize nós do DOM e falhe em re-renderizar a remoção dos itens subsequentes.