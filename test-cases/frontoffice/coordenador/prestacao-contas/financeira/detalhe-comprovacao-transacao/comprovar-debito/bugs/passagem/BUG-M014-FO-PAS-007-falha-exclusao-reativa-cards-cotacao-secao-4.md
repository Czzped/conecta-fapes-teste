## Título
[Bug] Exclusão de cards de cotação na Seção 4 falha visualmente para o 2º e 3º orçamentos e permite acumular mais de 3 cotações no painel

## ID
BUG-M014-FO-PAS-007

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — Tipo de Documento: **Passagem**
- Regra Canônica: M014: `RN05` (Cada justificativa de despesa pode ter até 3 `OrcamentoFornecedor`) / `RN12` / Invariante de integridade reativa de orçamentos anexados
- Caso de Teste Relacionado: `CT-M014-FO-106` (Validar exclusão de cotação anexada na seção de cotações)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Fluxo: Débito > Passagem / Seção `4. Cotação`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar a comprovação de débito de passagem em `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId`.
2. Na seção `4. Cotação`, anexar os 3 arquivos de cotação de passagem exigidos (`3/3`), preenchendo e confirmando as informações de cada orçamento.
3. Tentar excluir a 1ª cotação clicando no ícone de lixeira e confirmando na modal *"Excluir cotação"*.
4. Observar que a 1ª cotação é removida com sucesso do painel visual.
5. Tentar excluir a 2ª cotação clicando na lixeira e confirmando na modal de exclusão.
6. Tentar excluir a 3ª cotação clicando na lixeira e confirmando na modal de exclusão.
7. Observar o painel visual da Seção 4.
8. Clicar novamente no botão de upload `Anexar Cotação` e enviar 3 novos arquivos de cotação.
9. Tentar excluir os novos anexos recém-enviados.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId` (Passagem com valor superior a R$ 1.400,00)
- Lote inicial: 3 arquivos PDF de cotação anexados e confirmados
- Ação: Clicar no ícone de lixeira de cada card → Confirmar exclusão na modal

## Comportamento Esperado
- Ao confirmar a exclusão de qualquer card de cotação na modal, o card correspondente deve ser removido imediatamente do DOM e da lista reativa no frontend.
- O contador de cotações deve atualizar de forma sincronizada (ex.: de `3/3` para `2/3`, `1/3` até `0/3`).
- A interface não deve permitir acúmulo de cards fantasmas ou mais de 3 cotações simultâneas no painel.

## Comportamento Atual
- A exclusão funciona exclusivamente para a 1ª cotação do lote.
- Ao tentar excluir a 2ª e a 3ª cotação, a modal de confirmação é exibida e o botão *"Excluir cotação"* é acionado, porém os cards das cotações permanecem visíveis na tela, falhando em atualizar a lista reativa no frontend.
- O contador reabre a área de upload para adicionar novas cotações, permitindo anexar até 3 novos arquivos enquanto os 2 cards antigos continuam presos e visíveis no painel (acumulando visualmente mais de 3 cotações).
- Novos anexos enviados posteriormente conseguem ser excluídos individualmente, mas as 2 cotações antigas presas permanecem inalteradas e visíveis no painel.

## Evidências
- 🧾 **Comportamento Idêntico ao BUG-M014-FO-NF-011:** Falha de splice/reatividade compartilhada no componente de cotações da tela `ComprovarDebito.vue`.
- 📹 **Gravação de Reprodução do Fluxo de Cotações:** Registro em vídeo demonstrando a tentativa de exclusão dos cards 2 e 3, reabertura indevida do slot de upload e retenção dos cards presos na interface.

## Sugestão de Investigação
- Verificar a propriedade `:key` utilizada no laço `v-for` que renderiza a lista de cotações na Seção 4. A utilização do índice do array (`:key="index"`) em vez de um identificador estável (`:key="cotacao.id || cotacao.uuid"`) causa problemas de reconciliação no Virtual DOM do Vue ao executar remoções (`splice`), mantendo os nós DOM anteriores congelados na tela.
