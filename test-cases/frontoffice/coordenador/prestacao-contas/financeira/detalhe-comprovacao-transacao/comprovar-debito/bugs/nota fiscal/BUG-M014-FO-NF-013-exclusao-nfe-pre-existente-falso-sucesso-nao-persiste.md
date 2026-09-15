## Título
[Bug] Exclusão de NF-e pré-existente exibe toast de sucesso mas não persiste após recarregar a página (F5)

## ID
BUG-M014-FO-NF-013

## Requisito/Regra Violada
- Regra Canônica: M014: `RN05` / `RI-NFE01` — Integridade da edição e remoção do `DocumentoFiscal` vinculado à `JustificativaDespesa`
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` — Seção `2. Adicionar Descrição e Anexar Nota Fiscal *` (`usePrestacao-Dj_ayRuN.js`)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: Falso feedback positivo ao exibir mensagem de sucesso para uma operação que não foi concretizada no servidor.
  - **Heurística #5 (Prevenção de Erros)**: Induz o coordenador a acreditar que a prestação foi ajustada, podendo submeter uma prestação com comprovante indevido.

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
> **Pré-condição:** A NF-e **já estava** anexada e confirmada antes do início da sessão de teste (persistida em banco por sessão anterior ou recarregamento).

1. Acessar `/coordenador/prestacao-financeira/detalhes/:paymentId` com uma transação que possua NF-e previamente confirmada e visível na seção de verificação.
2. Clicar no botão de edição da seção `2. Adicionar Descrição e Anexar Nota Fiscal *`.
3. Remover o arquivo de NF-e exibido no campo de upload clicando no ícone de lixeira (`✕`).
4. Clicar no botão `Confirmar` e em seguida em `Confirmar edição`.
5. Observar a exibição do toast de sucesso: *"Nota fiscal editada com sucesso"*.
6. Recarregar a página (`F5`).
7. Verificar se o anexo foi efetivamente removido da interface.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Pré-condição: NF-e já persistida em sessão anterior
- Ação executada: Editar seção 2 → Remover anexo da NF-e existente → Confirmar edição → Recarregar com F5

## Comportamento Esperado
- Após a confirmação da edição com a exclusão do anexo, a remoção do `DocumentoFiscal` deve ser persistida com sucesso no banco de dados.
- Ao recarregar a página (`F5`), a área de upload deve estar vazia (sem nenhum arquivo anexado) e a seção `Verificar Informações da Nota Fiscal` deve retornar ao estado recolhido/vazio.

## Comportamento Atual
- O sistema exibe o toast de confirmação *"Nota fiscal editada com sucesso"*, gerando um falso positivo.
- No entanto, ao recarregar a página (`F5`), a NF-e anteriormente excluída continua aparecendo normalmente no campo de upload e na seção de verificação — a exclusão **não foi persistida** no servidor.

## Evidências
- 📷 **Toast de sucesso falso exibido na tela (exclusão não persistida após F5):**
  <img width="1668" height="847" alt="Toast de sucesso falso exibido na tela" src="https://github.com/user-attachments/assets/ee3317f6-576a-4058-bbee-79d6871f5bd4" />

## Sugestão de Investigação
- Verificar se a chamada de deleção (`DELETE /api/prestacao-de-contas/documento-fiscal/:id`) está sendo efetivamente enviada ao servidor durante a execução do método `confirmarEdicao`.
- Avaliar se a lógica de submissão do formulário omite a requisição `DELETE` quando o `DocumentoFiscal` é proveniente de uma sessão anterior (carregado via `GET`), assumindo erroneamente que não houve alteração e disparando o toast de sucesso sem confirmação de persistência no backend.
