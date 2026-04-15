# Arquitetura do Frontend — Portal Coordenador

[← Voltar ao Portal Coordenador](README.md)

> Este documento descreve a arquitetura do **frontend** do Portal Coordenador. Para a arquitetura do backend (Clean Architecture, CQRS, infraestrutura), consulte [architecture/](../../architecture/README.md).

## Objetivo

Este documento descreve como o frontend esta organizado hoje, quais sao as responsabilidades de cada camada e como os modulos de negocio se conectam. O foco aqui nao e teoria generica, e sim a estrutura real do projeto.

## Visao geral

O projeto segue uma modularizacao em tres eixos principais:

1. `common/`: infraestrutura e recursos compartilhados por toda a aplicacao.
2. `layouts/`: shell visual e comportamental das areas autenticadas.
3. `modules/`: contextos de negocio isolados por dominio funcional.

Na pratica, o fluxo principal da aplicacao e este:

```text
main.ts
  -> registro de plugins globais
  -> App.vue
  -> UApp + RouterView
  -> router principal
  -> LayoutBase nas areas internas
  -> view do modulo
  -> composable
  -> service/factory
  -> ApiProvider / HttpClient
  -> backend
```

## Estrutura macro

```text
src/
|-- App.vue
|-- main.ts
|-- style.css
|-- ui.config.ts
|-- common/
|   |-- api/
|   |-- assets/
|   |-- components/
|   |-- composables/
|   |-- constants/
|   |-- plugins/
|   |-- router/
|   |-- store/
|   |-- types/
|   `-- utils/
|-- layouts/
|   |-- components/
|   |-- composables/
|   `-- LayoutBase.vue
`-- modules/
    |-- autenticacao/
    |-- NuxtUI/
    |-- PortalCoordenador/
    `-- PrestacaoContas/
```

## 1. Bootstrap da aplicacao

O ponto de entrada e `src/main.ts`. Ele cria a app Vue e registra os plugins nesta ordem:

1. Pinia para estado de cliente.
2. i18n para internacionalizacao.
3. Vue Query para estado assincrono e cache de servidor.
4. Vue Router para navegacao.
5. Nuxt UI para os componentes base da interface.

Depois disso, a aplicacao monta `App.vue`, que encapsula tudo em `UApp`. Isso e importante porque, de acordo com a propria arquitetura do Nuxt UI, `UApp` e o provider global da interface: ele habilita locale compartilhado, toasts, tooltips, modais e slideovers. No projeto, o locale do `UApp` e derivado do `vue-i18n`.

## 2. Shell da aplicacao

O shell autenticado mora em `src/layouts/LayoutBase.vue`.

Ele concentra responsabilidades transversais:

- cabecalho e sidebar da area interna
- alternancia de tema claro/escuro
- exibicao do menu mobile com `USlideover`
- sincronizacao do contexto de projeto
- redirecionamento defensivo quando a rota exige coordenacao e o usuario nao possui esse papel

O composable `src/layouts/composables/useAppMenu.ts` monta o menu lateral com base em:

- rota atual
- traducoes do i18n
- papel do usuario no projeto selecionado

Esse desenho evita que cada modulo precise repetir logica de navegacao ou permissao de interface.

## 3. Camada compartilhada (`common`)

`src/common` funciona como o nucleo reutilizavel da aplicacao. Ele nao representa um dominio de negocio especifico; representa infraestrutura e contratos compartilhados.

### 3.1 API e infraestrutura HTTP

`src/common/api` concentra a base de comunicacao com backend:

- `interface.ts`: contrato `HttpClientInterface`
- `adapters/http/axios.client.ts`: implementacao concreta com Axios
- `provider.ts`: providers singleton para APIs geral, auth, dashboard e mock
- `config.ts`: base URLs e flags vindas de variaveis de ambiente
- `interceptors/`: tratamento padrao de erros e autenticacao
- `factory.ts`: factories de servicos compartilhados

Esse desenho desacopla os services da biblioteca HTTP concreta. Os modulos dependem do contrato e dos providers, nao de `axios.create(...)` espalhado pela codebase.

