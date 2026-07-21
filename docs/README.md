# Conecta FAPES - Documentacao

Plataforma digital da agencia de fomento para gestao do ciclo completo de fomento a pesquisa, desenvolvimento e inovacao.

> 🗺️ **[Mapa de Capacidades](mapa-capacidades.md)** — grafo interativo dos 24 modulos: importancia, impacto e como cada um habilita os demais. [Abrir em tela cheia](assets/mapa-capacidades.html).

## Prototipos

| Prototipo | Link |
|-----------|------|
| Front-office | [https://frontoffice-conecta.vercel.app/](https://frontoffice-conecta.vercel.app/) |
| Back-office | [https://backoffice-conecta.vercel.app/](https://backoffice-conecta.vercel.app/) |

## GitHub Project Board

**[Conecta Fapes (Board #43)](https://github.com/orgs/leds-conectafapes/projects/43)** — Ver [detalhes](management/github-project.md)

## Premissa Nao Negociavel

> **Todo codigo entregue DEVE ter testes unitarios e testes de integracao.** Ver [Definition of Ready/Done](management/definition-of-ready-done.md).

## Produto

| Documento | Descricao |
|-----------|-----------|
| [Visao do Produto](discovery/product-vision.md) | Funcionalidades, personas, dominios e fundamentacao legal |
| [Backlog do Produto](management/backlog-product.md) | Dashboard central com dor, capacidade, KPI e percentual de desenvolvimento por modulo |

## Gestao

| Documento | Descricao |
|-----------|-----------|
| [Management](management/README.md) | Hierarquia de planejamento: roadmap, milestones e sprints |
| [Roadmap](management/roadmap.md) | Sequencia de entrega por domain e dependencias |
| [Milestones](management/milestones/README.md) | Marcos de entrega agrupando domains |
| [Sprints](management/sprints/SPRINT-007.md) | Iteracoes time-boxed com epics por domain |

## Arquitetura

| Documento | Descricao |
|-----------|-----------|
| [Visao Geral](architecture/README.md) | Contexto do sistema, stack tecnologica, integracoes e operacao |
| [ADRs](architecture/adr/README.md) | Decisoes de arquitetura registradas |

> **Nota:** A pasta `documentation_old/` na raiz do repositorio e uma versao antiga da documentacao e nao deve ser utilizada como referencia. A pasta `docs/deprecated/` contem documentacao legada migrada (`pagamento-bolsista`, `portal-fapes`, `prestacao-de-contas`) — consulte `products/` e `implementation/modules/` para a documentacao atual.

## Produtos

Canais de entrega frontend que compoem funcionalidades de multiplos modulos backend.

| Produto | Descricao | Documentacao |
|---------|-----------|--------------|
| Portal Coordenador | Portal web do coordenador de projeto e bolsista | [README](products/portal-coordenador/README.md) |
| Portal Admin | Portal administrativo da agencia (back-office) | [README](products/portal-admin/README.md) |
| Importador | Importacao de dados do SIGFAPES | [README](products/importador/README.md) |
| AuthRix | Sistema interno de autorizacao (OpenFGA) | [README](products/authrix/README.md) |

## Modulos

| ID | Modulo | Documentacao |
|----|--------|--------------|
| M001 | Modalidades de Bolsas | [README](implementation/modules/M001-modalidade-bolsa/README.md) |
| M002 | Importacao de Editais | [README](implementation/modules/M002-importacao-editais/README.md) |
| M003 | Gestao de Iniciativas Captadas | [README](implementation/modules/M003-gestao-projetos-captados/README.md) |
| M004 | Pagamento de Bolsistas | [README](implementation/modules/M004-pagamento-bolsista/README.md) |
| M005 | Autenticacao e Auditoria | A definir |
| M006 | Autorizacao | A definir |
| M007 | API Gateway | A definir |
| M008 | Cadastros Corporativos | [README](implementation/modules/M008-cadastros-corporativos/README.md) |
| M009 | Gestao Bolsa Pesquisa | [README](implementation/modules/M009-gestao-bolsista/README.md) |
| M010 | Planejamento e Estrategia | [README](implementation/modules/M010-planejamento-estrategia/README.md) |
| M011 | Configuracao de Captacao | [README](implementation/modules/M011-configuracao-captacao/README.md) |
| M012 | Acompanhamento e Resultados | [README](implementation/modules/M012-acompanhamento-resultados/README.md) |
| M013 | Gestao Orcamentaria do Projeto | [README](implementation/modules/M013-gestao-orcamentaria-projeto/README.md) |
| M014 | Prestacao de Contas | [README](implementation/modules/M014-prestacao-contas/README.md) |
| M015 | Suspensao e Finalizacao | [README](implementation/modules/M015-suspensao-finalizacao/README.md) |
| M016 | Contabilidade e Financeiro | [README](implementation/modules/M016-contabilidade-financeiro/README.md) |
| M017 | Prevencao a Lavagem de Dinheiro (PLD) | [README](implementation/modules/M017-prevencao-lavagem-dinheiro/README.md) |
| M018 | Business Intelligence | [README](implementation/modules/M018-business-intelligence/README.md) |
| M019 | Transparencia e Auditoria | [README](implementation/modules/M019-transparencia-auditoria/README.md) |
| M020 | Comunicacao | [README](implementation/modules/M020-comunicacao/README.md) |
| M021 | Gestao de Formularios | [README](implementation/modules/M021-gestao-formularios/README.md) |
| M022 | Contratacao e Outorga | [README](implementation/modules/M022-contratacao-outorga/README.md) |
