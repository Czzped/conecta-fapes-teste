---
name: auditar-promocao
description: Gera o relatório de auditoria de uma promoção do protótipo (prototipagem → estável) a partir do diff, para colar no PR. Use ao abrir um PR de promoção dos apps em prototype/.
---

# auditar-promocao

Gera um **relatório de auditoria** das mudanças de UX entre o ambiente estável atual
(`origin/main`) e o que está sendo promovido, para colar no corpo do Pull Request de
promoção (`prototipagem → main`). Tudo é feito localmente — não há custo de CI.

## Quando usar

Antes de abrir (ou ao revisar) um PR que promove telas do protótipo de `prototipagem`
para `main` (ambiente estável). Apps no escopo: `prototype/frontOffice` e
`prototype/backoffice`.

## Instruções

1. Garanta que `origin/main` está atualizado: `git fetch origin main`.
2. Levante o diff da promoção, restrito aos apps do protótipo:
   - `git diff --stat origin/main...HEAD -- prototype/frontOffice prototype/backoffice`
   - `git diff origin/main...HEAD -- prototype/frontOffice prototype/backoffice`
   Liste também os commits: `git log --oneline origin/main..HEAD -- prototype/`.
3. Identifique, por app, o que mudou em termos de **telas/fluxos** (não só arquivos):
   - **Telas adicionadas** — novas páginas/rotas/componentes de tela.
   - **Telas alteradas** — o que mudou visual/comportamentalmente em cada uma.
   - **Telas removidas** — o que saiu.
   - **Fluxos afetados** — navegação, validações, estados (ex.: login, inscrição, prestação de contas).
4. (Recomendado) Capture **screenshots** das telas alteradas rodando o app localmente
   (`make frontoffice` / `make backoffice`) e use a ferramenta de preview/browser para
   tirar prints; referencie-os no relatório.
5. Produza o relatório no formato abaixo e entregue pronto para colar no PR (seção
   "Auditoria das mudanças" do template `promocao-estavel.md`).

## Formato de saída

```markdown
### Resumo
<1-3 frases sobre o que esta promoção entrega>

### front-office (`prototype/frontOffice`)
**Telas adicionadas**
- <Tela> — <o que é / rota>

**Telas alteradas**
- <Tela> — <o que mudou> (screenshot: <link/print>)

**Telas removidas**
- <Tela> — <motivo>

**Fluxos afetados**
- <fluxo> — <impacto>

### backoffice (`prototype/backoffice`)
<mesma estrutura; omita se não houver mudanças>

### Observações para o desenvolvimento
- <pontos de atenção para quem vai implementar no repo de produto>
- Repositório de produto alvo: front-office → `leds-conectafapes-frontoffice-frontend`; backoffice → `leds-conectafapes-frontend-backoffice`.
```

## Notas
- Não inclua segredos nem tokens no relatório.
- Se o PR tocar os dois apps, gere as duas seções.
- Mantenha o foco em **mudança de produto/UX**, não em detalhes de implementação irrelevantes para o handoff.
