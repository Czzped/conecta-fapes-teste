## Título
[Bug] Seção 4 (Cotação) é exibida indevidamente para despesas de passagem com valor total inferior a R$ 1.400,00

## ID
BUG-M014-FO-PAS-008

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — Tipo de Documento: **Passagem**
- Regra Canônica: M014: `RN05` (Cada justificativa de despesa pode ter até 3 `OrcamentoFornecedor`, aplicável exclusivamente a despesas/itens com valor superior ao limite normativo de 300 VRTE / R$ 1.400,00) / Fluxo 4 de `processo.md` (Linha 446: *"Se a compra for menor que 300 VRTE, a sessão de Cotacao não deve aparecer para o usuário."*)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #8 (Estética e Design Minimalista)**: Informações e etapas desnecessárias ao objetivo do usuário não devem ser exibidas.
  - **Heurística #5 (Prevenção de Erros)**: A presença indevida de seção de cotação confunde o usuário e induz à busca desnecessária de orçamentos ou receio de rejeição da prestação.
- Caso de Teste Relacionado: `CT-M014-FO-044` (Exigir três orçamentos apenas para compras/despesas acima do limite)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Fluxo: Débito > Passagem / Seção `4. Cotação`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro da iniciativa em `/coordenador/financeira`.
2. Selecionar uma transação de débito pendente com valor inferior ao teto de R$ 1.400,00 (ex.: `R$ 387,49`).
3. No formulário de comprovação de débito, selecionar o tipo de documento `Passagem`.
4. Preencher as seções `1. Informações Gerais`, `2. Anexar Comprovantes da Passagem` e `3. Informações da Passagem` (informando passageiros cuja soma totalize o valor da transação, ex.: Passageiro 1 = R$ 10,00 e Passageiro 2 = R$ 377,49, total de `R$ 387,49`).
5. Rolar a página até o rodapé para submeter a comprovação.
6. Observar que a seção `4. Cotação` é exibida no formulário contendo a instrução *"Se você comprou um item de valor superior a R$ 1.400, envie 3 orçamentos e selecione o de menor valor..."* e o slot para upload *"Anexar Cotação 0/3"*.

## Dados de Entrada
- Valor Total da Transação: `R$ 387,49` (Destinatário: `67.123.045/0001-60`, Data: `22/07/2026`)
- Passageiro 1: Nome `teste` | Valor `R$ 10,00`
- Passageiro 2: Nome `teste` | Valor `R$ 377,49`
- Soma dos Passageiros: `R$ 387,49` (Valor total < R$ 1.400,00)

## Comportamento Esperado
- Para despesas com valor total inferior ao limite regulamentar de R$ 1.400,00 (300 VRTE), a seção `4. Cotação` **não deve aparecer para o usuário**, devendo o fluxo permitir o envio direto da comprovação após a Seção 3.

## Comportamento Atual
- A seção `4. Cotação` é renderizada incondicionalmente na interface, exigindo ou disponibilizando a anexação de orçamentos mesmo quando o montante da despesa (`R$ 387,49`) dispensa legalmente o processo de cotação.
- Adicionalmente, o texto da Seção 4 apresenta inconsistência de cópia (*copywriting*), referenciando "Nota Fiscal" (*"Se há mais de um item na Nota Fiscal com valor acima de R$ 1.400..."*) em plena tela de Passagem.

## Evidências
- 📷 **Detalhe da transação demonstrando valor de R$ 387,49 (inferior a R$ 1.400,00):**
  ![Detalhe do Pagamento](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-008-valor-transacao-abaixo-teto.png)

- 📷 **Seção 4 (Cotação) exibida indevidamente para passagem com soma de R$ 387,49:**
  ![Seção de Cotação Exibida Indevidamente](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-008-secao-cotacao-exibida-indevidamente.png)

## Sugestão de Investigação
- No componente `ComprovarDebito.vue`, verificar a condicional reativa de renderização da seção de cotação (`v-if`). A exibição deve ser vinculada à expressão lógica `computed(() => valorTotalTransacao > LIMITE_COTACAO_VRTE)`.
- Parametrizar a mensagem informativa da cotação para refletir dinamicamente a natureza do documento (`Passagem`, `Nota Fiscal` ou `Invoice`), evitando menções equivocadas a "Nota Fiscal" no fluxo de bilhetes aéreos/rodoviários.
