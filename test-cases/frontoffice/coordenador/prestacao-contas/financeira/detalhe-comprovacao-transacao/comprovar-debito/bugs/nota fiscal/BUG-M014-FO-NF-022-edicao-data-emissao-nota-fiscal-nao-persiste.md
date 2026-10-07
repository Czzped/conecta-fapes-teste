## Título
[Bug] Edição manual no campo de Data de Emissão da Nota Fiscal não persiste após salvar/confirmar

## ID
BUG-M014-FO-NF-022

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Seção 2 (Adicionar Descrição e Anexar Nota Fiscal / Verificar Informações da Nota Fiscal)**
- Regra Canônica: M014: `RN05` / `RN06` / `RI-NFE01` / `RI-NFE02` (Controle de edição e consolidação dos dados de `DocumentoFiscal`; garantia de integridade e persistência de metadados fiscais)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: O sistema permite a edição e inserção da data no campo, porém descarta o valor sem feedback ao usuário, dando a falsa impressão de que a alteração foi aplicada.
  - **Heurística #5 (Prevenção de Erros)**: O campo `Data de Emissão *` é obrigatório na comprovação. A falha em persistir a edição impede que o coordenador sane pendências ou preencha a data quando a extração automática estiver vazia (ex.: `BUG-M014-FO-NF-021`), gerando risco de bloqueio ou envio de dados incompletos.
- Casos de Teste Relacionados:
  - `CT-M014-FO-128` (Editar campos extraídos da Nota Fiscal e confirmar as alterações com sucesso)
  - `CT-M014-FO-112` (Validar omissão da data de emissão ao recarregar a página com Nota Fiscal salva)
  - `CT-M014-FO-040` (Verificar informações extraídas da NFe)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / `NotaFiscalCard.vue` / Campo `Data de Emissão *`)

## Ambiente
[ ] Produção  [x] Staging  [ ] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://stage.conectafapes.leds.dev.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o sistema com perfil de Coordenador no ambiente de Staging (`https://stage.conectafapes.leds.dev.br`).
2. Navegar até o extrato em `/coordenador/financeira` e abrir a tela de comprovação de uma transação de débito em `/coordenador/prestacao-financeira/detalhes/:paymentId`.
3. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, anexar um arquivo XML/PDF de Nota Fiscal.
4. No card da nota fiscal anexada, expandir o bloco *"Verificar Informações da Nota Fiscal"* (ou acionar o botão de edição `Editar`).
5. Localizar o campo obrigatório `Data de Emissão *`.
6. Preencher ou alterar o valor do campo com uma data válida (ex.: `28/08/2026`).
7. Confirmar a edição acionando o botão de confirmação (`Confirmar` / `Confirmar edição`).
8. Recarregar a página do navegador (`F5`) ou sair e reabrir o detalhe da transação.
9. Expandir novamente o bloco *"Verificar Informações da Nota Fiscal"* e verificar o campo `Data de Emissão *`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Seção: `2. Adicionar Descrição e Anexar Nota Fiscal *`
- Card: `Verificar Informações da Nota Fiscal`
- Nota Fiscal anexada: Documento eletrônico (ex.: emitente `FAST SHOP S.A.`)
- Campo editado: `Data de Emissão *`
- Valor inserido no campo: `28/08/2026`
- Ação disparada: Confirmação da edição e recarregamento da página (`F5`)

## Comportamento Esperado
- Ao preencher/editar o campo `Data de Emissão *` e confirmar a operação, o novo valor deve ser enviado no payload de atualização do documento fiscal, persistido com sucesso no banco de dados pelo backend e recarregado perfeitamente na interface (`28/08/2026`) após o refresh (`F5`) ou consultas posteriores.

## Comportamento Atual
- A alteração realizada no campo `Data de Emissão *` não é persistida. Após salvar/confirmar a edição e recarregar a página (ou reconsultar a transação), o campo `Data de Emissão *` retorna ao estado em branco exibindo apenas a máscara `dd/ mm /aaaa` (ou restaura o valor prévio), descartando completamente a edição realizada pelo usuário.

## Evidências
- 📷 **Painel de informações da Nota Fiscal onde o campo 'Data de Emissão *' é editado:**
  ![Campo Data de Emissao Vazio](evidencias-BUG-NF-021-01-campo-data-emissao-vazio.png)

## Sugestão de Investigação
- Inspecionar o componente `NotaFiscalCard.vue` e os composables de formulário para verificar se a variável do campo `dataEmissao` (ou `issueDate`) está vinculada via `v-model` e sendo enviada no payload das requisições de salvamento/atualização (`PUT` / `PATCH`).
- Verificar se o endpoint/comando de atualização de Documento Fiscal no backend (M014 - `AtualizarDadosNotaFiscal` ou similar) recebe a propriedade `dataEmissao`, faz a atribuição na entidade de domínio e executa o `SaveChangesAsync`.
- Verificar se a query de leitura dos detalhes da comprovação (`ObterDetalhesJustificativaDespesa`) projeta e retorna o campo `dataEmissao` no DTO de resposta da API para que o frontend possa exibi-lo ao carregar a tela.
