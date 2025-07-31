---
sidebar_position: 3
---
# Casos de Uso
O modelo de casos de uso captura e descreve as funcionalidades que o sistema provê a seus atores. No módulo Cadastro de Modalidades de Bolsas da plataforma ConectaFapes foi identificado um único ator acessando quatro casos de uso, organizados em eventos.

| Ator            | Descrição           |
|-------------------|--------------------|
| **Gerente Área Técnica**   | Responsável pela concepção de editais, monitoramento e solicitação de bolsas, avaliação dos critérios e alocação de bolsista em projetos e liberação da folha de pagamento desses bolsistas.                                                                  
| **Gerente GEPOF**   | Realiza o pagamento de bolsas e auxilia na construção de resoluções e planejamento orçamentário geral.
| **Diretor Administrativo**   | Aprova pagamento de bolsas, parcelas de projetos, contrato de serviços, aprovações financeiras gerais..
| **Banestes**   | Banco responsável por receber e processar a ordem de pagamento para os bolsistas. .     |

## UC05: Definir Calendário das Folhas
### UC05.0: Visualizar Calendário Anual
1. O sistema exibe um conjunto de opções de ano do calendário, com o ano atual selecionado por padrão.
2. O Gerente GEPOF seleciona o ano em que deseja visualizar o calendário.
3. O sistema exibe os marcos definidos para cada mês do ano selecionado. Os marcos são: (M1) Data Limite de Solicitação de Bolsas, (M2) Data Prevista de Geração da Folha Normal, e (M3) Data de Pagamento da Folha Normal.


### UC05.1: Definir Marcos da Folha
1. O Gerente GEPOF visualiza o calendário usando o evento Visualizar Calendário Anual ou cria um novo calendário selecionando o ano subsequente ao atual.
2. O Gerente GEPOF define (ou altera), para cada mês, exatamente três marcos: (M1) Data Limite de Solicitação de Bolsas, (M2) Data Prevista de Geração da Folha Normal, e (M3) Data de Pagamento da Folha Normal.


## UC06: Liberar Editais da Área para Pagamento
### UC06.0: Visualizar Liberação de Editais
1. O sistema exibe a Área Técnica (do Gerente logado) e o mês em questão (mês do Plano Mensal mais recente com M1+1 ocorrido).
2. O sistema exibe uma das seguintes informações sobre a geração da folha normal do mês em questão:
    a. Caso a data atual seja menor que M2: Indica quantos dias faltam para a data prevista de geração da folha (M2) e a data de M2. Ex.: Faltam N dias para a geração da folha da folha normal, prevista para M2.
    b. Caso a data atual seja maior ou igual a M2 e a folha normal ainda não foi gerada: Indica a data prevista para geração da folha já passou, a data de M2 e que ainda não foi efetivada. Ex.: A geração da folha da folha normal estava prevista para M2, mas ainda não foi efetivada.
    c. Caso a data atual seja maior ou igual a M2 e a folha normal já tenha sido gerada: Indica que a folha normal já foi gerada e a data da efetiva geração da folha. Ex.: A folha normal foi gerada em data de geração da folha.
3. O sistema exibe, para o mês em questão e anteriores, tabelas (uma por mês) listando os editais da área técnica (classe EditalCompetencia) que possuam bolsas vigentes ou pendentes, com as seguintes informações:
    a. Edital: nome, com link para seu detalhamento via evento Visualizar Projetos.
    b. Status: status de liberação do edital para a competência em questão: Sem Decisão, Liberado, Não Liberado, Incluído em Folha.
    c. Bolsas Vigentes: quantidade total de bolsas com pagamento previsto (pagamentos das alocações dos projetos do edital cujo mês de competência é igual ao mês em questão).
        i. Novas Bolsas: quantidade total de pagamentos previstos para as alocações de bolsistas dos projetos do edital, iniciadas na competência em questão (primeira cota de pagamento). Ex.: 70 bolsas vigentes, das quais 6 são novas bolsas.
    d. Pendentes: quantidade total de alocações de bolsistas pendentes (status 'Pendente de Avaliaçã' ou 'Em Avaliação') dos projetos do edital.
    e. Valor Total: somatório dos valores das Bolsas Vigentes do edital.
    f. Ações: ações de liberação permitidas para cada edital na competência, de acordo com o Status atual:
        i. Sem Decisão: ações de “marcar para liberar”, “marcar para não liberar”, “desfazer marcação” (se houver alguma) e “ver detalhes”;
        ii. Liberado: ações de “marcar para não liberar” e “ver detalhes”;
        iii. Não Liberado: ações de “marcar para liberar”, “editar justificativa” e “ver detalhes”;
        iv.Incluído em Folha: ação de “ver detalhes”.
    g. Cada linha das tabelas, conforme seu status e ações tomadas, segue o seguinte padrão de cores:

