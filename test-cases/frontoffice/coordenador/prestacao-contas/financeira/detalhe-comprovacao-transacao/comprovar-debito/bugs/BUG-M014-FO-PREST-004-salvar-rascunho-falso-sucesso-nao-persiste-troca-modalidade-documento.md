## Título
[Bug] Salvar Rascunho não persiste a alteração do tipo de documento/modalidade em prestação de contas preexistente (Falso sucesso)

## ID
BUG-M014-FO-PREST-004

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Seção 1 (Informações Gerais - Alteração e Salvamento de Rascunho de Modalidade)**
- Regra Canônica: M014: `RN05` / Permissão e integridade no salvamento de rascunhos de prestação de contas com alteração de tipo de documento
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: Exibição da mensagem de falso sucesso (*"Rascunho salvo com sucesso"*), induzindo o Coordenador ao erro de acreditar que a mudança de modalidade foi persistida no servidor.
  - **Heurística #3 (Controle e Liberdade do Usuário)**: O usuário altera o documento de *Passagem* para *Invoice* (ou outra modalidade), preenche os dados, salva o rascunho, mas ao reabrir a transação os dados retornam integralmente para o estado original da primeira modalidade.
- Caso de Teste Relacionado: `CT-M014-FO-032` / `CT-M014-FO-088` (Salvamento de rascunho após alternância entre modalidades de documentos fiscais)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `1. Informações Gerais *`)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro em `/coordenador/financeira` com o perfil de Coordenador.
2. Abrir uma prestação de débito em rascunho preexistente salva sob a modalidade **Passagem**.
3. Na Seção `1. Informações Gerais *`, alterar o dropdown **Documento** de `Passagem` para `Invoice (Pagamento Internacional)` (ou outra modalidade).
4. Preencher os novos anexos e campos correspondentes ao `Invoice`.
5. Clicar no botão `Salvar rascunho`.
6. Observar a exibição da notificação verde (*"Rascunho salvo com sucesso"*).
7. Voltar para a listagem do extrato ou recarregar a página (`F5`).
8. Reabrir a mesma prestação de débito no extrato.
9. Verificar qual modalidade e dados são exibidos na tela.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Modalidade Originalmente Salva: `Passagem` (com comprovante de pagamento e realização anexados)
- Alteração Realizada: Troca no dropdown para `Invoice (Pagamento Internacional)` + Clique em `Salvar rascunho`

## Comportamento Esperado
- Ao alterar o tipo de documento no dropdown e acionar `Salvar rascunho`, o backend deve deletar/substituir a justificativa antiga (ex.: `JustificativaPassagem`) ou atualizar a prestação de débito para apontar para o novo tipo de documento (`Invoice`).
- Ao reabrir a prestação, a tela deve carregar o formulário da nova modalidade escolhida (`Invoice`) com as informações salvas.

## Comportamento Atual
- Embora o frontend exiba a mensagem verde de confirmação (*"Rascunho salvo com sucesso"*), a alteração do tipo de documento não é gravada no banco de dados.
- Ao reabrir a prestação no extrato, a transação reaparece com o formulário e os dados da modalidade inicial (**Passagem**), descartando silenciosamente todas as alterações feitas no `Invoice`.

## Evidências
- 📷 **Prestação preexistente salva originalmente sob a modalidade Passagem:**
 
<img width="973" height="498" alt="Prestação original em Passagem" src="https://github.com/user-attachments/assets/ae03923d-c114-4fb0-8d59-25f0ad1c2a01" />

- 📷 **Troca de modalidade no dropdown para Invoice e preenchimento dos anexos:**
 
<img width="975" height="500" alt="Alteração para Invoice" src="https://github.com/user-attachments/assets/19cf05d1-5cf5-4cf5-b168-52565dd4b1cd" />

- 📷 **Acionamento do botão Salvar Rascunho com exibição de toast de falso sucesso:**
 
<img width="986" height="498" alt="Toast de falso sucesso Rascunho salvo com sucesso" src="https://github.com/user-attachments/assets/574ebad2-cfb3-4638-aa21-eb337e7592cf" />

- 📷 **Reabertura da prestação de débito mantendo os dados da modalidade original (Passagem):**
 
<img width="973" height="498" alt="Reabertura da prestação retornando para Passagem" src="https://github.com/user-attachments/assets/d1933bfe-f5e9-4e78-831d-dcae8c148eeb" />

## Sugestão de Investigação
- Inspecionar a rota e a lógica de salvamento de rascunho (`saveDraft`) em `ComprovarDebito.vue`:
  - Verificar se a chamada da API de salvamento de rascunho está enviando o novo `tipoDocumentoEnum` e excluindo o vínculo com o ID da justificativa anterior.
  - No backend, garantir que ao salvar rascunho com tipo de documento alterado, a transação atualize a chave estrangeira do documento fiscal/justificativa ativo.
