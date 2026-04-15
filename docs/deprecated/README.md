# Deprecated — Documentacao Legada

Esta pasta contem documentacao de versoes anteriores do projeto que foi migrada para a estrutura modular atual. Os arquivos sao mantidos como referencia historica e para preservar o historico git.

**Nao use estes documentos como referencia.** Consulte os destinos indicados abaixo.

---

## Indice

| Pasta | Descricao original | Migrado para | Referencia |
|-------|--------------------|--------------|----|
| [pagamento-bolsista/](pagamento-bolsista/) | Documentacao reversa do backend de pagamento de bolsistas (15 epicos, arquitetura, entidades) | [implementation/modules/M004-pagamento-bolsista/](../implementation/modules/M004-pagamento-bolsista/README.md) | [ADR-006](../architecture/adr/ADR-006-reconciliacao-m004-pagamento-bolsista.md) |
| [portal-fapes/](portal-fapes/) | Documentacao do frontend do Portal do Coordenador (12 features, arquitetura frontend/backend, entidades) | [products/portal-coordenador/](../products/portal-coordenador/README.md) | — |
| [prestacao-de-contas/](prestacao-de-contas/) | Documentacao reversa do backend de prestacao de contas (12 epicos, arquitetura, entidades) | [implementation/modules/M014-prestacao-contas/](../implementation/modules/M014-prestacao-contas/README.md) | [ADR-008](../architecture/adr/ADR-008-backend-separado-m014.md) |

## Por que manter estes arquivos?

1. **Historico git** — o `git mv` preserva o historico de commits de cada arquivo.
2. **Referencia de cenarios Gherkin** — as features legadas contem cenarios detalhados que foram usados como base para os EPICs dos modulos.
3. **Detalhes de infraestrutura** — `pagamento-bolsista/architecture.md` e `prestacao-de-contas/architecture.md` contem detalhes de codigo-fonte (estrutura de pastas, DI, controllers) que nao sao cobertos pela doc modular.
