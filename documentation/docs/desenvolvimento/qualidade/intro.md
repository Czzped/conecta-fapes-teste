---
title: Visão Geral
sidebar_position: 1
---

# Visão Geral
## O que é e qual a função do QA?

O conceito de Quality Assurance (QA) faz referência a um profissional ou uma equipe cuja função é **garantir a qualidade no desenvolvimento** de um produto ou serviço. A equipe de QA garante que a mercadoria seja entregue ao cliente em ótimas condições e com a **qualidade esperada** por ele. Isso evita que o produto seja entregue com problemas e erros **durante o processo**, sendo uma maneira de **alinhar a posição do seu negócio com as expectativas do cliente**, garantindo que tudo esteja **dentro do padrão de qualidade**.  
Com isso, o Quality Assurance assume um importante papel de **acompanhar e assegurar** o cumprimento de etapas, assim como sua execução. O objetivo da sua implantação é **identificar desvios que possam comprometer a qualidade final do serviço.** 

### Vantagens do QA

* Fidelização e aumento da satisfação do cliente;  
* ajuda a garantir o cumprimento dos processos já estabelecidos;  
* garante mais eficiência na execução dos novos projetos;  
* redução de custos operacionais;  
* otimização da rotina de trabalho dos profissionais de TI;  
* redução de retrabalhos;  
* eliminação de gargalos;  
* melhoria de previsibilidade aos projetos.

## Teste manual vs. automatizado

Teste manual é **presencial**, ao **clicar no aplicativo ou interagir com o software** e as APIs com as **ferramentas adequadas**. Mas o teste manual tem um **custo muito alto**, já que **requer alguém** para configurar um ambiente e executar os testes por si mesmo e **pode estar propenso a erros humanos**, uma vez que o testador pode cometer erros ortográficos ou omitir etapas no script de teste.

Testes automatizados, por outro lado, **são realizados por uma máquina que executa um script de teste escrito com antecedência**. Esses testes podem variar muito em termos de complexidade, indo desde a verificação de um único método em uma classe à garantia de que realizar uma sequência de ações complexas na interface do usuário leva aos mesmos resultados. A qualidade dos testes automatizados depende da qualidade com que seus scripts de teste foram escritos.

Testes automatizados são um componente essencial de integração contínua e entrega contínua e é uma ótima maneira de escalar o processo de QA conforme você adiciona novas funções ao seu aplicativo, porém não excluem a importância de se ter testes manuais, já que, através deles, é possível obter informações importantes como, por exemplo, a forma que o usuário final interagiria com o produto.

## O que são testes e quais os principais tipos?

### Teste Unitário

* Feitos em um nível **muito baixo** (próximo ao código fonte) do projeto;  
* realizados de forma isolada do restante do sistema;  
* tem por objetivo assegurar a qualidade das unidades de forma individual e não o sistema como um todo;  
* têm um baixo custo para automatização;  
* podem ser executados rapidamente, inclusive por um servidor de integração contínua.

Podemos entender como “unidade” as menores partes do nosso sistema, ou seja, métodos e funções das classes ou pacotes utilizados no projeto. Em resumo, testes unitários servem para testar a lógica nas menores unidades como sistema, mas não garantem que a integração entre elas estará funcionando de acordo com a vontade do cliente.

### Testes de integração

* Verificam se diferentes módulos ou serviços usados pelo seu aplicativo funcionam bem juntos;  
* idealmente, são realizados após os testes unitários, o que garante que as unidades estão corretas e também funcionem em conjunto;  
* são mais complexos para serem desenvolvidos e mais lentos ao ser executados

### Teste de ponta a ponta (E2E)

* Buscam verificar o comportamento do sistema como um todo, “de uma ponta à outra”;  
* por se tratar de um tipo de teste de alto nível, ele não se atêm aos mínimos detalhes da aplicação que está sendo testada;  
* simulam a atividade que o usuário final teria, mas feita em um ambiente preparado para ser muito semelhante ao do ambiente de produção;  
* normalmente ele é o último teste antes de o projeto entrar em produção;  
* buscam dar uma visão geral do funcionamento do sistema para tomadas de decisão;  
* podem ser utilizados para verificar se ele atende a alguma norma específica, padrões legais ou regulamentações;  
* são muito úteis, mas têm um alto custo e podem ser difíceis de atualizar quando automatizados

O ambiente no qual os testes são feitos precisa de situações que simulem o uso do produto desenvolvido no mundo real, como interagir com um banco de dados com informações reais, usar comunicações de rede, interagir com outros aplicativos, sistemas ou hardware, se necessário.

### Teste de desempenho

* Avaliam o desempenho de um sistema sob uma carga de trabalho específica;  
* ajudam a medir a confiabilidade, a velocidade, a escalabilidade e a capacidade de resposta de um aplicativo;  
* por exemplo, ele pode determinar se um aplicativo atende aos requisitos de desempenho, localizar gargalos, medir a estabilidade durante picos de tráfego

#### Teste de carga

