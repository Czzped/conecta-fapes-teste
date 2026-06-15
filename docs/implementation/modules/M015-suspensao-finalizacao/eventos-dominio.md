# Eventos de Dominio — M015 Suspensao e Finalizacao

Referencia: [README.md](README.md) | [Catalogo de Eventos de Notificacao (M020)](../M020-comunicacao/notificacoes/catalogo-eventos.md)

> **Stub.** Este modulo emite eventos de negocio que disparam notificacao ao usuario via M020 (RN08). A tabela abaixo lista os eventos ja mapeados no [catalogo do M020](../M020-comunicacao/notificacoes/catalogo-eventos.md), que e a fonte unica do mapeamento `evento -> tipo -> destinatario -> canal`. Pendente: estabilizar o nome de evento de dominio (PascalCase, ver convencao em [M024](../M024-curriculo-pesquisador/eventos-dominio.md)), o payload e os demais consumidores in-process.

## Eventos que disparam notificacao

| Gatilho de negocio | `eventoOrigem` (M020) | Tipo | Destinatario | Canal |
|--------------------|-----------------------|------|--------------|-------|
| Suspensao solicitada | `SUSPENSAO_SOLICITADA` | SOLICITACAO_APROVACAO | Area Tecnica | Interno |
| Suspensao aprovada | `SUSPENSAO_APROVADA` | MUDANCA_STATUS | Outorgado | Email |
| Suspensao rejeitada (justificativa) | `SUSPENSAO_REJEITADA` | MUDANCA_STATUS | Outorgado | Email |
| Reativacao solicitada | `REATIVACAO_SOLICITADA` | SOLICITACAO_APROVACAO | Area Tecnica | Interno |
| Reativacao deferida | `REATIVACAO_DEFERIDA` | MUDANCA_STATUS | Outorgado | Email |

> Manter sincronizado com [catalogo-eventos.md](../M020-comunicacao/notificacoes/catalogo-eventos.md).
