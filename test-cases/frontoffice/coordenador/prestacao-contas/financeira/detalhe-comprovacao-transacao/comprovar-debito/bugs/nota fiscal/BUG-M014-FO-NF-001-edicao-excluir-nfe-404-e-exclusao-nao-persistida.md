# Título
[Bug] Exclusão de NF-e na edição retorna 404 na primeira tentativa e não persiste a remoção mesmo com popup de sucesso

## ID
BUG-M014-FO-NF-001

## Requisito/Regra Violada
- Regra Canônica: M014: `RN05` / `RI-NFE01` — Integridade da edição e remoção do `DocumentoFiscal` vinculado à `JustificativaDespesa`
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` — Seção `2. Adicionar Descrição e Anexar Nota Fiscal *` (`usePrestacao-Dj_ayRuN.js`)
- Endpoint: `DELETE /api/prestacao-de-co…/documento-fiscal/:id`

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo

### Cenário A — Erro 404 ao excluir NF-e anexada na mesma sessão
> **Pré-condição:** A NF-e ainda **não** estava anexada antes da sessão atual. O próprio realizador do teste deve efetuar o upload e confirmar a NF-e nesta sessão, antes de tentar editá-la.

1. Acessar `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` com uma transação de débito **sem** NF-e previamente anexada.
2. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, anexar um arquivo XML ou PDF válido de NF-e.
3. Aguardar a leitura automática dos dados e clicar em `Confirmar` na seção de verificação.
4. Clicar no botão de edição da seção `2. Adicionar Descrição e Anexar Nota Fiscal *`.
5. Remover o arquivo de NF-e exibido no pill de upload (ícone de lixeira).
6. Clicar no botão `Confirmar` e em seguida em `Confirmar edição`.
7. Observar o toast/popup exibido na tela e os erros no console do navegador (`F12`).

### Cenário B — Exclusão não persistida mesmo com popup de sucesso
> **Pré-condição:** A NF-e **já estava** anexada e confirmada antes do início da sessão de teste (persistida em banco por sessão anterior ou reload).

1. Acessar `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` com NF-e já confirmada e visível na seção de verificação.
2. Clicar no botão de edição da seção `2. Adicionar Descrição e Anexar Nota Fiscal *`.
3. Remover o arquivo de NF-e do campo de upload (ícone de lixeira).
4. Clicar em `Confirmar` e em seguida em `Confirmar edição`.
5. Observar o toast de sucesso exibido.
6. Recarregar a página (`F5`).
7. Verificar se o anexo foi efetivamente removido.

## Dados de Entrada
- URL: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId`
- **Cenário A:** NF-e anexada na sessão atual (upload realizado pelo próprio testador na mesma sessão)
- **Cenário B:** NF-e já persistida (anexo existente antes do início da sessão de teste)
- Ação comum: editar seção → excluir arquivo → confirmar edição

## Comportamento Esperado

### Cenário A
- O sistema executa o `DELETE` do `DocumentoFiscal` com sucesso.
- O toast exibido é *"Nota fiscal editada com sucesso"*.
- Não há erros no console do navegador.

### Cenário B
- Após a confirmação com sucesso, ao recarregar a página, a área de upload deve estar vazia (sem nenhum arquivo anexado).
- A seção `Verificar Informações da Nota Fiscal` deve retornar ao estado recolhido/vazio.

## Comportamento Atual

### Cenário A
- Exibe o popup de erro *"Erro ao editar nota fiscal"* na tela.
- O console registra:
  ```
  Failed to load resource: the server responded with a status of 404 (Not Found)
  /api/prestacao-de-co…/documento-fiscal/:1

  Uncaught (in promise) Error: Erro ao editar nota fiscal: AxiosError: Request failed with status code 404
      at ae (usePrestacao-Dj_ayRuN.js:4:32216)
      at async Promise.all (index 1)
      at async c (index-DPkYzQxp.js:38:102423)
  ```
- Após recarregar a página, o anexo permanece inalterado.

### Cenário B
- O toast de sucesso *"Nota fiscal editada com sucesso"* é exibido corretamente.
- Porém, ao recarregar a página (`F5`), a NF-e anteriormente excluída continua aparecendo no campo de upload e na seção de verificação — a exclusão **não foi persistida** no servidor.

## Evidências
- 📷 **Popup de erro e estado da tela no Cenário A:** `evidencias-BUG-NF-001-popup-erro.png`
- 🧾 **Console com erro 404 (Cenário A):** `evidencias-BUG-NF-001-console-404.png`
  ```
  DELETE /api/prestacao-de-co…/documento-fiscal/:id → 404 Not Found
  Uncaught (in promise) Error: Erro ao editar nota fiscal: AxiosError: Request failed with status code 404
      at ae (usePrestacao-Dj_ayRuN.js:4:32216)
      at async Promise.all (index 1)
      at async c (index-DPkYzQxp.js:38:102423)
  ```
- 📷 **Toast de sucesso exibido no Cenário B (exclusão não persistida após F5):** `evidencias-BUG-NF-001-sucesso-falso.png`

## Sugestão de Investigação (Opcional)
- **Cenário A**: O ID do `DocumentoFiscal` referenciado no `DELETE` pode ser inválido ou inexistente quando o upload foi feito na mesma sessão — verificar se o ID retornado pelo backend no `POST` de upload está sendo corretamente armazenado no estado reativo do composable `usePrestacao` antes da chamada de edição.
- **Cenário B**: Verificar se a chamada de deleção (`DELETE /documento-fiscal/:id`) está sendo efetivamente enviada ao servidor durante o fluxo de `confirmarEdicao`, ou se a lógica omite o `DELETE` quando o `DocumentoFiscal` vem de uma sessão anterior, resultando em falso positivo no toast de sucesso.