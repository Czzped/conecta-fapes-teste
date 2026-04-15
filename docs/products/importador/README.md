# Importador SIGFAPES

Ferramenta de importacao de dados do sistema legado SIGFAPES.

[← Voltar aos Produtos](../README.md)

---

## Sobre o Produto

O Importador e uma ferramenta que realiza a migracao automatica de editais, projetos, equipes, pessoas e historico de pagamentos do sistema legado SIGFAPES para a plataforma Conecta FAPES.

| Atributo | Valor |
|----------|-------|
| **Perfis de usuario** | Equipe tecnica |
| **Stack** | Vue, Node |
| **Status** | Entregue (Q1 2026) |

---

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | Epicos de produto com links para EPICs do M002 |
| [Arquitetura Frontend](architecture.md) | Stack, fluxo de dados, integracao com M002 e diferencas com portais |

---

## Modulos Backend Consumidos

| Modulo | Funcionalidade |
|--------|---------------|
| [M002](../../implementation/modules/M002-importacao-editais/README.md) | Importacao, sincronizacao e conciliacao de dados do SIGFAPES |
