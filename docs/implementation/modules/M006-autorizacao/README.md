# M006 - Autorizacao

[← Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 01 — Corporativo](../../../discovery/domains/01-corporativo.md)

---

## Status

> **A definir.** Este modulo ainda nao possui especificacao de implementacao. O placeholder foi criado para manter a rastreabilidade com os documentos que o referenciam.

---

## Sobre o Modulo

Permissoes de acesso sao rigidas e nao permitem delegacao de funcoes, travando processos quando responsaveis estao ausentes. Este modulo visa gerenciar autorizacoes e delegacao de funcoes com politicas flexiveis via OpenFGA.

| Atributo | Valor |
|----------|-------|
| **Dor do Cliente** | Permissoes rigidas sem delegacao de funcoes |
| **Solucao** | Motor de autorizacao OpenFGA com politicas RBAC/ABAC |
| **KPI** | Tempo medio de concessao/revogacao de acesso; incidentes de acesso indevido |
| **Integracao externa** | [OpenFGA](https://openfga.dev/docs) |

## Produto Relacionado: AuthRix

M006 e operacionalizado pelo **[AuthRix](../../../products/authrix/README.md)**, produto interno em desenvolvimento que atua como PDP centralizado consumindo OpenFGA. Os produtos Portal Coordenador, Portal Admin e Importador consultam o AuthRix para decisoes de autorizacao.

**Responsaveis AuthRix:** Joao Marcos, Arthur Cremasco

## Referenciado por

- [products/authrix/README.md](../../../products/authrix/README.md) — Produto que implementa/consome o modulo
- [architecture/03-acesso-e-seguranca.md](../../../architecture/03-acesso-e-seguranca.md) — modelo XACML (PAP, PIP, PDP, PEP)
- [architecture/02-modulos-e-integracoes.md](../../../architecture/02-modulos-e-integracoes.md) — diagrama de modulos
- [management/milestones/README.md](../../../management/milestones/README.md) — MS-01 (Base Operacional)

## Proximos Passos

- Definir contrato do modulo (politicas, delegacao, consultas de permissao)
- Definir modelo estrutural (Policy, Role, Permission, Delegation)
- Criar backlog com EPICs
