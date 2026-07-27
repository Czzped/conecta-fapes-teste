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
  Rode `/auditar-promocao` no Claude Code para gerar este relatório a partir do
  diff (origin/main..HEAD) e cole o resultado abaixo. Inclua telas adicionadas,
  alteradas e removidas, fluxos afetados e screenshots.
-->

_(cole aqui o relatório de auditoria)_

## Checklist de promoção
- [ ] A tela está finalizada e validada (não é mais "em prototipagem").
- [ ] Auditoria acima preenchida (telas/fluxos alterados + screenshots).
- [ ] Issue de planejamento vinculada.
- [ ] **2 aprovações** neste PR (o gate de aprovação da promoção é aqui).

> ⚠️ A aprovação acontece **neste Pull Request** (a `main` exige 2 reviews).
> Ao mergear, a publicação é automática — não há segunda confirmação depois.
>
> O merge dispara: o workflow **Deploy Estável** publica em
> `frontoffice-conecta-estavel.vercel.app` / `backoffice-conecta-estavel.vercel.app`;
> e **Promoção → Project 43** cria a issue "Pronto para Desenvolvimento" no board #43.
>
> Fluxo completo: [docs/management/ambientes-prototipo.md](../../docs/management/ambientes-prototipo.md)
