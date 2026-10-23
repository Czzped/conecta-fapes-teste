## Título
[Bug] Ausência do rótulo "Em espera" e de card informativo da troca de nível em curso na listagem e detalhes do bolsista

## ID
BUG-M009-FO-NIV-002

## Requisito/Regra Violada
- Regra Canônica / Card oficial: [leds-conectafapes/conectafapes-project#2674](https://github.com/leds-conectafapes/conectafapes-project/issues/2674) (Sub-tarefa de #2550) e Heurística de Nielsen #1 (Visibilidade do Estado do Sistema).
- Caso de Teste Relacionado: [CT-M009-FO-010](../../CT-M009-FO-010-validar-exibicao-unificada-do-par-na-minha-equipe.md) (Issue https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/724).
- Rota/Componente: `/minha-equipe?tab=bolsistas` (Listagem e Detalhes) / `BolsistasTab.vue`, `BolsistaListItem.vue`, `DetalhesBolsista.vue`, `bolsaStatusBadge.ts`

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows / Navegador Web (Chrome/Edge) / Frontoffice Vue-Nuxt UI

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar `Minha Equipe > Bolsistas do Projeto`.
2. Localizar um bolsista com solicitação de alteração de nível em andamento (ex.: `Andre Sarmento Spalenza`).
3. Inspecionar o badge de status exibido na listagem para a alocação vigente.
4. Clicar na linha do bolsista para abrir a tela de Detalhes (`Minha Equipe › Bolsistas do Projeto › Detalhes`).
5. Inspecionar o indicador de Status da Bolsa e os blocos de informação apresentados na aba `Informações`.
6. Inspecionar a resposta do endpoint de busca na aba Rede (Network).

## Dados de Entrada
- Bolsista: `Andre Sarmento Spalenza`
- Vínculo/Alocação ID: `e6e07f7c-8e35-4c93-9a87-bfbebd7181cb`
- Solicitação de Troca em Curso: `9848c629-1b67-4e44-5dda-08df2af7ef45`
  - Tipo: `PROMOCAO`
  - Destino: `BPIG-III` (R$ 5.500,00, início em 01/11/2026)

## Comportamento Esperado
- Conforme a especificação técnica do card oficial **#2674** e Heurística de Nielsen #1:
  1. **Na Listagem de Bolsistas:** A alocação de origem com troca pendente deve exibir o rótulo de UI **"Em espera"** (com badge visual diferenciado, ex.: âmbar/warning), deixando explícito ao coordenador que a bolsa aguarda avaliação de troca pela FAPES.
  2. **Na Tela de Detalhes:** A tela deve refletir o status **"Em espera"** e renderizar um bloco/card integrado informando a troca em andamento (novo nível solicitado `BPIG-III`, valor `R$ 5.500,00`, data de início prevista `01/11/2026` e status da análise).

## Comportamento Atual
- A API retorna perfeitamente os dados estruturados no payload através de `trocaNivel.emCurso`.
- Porém, na interface do usuário:
  1. **Na Listagem:** A bolsa é exibida com o status padrão **"Em andamento"** (azul), sem qualquer indicação de que há um processo de troca em curso.
  2. **Nos Detalhes:** O Status da Bolsa também permanece com o badge **"Em andamento"** e **não há nenhum card ou seção informativa** exibindo os detalhes da troca em andamento. A única evidência visual é a presença do item *"Cancelar alteração de nível"* no menu dropdown de ações.

## Evidências
- 📷 Listagem exibindo status padrão "Em andamento" em vez de "Em espera":
![Listagem de Bolsistas](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/frontoffice/coordenador/minha-equipe/alterar-nivel-bolsa/bugs/evidencias-BUG-NIV-002-01-listagem-status-sem-rotulo-em-espera.png)

- 📷 Detalhes do Bolsista sem card informativo da troca solicitada:
![Detalhes do Bolsista](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/frontoffice/coordenador/minha-equipe/alterar-nivel-bolsa/bugs/evidencias-BUG-NIV-002-02-detalhes-sem-card-troca-em-curso.png)

- 📷 Aba Rede com o payload da API contendo `trocaNivel.emCurso`:
![Payload API](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/frontoffice/coordenador/minha-equipe/alterar-nivel-bolsa/bugs/evidencias-BUG-NIV-002-03-payload-api-troca-nivel-em-curso.png)

## Sugestão de Investigação
- Em `bolsaStatusBadge.ts` / `statusMapper`, adicionar verificação se `bolsa.trocaNivel?.emCurso` existe; em caso positivo, mapear o badge para o rótulo `"Em espera"` com cor `warning` (âmbar).
- Em `DetalhesBolsista.vue`, implementar um card/bloco de alerta visual que renderize os dados de `bolsa.trocaNivel.emCurso` (nível de destino, data de início e status da avaliação documental).
