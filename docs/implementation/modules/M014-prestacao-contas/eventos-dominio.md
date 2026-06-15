# Eventos de Dominio — M014 Prestacao de Contas

Referencia: [README.md](README.md) | [Catalogo de Eventos de Notificacao (M020)](../M020-comunicacao/notificacoes/catalogo-eventos.md)

> **Stub.** Este modulo emite eventos de negocio que disparam notificacao ao usuario via M020 (RN08). A tabela abaixo lista os eventos ja mapeados no [catalogo do M020](../M020-comunicacao/notificacoes/catalogo-eventos.md), que e a fonte unica do mapeamento `evento -> tipo -> destinatario -> canal`. Pendente: estabilizar o nome de evento de dominio (PascalCase, ver convencao em [M024](../M024-curriculo-pesquisador/eventos-dominio.md)), o payload e os demais consumidores in-process.

## Eventos que disparam notificacao

| Gatilho de negocio | `eventoOrigem` (M020) | Tipo | Destinatario | Canal |
|--------------------|-----------------------|------|--------------|-------|
| Documento fiscal reprovado | `DOCUMENTO_FISCAL_REPROVADO` | MUDANCA_STATUS | Coordenador | Email |
| Lembrete de prazo de submissao (T-7 / T-3 / T-0) | `PRAZO_SUBMISSAO` | LEMBRETE_PRAZO | Coordenador | Email |
| Lembrete de prazo de reposicao (T-7 / T-3 / T-0) | `PRAZO_REPOSICAO` | LEMBRETE_PRAZO | Coordenador | Email |
| Reposicao recebida (dentro / fora do prazo) | `REPOSICAO_RECEBIDA` | MUDANCA_STATUS | Area Tecnica | Interno |
| Revisor designado | `REVISOR_DESIGNADO` | MUDANCA_STATUS | Coordenador | Email |
| Parecer deferido | `PARECER_PC_DEFERIDO` | MUDANCA_STATUS | Coordenador | Email |
| Parecer indeferido (justificativa) | `PARECER_PC_INDEFERIDO` | MUDANCA_STATUS | Coordenador | Email |
| Prestacao auditada | `PRESTACAO_AUDITADA` | MUDANCA_STATUS | Coordenador, Area Tecnica, Diretoria | Email |

> Lembretes de prazo sao mandatorios (RN04). Manter sincronizado com [catalogo-eventos.md](../M020-comunicacao/notificacoes/catalogo-eventos.md).
