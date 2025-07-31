---
sidebar_position: 3
---
# Casos de Uso
## UC-0-LG: Acesso ao sistema
O sistema deve permitir o acesso ao sistema para os usuários
##

## UC-01-SA: Exibir sistema de avisos de bolsas
Na página inicial, deve ser listados os avisos de bolsas implementadas ou não ao usuário, se alguma bolsa está prestes a atingir a data de vencimento.
### UC01.0: Exibir aos pesquisadores avisos de implementação de bolsas
1. O Pesquisador acessa o sistema do Portal do Coordenador e entra na página inicial
2. O sistema deve manter o pesquisador atualizado sobre o status da implementação de suas bolsas com avisos na página inicial

### UC01.1: Exibir aos Pesquisadores informações sobre a atualização cadastral
1. O Pequisador realiza login no seu Portal do ConectaFapes
2. Caso tenha alguma pendência de dados não preenchidos em Meu Perfil, o sistema deve exibir um aviso na página inicial

### UC01.2: Exibir aos Coordenadores avisos de sobre a implementação de bolsas

1. O Coordenador acessa o sistema do Portal do Coordenador e entra na página inicial 
2. O sistema deve exibir aos Coordenadores apenas as informações de implementação das bolsas do projeto que ele tem vínculo, sendo elas em relação a quantidade, status e próximos prazos importantes das bolsas


### UC01.3: Exibir aos Coordenadores os projetos que ele possui relação
1. O Coordenador acessa o sistema do Portal do Coordenador e entra na página inicial
2. O sistema deve exibir aos Coordenadores os projetos que ele possui relação
3. O sistema deve permitir que o Coordenador veja mais detalhe dos projetos clicando no nome do projeto

### UC01.4: Exibir aos Bolsistas informações sobre o pagamento das bolsas
1. O bolsista acessa o sistema do Portal do Conectapes e consegue visualizar suas bolsas
2. O sistema informa ao Bolsista informações sobre depósito da bolsa e proximas bolsas
##

## UC-02-PM: Exibir dados em Meu Perfil
O sistema deve permitir ao usuário que vieram vieram durante o login com o Acesso Cidadão e que ele complete seus dados pessoais 

### UC02.0: Permitir ao Pesquisador completar os dados pessoais
1. O Pesquisador acessa a página de Meu Perfil
2. O sistema deve permitir que o Pesquisador complete os dados pessoais como sexo, idade, identidade etc, e anexe os documentos necessários pessoais (Identidade, RG...)
3. O sistema salva e permite a edição desses dados cadastrais

### UC02.1: Permitir ao Pesquisador inserir seu endereço e comprovantes nos dados cadastrais
1. O Pesquisador acessa a página de Meu Perfil
2. O sistema deve permitir que o Pesquisador complete os endereços (residência e de trabalho) e insira os comprovantes de residência e de trabalho
3. O sistema salva e permite a edição desses dados cadastrais

### UC02.2: Permitir ao Pesquisador gerenciar os documentos de formação
1. O Pesquisador acessa a página de Meu Perfil
2. O sistema deve permitir que o Pesquisador adicione ou edite os documentos comprovando sua formação, como graduação, mestrado e doutorado.
3. O sistema salva e permite a edição desses dados cadastrais

### UC02.3: Permitir ao Pesquisador cadastrar seus dados bancários
1. O Pesquisador acessa a página de Meu Perfil
2. O sistema deve permitir que o Pesquisador cadastre seus dados bancários para receber o pagamento de sua bolsas
3. O pesquisador deve inserir uma conta bancária válida e do Banestes
4. O campo "Banco" deve ser preenchido com "BANESTES" (desativado para edição) 
5. O sistema deve informar ao pesquisador que o preenchimento dos dados bancários deve ser feito antes da solicitação da bolsa feita pelo Coordenador

##

## UC-03-GP: Gestão de projetos Portal Fapes (Front-Office)
O sistema deve permitir que o Coordenador gerencie os projetos que ele tem vínculo e que o Bolsista insira documentos necessários para a implementação da bolsa	

### UC03.0: Permitir ao Coordenador visualizar dados em Dashboard dos projetos que ele tem vínculo
1. O Coordenador acessa o sistema do Portal do Coordenador e entra na página inicial 
2. O sistema deve exibir uma listagem de projetos que o Coordenador possui relação
3. Ao clicar no nome do projeto, o Coordenador é enviado para a página de detalhes do projeto
4. O sistema deve exibir um botão de "Acessar relatórios e indicadores"
5. O sistema deve exibir Dashboards com estátisticas e informativos sobre o projeto escolhido

