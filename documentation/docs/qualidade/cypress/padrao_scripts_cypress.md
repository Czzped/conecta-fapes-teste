---
title: Padrão de escrita de scripts Cypress
sidebar_position: 2
---
## Comentários com casos de teste
Os comentários com casos de teste são um ótimo guia a se ter na hora de escrever e na hora de revisar um script Cypress. Para escrevê-los, pode-se usar como base as páginas de casos de uso do módulo que os scripts serão desenvolvidos, porém, às vezes, esses casos de uso são amplos e não oferecem uma boa base para se testar uma tela de ponta a ponta. Portanto, uma maneira eficaz de preparar as situações que serão avaliadas nos testes é, realmente, usando manualmente a tela alvo e anotando resultados desejados e indesejados, para que seus testes possam alvejar passes e failures com a maior precisão possível.

**Exemplo:**
```javascript
  /**
     * Casos de teste:
     * Deve ser impedido de realizar uma inclusão vazia
     * Deve ser impedido de realizar uma inclusão com número da resolução vazio
     * Deve ser impedido de realizar uma inclusão com número da resolução em uso
     * Deve ser impedido de realizar uma inclusão com número da resolução maior que o permitido
     * Deve ser impedido de realizar uma inclusão com data de publicação vazia
     * Deve ser impedido de realizar uma inclusão com data de publicação inválida
     * Deve ser impedido de realizar uma inclusão com ementa vazia
     * Deve ser impedido de realizar uma inclusão com ementa maior que 500 caracteres
     * Deve ser impedido de realizar uma inclusão com link da publicação vazio
     * Deve ser impedido de realizar uma inclusão com link da publicação fora do domínio da Fapes
     * Deve ser impedido de alterar para numero do E-Docs vazio
  */
```
> Casos de teste observados durante o uso manual da tela `resolucao/formResolucao`

É importante deixar esse bloco comentado no início dos testes e, além disso, colocar a descrição corretamente nos `it(('') => {})`s, de forma a facilitar a leitura e compreensão do código e dos seus resultados na pipeline do Drone.

**Exemplo:**
```javascript
it('Deve ser impedido de realizar uma inclusão com número da resolução vazio', () => {
    // ACT
    cy.get('[data-test="inputDataPublicacao"]').type(dataAleatoria);
    cy.get('[data-test="textareaEmenta"]').type(randomText);
    cy.get('[data-test="inputLinkPublicacao"]').type('https://fapes.es.gov.br/' + String(numeroAleatorio));
    cy.get('[data-test="inputNumeroEDocs"]').type('WTC-' + String(numeroAleatorio));
    cy.get('[data-test="buttonSalvar"]').click();

    // ASSERT
    cy.contains('Número inválido')
    .should('exist')
    .and('be.visible');
    cy.contains('O número da resolução deve ser maior que zero')
    .should('exist')
    .and('be.visible');
    cy.get('.swal2-confirm').click();
  });
```

## Convenção AAA (Arrange, Act, Assert)
A convenção AAA (Arrange-Act-Assert) se trata de um padrão usado para estruturar os scripts Cypress de forma a torná-los mais organizados, legíveis e fáceis de entender. O AAA permite a divisão dos testes em três etapas:

### Arrange
É a etapa do código que vai preparar o que é necessário para que o teste seja executado, sendo o primeiro bloco dos testes em que ele é necessário. Envolve interceptação de requisições HTTP, acesso de uma tela principal, definição de variáveis, configuração de mocks e preparação de ambiente.

**Exemplo 1:**
```javascript
  beforeEach(() => {
    // ARRANGE
    cy.bypassLogin();
    cy.visit('/resolucao/IndexResolucao');
    cy.get('.v-navigation-drawer__scrim').click() // fecha a navbar lateral
    cy.intercept('GET', 'https://localhost:3000/api/modalidadebolsa/resolucao').as('getResolucoes');
    cy.intercept('POST', 'https://localhost:3000/api/modalidadebolsa/resolucao').as('postResolucao');
    cy.intercept('DELETE', 'https://localhost:3000/api/modalidadebolsa/resolucao/*').as('deleteResolucao');
  });
```
> Bloco Arrange sendo utilizado no `beforeEach` para preparar o teste através de comando customizado, acesso à tela index, fechamento da navbar e interceptações de requisições **HTTP POST, GET e DELETE**.

