---
title: Boas práticas em automação de testes com Cypress
sidebar_position: 1
---
# Boas práticas em automação de testes com Cypress
* [**Documentação oficial**](https://docs.cypress.io/app/core-concepts/best-practices)  
* [**Vídeo Completo**](https://www.youtube.com/watch?v=s1h6AfYMYDY)  
* [**Mapa mental Cypress**](https://github.com/samlucax/cypress-essencial-mindmap/blob/master/cypress-essencial-mindmap.png)  
* [**Vídeo palestra criador Cypress Completo**](https://youtu.be/5XQOK0v_YRE)  
* [**Vídeo palestra criador Cypress (parte específica de boas práticas)**](https://youtu.be/5XQOK0v_YRE?t=1481)
## Pular navegação entre as telas (quando possível)
### Links
	**[Vídeo](https://youtu.be/s1h6AfYMYDY?t=190); [Documentação Oficial (Custom Commands, tópico 4\)](https://docs.cypress.io/api/cypress-api/custom-commands#Best-Practices)**

	**Exemplo:** Caso o interesse seja validar se uma tela está disponível corretamente após um cadastro ou login de usuário, não é ideal gastar tempo da aplicação preenchendo o respectivo formulário. Para isso, é uma boa prática pular a etapa de navegar pela tela de cadastro/login realizando um processo como, por exemplo, uma requisição HTTP que envie diretamente à aplicação um cadastro/login teste que possibilite a verificação da tela desejada.
## Definir uma URL base global
### Links
	**[Vídeo](https://youtu.be/s1h6AfYMYDY?t=840); [Documentação Oficial](https://docs.cypress.io/app/core-concepts/best-practices#Setting-a-Global-baseUrl)**

	Serve para facilitar o reuso do código, evitando repetições de, por exemplo, o comando `cy.visit(‘https://aplicacao.com’)` quando quiser acessar a aplicação, ou até mesmo ter que digitar toda a URL da aplicação quando quiser acessar uma sub rota (`cy.visit(‘https://aplicacao.com/rota/subrota’)`).  
	Com uma URL global, o código necessário para acessar a aplicação se torna apenas `cy.visit(‘/’)`, ou, em casos de sub rotas,  `cy.visit(‘/rota/subrota’)`.  
	A URL base pode ser definida através do arquivo `cypress.config.js` ou um arquivo de constantes.  
```javascript 
const { defineConfig } = require('cypress')

module.exports = defineConfig({
	e2e: {
		baseUrl: 'http://localhost:8484',
	},
})
```
## Usar múltiplas asserções (Específico E2E)
### Links
	**[Vídeo](https://youtu.be/s1h6AfYMYDY?t=1186); [Documentação Oficial](https://docs.cypress.io/app/core-concepts/retry-ability#Multiple-assertions); [Documentação Oficial (Core Concepts)](https://docs.cypress.io/app/core-concepts/best-practices#Creating-Tiny-Tests-With-A-Single-Assertion)**

	No Cypress, as asserções são verificações usadas para garantir que o código ou aplicação está funcionando conforme esperado durante os testes. Elas servem para comparar valores ou condições e confirmar se o estado atual de um elemento ou funcionalidade corresponde ao comportamento esperado. Existem dois tipos principais de asserções no Cypress:
### [Asserções Implícitas](https://docs.cypress.io/app/core-concepts/retry-ability#Implicit-Assertions)
O Cypress automaticamente inclui asserções enquanto você interage com elementos. Por exemplo, se for usado um comando como `.should()`, ele verifica se algo atende a uma condição.
### Asserções Explícitas
Usam bibliotecas como Chai (inclusa no Cypress) para criar verificações mais personalizadas. Essas asserções podem ser combinadas com o Cypress para verificar diretamente os valores.
### Exemplos de Condições Comuns:
* Existência: `.should('exist')` ou `.should('not.exist')`  
* Visibilidade: `.should('be.visible')` ou `.should('not.be.visible')`  
* Estado de um elemento: `.should('be.disabled')`, `.should('be.checked')`  
* Texto ou conteúdo: `.should('contain', 'Texto')`, `.should('have.text', 'Texto exato')`  
* Classes ou atributos: `.should('have.class', 'nome-classe')`, `.should('have.attr', 'atributo', 'valor')`

Como em um teste E2E a quantidade de features avaliadas é maior e mais diversificada que em testes unitários, usar múltiplas asserções permite um teste mais seguro e maior facilidade para encontrar a falha do teste. Evitar, nesses casos, criar um teste para cada feature, e, ao invés disso, criar um teste com várias asserções.
## Escrever cenários com boa legibilidade
### Links
	[**Vídeo**](https://youtu.be/s1h6AfYMYDY?t=1430)

	Pensar no nome e contexto do teste com base em 4 passos:

1. O que está sendo testado? (describe - context)  
2. Sob que circunstâncias, condições?   
3. Qual o resultado esperado?  
4. Juntar resposta da 2 e 3 em uma frase para descrever o teste.  

Exemplo:  
1. Aplicação - Feed  
2. Autenticado  
3. Visualizar o menu navegável  
4. ```javascript
	context(‘Feed’, () => {

	it(‘Quando estiver autenticado, devo visualizar o menu navegável’, () => {...  

		})
	})
	```
## Seguir convenção AAA no fluxo de teste
### Links
	[**Vídeo**](https://youtu.be/s1h6AfYMYDY?t=1869)**; [Documentação Oficial](https://docs.cypress.io/app/core-concepts/retry-ability#Implicit-Assertions)**
### O que é?
É uma forma de pensar nos nossos testes em formato de blocos:

1. **Arrange - Preparação**: O que é preciso fazer antes de executar o teste ou para chegar ao ponto para de fato testar a aplicação.  
2. **Act - Ação**: O que o teste vai executar para conferir os resultados  
3. **Assert - Asserção/ Validação / Verificação**: Onde é conferido se o teste teve o resultado esperado
### Exemplo:
1. **Arrange:** Preparando o teste através da interceptação da requisição HTTP e da realização do login no sistema  
```javascript
beforeEach(() => {

	// ARRANGE
	// interceptar uma requisição
	cy.intercept({
		method: 'GET',
		hostname: 'res.cloudinary.com'
		}, {
		statusCode: 200,
		fixture: 'example'
		})

	cy.login()
});
```
2. **Act:** A ação de acessar a URL do site com uma baseURL já definida 
```javascript
	it('Quando estiver autenticado, devo visualizar o menu navegável', () => {
		// ACT
		cy.visit('/')
	})
``` 
 
3. **Asserts** que verificarão se o menu navegável está visível e se ele contém o que é exigido nas regras de negócio 
```javascript
it('Quando estiver autenticado, devo visualizar o menu navegável', () => {
	// ACT
	cy.visit('/')

	// ASSERT
	cy.get('nav ul li')
	.should('be.visible')
	.and('have.length', 6)
	.each(($el, index, $list) => {
		let options = [
			'Home',
			'Explore',
			'Notifications',
			'Bookmarks',
			'Profile',
			'More'
		]

		cy.log(index)
		cy.get($el)
		.find('span')
		.should('have.text', options[index])
	})
})
```  
## Isolar fatores externos (quando necessário)
### Links
	**[Vídeo](https://youtu.be/s1h6AfYMYDY?t=2233); [Documentação Oficial](https://docs.cypress.io/app/core-concepts/best-practices#Visiting-External-Sites)**

	Na validação da aplicação, pode ser que haja requisições a serviços externos, como serviços de imagens, o que poderia acarretar em falsos negativos, ou seja, um teste que falha por alguma falha de terceiros, e não uma falha da execução da aplicação.
## Documentar comandos customizados
### Links
	**[Vídeo](https://youtu.be/s1h6AfYMYDY?t=2745); [Documentação Oficial](https://docs.cypress.io/api/cypress-api/custom-commands#5-Write-TypeScript-definitions); [Repositório Exemplo Oficial](https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense)** 

	O Cypress conta com um recurso para [**criar comandos customizados**](https://docs.cypress.io/api/cypress-api/custom-commands#Usage) ou [**sobrescrever comandos**](https://docs.cypress.io/api/cypress-api/custom-commands#Overwrite-Existing-Commands) do Cypress para a própria API. Criar um arquivo `index.d.ts` para realizar a documentação.