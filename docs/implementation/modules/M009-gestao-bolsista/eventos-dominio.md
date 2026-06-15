# Eventos de Dominio — M009 Gestao de Bolsa Pesquisa

Referencia: [README.md](README.md) | [Catalogo de Eventos de Notificacao (M020)](../M020-comunicacao/notificacoes/catalogo-eventos.md)

> **Stub.** Este modulo emite eventos de negocio que disparam notificacao ao usuario via M020 (RN08). A tabela abaixo lista os eventos ja mapeados no [catalogo do M020](../M020-comunicacao/notificacoes/catalogo-eventos.md), que e a fonte unica do mapeamento `evento -> tipo -> destinatario -> canal`. Pendente: estabilizar o nome de evento de dominio (PascalCase, ver convencao em [M024](../M024-curriculo-pesquisador/eventos-dominio.md)), o payload e os demais consumidores in-process.

## Eventos que disparam notificacao

| Gatilho de negocio | `eventoOrigem` (M020) | Tipo | Destinatario | Canal |
|--------------------|-----------------------|------|--------------|-------|
| Bolsista indicado — aceite pendente | `INDICACAO_BOLSISTA` | SOLICITACAO_APROVACAO | Orientador | Email |
| Documentacao solicitada ao bolsista | `BOLSA_DOC_SOLICITADA` | SOLICITACAO_APROVACAO | Bolsista | Email |
| Aceite do orientador recebido | `ORIENTADOR_ACEITE_RECEBIDO` | MUDANCA_STATUS | Coordenador | Email + Portal |
| Documentacao reprovada (com justificativa) | `BOLSA_DOC_REPROVADA` | MUDANCA_STATUS | Bolsista | Email |
| Termo de compromisso pronto | `TERMO_COMPROMISSO_PRONTO` | MUDANCA_STATUS | Coord, Orientador, Bolsista, DIRAF, DIPRE | Email |
| Termo pronto para assinatura/publicacao | `TERMO_PRONTO_ASSINATURA` | SOLICITACAO_APROVACAO | SUCON | Interno |
| Bolsa implementada | `BOLSA_IMPLEMENTADA` | MUDANCA_STATUS | Bolsista, Coordenador | Email |
| Bolsa nao implementada (RN12) | `BOLSA_NAO_IMPLEMENTADA` | MUDANCA_STATUS | Coordenador | Email |
| Renovacao deferida | `BOLSA_RENOVACAO_DEFERIDA` | MUDANCA_STATUS | Coordenador, Bolsista | Email |
| Renovacao indeferida | `BOLSA_RENOVACAO_INDEFERIDA` | MUDANCA_STATUS | Coordenador, Bolsista | Email |
| Suspensao efetivada | `BOLSA_SUSPENSAO_EFETIVADA` | MUDANCA_STATUS | Coordenador, Bolsista | Email |
| Lembrete de encerramento da bolsa (T-30 / T-7 / T-1) | `BOLSA_PRAZO_ENCERRAMENTO` | LEMBRETE_PRAZO | Bolsista, Coordenador | Email |
| Bolsa encerrada | `BOLSA_ENCERRAMENTO` | MUDANCA_STATUS | Coordenador | Email |
| Bolsa reativada | `BOLSA_REATIVACAO` | MUDANCA_STATUS | Coordenador, Bolsista | Email |

> `BOLSA_PRAZO_ENCERRAMENTO` e um lembrete de prazo mandatorio (RN04) com antecedencia configurada em T-30, T-7 e T-1 (especifica do encerramento de bolsa; difere do padrao 30/15/7 da RN07). Configurado via `ConfigurarLembreteDePrazo` do M020 com `entidadeReferencia = BolsaPesquisa`.
>
> Manter sincronizado com [catalogo-eventos.md](../M020-comunicacao/notificacoes/catalogo-eventos.md).
