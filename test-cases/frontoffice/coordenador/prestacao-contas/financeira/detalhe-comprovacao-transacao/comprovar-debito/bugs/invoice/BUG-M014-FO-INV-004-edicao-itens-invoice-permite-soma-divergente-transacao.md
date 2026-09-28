## Título
[Bug] Edição dos itens do Invoice permite salvar valores cuja soma diverge do valor total da transação de débito

## ID
BUG-M014-FO-INV-004

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito de Invoice — **Seção 4 (Associar itens do invoice)**
- Regra Canônica: M014: `RN05` / `RI-INV01` (Validação financeira obrigatória: a soma total dos itens associados ao Invoice deve equivaler exatamente ao valor da transação de débito associada)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #5 (Prevenção de Erros)**: Ausência de validação na alteração/edição de itens. O sistema impede divergência no envio inicial, mas ao clicar em `Editar` permite alterar a quantidade ou valor unitário para um total inconsistente (ex.: R$ 1,00 para uma transação de R$ 3.668,41) sem exibir alerta ou bloquear o salvamento.
  - **Heurística #1 (Visibilidade do Status do Sistema)**: Exibição da notificação verde de sucesso (*"Itens do invoice atualizados com sucesso!"*) aceitando dados com inconsistência matemática grave em relação ao valor debitado.
- Caso de Teste Relacionado: `CT-M014-FO-042` / `CT-M014-FO-085` (Validação de equivalência entre o somatório dos itens do invoice e o valor total da transação)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `4. Associar itens do invoice *`)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro em `/coordenador/financeira` com o perfil de Coordenador.
2. Abrir uma prestação de débito sob a modalidade **Invoice** vinculada a uma transação (ex.: Débito de `R$ 3.668,41`).
3. Na Seção `4. Associar itens do invoice *`, vincular os itens de forma que o valor total atinja exatamente o valor da transação (`R$ 3.668,41`), e clicar em salvar/enviar os itens.
4. Observar a confirmação inicial (*"Itens do invoice associados com sucesso!"*).
5. Na mesma Seção 4, clicar no botão `Editar`.
6. Alterar o valor unitário ou quantidade do item para um valor inferior ou superior ao total da transação (ex.: alterar valor unitário de `R$ 3.668,41` para `R$ 1,00`).
7. Salvar as alterações dos itens do invoice.
8. Observar a notificação de sucesso e o estado final dos itens.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Valor Total da Transação de Débito: `R$ 3.668,41`
- Associação Inicial: Item `Clips de Papel` (Qtd: 1, Valor Unitário: `R$ 3.668,41` -> Total: `R$ 3.668,41`)
- Alteração na Edição: Item `Clips de Papel` (Qtd: 1, Valor Unitário: `R$ 1,00` -> Total: `R$ 1,00`)

## Comportamento Esperado
- Ao editar os itens do invoice, o sistema deve validar se o somatório (quantidade × valor unitário de todos os itens) permanece **igual ao valor total da transação de débito** (`R$ 3.668,41`).
- Caso haja divergência no somatório, o sistema deve bloquear a atualização e exibir mensagem de erro explicativa (ex.: *"A soma dos itens do invoice (R$ 1,00) deve ser igual ao valor da transação (R$ 3.668,41)"*).

## Comportamento Atual
- A validação de equivalência financeira é ignorada durante a edição dos itens do invoice.
- O sistema aceita o salvamento do item alterado para `R$ 1,00`, exibe o toast de confirmação verde (*"Itens do invoice atualizados com sucesso!"*) e permite que a prestação permaneça com dados financeiros divergentes da transação real.

## Evidências
- 📷 **Transação de débito vinculada no valor de R$ 3.668,41:**
 
<img width="973" height="135" alt="Transação de débito com valor de R$ 3.668,41" src="https://github.com/user-attachments/assets/266dcf11-f2fe-4318-8f83-e18e0018590c" />

- 📷 **Associação inicial dos itens correspondendo exatamente ao valor da transação (R$ 3.668,41):**
 
<img width="975" height="236" alt="Itens do invoice associados com sucesso no valor exato" src="https://github.com/user-attachments/assets/eef8dce6-e9cd-4a37-8ed5-6b3a3c20fa00" />

- 📷 **Edição permitida com valor unitário alterado para R$ 1,00 e aceita com toast de sucesso:**
 
<img width="977" height="240" alt="Toast de sucesso com valor divergente de R$ 1,00" src="https://github.com/user-attachments/assets/404dcfd3-2e0e-436d-8a6a-d8c9735d4617" />

## Sugestão de Investigação
- Inspecionar a validação do formulário/handler no componente de associação de itens do Invoice (`AssociarItensInvoice.vue`):
  - Certificar que a função de validação de soma de itens (`sum(items) === transactionValue`) seja acionada tanto no envio inicial quanto no fluxo de edição (`handleUpdateItems`).
  - Garantir que a API no backend rejeite atualizações de itens de invoice com erro `422 Unprocessable Entity` quando a soma acumulada dos itens divergir do valor total da despesa/transação.
