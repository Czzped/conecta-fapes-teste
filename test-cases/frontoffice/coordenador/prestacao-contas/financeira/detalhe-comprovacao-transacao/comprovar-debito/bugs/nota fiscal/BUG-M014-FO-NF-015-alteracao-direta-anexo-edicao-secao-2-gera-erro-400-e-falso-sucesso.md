## Título
[Bug] Alteração direta de anexo na edição da Seção 2 exibe toast de sucesso falso, falha com erro 400 (item-documento-fiscal/undefined) e não persiste após reload

## ID
BUG-M014-FO-NF-015

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — Tipo de Documento: **Nota Fiscal**
- Regra Canônica: M014: `RN05` / `RN06` / `RI-NFE01` (Integridade da edição e substituição do `DocumentoFiscal` e sincronização atômica com `ItemDocumentoFiscal` na Seção `3. Associar Compra`)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: Falso feedback positivo ao exibir notificação verde de sucesso (*"Nota fiscal editada com sucesso"*) enquanto o backend rejeita a sincronização com erros 400.
  - **Heurística #5 (Prevenção de Erros)**: A interface induz o usuário a acreditar que a substituição da nota fiscal ocorreu, mas o sistema mantém silenciosamente o documento anterior.
- Caso de Teste Relacionado: `CT-M014-FO-039` / `CT-M014-FO-040` / `CT-M014-FO-107`
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `2. Adicionar Descrição e Anexar Nota Fiscal *`)
- Endpoints afetados:
  - `PUT /api/prestacao-de-contas/projeto/:projectId/item-documento-fiscal/undefined` (HTTP 400 Bad Request)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar uma comprovação de débito que já possua uma Nota Fiscal anexada e confirmada (ex.: documento `...procNfe.pdf` com itens vinculados na Seção 3).
2. Na Seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, clicar no botão ciano `Editar`.
3. Sem acionar o botão "Trocar nota fiscal", clicar diretamente na área/campo de upload e selecionar um arquivo de nota fiscal substituto (ex.: `DANFE__Sofa.pdf`).
4. Clicar no botão ciano `Confirmar edição`.
5. Observar o toast de sucesso verde exibido no rodapé (*"Nota fiscal editada com sucesso"*).
6. Abrir as ferramentas de desenvolvedor (`F12`) e inspecionar as abas **Console** e **Rede (Network)**.
7. Observar que a Seção `3. Associar Compra *` não é atualizada, permanecendo com os itens da nota fiscal antiga.
8. Recarregar a página (`F5`).
9. Constatar que a Seção 2 reverte para a nota fiscal original (`...procNfe.pdf`), demonstrando que o novo arquivo não foi persistido.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Anexo Original: `0208cb4c-a83e-4d30-b34e-df453273e9cf-32240743708370014888885001000024088100240850-procNfe.pdf`
- Novo Anexo Selecionado na Edição: `DANFE__Sofa.pdf`
- Ação executada: Clicar em Editar na Seção 2 → Selecionar novo anexo → Confirmar edição → Recarregar com F5

## Comportamento Esperado
- Ao alterar o anexo de nota fiscal diretamente durante a edição da Seção 2:
  1. O sistema deve validar e persistir o novo `DocumentoFiscal` e recarregar os novos itens na Seção `3. Associar Compra *`.
  2. Não devem ser disparadas requisições com identificadores indefinidos (`/item-documento-fiscal/undefined`).
  3. Caso ocorram respostas de erro (HTTP 400) no backend, o frontend **não deve** exibir toast de sucesso (*"Nota fiscal editada com sucesso"*), mas sim capturar o erro e informar o usuário.
  4. A substituição do documento e seus itens deve ser mantida após recarregar a página (`F5`).

## Comportamento Atual
- O frontend exibe a notificação de falso sucesso: *"Nota fiscal editada com sucesso"*.
- No entanto, no backend ocorrem falhas consecutivas com código `400 (Bad Request)` nas chamadas `PUT`:
  ```text
  PUT https://conectafapes.hom.es.gov.br/api/prestacao-de-contas/projeto/70f0b687-0ac1-45b7-abf7-08ddf54b091c/item-documento-fiscal/undefined 400 (Bad Request)
  PUT https://conectafapes.hom.es.gov.br/api/prestacao-de-contas/projeto/70f0b687-0ac1-45b7-abf7-08ddf54b091c/item-documento-fiscal/undefined 400 (Bad Request)
  PUT https://conectafapes.hom.es.gov.br/api/prestacao-de-contas/projeto/70f0b687-0ac1-45b7-abf7-08ddf54b091c/item-documento-fiscal/undefined 400 (Bad Request)
  ```
- A Seção 3 não sincroniza os novos itens e, ao recarregar a página (`F5`), o anexo é revertido para a nota fiscal original.

## Evidências
- 📷 **Seção 2 com anexo original antes da edição (`...procNfe.pdf`):**
  ![Anexo Original](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-015-secao-2-anexo-original.png)

- 📷 **Substituição direta pelo arquivo `DANFE__Sofa.pdf` em modo de edição:**
  ![Substituição Direta](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-015-alteracao-direta-novo-anexo-sofa.png)

- 📷 **Toast de sucesso falso exibido com itens antigos mantidos na Seção 3:**
  ![Toast Sucesso Falso](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-015-toast-sucesso-falso-itens-desatualizados.png)

- 📷 **Console do DevTools com 3 chamadas PUT com status 400 para `/item-documento-fiscal/undefined`:**
  ![Console 400 Bad Request](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-015-console-put-item-documento-fiscal-undefined-400.png)

- 📷 **Aba Rede (Network) confirmando 3 responses HTTP 400 Bad Request com nome `undefined`:**
  ![Network 400 Bad Request](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-015-network-respostas-400-bad-request.png)

## Sugestão de Investigação
- No método `confirmarEdicao` do composable `usePrestacao`:
  - Ao substituir o anexo na Seção 2 sem o fluxo de "Trocar nota fiscal", o frontend tenta atualizar itens chamando `PUT /api/prestacao-de-contas/projeto/:projectId/item-documento-fiscal/{item.id}`. Como os novos itens do arquivo substituto ainda não foram cadastrados no banco de dados, a propriedade `item.id` é `undefined`, disparando requisições com rota corrompida (`/item-documento-fiscal/undefined`).
  - O fluxo de tratamento de erros assíncronos (`Promise.all` / `try-catch`) não barra a notificação de sucesso quando as requisições de itens falham com 400.
  - Correção recomendada:
    1. Se houver substituição de arquivo, realizar a deleção/recriação do `DocumentoFiscal` e recadastrar os itens em lote via `POST` antes de qualquer `PUT`;
    2. Garantir que qualquer falha HTTP (4xx/5xx) interrompa o fluxo e exiba um toast de erro ao invés de falso sucesso.
