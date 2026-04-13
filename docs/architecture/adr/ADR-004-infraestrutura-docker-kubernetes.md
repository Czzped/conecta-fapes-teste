# ADR-004: Infraestrutura com Docker e Kubernetes

| Atributo | Valor |
|----------|-------|
| **Status** | Aceita |
| **Data** | 2026-04-13 |
| **Autores** | Time de Arquitetura ConectaFAPES |
| **Modulos impactados** | M001, M002, M003, M004, M005, M006, M007, M009 |

## Contexto

O ConectaFAPES precisa de uma infraestrutura que garanta reproducibilidade de ambiente entre desenvolvimento, homologacao e producao, facilite o deploy de novas versoes sem downtime e permita escalar componentes de forma independente. A plataforma e composta por pelo menos tres processos principais: API backend, frontend Nuxt e banco de dados SQL Server.

## Decisao

Adotado **Docker para empacotamento** e **Kubernetes para orquestracao em producao e homologacao**. Ambiente de desenvolvimento local usa **Docker Compose**.

Cada componente principal e um Deployment separado no Kubernetes:

| Componente | Imagem | Tipo de recurso K8s |
|------------|--------|---------------------|
| API Backend (C# .NET) | `conectafapes/api` | Deployment + Service |
| Frontend (Nuxt) | `conectafapes/frontend` | Deployment + Service |
| SQL Server | imagem oficial Microsoft | StatefulSet + PersistentVolumeClaim |

O trafego externo e roteado via **Ingress Controller** (ex.: nginx-ingress), com TLS terminado no ingress. Secrets de conexao ao banco e variaveis de ambiente sensiveis sao gerenciados via **Kubernetes Secrets** (ou equivalente com Sealed Secrets / Vault).

Estrutura de namespaces:

```
conectafapes-prod        # producao
conectafapes-homolog     # homologacao
conectafapes-dev         # desenvolvimento compartilhado (opcional)
```

O ambiente local de desenvolvimento usa `docker-compose.yml` na raiz do repositorio, subindo API, frontend e SQL Server com hot-reload.

## Consequencias

### Positivas

- Paridade entre ambientes: a mesma imagem Docker promovida de homologacao para producao elimina a classe de bugs "funciona na minha maquina"
- Kubernetes gerencia reinicializacao automatica de pods com falha (liveness/readiness probes)
- Rollout progressivo (RollingUpdate) permite deploy sem downtime; rollback e um comando (`kubectl rollout undo`)
- Escalonamento horizontal da API e do frontend e declarativo via `replicas` ou HorizontalPodAutoscaler

### Negativas

- SQL Server como StatefulSet em Kubernetes exige atencao especial a volumes persistentes e estrategia de backup (nao e o uso mais simples do K8s)
- Time precisa dominar conceitos de Kubernetes (Deployments, Services, Ingress, ConfigMaps, Secrets, PVCs)

### Riscos

- Perda de dados do SQL Server por misconfiguracao de PersistentVolume — mitigado por politica de backup automatico e testes periodicos de restore
- Complexity creep no cluster (muitos CRDs, operators) — mitigado por manter o setup inicial simples e adicionar complexidade apenas quando justificado
- Licenciamento do SQL Server em containers deve ser verificado junto a Microsoft para o contexto de uso publico governamental

## Referencias

- [Kubernetes Docs](https://kubernetes.io/docs/)
- [Docker Docs](https://docs.docker.com/)
- [SQL Server em containers — Microsoft Docs](https://learn.microsoft.com/en-us/sql/linux/sql-server-linux-docker-container-deployment)
- [ADR-001 — Backend C# com Clean Architecture e CQRS](ADR-001-backend-csharp-clean-architecture-cqrs.md)
- [ADR-002 — Frontend em Vue com Nuxt UI](ADR-002-frontend-vue-nuxtui.md)
- [ADR-003 — Banco de Dados SQL Server](ADR-003-banco-de-dados-sql-server.md)
