# EP-02 — Shell do Portal e Contexto do Projeto

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M003, M007 |
| **Produto** | Portal Coordenador |
| **Status** | Partial |

## Jornada

O usuario autenticado seleciona um projeto no cabecalho e o portal adapta menu, permissoes e queries ao contexto daquele projeto. Usuarios nao-coordenadores veem menu reduzido.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M003 | [EPIC-M003-005](../../../implementation/modules/M003-gestao-iniciativas-captadas/epics/EPIC-M003-005.md) | Visao Operacional Consolidada | Done |
| M007 | — | API Gateway | A definir (M007 sem EPICs) |

## Cenarios de aceitacao do produto

Cenarios especificos de UX/frontend:

- **Selecionar projeto pelo cabecalho**: dropdown exibe projetos disponiveis e atualiza o contexto global
- **Exibir nome do projeto selecionado**: cabecalho mostra o projeto ativo
- **Exibir menu reduzido para nao coordenador**: itens exclusivos de coordenador sao ocultados
- **Acessar acoes transversais do cabecalho**: tema, idioma, notificacoes e perfil acessiveis