4. O sistema exibe, na tabela do mês em questão (primeira), todos os editais que possuam bolsas vigentes ou pendentes, qualquer que seja seu status de liberação.
5. O sistema exibe, nas tabelas de meses anteriores, somente os editais que possuam bolsas vigentes ou pendentes, com Status de liberação: Sem Decisão e Não Liberado.
6. O Gerente da Área Técnica pode refinar a visualização filtrando a busca por nome do edital e pelo status.

### UC06.1: Liberar Editais para Pagamento
1. O Gerente da Área Técnica, após o marco M1+1 dia, visualiza os editais por competência a partir do evento Visualizar Liberação de Edital.
2. O Gerente da Área Técnica, para cada Edital por Competência listado, pode tomar as seguintes ações, de acordo com o atual Status do Edital por Competência:
    a. Marcar para liberar: em um Edital Sem Decisão ou Não Liberado, sinaliza que o status será alterado para Liberado após a submissão.
    b. Marcar para não liberar: em um Edital Sem Decisão ou Liberado, sinaliza que o status será alterado para Não Liberado após a submissão, e solicita justificativa.
    c. Desfazer marcação: em um Edital com alguma marcação, a marcação será desfeita e o status permanecerá o atual.
    d. Marcar todos para liberar: em todos os Editais Sem Decisão ou Não Liberado, sinaliza que seus status serão alterados para Liberado após a submissão.
    e. Editar Justificativa: permite a edição da justificativa em um Edital Não Liberado.
    f. Ver Detalhes: mostra os detalhes do edital, via evento Visualizar Projetos.
3. O Gerente da Área Técnica submete as decisões e o sistema mostra um resumo com a situação que será atingida após a confirmação, incluindo as quantidades de editais Sem Decisão, Liberados e Não Liberados.
4. O Gerente da Área Técnica confirma a decisão.
5. O sistema realiza as modificações marcadas nos status dos Editais por Competência. Para cada Edital por Competência que teve seu status alterado para Liberado ou Não Liberado, é criado um registro da Decisão de Liberação, com usuário, horário, se foi liberado ou não, e a justificativa para os Não Liberados.


## UC07: Gerenciar Folhas de Pagamento
### UC07.0: Monitorar Liberações das Áreas
1. O sistema exibe qual é o mês em questão (mês do Plano Mensal mais recente com M2 ocorrido) e o tipo de folha a ser gerada.
    a. Caso a última folha gerada ainda esteja no estado Gerada, não será permitido gerar uma nova folha (RN15). Nesse caso, o sistema deve exibir uma mensagem informando a folha que está aguardando autorização. Ex. Aguardando decisão sobre autorização da Folha Normal de Setembro. Não é permitido gerar nova folha!
    b. Caso a folha mais recente do mês em questão esteja no status Cancelada, esta folha será gerada novamente (RN16). Ex. Folha Normal de Setembro será gerada Novamente.
    c. Caso seja a primeira folha do mês, será uma Folha Normal, caso seja a segunda, Folha Complementar 1, e assim sucessivamente. Ex.: Folha Normal de Setembro será gerada.
