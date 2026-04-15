# Conecta FAPES - Documentacao

Plataforma digital da agencia de fomento para gestao do ciclo completo de fomento a pesquisa, desenvolvimento e inovacao.

## Prototipos

| Prototipo | Link |
|-----------|------|
| Front-office | [https://rate-snort-02856207.figma.site/](https://rate-snort-02856207.figma.site/) |
| Back-office | [https://bucket-lake-78647159.figma.site/](https://bucket-lake-78647159.figma.site/) |

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
| [Milestones](management/milestones.md) | Marcos de entrega agrupando domains |
| [Sprints](management/sprints/) | Iteracoes time-boxed com epics por domain |

## Arquitetura

| Documento | Descricao |
|-----------|-----------|
| [Visao Geral](architecture/README.md) | Contexto do sistema, stack tecnologica, integracoes e operacao |
| [ADRs](architecture/adr/README.md) | Decisoes de arquitetura registradas |

> **Nota:** A pasta `documentation_old/` na raiz do repositorio e uma versao antiga da documentacao e nao deve ser utilizada como referencia. A pasta [deprecated/](deprecated/README.md) contem documentacao legada migrada (`pagamento-bolsista`, `portal-fapes`, `prestacao-de-contas`) — consulte `products/` e `implementation/modules/` para a documentacao atual.

## Produtos

Canais de entrega frontend que compoem funcionalidades de multiplos modulos backend.

| Produto | Descricao | Documentacao |
|---------|-----------|--------------|
| Portal Coordenador | Portal web do coordenador de projeto e bolsista | [README](products/portal-coordenador/README.md) |
| Portal Admin | Portal administrativo da agencia (back-office) | [README](products/portal-admin/README.md) |
| Importador | Importacao de dados do SIGFAPES | [README](products/importador/README.md) |

## Modulos

| ID | Modulo | Documentacao |
|----|--------|--------------|
| M001 | Modalidades de Bolsas | [README](implementation/modules/M001-modalidade-bolsa/README.md) |
| M002 | Importacao de Editais | [README](implementation/modules/M002-importacao-editais/README.md) |
| M003 | Gestao de Iniciativas Captadas | [README](implementation/modules/M003-gestao-iniciativas-captadas/README.md) |
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
