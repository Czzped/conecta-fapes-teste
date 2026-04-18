# Debitos Tecnicos — Migracao para o Stack Padrao ConectaFAPES

[← Voltar ao Importador](README.md)

> Este documento lista os debitos tecnicos identificados na comparacao entre o stack atual do Importador e o stack padrao definido pelos ADRs do ConectaFAPES. O objetivo e tornar explicita a lacuna e priorizar esforcos de alinhamento.
>
> O [ADR-011](../../architecture/adr/ADR-011-arquitetura-importador-sigfapes.md) aceita formalmente o stack atual como uma excecao justificada. Este documento e um complemento operacional para guiar eventual convergencia futura.

---

## 1. Stack padrao ConectaFAPES vs Stack atual do Importador

| Camada | Padrao ConectaFAPES | Importador hoje | Divergencia |
|--------|---------------------|-----------------|-------------|
| **Frontend framework** | Vue 3 + Nuxt ([ADR-002](../../architecture/adr/ADR-002-frontend-vue-nuxtui.md)) | React 18 + Vite | ❌ Stack diferente |
| **Design system** | Nuxt UI + Tailwind CSS v4 | CSS puro + tokens | ❌ Sem design system |
| **Gerenciador de estado** | Pinia | Context API + useState | ❌ |
| **HTTP client** | Vue Query + Axios | `fetch` nativo + wrapper custom em `lib/api.ts` | ❌ |
| **Backend linguagem** | C# .NET ([ADR-001](../../architecture/adr/ADR-001-backend-csharp-clean-architecture-cqrs.md)) | Python 3.12 + FastAPI | ❌ Stack diferente |
| **Arquitetura backend** | Clean Architecture + CQRS + MediatR | Em camadas (router/service/adapter) com use_cases em rollout | ⚠️ Parcial (migrando para Clean) |
| **Banco de dados** | Microsoft SQL Server ([ADR-003](../../architecture/adr/ADR-003-banco-de-dados-sql-server.md)) | Supabase Postgres via PostgREST | ❌ |
| **Autenticacao** | Acesso Cidadao (OIDC) | Supabase Auth (email/senha) | ❌ |
| **Autorizacao** | AuthRix / OpenFGA ([ADR-007](../../architecture/adr/ADR-007-autorizacao-openfga.md)) | Role em JWT claim (`INTERNAL_ALLOWED_ROLES`) | ❌ |
| **Object storage** | MinIO S3-compativel ([ADR-010](../../architecture/adr/ADR-010-minio-armazenamento-objetos.md)) | S3 / MinIO via boto3 | ✅ Compativel |
| **Background jobs** | Hangfire ([ADR-009](../../architecture/adr/ADR-009-hangfire-background-jobs.md)) | Custom worker com polling em `import_jobs` | ❌ |
| **Infraestrutura** | Docker + Kubernetes ([ADR-004](../../architecture/adr/ADR-004-infraestrutura-docker-kubernetes.md)) | Render plano free | ❌ |
| **Jobs de integracao** | Microservicos .NET em k8s | Scripts Python standalone (`sigfapes_dump_job.py`) | ❌ |

### Resumo quantitativo

- **8 camadas fora do padrao** (Frontend, Design system, Estado, HTTP, Backend, DB, Auth, Autorizacao, Jobs, Infra)
- **1 camada parcialmente alinhada** (arquitetura backend migrando para Clean)
- **1 camada alinhada** (MinIO S3-compativel)

---

## 2. Justificativa historica (ADR-011)

O [ADR-011](../../architecture/adr/ADR-011-arquitetura-importador-sigfapes.md) **aceita formalmente** o stack divergente. Razoes registradas:

- Produto pre-existente com base de codigo madura em Python/React
- Equipe tecnica operadora e pequena (<10 usuarios)
- Uso em janelas mensais, nao continuo
- Requisitos de performance (editais 5000+ linhas) atendidos com pandas/NumPy/xlsxwriter
- Virtual scroll manual em React ja resolve UI pesada

Mas o proprio ADR reconhece essa aceitacao como **excecao local**, nao como negacao do padrao geral.

---

## 3. Debitos tecnicos consolidados

### TD-01 — Frontend em React em vez de Vue/Nuxt

**Severidade:** Alta (violacao direta do ADR-002)

