## Título
[Bug] Erro HTTP 403 (Forbidden) e disparos de toasts de erro ao tentar remover Nota Fiscal vinculada na comprovação de débito

## ID
BUG-M014-FO-NF-016

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Seção 2 (Adicionar Descrição e Anexar Nota Fiscal)**
- Regra Canônica: M014: `RN05` / `RI-NFE01` (Integridade da edição e remoção do `DocumentoFiscal` vinculado à prestação em rascunho pelo Coordenador)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #3 (Controle e Liberdade do Usuário)**: O Coordenador aciona o botão de exclusão de uma nota fiscal vinculada à despesa, mas é impedido pelo sistema com erros de permissão.
  - **Heurística #9 (Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros)**: Disparo simultâneo de múltiplos toasts de erro (*"Não foi possível concluir esta requisição"* e *"Erro ao remover a nota fiscal - Request failed with status code 403"*) que expõem códigos técnicos HTTP sem opção amigável de recuperação.
- Caso de Teste Relacionado: `CT-M014-FO-039` / `CT-M014-FO-107` (Validação de exclusão de anexo de nota fiscal)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `2. Adicionar Descrição e Anexar Nota Fiscal *`)
- Endpoint afetado: `DELETE /api/prestacao-de-contas/documento-fiscal/:id` (ou endpoint correspondente de remoção do documento fiscal)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro em `/coordenador/financeira` com o perfil de Coordenador.
2. Abrir uma prestação de débito em rascunho que possua uma ou mais Notas Fiscais anexadas (ex.: 2 notas fiscais na mesma despesa: Fast Shop S.A. e Amazon Serviços de Varejo).
3. Na Seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, clicar no botão de edição ou passar o mouse sobre a nota fiscal que deseja remover.
4. Clicar no ícone de lixeira (`Remover nota fiscal`) no card da nota fiscal selecionada (ex.: Amazon Serviços de Varejo).
5. Na modal de confirmação (*"Remover esta nota fiscal? - Categorias contábeis serão descartadas"*), clicar no botão vermelho `Remover nota`.
6. Observar os toasts de erro disparados no canto inferior direito e as falhas registradas no DevTools (`F12` - abas Console e Rede).

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Nota Fiscal Selecionada para Remoção: `AMAZON SERVICOS DE VAREJO DO BRASIL LTDA` (Chave: `35240715...68318525`, Valor: `R$ 2.328,99`)
- Endpoint da requisição: `DELETE https://conectafapes.hom.es.gov.br/api/prestacao-de-contas/documento-fiscal/ff029c3b-1421-4423-ab7f-3403c276866b`
- Resposta HTTP retornada: `403 Forbidden` (`{"status": 403, "message": "Access Denied", "details": "Your account does not have the required permissions to access this endpoint"}`)

## Comportamento Esperado
- Como a prestação está em rascunho (`RASCUNHO`), o Coordenador responsável deve possuir permissão para remover qualquer Nota Fiscal anexada à despesa.
- Ao confirmar na modal de remoção, o backend deve processar o `DELETE` do documento fiscal com sucesso (HTTP 200/204), remover a nota fiscal e atualizar os totais e categorias da tela.

## Comportamento Atual
- A requisição `DELETE` de remoção do documento fiscal é rejeitada pelo backend com HTTP `403 Forbidden` (mensagem: *"Access Denied - Your account does not have the required permissions to access this endpoint"*).
- O frontend dispara dois toasts simultâneos de erro no canto inferior direito:
  1. *"Não foi possível concluir esta requisição. Os dados não foram salvos. Por favor, entre em contato com a FAPES."*
  2. *"Erro ao remover a nota fiscal - Request failed with status code 403"*
- O console registra `Failed to load resource: the server responded with a status of 403 (Forbidden)` e a nota fiscal permanece vinculada à prestação sem ser removida.

## Evidências
- 📷 **Ação de clicar no ícone de lixeira ("Remover nota fiscal") na lista da despesa:**
  ![Clique Lixeira Remover Nota](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-016-icone-lixeira-remover-nota-fiscal.png)

- 📷 **Modal de confirmação "Remover esta nota fiscal?":**
  ![Modal Confirmação Remover Nota](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-016-modal-confirmacao-remover-nota-fiscal.png)

- 📷 **Toasts simultâneos de erro (incluindo "Erro ao remover a nota fiscal - Request failed with status code 403"):**
  ![Toasts de Erro 403](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-016-toasts-erro-403-remover-nota-fiscal.png)

- 📷 **Console do navegador registrando erro 403 Forbidden no recurso:**
  ![Console Erro 403 Forbidden](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-016-console-erro-403-forbidden.png)

- 📷 **Aba Rede (Network) confirmando a resposta HTTP 403 Access Denied:**
  ![Network Response 403 Access Denied](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/nota%20fiscal/evidencias-BUG-NF-016-network-response-403-access-denied.png)

## Sugestão de Investigação
- Inspecionar a política de autorização (`Authorization Policy` / `Role Claims`) no controller do backend responsável pela remoção de `DocumentoFiscal`:
  - O endpoint `DELETE /api/prestacao-de-contas/documento-fiscal/{id}` (ou rota equivalente) está retornando `403 Forbidden` informando que o perfil do usuário não possui permissão para acessar o endpoint.
  - Verificar se faltou atribuir a permissão/claim de exclusão de documento fiscal para a role `Coordenador` ou se a validação de posse da prestação em rascunho no middleware de segurança está rejeitando indevidamente requisições do proprietário do projeto.
