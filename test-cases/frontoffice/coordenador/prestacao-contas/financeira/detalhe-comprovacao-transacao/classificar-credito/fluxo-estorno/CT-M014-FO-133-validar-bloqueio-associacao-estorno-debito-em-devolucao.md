## ID do Cenário
[CT-M014-FO-133]

## Título
Validar bloqueio e filtro de associação de estorno para débitos com prestação em devolução

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Tela Classificar Crédito (`/coordenador/prestacao-financeira/classificar-credito/:paymentId`)
- Regras Canônicas:
  - M014: `RN11` (Classificação de Crédito — Estorno)
  - M014: `RN13` / `RI-EST02` (Pareamento de crédito de estorno com débito original elegível)
  - `EPIC-M014-013` / `US-M014-052` (Fluxo de saneamento de devolução exclusivo pela tela de comprovação do débito)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #5 (Prevenção de Erros)**: O seletor de débitos deve prevenir seleções incompatíveis, impedindo que o usuário escolha débitos bloqueados ou em processo de devolução.
  - **Heurística #4 (Consistência e Padrões)**: Mensagens de erro devem ser estritamente coerentes com o contexto da tela (crédito/estorno), sem vazamento de strings de outros módulos (passagem).
  - **Heurística #9 (Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros)**: Feedback transparente orientando sobre a rota correta para saneamento de devoluções.
- Bug Relacionado: `BUG-M014-FO-CRED-008` (Issue #691)

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado no contexto do portal.
- Existência de ao menos um lançamento bancário de débito com status `"Em devolução"` na prestação de contas.
- Transação de crédito aberta na rota `/coordenador/prestacao-financeira/classificar-credito/:paymentId` com status `Pendente`.

## Passo a Passo
1. Acessar a tela de classificação de uma transação de crédito pendente (`/coordenador/prestacao-financeira/classificar-credito/:paymentId`).
2. No campo `Classificação`, selecionar a opção `Estorno`.
3. Observar a exibição do campo condicional `Associe esse Crédito (entrada) a um Débito (saída).`.
4. Clicar no campo select de associação de débito para abrir as opções disponíveis.
5. Inspecionar as transações de débito listadas na lista suspensa.
6. *(Cenário de Exceção / Regressão)*: Caso um débito com prestação em devolução seja indevidamente listado e selecionado, clicar no botão `Enviar` no rodapé.
7. Na modal de confirmação, clicar em `Enviar` e inspecionar a resposta da API e o feedback em tela.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/classificar-credito/:paymentId`
- Classificação: `Estorno`
- Campo de Associação: `Associe esse Crédito (entrada) a um Débito (saída).`
- Débito de teste: Transação de débito vinculada a prestação com status `"Em devolução"` (ex: `Par 4 - debito de 4.200,00 - R$ 4.200,00 - 02/09/2026 17:22`).

## Resultado Esperado
- **Comportamento no Seletor (Prevenção de Erros):** A lista suspensa do campo `Associe esse Crédito (entrada) a um Débito (saída).` deve exibir exclusivamente débitos elegíveis para estorno simples:
  - Transações de débito vinculadas a prestações com status `"Em devolução"`, `"Finalizado"` ou bloqueadas **não devem ser listadas** (ou devem constar desabilitadas com rótulo explicativo indicando que a devolução deve ser comprovada na tela do próprio débito).
- **Tratamento de Exceção (Submissão Rejeitada):** Caso uma tentativa de associação de débito bloqueado seja enviada ao backend e retorne código HTTP 422 (`ESTORNO_DEBITO_EM_PRESTACAO_BLOQUEADA`):
  - A modal de confirmação deve ser fechada imediatamente.
  - A interface deve exibir mensagem de erro clara e contextualizada ao fluxo de crédito/estorno (ex: *"Não foi possível classificar o crédito: o débito selecionado compõe uma prestação bloqueada que não permite estorno"*).
  - O sistema **nunca** deve exibir toast com referências indevidas a outros módulos, como *"Não foi possível salvar a passagem. Tente novamente."*.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