**Exemplo 2:**
```javascript
describe("Testes do módulo UC02.1 - Incluir Resoluções", () => {
  // ARRANGE
  const numeroAleatorio = faker.number.int({
    min: 1,
    max: 999999999,
  });
  const dataAleatoria = faker.date
  .between({
    from: "1960-01-01",
    to: new Date().toISOString().split("T")[0],
  })
  .toISOString()
  .split("T")[0];

  let randomText = faker.lorem.words(10);
  let randomTextGTE500 = faker.lorem.words(80);
```
> Bloco Arrange sendo utilizado dentro do describe do teste para definição de variáveis utilizadas para preencher os dados de inclusão

### Act
É o bloco de ações do código. Utiliza elementos da tela e o que foi definido no Arrange para interagir e executar as ações que serão testadas. Envolve interações como cliques e preenchimento de formulários.

**Exemplo:**
```javascript
  it('Deve ser capaz de incluir uma nova resolução preenchida corretamente', () => {
    // ARRANGE
    let randomText2 = faker.lorem.words(50);
    while (randomText2.length < 500) {
      randomText2 += " " + faker.lorem.word();
    }
    randomText2 = randomText2.slice(0, 500);

    // ACT
    cy.get('[data-test="inputNumeroResolucao"]').type(String(numeroAleatorio));
    cy.get('[data-test="inputDataPublicacao"]').type(dataAleatoria);
    cy.get('[data-test="textareaEmenta"]').type(randomText2);
    cy.get('[data-test="inputLinkPublicacao"]').type('https://fapes.es.gov.br/' + String(numeroAleatorio));
    cy.get('[data-test="inputNumeroEDocs"]').type('WTC-' + String(numeroAleatorio));
    cy.get('[data-test="buttonSalvar"]').click();
```
> O bloco Act está pegando os elementos que o tester deseja interagir, e preenchendo com os dados previamente definidos no Arrange. Por fim, o clique no botão de salvar é realizado.

### Assert
O bloco de Assert é onde é verificado se o sistema teve os comportamentos e resultados esperados. O bloco Assert é parte fundamental do teste, um teste sem bloco Assert não está verificando nada, apenas realizando ações, o que pode acarretar em falsos positivos. Portanto, é de suma importância dar atenção especial a esse bloco, visto que uma assertion errada pode inutilizar todo o seu código. Envolve verificação de visibilidade, existência e conteúdo de elementos, além de redirecionamentos, igualdades etc.

**Exemplo 1:**
```javascript
    // ASSERT
    cy.get('@postResolucao')
    .should('exist');
    cy.contains('sucesso')
    .should('exist')
    .and('be.visible');
```
> O bloco Assert está verificando que uma requisição interceptada no Arrange deve existir após o bloco Act. Além disso, está verificando que o elemento que contém o texto “sucesso” existe no DOM e está visível.

**Exemplo 2:**
```javascript
    // ASSERT
    cy.get('@editResolucao')
    .should('not.exist');
    cy.wait(2000);
    cy.url().should('not.contain', 'Index');
```
> O bloco Assert está verificando que a requisição de edição interceptada no Arrange não deve existir após o bloco Act, além de verificar que a URL não deve ter um redirecionamento à tela index.

**Exemplo de uma assertion que não valida nada:**
```javascript
  // ACT
  cy.get('[data-test="elemento"]').type('123');

  // ASSERT
  cy.get('[data-test="elemento"]').should('contain', '123');
```
> Não há necessidade de validar os inputs feitos pelo próprio Cypress, visto que, se algo correr errado durante o preenchimento, o teste falhará na etapa de Act, e nem chegará ao Assert. Ao mesmo passo que, se tudo rodar corretamente, o Assert estará apenas gastando tempo revalidando algo que não tem necessidade de ser validado.

