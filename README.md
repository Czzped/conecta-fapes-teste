# Repositorio Conecta FAPES

Plataforma digital da FAPES para gestao do ciclo completo de fomento a pesquisa, desenvolvimento e inovacao no Espirito Santo.

---

## Estrutura de Pastas

```
conectafapes-project/
├── docs/
│   ├── discovery/          # O que construir — visao do produto, domains e regras de negocio
│   │   ├── product-vision.md
│   │   └── domains/        # Um arquivo por domain de negocio
│   ├── architecture/       # Como construir — decisoes tecnicas de arquitetura
│   │   ├── README.md       # Visao geral, stack, diagramas C4
│   │   └── adr/            # Architecture Decision Records
│   ├── implementation/     # Implementacao — backlog, epics e modelos por modulo
│   │   ├── backlog-product.md
│   │   └── modules/        # Um diretorio por modulo (M001, M002, ...)
│   └── management/         # Quando e em que ordem — roadmap e planejamento de sprints
│       └── roadmap.md
├── .github/                # Templates de issues e pull requests
├── documentation/          # Documentacao publicada (Docusaurus)
└── tools/                  # Ferramentas internas do time
```

---

## Domain vs Modulo

Dois conceitos complementares usados para organizar o produto:

**Domain** e uma capacidade de negocio — define *o que* o sistema precisa fazer do ponto de vista da FAPES. E a unidade de discovery e de planejamento de macro-sprints. Exemplo: *Fomento Pre-Award* engloba tudo desde a publicacao do edital ate a contratacao da iniciativa.

**Modulo** e a unidade de implementacao — define *como* aquela capacidade sera construida em codigo. Um domain pode ser implementado por um ou mais modulos. Exemplo: o Domain 01 (Corporativo) e implementado pelos modulos M001, M005, M006 e M007.

| Conceito | Responde a | Onde vive |
|----------|-----------|-----------|
| Domain | O que o sistema faz | `docs/discovery/domains/` |
| Modulo | Como sera implementado | `docs/implementation/modules/` |

O macro-sprint e planejado por **domain**. O backlog detalhado (epics, tasks) vive dentro do **modulo**.

---

## Documentacao

| Secao | Descricao |
|-------|-----------|
| [Visao do Produto](docs/discovery/product-vision.md) | Personas, mapa de domains e regras de negocio transversais |
| [Roadmap](docs/management/roadmap.md) | Sequencia de entrega por domain e dependencias |
| [Arquitetura](docs/architecture/README.md) | Stack tecnologico, diagramas C4 e integracoes externas |
| [ADRs](docs/architecture/adr/README.md) | Decisoes de arquitetura registradas |
| [Backlog do Produto](docs/implementation/backlog-product.md) | Dashboard central por modulo |

---

## Gestao de Issues

| Template | Uso |
|----------|-----|
| `BUG TEMPLATE` | Erros ou comportamentos inesperados no sistema |
| `FEATURE TEMPLATE` | Novas funcionalidades com valor entregavel |
| `TASK TEMPLATE` | Tarefas tecnicas ou administrativas individuais |

Toda entrega deve estar associada a um Pull Request. Mantenha descricoes claras e responsaveis atribuidos.
