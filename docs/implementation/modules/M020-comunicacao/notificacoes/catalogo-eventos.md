# Catalogo de Eventos de Notificacao

[<< Voltar a Notificacoes](README.md) | [<< Voltar ao M020](../README.md)

## Objetivo

Indice consolidado de **todos os eventos de negocio** que disparam email ou notificacao na plataforma ConectaFAPES. E a fonte unica de consulta cross-cutting do M020: para cada evento mapeia o modulo de origem, o tipo de notificacao, o destinatario, o canal e se e mandatorio.

> **Propriedade do evento:** o gatilho pertence ao modulo de origem (bounded context). O M020 apenas **consome** o evento via a operacao `ReceberEventoDeNegocioParaNotificacao` (ver [contrato](../contrato.md)), identificando-o por `eventoOrigem` + `moduloOrigem`. Este catalogo nao substitui a definicao do evento no modulo de origem — consolida-os para configuracao de templates e auditoria.

## Como ler

- **Evento (gatilho):** descricao do fato de negocio, conforme documentado no EPIC do modulo de origem.
- **`eventoOrigem`:** codigo `UPPER_SNAKE` usado no payload do M020. Codigos marcados com `*` sao **propostos** por este catalogo — o modelo do M020 so cita literalmente `BOLSA_IMPLEMENTADA` e `PRAZO_VENCENDO`. Confirmar/estabilizar com cada modulo de origem.
- **Tipo:** valor do enum `TipoNotificacao` do M020 — `MUDANCA_STATUS`, `LEMBRETE_PRAZO`, `SOLICITACAO_APROVACAO`, `PAGAMENTO`, `COMUNICADO`, `ALERTA`.
- **Canal:** `Email` (remetente institucional, RN01), `Portal` (in-app), `Interno` (destinatario e servidor FAPES / Area Tecnica).
- **Mand.:** `Sim` quando o template e mandatorio sem opt-out (RN04 — prazo e pagamento). Demais sao configuraveis pelo usuario.

## Regras herdadas do M020

| ID | Regra |
|----|-------|
| RN01 | Remetente `no-reply@fapes.es.gov.br`. |
| RN02 | Templates com variaveis: `{{nome}}`, `{{edital}}`, `{{prazo}}`, `{{status}}`, `{{valor}}`, etc. |
| RN03 | Ate 3 tentativas de envio antes de falha definitiva. |
| RN04 | Notificacoes de **prazo** e **pagamento** sao mandatorias (sem opt-out). |
| RN05 | Comunicados em massa exigem aprovacao do Diretor. |
| RN06 | Toda notificacao registrada no historico para auditoria. |
| RN07 | Lembretes de prazo automaticos com antecedencia configuravel (padrao 30, 15, 7 dias). |
| RN08 | Servico consumido por todos os modulos via API interna. |

---

## Eventos por modulo de origem

### M003 - Gestao de Iniciativas Captadas (Diarias)

| Evento (gatilho) | `eventoOrigem` | Tipo | Destinatario | Canal | Mand. |
|------------------|----------------|------|--------------|-------|-------|
| Diaria solicitada exige aceite do bolsista | `DIARIA_ACEITE_PENDENTE` * | SOLICITACAO_APROVACAO | Bolsista | Email + Portal | Nao |
| Liberacao de parcela deferida | `DIARIA_PARCELA_DEFERIDA` * | MUDANCA_STATUS | Coordenador | Email | Nao |
| Liberacao de parcela rejeitada (com motivo) | `DIARIA_PARCELA_REJEITADA` * | MUDANCA_STATUS | Responsavel FAPES | Interno | Nao |

### M009 - Gestao de Bolsa Pesquisa

