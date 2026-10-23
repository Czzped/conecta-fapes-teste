## Título
[Bug] Ações de cancelamento e extensão permanecem habilitadas na bolsa de origem com troca de nível pendente, resultando em HTTP 400

## ID
BUG-M009-FO-NIV-001

## Requisito/Regra Violada
- Regra Canônica: `M009: FR-013` (Congelamento da bolsa de origem enquanto a troca pende) e Heurística de Nielsen #5 (Prevenção de Erros).
- Caso de Teste Relacionado: [CT-M009-FO-005](../../CT-M009-FO-005-validar-congelamento-acoes-bolsa-origem-troca-pendente.md) (Issue https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/719).
- Rota/Componente: `/minha-equipe?tab=bolsistas` (Detalhes) / `BolsistaListItem.vue`, `BolsistaDocumentos.vue`
- Endpoint da API: `POST /api/portalfapes/cancela-bolsa/bolsas/{id}/cancelamento`

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows / Navegador Web (Chrome/Edge) / Frontoffice Vue-Nuxt UI

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar `Minha Equipe > Bolsistas do Projeto`.
2. Localizar um bolsista com status "Em andamento" e solicitar a "Alteração de Nível da Bolsa".
3. Com a solicitação de troca de nível pendente de homologação pela FAPES, acessar a tela de Detalhes ou abrir o menu "Ações" da bolsa de origem do bolsista.
4. Observar que as opções `Cancelar Bolsa` e `Estender Bolsa` continuam ativas e clicáveis no menu de ações.
5. Clicar em `Cancelar Bolsa`, preencher os campos obrigatórios (Justificativa e Último dia de atividades) e confirmar o cancelamento.
6. Observar a requisição disparada e o feedback retornado pela aplicação.

## Dados de Entrada
- Bolsista: `Andre Sarmento Spalenza`
- ID da Alocação / Bolsa: `e6e07f7c-8e35-4c93-9a87-bfbebd7181cb`
- Ação disparada: Cancelamento de bolsa
- Justificativa do cancelamento: `teste`
- Último dia de atividades: `24/10/2026`

## Comportamento Esperado
- Conforme a regra canônica `M009: FR-013` e Heurística de Nielsen #5 (Prevenção de Erros), enquanto a bolsa de origem possuir uma troca de nível pendente, os botões `Cancelar Bolsa` e `Estender Bolsa` devem ser exibidos **desabilitados (disabled)**.
- Ao posicionar o cursor (hover) sobre a ação desabilitada, um tooltip informativo deve indicar expressamente: *"Esta bolsa possui uma troca de nível em andamento. Cancele a troca para realizar esta operação."*, prevenindo que o coordenador preencha todo o formulário de cancelamento em vão.

## Comportamento Atual
- As opções `Cancelar Bolsa` e `Estender Bolsa` permanecem habilitadas e clicáveis normalmente.
- O usuário consegue abrir o modal de cancelamento, preencher todos os dados e confirmar a submissão.
- A API rejeita a requisição com erro `HTTP 400 Bad Request`:
```json
{
  "value": null,
  "errors": [
    "Esta bolsa possui uma troca de nível em andamento. Cancele a troca para realizar esta operação."
  ]
}
```
- A interface exibe um toast de erro genérico de falha no canto da tela após a submissão frustrada.

## Evidências

### Cenário A: Tentativa de Cancelamento de Bolsa
- 📷 Formulário de cancelamento preenchido:
![Modal Cancelar Bolsa](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/frontoffice/coordenador/minha-equipe/alterar-nivel-bolsa/bugs/evidencias-BUG-NIV-001-01-modal-cancelar-preenchido.png)

- 📷 Toast de erro retornado pela interface:
![Toast de Erro](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/frontoffice/coordenador/minha-equipe/alterar-nivel-bolsa/bugs/evidencias-BUG-NIV-001-02-toast-erro-troca-andamento.png)

- 📷 Console com falha HTTP 400 Bad Request:
![Console 400 Bad Request](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/frontoffice/coordenador/minha-equipe/alterar-nivel-bolsa/bugs/evidencias-BUG-NIV-001-03-console-erro-400-cancelamento.png)

- 📷 Payload de erro do backend no Network:
![Network Payload Backend](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/frontoffice/coordenador/minha-equipe/alterar-nivel-bolsa/bugs/evidencias-BUG-NIV-001-04-network-payload-erro-backend.png)

- 🧾 Logs / Retorno da API:
`POST https://conectafapes.hom.es.gov.br/api/portalfapes/cancela-bolsa/bolsas/e6e07f7c-8e35-4c93-9a87-bfbebd7181cb/cancelamento -> 400 Bad Request`
`{"value": null, "errors": ["Esta bolsa possui uma troca de nível em andamento. Cancele a troca para realizar esta operação."]}`

### Cenário B: Tentativa de Extensão de Bolsa (Aditivo)
- 📷 Tela de Aditivo preenchida com nova data de término:
![Tela Aditivo](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/frontoffice/coordenador/minha-equipe/alterar-nivel-bolsa/bugs/evidencias-BUG-NIV-001-05-tela-aditivo-preenchida.png)

- 📷 Modal de confirmação da extensão de bolsa:
![Confirmar Extensão](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/frontoffice/coordenador/minha-equipe/alterar-nivel-bolsa/bugs/evidencias-BUG-NIV-001-06-modal-confirmar-extensao.png)

- 📷 Toast de erro retornado pela interface:
![Toast Erro Extensão](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/frontoffice/coordenador/minha-equipe/alterar-nivel-bolsa/bugs/evidencias-BUG-NIV-001-07-toast-erro-estender-troca-andamento.png)

- 📷 Console com falha HTTP 400 Bad Request em alocacao-bolsista/estender:
![Console 400 Estender](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/frontoffice/coordenador/minha-equipe/alterar-nivel-bolsa/bugs/evidencias-BUG-NIV-001-08-console-erro-400-estender.png)

- 📷 Payload de erro do backend no Network:
![Network Payload Estender](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/frontoffice/coordenador/minha-equipe/alterar-nivel-bolsa/bugs/evidencias-BUG-NIV-001-09-network-payload-estender-backend.png)

- 🧾 Logs / Retorno da API:
`POST https://conectafapes.hom.es.gov.br/api/portalfapes/alocacao-bolsista/estender -> 400 Bad Request`
`{"value": null, "errors": ["Esta bolsa possui uma troca de nível em andamento. Cancele a troca para realizar esta operação."]}`


## Sugestão de Investigação
- Nos componentes responsáveis pela renderização do menu de ações (`BolsistaListItem.vue` e `BolsistaDocumentos.vue`), verificar se a alocação possui uma troca pendente vinculada (`bolsa.possuiTrocaPendente` ou equivalente).
- Caso positivo, definir `disabled: true` nas ações de `Cancelar Bolsa` e `Estender Bolsa`, vinculando o respectivo `<UTooltip>` com a mensagem da regra `FR-013` para prevenir o disparo da chamada inválida.
