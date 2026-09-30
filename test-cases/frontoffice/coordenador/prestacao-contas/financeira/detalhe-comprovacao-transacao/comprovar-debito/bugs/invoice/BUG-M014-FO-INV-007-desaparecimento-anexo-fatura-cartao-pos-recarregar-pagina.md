## Título
[Bug] Substituição do anexo de Comprovante da Fatura do Cartão faz com que o nome do novo arquivo desapareça ao recarregar a página (deixando o campo como se estivesse vazio)

## ID
BUG-M014-FO-INV-007

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito de Invoice — **Seção 2 (Anexar Comprovante da Fatura do Cartão)**
- Regra Canônica: M014: `RN05` / `RI-INV01` (Gerenciamento e persistência da substituição de documentos secundários de Invoice - Fatura do Cartão)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: Exibição da notificação verde de confirmação (*"Invoice atualizado com sucesso!"*) indicando que a substituição da fatura foi realizada, porém ao recarregar a página (`F5`), o nome do novo arquivo de fatura desaparece e a caixa de upload fica parecendo um campo vazio sem anexo.
  - **Heurística #5 (Prevenção de Erros)**: Perda de estado de exibição do arquivo substituído. O usuário substitui um comprovante de fatura antigo por um novo, mas a aplicação falha em manter a renderização do novo nome do arquivo após o refresh da página.
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
2. Abrir uma prestação de débito de **Invoice** em rascunho que **já possua um comprovante da fatura do cartão de crédito anexado**.
3. Na Seção `2. Anexar Arquivos do Invoice *`, clicar em `Editar` (ou habilitar o modo de edição no campo `Comprovante da fatura do cartão`).
4. Remover a fatura antiga (`X`) e anexar um **novo arquivo de comprovante da fatura** (ex.: `NF-Notebooks.pdf`).
5. Clicar no botão `Confirmar edição` e verificar a exibição da notificação verde de sucesso (*"Invoice atualizado com sucesso!"*).
6. Recarregar a página no navegador (`F5` / `Ctrl+R`) ou reabrir a transação.
7. Inspecionar a caixa de upload do campo `Comprovante da fatura do cartão`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Fatura Preexistente: `8b06ec69...Cópia de cotacao_avell.pdf` (ou fatura original)
- Novo Arquivo Substituto: `NF-Notebooks.pdf` (13 KB)
- Ação: Substituição da fatura + Clique em `Confirmar edição` + Recarregar página (`F5`)

## Comportamento Esperado
- Ao substituir a fatura do cartão por um novo arquivo, confirmar a edição e atualizar a página (`F5`), o nome e detalhes do novo arquivo substituído (`NF-Notebooks.pdf`) devem continuar exibidos na caixa de anexo abaixo do campo.

## Comportamento Atual
- O sistema exibe o toast de sucesso (*"Invoice atualizado com sucesso!"*) e demonstra temporariamente que a substituição foi feita na tela.
- No entanto, ao recarregar a página (`F5`), o nome do novo arquivo que deveria ser exibido abaixo do campo de anexo da fatura do cartão desaparece, deixando o componente parecendo um campo vazio sem nenhum comprovante anexado.

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
