---
title: 'Acessibilidade Digital'
---
# O que é a WCAG?

As Diretrizes de Acessibilidade para Conteúdo da Web (WCAG, na sigla em inglês) são um conjunto de normas desenvolvidas pela Iniciativa de Acessibilidade na Web (WAI) do World Wide Web Consortium (W3C) para **tornar o conteúdo da web mais acessível** para pessoas portadoras de deficiências. [Acesse a diretriz aqui.](https://www.w3.org/WAI/WCAG21/quickref/)

Elas fornecem recomendações específicas para melhorar a acessibilidade de sites e aplicativos web, abordando diversos aspectos como contraste de cores, navegabilidade, usabilidade de interfaces e compatibilidade com tecnologias assistivas. Seguir essas diretrizes ajuda a garantir que todos, independentemente de suas habilidades, possam acessar e utilizar o conteúdo online de maneira eficaz.

A WCAG é organizada em níveis de conformidade (A, AA, e AAA), com cada nível representando um grau maior de acessibilidade. O menor nível de conformidade A normalmente pode ser lido como aquele conteúdo não sendo acessível, por isso buscamos sempre os níveis AA e AAA. Logo:

- A: não é acessível, deve ser evitado.
- AA: minimamente acessível; é aceito pela diretriz.
- AAA: acessibilidade máximo; é o nosso alvo.

## Alguns critérios que seguiremos nesse projeto

### Cores e Contraste
1. **Critério 1.4.3: Contraste (Mínimo)**

O contraste entre o texto (ou imagens de texto) e o plano de fundo deve ser de pelo menos 4.5:1 para texto normal e 3:1 para texto grande (24px ou 18px em negrito).

Para checar esses valores: [ferramenta ContrastChecker](https://webaim.org/resources/contrastchecker/), em foreground coloque a cor do texto que pretende usar e em background a cor de fundo de onde esse texto ficará, e a ferramenta te dará o valor de contraste. Existe também um plugin no Figma chamado [Contrast](https://webaim.org/resources/contrastchecker/) com a mesma funcionalidade.

2. **Critério 1.4.6: Contraste (Melhorado)**
Para o nível AAA (acessibilidade máxima), o contraste entre o texto e o plano de fundo deve ser de pelo menos 7:1 para texto normal e 4.5:1 para texto grande.

3. **Critério 1.4.1: Uso de Cor**
A cor não deve ser o único meio de transmitir informações, indicar uma ação, solicitar uma resposta ou distinguir um elemento visual. Exemplo: um link de texto deve ser indicado pela cor e underline.

### Tamanho de Botões e Área de Clique
1. **Critério 2.5.5: Tamanho do Alvo (Alvo de Clique)** 
Para nível AAA, o tamanho do alvo de clique (como botões e links) deve ser de pelo menos 44 por 44 pixels CSS, exceto quando o alvo está em uma frase ou bloco de texto.

### Tipografia e Layout
1. **Critério 1.4.8: Apresentação Visual (Somente Nível AAA)**
- A largura máxima de linha deve ser de 80 caracteres ou menos (para prevenir textos horizontalmente muito longos).

- O texto deve ser justificado à esquerda (ou à direita para scripts de direita para esquerda) e não justificado.

- O espaçamento entre linhas deve ser de pelo menos 150% o tamanho da fonte dentro de parágrafos e espaçamento entre parágrafos deve ser pelo menos 150% o espaçamento entre linhas .

2. **Critério 1.4.12: Espaçamento de Texto**
O usuário deve ser capaz de ajustar o espaçamento do texto sem perda de conteúdo ou funcionalidade:
- Altura da linha (espaçamento entre linhas) para pelo menos 150% o tamanho da fonte.
- Espaçamento entre parágrafos para pelo menos 200% o tamanho da fonte (é o ideal, mas nem sempre será seguido à risca).