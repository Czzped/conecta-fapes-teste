## Título
[Bug] Ausência de validação permitindo confirmação de itinerário com local de origem igual ao local de destino na seção 3 (Informações da Passagem)

## ID
BUG-M014-FO-PAS-002

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — Tipo de Documento: **Passagem**
- Regra Canônica: M014: `RN12` (O itinerário deve representar deslocamento de viagem real — o local de destino deve ser obrigatoriamente diferente do local de origem)
- Caso de Teste Relacionado: `CT-M014-FO-070` (Validar rejeição de itinerário com local de origem igual ao local de destino)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Fluxo: Débito > Passagem / Seção `3. Informações da Passagem *` / Formulário de Itinerário)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o sistema com perfil de `coordenador` e navegar até a transação de débito pendente de comprovação.
2. Na etapa `1. Informações Gerais`, selecionar o tipo de documento `Passagem` e avançar até a etapa `3. Informações da Passagem *`.
3. No preenchimento das informações do itinerário do passageiro, preencher o campo `Local de Origem*` (ex.: `Vitoria`).
4. Preencher o campo `Local de Destino*` com o exato mesmo valor da origem (ex.: `Vitoria`).
5. Preencher datas e horários de saída e chegada.
6. Clicar no botão para confirmar/salvar a justificativa da passagem.
7. Observar a ausência de mensagem de erro e a exibição da notificação de sucesso (*"Justificativa de passagem atualizada com sucesso!"*).

## Dados de Entrada
- Local de Origem*: `Vitoria`
- Local de Destino*: `Vitoria` (idêntico à origem — inválido)
- Data de Saída*: `07/09/2026` | Horário de Saída*: `21:21`
- Data de Chegada*: `08/09/2026` | Horário de Chegada*: `12:12`

## Comportamento Esperado
- O formulário deve comparar os locais de origem e destino (ignorando maiúsculas/minúsculas e espaços extras).
- Ao detectar locais idênticos, a confirmação do itinerário deve ser bloqueada.
- Deve ser apresentada mensagem de erro em linha ou em notificação (ex.: *"O local de destino deve ser diferente do local de origem."*).

## Comportamento Atual
- Nenhuma validação de equivalência entre origem e destino é executada pelo frontend.
- O formulário permite salvar o itinerário com origem e destino idênticos (`Vitoria` -> `Vitoria`) e exibe o toast de confirmação: *"Justificativa de passagem atualizada com sucesso!"*.

## Evidências
- 📷 **Campos de Origem e Destino preenchidos com o mesmo valor (`Vitoria`):**
  ![Origem e Destino iguais a Vitoria](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-002-origem-e-destino-iguais.png)

- 📷 **Itinerário salvo e notificação verde de sucesso confirmando dados inconsistentes:**
  ![Toast de sucesso ao salvar origem igual ao destino](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-002-toast-sucesso-origem-destino-iguais.png)

## Sugestão de Investigação (Opcional)
- Adicionar validação cross-field no schema do formulário (ex.: `destiny.trim().toLowerCase() !== origin.trim().toLowerCase()`).
- Exibir a mensagem de erro *"O local de destino não pode ser igual ao local de origem"* diretamente abaixo do campo `Local de Destino*`.
