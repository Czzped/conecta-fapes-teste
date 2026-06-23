# Git Flow do ConectaFapes

Este documento explica o fluxo de trabalho dos repositórios técnicos do ConectaFapes e onde o GitHub/app já automatiza parte do processo.

## 1. Ideia geral

O fluxo tem três caminhos principais:

- Desenvolvimento normal: demanda entra no Project, vira branch de trabalho, abre PR para `develop`.
- Release: quando uma versão está pronta, sai de `develop` para produção por uma branch `release/*`.
- Hotfix: correção urgente sai por uma branch `hotfix/*` direto para produção e depois volta para `develop`.

A regra principal é simples: ninguém precisa adivinhar repositório, branch ou destino. Quando o app não tiver informação suficiente, ele não executa automaticamente e deixa para revisão manual.

## 2. Como isso reduz o risco de algo indesejado ir para produção

O Git Flow não tenta adivinhar se uma funcionalidade é boa ou ruim. Isso continua sendo responsabilidade de review, QA e aprovação da equipe.

O que ele faz é impedir os caminhos perigosos:

- ninguém consegue mandar código direto para `main`, `master` ou `develop` sem passar por Pull Request;
- PR para produção só passa se vier de `release/*` ou `hotfix/*`;
- branch comum de desenvolvimento, como `feature/*`, não pode ir direto para produção;
- PR para `develop` precisa vir de branch de trabalho válida;
- todo PR precisa de pelo menos 1 aprovação e conversas resolvidas;
- o status automático `git-flow/pr-policy` bloqueia PR fora do padrão.

Na prática, isso evita casos como:

```text
feature/minha-tarefa -> main
feature/minha-tarefa -> master
develop -> main sem release
push direto em produção
```

Importante: se uma mudança indesejada for aprovada e mergeada em `develop`, ela pode entrar em uma release. Por isso, antes de criar a release, a equipe ainda precisa conferir o que está dentro dela. A automação reduz erro de fluxo e bypass, mas não substitui validação de produto e QA.

## 3. Repositórios envolvidos

O Git Flow está configurado para estes repositórios:

- `leds-conectafapes-backend-admin`
  - integração: `develop`
  - produção: `main`
- `leds-conectafapes-frontend-backoffice`
  - integração: `develop`
  - produção: `main`
- `leds-conectafapes-frontoffice-backend`
  - integração: `develop`
  - produção: `main`
- `leds-conectafapes-frontoffice-frontend`
  - integração: `develop`
  - produção: `main`
- `leds-conectafapes-prestacao-de-contas`
  - integração: `develop`
  - produção: `master`

## 4. Quando uma demanda entra para desenvolvimento

A demanda deve estar no Project com uma Issue/card claro.

Para o app conseguir criar a branch automaticamente, ele precisa saber o repositório técnico. Isso pode vir de duas formas:

- Issue vinculada diretamente ao repositório técnico correto; ou
- campo `Repositório` preenchido no Project.

O campo `Repositório` é um campo de seleção única, ou seja, a pessoa escolhe um dos repositórios permitidos em uma lista. Isso evita texto livre e evita erro de digitação.

Quando o card entra em `In Progress` e o repositório foi identificado, o app cria automaticamente uma branch a partir de `develop`.

Exemplo:

```text
feature/123-cadastro-de-diarias
```

Se o repositório não estiver claro, o app não cria branch. Nesse caso, o card precisa ser revisado ou a branch precisa ser criada de forma assistida informando o repositório correto.

## 5. Desenvolvimento e PR para `develop`

Depois que a branch existe, o desenvolvedor trabalha normalmente nela e abre PR para `develop`.

O GitHub já está protegido para exigir:

- Pull Request obrigatório;
- pelo menos 1 aprovação;
- conversas resolvidas;
- status `git-flow/pr-policy` passando.

Na prática, `develop`, `main` e `master` não são caminho de push direto; a entrada deve ser por PR.

O status `git-flow/pr-policy` é publicado automaticamente pelo app quando um PR é aberto ou atualizado.

Para PRs com destino `develop`, a origem precisa ser uma branch de trabalho válida, como:

