## Título
[Bug] Toast indevido "Não foi possível salvar a passagem" e erro 422 ao associar estorno de crédito a débito de prestação bloqueada

## ID
BUG-M014-FO-CRED-008

## Requisito/Regra Violada
- Fluxo/Contexto: Prestação de Contas > Financeira > **Classificar Crédito**
- Regras Canônicas:
  - M014: `RN11` (Classificação de Crédito — Todo lançamento de crédito deve ser classificado em Estorno, Rendimento, Devolução ou Aporte)
  - M014: `RN13` / `RI-EST02` (Associação e pareamento obrigatório de crédito de estorno com débito original elegível)
  - M014: `RN08` (Invariantes de status da prestação e restrição de edição/mutabilidade para prestações bloqueadas ou em devolução)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #4 (Consistência e Padrões)**: O título do toast exibe `"Não foi possível salvar a passagem. Tente novamente."` dentro da funcionalidade de Classificação de Crédito (Estorno), evidenciando reaproveitamento/cópia indevida de tratamento de erro do fluxo de Passagem.
  - **Heurística #5 (Prevenção de Erros)**: A lista suspensa `Associe esse Crédito (entrada) a um Débito (saída)` exibe e permite selecionar débitos pertencentes a prestações bloqueadas (`ESTORNO_DEBITO_EM_PRESTACAO_BLOQUEADA`), induzindo o usuário a um erro 422 inevitável.
  - **Heurística #9 (Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros)**: A mensagem com contexto de passagem desorienta o usuário e dificulta o diagnóstico correto do problema.
- Casos de Teste Relacionados: `CT-M014-FO-031` (Associar crédito a débito no fluxo de estorno) e `CT-M014-FO-036` (Enviar classificação de crédito)
- Rota/Componente: `/coordenador/prestacao-financeira/classificar-credito/:id` (`ClassificarCredito.vue`)
- Endpoint API: `PUT https://conectafapes.hom.es.gov.br/api/prestacao-de-contas/projeto/{projetoId}/transacao-financeira/{transacaoId}/classificar`

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Google Chrome / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Autenticar no portal com o perfil `coordenador`.
2. Acessar o menu `Prestação de Contas > Financeira` e localizar um lançamento de Crédito com status `Pendente`.
3. Clicar no lançamento para abrir a tela `Classificar Crédito` (`/coordenador/prestacao-financeira/classificar-credito/:id`).
4. Na seção **1 Informações Gerais**, selecionar a opção `Estorno` no campo `Classificação`.
5. No campo `Associe esse Crédito (entrada) a um Débito (saída).`, abrir a lista suspensa e selecionar um débito cujo processo de prestação de contas já esteja bloqueado para edição / em devolução (ex: `Par 4 - debito de 4.200,00 - R$ 4.200,00 - 02/09/2026 17:22`).
6. Clicar no botão `Enviar` no canto inferior direito.
7. Na modal de confirmação *"Tem certeza que deseja enviar as informações?"*, confirmar clicando em `Enviar`.
8. Observar o toast de erro exibido no canto inferior direito e inspecionar a aba Network do DevTools.

## Dados de Entrada
- Rota acessada: `/coordenador/prestacao-financeira/classificar-credito/1a6d2c10-0004-4c04-9a04-0f1e2d3c4b07`
- Dados da transação de crédito: Valor `R$ 4.200,00`, Destinatário `PAR4-CRED`, Status `Pendente`
- Classificação selecionada: `Estorno`
- Débito selecionado: `Par 4 - debito de 4.200,00 - R$ 4.200,00 - 02/09/2026 17:22`
- Endpoint disparado: `PUT /api/prestacao-de-contas/projeto/70f0b687..091c/transacao-financeira/1a6d2c10-0004-4c04-9a04-0f1e2d3c4b07/classificar`
- Resposta HTTP da API: `422 (Unprocessable Entity)`
- Payload de erro da API:
```json
{
  "statusCode": 422,
  "message": "UNPROCESSABLE_ENTITY",
  "errors": [
    {
      "mensagem": "O débito compõe uma prestação que não permite mais edição; o estorno não pode ser aplicado nem desfeito.",
      "code": "ESTORNO_DEBITO_EM_PRESTACAO_BLOQUEADA"
    }
  ]
}
```

## Comportamento Esperado
1. **Prevenção no Seletor:** A lista suspensa de associação de débitos não deve listar transações de débito que componham prestações bloqueadas para edição/estorno (ou deve exibi-las desabilitadas com badge/tooltip indicativo), impedindo a submissão de vínculos inválidos.
2. **Coerência da Mensagem de Erro:** Caso o backend rejeite a operação com HTTP 422, o toast de erro deve apresentar título compatível com a funcionalidade em execução (ex: *"Não foi possível classificar o crédito"* ou *"Falha ao processar estorno"*), jamais exibindo mensagem herdada de outro módulo (*"Não foi possível salvar a passagem"*).

## Comportamento Atual
- A lista de débitos disponíveis para estorno permite selecionar lançamentos já vinculados a prestações bloqueadas.
- Ao submeter a classificação, o backend retorna `HTTP 422 Unprocessable Entity` com o erro `ESTORNO_DEBITO_EM_PRESTACAO_BLOQUEADA`.
- O frontend renderiza um toast de erro com o título desconexo e incorreto: **"Não foi possível salvar a passagem. Tente novamente."**, acompanhado da descrição da API: *"O débito compõe uma prestação que não permite mais edição; o estorno não pode ser aplicado nem desfeito."*.

## Evidências
- 📷 **Seleção da classificação Estorno associando ao débito:**
  ![Seleção de Estorno e Débito](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/classificar-credito/bugs/evidencias-BUG-CRED-008-01-selecao-estorno.png)

- 📷 **Modal de confirmação e Toast de erro com mensagem indevida de Passagem:**
  ![Toast indevido de passagem](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/classificar-credito/bugs/evidencias-BUG-CRED-008-02-toast-passagem.png)

- 📷 **DevTools Network confirmando erro HTTP 422 no endpoint PUT /classificar:**
  ![Network PUT classificar 422](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/classificar-credito/bugs/evidencias-BUG-CRED-008-03-put-erro-422.png)

- 📷 **Response payload detalhando ESTORNO_DEBITO_EM_PRESTACAO_BLOQUEADA:**
  ![Response 422 payload](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/classificar-credito/bugs/evidencias-BUG-CRED-008-04-response-422.png)

## Sugestão de Investigação
- **Frontend (`ClassificarCredito.vue`):** Verificar o bloco `catch` da função de submissão da classificação de crédito onde o toast de notificação é instanciado. O título está com string estática fixa *"Não foi possível salvar a passagem. Tente novamente."*, devendo ser alterado para mensagem contextualizada ao fluxo de crédito/estorno.
- **Backend / Endpoint de listagem de débitos para estorno:** Validar os filtros aplicados na query que preenche a lista do campo `Associe esse Crédito (entrada) a um Débito (saída)`. A consulta deve excluir débitos cujo status da prestação impeça estorno (`ESTORNO_DEBITO_EM_PRESTACAO_BLOQUEADA`), garantindo que apenas débitos elegíveis sejam apresentados ao coordenador.
