# ADR-002: Frontend em Vue com Nuxt UI

| Atributo | Valor |
|----------|-------|
| **Status** | Aceita |
| **Data** | 2026-04-13 |
| **Autores** | Time de Arquitetura ConectaFAPES |
| **Modulos impactados** | M001, M002, M003, M004, M005, M006, M007, M009 |

## Contexto

O ConectaFAPES possui interfaces voltadas a diferentes personas — cidadaos no portal publico, coordenadores e bolsistas na area logada, e analistas da FAPES em paineis administrativos. A escolha do framework frontend impacta a experiencia do usuario, a produtividade do time, a acessibilidade e a capacidade de entrega de interfaces complexas com formularios, tabelas e fluxos multi-etapa.

## Decisao

Adotado **Vue 3 com Nuxt e Nuxt UI**.

A combinacao entrega produtividade alta: roteamento baseado em arquivos, componentes acessiveis e estilizados por padrao, e convencoes claras que facilitam o trabalho em equipe. O Nuxt UI elimina a necessidade de construir um design system do zero, mantendo flexibilidade de customizacao via Tailwind. A Composition API do Vue 3 com TypeScript oferece a expressividade necessaria para encapsular logica de negocio complexa nos composables.

A estrutura de pastas segue as convencoes do Nuxt:

```
app/
  pages/          # Rotas baseadas em arquivos
  components/     # Componentes reutilizaveis
  composables/    # Logica de estado e side-effects reutilizavel
  layouts/        # Layouts de pagina (publico, autenticado, admin)
  middleware/     # Guards de rota (autenticacao, permissoes)
  stores/         # Estado global com Pinia
```

## Consequencias

### Positivas

- Nuxt UI fornece componentes acessiveis (ARIA) por padrao, reduzindo esforco de conformidade com requisitos de acessibilidade governamental
- Roteamento baseado em arquivos reduz configuracao manual e facilita onboarding
- Pinia como gerenciador de estado e leve, com suporte nativo a TypeScript e DevTools
- SSR/SSG via Nuxt permite renderizacao no servidor para o portal publico, melhorando SEO e performance inicial

### Negativas

- Nuxt UI v3 ainda em maturacao — algumas APIs podem mudar entre versoes minor
- Time precisa dominar tanto Vue 3 Composition API quanto as convencoes do Nuxt para extrair o maximo do stack

### Riscos

- Dependencia do ciclo de releases do Nuxt UI pode introduzir breaking changes — mitigado por fixar versoes no package.json e manter changelog monitorado
- Customizacoes visuais extensas podem conflitar com atualizacoes do Tailwind ou do Nuxt UI — mitigado por isolar tokens de design em um arquivo de configuracao central

## Referencias

- [Vue 3 Docs](https://vuejs.org/)
- [Nuxt Docs](https://nuxt.com/)
- [Nuxt UI](https://ui.nuxt.com/)
- [Pinia](https://pinia.vuejs.org/)