2. O sistema exibe o histórico de decisões das folhas do mês:
    a. Caso não haja folha gerada para o mês: informa a data prevista para geração da folha normal do mês (marco M2). Ex.: A data prevista para gerar a folha normal é M2.
    b. Caso haja folha(s) gerada(s) para o mês: informa o histórico de decisões das folhas e a data a partir da qual uma folha normal poderá ser gerada, ou seja, o próximo M2. Ex.:
        Folha Normal de Setembro gerada em 17/09/2024.
        Folha Normal de Setembro rejeitada em 18/09/2024.
        Folha Normal de Setembro gerada em 19/09/2024.
        Folha Normal de Setembro autorizada em 20/09/2024.
        Folha Complementar 1 de Setembro gerada em 23/09/2024.
        A Folha Normal de Outubro poderá ser gerada a partir de M2 de Outubro.
3. O sistema exibe uma das informações sobre a prévia da Folha Normal do mês seguinte:
    a. Caso M1+1 do mês seguinte ao mês em questão tenha sido atingido: link para a prévia via evento Visualizar Prévia de Folha Normal. Ex.: Visualizar Prévia da Folha Normal de Outubro.
    b. Caso contrário: informa que a prévia estará disponível a partir de M1+1. Ex.: Prévia da Folha Normal de Outubro disponível a partir de M1+1.
4. O sistema exibe, para o mês em questão, uma tabela listando as Áreas Técnicas, com as seguintes informações:
    a. Área Técnica: nome, com link para acompanhar as liberações da área por edital, via evento Visualizar Liberações da Área.
    b. Editais Não Liberados: quantidade de Editais da Competência com status Não Liberado ou Sem Decisão.
    c. Bolsas a Pagar: quantidade total de bolsas a pagar da área (quantidade de pagamentos, com status Alocado e mês de competência igual ao mês em questão, referentes a alocações dos projetos dos editais da área liberados para a competência em questão).
    d. Valor a Pagar: somatório dos valores das Bolsas a Pagar.
    e. Na última linha é exibido o total com a soma de cada uma das colunas.
5. O sistema exibe, para cada mês anterior, uma tabela com a mesma estrutura, listando apenas as áreas que possuam ao menos uma das colunas não zeradas.
6. O sistema exibe, por fim, o valor total previsto para a folha considerando todos os meses.
7. O Gerente GEPOF pode executar o evento Gerar Folha, a fim de gerar uma nova folha de pagamento para o mês em questão (exceto no caso em que haja uma folha do mês no estado Gerada - item 1.a deste evento).


### UC07.1: Gerar Folha
1. O sistema exibe, como título, qual é o mês em questão e o tipo de folha a ser gerada. Ex.: Gerar Folha Normal de Setembro.
2. O sistema exibe, para cada Área Técnica, os meses que possuem algum edital com bolsas a pagar na folha a ser gerada.
    a. O sistema exibe, para cada mês, uma tabela listando os editais da área técnica que possuam bolsas a pagar, com as seguintes informações:
        i. Edital: nome do edital.
        ii. Status: status de liberação do edital para a competência em questão: somente Liberados e Incluídos em Folha.
        iii. Bolsas Vigentes: quantidade total de bolsas da competência listada (pagamentos das alocações dos projetos do edital cujo mês de competência é igual ao mês listado).
        iv. Pendentes: quantidade total de alocações de bolsistas pendentes (status 'Pendente de Avaliação' ou 'Em Avaliação') dos projetos do edital.
        v. Bolsas a Pagar: quantidade total de bolsas da competência listada a serem pagas na Folha sendo gerada (pagamentos das alocações dos projetos do edital cujo mês de competência é igual ao mês listado e status Alocado).
        vi. Valor Total: somatório dos valores das Bolsas a Pagar do edital na competência listada.
    b. O sistema exibe, como totalização da área técnica, o somatório dos valores totais de todos os editais exibidos de todos os meses da área.
