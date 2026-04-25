# M005 - Autenticacao e Auditoria

[← Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 01 — Corporativo](../../../discovery/domains/01-corporativo.md)

---

## Status

> **A definir.** Este modulo ainda nao possui especificacao de implementacao. O placeholder foi criado para manter a rastreabilidade com os documentos que o referenciam.

---

## Sobre o Modulo

Sem controle granular de acesso, qualquer usuario autenticado pode acessar dados sensiveis sem rastro de auditoria. Este modulo visa implementar autenticacao integrada ao Acesso Cidadao com autorizacao em nivel de dados e logs de auditoria.

| Atributo | Valor |
|----------|-------|
| **Dor do Cliente** | Ausencia de controle granular e auditoria de acesso |
| **Solucao** | Autenticacao via Acesso Cidadao (OpenID Connect) com auditoria |
| **KPI** | Cobertura de controle de acesso; percentual de acoes auditadas |
| **Integracao externa** | [Acesso Cidadao](https://docs.acessocidadao.es.gov.br) |

## Referenciado por

- [architecture/03-acesso-e-seguranca.md](../../../architecture/03-acesso-e-seguranca.md) — fluxo de autenticacao
- [management/milestones/README.md](../../../management/milestones/README.md) — MS-01 (Base Operacional)
- [M020/contrato.md](../M020-comunicacao/contrato.md) — dependencia para base de usuarios
- [Portal Coordenador EP-01](../../../products/portal-coordenador/features/EP-01-autenticacao-acesso-cidadao.md) — login federado

## Proximos Passos

- Definir contrato do modulo (comandos, consultas, eventos)
- Definir modelo estrutural (User, Session, AuditLog)
- Criar backlog com EPICs
