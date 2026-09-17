## Título
[Dúvida/Sugestão] Disponibilização da funcionalidade de Contestação de Recusa para transações de débito rejeitadas

## ID
BUG-M014-FO-PREST-002

## Requisito/Regra Violada
- Fluxo/Contexto: Prestação de Contas Financeira — **Contestação de Parecer de Recusa (Transação Rejeitada/Recusada)**
- Regra Canônica: M014: `EPIC-M014-003 — US-M014-008 (Contestar Recusa)` / Especificação do Protótipo de UX — Garantia do direito de contestação do Coordenador em até 15 dias corridos após emissão do parecer desfavorável pela FAPES
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #3 (Controle e Liberdade do Usuário)**: Permitir que o Coordenador responda formalmente a um parecer de recusa com justificativa e novos anexos.
  - **Heurística #4 (Consistência e Padrões)**: Alinhamento da interface com os protótipos de UX da jornada de contestação de comprovação.
- Caso de Teste Relacionado: `CT-M014-FO-048` / `CT-M014-FO-085`
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção de Contestação de Recusa)

## Ambiente
[ ] Produção  [x] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Contexto e Passo a Passo
1. Acessar o extrato financeiro do projeto em `/coordenador/financeira`.
2. Filtrar ou localizar uma transação de débito com status `Rejeitada` / `Recusada` (parecer desfavorável emitido pela FAPES).
3. Abrir os detalhes da comprovação da transação em `/coordenador/prestacao-financeira/detalhes/:paymentId`.
4. Rolar a página até o rodapé para verificar as opções de resposta/contestação disponibilizadas para o Coordenador.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Status do Pagamento: `Rejeitada` / `Recusada`

## Dúvida / Alinhamento de Produto
- No protótipo de UX da prestação de contas (e no escopo da `US-M014-008`), está prevista a seção de **Contestação da Recusa**, onde o Coordenador pode visualizar o motivo da rejeição, incluir um texto de contestação/justificativa e anexar comprovantes complementares antes de reenviar para reanálise da FAPES.
- Na aplicação em homologação/produção, ao abrir uma transação com status `Rejeitada`, a interface exibe apenas o banner de parecer desfavorável (*"Sua comprovação foi analisada e rejeitada pela FAPES."*), mas **não renderiza os campos ou formulário para submissão da contestação**.
- **Pergunta / Verificação:** Gostaria de confirmar se a funcionalidade de Contestação de Recusa (`EPIC-M014-003`) está planejada para ser entregue nas próximas sprints ou se faz parte de uma etapa pós-MVP de evolução do módulo?

## Comportamento Atual Observado
- Ao acessar uma transação rejeitada, os formulários anteriores aparecem bloqueados em modo leitura (`disabled`), porém não há nenhum campo, botão ou seção de formulário que permita ao Coordenador registrar a contestação e enviar os documentos complementares.

## Evidências
- 📷 **Tela da transação rejeitada no ambiente atual (exibindo apenas mensagem de recusa sem opção de contestação):**
  ![Transação Rejeitada Atual](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/evidencias-BUG-PREST-002-transacao-rejeitada-sem-secao-contestacao.png)

## Sugestão de Implementação (Caso Confirmado)
- Caso a funcionalidade faça parte da sprint atual:
  1. Habilitar a seção condicional `v-if="status === 'REJEITADA' || status === 'RECUSADA'"` no componente `ComprovarDebito.vue`.
  2. Incluir a área de texto para a justificativa da contestação e o campo de upload para arquivos comprovatórios complementares.
  3. Adicionar a ação de submissão da contestação transicionando o status da prestação para `EM_CONTESTACAO` / `EM_ANALISE`.
