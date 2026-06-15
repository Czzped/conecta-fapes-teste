# Eventos de Dominio — M016 Contabilidade e Financeiro

Referencia: [README.md](README.md) | [Catalogo de Eventos de Notificacao (M020)](../M020-comunicacao/notificacoes/catalogo-eventos.md)

> **Stub.** Este modulo emite eventos de negocio que disparam notificacao via M020 (RN08). A tabela abaixo lista os eventos ja mapeados no [catalogo do M020](../M020-comunicacao/notificacoes/catalogo-eventos.md), que e a fonte unica do mapeamento `evento -> tipo -> destinatario -> canal`. Pendente: estabilizar o nome de evento de dominio (PascalCase, ver convencao em [M024](../M024-curriculo-pesquisador/eventos-dominio.md)), o payload e os demais consumidores in-process.

## Eventos que disparam notificacao

| Gatilho de negocio | `eventoOrigem` (M020) | Tipo | Destinatario | Canal |
|--------------------|-----------------------|------|--------------|-------|
| Transacao pendente de analise | `TRANSACAO_PENDENTE_ANALISE` | ALERTA | Analista Financeiro | Interno |

> Manter sincronizado com [catalogo-eventos.md](../M020-comunicacao/notificacoes/catalogo-eventos.md).