| Aspecto | Detalhe |
|---------|---------|
| **Estado atual** | React 18.3.1 + TypeScript 5.8 + Vite 5.4 |
| **Padrao esperado** | Vue 3 + Nuxt + Nuxt UI + Tailwind CSS v4 |
| **Impacto** | Duas bases frontend paralelas na organizacao (React e Vue); onboarding duplicado; sem reuso de componentes com Portal Coordenador/Admin |
| **Justificativa atual** | Codigo legado pre-existente; equipe tecnica pequena |
| **Esforco estimado** | Alto (reescrita completa do frontend) |
| **Trigger para pagar** | Quando houver equipe dedicada ou quando Portal Admin assumir o fluxo de importacao |
| **Como migrar** | Reescrever paginas (`LoginPage`, `EditaisPage`, `CorrectionPage`) em Nuxt pages; migrar hooks para composables; substituir `fetch + AuthContext` por `useFetch` + Pinia; recriar `SpreadsheetEditor` como componente Vue — manter virtual scroll manual e `react-datepicker` vira `vue-datepicker` |

### TD-02 — Design system proprio em vez de Nuxt UI + Tailwind

**Severidade:** Alta (vem junto com TD-01)

| Aspecto | Detalhe |
|---------|---------|
| **Estado atual** | CSS puro em `frontend/src/styles.css` com tokens (`--text-muted`, `--surface`) |
| **Padrao esperado** | Nuxt UI (componentes acessiveis) + Tailwind CSS v4 |
| **Impacto** | Componentes sem conformidade ARIA/WCAG padronizada; UI diferente do restante do ConectaFAPES |
| **Esforco** | Medio (acompanha TD-01) |
| **Como migrar** | Substituir CSS puro por Tailwind classes; reescrever modais com `UModal`, botoes com `UButton`, formularios com `UForm`; manter virtual scroll manual (nao ha equivalente direto em Nuxt UI) |

### TD-03 — Backend em Python/FastAPI em vez de C# .NET

**Severidade:** Alta (violacao direta do ADR-001)

| Aspecto | Detalhe |
|---------|---------|
| **Estado atual** | Python 3.12 + FastAPI 0.128 + Uvicorn + pandas 3.0 + pyarrow 23 |
| **Padrao esperado** | C# .NET + Clean Architecture + CQRS + MediatR |
| **Impacto** | Runtime diferente dos outros modulos; sem reuso de infraestrutura (MediatR, EF Core, middlewares); dificulta consolidacao operacional |
| **Justificativa** | Pandas/PyArrow entregam manipulacao de Parquet vetorizada com fluencia; portar para C# exigiria re-engineering de calculos criticos |
| **Esforco** | Muito alto (reescrita do backend + scripts de dump) |
| **Trigger para pagar** | Quando o custo operacional de manter dois runtimes (Python + .NET) superar o beneficio de produtividade do pandas; ou quando a fila de JSONL migrar para processamento direto em SQL Server via stored procedures |
| **Como migrar** | Portar `app/routers` → controllers C#; `app/services` + `app/use_cases` → handlers MediatR; `planilha_edital.py` e `geraArquivosImportacao.py` (nucleo pandas) → Python microservico de dados isolado **ou** reescrita com libs .NET (ExcelPackage + ClosedXML para XLSX) e processamento Parquet via `ParquetSharp` / `Parquet.Net` |

### TD-04 — Arquitetura parcialmente alinhada a Clean + CQRS

**Severidade:** Media (evolucao em andamento)

| Aspecto | Detalhe |
|---------|---------|
| **Estado atual** | Routers -> services (legado) OU use_cases (novo, opt-in via `USE_CASES_ENABLED=0` por default); adapters; gateways para scripts legados; `domain/errors.py` |
| **Padrao esperado** | 4 camadas rigidas (Domain, Application, Infrastructure, API) com MediatR handlers |
| **Impacto** | Duplicacao de caminho (legado e novo) durante migracao; 2x testes |
| **Esforco** | Medio (continuar rollout via feature flag) |
| **Como migrar** | (a) converter todos os routers para usar use_cases; (b) deletar `app/gateways/*` e `app/services/*` quando paridade confirmada; (c) ativar `USE_CASES_ENABLED=1` como default; (d) se migrar para .NET (TD-03), reaproveitar essa estrutura como base dos handlers MediatR |

### TD-05 — Banco de dados Supabase Postgres em vez de SQL Server

**Severidade:** Alta (violacao do ADR-003)

