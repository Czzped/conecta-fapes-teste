## Título
[Bug] Desaparecimento do anexo do Comprovante da Fatura do Cartão de Crédito (campo fica vazio) após confirmar a edição e recarregar a página

## ID
BUG-M014-FO-INV-007

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito de Invoice — **Seção 2 (Anexar Comprovante da Fatura do Cartão)**
- Regra Canônica: M014: `RN05` / `RI-INV01` (Gerenciamento e persistência de documentos secundários de Invoice - Fatura do Cartão)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: Exibição do toast verde de sucesso (*"Invoice atualizado com sucesso!"*), porém ao recarregar a página (`F5`), o comprovante de fatura do cartão é desvinculado e o campo fica completamente vazio como se o arquivo tivesse sido deletado.
  - **Heurística #5 (Prevenção de Erros)**: Perda não intencional de dados de formulário. O usuário realiza a edição/substituição da fatura esperando atualizar a imagem, mas a operação corrompe o vínculo do arquivo, forçando a digitação/upload do zero.
- Caso de Teste Relacionado: `CT-M014-FO-089` / `CT-M014-FO-074` (Validação de substituição e persistência da fatura do cartão no Invoice)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Campo `Comprovante da fatura do cartão`)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro em `/coordenador/financeira` com o perfil de Coordenador.
2. Abrir uma prestação de débito de **Invoice** em rascunho.
3. Na Seção `2. Anexar Arquivos do Invoice *`, marcar a opção *"Deseja enviar o comprovante da fatura do cartão?"*.
4. Anexar um arquivo de comprovante da fatura do cartão (ex.: `NF-Notebooks.pdf`).
5. Clicar no botão `Confirmar edição` e verificar a exibição da notificação verde (*"Invoice atualizado com sucesso!"*).
6. Recarregar a página no navegador (`F5` / `Ctrl+R`) ou navegar de volta para o extrato e reabrir a transação.
7. Inspecionar a Seção 2 e a caixa do campo `Comprovante da fatura do cartão`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Checkbox: `Deseja enviar o comprovante da fatura do cartão?` (Marcada)
- Arquivo Anexado: `NF-Notebooks.pdf` (13 KB)
- Ação: Clique em `Confirmar edição` + Recarregar página (`F5`)

## Comportamento Esperado
- O arquivo de comprovante da fatura do cartão (`NF-Notebooks.pdf`) deve permanecer anexado e visível na caixa de upload da Seção 2 após recarregar a página.

## Comportamento Atual
- Embora a mensagem verde de confirmação (*"Invoice atualizado com sucesso!"*) seja disparada no momento do clique, o vínculo com a fatura do cartão é perdido ao atualizar a página.
- O campo `Comprovante da fatura do cartão` reaparece completamente vazio (sem o card do arquivo anexado), exigindo que o usuário envie o arquivo novamente.

## Evidências
- 📷 **Arquivo NF-Notebooks.pdf anexado no campo de Comprovante da Fatura do Cartão:**
 
<img width="973" height="350" alt="Fatura do cartao anexada no campo" src="https://github.com/user-attachments/assets/ae0bf298-b789-4fa2-93ae-c98f5a11dfa4" />

- 📷 **Acionamento do botão Confirmar edição no formulário:**
 
<img width="975" height="350" alt="Confirmar edicao acionado" src="https://github.com/user-attachments/assets/a760c6d5-1f9e-473d-9f44-67ddb7e3fbc1" />

- 📷 **Toast verde de confirmação exibido ("Invoice atualizado com sucesso!"):**
 
<img width="986" height="350" alt="Toast verde de confirmacao" src="https://github.com/user-attachments/assets/cd1e0a29-eb35-46eb-8002-aa59c2522a10" />

- 📷 **Após recarregar a página (F5), a fatura do cartão desaparece e o campo reaparece vazio:**
 
<img width="973" height="350" alt="Campo de fatura do cartao reaparece vazio" src="https://github.com/user-attachments/assets/c516f406-8b2b-42fa-9a5c-1dd68f44fffa" />

## Sugestão de Investigação
- Inspecionar a resposta da requisição de atualização da justificativa de Invoice (`PUT`/`PATCH` ou `POST .../invoice`):
  - Verificar se a propriedade `faturaCartaoId` ou `documentoFaturaCartaoId` está sendo zerada (`null`) no payload retornado pela API ou no salvamento do banco de dados.
  - No frontend, verificar se o mapeamento do objeto retornado pela API ao carregar o formulário no `onMounted` está lendo a propriedade correta do anexo da fatura do cartão.
