## Título
[Bug] Falha de persistência ao excluir ou substituir o comprovante de pagamento em prestação de contas de Passagem

## ID
BUG-M014-FO-PAS-010

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito de Passagem — **Seção 2 (Anexar Comprovantes da Passagem)**
- Regra Canônica: M014: `RN05` / `RI-PAS01` (Integridade do estado e persistência das alterações nos comprovantes de pagamento e realização de viagem)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: O sistema exibe um toast verde de confirmação (*"Justificativa de passagem atualizada com sucesso!"*), levando o usuário a acreditar que a exclusão ou substituição do comprovante foi salva, mas ao recarregar a tela o arquivo antigo reaparece.
  - **Heurística #3 (Controle e Liberdade do Usuário)**: O usuário não consegue remover ou alterar um comprovante de pagamento incorreto já anexado à passagem.
- Caso de Teste Relacionado: `CT-M014-FO-052` (Edição e substituição de anexos em prestação de passagem)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `2. Anexar Comprovantes da Passagem *`)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro em `/coordenador/financeira` com o perfil de Coordenador.
2. Abrir uma prestação de débito de **Passagem** que possua um comprovante de pagamento preexistente anexado (ex.: `dac144b6-b801-4598-b4e0-6a9e5eba2c32-orç.pdf`).
3. Na Seção `2. Anexar Comprovantes da Passagem *`, clicar no botão `Editar comprovantes` (ou passar o mouse sobre o anexo em *Comprovante de Pagamento*).
4. Clicar no ícone de exclusão (`X`) no anexo de comprovante de pagamento.
5. Observar que o anexo é removido visualmente do campo.
6. Clicar no botão azul `Confirmar edição`.
7. Observar a exibição do toast de sucesso no canto inferior direito (*"Justificativa de passagem atualizada com sucesso!"*).
8. Recarregar a página no navegador (`F5` / `Ctrl+R`).
9. Inspecionar a Seção `2. Anexar Comprovantes da Passagem *`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Anexo Preexistente: `dac144b6-b801-4598-b4e0-6a9e5eba2c32-orç.pdf` (207 KB)
- Ação Realizada: Exclusão / Substituição do Comprovante de Pagamento + Clique em `Confirmar edição`.

## Comportamento Esperado
- Ao remover/substituir o comprovante de pagamento e acionar `Confirmar edição`, a requisição enviada ao backend deve atualizar ou deletar o vínculo do arquivo no banco de dados.
- Ao recarregar a página, a alteração deve persistir (o comprovante excluído deve continuar ausente ou o novo comprovante substituído deve ser exibido).

## Comportamento Atual
- Embora o frontend exiba a notificação verde de sucesso (*"Justificativa de passagem atualizada com sucesso!"*), as alterações feitas no comprovante de pagamento não são salvas no backend.
- Ao atualizar a página (`F5`), o comprovante de pagamento original (`dac144b6...orç.pdf`) volta a ser exibido anexado à despesa como se nenhuma alteração tivesse sido feita (falso sucesso).

## Evidências
- 📷 **Comprovante de pagamento anexado com opção de exclusão (X):**
 
<img width="967" height="213" alt="Comprovante de pagamento anexado" src="https://github.com/user-attachments/assets/a760c6d5-1f9e-473d-9f44-67ddb7e3fbc1" />

- 📷 **Comprovante removido visualmente no modo de edição:**
 
<img width="973" height="221" alt="Comprovante removido da tela" src="https://github.com/user-attachments/assets/cd1e0a29-eb35-46eb-8002-aa59c2522a10" />

- 📷 **Confirmação da edição com toast de falso sucesso ("Justificativa de passagem atualizada com sucesso!"):**
 
<img width="986" height="286" alt="Toast de sucesso na edição de comprovantes" src="https://github.com/user-attachments/assets/e16aaec2-eeef-4ed8-ab28-bb3aefd408eb" />

- 📷 **Comprovante de pagamento original reaparecendo após recarregar a página (F5):**
 
<img width="975" height="236" alt="Comprovante original reaparece ao dar F5" src="https://github.com/user-attachments/assets/c516f406-8b2b-42fa-9a5c-1dd68f44fffa" />

## Sugestão de Investigação
- Inspecionar o handler de submissão do formulário de edição de comprovantes de passagem no frontend:
  - Verificar se o payload enviado na requisição `PUT`/`PATCH` de atualização da justificativa de passagem inclui a propriedade contendo o ID ou arquivo do comprovante de pagamento modificado/excluído (ex.: `comprovantePagamentoId`, `comprovantes`).
  - Verificar no backend se o serviço de atualização de passagem trata a remoção/substituição do arquivo ou se está ignorando o parâmetro e mantendo os registros antigos na tabela de anexos.
