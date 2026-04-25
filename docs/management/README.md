# Management — ConectaFAPES

Artefatos de planejamento e acompanhamento do produto. Responde a **quando** e **em que ordem** o produto e entregue.

[← Voltar ao README do projeto](../../README.md)

---

## Hierarquia de Planejamento

```
Roadmap       → sequencia de domains (longo prazo — produto inteiro)
  └─ Milestone  → marco de entrega agrupando domains (medio prazo — meses)
       └─ Sprint  → iteracao time-boxed com epics selecionados (curto prazo — 2 semanas)
            └─ Epic → detalhe tecnico em implementation/modules/
                 └─ User Story → dentro do epic
```

Cada nivel responde a uma pergunta diferente:

| Artefato | Pergunta | Horizonte |
|----------|----------|-----------|
| Roadmap | Em que ordem entregamos os domains? | Produto inteiro |
| Milestone | O que precisa estar pronto neste marco? | Meses |
| Sprint | O que o time entrega nesta iteracao? | 2 semanas |
| Epic | Qual capacidade o modulo precisa ter? | Semanas |
| User Story | O que o usuario consegue fazer? | Dias |

---

## Sprints referenciam Domains, nao Modulos

Um sprint nao pertence a um modulo — ele referencia epics de **multiplos domains** que o time executara naquela iteracao. O domain e a unidade de leitura do sprint (capacidade de negocio entregue); o modulo e apenas o endereco tecnico onde o epic mora.

```
SPRINT-001.md
  └─ Domain 01 — Corporativo e Administrativo
       ├─▶ EPIC-M001-001  (implementado pelo modulo M001)
       ├─▶ EPIC-M005-001  (implementado pelo modulo M005)
       └─▶ EPIC-M007-001  (implementado pelo modulo M007)
  └─ Domain 07 — Importacao SIGFAPES        (paralelo ao Domain 01)
       └─▶ EPIC-M002-001  (implementado pelo modulo M002)
```

Quem le o sprint entende a **capacidade de negocio** sendo entregue — nao a estrutura tecnica.

O fluxo completo de referencia:

```
management/sprints/SPRINT-001.md
    │
    ├──▶ implementation/modules/M001/epics/EPIC-M001-001.md
    │         └─▶ User Stories (dentro do epic)
    │
    └──▶ implementation/modules/M005/epics/EPIC-M005-001.md
              └─▶ User Stories (dentro do epic)
```

---

## Rastreabilidade com GitHub

Todos os artefatos de execucao vivem como **issues no GitHub**. Os documentos markdown descrevem o contexto e o criterio de aceite; o GitHub rastreia o progresso.

### Hierarquia de issues

```
GitHub Milestone (MS-01 Base Operacional)
  └─ Issue #10 [epic]         EPIC-M001-001 — Cadastro de Resolucoes
       └─ Issue #11 [user-story]  US-M001-001 — Incluir Resolucao
       │    └─ Issue #12 [task]       Task: criar endpoint POST /resolucoes
       │    └─ Issue #13 [task]       Task: criar tela de cadastro
       └─ Issue #14 [user-story]  US-M001-002 — Listar Resolucoes
```

### Labels obrigatorias

| Label | Uso |
|-------|-----|
| `epic` | Issue que representa um epic — referencia o arquivo markdown do epic |
| `user-story` | Issue que representa uma US — referencia o epic pai via `parte de #NNN` |
| `task` | Issue tecnica filha de uma US — referencia a US via `parte de #NNN` |

### Rastreabilidade no markdown

Cada epic documenta seu numero de issue no cabecalho:

```markdown
| **GitHub Issue** | #NNN |
| **Milestone**    | MS-XX |
```

Cada US na tabela do epic inclui o numero da issue:

```markdown
| US-M001-001 | Incluir Resolucao | Must | #11 | To Do |
```

### Sprint e Milestone no GitHub

