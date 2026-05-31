# Debito Tecnico — ConectaFAPES

Indice consolidado de debitos tecnicos identificados nos modulos do projeto. Cada modulo mantem seu debito detalhado no proprio `backlog.md`; este documento fornece a visao executiva.

[← Voltar ao Management](README.md)

---

## Como usar este documento

1. Cada modulo registra seus itens de debito tecnico na secao "Debito Tecnico" do proprio `backlog.md`.
2. Este documento indexa os itens de todos os modulos com prioridade e status consolidados.
3. Ao planejar sprints, consulte este indice para selecionar itens de debito que devem entrar na iteracao.
4. Ao resolver um item, atualize o status **no backlog do modulo** (fonte de verdade) e depois neste indice.

## Categorias

| Categoria | Descricao |
|-----------|-----------|
| **DDD/Modularidade** | Violacoes de bounded context, aggregates, ownership, domain events |
| **Infraestrutura** | Acoplamento a tecnologias especificas, vazamento no dominio |
| **Documentacao** | Modelo incompleto, artefatos desatualizados, informacao ambigua |
| **Codigo** | Refatoracoes, testes ausentes, acoplamento no codigo-fonte |

---

## Indice por Modulo

### M004 — Pagamento de Bolsistas

**Analise de referencia:** [analise-ddd-modularidade.md](../implementation/modules/M004-pagamento-bolsista/specifications/analise-ddd-modularidade.md)
**Backlog detalhado:** [M004/backlog.md](../implementation/modules/M004-pagamento-bolsista/backlog.md#debito-tecnico)

| ID | Titulo | Categoria | Prioridade | Status |
|----|--------|-----------|------------|--------|
| DT-M004-001 | Identificar Aggregate Roots e fronteiras transacionais | DDD/Modularidade | Alta | To Do |
| DT-M004-002 | Resolver ownership de AlocacaoBolsista (entidade local vs Shared Kernel) | DDD/Modularidade | Alta | To Do |
| DT-M004-003 | Formalizar Domain Events no contrato | DDD/Modularidade | Alta | To Do |
| DT-M004-004 | Remover ciclo de vida de AlocacaoBolsista do modelo comportamental | Documentacao | Media | To Do |
| DT-M004-005 | Classificar Value Objects (DecisaoLiberacao, DecisaoFolha, Erros) | DDD/Modularidade | Media | To Do |
| DT-M004-006 | Abstrair referencias a infraestrutura no modelo de dominio | Infraestrutura | Media | To Do |
| DT-M004-007 | Marcar Usuario como fora do escopo ou criar VO local | DDD/Modularidade | Baixa | To Do |
| DT-M004-008 | Documentar relacao de Contratante com Remessa | Documentacao | Baixa | To Do |
| DT-M004-009 | Documentar estrategia de campos computados em EditalCompetencia | Documentacao | Baixa | To Do |

---

### M003 — Gestao de Iniciativas Captadas

**Backlog detalhado:** [M003/backlog.md](../implementation/modules/M003-gestao-projetos-captados/backlog.md)

| ID | Titulo | Categoria | Prioridade | Status |
|----|--------|-----------|------------|--------|
| DT-M003-001 | Backlog sem EPICs — spec completa (README, contrato, modelo) mas 0 EPICs definidos. Criar EPICs a partir das 5 operacoes do contrato e mapear o que ja existe no codigo como Done | Documentacao | Media | To Do |
| DT-M003-002 | Link de especificacao antigo — backlog.md referencia `/documentation/docs/modulos/06_gerenciar_editais/` (path legado inexistente) | Documentacao | Baixa | To Do |

---

### Portal Coordenador

**Backlog detalhado:** A ser criado em [products/portal-coordenador/](../products/portal-coordenador/README.md)

| ID | Titulo | Categoria | Prioridade | Status |
|----|--------|-----------|------------|--------|
| DT-PORTAL-001 | Fragmentar domain-entities.md monolitico — entidades devem estar nos modelo-estrutural.md dos modulos donos | DDD/Modularidade | Alta | To Do |
| DT-PORTAL-002 | Depreciar architecture-backend.md duplicado do portal-fapes | Documentacao | Media | Done |
| DT-PORTAL-003 | Vincular features do portal aos modulos backend correspondentes | Documentacao | Media | Done |
| DT-PORTAL-004 | Vincular backlog do portal ao roadmap/releases do management | Documentacao | Baixa | Done |

---

---

### M014 — Prestacao de Contas

**Backlog detalhado:** [M014/backlog.md](../implementation/modules/M014-prestacao-contas/backlog.md#debito-tecnico)

| ID | Titulo | Categoria | Prioridade | Status |
|----|--------|-----------|------------|--------|
| DT-M014-001 | Entidades financeiras (ContaBancaria, Orcamento, ContaContabil, TransacaoFinanceira) pertencem a M016/M013 mas estao no backend M014 | DDD/Modularidade | Alta | To Do |
| DT-M014-002 | Maquina de estados implementada (5 estados) diverge da spec (11 estados) — alinhar progressivamente | Documentacao | Alta | To Do |
| DT-M014-003 | Backend separado (ConectaFapes.PrestacaoContas.*) — documentar como ADR ou planejar unificacao | Infraestrutura | Media | To Do |
| DT-M014-004 | Integrar SERPRO como dependencia formal no contrato | Documentacao | Media | Done |

---

## Consolidado

### Arquitetura (transversal)

| ID | Titulo | Categoria | Prioridade | Status |
|----|--------|-----------|------------|--------|
| DT-ARCH-001 | ADRs faltantes — OpenFGA, backend M014, MinIO, Hangfire | Documentacao | Alta | Done (ADR-007 a ADR-010) |
| DT-ARCH-002 | ADR-005 (BFF) status inconsistente entre ADR e 02-modulos | Documentacao | Media | Done |
| DT-ARCH-005 | Implementar BFF Coordenador — composicao de telas multi-modulo (ADR-005) | Infraestrutura | Alta | To Do |
| DT-ARCH-006 | Implementar BFF Admin — composicao de telas multi-modulo (ADR-005) | Infraestrutura | Media | To Do |
| DT-ARCH-003 | ValidaAI (servico de validacao por IA) documentado em 04-dados-e-operacao.md — contrato e SLA pendentes | Documentacao | Baixa | Parcial |
| DT-ARCH-004 | M005, M006, M007 (IAM) com placeholder em implementation/ — spec completa pendente | Documentacao | Alta | Parcial |

### Management (transversal)

| ID | Titulo | Categoria | Prioridade | Status |
|----|--------|-----------|------------|--------|
| DT-MGMT-001 | Sprints sem vinculo a modulos — features sem modulo atribuido | Documentacao | Media | Done |
| DT-MGMT-002 | Features do roadmap Q2 sem referencia a modulos — sprints ja corrigidos, roadmap.md pendente | Documentacao | Baixa | Parcial |

### Produtos

| ID | Titulo | Categoria | Prioridade | Status |
|----|--------|-----------|------------|--------|
| DT-PROD-001 | Portal Admin em producao sem documentacao completa (backlog parcial criado, features e architecture pendentes) | Documentacao | Media | Parcial |
| DT-PROD-002 | Importador entregue (roadmap Q1) — backlog basico criado, features detalhadas pendentes | Documentacao | Baixa | Parcial |

### Pastas Legadas

| ID | Titulo | Categoria | Prioridade | Status |
|----|--------|-----------|------------|--------|
| DT-LEGACY-001 | 39 feature files em pastas depreciadas — notas de depreciacao adicionadas | Documentacao | Baixa | Done |

---

## Consolidado

| Area | Alta | Media | Baixa | Total | % Resolvido |
|------|------|-------|-------|-------|-------------|
| M003 | 0 | 1 | 1 | 2 | 50% |
| M004 | 3 | 3 | 3 | 9 | 0% |
| M014 | 2 | 2 | 0 | 4 | 25% |
| Portal Coordenador | 1 | 2 | 1 | 4 | 75% |
| Arquitetura | 3 | 2 | 1 | 6 | 67% |
| Management | 0 | 1 | 1 | 2 | 75% |
| Produtos | 0 | 1 | 1 | 2 | 50% |
| Pastas Legadas | 0 | 0 | 1 | 1 | 100% |
| **Total** | **9** | **12** | **9** | **30** | **47%** |

> Outros modulos ainda nao possuem analise de debito tecnico. A medida que forem analisados, seus itens devem ser adicionados a este indice seguindo o mesmo formato.
