# Agentes e Skills — Conecta FAPES

[← Voltar aos Docs](../README.md)

Documentacao humana dos **agents** (personas especializadas) e **skills** (capacidades) disponiveis para a equipe do Conecta FAPES. O conteudo funcional (frontmatter, definicoes) vive em `.agents/` na raiz do repositorio; este documento explica **o que cada um faz, quando usar e como se relacionam**.

---

## 📁 Estrutura fisica

```
.agents/                                 ← raiz do repositorio
├── AGENTS.md                            ← indice tabular (padrao agents.md)
├── SKILLS.md                            ← catalogo tecnico das skills
├── product-owner/
│   ├── AGENT.md                         ← definicao do agent Product Owner
│   └── documentation-module.md          ← workflow de documentacao de modulos
└── skills/
    ├── ddd/SKILL.md                     ← skill local (propria do projeto)
    ├── find-skills/                     ← symlink → ~/.agents/skills/find-skills
    ├── dotnet-backend-patterns/         ← symlink → ~/.agents/skills/dotnet-backend-patterns
    ├── dotnet-testing-autodata-xunit-integration/  ← symlink
    ├── nuxt/                            ← symlink
    ├── nuxt-ui/                         ← symlink
    ├── software-architecture/           ← symlink
    ├── test-driven-development/         ← symlink
    ├── systematic-debugging/            ← symlink
    ├── playwright-e2e-testing/          ← symlink
    ├── playwright-bdd-gherkin-syntax/   ← symlink
    ├── web-design-guidelines/           ← symlink
    └── technical-writing/               ← symlink
```

### Por que symlinks?

As **skills globais** (instaladas em `~/.agents/skills/` via `npx skills add`) sao **linkadas** dentro de `.agents/skills/` em vez de copiadas. Beneficios:

- ✅ **Auto-documentacao**: `ls .agents/skills/` mostra exatamente quais skills o projeto usa
- ✅ **Zero duplicacao**: arquivos reais existem em um unico lugar (`~/.agents/skills/`)
- ✅ **Updates automaticos**: `npx skills update` continua funcionando; symlinks apontam para a versao atualizada
- ✅ **Preserva convencoes**: skills continuam instaladas pelo gerenciador padrao

---

## 🧑‍💼 Agentes

### Product Owner

Ver definicao em `.agents/product-owner/AGENT.md`.

**Responsabilidades**:
- Manter o [backlog central do produto](../management/backlog-product.md) e a rastreabilidade entre EPICs, US e issues
- Redigir User Stories com cenarios Gherkin (Funcionalidade / Cenario / Dado-Quando-Entao)
- Garantir consistencia da documentacao entre `README.md`, `contrato.md`, `backlog.md`, EPICs, `modelo-estrutural.md` e `modelo-comportamental.md` em cada modulo
- Normalizar terminologia com o **ubiquitous language** do dominio

**Quando invocar**:
- Criar, revisar ou refatorar documentacao de um modulo (`docs/implementation/modules/Mxxx/`)
- Escrever novas User Stories com criterios de aceitacao
- Auditar consistencia entre EPIC, contrato e modelos
- Decidir onde um conceito novo deve ser modelado

**Workflows associados**:
- `.agents/product-owner/documentation-module.md` — roteiro passo a passo de documentacao de modulo

---

## 🧠 Skills

Skills aparecem no catalogo do Claude com seu **frontmatter YAML** (campos `name:` e `description:`) e podem ser invocadas automaticamente ou explicitamente via `/<nome>`.

### Skills locais (proprias do projeto)

Arquivos de `SKILL.md` reais dentro de `.agents/skills/`, mantidos como parte do repositorio.

#### `ddd` — Domain-Driven Design aplicado a documentacao de modulo
Ver `.agents/skills/ddd/SKILL.md`.

- **O que faz**: aplica DDD na modelagem de modulos — bounded context, ubiquitous language, classificacao de conceitos (entidade, value object, aggregate, domain service, policy), invariantes.
- **Quando usar**: ao criar/revisar modulo; ao modelar entidades ou agregados; ao definir limites entre modulos (ex.: `parcerias/` vs `programas/` dentro de M010); ao auditar consistencia de linguagem.
- **Complementa**: a skill global `software-architecture` (decisoes arquiteturais estrategicas).

### Skills globais (symlinks de `~/.agents/skills/`)

Instaladas via `npx skills add` e linkadas em `.agents/skills/`. Registradas no catalogo global do Claude (disponiveis em qualquer sessao).

Agrupadas por categoria:

#### Backend C# / .NET