- Cada **Milestone** (MS-01, MS-02…) e criado como um **GitHub Milestone**
- Todas as issues (epics, US, tasks) do milestone recebem o milestone correspondente
- O sprint nao tem equivalente nativo no GitHub — use labels `sprint-001`, `sprint-002` nas issues do sprint corrente

---

## Indice

| Arquivo | Descricao | Fonte de verdade |
|---------|-----------|-----------------|
| [backlog-product.md](backlog-product.md) | Dominios, modulos, capacidades e backlog futuro | Sim — definicao do produto |
| [milestones/](milestones/README.md) | Marcos de entrega agrupando domains | Sim — referencia backlog-product.md |
| [roadmap.md](roadmap.md) | Visao operacional de entregas por trimestre e produto | Derivado de releases-2026.csv |
| [releases-2026.csv](releases-2026.csv) | Dados brutos de entregas 2026 (produto, feature, status, dominio, modulo) | Sim — fonte do roadmap.md |
| [sprints/](sprints/) | Um arquivo por sprint, referenciando features de releases-2026.csv | Sim — execucao do sprint |
| [deliveries.md](deliveries.md) | Entregas comprometidas por sprint, organizadas por mes | Derivado dos sprints |
| [technical-debt.md](technical-debt.md) | Indice consolidado de debito tecnico de todos os modulos | Derivado dos backlogs dos modulos |

## Relacao entre os arquivos

```
backlog-product.md          → define dominios e modulos
    │
    ├──▶ milestones/README.md      → agrupa domains em marcos de entrega
    │         │
    │         └──▶ sprints/ → executa epics de implementation/modules/
    │
    ├──▶ releases-2026.csv  → rastreia entregas operacionais 2026 por produto
    │         │
    │         └──▶ roadmap.md  → visao markdown de releases-2026.csv (leitura/navegacao)
    │
    └──▶ technical-debt.md  → indexa debito tecnico dos modulos (fonte: backlog de cada modulo)
```

> **Regra de ouro:** `releases-2026.csv` e a fonte de verdade do calendario de entregas.
> Ao atualizar status ou adicionar features, edite o CSV — o `roadmap.md` deve refletir o CSV.

## Sprints Q2 2026

| Sprint | Periodo | Milestone | Goal |
|--------|---------|-----------|------|
| [SPRINT-001](sprints/SPRINT-001.md) | 2026-04-13 a 2026-04-24 | MS-03 | Prestacao de Contas completo e Portal do Coordenador em producao |
| [SPRINT-002](sprints/SPRINT-002.md) | 2026-04-27 a 2026-05-08 | MS-02 | Gestao de Parcerias, Programas e Planejamento Estrategico |
| [SPRINT-003](sprints/SPRINT-003.md) | 2026-05-11 a 2026-05-22 | MS-03 | Aditivos e gestao de bolsistas (Eduardo) |
| [SPRINT-004](sprints/SPRINT-004.md) | 2026-05-25 a 2026-06-05 | MS-03 / MS-02 | Prazos excepcionais, fluxo de submissao e escalonamento de projetos |
| [SPRINT-005](sprints/SPRINT-005.md) | 2026-06-08 a 2026-06-19 | MS-04 | Operacoes financeiras avancadas, expansao UNAC e consultas financeiras |
| [SPRINT-006](sprints/SPRINT-006.md) | 2026-06-22 a 2026-06-30 | MS-05 / MS-01 | Encerramento Q2: suporte operacional NUTIC e itens transferidos do Q1 |
| [SPRINT-007](sprints/SPRINT-007.md) | 2026-04-21 a 2026-05-02 | MS-01 / MS-02 / MS-03 | Parcerias (M008+M010), Prestacao de Contas (M014) e Captacao (M011) |

## Templates

| Template | Descricao |
|----------|-----------|
| [template-sprint.md](sprints/template-sprint.md) | Template para criacao de novos sprints |
