## Título
[Bug] Ausência de botão de exclusão nos cards de anexo do Invoice e do comprovante de fatura na Seção 2

## ID
BUG-M014-FO-INV-001

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — Tipo de Documento: **Invoice (Pagamento Internacional)**
- Regra Canônica: M014: `RN02` / `RN05` (Gerenciamento e integridade dos comprovantes fiscais vinculados à justificativa de despesa)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #3 (Controle e Liberdade do Usuário)**: O usuário deve poder desfazer ações e remover arquivos anexados equivocadamente antes do envio definitivo.
  - **Heurística #4 (Consistência e Padrões)**: Os demais fluxos da plataforma (`Passagem` e `Nota Fiscal`) fornecem botão de exclusão de anexo (`X` ou lixeira).
- Casos de Teste Relacionados: `CT-M014-FO-073` (Anexar arquivo do Invoice) e `CT-M014-FO-074` (Ativar e anexar fatura do cartão)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Fluxo: Débito > Invoice / Seção `2. Anexar Arquivos do Invoice *`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o sistema com perfil de `coordenador` e abrir a comprovação de débito de uma transação pendente.
2. Na seção `1. Informações Gerais`, selecionar o tipo de documento `Invoice (Pagamento Internacional)`.
3. Na seção `2. Anexar Arquivos do Invoice *`, clicar em `Anexar arquivos` e selecionar um arquivo de Invoice (ex.: PDF).
4. Marcar o checkbox *"Deseja enviar o comprovante da fatura do cartão?"*.
5. Clicar em `Anexar fatura do cartão` e selecionar o arquivo de fatura correspondente.
6. Inspecionar os cards dos dois arquivos anexados renderizados logo abaixo de suas respectivas áreas de upload.
7. Tentar excluir/remover qualquer um dos anexos enviados (sem enviar outro arquivo por cima).
8. Observar que apenas o ícone de visualização (olho) é exibido no canto direito dos cards, sem qualquer botão ou ícone de exclusão (lixeira ou 'X').

## Dados de Entrada
- Tipo de Documento: `Invoice (Pagamento Internacional)`
- Arquivo Invoice anexado: `github-leds-conectafapes-receipt-2025-08-05 (1).pdf` (50 KB)
- Checkbox ativado: `Deseja enviar o comprovante da fatura do cartão?`
- Arquivo Fatura anexado: `github-leds-conectafapes-receipt-2025-08-05 (1).pdf` (50 KB)

## Comportamento Esperado
- Cada card de arquivo anexado deve conter, além do ícone de visualização, uma ação explícita de exclusão (ícone de lixeira ou botão de fechar 'X'), permitindo ao usuário desanexar o arquivo e retornar o campo ao estado inicial limpo (sem anexo), mantendo a consistência com os fluxos de Passagem e Nota Fiscal.

## Comportamento Atual
- Não existe botão ou ação de exclusão em nenhum dos cards de anexo da Seção 2 de Invoice.
- Embora o usuário consiga substituir o documento enviando outro arquivo por cima, ele fica totalmente impossibilitado de simplesmente excluir ou limpar um anexo enviado indevidamente (por exemplo, ao desmarcar a intenção de envio da fatura do cartão ou ao remover um arquivo sobressalente).

## Evidências
- 📷 **Cards de anexo do Invoice e da Fatura sem botão de exclusão (apenas ícone de olho):**
  ![Anexos de Invoice sem botão de exclusão](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/invoice/evidencias-BUG-INV-001-ausencia-botao-excluir-anexos.png)

## Sugestão de Investigação
- No componente de template que renderiza os pills/cards de arquivos da Seção 2 do Invoice, adicionar o botão de remoção (ícone de lixeira ou 'X') com o handler `@click` correspondente para limpar o estado do arquivo (`invoiceFile = null` e `creditCardInvoiceFile = null`), espelhando a implementação utilizada no componente de Passagem.
