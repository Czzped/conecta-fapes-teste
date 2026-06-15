# Eventos de Dominio — M003 Gestao de Iniciativas Captadas

Referencia: [README.md](README.md) | [Catalogo de Eventos de Notificacao (M020)](../M020-comunicacao/notificacoes/catalogo-eventos.md)

> **Stub.** Este modulo emite eventos de negocio (submodulo Diarias) que disparam notificacao ao usuario via M020 (RN08). A tabela abaixo lista os eventos ja mapeados no [catalogo do M020](../M020-comunicacao/notificacoes/catalogo-eventos.md), que e a fonte unica do mapeamento `evento -> tipo -> destinatario -> canal`. Pendente: estabilizar o nome de evento de dominio (PascalCase, ver convencao em [M024](../M024-curriculo-pesquisador/eventos-dominio.md)), o payload e os demais consumidores in-process.

## Eventos que disparam notificacao

| Gatilho de negocio | `eventoOrigem` (M020) | Tipo | Destinatario | Canal |
|--------------------|-----------------------|------|--------------|-------|
| Diaria solicitada exige aceite do bolsista | `DIARIA_ACEITE_PENDENTE` | SOLICITACAO_APROVACAO | Bolsista | Email + Portal |
| Liberacao de parcela deferida | `DIARIA_PARCELA_DEFERIDA` | MUDANCA_STATUS | Coordenador | Email |
| Liberacao de parcela rejeitada (com motivo) | `DIARIA_PARCELA_REJEITADA` | MUDANCA_STATUS | Responsavel FAPES | Interno |

> Manter sincronizado com [catalogo-eventos.md](../M020-comunicacao/notificacoes/catalogo-eventos.md).
