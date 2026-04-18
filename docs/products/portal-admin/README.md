# Portal Admin

Portal administrativo da agencia de fomento (back-office).

[← Voltar aos Produtos](../README.md)

---

## Sobre o Produto

O Portal Admin e a interface principal para operadores, gerentes e diretores da agencia de fomento. Permite gerenciar editais, projetos, modalidades de bolsa, pagamentos, folhas, remessas bancarias e cadastros corporativos.

| Atributo | Valor |
|----------|-------|
| **Perfis de usuario** | Operadores GEPOF, Diretores (DIRAF), Areas Tecnicas, Administradores |
| **Stack** | Vue 3, Nuxt UI |
| **Status** | Em producao (documentacao parcial) |

---

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | Epicos de produto, features e grafo de dependencias |
| [Arquitetura Frontend](architecture.md) | Stack, estrutura do projeto, autenticacao, perfis e diferencas com Portal Coordenador |

---

## Modulos Backend Consumidos

| Modulo | Funcionalidade |
|--------|---------------|
| M001 | Modalidades de Bolsa — cadastro e versionamento |
| M002 | Importacao SIGFAPES — monitoramento e reprocessamento |
| M003 | Gestao de Iniciativas Captadas — visualizacao operacional |
| M004 | Pagamento Bolsistas — folhas, remessas, retornos, guias |
| M005 | Autenticacao |
| M008 | Cadastros Corporativos — pessoas, instituicoes, areas tecnicas |
| M010 | Planejamento Estrategico — Plano, Eixos, Programas e Parcerias (aportes, vigencias, documentos regularizadores) |

---

## Proximos Passos

- Migrar documentacao legada de `docs/deprecated/pagamento-bolsista/` (features de back-office) para esta pasta
- Documentar arquitetura frontend do portal admin
- Vincular features ao roadmap em `management/releases-2026.csv`