Um detalhe relevante: `error.interceptors.ts` centraliza o tratamento de falhas. Erros `401` derrubam a sessao e erros nao tratados redirecionam para a rota de erro. Isso reduz logica repetida nas telas.

### 3.2 Estado compartilhado

`src/common/store/projeto.store.ts` e um dos pontos mais importantes da arquitetura. Ele mantem:

- lista de projetos disponiveis para o usuario autenticado
- projeto atualmente selecionado
- indicador se o usuario e coordenador naquele contexto
- status de carregamento do contexto de projeto

Esse store serve como contexto global do portal. Varias areas dependem dele para definir menu, guardas de rota e consultas parametrizadas.

### 3.3 Plugins

`src/common/plugins` registra integracoes globais:

- `pinia.ts`
- `i18n/index.ts`
- `dayjs.ts`
- `userway.ts`

O arquivo `index.ts` funciona como compositor dessas dependencias. Assim, o bootstrap da aplicacao continua pequeno e previsivel.

### 3.4 Utilitarios e recursos compartilhados

As demais pastas de `common` organizam recursos horizontais:

- `assets/`: fontes e imagens compartilhadas
- `components/`: componentes genericos, como tela de erro
- `composables/`: hooks reaproveitados entre modulos
- `constants/`, `types/` e `utils/`: contratos, enums leves e formatadores

## 4. Roteamento e isolamento dos modulos

O roteador central fica em `src/common/router/index.ts`, mas ele nao concentra todas as rotas diretamente. Em vez disso, ele agrega as rotas exportadas pelos modulos:

- login vindo de `modules/autenticacao`
- portal interno vindo de `modules/PortalCoordenador`
- prestacao financeira vindo de `modules/PrestacaoContas`
- rota global de erro

Esse modelo traz dois beneficios:

1. O roteador principal continua pequeno.
2. Cada modulo define seu proprio mapa de navegacao.

### Guardas globais

O `beforeEach` do router executa duas regras estruturais:

1. Se a rota exige autenticacao e nao existe usuario carregado, redireciona para `login`.
2. Se a rota exige coordenacao, garante que o store de projetos esteja carregado e valida `ehCoordenador`.

Ou seja: autorizacao nao fica apenas na UI. Ela tambem faz parte da composicao do roteador.

## 5. Modulos de negocio

Os modulos em `src/modules` representam contextos funcionais independentes.

### 5.1 `autenticacao`

Responsabilidades:

- telas e rotas de login
- integracao com o fluxo de autenticacao externo
- store de sessao
- service de autenticacao

Pontos importantes:

- `stores/auth.store.ts` combina Pinia com Vue Query
- o store expoe operacoes de alto nivel (`login`, `logout`, `onLogin`, `refetchUserIfNotFetched`)
- o service concreto e entregue por `services/factory.ts`, usando `ApiAuthProvider`

Esse modulo controla sessao, mas nao assume o contexto de projeto. Essa separacao e intencional.

### 5.2 `PortalCoordenador`

E o modulo principal do produto. Ele concentra o portal autenticado e varias subareas:

- home
- meu projeto
- pagamentos
- minhas informacoes
- minha equipe
- remanejamento

Sua estrutura mistura dois niveis:

1. Um nivel raiz com `view/`, `components/`, `composables/`, `api/`, `entities/` e `store/`.
2. Um nivel de subdominios em `resources/`, como `MinhaEquipe`, `MinhasInformacoes` e `Remanejamento`.

Isso permite manter o modulo coeso sem transformar tudo em uma unica pasta gigante.

Padroes recorrentes nesse modulo:

- views finas, focadas em composicao de tela
- composables que orquestram queries e transformacoes
- services separados por recurso de backend
- factories lazy para evitar acoplamento e inicializacao circular

Um exemplo claro e `useHomeDashboard.ts`, que combina:

- contexto do projeto selecionado
- queries do projeto
- dados de remanejamento
- regra condicional baseada em `ehCoordenador`

Ou seja, a view nao fala diretamente com a API. Ela consome um composable que monta o caso de uso da tela.

### 5.3 `PrestacaoContas`

Representa o dominio de prestacao financeira.

Sua estrutura segue o mesmo padrao modular:

