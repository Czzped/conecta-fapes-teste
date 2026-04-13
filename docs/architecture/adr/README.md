# ADR - Architecture Decision Records

Registro das decisoes de arquitetura do projeto Conecta FAPES.

[← Voltar a Arquitetura](../README.md)

---

## O que e um ADR?

Um ADR (Architecture Decision Record) documenta uma decisao de arquitetura significativa, incluindo o contexto, as opcoes consideradas, a decisao tomada e suas consequencias.

## Indice de ADRs

| ID | Titulo | Status | Data |
|----|--------|--------|------|
| [ADR-001](ADR-001-backend-csharp-clean-architecture-cqrs.md) | Backend em C# com Clean Architecture e CQRS | Aceita | 2026-04-13 |
| [ADR-002](ADR-002-frontend-vue-nuxtui.md) | Frontend em Vue com Nuxt UI | Aceita | 2026-04-13 |
| [ADR-003](ADR-003-banco-de-dados-sql-server.md) | Banco de Dados SQL Server (instancia unica) | Aceita | 2026-04-13 |
| [ADR-004](ADR-004-infraestrutura-docker-kubernetes.md) | Infraestrutura com Docker e Kubernetes | Aceita | 2026-04-13 |

## Status possiveis

- **Proposta** — em discussao, ainda nao aceita
- **Aceita** — decisao tomada e em vigor
- **Substituida** — substituida por outro ADR (referenciar qual)
- **Depreciada** — nao mais relevante

## Template

Ao criar um novo ADR, use o template [`template.md`](template.md).
