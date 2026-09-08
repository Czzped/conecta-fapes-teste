## Título
[Bug] Ausência de validação de consistência cronológica no itinerário permitindo confirmação com data de chegada anterior à data de saída na seção 3 (Informações da Passagem)

## ID
BUG-M014-FO-PAS-001

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — Tipo de Documento: **Passagem**
- Regra Canônica: M014: `RN12` (Consistência lógica e integridade dos dados de itinerário da viagem na comprovação de passagem — a chegada deve ser estritamente posterior à saída)
- Caso de Teste Relacionado: `CT-M014-FO-069` (Validar rejeição de itinerário com data/horário de chegada anterior à data/horário de saída)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Fluxo: Débito > Passagem / Seção `3. Informações da Passagem *` / Modal/Formulário de Itinerário)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o sistema com perfil de `coordenador` e navegar até a transação de débito pendente de comprovação.
2. Na etapa `1. Informações Gerais`, selecionar o tipo de documento `Passagem` e avançar até a etapa `3. Informações da Passagem *`.
3. No preenchimento inicial dos dados do itinerário do passageiro, informar `Local de Origem*` e `Local de Destino*`.
4. Preencher o campo `Data de Saída*` com uma data posterior (ex.: `07/09/2026`) e horário (ex.: `21:21`).
5. Preencher o campo `Data de Chegada*` diretamente com uma data anterior à saída (ex.: `06/09/2026`) e horário (ex.: `12:12`).
6. Clicar no botão para confirmar as informações do itinerário.
7. Observar que a ação é aceita diretamente sem qualquer restrição ou necessidade de cadastro prévio de datas válidas.

## Dados de Entrada
- Local de Origem: `teste`
- Data de Saída: `07/09/2026`
- Horário de Saída: `21:21`
- Local de Destino: `teste`
- Data de Chegada: `06/09/2026` (Data anterior à data de saída)
- Horário de Chegada: `12:12`

## Comportamento Esperado
- O formulário deve validar a consistência cronológica do itinerário antes da confirmação, impedindo a submissão com data/horário de chegada igual ou anterior à data/horário de saída.
- Deve ser exibida uma mensagem de validação clara (ex.: *"A data e horário de chegada devem ser posteriores à data e horário de saída"*).
- O botão de confirmação deve permanecer desabilitado ou disparar o alerta de validação em linha no campo `Data de Chegada`.

## Comportamento Atual
- Nenhuma validação ou restrição é aplicada pelo frontend ao inserir uma data de chegada anterior à de saída.
- A ação é confirmada com sucesso, renderizando o bloco de itinerário com datas logicamente inconsistentes (`Saída: 07/09/2026 21:21` e `Chegada: 06/09/2026 12:12`) e permitindo avançar para a próxima etapa sem bloqueios.

## Evidências
- 📷 **Preenchimento com datas cronologicamente inconsistentes (sem aviso de erro):**
  ![Data de Chegada anterior à Data de Saída](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-001-preenchimento-datas-inconsistentes.png)

- 📷 **Confirmação e persistência do itinerário sem restrição:**
  ![Itinerário confirmado com sucesso com dados inválidos](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-001-confirmacao-itinerario-sem-bloqueio.png)

## Sugestão de Investigação (Opcional)
- Implementar validação reativa no schema do formulário (ex.: vee-validate / zod / regra customizada no componente do itinerário) comparando os timestamps combinados `(dataSaida + horarioSaida) >= (dataChegada + horarioChegada)`.
- Adicionar a propriedade `min` no datepicker do campo `Data de Chegada` vinculada ao valor selecionado no campo `Data de Saída`.
