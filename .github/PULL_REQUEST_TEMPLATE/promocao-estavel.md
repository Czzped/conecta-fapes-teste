<!--
  Template para PROMOVER uma tela do protótipo (prototipagem -> main / estável).
  Para usar este template, abra o PR com ?template=promocao-estavel.md na URL,
  ou selecione "promocao-estavel" na lista de templates.

  🚨 NÃO ESQUEÇA A [FLAG] NO TÍTULO DO PR (ex.: [FEAT], [FIX], [REFACTOR]).
-->

## Promoção de protótipo → estável

App(s) promovido(s):
- [ ] front-office (`prototype/frontOffice`)
- [ ] backoffice (`prototype/backoffice`)

## Issue relacionada
- Resolve leds-conectafapes/conectafapes-project#[NUMERO-ISSUE]

## Auditoria das mudanças (gerada com o Claude)
<!--
  Rode `/promover-para-estavel` no Claude Code: ele confere se está tudo publicado,
  pergunta o que mudou, monta os LINKS DIRETOS das telas alteradas e preenche isto.
  Os links são o que permite aprovar sem abrir o código.
-->

_(cole aqui o relatório de auditoria)_

## Checklist de promoção
- [ ] A tela está finalizada e validada (não é mais "em prototipagem").
- [ ] Auditoria acima preenchida, **com os links diretos das telas alteradas**.
- [ ] Issue de planejamento vinculada.
- [ ] **2 aprovações** neste PR (o gate de aprovação da promoção é aqui).

> 📋 **Ao abrir este PR**, um card **"[Promoção]"** é criado no
> [Project 43](https://github.com/orgs/leds-conectafapes/projects/43) em
> **In Validation**, com o link do protótipo e a auditoria. Ele é a peça que a equipe
> usa para avaliar a tela — o link aparece num comentário aqui.
>
> ⚠️ A **aprovação acontece neste Pull Request** (a `main` exige 2 reviews).
> Ao mergear, a publicação é automática — não há segunda confirmação depois.
>
> O merge dispara **Estável · front-office** / **Estável · backoffice** (só o do app que
> mudou), publicando em `frontoffice-conecta-estavel.vercel.app` /
> `backoffice-conecta-estavel.vercel.app`, e move o card para
> **Done** e fecha a issue. Fechar sem merge move o card para **Desaprovado**.
>
> Fluxo completo: [docs/management/ambientes-prototipo.md](../../docs/management/ambientes-prototipo.md)