##### `dotnet-backend-patterns`
- **Origem**: [`wshobson/agents@dotnet-backend-patterns`](https://skills.sh/wshobson/agents/dotnet-backend-patterns) (10.3K installs)
- **O que faz**: padroes modernos de backend .NET — ASP.NET Core, Clean Code, SOLID, injecao de dependencia, tratamento de erros, logging estruturado.
- **Quando usar**: ao implementar ou revisar codigo C#/ASP.NET Core; ao decidir estrutura de camadas; ao avaliar padroes de erro, logging ou DI.
- **Stack**: C#, ASP.NET Core, Entity Framework

##### `dotnet-testing-autodata-xunit-integration`
- **Origem**: [`kevintsengtw/dotnet-testing-agent-skills@dotnet-testing-autodata-xunit-integration`](https://skills.sh/kevintsengtw/dotnet-testing-agent-skills/dotnet-testing-autodata-xunit-integration)
- **O que faz**: testes com xUnit + AutoData (AutoFixture.AutoXunit) — geracao automatica de dados de teste e integracao unit/integration.
- **Quando usar**: ao escrever testes unitarios ou de integracao em projetos .NET; ao converter cenarios Gherkin em `[Theory]`/`[Fact]`; ao configurar geracao automatica de fixtures.
- **Stack**: xUnit, AutoFixture, Moq

#### Frontend Vue 3 / Nuxt

##### `nuxt`
- **Origem**: [`antfu/skills@nuxt`](https://skills.sh/antfu/skills/nuxt) (13K installs — autor mantenedor do Nuxt core)
- **O que faz**: Nuxt 3 + Vue 3 — Composition API, auto-imports, modulos, configuracao, SSR.
- **Quando usar**: ao criar ou modificar paginas, composables, middlewares ou modulos Nuxt; ao decidir entre SSR/SSG/CSR; ao configurar autoimports e rotas.
- **Stack**: Nuxt 3, Vue 3, TypeScript

##### `nuxt-ui`
- **Origem**: [`nuxt/ui@nuxt-ui`](https://skills.sh/nuxt/ui/nuxt-ui) (9.6K installs — **oficial Nuxt**)
- **O que faz**: biblioteca oficial de componentes do Nuxt — formularios, tabelas, modais, cards, navegacao.
- **Quando usar**: ao criar ou modificar componentes de interface; ao garantir consistencia visual com o design system; ao implementar UIs dos portais admin/coordenador.
- **Stack**: Nuxt UI, Tailwind, Reka UI

#### Arquitetura e Qualidade

##### `software-architecture`
- **Origem**: [`sickn33/antigravity-awesome-skills@software-architecture`](https://skills.sh/sickn33/antigravity-awesome-skills/software-architecture) (2.1K installs)
- **O que faz**: guias de decisoes arquiteturais — Clean Architecture, Hexagonal, DDD, SOLID, padroes de integracao entre bounded contexts.
- **Quando usar**: ao definir limites de modulo; ao decidir dependencias entre bounded contexts; ao refatorar estrutura de camadas; ao redigir ADR.
- **Complementa**: skill local `ddd` com foco tatico de modelagem.

#### Testes e QA

##### `test-driven-development`
- **Origem**: [`obra/superpowers@test-driven-development`](https://skills.sh/obra/superpowers/test-driven-development)
- **O que faz**: metodologia RED-GREEN-REFACTOR com referencias de boas praticas.
- **Quando usar**: ao iniciar uma nova feature ou bug-fix antes de escrever codigo de producao; ao conduzir pair programming disciplinado; ao estabelecer contrato de comportamento via teste falho antes da implementacao.
- **Combina com**: `dotnet-testing-autodata-xunit-integration` (backend), `playwright-bdd-gherkin-syntax` (E2E)

##### `systematic-debugging`
- **Origem**: [`obra/superpowers@systematic-debugging`](https://skills.sh/obra/superpowers/systematic-debugging)
- **O que faz**: analise de causa raiz em 4 fases — reproducao, isolamento, hipotese, verificacao.
- **Quando usar**: quando o comportamento observado diverge do esperado e a causa nao e imediatamente obvia; ao debugar racing conditions; ao investigar regressao em invariantes.
- **Combina com**: `test-driven-development` (reproduzir o comportamento com teste antes de corrigir).

##### `playwright-e2e-testing`
- **Origem**: Anthropic (sistema)
- **O que faz**: Playwright moderno — cross-browser, auto-wait, test runner embutido.
- **Quando usar**: ao escrever testes end-to-end simulando jornadas de usuario no navegador; ao validar fluxos multi-tela; ao automatizar regressao visual ou funcional.
- **Stack**: Playwright, TypeScript

##### `playwright-bdd-gherkin-syntax`
- **Origem**: Anthropic (sistema)
- **O que faz**: escrita de `.feature` Gherkin — Scenario Outline, tags, Background.
- **Quando usar**: ao converter cenarios Gherkin dos EPICs em `.feature` executaveis; ao organizar cenarios por tags de dominio; ao reusar setup via `Background`.
- **Combina com**: `playwright-e2e-testing` (execucao dos `.feature`).

#### Design e UX

##### `web-design-guidelines`
- **Origem**: Anthropic (sistema)
- **O que faz**: auditoria de UI contra Web Interface Guidelines — acessibilidade (WCAG), UX, best practices de design de interface web.
- **Quando usar**: ao revisar uma tela antes de merge; ao auditar acessibilidade de formularios complexos; ao avaliar clareza de mensagens de erro e feedback visual de estados.

#### Documentacao Tecnica

##### `technical-writing`
- **Origem**: skill do sistema
- **O que faz**: escrita tecnica clara — specs, runbooks, architecture docs, API docs, ADR.
- **Quando usar**: ao redigir ou revisar documentacao de modulo; ao escrever ADR; ao documentar contratos de API; ao criar runbooks operacionais.

#### Meta

##### `find-skills`
- **Origem**: Anthropic (sistema)
- **O que faz**: descoberta e instalacao de novas skills do ecossistema aberto (`npx skills find/add`).
- **Quando usar**: ao identificar uma capacidade ainda nao coberta pelo catalogo atual; ao avaliar alternativas antes de instalar; ao atualizar este catalogo.

---

## 🔄 Fluxo tipico de uso

1. **Inicio de tarefa**: o Claude avalia automaticamente quais skills ativar com base nas keywords do pedido (auto-trigger pelo `description:` do frontmatter).
2. **Tarefas de dominio/modelagem**: acionar `product-owner` + skill `ddd` — redige/revisa documentacao seguindo bounded context e ubiquitous language.
3. **Implementacao backend**: skills `dotnet-backend-patterns` + `test-driven-development` + `dotnet-testing-autodata-xunit-integration` cobrem padrao → teste falho → implementacao → refactor.
4. **Implementacao frontend**: skills `nuxt` + `nuxt-ui` cobrem estrutura Nuxt e componentes; `web-design-guidelines` audita UX/acessibilidade antes do merge.
5. **Testes de aceitacao**: `playwright-bdd-gherkin-syntax` converte cenarios dos EPICs em `.feature`; `playwright-e2e-testing` executa no navegador.
6. **Decisoes arquiteturais / ADR**: `software-architecture` + `technical-writing` redigem o documento; skill local `ddd` valida limites de bounded context.

---

## ➕ Como adicionar novos agents ou skills

### Novo agent

```bash
mkdir -p .agents/<nome-do-agent>
touch .agents/<nome-do-agent>/AGENT.md
# redigir AGENT.md com frontmatter + persona + responsabilidades + workflow
# atualizar .agents/AGENTS.md (indice) e docs/agentes/README.md
```

### Nova skill local (propria do projeto)

```bash
mkdir -p .agents/skills/<nome-da-skill>
touch .agents/skills/<nome-da-skill>/SKILL.md
# SKILL.md com frontmatter:
# ---
# name: <nome-da-skill>
# description: <descricao ativadora>
# ---
```

### Nova skill global (do ecossistema)

```bash
# 1. Instalar globalmente
npx skills add <owner/repo@skill> -g -y

# 2. Linkar no projeto (auto-documentacao)
ln -s ~/.agents/skills/<skill> .agents/skills/<skill>

# 3. Adicionar entrada nesta pagina (secao apropriada)
```

---

## 🚀 Instalacao de skills via skills.sh

[skills.sh](https://skills.sh/) e o marketplace aberto de skills para Claude Code e outros agentes. Skills sao instaladas/atualizadas via a CLI `npx skills`, sem necessidade de instalacao permanente do pacote.

### Pre-requisitos

- **Node.js 18+** com `npm`/`npx` (o comando `npx skills` baixa e executa o pacote sob demanda)
- Acesso a internet para baixar skills do GitHub
- Para instalacao global (`-g`): permissao de escrita em `~/.agents/skills/`

### Comandos principais

| Comando | Proposito |
|---------|-----------|
| `npx skills find [termo]` | Pesquisar skills por palavra-chave (pode ser interativo sem termo) |
| `npx skills add <owner/repo@skill>` | Instalar uma skill especifica |
| `npx skills list` | Listar skills instaladas |
| `npx skills check` | Verificar atualizacoes disponiveis |
| `npx skills update` | Atualizar todas as skills instaladas |
| `npx skills remove <skill>` | Remover skill instalada |

### Flags uteis

- `-g` / `--global` — instala em `~/.agents/skills/` (disponivel em qualquer projeto); **recomendado** para skills reutilizaveis
- `-y` / `--yes` — pula prompts de confirmacao (uso nao interativo, CI, scripts)
- `-l` / `--local` — instala em `.agents/skills/` do projeto atual (sobe pela raiz do repo)

### Fluxo recomendado

**1. Descobrir skills relevantes**

Antes de instalar, consulte o [leaderboard do skills.sh](https://skills.sh/) — skills com muitos installs (10K+) e de fontes confiaveis (`anthropics`, `vercel-labs`, `antfu`, `nuxt`, `microsoft`) sao preferidas.

Alternativamente, busque via CLI:

```bash
npx skills find nuxt           # busca por keyword
npx skills find                # modo interativo (fuzzy search)
```

**2. Instalar a skill globalmente**

```bash
npx skills add antfu/skills@nuxt -g -y
```

Sintaxe: `<owner-github>/<repo>@<nome-da-skill>`. A skill e baixada para `~/.agents/skills/<nome-da-skill>/`.

**3. Linkar no projeto para auto-documentacao**

Este repo mantem symlinks em `.agents/skills/` para as skills globais efetivamente usadas. Isso torna explicita a dependencia do projeto sem duplicar arquivos:

```bash
ln -s ~/.agents/skills/nuxt .agents/skills/nuxt
```

**4. Registrar nesta pagina**

Adicionar entrada na secao apropriada de [Skills](#skills) com: origem, o que faz, quando usar e stack associada.

**5. Commitar**

```bash
git add .agents/skills/nuxt docs/agentes/README.md
git commit -m "[docs] Adicionar skill nuxt ao catalogo do projeto"
```

### Exemplos reais (deste projeto)

```bash
# Backend .NET
npx skills add wshobson/agents@dotnet-backend-patterns -g -y
npx skills add kevintsengtw/dotnet-testing-agent-skills@dotnet-testing-autodata-xunit-integration -g -y

# Frontend Nuxt
npx skills add antfu/skills@nuxt -g -y
npx skills add nuxt/ui@nuxt-ui -g -y

# Qualidade / Testes
npx skills add obra/superpowers@test-driven-development -g -y
npx skills add obra/superpowers@systematic-debugging -g -y

# Arquitetura
npx skills add sickn33/antigravity-awesome-skills@software-architecture -g -y
```

Depois de todas as instalacoes, criar os symlinks:

```bash
cd .agents/skills
for s in dotnet-backend-patterns dotnet-testing-autodata-xunit-integration \
         nuxt nuxt-ui test-driven-development systematic-debugging \
         software-architecture; do
  ln -s ~/.agents/skills/$s $s
done
```

### Setup de novo dev (bootstrap)

Para replicar o catalogo de skills deste projeto em uma maquina nova:

```bash
# 1. Instalar todas as skills globais usadas no projeto
for s in wshobson/agents@dotnet-backend-patterns \
         kevintsengtw/dotnet-testing-agent-skills@dotnet-testing-autodata-xunit-integration \
         antfu/skills@nuxt \
         nuxt/ui@nuxt-ui \
         obra/superpowers@test-driven-development \
         obra/superpowers@systematic-debugging \
         sickn33/antigravity-awesome-skills@software-architecture; do
  npx skills add "$s" -g -y
done

# 2. Os symlinks em .agents/skills/ ja vem no repo — nao precisa recriar
# 3. Confirmar
npx skills list
ls -la .agents/skills/
```

### Manutencao

```bash
# Ver o que esta desatualizado
npx skills check

# Atualizar tudo
npx skills update

# Remover skill nao mais usada
npx skills remove <nome-da-skill>
rm .agents/skills/<nome-da-skill>    # remover symlink
# depois: remover entrada deste README e commitar
```

### Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|----------------|---------|
| `command not found: skills` | Executou `skills` direto sem `npx` | Usar `npx skills ...` (nao precisa instalar globalmente) |
| `Error: ENOENT ~/.agents/skills` | Diretorio ainda nao existe | O primeiro `npx skills add -g` cria automaticamente |
| Symlink quebrado (`ls: cannot access`) | Skill removida globalmente mas symlink permanece | `rm .agents/skills/<skill-quebrada>` |
| Skill nao ativa no Claude | Frontmatter `description:` muito generico | Editar `~/.agents/skills/<skill>/SKILL.md` — `description` deve mencionar keywords que o Claude detecta nos pedidos |

---

## 📚 Referencias

- Padrao `agents.md`: [https://agents.md/](https://agents.md/)
- Marketplace de skills: [https://skills.sh/](https://skills.sh/)
- Diretorio curado: [https://awesome-skills.com/](https://awesome-skills.com/)
- Docs oficiais Anthropic: [https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
