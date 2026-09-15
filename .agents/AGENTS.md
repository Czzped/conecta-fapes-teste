# Agents - Conecta FAPES

Agent personas and skills for the Conecta FAPES project.

## Agents

| Agent | Description |
|-------|-------------|
| [Product Owner](product-owner/AGENT.md) | Owns the product backlog, writes EPICs with Gherkin US, maintains module documentation |

## Shared Skills (proprias do projeto, com frontmatter)

| Skill | Description |
|-------|-------------|
| [DDD](skills/ddd/SKILL.md) | Used by the Product Owner agent to define bounded context, ubiquitous language, invariants, and tactical model consistency when creating or reviewing module documentation |
| [Nielsen Heuristics](skills/nielsen-heuristics/SKILL.md) | Evaluate or design UI against Nielsen's 10 usability heuristics. Use when reviewing screens before merge, auditing complex forms, inspecting error messages, or evaluating multi-step flows (payment, reporting, scholarship management) |
| [Observability](skills/observability/SKILL.md) | Used by the Product Owner agent to define each module's observability contract — eventos/variaveis a monitorar em SigNoz/Prometheus/Grafana, metricas, SLIs/SLOs, alertas e tracing no codigo. Produz o artefato padrao `monitoramento.md` |

## Skills Globais em Uso no Projeto

> Ver [**SKILLS.md**](SKILLS.md) — catalogo das skills globais (instaladas em `~/.agents/skills/`) relevantes ao stack do projeto (C#/.NET, Vue/Nuxt, Playwright, xUnit, etc.).
> Esse catalogo e documentacao humana; as skills ja estao registradas globalmente e disponiveis automaticamente para o Claude.

## Output Directory

- **[`/docs/management/backlog-product.md`](/docs/management/backlog-product.md)** — dashboard central do produto
- **`/docs/implementation/modules/{M00x}/`** — documentacao por modulo
- **[`/test-cases/MAPA-QA-GLOBAL.md`](/test-cases/MAPA-QA-GLOBAL.md)** — matriz global de QA, rotas, regras de negócio e relatos de bugs (Frontoffice e Backoffice)

## 🛡️ Diretrizes Críticas para Agentes de QA / Testes

1. **Repositórios de Código são ESTRITAMENTE READ-ONLY:**
   - Diretórios de código real como `leds-conectafapes-frontoffice-frontend-develop/` são **apenas para consulta e inspeção**.
   - **NUNCA modifique, crie, renomeie ou delete arquivos nesses diretórios.**
2. **Fontes de Verdade Cruzadas para Testes e Bugs:**
   - **Código Real:** inspecionar formulários, componentes Vue, validações Zod, rotas, payloads de API, máscaras e tratamento de erros reais.
   - **Regras Canônicas de Negócio:** consultar `docs/implementation/modules/M0xx/` e [`test-cases/MAPA-QA-GLOBAL.md`](test-cases/MAPA-QA-GLOBAL.md).
3. **Escrita Exclusiva em `/test-cases/`:**
   - Todo e qualquer caso de teste (`CT-*.md`) ou bug report (`BUG-*.md`) gerado deve ser salvo exclusivamente na pasta `/test-cases/` seguindo os templates em [`test-cases/referencias/`](test-cases/referencias/).


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
