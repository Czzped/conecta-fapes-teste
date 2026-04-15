# M007 - API Gateway

[← Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 01 — Corporativo](../../../discovery/domains/01-corporativo.md)

---

## Status

> **A definir.** Este modulo ainda nao possui especificacao de implementacao. O placeholder foi criado para manter a rastreabilidade com os documentos que o referenciam.

---

## Sobre o Modulo

Servicos expostos diretamente sem camada unificada de roteamento, autenticacao e rate limiting, aumentando superficie de ataque. Este modulo visa prover um gateway centralizado para roteamento, autenticacao e controle de acesso das APIs.

| Atributo | Valor |
|----------|-------|
| **Dor do Cliente** | Servicos sem camada unificada de roteamento e seguranca |
| **Solucao** | Gateway centralizado com roteamento, autenticacao e rate limiting |
| **KPI** | Disponibilidade do gateway; latencia media; incidentes de seguranca |

## Referenciado por

- [architecture/02-modulos-e-integracoes.md](../../../architecture/02-modulos-e-integracoes.md) — diagrama de modulos (M005 → M007, M006 → M007)
- [architecture/03-acesso-e-seguranca.md](../../../architecture/03-acesso-e-seguranca.md) — arquitetura de dois gateways (publico e interno)
- [ADR-005](../../../architecture/adr/ADR-005-adocao-bff.md) — relacao BFF vs Gateway
- [management/milestones.md](../../../management/milestones.md) — MS-01 (Base Operacional)
- [Portal Coordenador EP-02](../../../products/portal-coordenador/features/EP-02-shell-portal-contexto-projeto.md) — contexto de navegacao

## Proximos Passos

- Definir contrato do modulo (rotas, politicas de rate limiting, health check)
- Decidir se e modulo de codigo ou configuracao de infraestrutura
- Criar backlog com EPICs
