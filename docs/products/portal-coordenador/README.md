# Portal Coordenador

Portal web do coordenador de projeto para gestao de equipe, bolsas, pagamentos e prestacao de contas.

[← Voltar aos Produtos](../README.md)

---

## Sobre o Produto

O Portal Coordenador e a interface principal para coordenadores de projetos de pesquisa e bolsistas. Permite gerenciar equipe, acompanhar bolsas, visualizar pagamentos, realizar remanejamentos, prestar contas financeiras e solicitar aditivos. O portal opera no contexto de um projeto selecionado pelo usuario autenticado.

| Atributo | Valor |
|----------|-------|
| **Perfis de usuario** | Coordenador de Projeto, Bolsista/Participante |
| **Stack** | Vue 3, Vite, Nuxt UI, Tailwind CSS v4, Pinia, Vue Query, Axios |
| **Autenticacao** | Acesso Cidadao (OpenID Connect) |
| **Status** | Em producao |
| **Prototipo navegavel** | [Vercel Front-office](https://frontoffice.conectafapes.com.br/) |

---

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | Epicos de produto, features e grafo de dependencias |
| [Arquitetura Frontend](architecture.md) | Estrutura modular do frontend: common, layouts, modules, routing |

---

## Modulos Backend Consumidos

| Feature | Titulo | Modulos backend | Status |
|---------|--------|-----------------|--------|
| [EP-01](features/EP-01-autenticacao-acesso-cidadao.md) | Autenticacao Acesso Cidadao | M005 | Done |
| [EP-02](features/EP-02-shell-portal-contexto-projeto.md) | Shell do Portal e Contexto do Projeto | M003, M007 | Partial |
| [EP-03](features/EP-03-pagina-inicial-portal.md) | Pagina Inicial do Portal | M003, M009 | Partial |
| [EP-04](features/EP-04-gestao-perfil-usuario.md) | Gestao de Perfil do Usuario | M008 | Done |
| [EP-05](features/EP-05-gestao-documentos-usuario.md) | Gestao de Documentos do Usuario | M009 | Done |
| [EP-06](features/EP-06-meu-projeto.md) | Meu Projeto | M003, M009 | Done |
| [EP-07](features/EP-07-minha-equipe-acompanhamento-bolsas.md) | Minha Equipe e Acompanhamento de Bolsas | M003, M009 | Done |
| [EP-08](features/EP-08-cadastro-edicao-bolsista.md) | Cadastro e Edicao de Bolsista | M003, M009 | Done |
| [EP-09](features/EP-09-pagamentos-bolsa.md) | Pagamentos de Bolsa | M004 | Done |
| [EP-10](features/EP-10-remanejamento-bolsas.md) | Remanejamento de Bolsas | M013 | Partial |
| [EP-11](features/EP-11-prestacao-financeira.md) | Prestacao Financeira | M014 | Partial |
| [EP-12](features/EP-12-aditivo-bolsa.md) | Aditivo de Bolsa | M009, M015 | Prototype |

---

## Relacao com Management

- Entregas rastreadas em [releases-2026.csv](../../management/releases-2026.csv) como produto "PORTAL FAPES - COORDENADOR"
- [Roadmap Q2](../../management/roadmap.md#q2-abril-a-junho-trimestre-atual) lista features planejadas para o trimestre atual
