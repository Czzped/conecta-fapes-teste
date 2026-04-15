# Arquitetura do Frontend — Importador SIGFAPES

[← Voltar ao Importador](README.md)

> Este documento descreve a arquitetura do **frontend** do Importador. Para a arquitetura do backend (Clean Architecture, CQRS, infraestrutura), consulte [architecture/](../../architecture/README.md).

## Visao geral

O Importador e uma ferramenta interna utilizada pela equipe tecnica para migrar dados do sistema legado SIGFAPES para a plataforma Conecta FAPES. Diferente dos portais (Coordenador e Admin), o Importador e uma aplicacao de uso operacional com ciclo de vida curto — executada durante janelas de importacao.

### Stack tecnologico

| Tecnologia | Uso |
|------------|-----|
| **Vue** | Framework frontend |
| **Node** | Runtime |

> **Nota:** O Importador foi refatorado em Q1 2026 (Vue + Node). A stack e mais simples que os portais (sem Nuxt UI, sem Tailwind, sem Vue Query) por ser uma ferramenta interna.

## Estrutura funcional

```text
Importador
├── Selecao de Editais      → Lista editais do SIGFAPES para importacao
├── Completar Alocacoes     → Ajuste de cotas e dados antes de confirmar
├── Sincronizacao           → Execucao da importacao com progresso
└── Monitoramento           → Status, erros e reprocessamento
```

## Fluxo de dados

```text
SIGFAPES (Web Services) → Backend M002 (importacao/sincronizacao) → ConectaFapesDB
                                    ↑
                           Importador (frontend) → API M002
```

O Importador **nao acessa o SIGFAPES diretamente** — ele consome a API do modulo M002, que por sua vez acessa os Web Services do SIGFAPES (RNF02).

## Integracao com modulos

| Modulo | Papel | Relacao |
|--------|-------|---------|
| [M002](../../implementation/modules/M002-importacao-editais/README.md) | Backend exclusivo | O Importador consome apenas M002 |
| M003 | Destino dos dados | Editais, Projetos e Alocacoes sincronizados viram entidades do M003 |
| M008 | Destino dos dados | Pessoas, Instituicoes e Areas Tecnicas sincronizadas viram entidades do M008 |
| M001 | Referencia | VersaoNivel usada para vincular alocacoes a niveis de bolsa |

## Autenticacao

| Aspecto | Implementacao |
|---------|---------------|
| **Autenticacao** | Acesso Cidadao (OpenID Connect) |
| **Perfil** | Equipe tecnica (acesso restrito) |

## Diferencas em relacao aos portais

| Aspecto | Portais (Coordenador/Admin) | Importador |
|---------|----------------------------|------------|
| **Usuarios** | Centenas (coordenadores, operadores) | Equipe tecnica (<10 usuarios) |
| **Uso** | Continuo (diario) | Janelas de importacao (periodico) |
| **Modulos consumidos** | Multiplos (M001-M016) | Unico (M002) |
| **Stack** | Vue 3 + Nuxt UI + Tailwind | Vue + Node (simples) |
| **BFF** | Planejado (ADR-005) | Nao aplicavel |
| **Composicao multi-modulo** | Sim (telas compostas) | Nao (1:1 com M002) |
