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
- **Stack associada**: C#, ASP.NET Core, Entity Framework

### `dotnet-testing-autodata-xunit-integration`

- **Origem**: [`kevintsengtw/dotnet-testing-agent-skills@dotnet-testing-autodata-xunit-integration`](https://skills.sh/kevintsengtw/dotnet-testing-agent-skills/dotnet-testing-autodata-xunit-integration)
- **Descricao**: Testes com xUnit + AutoData (AutoFixture.AutoXunit) — geracao automatica de dados de teste e integracao unit/integration.
- **Stack associada**: xUnit, AutoFixture, Moq

---

## Frontend Vue 3 / Nuxt

### `nuxt`

- **Origem**: [`antfu/skills@nuxt`](https://skills.sh/antfu/skills/nuxt) (13K installs — autor mantenedor do Nuxt core)
- **Descricao**: Nuxt 3 + Vue 3 — Composition API, auto-imports, modulos, configuracao, SSR.
- **Stack associada**: Nuxt 3, Vue 3, TypeScript

### `nuxt-ui`

- **Origem**: [`nuxt/ui@nuxt-ui`](https://skills.sh/nuxt/ui/nuxt-ui) (9.6K installs — **oficial Nuxt**)
- **Descricao**: Biblioteca de componentes oficial do Nuxt (stack declarado no [portal-admin/README.md](../docs/products/portal-admin/README.md)).
- **Stack associada**: Nuxt UI, Tailwind, Reka UI

---

## Arquitetura e Qualidade

### `software-architecture`

- **Origem**: [`sickn33/antigravity-awesome-skills@software-architecture`](https://skills.sh/sickn33/antigravity-awesome-skills/software-architecture) (2.1K installs)
- **Descricao**: Guias de decisoes arquiteturais — Clean Architecture, Hexagonal, DDD, SOLID, padroes de integracao entre bounded contexts.
- **Complementa**: skill local [`.agents/skills/ddd/SKILL.md`](skills/ddd/SKILL.md)

---

## Testes e QA

### `test-driven-development`

- **Origem**: [`obra/superpowers@test-driven-development`](https://skills.sh/obra/superpowers/test-driven-development)
- **Descricao**: Metodologia RED-GREEN-REFACTOR com referencias de boas praticas de teste.
- **Combina com**: `dotnet-testing-autodata-xunit-integration` (backend), `playwright-bdd-gherkin-syntax` (E2E)

### `systematic-debugging`

- **Origem**: [`obra/superpowers@systematic-debugging`](https://skills.sh/obra/superpowers/systematic-debugging)
- **Descricao**: Analise de causa raiz em 4 fases — reproducao, isolamento, hipotese, verificacao.
- **Combina com**: `test-driven-development` (reproduzir o comportamento com teste antes de corrigir)

### `playwright-e2e-testing`

- **Origem**: Anthropic (skill do sistema)
- **Descricao**: Playwright moderno — cross-browser, auto-wait, test runner embutido.
- **Stack associada**: Playwright, TypeScript

### `playwright-bdd-gherkin-syntax`

- **Origem**: Anthropic (skill do sistema)
- **Descricao**: Escrita de `.feature` Gherkin, Scenario Outline, tags, Background.
- **Combina com**: `playwright-e2e-testing` (execucao dos cenarios `.feature` em E2E)

---

## Design e UX

### `web-design-guidelines`

- **Origem**: Anthropic (skill do sistema)
- **Descricao**: Auditoria de UI contra Web Interface Guidelines — acessibilidade (WCAG), UX, best practices de design de interface web.

---

## Documentacao Tecnica

### `technical-writing`

- **Origem**: skill do sistema
- **Descricao**: Escrita tecnica clara — specs, runbooks, architecture docs, API docs, ADR.

---

## Meta

### `find-skills`

- **Origem**: Anthropic (skill do sistema)
- **Descricao**: Descoberta e instalacao de novas skills do ecossistema aberto (`npx skills find/add`).
- **Quando usar**: ao avaliar ou adicionar novas skills a este catalogo.

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
