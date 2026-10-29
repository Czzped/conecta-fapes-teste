## Título
[Bug] Botão "Implementar Bolsa" habilitado indevidamente para alocação com status "Documentação Pendente" causa erro 400 da API e modal alerta falso positivo de acúmulo da bolsa de origem

## ID
BUG-M009-BO-NIV-003 (Issue https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/748)

## Requisito/Regra Violada
- Regra Canônica: `M009: RN07` (Implementação de bolsa), `M009: RN04` (Avaliação documental), Heurística de Nielsen #5 (Prevenção de Erros) e Heurística #9 (Auxiliar os usuários a reconhecer, diagnosticar e recuperar-se de erros).
- Caso de Teste Relacionado: [CT-M009-BO-001](../CT-M009-BO-001-implementar-novo-nivel-com-swap-atomico.md) (Issue https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/725).
- Rota/Componente: `/gestao-bolsa/documentos-bolsista/{idAlocacao}` (`DocumentosBolsista.vue`, `useDocumentosBolsistaViewModel.ts`, `useOutrasAlocacoesAtivas.ts`, `useAvaliacaoSolicitacao.ts` / Backoffice Admin UI).
- Endpoint da API: `POST /api/importacaoedital/alocacaobolsista/ativar`

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows / Navegador Web (Chrome/Edge) / Backoffice Vue/Nuxt Admin UI

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar `/gestao-bolsa/visualizar-pendencias`.
2. Localizar e abrir a pendência de alteração de nível do bolsista André Sarmento Spalenza (alocação nova com status de domínio `DOCUMENTACAO_PENDENTE`, aguardando envio de documentos e termo pelo bolsista no portal).
3. Na tela de `Documentos do Bolsista`, inspecionar os requisitos declaratórios ("Requisitos sem Documentos") e marcar os checkboxes "Cumpre requisito?".
4. Observar que o botão primário `Implementar Bolsa` no rodapé da página torna-se habilitado (verde).
5. Clicar em `Implementar Bolsa`.
6. Observar a abertura do modal de confirmação `Bolsista com outras alocações ativas`.
7. No modal, verificar a lista de alocações ativas apresentadas: o sistema exibe a própria bolsa de origem do bolsista no mesmo projeto (`Linkes (Connect), BPIG-II`).
8. Clicar em `Continuar implementação`.
9. Observar a resposta da requisição na aba Rede e o feedback exibido em tela.

## Dados de Entrada
- Bolsista: `Andre Sarmento Spalenza`
- Projeto: `Linkes (Connect)` - Edital `DI 011/2023 - LINKES`
- Alocação Alvo (Nova): `BPIG-II` (R$ 7.500,00) com status `DOCUMENTACAO_PENDENTE`
- Alocação Origem: `BPIG-II` (R$ 4.500,00) com status `ATIVA (Em espera)`

## Comportamento Esperado
1. **Prevenção de Erros (Status da Bolsa):** O frontend não deve permitir a ação de implementação enquanto o bolsista não tiver enviado a documentação/termo e a alocação não estiver no status `EM_AVALIACAO`. O botão `Implementar Bolsa` deve permanecer desabilitado com tooltip informativo: *"Aguardando envio de documentos e termo pelo bolsista no portal"*.
2. **Tratamento de Alocações Ativas (Falso Positivo):** O modal de checagem de acúmulo de bolsas deve desconsiderar a bolsa de origem do par de troca de nível (`SolicitacaoAlteracaoNivel.AlocacaoOrigemId`), pois a coexistência temporária durante o processo é esperada e será resolvida no swap atômico.
3. **Feedback de Erro Adequado:** Caso ocorra erro de negócio na API, o frontend deve exibir a mensagem amigável retornada pelo backend (`"A bolsa deve estar em avaliação ou suspensa antes que seja ativada"`) em vez de um toast genérico *"Erro ao aprovar solicitação"*.

## Comportamento Atual
1. O botão `Implementar Bolsa` fica habilitado apenas porque os checkboxes da tela foram marcados, ignorando o ciclo de vida da bolsa (`DOCUMENTACAO_PENDENTE`).
2. O modal de acúmulo exibe um alerta falso-positivo acusando a própria bolsa de origem como impeditivo de acúmulo.
3. Ao clicar em `Continuar implementação`, a API recusa com `HTTP 400 Bad Request` com o erro:
   `"A bolsa deve estar em avaliação ou suspensa antes que seja ativada"`.
4. O frontend exibe apenas o toast genérico vermelho `"Erro ao aprovar solicitação"`.

## Evidências

- 📷 Modal de confirmação acusando falso positivo de acúmulo da bolsa de origem do mesmo projeto:
![Modal de Acúmulo Falso Positivo](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/backoffice/admin/bolsistas/alterar-nivel-bolsa/evidencias/evidencia-BUG-BO-NIV-003-01-modal-acumulo-falso-positivo-origem.png)

- 📷 Tela de Documentos com toast vermelho genérico "Erro ao aprovar solicitação":
![Toast Erro ao Aprovar](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/backoffice/admin/bolsistas/alterar-nivel-bolsa/evidencias/evidencia-BUG-BO-NIV-003-02-tela-documentos-toast-erro-aprovar-solicitacao.png)

- 📷 Console do DevTools evidenciando o erro 400 na chamada `POST /api/importacaoedital/alocacaobolsista/ativar`:
![Console Erro 400](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/backoffice/admin/bolsistas/alterar-nivel-bolsa/evidencias/evidencia-BUG-BO-NIV-003-03-console-erro-post-ativar-400-bad-request.png)

- 📷 Payload da resposta da API com a regra de negócio violada (`"A bolsa deve estar em avaliação ou suspensa antes que seja ativada"`):
![Payload Resposta API](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/backoffice/admin/bolsistas/alterar-nivel-bolsa/evidencias/evidencia-BUG-BO-NIV-003-04-resposta-api-mensagem-bolsa-deve-estar-em-avaliacao.png)

- 📷 Resposta da requisição GET /curriculo retornando 404:
![Resposta GET Curriculo 404](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/skill-test/test-cases/backoffice/admin/bolsistas/alterar-nivel-bolsa/evidencias/evidencia-BUG-BO-NIV-003-05-resposta-api-curriculo-404-not-found.png)

## Sugestão de Investigação e Correção
1. Em `useDocumentosBolsistaViewModel.ts`:
   - Atualizar a propriedade computada `podeImplementarBolsa` para incluir a validação:
     ```ts
     const podeImplementarBolsa = computed(() => {
       if (documentos.value?.statusDeAvaliacao !== 'EM_AVALIACAO') return false
       // ... demais regras de documentos ...
     })
     ```
2. Em `useOutrasAlocacoesAtivas.ts`:
   - Ao filtrar as alocações ativas do bolsista, ignorar alocações cujo ID coincida com `trocaNivel.origem.id` (`SolicitacaoAlteracaoNivel.AlocacaoOrigemId`).
3. Em `useAvaliacaoSolicitacao.ts`:
   - Extrair a mensagem de erro específica do backend (`error.response?.data?.[0]?.mensagem`) para exibir no toast de alerta do usuário.