3. O sistema exibe, como totalização da folha, o somatório dos valores de cada área técnica.
4. O Gerente GEPOF analisa as informações e solicita a geração da Folha.
5. O sistema exibe uma mensagem de confirmação com um resumo de informações da folha sendo gerada: nome da folha (ex.: Folha Normal de Setembro), quantidade total de bolsas, valor total da folha e data de pagamento. No caso de folha normal, será exibida a data do marco M3. No caso de folha complementar, a data de pagamento será solicitada (protótipo).
6. O Gerente GEPOF confirma a criação da folha, implicando em:
    a. Criação da Folha com status Gerada, ordem Normal ou Complementar N e a data de pagamento M3 (ou informada), referindo-se ao Plano Mensal do mês em questão. Caso se trate de uma nova geração de uma folha cancelada ou rejeitada (ou seja, há uma folha da ordem e mês em questão com status Cancelada ou Rejeitada) o status da folha é atualizado para Gerada e a data de Pagamento é atualizada para M3 (ou informada);
    b. Associação de todos os Pagamentos incluídos na Folha criada (ou gerada novamente) e alteração de seus status para “Em Folha”;
    c. Alteração dos status dos Editais por Competência envolvidos para “Incluído em Folha”;
    d. Registro da Decisão de geração da folha, com usuário, horário e tipo de ação Geração.
7. O sistema notifica a DIRAF e realiza o evento Visualizar Folha onde visualiza as informações da folha gerada.

### UC07.2: Cancelar Folha
1. O Gerente GEPOF visualiza uma folha de pagamento com status Gerada usando o evento Visualizar Folha.
2. O Gerente GEPOF analisa as informações e solicita o cancelamento da Folha.
3. O sistema exibe uma mensagem informando que a folha será cancelada e, consequentemente, todos os pagamentos incluídos nessa folha voltarão ao status Alocado e só serão efetivados caso uma nova geração de folha seja executada.
4. O sistema solicita uma justificativa e a confirmação do cancelamento.
5. O Gerente GEPOF insere uma justificativa e confirma o cancelamento implicando em: (ações similares ao item 2.b do evento E035.Decidir sobre Autorização da Folha)
    a. Registro da Decisão de cancelamento da folha, com usuário, horário e tipo de ação Cancelar.
    b. Atualização do status da Folha para “Cancelada”.
    c. Alteração, de “Incluído em Folha” para “Liberado”, dos status dos Editais por Competência envolvidos nesta folha que não estejam envolvidos em nenhuma outra folha (ou seja, que não tenham pagamentos incluídos em outra folha).
    d. Exclusão das associações de todos os pagamentos com a folha cancelada e alteração de seus status para “Alocado”.
6. O sistema realiza o evento Listar Folhas de Pagamento onde a folha cancelada será o primeiro registro listado.

### UC07.3: Visualizar Prévia de Folha Normal
1. O sistema exibe qual é o mês com M1+1 mais recente e a informação de que a folha normal poderá ser gerada a partir de M2 de tal mês.
    Ex.: Prévia da Folha Normal de Outubro
    Folha Normal de Outubro poderá ser gerada a partir de M2 de Outubro.
2. O sistema exibe, para o mês em questão, uma tabela listando as Áreas Técnicas, com as seguintes informações:
    a. Área Técnica: nome, com link para acompanhar as liberações da área por edital, via evento Visualizar Liberações da Área.
    b. Editais Não Liberados: quantidade de Editais da Competência com status Não Liberado ou Sem Decisão.
    c. Bolsas a Pagar: quantidade total de bolsas a pagar da área (quantidade de pagamentos, com status Alocado e mês de competência igual ao mês em questão, referentes a alocações dos projetos dos editais da área liberados para a competência em questão).
    d.Valor a Pagar: somatório dos valores das Bolsas a Pagar.
    e.Na última linha é exibido o total com a soma de cada uma das colunas.
3. O sistema exibe, para cada mês anterior, uma tabela com a mesma estrutura, listando apenas as áreas que possuam ao menos uma das colunas não zeradas.
4. O sistema exibe, por fim, o valor total previsto para a folha considerando todos os meses.