## Interceptação de requisições HTTP
O Cypress oferece o comando `cy.intercept()` para interceptar e modificar requisições antes que elas sejam enviadas ou depois que a resposta seja recebida. É interessante usar as requisições HTTP como uma camada extra de verificação no bloco de Assert, ou usar como um parâmetro a ser aguardado pelo `cy.wait()`. A vantagem de passar uma requisição em vez de um número fixo como parâmetro para o `cy.wait()` é que, caso a requisição demore mais que o planejado, o teste retornará um falso negativo, ou o teste pode ficar mais tempo esperando do que o necessário. Se o teste, em vez disso, está aguardando o resultado específico da requisição, há a garantia de que os resultados estão presentes e o script aguardará apenas o tempo necessário para receber os dados.

### 1. Interceptando e Monitorando Requisições
Pelo Cypress, é possível capturar chamadas a APIs e validar se foram feitas corretamente.

**Exemplo:**
```javascript
// ARRANGE
cy.intercept('GET', 'https://localhost:3000/api/modalidadebolsa/resolucao').as('getResolucoes');
// ACT
cy.visit('/resolucao/IndexResolucao');
// ASSERT
cy.wait('@getResolucoes').its('response.statusCode').should('eq', 200);
```
> A requisição está sendo interceptada e monitorada pela alias @getResolucoes através do comando `cy.intercept()` no bloco Arrange. Então, no bloco Act a página IndexResolucao é acessada, e o Cypress verifica no Assert se a requisição `@getResolucoes` foi chamada e se trouxe o resultado esperado (200).

### 2. Simulando Respostas da API (Mocking)
Caso seja necessário evitar chamadas reais à API, é possível substituir a resposta por dados simulados.

**Exemplo:**
```javascript
cy.intercept('GET', '/api/users', {
  statusCode: 200,
  body: [{ id: 1, name: 'Davi Nunes' }, { id: 2, name: 'João Silva' }]
}).as('mockUsers');
cy.visit('/users');
cy.wait('@mockUsers');
// Valida se os usuários mockados estão na tela
cy.get('.user-item').should('have.length', 2);
```
### 3. Simulando Erros da API
O Cypress também permite o teste de como a aplicação lida com falhas na API.

**Exemplo:**
```javascript
cy.intercept('GET', '/api/users', {
  statusCode: 500,
  body: { error: 'Internal Server Error' }
}).as('errorUsers');
cy.visit('/users');
cy.wait('@errorUsers');
// Verifica se a UI exibe uma mensagem de erro
cy.get('.error-message').should('be.visible');
```
> Aqui, a API sempre retorna um erro 500, e o teste verifica se a aplicação exibe uma mensagem de erro.

## Atributos `data-test`
Os atributos `data-test` são muito úteis no desenvolvimento de scripts Cypress porque permitem que os testes sejam mais estáveis, confiáveis e fáceis de manter. O uso desses atributos no front-end e nos scripts Cypress evitam a dependência da estrutura do HTML, como classes e id's que podem mudar em atualizações do front-end ou quando são geradas dinamicamente, o que quebraria os testes e retornaria falsos negativos.

A implementação desses atributos nos scripts também permitem uma maior legibilidade sem precisar de comentar em cada linha sua funcionalidade. Por exemplo, em vez de um seletor genérico como `.button.primary`, você pode usar `[data-test="submit-button"]`, tornando o propósito mais claro.

Os atributos `data-test` também aumentam a performance dos testes, permitindo o Cypress encontrar elementos mais rápido, ao evitar percorrer árvores DOM complexas.

Caso, enquanto o script está sendo desenvolvido, seja encontrada uma barreira que pode ser resolvida pela implementação do atributo `data-test` em algum elemento da tela, faça um fork do repositório do front-end e adicione os atributos necessários no seu repositório local. Quando terminar, faça um PR para o repositório do `leds-conectafapes` para atualizar os ambientes com base nele, assim garantindo a funcionalidade do seu teste em todos os ambientes.