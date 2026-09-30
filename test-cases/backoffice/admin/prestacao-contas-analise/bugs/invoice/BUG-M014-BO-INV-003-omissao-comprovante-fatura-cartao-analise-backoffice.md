## Título
[Bug] Omissão do arquivo de Comprovante da Fatura do Cartão na visão de análise de Invoice no Backoffice

## ID
BUG-M014-BO-INV-003

## Requisito/Regra Violada
- Fluxo/Contexto: Análise de Prestação de Contas (Backoffice) — **Seção 2 (Invoice / Anexos do Pagamento Internacional)**
- Regra Canônica: M014: `RN08` / `RI-INV01` (Exibição e conferência completa de todos os documentos fiscais enviados pelo Coordenador na prestação de Invoice, incluindo a fatura do cartão de crédito quando marcada a opção)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: O Coordenador anexa a fatura do cartão de crédito no Frontoffice ao marcar a opção *"Deseja enviar o comprovante da fatura do cartão?"*, porém a interface de análise do Backoffice omite este documento, exibindo apenas o arquivo principal do Invoice na Seção 2 (`Invoice (Pagamento Internacional)`).
  - **Heurística #5 (Prevenção de Erros)**: O Analista da FAPES é induzido a reprovar indevidamente a prestação por suposta falta de comprovante de fatura/pagamento, pois a tela do Backoffice não disponibiliza visualização ou download do arquivo secundário de fatura.
- Caso de Teste Relacionado: `CT-M014-BO-017` / `CT-M014-FO-074` (Conferência de múltiplos anexos de Invoice e Fatura do Cartão no Backoffice)
- Rota/Componente: `/admin/prestacao-contas/analise/:prestacaoId` (`AnalisePrestacaoContas.vue` / Seção `2. Invoice (Pagamento Internacional)`)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Backoffice Vue-Nuxt UI em `https://admin.conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. No Frontoffice (`/coordenador`), criar/editar uma comprovação de débito sob a modalidade **Invoice (Pagamento Internacional)**.
2. Na Seção `2. Anexar Arquivos do Invoice`, anexar o documento principal do Invoice e marcar a checkbox *"Deseja enviar o comprovante da fatura do cartão?"*.
3. Anexar o arquivo de comprovante da fatura do cartão de crédito no campo secundário e enviar a prestação para análise.
4. No Backoffice (`/admin`), abrir a mesma prestação de contas com o perfil de Analista FAPES.
5. Inspecionar a **Seção 2 (Invoice - Pagamento Internacional)**.
6. Verificar se o arquivo de comprovante da fatura do cartão é exibido para visualização/download.

## Dados de Entrada
- Rota Frontoffice: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Rota Backoffice: `/admin/prestacao-contas/analise/:prestacaoId`
- Opção Ativada no Frontoffice: Checkbox `Deseja enviar o comprovante da fatura do cartão?` (com arquivo anexado)

## Comportamento Esperado
- A Seção 2 no Backoffice deve listar todos os anexos vinculados ao Invoice: tanto o documento fiscal principal quanto o **Comprovante da Fatura do Cartão** de crédito quando enviado.
- O Analista FAPES deve ter acesso a botões de visualização/download para ambos os documentos para validar a compra internacional.

## Comportamento Atual
- A Seção 2 no Backoffice exibe apenas o arquivo principal do Invoice (`urlArquivo`), omitindo completamente o arquivo de Comprovante da Fatura do Cartão enviado pelo Coordenador.
- Não há campo, bloco ou botão na tela de análise que permita ao funcionário da FAPES visualizar ou baixar o comprovante da fatura.

## Evidências
- 📷 **Frontoffice com a opção "Deseja enviar o comprovante da fatura do cartão?" ativada e campo de upload exibido:**
 
<img width="973" height="389" alt="Opção fatura do cartão no Frontoffice" src="https://github.com/user-attachments/assets/ae0bf298-b789-4fa2-93ae-c98f5a11dfa4" />

- 📷 **Seção 2 no Backoffice exibindo apenas 1 anexo e omitindo a fatura do cartão:**
 
<img width="975" height="389" alt="Seção 2 no Backoffice omitindo a fatura do cartão" src="https://github.com/user-attachments/assets/b8aa612f-98bf-4c7b-9fe0-043fb987d65b" />

## Sugestão de Investigação
- Inspecionar o componente de detalhe de prestação de Invoice no Backoffice (`DetalheInvoiceBackoffice.vue` / `AnalisePrestacaoContas.vue`):
  - Verificar a renderização da lista de anexos da justificativa de Invoice (`justificativaInvoice.anexos` ou `faturaCartaoId` / `urlFaturaCartao`).
  - Garantir que o array de documentos renderizado no template itere sobre todos os anexos vinculados à justificativa ou inclua um bloco dedicado para "Comprovante da Fatura do Cartão" quando o parâmetro estiver preenchido.