| Aspecto | Detalhe |
|---------|---------|
| **Estado atual** | Supabase Postgres acessado via PostgREST HTTP API |
| **Padrao esperado** | Microsoft SQL Server com schemas por dominio |
| **Impacto** | Dois bancos na plataforma; migrations manuais (CI nao aplica SQL); sem reuso de Entity Framework Core |
| **Tabelas afetadas** | `resource_locks`, `import_jobs`, `resource_kind_state`, `resource_kind_switch_log`, `planilha_version_audit` (5 tabelas) |
| **Esforco** | Medio (5 tabelas + migracao de dados operacionais) |
| **Como migrar** | (a) recriar as 5 tabelas em SQL Server com mesmos CHECK constraints e indices; (b) substituir `supabase_db.py` (PostgREST) por DbContext com EF Core; (c) manter o mesmo schema de `resource_key` e campos de auditoria — PostgreSQL `gen_random_uuid()` vira `NEWSEQUENTIALID()` ou `GUID.NewGuid()` do lado da aplicacao |

### TD-06 — Autenticacao Supabase Auth em vez de Acesso Cidadao

**Severidade:** Alta (divergencia de politica institucional)

| Aspecto | Detalhe |
|---------|---------|
| **Estado atual** | Supabase Auth email/senha com JWT validado via JWKS cache |
| **Padrao esperado** | Acesso Cidadao (OpenID Connect do governo do ES) |
| **Impacto** | Usuarios da equipe tecnica precisam de conta separada (nao e SSO); politica de senhas fora do padrao institucional |
| **Esforco** | Baixo-medio (so o endpoint de login e a validacao JWT mudam; restante do pipeline de auth e JWT agnostico) |
| **Como migrar** | (a) substituir `/auth/login` por fluxo OIDC (redirect + callback); (b) manter cookies HttpOnly mas com tokens emitidos pelo Acesso Cidadao; (c) atualizar `SUPABASE_JWKS_URL` e `SUPABASE_JWT_ISSUER` para os endpoints do Acesso Cidadao; (d) mapear `role` claim do novo IDP para `INTERNAL_ALLOWED_ROLES` |

### TD-07 — Autorizacao via role em JWT em vez de AuthRix/OpenFGA

**Severidade:** Media (integracao pendente ja declarada)

| Aspecto | Detalhe |
|---------|---------|
| **Estado atual** | `require_internal_role` valida claim `role` contra `INTERNAL_ALLOWED_ROLES` (default `admin,service_role`) |
| **Padrao esperado** | Consulta a AuthRix (PDP) que usa OpenFGA para decisao |
| **Impacto** | Politicas de autorizacao hardcoded em env vars; sem visibilidade centralizada em M006; divergente de [M006/README.md](../../implementation/modules/M006-autorizacao/README.md) que lista o Importador como consumidor de AuthRix |
| **Esforco** | Baixo (3-5 pontos de verificacao) |
| **Como migrar** | (a) adicionar cliente HTTP para AuthRix; (b) substituir `ensure_internal_role` por `check_authrix(user, action, resource)`; (c) modelar tuplas OpenFGA (`user:X`, `relation: operator_importer`, `object: importer`); (d) manter fallback local para dev |

### TD-08 — Fila de jobs custom em vez de Hangfire

**Severidade:** Baixa-Media

| Aspecto | Detalhe |
|---------|---------|
| **Estado atual** | Tabela `import_jobs` + worker dedicado (`scripts/job_worker.py`) com polling a cada 5s |
| **Padrao esperado** | Hangfire ([ADR-009](../../architecture/adr/ADR-009-hangfire-background-jobs.md)) |
| **Impacto** | Observabilidade propria, sem UI de dashboard de jobs |
| **Esforco** | Medio (acompanha TD-03 se migrar backend para .NET) |
| **Como migrar** | Incluido na migracao do backend; Hangfire e .NET-exclusive. Se manter Python, avaliar Celery/RQ como alternativa no mesmo padrao arquitetural |

### TD-09 — Deploy em Render free em vez de Docker/K8s

**Severidade:** Alta (operacional)

