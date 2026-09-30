## Título
[Bug] Falha de persistência ao substituir o arquivo de Comprovante da Fatura do Cartão de Crédito no Invoice (Falso sucesso)

## ID
BUG-M014-FO-INV-006

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito de Invoice — **Seção 2 (Anexar Comprovante da Fatura do Cartão)**
- Regra Canônica: M014: `RN05` / `RI-INV01` (Integridade da substituição e persistência de documentos secundários de Invoice - Fatura do Cartão)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: Exibição da notificação verde de confirmação (*"Invoice atualizado com sucesso!"*), induzindo o usuário ao erro de que a nova fatura do cartão foi salva, mas ao atualizar a página o arquivo de fatura original reaparece.
  - **Heurística #3 (Controle e Liberdade do Usuário)**: Impossibilidade de substituir um comprovante de fatura do cartão incorreto ou atualizado já salvo na comprovação de débito.
- Caso de Teste Relacionado: `CT-M014-FO-074` / `CT-M014-FO-084` (Edição e substituição do comprovante da fatura do cartão em Invoice)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Campo `Comprovante da fatura do cartão`)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro em `/coordenador/financeira` com o perfil de Coordenador.
2. Abrir uma prestação de débito de **Invoice** em rascunho que possua a opção *"Deseja enviar o comprovante da fatura do cartão?"* ativada e um arquivo de fatura preexistente anexado.
3. Na Seção `2. Anexar Arquivos do Invoice *`, remover a fatura do cartão antiga (`X`) e carregar o novo arquivo de fatura (ex.: `NF-Notebooks.pdf`).
4. Clicar no botão azul `Confirmar edição` na Seção 3.
5. Observar a exibição da notificação verde de sucesso (*"Invoice atualizado com sucesso!"*).
6. Recarregar a página no navegador (`F5` / `Ctrl+R`) ou reabrir a transação.
7. Inspecionar o campo `Comprovante da fatura do cartão`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Fatura Preexistente: `ea8d0e93-54b8-4595-929d-2aaa117220d7-Cópia de cotacao_notebook_magazineluiza_compressed.pdf` (324 KB)
- Nova Fatura Substituída: `NF-Notebooks.pdf` (13 KB)
- Ação: Substituição da fatura do cartão + Clique em `Confirmar edição`.

## Comportamento Esperado
- A requisição enviada ao backend no clique de `Confirmar edição` deve atualizar o documento de fatura do cartão (`faturaCartaoId`), removendo o arquivo antigo e salvando o novo arquivo no banco de dados.
- Ao recarregar a página (`F5`), o novo arquivo de fatura substituído (`NF-Notebooks.pdf`) deve permanecer anexado.

## Comportamento Atual
- O frontend exibe a notificação verde de sucesso (*"Invoice atualizado com sucesso!"*), porém o backend não persiste a substituição do comprovante da fatura do cartão.
- Ao atualizar a página (`F5`), a fatura original (`ea8d0e93...Cópia de cotacao_notebook_magazineluiza...pdf`) volta a ser exibida como se a edição nunca tivesse ocorrido (falso sucesso).

## Evidências
- 📷 **Fatura do cartão preexistente anexada no campo antes da edição:**
 
<img width="973" height="350" alt="Fatura do cartão original" src="https://github.com/user-attachments/assets/ae0bf298-b789-4fa2-93ae-c98f5a11dfa4" />

- 📷 **Novo arquivo de fatura (NF-Notebooks.pdf) carregado no campo de upload:**
 
<img width="975" height="350" alt="Nova fatura anexada na edicao" src="https://github.com/user-attachments/assets/a760c6d5-1f9e-473d-9f44-67ddb7e3fbc1" />

- 📷 **Toast verde de falso sucesso ("Invoice atualizado com sucesso!") ao clicar em Confirmar edição:**
 
<img width="986" height="350" alt="Toast verde de falso sucesso ao salvar fatura" src="https://github.com/user-attachments/assets/cd1e0a29-eb35-46eb-8002-aa59c2522a10" />

- 📷 **Recarregar a página (F5) restaura a fatura do cartão original e descarta a substituição:**
 
<img width="973" height="350" alt="Fatura original retorna ao dar F5" src="https://github.com/user-attachments/assets/c516f406-8b2b-42fa-9a5c-1dd68f44fffa" />

## Sugestão de Investigação
- Inspecionar o handler de atualização do formulário de Invoice (`ComprovarDebito.vue`):
  - Verificar se a propriedade `faturaCartaoId` ou `comprovanteFaturaCartao` está sendo devidamente repassada no payload da chamada `PUT`/`PATCH` de atualização da justificativa.
  - No backend, certificar que a atualização de `JustificativaInvoice` trate a substituição do parâmetro de documento de fatura do cartão e persista a nova referência no banco de dados.