### UC03.1: Permitir ao Coordenador implementar uma bolsa para o projeto
1. O Coordenador seleciona na página inicial algum de seus projetos
2. O sistema deve exibir um botão de "Solicitar nova bolsa"
3. Ao clicar no botão, o usuário é direcionado a uma página de formulário para solicitação de bolsa
4. Caso esteja fora do prazo de solicitação de bolsa, o sistema deve exibir uma mensagem de erro no campo de Início de atividades
5. Ao submeter a requisição, o sistema exibe uma mensagem de sucesso e o Coordenador é redirecionado para uma listagem de bolsas do projeto já com a nova bolsa solicitada
6. O sistema deve permitir inserir os dados e salvar como rascunho o que foi escrito no formulário

### UC03.2: Permitir ao Coordenador cancelar uma bolsa para o projeto
1. O Coordenador seleciona na página inicial algum de seus projetos
2. O sistema deve exibir uma listagem de bolsas do projeto
3. O sistema deve permitir ao Coordenador cancelar uma bolsa do projeto
4. Para cancelar a bolsa, é necessário confirmação da ação duas vezes
4. O sistema deve exibir uma mensagem de sucesso e o Coordenador é redirecionado para uma listagem de bolsas do projeto com o status da bolsa cancelada

### UC03.3: Permitir ao Coordenador mudar a bolsa de um bolsista do projeto
1. O Coordenador seleciona na página inicial algum de seus projetos
2. O sistema deve exibir uma listagem de bolsas do projeto
3. O sistema deve permitir ao Coordenador mudar a bolsa de um bolsista do projeto
4. O sistema deve conferir se essa mudança é possível de acordo com o cronograma do projeto

### UC03.4: Permitir ao Coordenador acompanhar o processo de implementação de bolsas do projeto
1. O coordenador deve conseguir acompanhar o processo de cada bolsa através da listagem de bolsas do projeto
2. O sistema deve exibir o status da bolsa
3. Caso ela for cancelada, o sistema deve exibir o motivo do cancelamento
4. Bolsas com status de "Rascunho" podem ser apagadas
5. Bolsas com status de "Pendente avaliação", "Finalizada", "Cancelada", "Em Andamento" e "Rascunho" podem ser visualizadas com mais detalhes
6. Bolsas com ststuas "Em andamento" podem ser canceladas


### UC03.5: Permitir ao Bolsista inserir documentos necessários para implementar uma bolsa
1. O Bolsista acessa o sistema do Portal do Bolsista e visualiza suas bolsas 
2. O sistema deve exibir uma listagem de bolsas solicitadas pelo Coordenador e seus status
3. Bolsas com status "Pendente documentos" podem ser editadas para enviar os documentos necessários faltantes
4. Deve ser permitido o Bolsista completar dados para a solicitação de bolsa anexando os documentos requeridos pela versão da bolsa que está sendo solicitada
5. O bolsista pode visualizar os status individuais de cada documento
6. É necessário que o Bolsista leia e assine o Termo de responsabilidade da FAPES

##
## UC-04-GP: Gestão de projetos Portal Admin (Back-Office)
O sistema deve permitir que as Áreas Técnicas visualizar implementações de bolsas e aprovem ou não a implementação

### UC04.0: Permitir a Área Técnica visualizar as implementações de bolsas
1. A Área Técnica acessa o sistema do Portal Admin e visualiza as implementações de  em "Gestão Institucional"
2. O sistema deve permitir uma visualização de todas as implementações de bolsas com mais detalhes

### UC04.1: Permitir a Área Técnica aprovar uma implementação
1. A Área Técnica acessa o sistema do Portal Admin e visualiza as implementações de  em "Gestão Institucional"
2. Ao visualizar uma implementação, o sistema deve permitir a aprovação individual de cada documento
3. O sistema deve permitir visualizar os documentos enviados pelo Pesquisador
4. Após todos os documentos estarem aprovados, o sistema deve permitir a aprovação da implementação

### UC04.2: Permitir a Área Técnica reprovar uma implementação
1. A Área Técnica acessa o sistema do Portal Admin e visualiza as implementações de  em "Gestão Institucional"
2. Ao visualizar uma implementação, o sistema deve permitir a reprovação individual de cada documento ou pedir ao Pesquisador que revise o documento dando um prazo para essa revisão
3. O sistema deve permitir visualizar os documentos enviados pelo Pesquisador
4. Após a verificação de todos os documentos, caso tenha algum reprovado, o sistema deve habilitar o botão de permitir a reprovação da solicitação