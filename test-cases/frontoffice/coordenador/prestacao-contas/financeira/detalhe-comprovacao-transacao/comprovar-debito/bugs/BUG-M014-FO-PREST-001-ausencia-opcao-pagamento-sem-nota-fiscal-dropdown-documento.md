## Título
[Bug] Ausência da opção "Pagamento sem Nota Fiscal" no seletor de tipo de documento da comprovação de débito

## ID
BUG-M014-FO-PREST-001

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Seção 1 (Informações Gerais)**
- Regra Canônica: M014: `RN02` / Especificação de UX e Protótipo de Comprovação de Débito — Permissão para justificativa de pagamentos realizados a fornecedores sem emissão de Nota Fiscal (orientando devolução/estorno ou registro de observação)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #3 (Controle e Liberdade do Usuário)**: O Coordenador fica impossibilitado de dar vazão ao fluxo de prestação de contas quando realizou uma transação bancária com fornecedor que não emite documento fiscal.
  - **Heurística #4 (Consistência e Padrões)**: Divergência direta entre a especificação visual do protótipo e as opções implementadas em produção/homologação.
- Caso de Teste Relacionado: `CT-M014-FO-071` / `CT-M014-FO-037` (Seleção de tipo de documento)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Dropdown de seleção de `Documento`)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro do projeto em `/coordenador/financeira`.
2. Abrir uma transação bancária do tipo Débito pendente de comprovação.
3. Na Seção `1. Informações Gerais *`, clicar no campo de seleção/dropdown `Documento`.
4. Observar a lista de opções de documentos oferecida na interface.
5. Comparar as opções exibidas com a especificação técnica do protótipo oficial de UX.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Campo: Select `Documento` em `1. Informações Gerais *`

## Comportamento Esperado
- Conforme o protótipo e especificação de UX, a lista do campo `Documento` deve apresentar todas as opções previstas:
  1. `Nota Fiscal (Produto ou Serviço)`
  2. `Diária`
  3. `Passagem`
  4. `Invoice (Pagamento Internacional)`
  5. `Pagamento sem Nota Fiscal`
- Ao selecionar `Pagamento sem Nota Fiscal`, o sistema deve exibir a caixa informativa orientando sobre a obrigatoriedade de devolução/estorno e disponibilizar o campo de observação conforme desenhado no protótipo.

## Comportamento Atual
- O dropdown `Documento` na aplicação renderiza apenas 3 opções:
  - `Nota Fiscal (Produto ou Serviço)`
  - `Passagem`
  - `Invoice (Pagamento Internacional)`
- A opção **`Pagamento sem Nota Fiscal`** (bem como a opção `Diária`) encontra-se omitida da lista, impedindo o Coordenador de selecionar essa modalidade de comprovação.

## Evidências
- 📷 **Opções exibidas atualmente na aplicação (omitindo "Pagamento sem Nota Fiscal"):**
  ![Dropdown Atual na Aplicação](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/evidencias-BUG-PREST-001-dropdown-producao-sem-opcao-sem-nota.png)

- 📷 **Especificação oficial do protótipo exibindo a lista completa de opções (incluindo "Pagamento sem Nota Fiscal"):**
  ![Dropdown no Protótipo](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/evidencias-BUG-PREST-001-dropdown-prototipo-com-opcoes-completas.png)

- 📷 **Fluxo e alertas da opção "Pagamento sem Nota Fiscal" especificados no protótipo:**
  ![Fluxo Pagamento sem Nota Fiscal no Protótipo](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/evidencias-BUG-PREST-001-fluxo-sem-nota-prototipo.png)

## Sugestão de Investigação
- Inspecionar a enumeração e a lista estática de opções do select de documentos no frontend (`ComprovarDebito.vue` / composable `usePrestacao`):
  - Adicionar a opção `PAGAMENTO_SEM_NOTA_FISCAL` (`Pagamento sem Nota Fiscal`) ao array de opções do dropdown.
  - Implementar o componente condicional (`v-if="tipoDocumento === 'PAGAMENTO_SEM_NOTA_FISCAL'"`) para renderizar a caixa de aviso em vermelho de devolução/estorno e a área de texto de `Observação` (até 250 caracteres) conforme especificado no protótipo.
