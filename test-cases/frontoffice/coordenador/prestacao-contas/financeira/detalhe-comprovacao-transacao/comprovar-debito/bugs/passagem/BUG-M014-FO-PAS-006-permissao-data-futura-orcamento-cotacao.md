## Título
[Bug] Formulário de cotação permite seleção e salvamento de datas futuras nos orçamentos de fornecedor na Seção 4

## ID
BUG-M014-FO-PAS-006

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — Tipo de Documento: **Passagem**
- Regra Canônica: M014: `RN05` / `RI-COT02` (Validação temporal de campos de cadastro de `OrcamentoFornecedor`: a data do orçamento não pode ser posterior à data atual — `DataOrcamento <= DataAtual`) / Invariante Global de Integridade Cronológica
- Caso de Teste Relacionado: `CT-M014-FO-068` (Validar restrição de data futura ou inválida)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `4. Cotação` / Card de Orçamento do Fornecedor)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o sistema com perfil de `coordenador` e abrir a comprovação de débito de passagem pendente.
2. Navegar até a seção `4. Cotação`.
3. Anexar um arquivo PDF de orçamento de fornecedor.
4. No campo `Data*` do card da cotação, inserir ou selecionar uma data futura em relação ao dia de hoje.
5. Preencher os demais campos obrigatórios (`Fornecedor*` e `Valor*`).
6. Clicar no botão ciano `Confirmar` dentro do card do orçamento.
7. Observar que a data futura é aceita sem advertência ou bloqueio, exibindo o toast verde *"Sucesso ao salvar a cotação"*.

## Dados de Entrada
- Seção: `4. Cotação`
- Anexo: `Notebook Samsung Galaxy Book 2 Pro... - Magazine Luiza.pdf`
- Fornecedor: `Fast Shop`
- Valor: `R$ 8.744,00`
- Data da Cotação: Data posterior à data corrente (sem restrição temporal)

## Comportamento Esperado
- O campo `Data*` não deve permitir a seleção nem a inserção manual de datas futuras (`Data <= DataAtual`).
- Caso o usuário tente salvar uma data futura, o formulário deve exibir mensagem de validação (ex.: *"A data da cotação não pode ser posterior à data atual."*) e bloquear a confirmação do card.

## Comportamento Atual
- O datepicker não possui atributo delimitador `max` e o schema de validação do formulário não valida a data contra o dia atual. O sistema aceita a data futura e exibe a notificação de confirmação *"Sucesso ao salvar a cotação"*, permitindo o registro de comprovantes inconsistentes para auditoria.

## Evidências
- 📷 **Card de cotação permitindo salvamento com data futura sem bloqueio:**
  ![Data de cotação sem restrição futura](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-006-data-cotacao-sem-restricao-futura.png)

## Sugestão de Investigação (Opcional)
- Configurar no componente de calendário do formulário a propriedade de data máxima vinculada ao dia atual (`:max="new Date().toISOString().split('T')[0]"`).
- Adicionar validação no schema (ex.: Zod / Yup / VeeValidate) impedindo a submissão quando `new Date(dataCotacao) > new Date()`.
