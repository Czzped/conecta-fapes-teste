# Agents - Conecta FAPES

Agent personas and skills for the Conecta FAPES project.

## Agents

| Agent | Description |
|-------|-------------|
| [Product Owner](product-owner/AGENT.md) | Owns the product backlog, writes EPICs with Gherkin US, maintains module documentation |

## Output Directory

- **[`/docs/backlog-product.md`](/docs/backlog-product.md)** — dashboard central do produto
- **`/docs/modules/{M00x}/`** — documentacao por modulo

```
docs/
├── backlog-product.md
├── architecture/
│   ├── README.md
│   └── adr/
└── modules/
    └── {M00x-module-name}/
        ├── README.md                # Indice + Dominio + Regras de Negocio
        ├── backlog.md               # EPICs + Rastreabilidade + Metricas
        ├── modelo-estrutural.md     # Diagrama de classes + Dicionario de dados
        ├── modelo-comportamental.md # Diagramas de estado
        └── epics/
            └── EPIC-M00x-NNN.md    # Contexto + US com Gherkin
```
