## Título
[Bug] Exclusão de NF-e na edição retorna erro 404 e toast de falha ao excluir anexo enviado na mesma sessão

## ID
BUG-M014-FO-NF-001

## Requisito/Regra Violada
- Regra Canônica: M014: `RN05` / `RI-NFE01` — Integridade da edição e remoção do `DocumentoFiscal` vinculado à `JustificativaDespesa`
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` — Seção `2. Adicionar Descrição e Anexar Nota Fiscal *` (`usePrestacao-Dj_ayRuN.js`)
- Endpoint API: `DELETE /api/prestacao-de-contas/documento-fiscal/:id`
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #9 (Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros)**: Disparo de erro impeditivo genérico sem diagnóstico claro sobre a falha de sincronização do ID da NF-e.
  - **Heurística #3 (Controle e Liberdade do Usuário)**: O usuário anexa uma nota fiscal na sessão ativa, mas fica impossibilitado de removê-la em seguida caso precise retificar o arquivo.

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
> **Pré-condição:** A NF-e ainda **não** estava anexada antes da sessão atual. O próprio realizador do teste deve efetuar o upload e confirmar a NF-e nesta mesma sessão antes de tentar editá-la.

1. Acessar `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` com uma transação de débito sem nota fiscal anexada.
2. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, anexar um arquivo XML ou PDF válido de NF-e.
3. Aguardar a extração automática dos dados e clicar no botão `Confirmar` da seção de verificação.
4. Clicar no botão de edição da seção `2. Adicionar Descrição e Anexar Nota Fiscal *`.
5. Remover o arquivo de NF-e exibido no pill de upload clicando no ícone de lixeira (`✕`).
6. Clicar em `Confirmar` e em seguida em `Confirmar edição`.
7. Observar o toast de erro exibido na tela e as falhas registradas no console do navegador (`F12`).

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Pré-condição: Upload e confirmação de NF-e efetuados na sessão corrente
- Ação executada: Editar seção 2 → Remover anexo da NF-e recém-inserida → Confirmar edição

## Comportamento Esperado
- O sistema deve disparar a requisição `DELETE /api/prestacao-de-contas/documento-fiscal/:id` com o ID válido retornado pelo upload recente.
- A exclusão deve ser processada com sucesso no backend (HTTP 200/204), exibindo o toast *"Nota fiscal editada com sucesso"*.
- O anexo deve ser removido da interface sem erros no console.

## Comportamento Atual
- A tela exibe o popup/toast de erro: *"Erro ao editar nota fiscal"*.
- A requisição `DELETE` falha com `HTTP 404 (Not Found)` apontando para um identificador inconsistente (`/documento-fiscal/:1`).
- O console do navegador registra:
  ```text
  Failed to load resource: the server responded with a status of 404 (Not Found)
  /api/prestacao-de-co…/documento-fiscal/:1

  Uncaught (in promise) Error: Erro ao editar nota fiscal: AxiosError: Request failed with status code 404
      at ae (usePrestacao-Dj_ayRuN.js:4:32216)
      at async Promise.all (index 1)
      at async c (index-DPkYzQxp.js:38:102423)
  ```
- Ao recarregar a página (`F5`), o anexo permanece inalterado.

## Evidências
- 📷 **Popup de erro e estado da tela ao tentar excluir NF-e da mesma sessão:**
  <img width="1706" height="924" alt="Popup de erro e estado da tela" src="https://github.com/user-attachments/assets/0a5844de-b635-4eac-b8c6-ccf510c53b7b" />

- 🧾 **Console do navegador com erro HTTP 404 no DELETE:**
  <img width="994" height="352" alt="Console 404 Not Found" src="https://github.com/user-attachments/assets/3b3098a9-b8ca-4666-8083-ec0999887145" />

## Sugestão de Investigação
- O ID do `DocumentoFiscal` referenciado na requisição `DELETE` está sendo montado incorretamente (`/documento-fiscal/:1` ou nulo) quando o anexo foi inserido na sessão ativa.
- Verificar se o ID retornado pelo backend na resposta do `POST` de upload/criação da nota fiscal está sendo devidamente capturado e atualizado no estado reativo do composable `usePrestacao` antes de disparar o método de exclusão.
