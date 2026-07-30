---
name: promover-para-estavel
description: Promove telas do protótipo para o ambiente estável — confere se está tudo publicado, pergunta o que mudou em linguagem de produto, monta os links diretos das telas alteradas e abre o Pull Request que cria o card de aprovação no Project 43. Use quando terminar uma tela e quiser mandá-la para a equipe de desenvolvimento.
---

# promover-para-estavel

Leva uma tela pronta da `prototipagem` para o **ambiente estável**, que é a referência que
a equipe de desenvolvimento usa para implementar.

Na prática: confere as pré-condições, entende com você o que mudou, monta os **links
diretos das telas alteradas** e abre o Pull Request. O card de aprovação no
[Project 43](https://github.com/orgs/leds-conectafapes/projects/43) nasce sozinho quando o
PR é aberto.

## Quando usar

Quando uma tela (ou um conjunto delas) estiver **pronta para desenvolvimento**. Não use
para trabalho em andamento — o que está na `prototipagem` já fica visível no ambiente de
protótipo, sem precisar promover.

## Princípio

Quem vai aprovar não abre o código. A pessoa abre o **card**, clica no link, olha a tela e
decide. Então o card precisa de: **o que mudou, em uma frase**, e **onde ver**.

Na dúvida sobre o que a mudança significa em linguagem de produto, **pergunte** — é melhor
uma pergunta agora do que um card que ninguém entende. Use a ferramenta de perguntas
(`AskUserQuestion`), com opções concretas quando fizer sentido.

## Passo 1 — Conferir se dá para promover

```bash
git fetch origin
git status                                  # nada pendente sem commit?
git log --oneline origin/main..origin/prototipagem   # o que será promovido
```

Confira e **pare, avisando, se algo estiver errado**:

| Verificação | Se falhar |
|---|---|
| Está na branch `prototipagem` | Peça para trocar: `git checkout prototipagem` |
| Não há alterações sem commit/push | O que não foi enviado não entra na promoção nem aparece no link |
| Existe pelo menos 1 commit à frente da `main` | Não há nada a promover |
| O diff toca `prototype/frontOffice/` ou `prototype/backoffice/` | Mudanças fora dessas pastas não geram card nem publicam |

Confirme também que o **deploy do protótipo já concluiu** — senão os links do card vão
mostrar a versão antiga:

```bash
gh run list --branch prototipagem --limit 3
```

Se o `gh` não estiver disponível, peça para conferir a aba **Actions** do repositório.

## Passo 2 — Descobrir o que mudou

```bash
git diff --stat origin/main...origin/prototipagem -- prototype/
git diff origin/main...origin/prototipagem -- prototype/
```

Traduza o diff em **telas e fluxos**, não em arquivos. Um arquivo de layout alterado pode
significar "todas as telas mudaram"; um componente isolado, "só esta tela".

**Pergunte quando não tiver certeza**, por exemplo:

- o diff mexe em algo transversal (layout, tema, menu) e você não sabe se a intenção era
  afetar todas as telas ou só uma;
- há mudança de texto/rótulo cujo motivo não é óbvio;
- o commit diz "ajustes" e o diff toca coisas não relacionadas;
- você não consegue nomear a mudança em uma frase que um aprovador entenda.

Pergunte em linguagem de produto ("essa mudança é para o coordenador ou para o bolsista?"),
nunca em linguagem de código.

## Passo 3 — Montar os links das telas alteradas

Este é o ponto que faz o card ser útil. Os dois apps navegam **por URL**, então cada tela
alterada tem um link direto no ambiente de protótipo.

Bases:

- front-office: `https://frontoffice-conecta.vercel.app`
- backoffice: `https://backoffice-conecta.vercel.app`

**Front-office — o perfil faz parte do caminho:** `/{perfil}/{tela}`

Perfis: `cidadao`, `voluntario`, `bolsista`, `bolsista-solicitar-bolsa`,
`minha-equipe-exemplo`, `proponente`, `coordenador`, `avaliador`, `diretor`, `reitor`.

Exemplos: `/coordenador/minha-equipe`, `/bolsista/certificados`, `/reitor/dashboard`,
`/cidadao/edital/1`.

> Uma tela alterada que aparece para vários perfis rende **um link por perfil relevante**.
> Se a mudança é do menu do coordenador, o link é `/coordenador/...` — não adianta mandar
> `/bolsista/...`, onde o aprovador não veria a diferença.

**Backoffice — caminho direto:** `/parceria`, `/financeira`, `/financeira/1`,
`/configuracoes/rubricas`, …

**Onde conferir o mapa atual** (é a fonte da verdade, e muda com o tempo):

- front-office: `prototype/frontOffice/src/app/routing/paths.ts` e `AppRoutes.tsx`
- backoffice: `prototype/backoffice/src/app/routing/paths.ts`

Se não conseguir determinar o perfil ou a tela a partir do diff, **pergunte**: "em qual
tela eu vejo essa mudança?" é uma pergunta legítima e rápida de responder.

## Passo 4 — Escrever o corpo do PR

O **corpo do PR vira o corpo do card**. Escreva para quem vai aprovar, não para quem
programa. Use o template
[`promocao-estavel`](../../../.github/PULL_REQUEST_TEMPLATE/promocao-estavel.md):

```markdown
## Promoção de protótipo → estável

App(s) promovido(s):
- [ ] front-office (`prototype/frontOffice`)
- [x] backoffice (`prototype/backoffice`)

## Issue relacionada
- Resolve leds-conectafapes/conectafapes-project#NNN
  (ou: "Sem issue de planejamento: <motivo em uma linha>")

## Auditoria das mudanças

### Resumo
<1 a 3 frases, em linguagem de produto: o que muda para quem usa>

### Onde ver
- <Tela> — https://backoffice-conecta.vercel.app/parceria
- <Tela, perfil coordenador> — https://frontoffice-conecta.vercel.app/coordenador/minha-equipe

### Telas alteradas
- <Tela> — <o que mudou>

### Telas adicionadas / removidas
- <apenas se houver>

### Fluxos afetados
- <navegação, validações, estados — ou "nenhum">

### Observações para o desenvolvimento
- <pontos de atenção para quem for implementar no repo de produto>

## Checklist de promoção
- [x] A tela está finalizada e validada.
- [x] Auditoria preenchida, com os links.
- [ ] **2 aprovações** neste PR.
```

Título do PR: comece com a `[FLAG]` — `[FEAT]` para tela nova, `[FIX]` para correção,
`[REFACTOR]` para reorganização.

**Mostre o texto para a pessoa antes de abrir o PR** e pergunte se o resumo está fiel.
Quem desenhou a tela sabe explicar melhor do que o diff.

## Passo 5 — Abrir o PR

```bash
gh pr create --base main --head prototipagem \
  --title "[FEAT] <titulo>" --body-file <arquivo com o corpo>
```

Sem o `gh`, entregue o texto pronto e o link para abrir manualmente:
`https://github.com/leds-conectafapes/conectafapes-project/compare/main...prototipagem?template=promocao-estavel.md`

## Passo 6 — Explicar o que acontece agora

Depois de abrir, confirme e informe:

1. O **card** foi criado no Project 43 em `In Validation`, na sprint corrente e no squad
   Design — o link aparece num comentário do PR.
2. São necessárias **2 aprovações** de outras pessoas. Você não pode aprovar o próprio PR,
   e nem quem tem admin passa por cima.
3. Ao ser aprovado e mergeado: o **estável publica** e o card vai para
   **Pronto para desenvolvimento**.
4. Se for recusado (PR fechado sem merge), o card vai para **Desaprovado** e o protótipo
   segue como está — nada se perde.

## Cuidados

- **Não faça merge sozinho** nem tente contornar a proteção: a regra das 2 aprovações é o
  motivo de o ambiente estável ser confiável.
- **Não prometa prazo de publicação**: os runners são compartilhados e o job pode esperar
  na fila.
- Se o PR ficar aberto e novas mudanças forem para a `prototipagem`, elas **entram na
  mesma promoção** — o PR acompanha a branch. Avise a pessoa disso.

Fluxo completo: [`docs/management/ambientes-prototipo.md`](../../../docs/management/ambientes-prototipo.md)