| Evento (gatilho) | `eventoOrigem` | Tipo | Destinatario | Canal | Mand. |
|------------------|----------------|------|--------------|-------|-------|
| Bolsista indicado — aceite pendente | `INDICACAO_BOLSISTA` * | SOLICITACAO_APROVACAO | Orientador | Email | Nao |
| Documentacao solicitada ao bolsista | `BOLSA_DOC_SOLICITADA` * | SOLICITACAO_APROVACAO | Bolsista | Email | Nao |
| Aceite do orientador recebido | `ORIENTADOR_ACEITE_RECEBIDO` * | MUDANCA_STATUS | Coordenador | Email + Portal | Nao |
| Documentacao reprovada (com justificativa) | `BOLSA_DOC_REPROVADA` * | MUDANCA_STATUS | Bolsista | Email | Nao |
| Termo de compromisso pronto | `TERMO_COMPROMISSO_PRONTO` * | MUDANCA_STATUS | Coord, Orientador, Bolsista, DIRAF, DIPRE | Email | Nao |
| Termo pronto para assinatura/publicacao | `TERMO_PRONTO_ASSINATURA` * | SOLICITACAO_APROVACAO | SUCON | Interno | Nao |
| Bolsa implementada | `BOLSA_IMPLEMENTADA` | MUDANCA_STATUS | Bolsista, Coordenador | Email | Nao |
| Bolsa nao implementada (RN12 do M009) | `BOLSA_NAO_IMPLEMENTADA` * | MUDANCA_STATUS | Coordenador | Email | Nao |
| Renovacao deferida | `BOLSA_RENOVACAO_DEFERIDA` * | MUDANCA_STATUS | Coordenador, Bolsista | Email | Nao |
| Renovacao indeferida | `BOLSA_RENOVACAO_INDEFERIDA` * | MUDANCA_STATUS | Coordenador, Bolsista | Email | Nao |
| Suspensao efetivada | `BOLSA_SUSPENSAO_EFETIVADA` * | MUDANCA_STATUS | Coordenador, Bolsista | Email | Nao |
| Lembrete de encerramento da bolsa (T-30 / T-7 / T-1) | `BOLSA_PRAZO_ENCERRAMENTO` * | LEMBRETE_PRAZO | Bolsista, Coordenador | Email | **Sim** |
| Bolsa encerrada | `BOLSA_ENCERRAMENTO` * | MUDANCA_STATUS | Coordenador | Email | Nao |
| Bolsa reativada | `BOLSA_REATIVACAO` * | MUDANCA_STATUS | Coordenador, Bolsista | Email | Nao |

### M012 - Acompanhamento e Resultados

| Evento (gatilho) | `eventoOrigem` | Tipo | Destinatario | Canal | Mand. |
|------------------|----------------|------|--------------|-------|-------|
| Relatorio reprovado (justificativa + prazo 15d, RN03 do M012) | `RELATORIO_REPROVADO` * | MUDANCA_STATUS | Coordenador | Email | Nao |
| Relatorio aprovado | `RELATORIO_APROVADO` * | MUDANCA_STATUS | Coordenador | Email | Nao |
| Contestacao recebida — reanalise | `CONTESTACAO_RECEBIDA` * | SOLICITACAO_APROVACAO | Area Tecnica | Interno | Nao |

### M014 - Prestacao de Contas

| Evento (gatilho) | `eventoOrigem` | Tipo | Destinatario | Canal | Mand. |
|------------------|----------------|------|--------------|-------|-------|
| Documento fiscal reprovado | `DOCUMENTO_FISCAL_REPROVADO` * | MUDANCA_STATUS | Coordenador | Email | Nao |
| Lembrete de prazo de submissao (T-7 / T-3 / T-0) | `PRAZO_SUBMISSAO` * | LEMBRETE_PRAZO | Coordenador | Email | **Sim** |
| Lembrete de prazo de reposicao (T-7 / T-3 / T-0) | `PRAZO_REPOSICAO` * | LEMBRETE_PRAZO | Coordenador | Email | **Sim** |
| Reposicao recebida (dentro / fora do prazo) | `REPOSICAO_RECEBIDA` * | MUDANCA_STATUS | Area Tecnica | Interno | Nao |
| Revisor designado | `REVISOR_DESIGNADO` * | MUDANCA_STATUS | Coordenador | Email | Nao |
| Parecer deferido | `PARECER_PC_DEFERIDO` * | MUDANCA_STATUS | Coordenador | Email | Nao |
| Parecer indeferido (justificativa) | `PARECER_PC_INDEFERIDO` * | MUDANCA_STATUS | Coordenador | Email | Nao |
| Prestacao auditada | `PRESTACAO_AUDITADA` * | MUDANCA_STATUS | Coordenador, Area Tecnica, Diretoria | Email | Nao |

### M015 - Suspensao e Finalizacao

| Evento (gatilho) | `eventoOrigem` | Tipo | Destinatario | Canal | Mand. |
|------------------|----------------|------|--------------|-------|-------|
| Suspensao solicitada | `SUSPENSAO_SOLICITADA` * | SOLICITACAO_APROVACAO | Area Tecnica | Interno | Nao |
| Suspensao aprovada | `SUSPENSAO_APROVADA` * | MUDANCA_STATUS | Outorgado | Email | Nao |
| Suspensao rejeitada (justificativa) | `SUSPENSAO_REJEITADA` * | MUDANCA_STATUS | Outorgado | Email | Nao |
| Reativacao solicitada | `REATIVACAO_SOLICITADA` * | SOLICITACAO_APROVACAO | Area Tecnica | Interno | Nao |
| Reativacao deferida | `REATIVACAO_DEFERIDA` * | MUDANCA_STATUS | Outorgado | Email | Nao |

### M004 / M016 - Pagamento e Financeiro

