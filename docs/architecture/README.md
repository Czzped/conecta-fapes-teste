# Arquitetura - Conecta FAPES

Visao geral da arquitetura do projeto Conecta FAPES.

[← Voltar ao Backlog Central](../management/backlog-product.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [01-visao-geral.md](01-visao-geral.md) | Contexto do sistema, diagrama C4 de contexto, nota sobre containers e stack tecnologico |
| [02-modulos-e-integracoes.md](02-modulos-e-integracoes.md) | Mapa dos modulos, integracoes externas, componentes de backend e ligacao com ADRs |
| [03-acesso-e-seguranca.md](03-acesso-e-seguranca.md) | Perfis, autenticacao, autorizacao, gateways e politicas de seguranca |
| [04-dados-e-operacao.md](04-dados-e-operacao.md) | Banco de dados, ambiente de operacao, CI/CD e referencias principais |
| [adr/README.md](adr/README.md) | Catalogo de ADRs da arquitetura |

## Como Ler Esta Pasta

- Comece por [01-visao-geral.md](01-visao-geral.md) para entender o contexto e a stack adotada.
- Siga para [02-modulos-e-integracoes.md](02-modulos-e-integracoes.md) para ver como os modulos se relacionam e quais sistemas externos participam da solucao.
- Consulte [03-acesso-e-seguranca.md](03-acesso-e-seguranca.md) para os fluxos de autenticacao, autorizacao e defense in depth.
- Use [04-dados-e-operacao.md](04-dados-e-operacao.md) para a visao de dados, infraestrutura e operacao.

## Evolucoes em Analise

- A proposta de adocao de uma camada de Backend for Frontend (BFF) para composicao orientada a tela esta registrada em [ADR-005](adr/ADR-005-adocao-bff.md). O objetivo e reduzir acoplamento do frontend com multiplos modulos sem transformar o gateway tecnico em BFF.

## Referencias Rapidas

- [ADR-001 — Backend C# com Clean Architecture e CQRS](adr/ADR-001-backend-csharp-clean-architecture-cqrs.md)
- [ADR-002 — Frontend Vue com NuxtUI](adr/ADR-002-frontend-vue-nuxtui.md)
- [ADR-003 — Banco de Dados SQL Server](adr/ADR-003-banco-de-dados-sql-server.md)
- [ADR-004 — Infraestrutura Docker e Kubernetes](adr/ADR-004-infraestrutura-docker-kubernetes.md)
- [ADR-005 — Adocao de BFF para composicao de interfaces](adr/ADR-005-adocao-bff.md)
- [Visao do Produto](../discovery/product-vision.md)
