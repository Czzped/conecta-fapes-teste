---
sidebar_position: 2
---
# Requisitos
Tomando por base o contexto do sistema, foram identificados os requisitos de usuário a seguir.
## Requisitos Funcionais

| ID   | Nome| Descrição    | Dependências           |
|------|-----|--------------|------------------------|
|UC01|Visualizar Orçamentos|O Dashboard deve permitir a visualização dos orçamentos relativos às Áreas Técnicas, Editais e Projetos||
|UC02|Visualizar Tipos de Modalidades de Bolsa|O Dashboard deve permitir a visualização dos tipos de modalidades de bolsas e seus níveis relativos às Áreas Técnicas, Editais e Projetos||
|UC03|Gerenciar Bolsistas|O Dashboard deve permitir a visualização dos bolsistas com informações relativos as cotas, status dentro do projeto e informações pessoais||
|UC04|Visualizar Cotas Remanescentes|O Dashboard deve permitir a visualização das cotas planejadas e dos saldos de cotas remancescentes dos Projetos||

## Eventos dos Casos de Uso 

| ID   | Evento| Caso de Uso|
|------|-----|--------------|
|UC01.0|Visualizar os orçamentos dos projetos|UC01|
|UC01.1|Visualizar os orçamentos dos editais|UC01|
|UC01.2|Visualizar os orçamentos das áreas técnicas|UC01|
|UC01.3|Visualizar os orçamentos destinados a bolsas dos projetos (saldos)|UC01|
|UC02.0|Visualizar a quantidade de tipos de modalidade bolsa e seus níveis dentro dos projetos|UC02|
|UC02.1|Visualizar a quantidade de tipos de modalidade bolsa e seus níveis dentro dos editais|UC02|
|UC02.2|Visualizar a quantidade de tipos de modalidade bolsa e seus níveis dentro das áreas técnicas|UC02|
|UC03.0|Visualizar informações específicas dos bolsistas|UC03|
|UC03.1|Visualizar bolsistas suspensos dos projetos|UC03|
|UC03.2|Visualizar bolsistas cancelados dos projetos|UC03|
|UC03.3|Visualizar bolsistas finalizados dos projetos|UC03|
|UC03.4|Visualizar bolsistas substituídos dos projetos|UC03|
|UC03.5|Visualizar entrada e saída dos bolsistas nos projetos|UC03|
|UC04.0|Visualizar quantidade de cotas remanescentes dos editais|UC04|
|UC04.1|Visualizar quantidade de cotas remanescentes dos projetos|UC04|


## Priorização dos Casos de Uso

| ID   | Evento| Priorização (**GEINOV**)| Priorização (**NUPEX**)| Priorização (**GECAP**)| Priorização (**GEPED**)|
|------|-----|--------------|----------------|--------------|-----------------|
|UC01.0|Visualizar os orçamentos dos projetos||95|97|97|
|UC01.1|Visualizar os orçamentos dos editais||94|95|95|
|UC01.2|Visualizar os orçamentos das áreas técnicas||87|89|90|
|UC01.3|Visualizar os orçamentos destinados a bolsas dos projetos (saldos)||98|96|96|
|UC02.0|Visualizar a quantidade de tipos de modalidade bolsa e seus níveis dentro dos projetos||97|88|89|
|UC02.1|Visualizar a quantidade de tipos de modalidade bolsa e seus níveis dentro dos editais||96|87|88|
|UC02.2|Visualizar a quantidade de tipos de modalidade bolsa e seus níveis dentro das áreas técnicas||88|87|87|
|UC03.0|Visualizar informações específicas dos bolsistas||93|86|91|
|UC03.1|Visualizar bolsistas suspensos dos projetos||90|91|92|
|UC03.2|Visualizar bolsistas cancelados dos projetos||92|94|93|
|UC03.3|Visualizar bolsistas finalizados dos projetos||91|93|94|
|UC03.4|Visualizar bolsistas substituídos dos projetos||89|92|80|
|UC03.5|Visualizar entrada e saída dos bolsistas nos projetos||86|90|98|
|UC04.0|Visualizar quantidade de cotas remanescentes dos editais||99|99|99|
|UC04.1|Visualizar quantidade de cotas remanescentes dos projetos||100|100|100|