| Evento (gatilho) | `eventoOrigem` | Tipo | Destinatario | Canal | Mand. |
|------------------|----------------|------|--------------|-------|-------|
| Ordem de pagamento gerada | `ORDEM_PAGAMENTO_GERADA` * | PAGAMENTO | DIRAF | Interno | **Sim** |
| Pagamento agendado | `PAGAMENTO_AGENDADO` * | PAGAMENTO | Bolsista | Email + Portal | **Sim** |
| Pagamento realizado | `PAGAMENTO_REALIZADO` * | PAGAMENTO | Bolsista | Email + Portal | **Sim** |
| Pagamento realizado (controle interno) | `PAGAMENTO_REALIZADO` * | PAGAMENTO | GEPOF | Interno | **Sim** |
| Pagamento com falha | `PAGAMENTO_FALHA` * | PAGAMENTO | GEPOF | Interno | **Sim** |
| Transacao pendente de analise | `TRANSACAO_PENDENTE_ANALISE` * | ALERTA | Analista Financeiro | Interno | Nao |

### M017 - Prevencao a Lavagem de Dinheiro (PLD)

| Evento (gatilho) | `eventoOrigem` | Tipo | Destinatario | Canal | Mand. |
|------------------|----------------|------|--------------|-------|-------|
| Suspeita detectada (analise em 48h) | `PLD_SUSPEITA_DETECTADA` * | ALERTA | Analista Compliance | Portal | Nao |
| Prazo legal vencido (RN03 do M017) | `PLD_PRAZO_LEGAL_VENCIDO` * | ALERTA | Operador | Portal | Nao |

### M019 - Transparencia e Auditoria

| Evento (gatilho) | `eventoOrigem` | Tipo | Destinatario | Canal | Mand. |
|------------------|----------------|------|--------------|-------|-------|
| Publicacao desatualizada | `PUBLICACAO_DESATUALIZADA` * | ALERTA | Operador | Portal | Nao |

### M024 - Curriculo do Pesquisador

| Evento (gatilho) | `eventoOrigem` | Tipo | Destinatario | Canal | Mand. |
|------------------|----------------|------|--------------|-------|-------|
| Curriculo vinculado com sucesso | `CURRICULO_VINCULADO` * | MUDANCA_STATUS | Pesquisador | Email + Portal | Nao |
| Falha na sincronizacao do curriculo | `CURRICULO_SINCRONIZACAO_FALHA` * | ALERTA | Pesquisador | Email | Nao |
| Curriculo desatualizado | `CURRICULO_DESATUALIZADO` * | ALERTA | Pesquisador | Email + Portal | Nao |
| Editais compativeis com o perfil | `CURRICULO_EDITAIS_COMPATIVEIS` * | COMUNICADO | Pesquisador | Email + Portal | Nao |

### M020 - Comunicacao (proprios)

| Evento (gatilho) | `eventoOrigem` | Tipo | Destinatario | Canal | Mand. |
|------------------|----------------|------|--------------|-------|-------|
| Comunicado em massa aguardando aprovacao | `COMUNICADO_AGUARDANDO_APROVACAO` * | SOLICITACAO_APROVACAO | Diretor | Email + Portal | Nao |

---

## Padrao de gatilho

Notificacoes disparam em tres momentos de negocio recorrentes, alem dos lembretes automaticos:

1. **Mudanca de status** de uma entidade de fluxo (`MUDANCA_STATUS`).
2. **Pedido de acao / aceite** com prazo (`SOLICITACAO_APROVACAO`).
3. **Decisao** — deferido / indeferido / aprovado / reprovado, sempre com justificativa (`MUDANCA_STATUS`).
4. **Lembrete de prazo** automatico em T-30 / T-15 / T-7 (`LEMBRETE_PRAZO`, RN07), nao orientado a evento de negocio.

## Convencao de nomenclatura de `eventoOrigem`

- Formato `UPPER_SNAKE`, prefixado pela entidade quando ajuda (`BOLSA_*`, `DIARIA_*`, `PRAZO_*`, `PLD_*`).
- Verbo no participio para fatos consumados (`*_DEFERIDO`, `*_REPROVADO`, `*_REALIZADO`).
- Maximo 100 caracteres (limite de `Notificacao.eventoOrigem`).

## Como registrar um novo evento

1. Declarar o evento no modulo de origem (em `eventos-dominio.md` e/ou `ontology.yaml` do modulo).
2. Adicionar a linha correspondente neste catalogo.
3. Configurar o `TemplateNotificacao` no M020 (`ConfigurarTemplateNotificacao`) com o `tipo` correto e `mandatorio` conforme RN04.
4. O modulo passa a disparar `ReceberEventoDeNegocioParaNotificacao` com `eventoOrigem` + `moduloOrigem` + `destinatarios` + `dados`.

## Rastreabilidade

- Contrato do servico: [contrato.md](../contrato.md)
- Modelo estrutural (enum `TipoNotificacao`, entidade `Notificacao`): [modelo-estrutural.md](../modelo-estrutural.md)
- Regras de negocio (RN01–RN09): [README.md](../README.md)
- Template base de email: [emails/email-notificacao-evento.md](emails/email-notificacao-evento.md)