Um **tipo de teste de desempenho** que avalia como um sistema se comporta sob **cargas esperadas** de usuários. Os testes de carga são projetados para representar **cenários comuns que os usuários enfrentam durante o uso diário**.

#### 	Teste de estresse

Um tipo de teste de desempenho que examina como um sistema se comporta **sob cargas intensas** e como ele se recupera ao voltar ao uso normal. Os testes de estresse podem ajudar a **identificar o ponto de ruptura de um sistema** e garantir que ele seja **resistente a longo prazo**.

### Teste de Regressão

O teste de regressão tem como principal objetivo **validar funcionalidades novas do software juntamente com as funcionalidades já existentes**. O seu principal objetivo é assegurar que funcionalidades que já existem não tenham bugs e que não afetem as demais partes.

### Teste de Segurança

O teste de segurança, como o próprio nome já define, é um teste que irá **garantir que ameaças externas sejam bloqueadas**. Este tipo de teste é extremamente importante e geralmente é feito por um especialista, tendo como seu principal objetivo assegurar que o software esteja protegido através de testes de vulnerabilidade e rede.

### Teste de Aceitação

O teste que é geralmente **realizado pelo usuário final e/ou clientes** e podem ser funcionais ou não funcionais. O seu principal objetivo é **garantir que o software possui as necessidades do cliente** e seja usado no ambiente de produção.

### Teste de Usabilidade

