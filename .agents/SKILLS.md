# Skills Globais em Uso no Projeto

Catalogo das skills instaladas em `~/.agents/skills/` que sao relevantes ao stack do **Conecta FAPES**: backend C#/.NET + frontend Vue 3/Nuxt + testes Playwright/xUnit.

Este arquivo e **documentacao para humanos** (onboarding de time e referencia de quando usar cada skill). Nao e lido automaticamente pelo Claude — as skills ja estao registradas no catalogo global.

Para skills proprias do projeto (Tipo 1, com frontmatter), veja `.agents/skills/` (ex.: `ddd`).

---

## Indice

- [Backend C# / .NET](#backend-c--net)
- [Frontend Vue 3 / Nuxt](#frontend-vue-3--nuxt)
- [Arquitetura e Qualidade](#arquitetura-e-qualidade)
- [Testes e QA](#testes-e-qa)
- [Design e UX](#design-e-ux)
- [Documentacao Tecnica](#documentacao-tecnica)
- [Meta](#meta)

---

## Backend C# / .NET

### `dotnet-backend-patterns`

- **Origem**: [`wshobson/agents@dotnet-backend-patterns`](https://skills.sh/wshobson/agents/dotnet-backend-patterns) (10.3K installs)
- **Descricao**: Padroes modernos de backend .NET — ASP.NET Core, Clean Code, SOLID, injecao de dependencia, tratamento de erros, logging estruturado.
- **Quando usar no Conecta FAPES**:
  - PRs do Vinicius em M008 (Cadastros Corporativos) e M010 (Parcerias)
  - Decisoes de camadas (Controller/Service/Repository)
  - Revisao de padroes de implementacao
- **Stack associada**: C#, ASP.NET Core, Entity Framework, xUnit

### `dotnet-testing-autodata-xunit-integration`

- **Origem**: [`kevintsengtw/dotnet-testing-agent-skills@dotnet-testing-autodata-xunit-integration`](https://skills.sh/kevintsengtw/dotnet-testing-agent-skills/dotnet-testing-autodata-xunit-integration)
- **Descricao**: Testes com xUnit + AutoData (AutoFixture.AutoXunit) — geracao automatica de dados de teste e integracao unit/integration.
- **Quando usar no Conecta FAPES**:
  - Escrever testes unitarios e de integracao nas issues #1739-#1797 (premissa nao negociavel do SPRINT-007)
  - Cenarios Gherkin convertidos em xUnit
  - Cobertura de regras de negocio (RN01-RN19, RI1-RI3) do M010
- **Stack associada**: xUnit, AutoFixture, Moq

---

## Frontend Vue 3 / Nuxt

### `nuxt`

- **Origem**: [`antfu/skills@nuxt`](https://skills.sh/antfu/skills/nuxt) (13K installs — autor mantenedor do Nuxt core)
- **Descricao**: Nuxt 3 + Vue 3 — Composition API, auto-imports, modulos, configuracao, SSR.
- **Quando usar no Conecta FAPES**:
  - Implementacao de telas do [Portal Admin](../docs/products/portal-admin/README.md) e Portal Coordenador
  - Feature EPA-07 (Gestao de Parcerias — `Parceria.tsx`, `DetalhesParceria.tsx`, `FormularioParceria.tsx`)
  - Configuracao de rotas, middlewares, composables
- **Stack associada**: Nuxt 3, Vue 3, TypeScript

### `nuxt-ui`

- **Origem**: [`nuxt/ui@nuxt-ui`](https://skills.sh/nuxt/ui/nuxt-ui) (9.6K installs — **oficial Nuxt**)
- **Descricao**: Biblioteca de componentes oficial do Nuxt (stack declarado no [portal-admin/README.md](../docs/products/portal-admin/README.md)).
- **Quando usar no Conecta FAPES**:
  - Qualquer tela de formulario (cadastro de Parceria, aportes, documentos)
  - Tabelas (listagem de Parcerias/Programas)
  - Modais de confirmacao (encerrar parceria em cascata RI2)
  - Cards de saldo (US-M010-016)
- **Stack associada**: Nuxt UI, Tailwind, Reka UI

---

## Arquitetura e Qualidade

### `software-architecture`

- **Origem**: [`sickn33/antigravity-awesome-skills@software-architecture`](https://skills.sh/sickn33/antigravity-awesome-skills/software-architecture) (2.1K installs)
- **Descricao**: Guias de decisoes arquiteturais — Clean Architecture, Hexagonal, DDD, SOLID, padroes de integracao entre bounded contexts.
- **Quando usar no Conecta FAPES**:
  - Refatoracoes de modulo (como o refactor M010 da sprint-007)
  - Decisoes de bounded context (ex.: `AporteFinanceiroParceriaPrograma` em `programas/` vs `parcerias/`)
  - Propostas de ADR em [`docs/architecture/adr/`](../docs/architecture/)
  - Revisao de dependencias entre modulos (M010 -> M008)
- **Complementa**: skill local [`.agents/skills/ddd/SKILL.md`](skills/ddd/SKILL.md)

---

## Testes e QA

### `test-driven-development`

- **Origem**: [`obra/superpowers@test-driven-development`](https://skills.sh/obra/superpowers/test-driven-development)
- **Descricao**: Metodologia RED-GREEN-REFACTOR com referencias de boas praticas de teste.
- **Quando usar no Conecta FAPES**:
  - Alinhado diretamente com a [**premissa nao negociavel de testes** do SPRINT-007](../docs/management/sprints/SPRINT-007.md#premissa-nao-negociavel--testes)
  - Cada US de desenvolvimento do sprint (#1739-#1797) exige testes unitarios + integracao antes do merge
  - Guia para converter cenarios Gherkin em `[Theory]`/`[Fact]` xUnit
- **Combina com**: `dotnet-testing-autodata-xunit-integration` (backend), `playwright-bdd-gherkin-syntax` (E2E)

### `systematic-debugging`

- **Origem**: [`obra/superpowers@systematic-debugging`](https://skills.sh/obra/superpowers/systematic-debugging)
- **Descricao**: Analise de causa raiz em 4 fases — reproducao, isolamento, hipotese, verificacao.
- **Quando usar no Conecta FAPES**:
  - Debug de invariantes temporais (RN13) que violam em cenarios de borda
  - Falhas em cascata de encerramento (RI2) com Programas vinculados
  - Racing conditions em saldo (RN14) quando aporte e aditivo chegam concorrentes
- **Combina com**: `test-driven-development` (escreve teste que reproduz o bug antes de corrigir)

### `playwright-e2e-testing`

- **Origem**: Anthropic (skill do sistema)
- **Descricao**: Playwright moderno — cross-browser, auto-wait, test runner embutido.
- **Quando usar no Conecta FAPES**:
  - Testes E2E nas jornadas do Portal Admin (cadastrar parceria -> formalizar -> registrar aporte -> aportar em programa -> encerrar)
  - Validacao do fluxo de confirmacao em duas fases do encerramento cascata (RI2)
  - Cobertura de visualizacao de saldo e historico de Vigencias

### `playwright-bdd-gherkin-syntax`

- **Origem**: Anthropic (skill do sistema)
- **Descricao**: Escrita de `.feature` Gherkin, Scenario Outline, tags, Background.
- **Quando usar no Conecta FAPES**:
  - Converter cenarios Gherkin dos EPICs ([EPIC-M010-002](../docs/implementation/modules/M010-planejamento-estrategia/parcerias/epics/EPIC-M010-002.md), etc.) em `.feature` executaveis
  - Organizar cenarios por US (`@US-M010-014`, `@RN13`, `@RI2`)
  - Reuso via `Background:` para setup comum (autenticacao, dados base)

---

## Design e UX

### `web-design-guidelines`

- **Origem**: Anthropic (skill do sistema)
- **Descricao**: Auditoria de UI contra Web Interface Guidelines — acessibilidade, UX, best practices de design.
- **Quando usar no Conecta FAPES**:
  - Revisao de telas do Portal Admin e Portal Coordenador antes de PR
  - Verificacao de acessibilidade (WCAG) em formularios complexos (cadastro de Parceria com Vigencia + Instituicoes)
  - Auditoria de UX (mensagens de erro claras para RN19/RI2, feedback visual de estados)

---

## Documentacao Tecnica

### `technical-writing`

- **Origem**: skill do sistema
- **Descricao**: Escrita tecnica clara — specs, runbooks, architecture docs, API docs.
- **Quando usar no Conecta FAPES**:
  - Atualizacao da documentacao de modulo (`docs/implementation/modules/Mxxx/`)
  - Escrita de ADR (Architecture Decision Records)
  - Runbooks operacionais

---

## Meta

### `find-skills`

- **Origem**: Anthropic (skill do sistema)
- **Descricao**: Ajuda a descobrir e instalar novas skills do ecossistema.
- **Quando usar no Conecta FAPES**:
  - Necessidade de uma capacidade ainda nao coberta
  - Avaliacao de alternativas antes de instalar
  - Atualizacao deste catalogo ao instalar nova skill

---

## Como atualizar este documento

1. Instalar uma skill global: `npx skills add <owner/repo@skill> -g -y`
2. Verificar se e relevante ao stack do projeto (senao, deixar fora do catalogo)
3. Adicionar entrada neste arquivo na categoria apropriada
4. Commit com mensagem `[docs] Adicionar skill <name> ao catalogo do projeto`

Para **skills proprias do projeto** (nao do ecossistema), criar `.agents/skills/<name>/SKILL.md` com frontmatter YAML (exemplo: [`ddd/SKILL.md`](skills/ddd/SKILL.md)).

## Skills instaladas globalmente mas NAO usadas neste projeto

As skills abaixo estao em `~/.agents/skills/` por outros projetos/usos e **nao sao aplicaveis** ao Conecta FAPES:
- `astro`, `astro-framework` — outro framework frontend
- `mistral-ocr` — OCR (nao usado)
- `telegram-automation`, `telegram-messaging` — integracoes com Telegram (nao usado)
