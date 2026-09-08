## Título
[Bug] Seção de cotação permanece habilitada para upload e edição mesmo após o envio da transação para análise

## ID
BUG-M014-FO-PAS-009

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — Tipo de Documento: **Passagem** (aplicável aos demais tipos de documento com cotação)
- Regra Canônica: M014: `RN03` (Bloqueio em Análise — Transação submetida, em contestação ou em análise deve ter seu formulário e comprovantes estritamente congelados contra novas edições e uploads) / `RN08` (Terminalidade de status) / `RN10` (Submissão da prestação de contas)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: A interface indica claramente que a transação está sob análise/contestação da FAPES, porém permite ações incoerentes de alteração e envio de orçamentos.
  - **Heurística #5 (Prevenção de Erros)**: A ausência de bloqueio na cotação permite que o usuário adicione ou modifique orçamentos enquanto o analista da FAPES avalia o processo, gerando inconsistência documental e risco de auditoria.
- Caso de Teste Relacionado: `CT-M014-FO-048` / `CT-M014-FO-085` (Garantir bloqueio do formulário e comprovantes após submissão)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Fluxo: Débito > Passagem / Seção `4. Cotação`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro da iniciativa em `/coordenador/financeira`.
2. Abrir o detalhe de uma comprovação de débito que já tenha sido submetida ou contestada (status `Contestada`, `Em Análise`, `Aprovado` etc.).
3. Constatar que no cabeçalho consta a mensagem de bloqueio (ex.: *"Sua contestação foi enviada e está em análise pela FAPES."*) e que as seções `1. Informações Gerais`, `2. Anexar Comprovantes da Passagem` e `3. Informações da Passagem` encontram-se em modo somente leitura (`disabled`).
4. Rolar a página até a seção `4. Cotação`.
5. Observar que a área de upload e o botão `Anexar Cotação 0/3` continuam habilitados e interativos.
6. Clicar no botão ou arrastar arquivos de cotação (ex.: 3 orçamentos em PDF).
7. Aguardar o processamento dos arquivos anexados.
8. Constatar que os cards de cotação são renderizados com campos de `Fornecedor`, `Valor` e `Data` totalmente habilitados e editáveis, permitindo alterações e submissões indevidas em um registro que deveria estar integralmente bloqueado.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Status do Pagamento: `Contestada` (*"Sua contestação foi enviada e está em análise pela FAPES."*)
- Seção 4: 3 arquivos PDF de orçamento anexados (`3/3`)
- Ação executada: Inserção de arquivos e edição dos inputs de fornecedor, valor e data de cotação

## Comportamento Esperado
- Quando a transação possuir qualquer status diferente de `Em Rascunho` (como `Em Análise`, `Contestada`, `Aprovada`, `Recusada`), **todos os elementos da Seção de Cotação devem estar estritamente desabilitados (somente leitura)**:
  - A área de drag-and-drop e o botão `Anexar Cotação` não devem permitir novos envios.
  - Os campos de texto e data de cada orçamento anexado devem estar em modo `disabled` ou texto estático.
  - As ações de exclusão (ícone de lixeira) devem estar desabilitadas ou ocultas.

## Comportamento Atual
- A Seção de Cotação ignora o status da transação e permanece totalmente habilitada.
- O usuário consegue anexar novos orçamentos, disparar o processamento dos arquivos e editar livremente os dados extraídos de fornecedor, valor e data em uma transação já enviada e sob análise.

## Evidências
- 📷 **Cabeçalho com status `Contestada` ("Sua contestação foi enviada e está em análise pela FAPES"):**
  ![Status Contestada](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-009-transacao-status-contestada.png)

- 📷 **Seção 4 (Cotação) com botão de upload e área interativa habilitados:**
  ![Upload Cotação Habilitado](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-009-secao-cotacao-habilitada-upload.png)

- 📷 **Campos de fornecedor, valor e data editáveis após upload em transação contestada:**
  ![Campos de Cotação Editáveis](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-009-campos-cotacao-editaveis-pos-envio.png)

## Sugestão de Investigação
- No componente `ComprovarDebito.vue`, certificar-se de que a flag booleana de bloqueio (`isReadOnly` / `isEditable`) baseada no status da transação (`status !== 'Em Rascunho'`) seja passada via prop para o componente de Cotação.
- No componente de Cotação:
  - Aplicar `:disabled="isReadOnly"` na zona de upload e no botão `Anexar Cotação`.
  - Aplicar `:disabled="isReadOnly"` nos inputs de `Fornecedor`, `Valor` e `Data`.
  - Ocultar ou desativar o botão de exclusão (`v-if="!isReadOnly"`).
