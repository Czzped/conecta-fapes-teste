## Título
[Dúvida/Sugestão] Disponibilização da opção "Pagamento sem Nota Fiscal" no seletor de tipo de documento da comprovação de débito

## ID
BUG-M014-FO-PREST-001

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Seção 1 (Informações Gerais)**
- Regra Canônica: M014: `RN02` / Especificação de UX e Protótipo de Comprovação de Débito — Permissão para justificativa de pagamentos realizados a fornecedores sem emissão de Nota Fiscal (orientando devolução/estorno ou registro de observação)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #3 (Controle e Liberdade do Usuário)**: Dar alternativa de fluxo ao Coordenador caso tenha realizado uma transação bancária com fornecedor que não emite documento fiscal.
  - **Heurística #4 (Consistência e Padrões)**: Alinhamento com a especificação visual do protótipo de UX.
- Caso de Teste Relacionado: `CT-M014-FO-071` / `CT-M014-FO-037` (Seleção de tipo de documento)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Dropdown de seleção de `Documento`)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Contexto e Passo a Passo
1. Acessar o extrato financeiro do projeto em `/coordenador/financeira`.
2. Abrir uma transação bancária do tipo Débito pendente de comprovação.
3. Na Seção `1. Informações Gerais *`, clicar no campo de seleção/dropdown `Documento`.
4. Observar a lista de opções de documentos oferecida na interface.
5. Notar que atualmente estão disponíveis as opções `Nota Fiscal (Produto ou Serviço)`, `Passagem` e `Invoice (Pagamento Internacional)`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Campo: Select `Documento` em `1. Informações Gerais *`

## Dúvida / Alinhamento de Produto
- No protótipo de UX da prestação de contas, constam as opções de **`Pagamento sem Nota Fiscal`** (e `Diária`) no campo `Documento`.
- Ao selecionar `Pagamento sem Nota Fiscal` no protótipo, a interface apresenta uma caixa informativa orientando que a FAPES aceita apenas pagamentos com nota e instruindo o coordenador sobre a necessidade de devolução/estorno, além de abrir o campo de observações de até 250 caracteres.
- **Pergunta / Verificação:** Gostaria de confirmar se este fluxo de *"Pagamento sem Nota Fiscal"* já está no radar para ser implementado nas próximas sprints ou se foi uma funcionalidade deliberadamente postergada para fases futuras do projeto?

## Comportamento Atual Observado
- O dropdown `Documento` na aplicação atual exibe apenas 3 opções:
  - `Nota Fiscal (Produto ou Serviço)`
  - `Passagem`
  - `Invoice (Pagamento Internacional)`
- As opções `Pagamento sem Nota Fiscal` e `Diária` não aparecem na lista atual do ambiente.

## Evidências
- 📷 **Opções exibidas atualmente na aplicação (dropdown com 3 opções):**
  ![Dropdown Atual na Aplicação](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/evidencias-BUG-PREST-001-dropdown-producao-sem-opcao-sem-nota.png)

- 📷 **Especificação no protótipo exibindo a opção "Pagamento sem Nota Fiscal":**
  ![Dropdown no Protótipo](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/evidencias-BUG-PREST-001-dropdown-prototipo-com-opcoes-completas.png)

- 📷 **Fluxo informativo e campo de observação previsto no protótipo:**
  ![Fluxo Pagamento sem Nota Fiscal no Protótipo](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/evidencias-BUG-PREST-001-fluxo-sem-nota-prototipo.png)

## Sugestão de Implementação (Caso Confirmado)
- Caso seja um ajuste planejado para a sprint atual:
  1. Incluir a opção `PAGAMENTO_SEM_NOTA_FISCAL` no enum do select de documentos (`ComprovarDebito.vue` / `usePrestacao`).
  2. Implementar a renderização condicional do banner de aviso de devolução e da caixa de texto de `Observação` (até 250 caracteres) conforme desenhado no protótipo.
