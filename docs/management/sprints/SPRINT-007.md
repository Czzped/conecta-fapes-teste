# SPRINT-007

[← Voltar ao Management](../README.md)

| Atributo | Valor |
|----------|-------|
| **Periodo** | 2026-04-16 a 2026-04-30 |
| **Milestone** | [MS-01 — Base Operacional](../milestones.md#ms-01--base-operacional) / [MS-02 — Ciclo de Fomento Pre-Award](../milestones.md#ms-02--ciclo-de-fomento-pre-award) |
| **GitHub Milestone** | `milestone: MS-01` |
| **Goal** | Desbloqueio de Parcerias: cadastros corporativos (M008) e primeiras US de Parcerias (M010) |

---

## Features Comprometidas

> EPIC de referencia: [#1724 Portal Admin — Parcerias](https://github.com/leds-conectafapes/conectafapes-project/issues/1724)

**Prototipos:**
- [Back-office (Figma)](https://bucket-lake-78647159.figma.site/) — Telas de Parcerias, Instituicoes e Cadastros
- [Front-office (Figma)](https://rate-snort-02856207.figma.site/)
- [Prototipo Backoffice (codigo)](../../prototype/backoffice/) — Componentes: Parceria.tsx, DetalhesParceria.tsx, FormularioParceria.tsx

### Domain 01 — Corporativo e Administrativo (M008 — Desbloqueio)

| Feature | Produto | Modulo | Issue | Documentacao | Status |
|---------|---------|--------|-------|-------------|--------|
| Cadastrar Instituicao | PORTAL FAPES - ADMIN | M008 | [#1749](https://github.com/leds-conectafapes/conectafapes-project/issues/1749) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-instituicoes.md), [EPIC-M008-002](../../implementation/modules/M008-cadastros-corporativos/epics/EPIC-M008-002.md) | To Do |
| Cadastrar Unidade Organizacional | PORTAL FAPES - ADMIN | M008 | [#1750](https://github.com/leds-conectafapes/conectafapes-project/issues/1750) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-instituicoes.md), [EPIC-M008-002](../../implementation/modules/M008-cadastros-corporativos/epics/EPIC-M008-002.md) | To Do |
| Cadastrar Dirigente | PORTAL FAPES - ADMIN | M008 | [#1751](https://github.com/leds-conectafapes/conectafapes-project/issues/1751) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-instituicoes.md), [EPIC-M008-002](../../implementation/modules/M008-cadastros-corporativos/epics/EPIC-M008-002.md) | To Do |
| Listar e Consultar Instituicoes | PORTAL FAPES - ADMIN | M008 | [#1752](https://github.com/leds-conectafapes/conectafapes-project/issues/1752) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-instituicoes.md), [EPIC-M008-002](../../implementation/modules/M008-cadastros-corporativos/epics/EPIC-M008-002.md) | To Do |
| Vincular Pessoa a Instituicao/Unidade | PORTAL FAPES - ADMIN | M008 | [#1753](https://github.com/leds-conectafapes/conectafapes-project/issues/1753) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-instituicoes.md), [Modelo Pessoas](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-pessoas.md) | To Do |
| Cadastrar e Gerenciar Area Tecnica | PORTAL FAPES - ADMIN | M008 | [#1754](https://github.com/leds-conectafapes/conectafapes-project/issues/1754) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-instituicoes.md), [Modelo Pessoas](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-pessoas.md) | To Do |
| Cadastrar Finalidade | PORTAL FAPES - ADMIN | M008 | [#1746](https://github.com/leds-conectafapes/conectafapes-project/issues/1746) | [Modelo Referencia](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-referencia.md) | To Do |
| Listar Finalidades | PORTAL FAPES - ADMIN | M008 | [#1747](https://github.com/leds-conectafapes/conectafapes-project/issues/1747) | [Modelo Referencia](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-referencia.md) | To Do |

### Domain 02 — Planejamento e Estrategia (M010 — Parcerias)

| Feature | Produto | Modulo | Issue | Documentacao | Status |
|---------|---------|--------|-------|-------------|--------|
| Cadastrar Parceria | PORTAL FAPES - ADMIN | M010 | [#1739](https://github.com/leds-conectafapes/conectafapes-project/issues/1739) | [Modelo Estrutural](../../implementation/modules/M010-planejamento-estrategia/modelo-estrutural.md), [Contrato](../../implementation/modules/M010-planejamento-estrategia/contrato.md) | To Do |
| Registrar Aporte Financeiro | PORTAL FAPES - ADMIN | M010 | [#1740](https://github.com/leds-conectafapes/conectafapes-project/issues/1740) | [Modelo Estrutural](../../implementation/modules/M010-planejamento-estrategia/modelo-estrutural.md), [Contrato](../../implementation/modules/M010-planejamento-estrategia/contrato.md) | To Do |
| Registrar Coordenacao de Parceria | PORTAL FAPES - ADMIN | M010 | [#1741](https://github.com/leds-conectafapes/conectafapes-project/issues/1741) | [Modelo Estrutural](../../implementation/modules/M010-planejamento-estrategia/modelo-estrutural.md), [Contrato](../../implementation/modules/M010-planejamento-estrategia/contrato.md) | To Do |
| Associar Finalidade a Parceria | PORTAL FAPES - ADMIN | M010 | [#1742](https://github.com/leds-conectafapes/conectafapes-project/issues/1742) | [Modelo Estrutural](../../implementation/modules/M010-planejamento-estrategia/modelo-estrutural.md), [Modelo Referencia M008](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-referencia.md) | To Do |
| Listar e Consultar Parcerias | PORTAL FAPES - ADMIN | M010 | [#1743](https://github.com/leds-conectafapes/conectafapes-project/issues/1743) | [Contrato](../../implementation/modules/M010-planejamento-estrategia/contrato.md), [Contrato API](../../implementation/modules/M010-planejamento-estrategia/contrato-api.md) | To Do |
| Encerrar Parceria | PORTAL FAPES - ADMIN | M010 | [#1744](https://github.com/leds-conectafapes/conectafapes-project/issues/1744) | [Modelo Comportamental](../../implementation/modules/M010-planejamento-estrategia/modelo-comportamental.md) | To Do |

---

## Ordem de Implementacao

**Fase 1 — M008 (desbloqueio, primeira semana):**
1. #1749 Cadastrar Instituicao
2. #1750 Cadastrar Unidade Organizacional
3. #1753 Vincular Pessoa a Instituicao/Unidade
4. #1746 Cadastrar Finalidade + #1747 Listar Finalidades
5. #1751 Cadastrar Dirigente
6. #1752 Listar e Consultar Instituicoes

**Fase 2 — M010 (parcerias, segunda semana):**
1. #1739 Cadastrar Parceria (depende de #1749, #1750, #1746)
2. #1740 Registrar Aporte Financeiro (depende de #1749)
3. #1741 Registrar Coordenacao
4. #1742 Associar Finalidade (depende de #1746, #1747)
5. #1743 Listar e Consultar Parcerias
6. #1744 Encerrar Parceria

---

## EPICs Relacionados

| EPIC | Modulo | Issue |
|------|--------|-------|
| Cadastro de Instituicoes e Unidades | M008 | [#1748](https://github.com/leds-conectafapes/conectafapes-project/issues/1748) |
| Cadastro de Finalidades | M008 | [#1745](https://github.com/leds-conectafapes/conectafapes-project/issues/1745) |
| Portal Admin — Parcerias | M010 | [#1724](https://github.com/leds-conectafapes/conectafapes-project/issues/1724) |

---

## Estatisticas

| Metrica | Valor |
|---------|-------|
| **Total de issues** | 13 |
| **M008 (desbloqueio)** | 8 |
| **M010 (parcerias)** | 6 |
| **Concluidas** | 0 |
| **Em andamento** | 0 |
| **Pendentes** | 13 |
| **% Concluido** | 0% |

### Progresso por Feature

| # | Feature | Issue | Status |
|---|---------|-------|--------|
| 1 | Cadastrar Instituicao | #1749 | ⚪ To Do |
| 2 | Cadastrar Unidade Organizacional | #1750 | ⚪ To Do |
| 3 | Cadastrar Dirigente | #1751 | ⚪ To Do |
| 4 | Listar e Consultar Instituicoes | #1752 | ⚪ To Do |
| 5 | Vincular Pessoa a Instituicao/Unidade | #1753 | ⚪ To Do |
| 6 | Cadastrar e Gerenciar Area Tecnica | #1754 | ⚪ To Do |
| 7 | Cadastrar Finalidade | #1746 | ⚪ To Do |
| 8 | Listar Finalidades | #1747 | ⚪ To Do |
| 9 | Cadastrar Parceria | #1739 | ⚪ To Do |
| 10 | Registrar Aporte Financeiro | #1740 | ⚪ To Do |
| 11 | Registrar Coordenacao | #1741 | ⚪ To Do |
| 12 | Associar Finalidade a Parceria | #1742 | ⚪ To Do |
| 13 | Listar e Consultar Parcerias | #1743 | ⚪ To Do |

> **Legenda:** ⚪ To Do | 🔵 In Progress | 🟢 Done

> **Nota:** Atualizar esta tabela ao final de cada dia ou ao concluir uma issue. Trocar o emoji conforme o status muda.

---

## Review

### Entregue

- ...

### Nao entregue

- ... (motivo)

---

## Retrospectiva

### O que funcionou

- ...

### O que melhorar

- ...

### Acoes para o proximo sprint

- ...
