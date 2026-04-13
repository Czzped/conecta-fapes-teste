---
sidebar_position: 2
---
# Requisitos
Tomando por base o contexto do sistema, foram identificados os requisitos de usuário a seguir.

## Requisitos Funcionais

| ID   | Nome| Descrição    | Dependências           |
|------|-----|--------------|------------------------|
|UC04|Importar Dados de Editais|Provê os eventos necessários à importação e sincronização de dados do SigFapes para o ConectaFapes e ao preenchimento de informações complementares relativas à quantidade de cotas de bolsas já pagas e ao cancelamento de alocações.|-|

## Requisitos Não-Funcionais

| ID   | Nome| Descrição    | Dependências           |
|------|-----|--------------|------------------------|
|RNF01|Desempenho da Importação / Sincronização|Cada evento de importação ou sincronização deve ser realizado em tempo inferior a 5 segundos.|-|
|RNF02|Forma de Integração|Os dados serão importados da base de dados do SigFapes por meio de consultas a Web Services providos pelo cliente.|-|
|RNF03|Integridade dos Dados|Os dados de projetos, alocações e bolsistas do ConectaFapes devem estar sincronizados com os dados do SigFapes imediatamente antes de qualquer ação, no ConectaFapes, que envolva sua alteração ou geração de novos dados a partir deles.|-|



## Regras de Negócio

| ID   | Descrição    | Prioridade  |
|------|-----|--------------|
|RN01|Uma vez definida a quantidade de cotas pagas para uma alocação importada, ela não pode retornar para nulo.|Alta|
|RN02|Alocações que forem canceladas neste módulo precisam informar data de fim de atividades e justificativa. As que vierem canceladas do SigFapes não têm essa obrigatoriedade|Alta|
|RN03|Projetos “substituídos” devido a mudança de coordenador devem ser adaptados para contar como apenas um projeto.|Alta|
|RN04|Uma vez que todas as alocações de um projeto têm suas informações completas, o projeto é considerado Completo.|Alta|





### Matriz de Dependência dos Casos de Uso Ordenado

| Item | Caso de Uso | Dependencia | Habilita |
| --- | --- | --- | --- |


### Ciclos
Caso exista ciclo, será apresentado abaixo:

### Grafo de Dependencia

## Eventos dos Casos 

| ID   | Evento| Caso de Uso|
|------|-----|--------------|

### Matrix de Dependência dos Eventos Ordenado

| ID | Evento | Depende | Habilita |
| --- | --- | --- | --- |





