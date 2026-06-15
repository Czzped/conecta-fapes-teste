# Eventos de Dominio — M012 Acompanhamento e Resultados

Referencia: [README.md](README.md) | [Catalogo de Eventos de Notificacao (M020)](../M020-comunicacao/notificacoes/catalogo-eventos.md)

> **Stub.** Este modulo emite eventos de negocio que disparam notificacao ao usuario via M020 (RN08). A tabela abaixo lista os eventos ja mapeados no [catalogo do M020](../M020-comunicacao/notificacoes/catalogo-eventos.md), que e a fonte unica do mapeamento `evento -> tipo -> destinatario -> canal`. Pendente: estabilizar o nome de evento de dominio (PascalCase, ver convencao em [M024](../M024-curriculo-pesquisador/eventos-dominio.md)), o payload e os demais consumidores in-process.

## Eventos que disparam notificacao

| Gatilho de negocio | `eventoOrigem` (M020) | Tipo | Destinatario | Canal |
|--------------------|-----------------------|------|--------------|-------|
| Relatorio reprovado (justificativa + prazo 15d) | `RELATORIO_REPROVADO` | MUDANCA_STATUS | Coordenador | Email |
| Relatorio aprovado | `RELATORIO_APROVADO` | MUDANCA_STATUS | Coordenador | Email |
| Contestacao recebida — reanalise | `CONTESTACAO_RECEBIDA` | SOLICITACAO_APROVACAO | Area Tecnica | Interno |

> Manter sincronizado com [catalogo-eventos.md](../M020-comunicacao/notificacoes/catalogo-eventos.md).
