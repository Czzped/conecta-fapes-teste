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
| [ADR-005](ADR-005-adocao-bff.md) | Adocao de BFF por produto para composicao de interfaces | Aceita | 2026-04-14 |
| [ADR-006](ADR-006-reconciliacao-m004-pagamento-bolsista.md) | Reconciliacao da documentacao M004 com implementacao existente | Aceita | 2026-04-14 |
| [ADR-007](ADR-007-autorizacao-openfga.md) | OpenFGA como motor de autorizacao (RBAC/ABAC) | Aceita | 2026-04-14 |
| [ADR-008](ADR-008-backend-separado-m014.md) | Backend separado para M014 (Prestacao de Contas) | Aceita | 2026-04-14 |
| [ADR-009](ADR-009-hangfire-background-jobs.md) | Hangfire para processamento de jobs em background | Aceita | 2026-04-14 |
| [ADR-010](ADR-010-minio-armazenamento-objetos.md) | MinIO como armazenamento de objetos S3-compativel | Aceita | 2026-04-14 |

## Status possiveis

- **Proposta** — em discussao, ainda nao aceita
- **Aceita** — decisao tomada e em vigor
- **Substituida** — substituida por outro ADR (referenciar qual)
- **Depreciada** — nao mais relevante

## Template

Ao criar um novo ADR, use o template [`template.md`](template.md).