### UC07.4: Visualizar Liberações da Área
1. O sistema exibe a Área selecionada a partir do evento Monitorar Liberações das Áreas.
2. O sistema exibe para o mês em questão e anteriores, tabelas(uma por mês) editais da área técnica (classe EditalCompetencia) que possuam bolsas vigentes ou pendentes, com as seguintes informações:
    a. Edital: nome, com link para seu detalhamento via evento Visualizar Projetos.
    b. Status: status de liberação do edital para a competência em questão: Sem Decisão, Liberado, Não Liberado, Incluído em Folha.
    c. Bolsas Vigentes: quantidade total de bolsas da competência listada (pagamentos das alocações dos projetos do edital cujo mês de competência é igual ao mês listado).
    d. Pendentes: quantidade total de alocações de bolsistas pendentes (status 'Pendente de Avaliação' ou 'Em Avaliação') dos projetos do edital.
    e. Bolsas a pagar: quantidade total de bolsas da competência listada a serem pagas na Folha sendo gerada (pagamentos das alocações dos projetos do edital cujo mês de competência é igual ao mês listado e status Alocado).
    f. Valor Total: somatório dos valores das Bolsas Vigentes do edital.
    g. Ações:
        i. Ver detalhes de justificava de um edital Não liberado.
        ii. Mostra os detalhes do edital, via evento Visualizar Projetos
3. O sistema exibe, na tabela do mês em questão (primeira), todos os editais que possuam bolsas vigentes ou pendentes, qualquer que seja seu status de liberação.
4. O sistema exibe, nas tabelas de meses anteriores, somente os editais que possuam bolsas vigentes ou pendentes com Status de liberação: Sem Decisão, Não Liberado e Liberado.
5. O sistema exibe, como totalização da folha, o somatório dos valores de cada mês de competência.
6. O Gerente da Área Técnica pode refinar a visualização filtrando a busca por nome do edital e pelo status.

### UC07.5: Visualizar Projetos
1. O sistema exibe o Edital selecionado a partir do evento Monitorar Liberações das Áreas ou Visualizar Liberação de Editais.
2. O sistema exibe o ano e o mês de competência ao qual o edital selecionado se refere.
3. O sistema exibe uma lista de projetos do Edital com as seguintes informações:
    a. Projeto: nome do projeto, com link para seu detalhamento via evento Visualizar Bolsistas.
    b. Status: status do projeto.
    c. Bolsas vigentes: quantidade total de bolsas com pagamento previsto (pagamentos das alocações do projeto cujo mês de competência é igual ao mês em questão).
    d. Pendentes: quantidade total de alocações de bolsistas pendentes (status 'Pendente de Avaliação' ou 'Em Avaliação').
    e. Valor Total: somatório dos valores das Bolsas Vigentes do edital
4. O Gerente GEPOF pode refinar a visualização filtrando a busca por nome do projeto e pelo status.

### UC07.6: Visualizar Bolsistas
1. O sistema exibe o Projeto selecionado a partir do evento Visualizar Projetos.
2. O sistema exibe o ano e o mês de competência ao qual o projeto selecionado se refere.
3. O sistema exibe uma lista de bolsistas com as seguintes informações:
    a. Bolsista: nome do bolsista.
    b. Status: status de alocação de um bolsista.
    c. Bolsa: nível da bolsa.
    d. Porcentagem: valor percentual a ser recebido.
    e. Cotas Pagas: quantidade de cotas alocadas e quantidade de cotas já pagas.
    f. Início: data de início de vigência da alocação.
    g. Fim: data de início de vigência da alocação.
    h. Valor: custo unitário da bolsa

    Nessa exibição, há uma ordenação por status padrão na qual os bolsistas pendentes estão no topo, em seguida estão os bolsistas vigentes seguidos dos demais status.

4. O sistema exibe também um resumo financeiro por meio de uma  tabela, com uma linha para cada tipo de bolsa, com as seguintes informações:
    a. Tipo Bolsa: nível da bolsa
    b. Bolsistas vigentes: quantidade de alocações que possuam status “Ativo”.
    c. Valor: valor unitário da bolsa.
5. O Gerente da Área Técnica/ GEPOF pode refinar a busca por nome do bolsista e status da alocação.


