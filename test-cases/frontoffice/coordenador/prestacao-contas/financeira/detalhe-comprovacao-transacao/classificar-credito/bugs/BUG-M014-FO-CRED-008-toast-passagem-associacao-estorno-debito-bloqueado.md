## Título
[Bug] Toast indevido 'Não foi possível salvar a passagem' e erro 422 ao associar estorno de crédito a débito com status 'Em devolução'

## ID
BUG-M014-FO-CRED-008

## Contexto de Negócio e Conflito de Fluxos
No Conecta FAPES, transações de débito que entraram em processo de devolução possuem um fluxo dedicado de saneamento:
- **Fluxo Oficial de Devolução (pela tela de Débito):** Quando um débito está com status `"Em devolução"`, o Coordenador deve acessá-lo em `/coordenador/prestacao-financeira/detalhes/:id`, onde o card *"Devolução pendente \*"* solicita a associação da transação de crédito e o upload do comprovante bancário de devolução.
- **O Problema nesta tela (Classificar Crédito):** Ao abrir o lançamento de crédito e selecionar a opção `Estorno`, a lista suspensa `Associe esse Crédito (entrada) a um Débito (saída)` disponibiliza débitos que já estão no status `"Em devolução"`. Isso induz o usuário a acreditar que o pareamento pode ser concluído por esta tela.
- **Consequência:** Ao tentar submeter o estorno, o backend recusa a operação com HTTP 422 (`ESTORNO_DEBITO_EM_PRESTACAO_BLOQUEADA`), pois a prestação de débito já está bloqueada para estornos simples, e a interface dispara um toast desconexo com mensagem herdada do módulo de **Passagem**.

## Requisito/Regra Violada
- Fluxo/Contexto: Prestação de Contas > Financeira > **Classificar Crédito** (`/coordenador/prestacao-financeira/classificar-credito/:id`)
- Regras Canônicas:
  - M014: `RN11` (Classificação de Crédito — Todo crédito deve ser classificado em Estorno, Rendimento, Devolução ou Aporte)
  - M014: `RN13` / `RI-EST02` (Pareamento entre crédito de estorno e débito original elegível)
  - `EPIC-M014-013` / `US-M014-052` (Fluxo de associação de devolução no card dedicado da prestação de débito)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #5 (Prevenção de Erros)**: O seletor de débitos disponibiliza opções incompatíveis com a operação de estorno simples (débitos em prestação já bloqueada/em devolução), induzindo o usuário a uma falha inevitável no submit.
  - **Heurística #4 (Consistência e Padrões)**: O título do toast exibe *"Não foi possível salvar a passagem. Tente novamente."*, exibindo termo de um módulo alheio (Passagem) em uma operação financeira de Crédito/Estorno.
  - **Heurística #9 (Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros)**: A interface não orienta o usuário sobre como sanear o débito em devolução (que deve ser feito na tela do próprio débito) e apresenta mensagens conflitantes.
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
2. Acessar o extrato financeiro em `Prestação de Contas > Financeira` e localizar um lançamento de Crédito com status `Pendente`.
3. Clicar no lançamento para abrir a tela `Classificar Crédito` (`/coordenador/prestacao-financeira/classificar-credito/:id`).
4. Na seção **1 Informações Gerais**, selecionar a opção `Estorno` no campo `Classificação`.
5. No campo `Associe esse Crédito (entrada) a um Débito (saída).`, abrir a lista suspensa: constatar que o débito cujo status já é `"Em devolução"` está listado para seleção (ex: `Par 4 - debito de 4.200,00 - R$ 4.200,00 - 02/09/2026 17:22`).
6. Selecionar o débito e clicar no botão `Enviar` no rodapé da página.
7. Na modal de confirmação *"Tem certeza que deseja enviar as informações?"*, clicar em `Enviar`.
8. Observar que a modal permanece na tela, a requisição falha com erro 422 e um toast de erro de Passagem é exibido no canto inferior direito.

## Dados de Entrada
- Rota acessada: `/coordenador/prestacao-financeira/classificar-credito/1a6d2c10-0004-4c04-9a04-0f1e2d3c4b07`
- Transação de crédito: Valor `R$ 4.200,00`, Destinatário `PAR4-CRED`, Status `Pendente`
- Classificação selecionada: `Estorno`
- Débito selecionado: `Par 4 - debito de 4.200,00 - R$ 4.200,00 - 02/09/2026 17:22` (prestação de débito no estado *"Em devolução"*)
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
1. **Consistência do Seletor (Prevenção de Erros):** Como débitos em processo de devolução possuem fluxo próprio de comprovação com envio de comprovante na tela do débito, a lista suspensa de Estorno na tela de crédito **não deve listar débitos vinculados a prestações bloqueadas/em devolução** (ou deve exibi-los desabilitados informando que a associação deve ocorrer na tela do próprio débito).
2. **Tratamento e Fechamento da Modal:** Caso uma requisição falhe, a modal de confirmação deve ser tratada adequadamente (fechando ou exibindo o erro internamente).
3. **Coerência da Notificação de Erro:** Se o backend recusar a requisição com 422, o toast de notificação deve possuir título coerente com a tela em uso (ex: *"Não foi possível classificar o crédito"*), e **nunca** apresentar textos hardcoded de outros módulos (*"Não foi possível salvar a passagem"*).

## Comportamento Atual
- A lista de débitos disponíveis para Estorno permite selecionar um débito cujo processo já se encontra com status `"Em devolução"`.
- Ao confirmar o envio, o backend recusa a operação com `HTTP 422` (`ESTORNO_DEBITO_EM_PRESTACAO_BLOQUEADA`).
- A modal de confirmação fica travada aberta no centro da página.
- O frontend dispara um toast de erro no canto inferior direito com título totalmente desconexo: **"Não foi possível salvar a passagem. Tente novamente."**, acompanhado da descrição da API: *"O débito compõe uma prestação que não permite mais edição; o estorno não pode ser aplicado nem desfeito."*.

## Evidências
- 📷 **Seleção da classificação Estorno associando ao débito em devolução:**
  ![Seleção de Estorno e Débito](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/classificar-credito/bugs/evidencias-BUG-CRED-008-01-selecao-estorno.png)

- 📷 **Modal travada e Toast de erro com título indevido de Passagem:**
  ![Toast indevido de passagem](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/classificar-credito/bugs/evidencias-BUG-CRED-008-02-toast-passagem.png)

- 📷 **DevTools Network confirmando erro HTTP 422 no endpoint PUT /classificar:**
  ![Network PUT classificar 422](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/classificar-credito/bugs/evidencias-BUG-CRED-008-03-put-erro-422.png)

- 📷 **Response payload detalhando ESTORNO_DEBITO_EM_PRESTACAO_BLOQUEADA:**
  ![Response 422 payload](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/classificar-credito/bugs/evidencias-BUG-CRED-008-04-response-422.png)

## Sugestão de Investigação
- **Filtro da lista de débitos (Frontend / API):** Na query que popula o seletor `Associe esse Crédito (entrada) a um Débito (saída)`, excluir débitos cujas prestações estejam em status que impeçam estorno simples (`Em devolução`, `Finalizado`, etc.), evitando induzir o coordenador a tentar um vínculo bloqueado pelo backend.
- **Feedback de Erro no Frontend (`ClassificarCredito.vue`):**
  - No bloco `catch` do envio de classificação, substituir a string estática de Passagem (*"Não foi possível salvar a passagem. Tente novamente."*) por uma mensagem compatível com o domínio de crédito/estorno.
  - Fechar a modal de confirmação ao receber erro da API para que o usuário não fique com a tela bloqueada.
