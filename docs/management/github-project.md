# GitHub Project — Conecta Fapes

Registro do projeto GitHub usado para organizar issues, EPICs e user stories da plataforma.

[← Voltar ao Management](README.md)

---

## Informacoes do Board

| Atributo | Valor |
|----------|-------|
| **Nome** | Conecta Fapes |
| **Numero** | 43 |
| **ID (GraphQL)** | `PVT_kwDOCqjXps4BUK-d` |
| **URL** | https://github.com/orgs/leds-conectafapes/projects/43 |
| **Organizacao** | leds-conectafapes |

## Como adicionar issue ao board via CLI

```bash
gh issue edit <NUMERO> --repo leds-conectafapes/conectafapes-project --add-project "Conecta Fapes"
```

## Como adicionar via GraphQL API

```graphql
mutation {
  addProjectV2ItemById(input: {
    projectId: "PVT_kwDOCqjXps4BUK-d",
    contentId: "<ISSUE_NODE_ID>"
  }) {
    item { id }
  }
}
```

## Convencoes

- **Todas as issues** relacionadas ao projeto Conecta FAPES devem ser adicionadas ao board 43
- EPICs, User Stories, Tasks e Bugs entram no mesmo board
- Issues de design/discovery tambem entram (Leticia, Marcela)
- O board e visivel publicamente para toda a equipe