| Aspecto | Detalhe |
|---------|---------|
| **Estado atual** | Render plano free (`render.yaml`) — sleep apos 15 min inatividade, CPU/RAM limitados |
| **Padrao esperado** | Docker + Kubernetes ([ADR-004](../../architecture/adr/ADR-004-infraestrutura-docker-kubernetes.md)) |
| **Impacto** | Nao roda na mesma infraestrutura dos outros modulos; sem HA; endpoints sincronos pesados estouram timeout; cold start apos inatividade |
| **Esforco** | Baixo-medio (containerizacao + Helm chart) |
| **Como migrar** | (a) criar `Dockerfile` multi-stage para o backend; (b) Helm chart com `Deployment`, `Service`, `HPA`; (c) `ConfigMap` para env vars, `Secret` para credenciais; (d) ingress com TLS; (e) migrar worker de jobs como `Deployment` separado |

### TD-10 — Scripts de dump standalone fora do pipeline

**Severidade:** Media

| Aspecto | Detalhe |
|---------|---------|
| **Estado atual** | `scripts/sigfapes_dump_job.py` e `scripts/conecta_dump_job.py` rodam como scripts Python manuais; DAG `SigFapes2Conecta` "pendente de orquestracao" |
| **Padrao esperado** | Jobs agendados em Airflow executando em infraestrutura padrao |
| **Impacto** | Execucao dos dumps hoje depende de disparo manual ou cron externo; nao aparece no monitoramento padrao |
| **Esforco** | Baixo-medio (DAG Airflow) |
| **Como migrar** | (a) empacotar os scripts como Docker images; (b) criar DAG Airflow real chamando os containers via `KubernetesPodOperator`; (c) usar o endpoint ja existente `/internal/airflow/trigger-sigfapes` para disparo manual quando necessario |

### TD-11 — Versionamento S3 manual com prefixo no filename

**Severidade:** Baixa

| Aspecto | Detalhe |
|---------|---------|
| **Estado atual** | Prefixo numerico `<N>_<DD_MM_YYYY>_*.xlsx` como versao |
| **Alternativa padrao** | S3 native versioning OU tabela de versoes no SQL Server |
| **Impacto** | Regex centralizada em `VERSIONED_XLSX_RE` e fragil a refactor de filename; sem rollback nativo |
| **Esforco** | Baixo |
| **Como migrar** | (a) habilitar S3 versioning no bucket; (b) usar `VersionId` como chave; (c) manter `planilha_version_audit` como fonte de verdade humano-legivel; (d) atualizar listagem para filtrar por `VersionId` em vez de parsear filename |

### TD-12 — Feature flags espalhadas em env vars em vez de feature-flag service

**Severidade:** Baixa

| Aspecto | Detalhe |
|---------|---------|
| **Estado atual** | 6 flags em env vars (`LOCKS_ENABLED`, `USE_CASES_ENABLED`, `ASYNC_JOBS_ENABLED`, `AUDIT_DB_ENABLED`, `AUDIT_DB_STRICT`, `LOG_STRUCTURED`) |
| **Alternativa** | Flag management centralizado (ex.: Unleash, GrowthBook) |
| **Impacto** | Mudanca de flag exige redeploy; sem observabilidade de uso |
| **Esforco** | Baixo |
| **Decisao sugerida** | Manter atual ate a plataforma definir um servico padrao de feature flags |

---

## 4. Priorizacao sugerida

| Ordem | Debito | Severidade | Esforco | Valor de negocio | Bloqueadores |
|-------|--------|------------|---------|------------------|--------------|
| 1 | TD-06 Autenticacao Acesso Cidadao | Alta | Baixo-Medio | SSO institucional | — |
| 2 | TD-07 AuthRix | Media | Baixo | Politica centralizada | AuthRix em producao |
| 3 | TD-09 Docker/K8s | Alta | Baixo-Medio | HA, observabilidade | Cluster disponivel |
| 4 | TD-10 Dumps em Airflow | Media | Baixo-Medio | Previsibilidade | DAG `SigFapes2Conecta` |
| 5 | TD-04 Completar Clean Architecture | Media | Medio | Remove caminho legado | — |
| 6 | TD-11 S3 native versioning | Baixa | Baixo | Reduz fragilidade | — |
| 7 | TD-05 SQL Server | Alta | Medio | Consolidacao DB | SQL Server em prod |
| 8 | TD-01 + TD-02 Frontend Vue/Nuxt UI | Alta | Alto | Padronizacao UI | Equipe Vue |
| 9 | TD-03 + TD-08 Backend .NET + Hangfire | Alta | Muito Alto | Consolidacao stack | Reescrita pandas |
| 10 | TD-12 Feature flag service | Baixa | Baixo | Observabilidade | Padrao da plataforma |

