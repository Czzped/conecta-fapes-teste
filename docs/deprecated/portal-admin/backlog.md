# Backlog de Épicos — ConectaFapes Backend Admin

> Versão: 2026-04-14 (atualizado)

| ID    | Título                                          | Bounded Context             | Status | Detalhes |
|-------|-------------------------------------------------|-----------------------------|--------|----------|
| EP-01 | Cadastro e Gestão de Aplicações                 | Aplicacoes                  | Done   | [feature/ep-01](features/ep-01-cadastro-gestao-aplicacoes.md) |
| EP-02 | Cadastro e Gestão de Modalidades de Bolsas      | CadastroModalidadesBolsas   | Done   | [feature/ep-02](features/ep-02-cadastro-gestao-modalidades-bolsas.md) |
| EP-03 | Gestão de Bolsas                                | GestaoBolsa                 | Done   | [feature/ep-03](features/ep-03-gestao-bolsas.md) |
| EP-04 | Gestão de Usuários do Backoffice                | GestaoUsuarioBackoffice     | Done   | [feature/ep-04](features/ep-04-gestao-usuarios-backoffice.md) |
| EP-05 | Importação e Gestão de Editais                  | ImportacaoEditais           | Done   | [feature/ep-05](features/ep-05-importacao-gestao-editais.md) |

## Grafo de Dependências

```
EP-01 (Cadastro e Gestão de Aplicações) — independente

EP-02 (Cadastro e Gestão de Modalidades de Bolsas) — independente
  └── EP-05 (Importação e Gestão de Editais)
        └── EP-03 (Gestão de Bolsas)

EP-04 (Gestão de Usuários do Backoffice) — independente
```