- `feature/*`
- `feat/*`
- `fix/*`
- `bugfix/*`
- `chore/*`
- `docs/*`
- `refactor/*`
- `test/*`

Exemplo correto:

```text
feature/123-cadastro-de-diarias -> develop
```

Exemplo bloqueado:

```text
develop -> develop
main -> develop
master -> develop
```

Se a branch estiver fora do padrão, o status falha e o PR fica bloqueado até ajustar.

## 6. Release

A release é preparada via **Action do GitHub** que detecta automaticamente a versão, gera changelog categorizado e cria branches + PRs.

### Como funciona a detecção de versão

O script analisa os commits desde a última tag em cada repositório usando [Conventional Commits](https://www.conventionalcommits.org/):

| Tipo de commit | Bump | Exemplo |
|---|---|---|
| `fix: ...` | **patch** | `v0.1.49 → v0.1.50` |
| `feat: ...` | **minor** | `v0.1.49 → v0.2.0` |
| `BREAKING CHANGE` ou `!:` | **major** | `v0.1.49 → v1.0.0` |

Se houver commits `feat` e `fix` misturados, prevalece o maior (minor > patch).

### Como fazer (passo a passo)

1. Acesse **Actions → [Release ConectaFapes](https://github.com/leds-conectafapes/conectafapes-project/actions/workflows/release-conectafapes.yml)**.
2. Clique **Run workflow**.
3. Marque os repositórios que entram na release.
4. **Deixe versão vazia** para detectar automático, ou digite manual.
5. **Desmarque Executar** = dry-run (só mostra o plano + changelog).
6. Revise o plano.
7. Se estiver tudo certo, rode novamente com **Executar** marcado.

A Action:
- Cria `release/vX.Y.Z` a partir de `develop` em cada repositório
- Abre PR para produção (`main` ou `master`) com **changelog categorizado** (Features, Bug Fixes, Breaking Changes)
- A tag é criada automaticamente pelo worker **após o merge**

### Exemplo de changelog gerado

```markdown
## Release v0.2.0

### ✨ Features
  - página de visualização de Pagamentos (dea9a95) (#282)

### 🐛 Bug Fixes
  - correção nos filtros de prestação de contas (97c7fb7) (#2260, #2261)
```

## 7. Hotfix

Hotfix é usado apenas para correção urgente em produção.

A branch deve seguir o formato:

```text
hotfix/vX.Y.Z
```

Exemplo:

```text
hotfix/v1.4.1
```

O fluxo esperado é:

1. Confirmar que é realmente uma correção urgente de produção.
2. Criar a branch `hotfix/vX.Y.Z` a partir da produção do repositório.
3. Abrir PR da branch `hotfix/*` para produção.
4. O GitHub valida automaticamente que PR para produção só vem de `release/*` ou `hotfix/*`.
5. Depois do merge em produção, o app cria a tag do hotfix.
6. O app abre PR de retorno para `develop`.
7. Se houver uma `release/*` aberta, o app também abre PR de retorno para ela.

Esse retorno é importante para a correção não se perder na próxima release.

## 8. Checklist rápido para a equipe

Antes de iniciar uma demanda:

- A demanda está no Project.
- O campo `Repositório` está preenchido, ou a Issue está no repositório técnico correto.
- O card foi movido para `In Progress`.
- A branch foi criada automaticamente ou foi criada manualmente com o repositório correto.

Antes de abrir PR:

- O PR está indo para `develop`.
- A branch tem prefixo válido.
- O PR referencia a demanda/Issue.
- O status `git-flow/pr-policy` está passando.

Antes de release:

- A versão está definida como `vX.Y`.
- Os repositórios da release estão definidos.
- O plano foi conferido antes de executar.
- O PR da release foi aberto para `main` ou `master`, conforme o repositório.

Antes de hotfix:

- A correção é realmente urgente de produção.
- A versão está definida como `vX.Y.Z`.
- O PR vai de `hotfix/*` para produção.
- Depois do merge, os PRs de retorno para `develop` e release aberta devem ser revisados e mergeados.
