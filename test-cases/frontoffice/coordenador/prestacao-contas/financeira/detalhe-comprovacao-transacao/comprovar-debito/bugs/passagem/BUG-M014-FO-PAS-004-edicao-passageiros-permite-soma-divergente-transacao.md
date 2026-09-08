## Título
[Bug] Edição de passageiros permite salvar valores com soma divergente do valor total da transação na Seção 3

## ID
BUG-M014-FO-PAS-004

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — Tipo de Documento: **Passagem**
- Regra Canônica: M014: `RN02` (Conciliação obrigatória entre transações bancárias e despesas comprovadas) / `RN12` / `RI1` (Invariante de integridade financeira: a soma das frações individuais dos passageiros deve ser rigorosamente igual ao valor da transação bancária)
- Caso de Teste Relacionado: `CT-M014-FO-054` / `CT-M014-FO-066`
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `3. Informações da Passagem *` / Ação `Confirmar edição`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o sistema com perfil de `coordenador` e abrir a comprovação de débito de passagem que já possua múltiplos passageiros cadastrados e conciliados com a transação (ex.: `Passageiro 1: R$ 2.824,52` e `Passageiro 2: R$ 110,00`, totalizando `R$ 2.934,52`).
2. Na seção `3. Informações da Passagem *`, clicar no botão `Editar passageiros` no canto inferior direito.
3. Alterar os valores das passagens para montantes cuja soma divirja do valor da transação (ex.: alterar `Passageiro 1` para `R$ 2.924,52` e `Passageiro 2` para `R$ 100,00`, gerando soma de `R$ 3.024,52`).
4. Clicar no botão ciano `Confirmar edição`.
5. Observar o comportamento do sistema e o toast de notificação retornado.

## Dados de Entrada
- Valor Total da Transação de Débito: `R$ 2.934,52`
- Composição Original Válida: `Passageiro 1: R$ 2.824,52` + `Passageiro 2: R$ 110,00` = `R$ 2.934,52` (Conciliado)
- Composição Editada Inválida: `Passageiro 1: R$ 2.924,52` + `Passageiro 2: R$ 100,00` = `R$ 3.024,52` (Divergência excedente de `R$ 90,00`)

## Comportamento Esperado
- O sistema deve validar no evento de clique de `Confirmar edição` se a soma atualizada de todos os passageiros permanece idêntica ao total da transação bancária.
- Ao detectar divergência, o salvamento deve ser bloqueado e deve ser exibido o alerta impeditivo: *"A soma dos passageiros (R$ 3.024,52) deve ser igual ao valor total das transações (R$ 2.934,52)."*.

## Comportamento Atual
- A validação da soma dos passageiros é totalmente ignorada durante a confirmação de edição.
- O sistema salva os valores divergentes e exibe a mensagem de sucesso: *"Justificativa de passagem atualizada com sucesso!"*, corrompendo a integridade da conciliação bancária da prestação de contas.

## Evidências
- 📷 **Estado original com valores devidamente conciliados:**
  ![Valores originais dos passageiros conciliados](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-004-valores-originais-passageiros.png)

- 📷 **Edição com inserção de valores cuja soma diverge do total da transação:**
  ![Edição dos valores dos passageiros](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-004-edicao-valores-divergentes-soma.png)

- 📷 **Confirmação aceita e toast falso de sucesso com soma inconsistente:**
  ![Sucesso indevido ao confirmar edição com soma divergente](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-004-sucesso-falso-soma-invalida-confirmada.png)

## Sugestão de Investigação (Opcional)
- A função de confirmação de edição (`confirmPassengerEdit()`) não compartilha o validador `validateTotalAmount()` utilizado na rotina de primeiro envio (`submitPassengers()`).
- Unificar a validação da soma em um único método ou interceptor antes de disparar a requisição de atualização da justificativa.
