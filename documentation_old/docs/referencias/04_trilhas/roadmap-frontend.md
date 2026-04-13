---
sidebar_position: 2
---

# Trilha Frontend

## Objetivo Geral:

Aprender conceitos de front-end com Vue, frameworks como Vuetify, e boas práticas de desenvolvimento.
Cada capítulo possui um tempo mínimo de duração necessário para assistir aos conteúdos indicados aqui.
Isso pode ser utilizado para comparar se seus estudos estão adiantados ou se você está encontrando
dificuldades, e nesse caso, seria interessante pedir orientação para alguma pessoa.

-> [[Recomendação] - Complemente o aprendizado com o w3schools](https://www.w3schools.com/)

## 1. Introdução ao Vue.js 3 (4h)

Objetivo: Entender a estrutura e funcionamento do framework Vue.js.

-   Tarefas:
    -   Trabalhar com diretivas (`v-for`, `v-if`, `v-model`, etc.).
    -   Praticar a reatividade e entender o uso de `ref`, `reactive`, e `computed`.
    -   Estudar o sistema de componentes do Vue.
    -   Compreender o ciclo de vida dos componentes.
    -   Entender sobre **Document Object Model** (DOM) e como funciona o interpretador.
-   Referências:
    -   [[Vídeo Aulas] - Curso completo sobre Vue.js 3](https://www.youtube.com/watch?v=9DRY-aNPta0&list=PLcoYAcR89n-qTYqfWTGxXMnAvCqY3JF8w)
    -   [[Documentação] - Documentação oficial do Vue.js 3](https://vuejs.org/guide/introduction.html)

## 2. Arquitetura de Projetos Vue.js (1:30h)

Objetivo: Organizar um projeto Vue.js corretamente, seguindo os padrões do LEDS.

-   Tarefas:
    -   Estruturar o projeto usando boas práticas de organização de pastas e arquivos.
    -   Explorar a separação de lógica (composição de componentes, reutilização de código).
    -   Implementar roteamento com `vue-router`.
    -   Criar estados globais com `Pinia` para gerenciar dados complexos.
-   Referências:
    -   [[Video Aulas] - Padrão Model View Controller](https://www.youtube.com/watch?v=ZW2JLtX4Dag)
    -   [[Video Aulas] - Vue Router part. 1](https://www.youtube.com/watch?v=TMzZDTFxOjw&list=PLcoYAcR89n-qTYqfWTGxXMnAvCqY3JF8w&index=17)
    -   [[Video Aulas] - Vue Router part. 2](https://www.youtube.com/watch?v=znL_IDGNApU&list=PLcoYAcR89n-qTYqfWTGxXMnAvCqY3JF8w&index=18)
    -   [[Documentação] - Guia de estrutura - Vuex](https://vuex.vuejs.org/ptbr/guide/structure.html)
    -   [[Documentação] - Documentação oficial do Pinia](https://vuex.vuejs.org/ptbr/guide/structure.html)

## 3. Vuetify: Interface de Usuário (UI) (3h)

Objetivo: Desenvolver Interfaces de Usuário (UIs) modernas e responsivas utilizando Vuetify.

-   Tarefas:
    -   Entender o funcionamento do grid system e layout responsivo do Vuetify.
    -   Explorar e customizar componentes de interface: tabelas, botões, modais, formulários.
    -   Implementar temas e customização de design.
    -   Praticar com componentes avançados (como `v-data-table`, `v-dialog`, `v-select`).
-   Referências:
    -   [[Vídeo Aulas] - Curso completo sobre Vuetify](https://www.youtube.com/watch?v=LCSQK_Gcvnk&list=PLcoYAcR89n-qZmFmfc0UGBqpN1RPn8S2m)
    -   [[Documentação] - Dialog component — Vuetify](https://vuetifyjs.com/en/components/dialogs/#usage)
    -   [[Documentação] - Select component — Vuetify](https://vuetifyjs.com/en/components/selects/#usage)
    -   [[Documentação] - Forms component — Vuetify](https://vuetifyjs.com/en/components/forms/#rules)
    -   [[Documentação] - Data Tables component — Vuetify](https://vuetifyjs.com/en/components/data-tables/introduction/)

## 4. Boas Práticas com TypeScript (3h)

Objetivo: Utilizar TypeScript para adicionar tipagem estática e aumentar a confiabilidade do código.

-   Tarefas:
    -   Definir corretamente as tipagens para dados e componentes.
    -   Aprender sobre interfaces, tipos, e a integração com o Vue 3 (`script setup` com `lang="ts"`).
    -   Refatorar código para usar TypeScript de maneira eficiente.
-   Referências:
    -   [[Tutorial] - Curso completo sobre Typescript](https://www.youtube.com/watch?v=WUjIViNk8FI&list=PLyugqHiq-SKe_waUyoJIA60-OuBeVOtx0&index=3)
    -   [[Tutorial] - Refactoring Vue 3 code | Reusable Form Component | Reusable Components](https://www.youtube.com/watch?v=rBDBXzInFmc)

## 5. Gerenciamento de Estado e APIs (2:30h)

Objetivo: Sincronizar o front-end com APIs, manipulando dados de maneira eficiente.

-   Tarefas:
    -   Integrar o front-end com APIs utilizando `axios`.
    -   Manipular respostas de APIs assíncronas (async/await).
    -   Implementar paginação e filtros em tabelas com base em dados da API.
    -   Estudar controle de erro e feedback ao usuário (ex: `Swal` para mostrar alertas de sucesso ou falha).
-   Referências:
    -   [[Tutorial] - Vue.js 3 Tutorial for Beginners #6 - Using Axios to Consume APIs in Vue 3](https://www.youtube.com/watch?v=7BoUqFq31oI)
    -   [[Vídeo Aulas] - Curso vue.js 3 com axios](https://www.youtube.com/watch?v=KjL6K3vi7n8&list=PLcoYAcR89n-pbc60vYzVD1Fva5KaPmlGQ&index=2)
    -   [[Documentação] - Usando Axios para Consumir APIs — Vue.js 3](https://axios-http.com/docs/api_intro)

## 6. Componentização e Reutilização de Código (1:30h)

Objetivo: Reutilizar componentes para aumentar a eficiência no desenvolvimento.

-   Tarefas:
    -   Criar componentes base (ex: `BaseBreadcrumb`, tabelas genéricas) para evitar repetição de código.
    -   Desenvolver lógica reutilizável com `mixins` ou `composables`.
    -   Refatorar o projeto para dividir funcionalidades em componentes menores e mais reutilizáveis.
-   Referências:
    -   [[Documentação] - Breadcrumbs component — Vuetify](https://vuetifyjs.com/en/components/breadcrumbs/#usage)

## 7. Melhorias de Desempenho e Otimização (2h)

Objetivo: Melhorar o desempenho da aplicação Vue.js.

-   Tarefas:
    -   Implementar lazy loading de componentes e roteamento.
    -   Utilizar técnicas de memoization para evitar recomputações desnecessárias.
    -   Estudar a otimização de tabelas grandes com paginação e filtragem eficiente.
    -   Utilizar funções assíncronas para carregamento assíncrono.
-   Referências:
    -   [[Documentação] - Lazy component — Vuetify](https://vuetifyjs.com/en/components/lazy/#usage)
    -   [[Documentação] - Pagination component — Vuetify](https://vuetifyjs.com/en/components/paginations/#usage)

## 8. Testes e Qualidade de Código (2:45h)

Objetivo: Garantir a qualidade do código com testes e ferramentas de linting.

-   Tarefas:
    -   Configurar linting e formatação automática com ESLint e Prettier.
    -   Realizar testes E2E com o framework de testes Cypress.
-   Referências:
    -   [[Documentação] - Testes do Sistema SLAVE ONE](https://dev.to/marcela_lage_094e814c6a4e/documentacao-dos-testes-do-sistema-slave-one-2kmb)
    -   [[Documentação] - Fixtures do Cypress para testes](https://dev.to/gustavoacaetano/fixtures-do-cypress-para-testes-1748)
