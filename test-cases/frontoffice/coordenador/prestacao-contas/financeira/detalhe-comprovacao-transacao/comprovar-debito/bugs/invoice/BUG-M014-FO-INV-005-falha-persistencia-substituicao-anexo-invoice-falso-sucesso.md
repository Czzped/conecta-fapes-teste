## Título
[Bug] Falha de persistência ao substituir o anexo de justificativa do Invoice na edição da Seção 2 (Falso sucesso)

## ID
BUG-M014-FO-INV-005

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito de Invoice — **Seção 2 (Anexar Arquivos do Invoice)**
- Regra Canônica: M014: `RN05` / `RI-INV01` (Integridade da substituição e persistência de documentos fiscais de Invoice)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: Exibição da notificação verde de confirmação (*"Invoice atualizado com sucesso!"*), induzindo o usuário ao erro de que o novo anexo foi salvo, mas ao atualizar a página o arquivo original reaparece.
  - **Heurística #3 (Controle e Liberdade do Usuário)**: Impossibilidade de substituir um anexo incorreto ou atualizado de Invoice já salvo na comprovação de débito.
- Caso de Teste Relacionado: `CT-M014-FO-073` / `CT-M014-FO-084` (Edição e substituição do anexo de Invoice)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `2. Anexar Arquivos do Invoice *`)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro em `/coordenador/financeira` com o perfil de Coordenador.
2. Abrir uma prestação de débito de **Invoice** em rascunho que possua um anexo preexistente (ex.: `f67734d1-958a...Cópia de cotacao_avell.pdf`).
3. Na Seção `2. Anexar Arquivos do Invoice *`, remover o anexo antigo (`X`) e carregar o novo arquivo de Invoice (ex.: `NF-Notebooks.pdf`).
4. Clicar no botão azul `Confirmar edição` na Seção 3.
5. Observar a exibição da notificação verde de sucesso (*"Invoice atualizado com sucesso!"*).
6. Recarregar a página no navegador (`F5` / `Ctrl+R`) ou reabrir a transação.
7. Inspecionar a Seção `2. Anexar Arquivos do Invoice *`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Anexo Preexistente: `f67734d1-958a-478a-9512-24e4a23bde8f-Cópia de cotacao_avell.pdf` (274 KB)
- Novo Anexo Substituído: `NF-Notebooks.pdf` (13 KB)
- Ação: Substituição do anexo + Clique em `Confirmar edição`.

## Comportamento Esperado
- A requisição enviada ao backend no clique de `Confirmar edição` deve atualizar o vínculo do documento fiscal de Invoice, removendo o arquivo antigo e salvando o novo arquivo no banco de dados.
- Ao recarregar a página (`F5`), o novo arquivo substituído (`NF-Notebooks.pdf`) deve permanecer anexado à prestação.

## Comportamento Atual
- O frontend exibe a notificação verde de sucesso (*"Invoice atualizado com sucesso!"*), porém o backend não persiste a substituição do arquivo.
- Ao atualizar a página (`F5`), o arquivo original (`f67734d1...Cópia de cotacao_avell.pdf`) volta a ser exibido anexado à despesa como se a edição nunca tivesse ocorrido (falso sucesso).

## Evidências
- 📷 **Anexo de Invoice preexistente na Seção 2 antes da edição:**
 
<img width="973" height="350" alt="Anexo de Invoice original" src="https://github.com/user-attachments/assets/ae0bf298-b789-4fa2-93ae-c98f5a11dfa4" />

- 📷 **Novo arquivo de Invoice (NF-Notebooks.pdf) anexado na área de upload:**
 
<img width="975" height="350" alt="Novo arquivo anexado na edicao" src="https://github.com/user-attachments/assets/a760c6d5-1f9e-473d-9f44-67ddb7e3fbc1" />

- 📷 **Toast verde de falso sucesso ("Invoice atualizado com sucesso!") ao clicar em Confirmar edição:**
 
<img width="986" height="350" alt="Toast verde de falso sucesso no Invoice" src="https://github.com/user-attachments/assets/cd1e0a29-eb35-46eb-8002-aa59c2522a10" />

- 📷 **Recarregar a página (F5) restaura o arquivo original e descarta a substituição:**
 
<img width="973" height="350" alt="Arquivo original retorna ao dar F5" src="https://github.com/user-attachments/assets/c516f406-8b2b-42fa-9a5c-1dd68f44fffa" />

## Sugestão de Investigação
- Inspecionar a rota e a lógica de atualização da justificativa de Invoice no Frontoffice (`ComprovarDebito.vue` / composable de Invoice):
  - Verificar se a requisição `PUT`/`PATCH` de atualização da justificativa de Invoice está enviando o novo `arquivoId` / `documentoFiscalId` no payload ou se continua reenviando o ID do arquivo anterior.
  - No backend, certificar que a alteração de anexos da entidade `JustificativaInvoice` substitua o arquivo no storage e atualize os ponteiros no banco de dados.
