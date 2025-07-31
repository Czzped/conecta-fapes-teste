---
title: 🎓 Gestão de Tarefas
sidebar_position: 3
---

Aqui você vai entender como abrir, tratar e fechar issues, garantindo organização e qualidade no seu projeto.

## 🎓 Introdução

Este documento detalha o processo de abertura, tratamento e fechamento de issues no GitHub, de acordo com as boas práticas de QA. As práticas aqui estabelecidas **devem** ser seguidas para garantir:

✅ Melhor organização  
✅ Acompanhamento eficaz das tarefas  
✅ Entregas com mais qualidade

## 🧭 Regras Gerais

Antes de começarmos, algumas regras de ouro para a gestão dos issues:

- 🔹 As views de Kanban devem ser separadas por **produto**, e não por squad.
- 🔹 Todos os times devem seguir a **mesma Sprint**.
- 🔹 **Sempre** defina Milestones — toda sprint deve estar associada a um milestone.
- 🔹 Issues **sempre** associadas a PRs. Automações ajudam nisso!

**👉 Lembre-se:** estas práticas facilitam a gestão visual e evitam retrabalho.

## 🧩Entendendo os Issues

No GitHub, **issues são registros que representam demandas a serem trabalhadas pela equipe**, como: 

- 🐞 Correções de bugs
- ✨ Novas funcionalidades
- 🛠️ Melhorias de design ou técnicas

Eles funcionam como **tarefas rastreáveis**, essenciais para o acompanhamento do progresso do projeto.


### 📂 Categorias de Issues

Cada issue recebe uma tag especial para ajudar na identificação:

- **[FEATURE]**: Funcionalidade que entrega valor ao cliente e pode conter outras features, tasks ou bugs.
- **[BUG]**: Um problema ou comportamento inesperado do sistema. Um BUG é resolvido por uma ou mais **[TASK]** ou **[FEATURE]**
- **[TASK]**: Atividades operacionais relacionadas a uma ou mais features.

### 🏷️ Campos Customizados

Nossos issues possuem campos importantes para gestão:

- 📅 **Start Date:** Quando a tarefa começa
- ⏰ **Deadline:** Data limite
- 🚦 **Status:** Reflete o estado atual do item, que pode se apresentar como BACKLOG, TO DO, IN PROGRESS, BLOCKED, IN REVIEW e DONE.
- 👥 **Team:** Time responsável
- 🏃‍♀️ **Sprint:** Ciclo de trabalho
- 📌 **Milestone:** Entrega associada

:::info 
É de extrema importância que cada campo seja devidamente preenchido evitando uma priorização confusa, dificuldade de acompanhamento das tarefas e falhas na comunicação.
:::

### 📝 Templates de Issues

