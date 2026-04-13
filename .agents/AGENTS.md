# Agents - Conecta FAPES

Agent personas and skills for the Conecta FAPES project.

## Agents

| Agent | Description |
|-------|-------------|
| [Product Owner](product-owner/AGENT.md) | Owns the product backlog, writes EPICs with Gherkin US, maintains module documentation |

## Shared Skills

| Skill | Description |
|-------|-------------|
| [DDD](skills/ddd/SKILL.md) | Used by the Product Owner agent to define bounded context, ubiquitous language, invariants, and tactical model consistency when creating or reviewing module documentation |

## Output Directory

- **[`/docs/management/backlog-product.md`](/docs/management/backlog-product.md)** — dashboard central do produto
- **`/docs/implementation/modules/{M00x}/`** — documentacao por modulo

```
docs/
├── architecture/
│   ├── README.md
│   └── adr/
├── implementation/
│   └── modules/
│       └── {M00x-module-name}/
│           ├── README.md                # Indice + Dominio + Regras de Negocio
│           ├── backlog.md               # EPICs + Rastreabilidade + Metricas
│           ├── modelo-estrutural.md     # Diagrama de classes + Dicionario de dados
│           ├── modelo-comportamental.md # Diagramas de estado
│           └── epics/
│               └── EPIC-M00x-NNN.md    # Contexto + US com Gherkin
└── management/
    └── backlog-product.md
```