**Quick wins (baixo esforco, alto valor):**
- TD-06 Acesso Cidadao
- TD-07 AuthRix
- TD-10 DAG Airflow real
- TD-11 S3 versioning

**Grandes reescritas (adiar ate haver gatilho operacional):**
- TD-01/TD-02 Frontend (reescrita Vue)
- TD-03 Backend (reescrita .NET) — depende de decidir se pandas/pyarrow e substituivel

---

## 5. Caminho incremental recomendado

### Fase 1 — Alinhamento operacional (1-2 trimestres)

1. Containerizar backend + worker com Docker (TD-09 primeira metade)
2. Deploy em cluster K8s compartilhado (TD-09 conclusao)
3. Migrar autenticacao para Acesso Cidadao (TD-06)
4. Orquestrar dumps via DAG Airflow real (TD-10)
5. Habilitar S3 native versioning (TD-11)

**Resultado:** Importador roda na mesma infra, autentica com SSO, e versiona como os outros produtos — sem mexer no codigo de negocio.

### Fase 2 — Convergencia arquitetural (2-3 trimestres)

1. Finalizar rollout `USE_CASES_ENABLED=1` (TD-04)
2. Deletar `app/gateways/*` e `app/services/*` duplicados
3. Integrar AuthRix (TD-07)
4. Migrar tabelas Supabase para SQL Server (TD-05), mantendo backend em Python

**Resultado:** Arquitetura interna limpa, banco consolidado, politicas centralizadas — ainda em Python mas com estrutura que facilita migracao futura.

### Fase 3 — Padronizacao de stack (se houver gatilho)

1. Reescrever frontend em Vue 3 + Nuxt UI (TD-01 + TD-02)
2. Reescrever backend em C# .NET (TD-03) — avaliar se pandas/pyarrow vale manter como microservico de dados isolado
3. Migrar jobs para Hangfire (TD-08)

**Resultado:** 100% no stack padrao. So vale a pena se o produto ganhar escala ou absorver mais casos de uso.

---

## 6. O que NAO e debito

Para evitar esforco desnecessario, listamos itens que parecem divergir do padrao mas estao **corretos** ou sao **vantagens** do stack atual:

| Item | Por que nao e debito |
|------|----------------------|
| MinIO / S3 (boto3) | Alinhado com [ADR-010](../../architecture/adr/ADR-010-minio-armazenamento-objetos.md) |
| Virtual scroll manual | Decisao explicita no ADR-011 — lib externa nao traria beneficio proporcional |
| CSS puro com tokens | OK enquanto houver React; quando migrar para Nuxt UI, usar Tailwind |
| Dump batch em vez de integracao online | Decisao explicita no ADR-011 — SIGFAPES nao suporta carga online |
| Lock pessimista com heartbeat 45s | Decisao explicita no ADR-011 — ciclo de edicao dura dias |
| Arquitetura em 4 camadas (routers/services/adapters) | Similar a Clean Architecture, apenas com nomenclatura Python |

---

## 7. Rastreabilidade

| Debito | ADR violado | Gap local |
|--------|-------------|-----------|
| TD-01, TD-02 | [ADR-002](../../architecture/adr/ADR-002-frontend-vue-nuxtui.md) | Frontend |
| TD-03, TD-04, TD-08 | [ADR-001](../../architecture/adr/ADR-001-backend-csharp-clean-architecture-cqrs.md), [ADR-009](../../architecture/adr/ADR-009-hangfire-background-jobs.md) | Backend |
| TD-05 | [ADR-003](../../architecture/adr/ADR-003-banco-de-dados-sql-server.md) | DB |
| TD-06 | Politica institucional (Acesso Cidadao) | Auth |
| TD-07 | [ADR-007](../../architecture/adr/ADR-007-autorizacao-openfga.md) | Autorizacao |
| TD-09 | [ADR-004](../../architecture/adr/ADR-004-infraestrutura-docker-kubernetes.md) | Infra |

---

## Documentos relacionados

- [ADR-011 — Arquitetura do Importador SIGFAPES](../../architecture/adr/ADR-011-arquitetura-importador-sigfapes.md) (aceita o stack atual)
- [Arquitetura do Importador](architecture.md)
- [Tecnologia do Importador](technology.md)
- [Integracao com Modulos e Dominios](integration.md)
- [ADRs do ConectaFAPES](../../architecture/adr/README.md)