Para cada tipo de issue, existe um [template](https://github.com/leds-conectafapes/conectafapes-planning/tree/develop/.github/ISSUE_TEMPLATE) que **deve** ser utilizado para descrever os cards. Para garantir o uso do template, ao abrir um issue siga os passos:
1. Abra um board no GitHub Projects respectivo ao projeto.
2. Encontre aba `Add item` ou então utilize o atalho `Ctrl + Espaço`.
3. Digite `#` e `conectafapes-planning` em seguida.
4. Selecione a opção `Create new issue`.
5. Selecione um dos templates disponíveis, de acordo com sua necessidade.
6. Preencha a descrição do issue, adicionando:
   - responsável (Assignee), 
   - datas de início e fim da tarefa,
   - sprint na qual a demanda está associada,
   - time no qual a demanda está associada e
   - Milestone no qual a demanda faz parte.

## 🧭 Sprints

Uma Sprint é um ciclo de trabalho com duração fixa (normalmente de 1 a 4 semanas), durante o qual o time se compromete a entregar um conjunto de tarefas e funcionalidades. Ela ajuda a manter o ritmo do projeto, favorecendo entregas incrementais e constantes 📦.

A Sprint faz parte do método ágil (Scrum) e tem como objetivo focar em entregas curtas, validadas e com valor real para o client


### 🎯 Exemplo de Uso

Imagine que estamos trabalhando no projeto **ConectaFapes**.  
Definimos que nossa sprint atual vai focar no **fluxo de pagamentos**.

**Sprint: "Sprint 3 - Pagamentos"**  
Objetivo: Entregar as funcionalidades básicas de integração com o gateway de pagamento.

**Issues incluídas na sprint:**
Sprint 3 - Pagamentos 
   ├── [FEATURE] Integrar gateway de pagamento 
   ├── [BUG] Corrigir cálculo de juros no checkout 
   └── [TASK] Atualizar a documentação da API de pagamentos

Durante a sprint, vamos acompanhar o progresso dessas tarefas até o prazo final! ⏳

### 🛠️ Como criar uma Sprint no GitHub Projects

1. Acesse o **GitHub Projects** do seu repositório 📂.
2. No seu board de projeto, clique na aba **Fields** (Campos).
3. Verifique se existe um campo personalizado chamado **Sprint**. Se não existir:
   - Clique em **+ New Field** ➕
   - Selecione o tipo **Single Select** 🎯
   - Nomeie como **Sprint** e crie as opções (ex.: "Sprint 1 - Onboarding", "Sprint 2 - Fluxo Principal", etc.).
4. Para cada item do board (issue ou task), selecione o valor correspondente na coluna **Sprint** 🏃‍♀️.
5. Agora, todos os itens atribuídos vão aparecer agrupados na sua sprint!

💡 **Dica:**  
Você pode combinar as sprints com **Milestones**, criando ainda mais visibilidade para entregas e datas-chave do projeto!


## 🧭 Milestones

Milestones, também chamados de Marcos, são conjuntos de issues, tasks e features agrupados em um objetivo comum, geralmente vinculados a um ou mais sprints, release ou meta específica. Eles funcionam como "containers de progresso", ajudando a equipe a:
- 📦 Organizar entregas,
- 📈 Medir conclusão (ex.: "60% dos issues deste milestone foram fechados") e
- 🗓️ Alinhar prazos (ex.: "Milestone deve ser concluído até 30/05").

Cada issue, independente do seu tipo, pode ser vinculado a um milestone, criando uma hierarquia clara. Veja um exemplo:
```
Milestone: "Sprint 3 - Pagamentos"  
├── [FEAT] Integrar gateway de pagamento  
├── [BUG] Erro no cálculo de juros  
└── [TASK] Atualizar documentação da API  
```

### 🛠️ Criando milestones
1. Acesse o repositório onde os issues estão (no contexto do projeto ConectaFapes, todos os issues devem ser salvos em [conectafapes-planning](https://github.com/leds-conectafapes/conectafapes-planning)).
2. Clique em "Issues" > "Milestones" (ex.: [conectafapes-planning/milestones](https://github.com/leds-conectafapes/conectafapes-planning/milestones)).
3. Clique em "New Milestone" e preencha os campos:
   - Title: Nome do marco (ex.: "Sprint 5 - Onboarding").
   - Due Date: Data de conclusão (obrigatório para alinhamento com sprints).
   - Description: Objetivo principal (ex.: "Entregar fluxo de cadastro de usuários").
4. **Vincule issues ao Milestone.**

:::tip Sugestão
Criar milestones com base em entregas mensais de cada produto. Lembrando que uma entrega se dá por disponibilizar as features em ambiente de staging para pleno uso do cliente.
:::

### 🛠️ Combine Sprint com Milestones 🚀

Se você também usar Milestones, pode associar cada Sprint a um Milestone para ter visibilidade de datas e progresso agregado.

    Crie um Milestone no repositório.

    Vincule as issues ao Milestone correspondente.

    Com isso, você tem duas visões:

      * 📅 Tempo e meta final no Milestone.

      * 🏃‍♀️ Fluxo de trabalho interno na Sprint.

## 🛠️ Equipe

Uma equipe é um conjunto de pessoas que possui a mesmma habilidade (e.g., Back-End, Fron-End e Qualidade).

## 🎯 Produto

Em um projeto é possivel que seja produto um ou mais produtos. Um projeto é um conjunto de Features, Tasks e Bugs que devem ser entregues em um ou mais Milestones. 

## 📝 Criando um Issue

Ao criar uma Issue é necessário definir os seguintes elementos:
* **Type**: Escolher entre Feature, Task e Bug, no momento da criação da issue;
* **Label**: Define o tipo da tarefa, feature ou bug. Por exemplo, uma tarefa pode ser do tipo "Documentation" ou "Feat", no momento da criação;
* **Assigner**: um responsável pela issue (caso mova a issue para To Do);
* **Data Inicial e Final**: somente quando a issue for To DO;
* **Sprint**: selecionar o sprint corrente e quando a issue estiver no TO DO;
* **Milestone**: selecionar o Milestone quando a issue for para TO DO;
* **Squad**: selecionar em qual squad está a issue, não obrigatório, no momento de criação da issue;
* **Produto**: Quando criar a issue selecionar o produto que a issue estiver associado.

## 🚀 Como Criar um Board no GitHub Projects e Filtrar Issues do Tipo "Product"


### 🚀 Passo a Passo para criar um Board no GitHub Projects

1. **Acesse o repositório no GitHub**  
   Vá até o seu repositório onde deseja criar o board.

2. **Vá para a aba "Projects"**  
   No topo da página, clique em **Projects**.

3. **Crie um novo projeto**  
   - Clique em **"New Project"**.
   - Escolha **"Board"** (formato Kanban).
   - Dê um nome ao seu projeto (ex: *Roadmap Produto*).
   - Opcional: Adicione uma descrição.

4. **Configurar colunas do board**  
   - Por padrão, ele vem com *To do*, *In progress*, *Done*. Você pode personalizar ou adicionar novas colunas conforme sua necessidade.

---

### 🏷️ Agora vamos selecionar apenas as *issues* do tipo **Product**

Você pode fazer isso de duas formas, dependendo da sua configuração:

Se você criou um campo personalizado chamado **"Product"** dentro do seu projeto:

1. No board, clique em **"Filter"**.
2. Selecione o campo personalizado na lista de filtros.
3. Escolha o valor correspondente a "Product".



## 🛠️Conclusão

A qualidade do software que entregamos ao cliente depende diretamente do cumprimento das responsabilidades de cada membro da equipe. O envolvimento de todos, seguindo o processo corretamente, assegura a identificação e resolução eficaz de problemas, resultando em uma solução mais robusto e confiável. **Contamos com a colaboração de todos!** 😊

:::note[Em caso de dúvidas ou sugestões, contate um membro do time de Qualidade.]
:::