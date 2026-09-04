# Título
[Bug] Edição de quantidade de item da Nota Fiscal exibe sucesso mas não persiste a alteração após recarregar a página

## ID
BUG-M014-FO-NF-003

## Requisito/Regra Violada
- Regra Canônica: M014: `RN05` — Integridade da edição de `ItemDocumentoFiscal` (quantidade, valor unitário e valor total) vinculado à `JustificativaDespesa`
- Rota/Componente: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` — Modal `Item da Nota Fiscal` dentro da seção `Verificar Informações da Nota Fiscal`
- Contrato/API: `M014: EditarItemNotaFiscal`

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo

> **Pré-condição:** NF-e já anexada, dados extraídos e confirmados (seção `Verificar Informações da Nota Fiscal` expandida e visível com os itens listados).

1. Acessar `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` com NF-e já confirmada.
2. Na seção `Verificar Informações da Nota Fiscal`, clicar no botão `Editar`.
3. Na tabela `Itens da Nota Fiscal`, clicar sobre um item para abrir o modal `Item da Nota Fiscal`.
4. Alterar o valor do campo `Quantidade` (ex: de `1` para `2`).
5. Clicar no botão `Confirmar` dentro do modal.
6. Clicar em `Confirmar edição` no rodapé da seção.
7. Observar o toast de sucesso exibido.
8. Recarregar a página (`F5`).
9. Verificar o valor do campo `Quantidade` do item editado na tabela.

## Dados de Entrada
- URL: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId`
- Item editado: `AR COND SPLIT HW LG AI DUAL INVERTER VOICE 9000 BTU FR 220V COND (S3UQ09AA3IC.EB2GAM1)`
- Campo alterado: `Quantidade` — de `1` para `2`
- Valor Unitário: `R$ 1.481,35`
- Valor Total esperado após edição: `R$ 2.962,70`

## Comportamento Esperado
- Ao clicar em `Confirmar edição`, o sistema persiste a alteração da quantidade do `ItemDocumentoFiscal` no servidor.
- O toast *"Nota fiscal editada com sucesso"* é exibido.
- Após recarregar a página (`F5`), a tabela `Itens da Nota Fiscal` exibe o item com a quantidade atualizada (`2`) e o valor total recalculado (`R$ 2.962,70`).

## Comportamento Atual
- O toast *"Nota fiscal editada com sucesso"* é exibido corretamente após a confirmação.
- Porém, ao recarregar a página (`F5`), o campo `Quantidade` retorna ao valor original (`1`) e o `Valor Total` volta a `R$ 1.481,35` — a alteração **não foi persistida** no servidor.

## Evidências
- 📷 **Modal `Item da Nota Fiscal` com quantidade alterada para `2` antes de confirmar:**

  `evidencias-BUG-NF-003-modal-item-nfe-edicao-quantidade.png`

- 📷 **Toast *"Nota fiscal editada com sucesso"* exibido (mas edição não persistida após F5):**

  `evidencias-BUG-NF-003-toast-sucesso-edicao-nao-persistida.png`

## Sugestão de Investigação (Opcional)
- Verificar se o payload enviado na chamada de `EditarItemNotaFiscal` inclui os campos atualizados do `ItemDocumentoFiscal` (quantidade, valor total recalculado) ou se apenas o `DocumentoFiscal` pai está sendo atualizado, omitindo a persistência dos itens filhos.