## UC08: Autorizar Pagamento da Folha
### UC08.0: Listar Folhas de Pagamento
1. A DIRAF/GEPOF informa ao sistema o ano o qual deseja visualizar as folhas de pagamento e confirma.
2. O sistema exibe uma relação de folhas de pagamento referentes ao ano escolhido. Para cada folha, é exibido o nome, o status, data de gerar folha, data de autorização, valor total da folha.
3. A DIRAF/A GEPOF tem como possíveis ações gerar um arquivo PDF contendo a relação de pagamentos gerada, totalizada por área e edital de uma folha e/ ou executar o evento de Visualizar Folha.

### UC08.1: Visualizar Folha
1. O sistema exibe ano e mês de competência da Folha, a data de geração e o status da Folha e um resumo de informações agrupadas por Área Técnica. Para cada Área Técnica, é exibido a quantidade de editais incluídos na Folha, a quantidade de bolsas e:
    a. Ou valor a pagar, se a folha ainda não foi paga.
    b. Ou valor pago, se a folha já foi paga.
2. Caso o usuário seja DIRAF este pode executar o evento Decidir sobre autorização da Folha. Caso o usuário seja GEPOF, ele tem a opção de executar o evento Desfazer a geração da folha.
3. A DIRAF/ GEPOF pode visualizar detalhes da folha de uma Área Técnica via evento Visualizar Folha com detalhes da Área Técnica.

### UC08.2: Visualizar Folha com detalhes da Área Técnica
1. O sistema exibe o nome da Área Técnica, tipo e mês da folha.
2. O sistema exibe, para cada mês, uma tabela listando os editais da área técnica que possuam bolsas a pagar, com as seguintes informações:
    a. Edital: nome do edital
    b. Status: status de liberação do edital para a competência em questão: somente Liberados e Incluídos em Folha.
    c. Bolsas Vigentes: quantidade total de bolsas da competência listada (pagamentos das alocações dos projetos do edital cujo mês de competência é igual ao mês listado).
    d. Pendentes: quantidade total de alocações de bolsistas pendentes (status 'Pendente de Avaliação' ou 'Em Avaliação') dos projetos do edital.
    e. Bolsas a Pagar: quantidade total de bolsas da competência listada a serem pagas na Folha sendo gerada (pagamentos das alocações dos projetos do edital cujo mês de competência é igual ao mês listado e status Alocado).
    f. Valor Total: somatório dos valores das Bolsas a Pagar do edital na competência listada.
3. O sistema exibe, como totalização da área técnica, o somatório dos valores totais de todos os editais exibidos de todos os meses da área.
4. O sistema exibe, como totalização da folha, o somatório dos valores de cada área técnica.

### UC08.3: Decidir sobre Autorização da Folha
1. O Diretor Administrativo visualiza uma folha de pagamento com status Gerada, usando o evento Visualizar Folha.
2. O Diretor Administrativo analisa as informações da folha e opta por autorizar ou rejeitar o pagamento da Folha.
    a. Autorizar o pagamento da Folha implica em:
        i. Registro da Decisão de autorização da folha, com usuário, horário e tipo de ação Autorizar.
        ii. Atualização do status da folha para “Autorizada”.
    b. Rejeitar o pagamento da Folha implica em : (ações similares ao item 5 do evento E027.Cancelar Folha)
        i. Registro da Decisão de rejeição da folha, com usuário, horário e tipo de ação Rejeitar.
        ii. Atualização do status da Folha para “Rejeitada”.
        iii.Alteração, de “Incluído em Folha” para “Liberado”, dos status dos Editais por Competência envolvidos nesta folha que não estejam envolvidos em nenhuma outra folha (ou seja, que não tenham pagamentos incluídos em outra folha).
        iv. Exclusão das associações de todos os pagamentos com a folha rejeitada e alteração de seus status para “Alocado” .
3. O sistema notifica a GEPOF e realiza o evento Visualizar Folha onde visualiza as informações da folha autorizada/rejeitada.