- `api/`: servicos e factories do dominio
- `components/`: blocos visuais do fluxo
- `composables/`: hooks de consulta e manipulacao de formularios
- `view/`: paginas do modulo
- `router.ts`: encapsulamento das rotas do contexto

O modulo entra no roteamento principal como um contexto separado, com prefixo `/prestacao-financeira`, mas continua usando o mesmo shell (`LayoutBase`) e as mesmas infraestruturas compartilhadas.

### 5.4 `NuxtUI`

Hoje esse modulo parece servir como area auxiliar ou experimental. Ele possui rota propria (`/my-information`), mas nao esta plugado no roteador principal atual. Portanto, nao participa do fluxo principal da aplicacao.

## 6. Padrao de fluxo de dados

O frontend combina dois tipos de estado:

- estado de cliente: Pinia
- estado de servidor: Vue Query

### Quando usar Pinia

Pinia fica com estado duradouro ou compartilhado entre rotas, por exemplo:

- sessao autenticada
- projeto selecionado
- papeis do usuario no contexto atual

### Quando usar Vue Query

Vue Query fica com:

- consultas HTTP
- cache
- loading e erro
- refetch
- invalidacao apos mutacoes

Essa divisao reduz stores inchados. O store de autenticacao, por exemplo, usa Vue Query internamente em vez de reimplementar cache e refetch manualmente.

## 7. Sistema de UI e theming

O frontend usa:

- Vue 3
- Vite
- Tailwind CSS v4
- Nuxt UI

### Configuracao global

O Nuxt UI e configurado em dois pontos:

1. `vite.config.ts`, com `ui({ ui: uiConfig })`
2. `src/ui.config.ts`, onde vivem cores e variantes globais

Atualmente `ui.config.ts` centraliza customizacoes para componentes como:

- `toast`
- `card`
- `button`
- `input`
- `textarea`
- `inputDate`
- `select`
- `formField`
- `modal`

Isso significa que o design system base da aplicacao esta concentrado num unico ponto, em vez de ser redefinido tela por tela.

### Estilo base

`src/style.css` importa Tailwind e Nuxt UI e define tokens como:

- `--font-sans`
- `--color-text-muted`
- `--color-text-main`

Com isso, a identidade visual parte de configuracao global e depois desce para os componentes.

## 8. Convencoes arquiteturais observadas

O projeto ja sinaliza algumas convencoes importantes:

### 8.1 Views devem ser finas

As views montam a pagina, mas a regra de negocio e a orquestracao de dados ficam preferencialmente em composables e services.

### 8.2 Cada modulo publica suas rotas

O modulo nao depende de um roteador monolitico. Ele exporta suas rotas e o roteador central apenas compoe.

### 8.3 Infraestrutura compartilhada fica em `common`

Qualquer codigo transversal deve nascer em `common`, nao replicado dentro de cada modulo.

### 8.4 Providers e factories encapsulam dependencia externa

Os services recebem um `HttpClientInterface` via provider/factory. Isso facilita troca de backend, mock e testes.

### 8.5 Contexto de projeto e o eixo do portal

O usuario nao navega apenas autenticado. Ele navega autenticado dentro de um projeto selecionado. Esse contexto influencia:

- menu
- permissao
- queries
- redirecionamentos

## 9. Como evoluir sem quebrar a modularidade

Ao adicionar uma nova feature, a regra pratica deveria ser:

1. Descobrir se ela e transversal ou de dominio.
2. Se for transversal, colocar em `common`.
3. Se for de negocio, criar ou expandir um modulo em `modules`.
4. Deixar a view enxuta e mover a orquestracao para composables.
5. Concentrar acesso HTTP em services/factories.
6. Expor rotas pelo proprio modulo.

## 10. Resumo arquitetural

Em termos arquiteturais, este frontend funciona como um monolito modular no cliente:

- um unico app Vue
- uma infraestrutura compartilhada central
- um shell comum para as areas autenticadas
- modulos de negocio separados por contexto
- estado dividido entre Pinia e Vue Query
- UI padronizada por Nuxt UI e configuracao global de tema

Esse desenho e adequado para o produto atual porque permite compartilhar sessao, layout, tema e contexto de projeto sem perder separacao entre os dominios principais.
