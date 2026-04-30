# Repositorio Conecta FAPES

Plataforma digital da FAPES para gestao do ciclo completo de fomento a pesquisa, desenvolvimento e inovacao no Espirito Santo.

## Links Rapidos

- **Board do Projeto:** [Conecta Fapes (GitHub Project #43)](https://github.com/orgs/leds-conectafapes/projects/43)
- **Documentacao:** [docs/README.md](docs/README.md)
- **Sprint Atual:** [SPRINT-007](docs/management/sprints/SPRINT-007.md)
- **Backlog do Produto:** [backlog-product.md](docs/management/backlog-product.md)

## Premissas Nao Negociaveis do Projeto

> **Todo codigo entregue DEVE ter testes unitarios e testes de integracao.**
>
> - Testes unitarios cobrindo regras de negocio documentadas
> - Testes de integracao cobrindo fluxos end-to-end (endpoint → persistencia → resposta)
> - Cobertura validada em CI antes do merge
> - PRs sem testes serao automaticamente reprovados
>
> Aplica-se a **todas as entregas de codigo** em qualquer modulo, produto ou sprint. Ver [Definition of Ready/Done](docs/management/definition-of-ready-done.md).

---

## Estrutura de Pastas

```
conectafapes-project/
├── docs/
│   ├── discovery/              # POR QUE — visao do produto, personas, domains
│   │   ├── product-vision.md
│   │   ├── personas.md
│   │   └── domains/            # Um arquivo por domain de negocio (01-08)
│   ├── architecture/           # COMO — decisoes tecnicas de arquitetura
│   │   ├── README.md           # Visao geral, stack, diagramas C4
│   │   └── adr/                # Architecture Decision Records (ADR-001 a ADR-010)
│   ├── implementation/         # O QUE construir — modulos backend (bounded contexts)
│   │   └── modules/            # 20 modulos (M001-M020), cada um com:
│   │       └── M00x/           #   README, contrato, backlog, modelo-estrutural,
│   │                           #   modelo-comportamental, contrato-api, epics/
│   ├── products/               # PARA QUEM — canais de entrega (frontends)
│   │   ├── portal-coordenador/ #   Portal do coordenador de projeto
│   │   ├── portal-admin/       #   Portal administrativo da agencia
│   │   └── importador/         #   Importacao de dados do SIGFAPES
│   ├── management/             # QUANDO — roadmap, milestones, sprints, debito tecnico
│   │   ├── backlog-product.md  #   Dashboard central por modulo
│   │   ├── milestones.md       #   Marcos de entrega por domain
│   │   ├── roadmap.md          #   Entregas por trimestre e produto
│   │   ├── technical-debt.md   #   Indice consolidado de debito tecnico
│   │   └── sprints/            #   Iteracoes time-boxed
│   └── deprecated/             # LEGADO — documentacao migrada (referencia historica)
│       ├── pagamento-bolsista/ #   → implementation/modules/M004
│       ├── portal-fapes/       #   → products/portal-coordenador
│       └── prestacao-de-contas/#   → implementation/modules/M014
├── prototype/                  # Prototipos navegaveis da aplicacao
│   └── backoffice/             # Prototipo do backoffice (React + Vite)
├── .github/                    # Templates de issues e pull requests
├── documentation/              # Documentacao publicada (Docusaurus)
└── tools/                      # Ferramentas internas do time
```

---

## Conceitos-Chave

### Domain vs Modulo vs Produto

| Conceito | Responde a | Onde vive | Exemplo |
|----------|-----------|-----------|---------|
| **Domain** | O que o sistema faz (capacidade de negocio) | `docs/discovery/domains/` | Domain 05 — Financeiro |
| **Modulo** | Como sera implementado (bounded context) | `docs/implementation/modules/` | M004 — Pagamento de Bolsistas |
| **Produto** | Para quem (canal de entrega frontend) | `docs/products/` | Portal Coordenador |

O macro-sprint e planejado por **domain**. O backlog detalhado (epics, tasks) vive dentro do **modulo**. O **produto** e um frontend que consome multiplos modulos e documenta jornadas de usuario e cenarios de UX.

### Hierarquia de Planejamento

```
Roadmap       → sequencia de domains (longo prazo)
  └─ Milestone  → marco de entrega agrupando domains (meses)
       └─ Sprint  → iteracao time-boxed com features de releases-2026.csv (2 semanas)
            └─ Feature do Produto → indice que aponta para EPICs dos modulos
                 └─ EPIC do Modulo → cenarios Gherkin e user stories
```

---

## Documentacao

### Produto e Negocio

| Documento | Descricao |
|-----------|-----------|
| [Visao do Produto](docs/discovery/product-vision.md) | Personas, mapa de domains e regras de negocio transversais |
| [Personas](docs/discovery/personas.md) | 17 personas com rastreabilidade por domain e modulo |
| [Backlog do Produto](docs/management/backlog-product.md) | Dashboard central: dor, capacidade, KPI e % desenvolvimento por modulo |

### Produtos (Frontends)

| Produto | Descricao | Documentacao |
|---------|-----------|--------------|
| Portal Coordenador | Portal web do coordenador de projeto e bolsista | [README](docs/products/portal-coordenador/README.md) |
| Portal Admin | Portal administrativo da agencia (back-office) | [README](docs/products/portal-admin/README.md) |
| Importador | Importacao de dados do SIGFAPES | [README](docs/products/importador/README.md) |

### Arquitetura

| Documento | Descricao |
|-----------|-----------|
| [Visao Geral](docs/architecture/README.md) | Stack tecnologico, diagramas C4, integracoes externas |
| [ADRs](docs/architecture/adr/README.md) | 10 decisoes de arquitetura registradas (ADR-001 a ADR-010) |

### Gestao

| Documento | Descricao |
|-----------|-----------|
| [Roadmap](docs/management/roadmap.md) | Entregas por trimestre e produto |
| [Milestones](docs/management/milestones.md) | 5 marcos de entrega agrupando domains |
| [Sprints](docs/management/sprints/) | 6 sprints Q2 2026 com features vinculadas a modulos |
| [Debito Tecnico](docs/management/technical-debt.md) | 30 itens rastreados em 8 areas |

### Modulos (Backend)

| ID | Modulo | % | Documentacao |
|----|--------|---|--------------|
| M001 | Modalidades de Bolsas | 0% | [README](docs/implementation/modules/M001-modalidade-bolsa/README.md) |
| M002 | Importacao SIGFAPES | 100% | [README](docs/implementation/modules/M002-importacao-editais/README.md) |
| M003 | Gestao de Iniciativas Captadas | 100% | [README](docs/implementation/modules/M003-gestao-iniciativas-captadas/README.md) |
| M004 | Pagamento de Bolsistas | 100% | [README](docs/implementation/modules/M004-pagamento-bolsista/README.md) |
| M005 | Autenticacao | — | [README](docs/implementation/modules/M005-autenticacao/README.md) |
| M006 | Autorizacao | — | [README](docs/implementation/modules/M006-autorizacao/README.md) |
| M007 | API Gateway | — | [README](docs/implementation/modules/M007-api-gateway/README.md) |
| M008 | Cadastros Corporativos | 0% | [README](docs/implementation/modules/M008-cadastros-corporativos/README.md) |
| M009 | Gestao Bolsa Pesquisa | 0% | [README](docs/implementation/modules/M009-gestao-bolsista/README.md) |
| M010 | Planejamento e Estrategia | 0% | [README](docs/implementation/modules/M010-planejamento-estrategia/README.md) |
| M011 | Configuracao de Captacao | 0% | [README](docs/implementation/modules/M011-configuracao-captacao/README.md) |
| M012 | Acompanhamento e Resultados | 0% | [README](docs/implementation/modules/M012-acompanhamento-resultados/README.md) |
| M013 | Gestao Orcamentaria | 0% | [README](docs/implementation/modules/M013-gestao-orcamentaria-projeto/README.md) |
| M014 | Prestacao de Contas | 62% | [README](docs/implementation/modules/M014-prestacao-contas/README.md) |
| M015 | Suspensao e Finalizacao | 0% | [README](docs/implementation/modules/M015-suspensao-finalizacao/README.md) |
| M016 | Contabilidade e Financeiro | 0% | [README](docs/implementation/modules/M016-contabilidade-financeiro/README.md) |
| M017 | PLD | 0% | [README](docs/implementation/modules/M017-prevencao-lavagem-dinheiro/README.md) |
| M018 | Business Intelligence | 0% | [README](docs/implementation/modules/M018-business-intelligence/README.md) |
| M019 | Transparencia e Auditoria | 0% | [README](docs/implementation/modules/M019-transparencia-auditoria/README.md) |
| M020 | Comunicacao | 0% | [README](docs/implementation/modules/M020-comunicacao/README.md) |

---

## Prototipos

A pasta `prototype/` concentra os prototipos navegaveis da aplicacao.

| Caminho | Objetivo |
|---------|----------|
| [prototype/backoffice](prototype/backoffice) | Prototipo do backoffice (React + Vite) |
| [prototype/frontOfiice](prototype/frontOfiice) | Prototipo do front-office (React + Vite) |
| [Figma Front-office](https://rate-snort-02856207.figma.site/) | Prototipo do portal do coordenador |
| [Figma Back-office](https://bucket-lake-78647159.figma.site/) | Prototipo do portal administrativo |
| [Vercel Front-office](https://portal-fapes-frontoffice.vercel.app/) | Deploy navegavel do prototipo front-office |
| [Vercel Back-office](https://backoffice-beta-ten.vercel.app/) | Deploy navegavel do prototipo administrativo |

---

## Gestao de Issues

| Template | Uso |
|----------|-----|
| `BUG TEMPLATE` | Erros ou comportamentos inesperados no sistema |
| `FEATURE TEMPLATE` | Novas funcionalidades com valor entregavel |
| `TASK TEMPLATE` | Tarefas tecnicas ou administrativas individuais |

Toda entrega deve estar associada a um Pull Request. Mantenha descricoes claras e responsaveis atribuidos.
