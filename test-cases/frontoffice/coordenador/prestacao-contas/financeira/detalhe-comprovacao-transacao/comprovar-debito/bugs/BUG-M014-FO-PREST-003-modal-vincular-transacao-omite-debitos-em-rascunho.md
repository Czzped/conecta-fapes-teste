## Título
[Bug] Modal de vinculação de transações exibe apenas transações "Pendente", omitindo débitos que transicionaram automaticamente para "Em Rascunho" por mera navegação

## ID
BUG-M014-FO-PREST-003

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Vinculação de Transações de Débito da Mesma Compra** (Feature Issue [#2943](https://github.com/leds-conectafapes/conectafapes-project/issues/2943))
- Regra Canônica: M014: `RN02` / `RN04` / Invariante de Seleção de Débitos do Mesmo Projeto sem Submissão (Permitir ao Coordenador agregar transações bancárias fracionadas ou complementares de uma mesma compra para comprovação conjunta por nota fiscal)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #1 (Visibilidade do Status do Sistema)**: A lista da modal afirma que *"Só aparecem aqui os débitos deste projeto ainda sem prestação"*, porém omite débitos legítimos do projeto que não possuem prestação submetida apenas porque já foram abertos anteriormente.
  - **Heurística #5 (Prevenção de Erros)**: Induz o Coordenador ao erro ou à falsa impressão de que a transação desejada desapareceu do sistema, impedindo a conciliação financeira de compras fracionadas.
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Modal `Vincular transação`)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato financeiro do projeto em `/coordenador/financeira`.
2. Identificar duas ou mais transações bancárias de débito que façam parte da mesma compra (ex.: Débito A e Débito B), ambas inicialmente com status `Pendente`.
3. Clicar previamente no Débito B apenas para visualizar a tela de comprovação (sem preencher ou salvar nenhuma informação) e em seguida retornar ao extrato.
4. Constatar que a mera abertura da tela fez o Débito B transicionar seu status de `Pendente` para `Em Rascunho` (comportamento mapeado em `BUG-M014-FO-005`).
5. Abrir a tela de comprovação do Débito A e acionar a funcionalidade de vinculação abrindo a modal `Vincular transação`.
6. Pesquisar na lista de débitos disponíveis para vinculação.
7. Observar que o Débito B não é listado na modal, permanecendo inacessível para agrupamento.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Débito Principal A: Status `Em Rascunho`
- Débito Secundário B: Transação sem prestação enviada, mas com status alterado para `Em Rascunho` por abertura prévia da página

## Comportamento Esperado
- Conforme a especificação da funcionalidade (Issue [#2943](https://github.com/leds-conectafapes/conectafapes-project/issues/2943)) e a instrução orientativa da própria modal (*"Só aparecem aqui os débitos deste projeto ainda sem prestação"*), a lista de vinculação deve exibir **todas as transações de débito do projeto que não estejam vinculadas a outra prestação submetida/em análise**, independentemente de o status estar como `Pendente` ou `Em Rascunho` (desde que o rascunho não tenha sido submetido).

## Comportamento Atual
- A modal de vinculação filtra estritamente transações com status exatamente igual a `Pendente`.
- Qualquer transação de débito que o Coordenador tenha aberto anteriormente — transicionando seu status para `Em Rascunho` — deixa de ser listada na modal, impossibilitando que seja vinculada ao débito principal da compra.

## Evidências
- 📷 **Modal de vinculação de transações omitindo débitos que estão com status "Em Rascunho":**
  ![Modal Vincular Transação](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/evidencias-BUG-PREST-003-modal-vincular-transacao.png)

## Sugestão de Investigação
- Inspecionar a consulta/filtro no backend/frontend utilizada para popular a modal `Vincular transação` (endpoint de busca de débitos elegíveis para vínculo):
  - Atualmente a query/filtro está aplicando `WHERE status == 'PENDENTE'`.
  - Ajustar o filtro de elegibilidade para incluir transações não submetidas: `WHERE (status == 'PENDENTE' OR status == 'EM_RASCUNHO') AND prestacaoId IS NULL` (ou sem vínculo a outra prestação ativa/submetida), permitindo que débitos abertos anteriormente possam ser livremente agrupados pelo Coordenador.
