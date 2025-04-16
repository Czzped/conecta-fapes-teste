# 📋 Templates de Issues

Este repositório contém modelos de issues padronizados para facilitar a organização e o fluxo de trabalho dos times de desenvolvimento, garantindo clareza na comunicação e rastreabilidade entre problemas, tarefas e funcionalidades.

## 🐞 `BUG_TEMPLATE.md`

Modelo utilizado para reportar **erros ou comportamentos inesperados** no sistema.

### Estrutura:
- **Título prefixado com `[BUG]`**
- **Descrição do Bug**: contexto e detalhes sobre o problema.
- **Comportamento Observado**: descrição do erro ou evidência (ex: prints, logs, vídeos).
- **Comportamento Esperado**: como o sistema deveria funcionar.
- **Informações Adicionais**: ambiente, navegador, logs, etc.
- ⚠️ Toda correção deve estar associada a um Pull Request (PR).

🔗 Ideal para: problemas que afetam a experiência do usuário, falhas em funcionalidades existentes ou erros de lógica.

---

## ✨ `FEATURE_TEMPLATE.md`

Modelo para sugerir ou registrar o desenvolvimento de **novas funcionalidades** que entreguem valor ao cliente.

### Estrutura:
- **Título prefixado com `[FEATURE]`**
- **Descrição**: finalidade da funcionalidade.
- **Requisitos Técnicos**: pontos que a equipe técnica precisa considerar.
- **Atividades a serem realizadas**: lista de tarefas (checklist).
- **Critérios de Aceitação**: condições para considerar a entrega como finalizada.
- **Observações**: espaço para observações gerais.

⚠️ Toda entrega deve estar vinculada a um PR correspondente.

🔗 Ideal para: desenvolvimento de novas funcionalidades, melhorias incrementais ou ajustes significativos em processos do sistema.

---

## 📌 `TASK_TEMPLATE.md`

Modelo voltado para **tarefas operacionais**, **reuniões**, ou **atividades de suporte e documentação**.

### Estrutura:
- **Título prefixado com `[TASK]`**
- **Objetivo da Tarefa**: propósito da atividade.
- **Entregáveis**: lista de itens que comprovam a conclusão.
- **Observações**: anotações extras ou pontos de atenção.

⚠️ A tarefa também deve estar associada a um PR, quando aplicável.

🔗 Ideal para: atividades não-funcionais, como escrita de documentação, preparação de ambientes, reuniões ou tarefas administrativas.

---

## ✅ Boas Práticas

- Sempre associe issues aos seus respectivos PRs.
- Utilize os prefixos `[BUG]`, `[FEATURE]` e `[TASK]` para facilitar a triagem.
- Mantenha as descrições objetivas e completas.
- Marque responsáveis quando aplicável.
