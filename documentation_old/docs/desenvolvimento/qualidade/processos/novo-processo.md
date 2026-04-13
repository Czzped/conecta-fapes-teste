---
title: Identificação, Triagem e Correção de Bugs 
sidebar_position: 2
---
## Quando identificados pelo usuário

### Fase 1: Identificação e Abertura (User → Service Desk)
O usuário identifica um comportamento inesperado ou erro no sistema e abre um chamado.

> Importante estruturar o service desk com opções adequadas para cada tipo de solicitação.

### Fase 2: Triagem e Investigação Inicial (Time de Sustentação/Suporte)

**AÇÕES**

1. Validação: Confirma se o relato é de fato um bug (e não um mal-entendido ou solicitação de melhoria).
2. Enriquecimento: Solicita informações adicionais ao usuário, se necessário, para compreender completamente o problema.
3. Priorização Inicial: Classifica o bug com uma prioridade preliminar (ex.: Crítica, Alta, Média, Baixa) com base no impacto imediato ao negócio e no número de usuários afetados.

**SOLUÇÃO IMEDIATADA**
  - Se o bug for simples e de correção rápida E o bolsista alocado no suporte tiver acesso e conhecimento de programação para corrigi-lo, ele mesmo realiza a solução.
    - Safeguards Obrigatórios:
      - Code Review: Todo código alterado pela sustentação deve ser revisado por um desenvolvedor sênior do time de desenvolvimento.
      - Validação do QA: A correção deve ser testada e validada por QA antes de ir para produção.

### Fase 3: Escalonamento e Planejamento (Sustentação → Desenvolvimento)

**AÇÕES**

1. Se o bug for complexo ou a sustentação não tiver capacidade de resolvê-lo, o chamado é escalonado formalmente para o time de desenvolvimento.
2. O ticket deve conter todas as informações coletadas na Fase 2.
3. Priorização Definitiva: O QA Lead define a prioridade final do bug no backlog, considerando a prioridade inicial da sustentação, o roadmap do produto e o esforço de desenvolvimento estimado.

- **Alocação na Sprint:**
    - Bugs Críticos/P0 são tratados em caráter de urgência, entrando na sprint corrente imediatamente.
    - Bugs de Alta e Média prioridade são planejados para as próximas sprints.
---


import BpmnViewer from '@site/src/components/BpmnViewer';

<BpmnViewer diagramUrl="/diagrams/qa/status-qa.bpmn"  height="630px"/>