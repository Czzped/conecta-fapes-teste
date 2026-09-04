# Título
[Bug] Erro 400 Bad Request e TypeError ao submeter cotações de fornecedores ("Erro ao enviar as cotações: TypeError: Cannot read properties of undefined (reading '0')")

## ID
BUG-M014-FO-NF-008

## Requisito/Regra Violada
- Regra Canônica: M014: `RN07` / `RI-COT01` — Submissão e persistência do lote de cotações (`OrcamentoFornecedor`) para itens de valor superior a R$ 1.400,00
- Rota/Componente: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` — Seção `4. Cotação` (`usePrestacao-Dj_ayRuN.js`)
- Endpoint: `POST /api/prestacao-de-co…-fornecedor/batch`

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo

1. Acessar `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` com uma transação de débito contendo item com valor superior a R$ 1.400,00.
2. Na seção `4. Cotação`, anexar as 3 cotações de fornecedores exigidas (`3/3`).
3. Preencher os dados de cada orçamento (`Fornecedor`, `Valor` e `Data`).
4. Selecionar o orçamento de menor valor ou a cotação desejada (radio button à esquerda do card).
5. Clicar no botão ciano `Enviar cotações` no canto inferior direito da seção 4.
6. Observar o toast/popup exibido na tela e o erro registrado no console do navegador (`F12`).

## Dados de Entrada
- URL: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId`
- Cotações anexadas: 3 arquivos PDF de orçamento
- Endpoint acionado: `/api/prestacao-de-co...-fornecedor/batch`
- Ação: Clicar no botão `Enviar cotações`

## Comportamento Esperado
- O lote de 3 cotações de fornecedores deve ser enviado com sucesso ao backend (`200 OK`).
- A seção 4 deve ser confirmada e bloqueada ou apresentar o status de cotações enviadas com sucesso.
- Nenhuma exceção unhandled JavaScript deve ocorrer no console.

## Comportamento Atual
- A submissão falha no envio ao servidor, exibindo o toast de alerta *"Erro ao salvar as cotações."* no canto inferior direito da tela.
- A requisição para a API retorna erro **HTTP 400 Bad Request** no endpoint `.../fornecedor/batch`.
- O console do navegador registra a seguinte exceção unhandled:
  ```text
  Failed to load resource: the server responded with a status of 400 (Bad Request) /api/prestacao-de-co...-fornecedor/batch:1
  Uncaught (in promise) Error: Erro ao enviar as cotações: TypeError: Cannot read properties of undefined (reading '0')
      at Q (usePrestacao-Dj_ayRuN.js:4:12893)
      at async Promise.all (index 1)
      at async c (index-DPkYzQxp.js:38:102423)
  ```

## Evidências
- 📷 **Três cotações anexadas e preenchidas (Anexar Cotação 3/3):**

  `evidencias-BUG-NF-008-tres-cotacoes-anexadas.png`

- 📷 **Toast de alerta "Erro ao salvar as cotações" ao clicar em Enviar cotações:**

  `evidencias-BUG-NF-008-popup-erro-ao-salvar-cotacoes.png`

- 📷 **Console do navegador com HTTP 400 Bad Request e TypeError de leitura de propriedade '0':**

  `evidencias-BUG-NF-008-console-400-typeerror.png`

## Sugestão de Investigação (Opcional)
- A exceção `TypeError: Cannot read properties of undefined (reading '0')` na função `Q` de `usePrestacao-Dj_ayRuN.js:4:12893` indica que a função de montagem do payload está tentando acessar o primeiro elemento (índice `[0]`) de um array que está vindo como `undefined` ou nulo (ex: lista de arquivos de anexo, IDs dos itens vinculados ou id do fornecedor principal).
- Verificar a estrutura do objeto/array enviado na requisição `batch` para garantir que todas as chaves e coleções de itens de cotação estejam preenchidas antes do envio.