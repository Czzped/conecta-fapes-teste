# Título
[Bug] Substituição de Nota Fiscal exibe sucesso mas não persiste no servidor e não atualiza os itens na seção "Associar Compra"

## ID
BUG-M014-FO-NF-005

## Requisito/Regra Violada
- Regra Canônica: M014: `RN05` / `RN06` / `RI-NFE01` — Integridade da substituição de `DocumentoFiscal` e sincronização com os itens na seção `Associar Compra`
- Rota/Componente: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` — Seções 2 e 3 (`ComprovarDebito.vue`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo

1. Acessar `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` com uma transação de débito pendente.
2. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, anexar uma primeira Nota Fiscal (ex: NF-e A - *Ar Condicionado*) e enviar/confirmar as informações.
3. Observar a seção `3. Associar Compra *`, verificando que os itens exibidos pertencem à NF-e A.
4. Voltar à seção 2, clicar em `Editar`, remover a NF-e A e anexar uma nova Nota Fiscal distinta (ex: NF-e B).
5. Clicar no botão `Enviar Nota Fiscal` (ou `Confirmar edição`).
6. Observar o toast de sucesso e inspecionar a seção `3. Associar Compra *`.
7. Recarregar a página (`F5`).
8. Verificar qual Nota Fiscal permanece anexada na Seção 2 e quais itens são exibidos na Seção 3.

## Dados de Entrada
- URL: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId`
- NF-e A (Inicial): `3aaeb5cb-e940-4bf2-bf51-42d03aebb5ef0-NF Ar Condicionado.pdf` (Itens: *AR COND SPLIT HW LG...*)
- NF-e B (Substituta): Segunda Nota Fiscal com arquivo e itens distintos
- Ação: Editar Seção 2 → Substituir NF-e A por NF-e B → Enviar Nota Fiscal → Recarregar a página (`F5`)

## Comportamento Esperado
- Ao enviar uma nova Nota Fiscal na Seção 2:
  1. A substituição do arquivo e dos dados extraídos da NF-e B deve ser **persistida no servidor**.
  2. Os itens da seção `3. Associar Compra *` devem ser **atualizados imediatamente**, refletindo os novos itens da NF-e B.
  3. Ao recarregar a página (`F5`), a NF-e B e seus itens devem continuar exibidos na tela.

## Comportamento Atual
- **Na tela imediatamente após o reenvio:** O toast *"Nota fiscal editada com sucesso"* (ou equivalente) é exibido, mas a seção `3. Associar Compra *` **não atualiza sua lista de itens**, continuando a exibir os itens antigos da NF-e A.
- **Após recarregar a página (F5):** A substituição é completamente perdida — a Seção 2 reverte para a NF-e A (anexo e dados anteriores), demonstrando que o reenvio/substituição de Nota Fiscal **não foi persistido** no backend, gerando um falso positivo no frontend.

## Evidências
- 📷 **Nova NF-e B anexada e enviada na Seção 2 (mas Seção 3 mantendo itens antigos da NF-e A):**

  `evidencias-BUG-NF-005-nfe-substituida-secao-2.png`

- 📷 **Seção 3 "Associar Compra" mantendo os itens desatualizados da NF-e A:**

  `evidencias-BUG-NF-005-associar-compra-itens-antigos-mantidos.png`

- 📷 **Após recarregar a página (F5), a NF-e A anterior retorna como anexo ativo (substituição não persistida):**

  `evidencias-BUG-NF-005-reload-retorna-nfe-anterior.png`

## Sugestão de Investigação (Opcional)
- Verificar se a requisição de atualização/substituição de `DocumentoFiscal` na Seção 2 está executando a chamada `PUT`/`PATCH` ou `DELETE + POST` correta na API.
- Garantir que a store/estado reativo acione o recarregamento dos dados de `ItemDocumentoFiscal` para a Seção 3 (`Associar Compra`) sempre que um novo documento for persistido com sucesso.