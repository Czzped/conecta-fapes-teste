# Arquitetura do Frontend — Portal Admin

[← Voltar ao Portal Admin](README.md)

> Este documento descreve a arquitetura do **frontend** do Portal Admin. Para a arquitetura do backend (Clean Architecture, CQRS, infraestrutura), consulte [architecture/](../../architecture/README.md).

## Visao geral

O Portal Admin e a interface de back-office da agencia de fomento, utilizada por operadores, gerentes e diretores para gestao administrativa de pagamentos, editais, modalidades, aditivos e financeiro.

### Stack tecnologico

| Tecnologia | Uso |
|------------|-----|
| **Vue 3** | Framework frontend |
| **Nuxt UI** | Biblioteca de componentes |
| **Tailwind CSS** | Estilizacao |
| **Pinia** | Estado de cliente |
| **Vue Query** | Estado de servidor (cache, refetch) |
| **Axios** | Cliente HTTP |

### Componentes de backend consumidos

O Portal Admin consome 3 componentes de backend documentados em [architecture/02-modulos-e-integracoes.md](../../architecture/02-modulos-e-integracoes.md):

| Componente | Descricao |
|------------|-----------|
| **Conect Admin** | Modulo administrativo principal — importacoes SIGFAPES, editais, projetos, alocacoes, bolsistas |
| **Dashboard Pagamento** | Painel analitico de gastos por edital, projeto e bolsista |
| **Modulo Pagamento** | Operacionaliza pagamento via Banestes/BANDES — folhas, remessas, retornos, guias |

## Estrutura do projeto

```text
src/
├── App.vue
├── main.ts
├── common/
│   ├── api/                  # HttpClient, providers, interceptors
│   ├── components/           # Componentes genericos
│   ├── composables/          # Hooks compartilhados
│   ├── router/               # Roteador central
│   ├── store/                # Estado global (sessao, contexto)
│   └── utils/                # Formatadores e helpers
├── layouts/
│   └── LayoutAdmin.vue       # Shell do back-office (header, sidebar, navegacao)
└── modules/
    ├── autenticacao/          # Login via Acesso Cidadao
    ├── pagamento/             # Folhas, remessas, retornos, guias (M004)
    ├── importacao/            # Importacao SIGFAPES (M002)
    ├── modalidades/           # Modalidades de bolsa (M001)
    ├── editais/               # Visualizacao de editais e projetos (M003)
    ├── cadastros/             # Pessoas, instituicoes, areas tecnicas (M008)
    └── dashboard/             # Dashboard de pagamento e financeiro
```

> **Nota:** Esta estrutura e baseada nos modulos de negocio identificados nas features [EPA-01 a EPA-06](backlog.md). A organizacao exata de pastas do codigo pode variar — esta documentacao captura a intencao arquitetural.

## Padrao de fluxo de dados

O frontend segue o mesmo padrao do Portal Coordenador:

- **Estado de cliente** (Pinia): sessao, usuario autenticado, contexto de navegacao
- **Estado de servidor** (Vue Query): dados de folhas, editais, modalidades, pagamentos

```text
View (tela) → Composable (orquestracao) → Service (HTTP) → API Backend (modulo)
```

## Autenticacao e autorizacao

| Aspecto | Implementacao |
|---------|---------------|
| **Autenticacao** | Acesso Cidadao (OpenID Connect) — mesmo fluxo do Portal Coordenador |
| **Autorizacao de rota** | Guards no router verificam perfil (OPERADOR, DIRETOR, AREA_TECNICA) |
| **Autorizacao de UI** | Menu e acoes visiveis conforme perfil do usuario |
| **Autorizacao de backend** | JWT Bearer + OpenFGA (ver [ADR-007](../../architecture/adr/ADR-007-autorizacao-openfga.md)) |

### Perfis do Portal Admin

| Perfil | Funcionalidades |
|--------|----------------|
| **Operador GEPOF** | Calendario, folhas, remessas, importacao, cadastros |
| **Diretor (DIRAF)** | Autorizar/rejeitar folhas |
| **Area Tecnica** | Liberar editais por competencia |
| **Administrador** | Gestao de modalidades, configuracoes |

## Diferencas em relacao ao Portal Coordenador

| Aspecto | Portal Coordenador | Portal Admin |
|---------|-------------------|--------------|
| **Contexto principal** | Projeto selecionado | Modulo funcional (pagamento, importacao, etc.) |
| **Perfil** | Coordenador, Bolsista | Operador, Diretor, Area Tecnica |
| **Navegacao** | Menu adaptado por projeto | Menu adaptado por perfil/modulo |
| **Composicao de telas** | Multi-modulo por tela | Majoritariamente 1:1 modulo:tela |
| **BFF planejado** | BFF Coordenador ([ADR-005](../../architecture/adr/ADR-005-adocao-bff.md)) | BFF Admin ([ADR-005](../../architecture/adr/ADR-005-adocao-bff.md)) |

## Evolucao planejada

1. **BFF Admin** — camada de composicao para Dashboard de Pagamento (M004 + M003 + M008) e Dashboard Financeiro (M016). Ver [ADR-005](../../architecture/adr/ADR-005-adocao-bff.md).
2. **Gestao Financeira (Q2)** — novos modulos de tela para M016 (plano de contas, fluxo de caixa).
3. **Gestao de Aditivos (Q2)** — telas administrativas para M009/M015.
