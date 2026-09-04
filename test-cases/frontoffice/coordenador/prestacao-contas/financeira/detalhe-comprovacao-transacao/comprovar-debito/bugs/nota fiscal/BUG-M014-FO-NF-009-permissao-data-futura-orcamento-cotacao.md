# Título
[Bug] Formulário de cotação permite seleção e salvamento de data futura no orçamento do fornecedor

## ID
BUG-M014-FO-NF-009

## Requisito/Regra Violada
- Regra Canônica: M014: `RN07` / `RI-COT02` — Validação temporal de campos de cadastro de `OrcamentoFornecedor` (`DataOrcamento <= DataAtual`)
- Rota/Componente: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` — Seção `4. Cotação` (`ComprovarDebito.vue`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo

1. Acessar `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` com uma transação de débito pendente.
2. Ir até a seção `4. Cotação`.
3. Anexar um arquivo PDF de orçamento de fornecedor.
4. No campo `Data*` do formulário do orçamento, inserir uma data no futuro em relação à data atual (ex: `01/12/2030`).
5. Preencher os demais campos obrigatórios (`Fornecedor*` e `Valor*`).
6. Clicar no botão ciano `Confirmar` no card do orçamento.
7. Observar a aceitação da data pelo sistema.

## Dados de Entrada
- URL: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId`
- Data inserida: `01/12/2030` (Data futura)
- Fornecedor: `Fornecedor Teste`
- Valor: `R$ 1.500,00`

## Comportamento Esperado
- O campo `Data*` do orçamento não deve permitir a seleção ou digitação de datas futuras (`DataOrcamento <= DataAtual`).
- Caso o usuário digite uma data no futuro, o formulário deve exibir uma mensagem de validação (ex: *"A data da cotação não pode ser superior à data atual."*) e bloquear a confirmação do orçamento até que uma data válida seja informada.

## Comportamento Atual
- O sistema aceita a data futura (ex: `01/12/2030`) sem aplicar qualquer restrição ou validação temporal no datepicker/input.
- Ao clicar em `Confirmar`, o orçamento com data futura é salvo com sucesso e aceito pelo formulário da prestação.

## Evidências
- 🧾 **Validação Temporal:** Permitir datas futuras invalida a confiabilidade documental da cotação comercial perante a auditoria da FAPES e contraria a ordem cronológica da despesa.

## Sugestão de Investigação
- Adicionar regra de validação no datepicker/schema do formulário de orçamento no frontend (ex: `max-date="today"` ou validação VeeValidate/Yup `max(new Date())`).
- Garantir a mesma validação no backend/DTO de inserção de `OrcamentoFornecedor` para rejeitar datas no futuro.