[https://rockcontent.com/br/blog/teste-de-usabilidade/](https://rockcontent.com/br/blog/teste-de-usabilidade/) 

* Busca entender como o sistema se comporta no dia a dia, na naturalidade da utilização. Esse tipo de testagem busca avaliar alguns importantes aspectos, como:  
  * gargalos no fluxo de funcionamento da aplicação ou site;  
  * sensações dos usuários;  
  * velocidade;  
  * facilidade de acesso às informações.  
* Deve ser realizado com usuários reais (e não testadores ou designers), com um perfil próximo ao da persona do projeto;  
* o objetivo é conseguir insights precisos e valiosos acerca da experiência de uso e das escolhas visuais que foram feitas;  
* a partir dos testes, os designers conseguem tomar uma decisão sobre como otimizar e limpar a interface para a melhor experiência das pessoas. 

Modelos de teste mais comuns:

#### Descoberta de problemas

O usuário deve buscar brechas e falhas que quebram o produto. Assim, o que ocorre é a entrada de informações inválidas ou fluxos de utilização mais sinuosos, que podem revelar alguma inconsistência.

#### 	Testes de benchmark

Buscam estabelecer um comparativo entre duas versões de uma aplicação. Ou seja, analisa-se a experiência, a velocidade e a facilidade de uso da interface nas duas versões, de modo a buscar insights e possibilidades de evolução. Assim, compreendem-se as melhorias ou os defeitos da atualização, de modo a possibilitar uma melhor tomada de decisão.

#### Teste competitivo

Busca comparar versões do seu sistema com uma aplicação da concorrência. O ideal é tentar identificar os pontos positivos e os que precisam de melhorias.

#### Teste de aprendizado

Nesse tipo de teste, avalia-se o quão fácil é aprender a lidar com a interface. Em outras palavras, entende-se como está a curva de aprendizado do seu sistema a partir de pessoas que utilizam a mesma função mais de uma vez. Ou seja, é avaliar se existem elementos que ficam na memória ou se realmente a pessoa precisa reaprender toda vez que entra na aplicação.

### Whitebox (Caixa Branca)

O teste de caixa branca, também conhecido como **teste estrutural**, tem como principal objetivo **avaliar o comportamento interno de software**. Ele trabalha **diretamente no código-fonte** do componente de software, ou seja, ele está preocupado com o comportamento interno, assim, o testador tem acesso ao código fonte da aplicação.

### Blackbox (Caixa Preta)

O teste de caixa preta, também conhecido como **teste funcional**, é o tipo de teste onde **não é considerado o comportamento interno do software**. Os dados de entrada são fornecidos e **há sucesso no teste se o resultado obtido for igual ao resultado esperado**, onde o testador não enxerga o código-fonte.

## Tecnologias para teste nos contextos de aplicações C\#, .NET e Vue.js/Vuetify

### Backend: C\# .NET

#### Testes Unitários:

* xUnit.net: Amplamente utilizado em projetos .NET, é uma estrutura de testes unitários leve e extensível.  
* NUnit: Outra biblioteca popular para testes unitários. O NUnit tem uma sintaxe clara e é amplamente suportado pelo Visual Studio.  
* MSTest: A estrutura de testes de unidade oficial da Microsoft, integrada ao Visual Studio e ideal para projetos que preferem uma solução Microsoft nativa.

#### Mocking:

* Moq: Framework de mocking para C\# que permite simular o comportamento de dependências durante testes unitários.  
* NSubstitute: Uma alternativa para Moq, fácil de usar e que também ajuda a simular dependências, principalmente em testes de unidade.

#### Testes de Integração e API:

* RestSharp: Uma biblioteca para chamadas de API HTTP que pode ser útil para realizar testes de integração com APIs RESTful.  
* TestServer (parte do ASP.NET Core): Para simular o ambiente de hospedagem do ASP.NET, o que é útil para testes de integração completos de APIs.

#### Testes de Performance:

* BenchmarkDotNet: Biblioteca poderosa para medir o desempenho de métodos específicos em .NET. Comumente usada para otimização de código.  
* Apache JMeter e Gatling: Podem ser usados para carga e estresse, apesar de não serem exclusivos para .NET, pois permitem testar APIs RESTful independentemente da tecnologia do servidor.

#### Análise de Cobertura de Código:

* Coverlet: Usado para gerar relatórios de cobertura de código para testes unitários e integrado a ferramentas como o xUnit.  
* Visual Studio Code Coverage: Disponível no Visual Studio Enterprise, fornece relatórios de cobertura de código para ajudar a identificar áreas não testadas.

### Frontend: Vue.js/Vuetify

#### Testes Unitários:

* Jest: Framework de testes JavaScript amplamente utilizado, com suporte para testes unitários de componentes Vue.js.  
* Vue Test Utils: Biblioteca oficial para testes unitários de componentes Vue, geralmente usada em conjunto com o Jest.

#### Testes de Integração e de Interface:

* Cypress: Uma ferramenta de automação de testes end-to-end (E2E) altamente popular, ideal para simular a interação de um usuário com o aplicativo.  
* Playwright: Uma alternativa que suporta múltiplos navegadores e oferece suporte para cenários complexos de E2E.  
* Testing Library para Vue: Focada em testes de integração, ajuda a verificar se a interface do usuário é exibida conforme esperado em diferentes cenários.

#### Testes de Performance:

* Lighthouse: Ferramenta do Google para medir o desempenho, a acessibilidade e outros aspectos das aplicações web. Pode ser usada para testar o frontend em tempo real.  
* WebPageTest: Ferramenta de teste de performance que oferece análises detalhadas do desempenho da interface e do tempo de carregamento.

#### Análise de Cobertura de Código:

* Codecov ou Coveralls: Ferramentas online para visualizar e acompanhar a cobertura de código. Integram-se bem com Jest para criar relatórios automáticos.

## Cypress: o que é, pra que serve?

Cypress é uma ferramenta poderosa de última geração desenvolvida especialmente para analistas QA e desenvolvedores, que podem usá-la para os testes unitários. Totalmente baseado em uma nova arquitetura isenta do Selenium, apresenta o próprio painel exibindo exatamente o que está acontecendo durante a execução dos testes. À medida que o script é escrito é possível acompanhar como será a execução do teste através desse painel, auxiliando o técnico em quais partes precisam de ajustes no teste.

O Cypress utiliza o Node JS como servidor e interpretador de sua linguagem JavaScript. Trabalhando juntos, cypress e Node JS estão em constante sincronização e comunicação para execução de tarefas, tornando a experiência da escrita e execução dos testes muito mais ágil, já que o Cypress também opera na camada de rede, na leitura e alteração de tráfego na web em tempo real.

Cypress contém uma completa documentação disponível em [cypress.io](http://cypress.io) que facilita a escrita dos testes tornando-os mais confiáveis, com dicas e exemplos que podem ser aplicados sem haver necessidade de perder tempo na busca pela web, já que todo conteúdo se encontra concentrado nesse site.

### Por que utilizar o Cypress?

Seu principal foco é o teste E2E. Ele executa todos os testes no mesmo ciclo de execução do sistema que está sendo testado, sem usar o controle remoto que o Selenium utiliza para acesso ao sistema. Seu principal diferencial é ter sido desenvolvido para que os testes aconteçam simultaneamente ao desenvolvimento da aplicação.

Há possibilidade de criar testes apenas de front-end e back-end, não só testes E2E. Como ele tem o controle nativo da aplicação controlando-a de cima para baixo, além de operar dentro da camada de rede, lendo e alterando o tráfego da web em tempo real.

Os logs de comandos são gravados para revisitar posteriormente os resultados. Eles são exibidos em tempo de execução dos testes, à medida que os testes são escritos e salvos o Cypress já executa a automação para que o técnico possa verificar se o que foi codado está aderente ao teste, facilitando e muito no debug da automação. Também conta com captura de tela para testes falhos e gravação de vídeos de toda execução dos testes, sem configurações extras uma vez que o Cypress tem acesso nativo ao SO, além de possibilitar criação de relatórios de testes de forma mais simples que o Selenium.

Cypress tem controle e acesso nativo a toda aplicação, possibilitando a criação dos casos de teste automatizados de forma simultânea com o próprio desenvolvimento da aplicação. O Cypress controla a aplicação de cima para baixo, onde assim interpreta o que ocorre fora e dentro do navegador que está sendo testado, fornecendo resultados muito mais consistentes do que o Selenium, por conta de a ferramenta ser capaz de compreender os eventos assim que eles acontecem. 