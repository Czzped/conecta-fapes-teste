---
title: Geração de Código
sidebar_position: 1
---
O desenvolvimento de sistemas de informação gasta entre 20% e 40% do tempo do projeto na criação repetitiva de operações de CRUD (Create, Read, Update e Delete). A oportunidade aqui é aumentar a produtividade da equipe, reduzindo esse esforço para cerca de 10% por meio de automação, Model-Driven Development (MDD) e Inteligência Artificial (IA). A proposta é desenvolver um plugin para o VSCode que, a partir de metamodelos de UML e descrições de casos de uso, gere automaticamente o código de CRUD, resultando em ganhos de produtividade, padronização do código e menor índice de bugs. Espera-se uma melhora tangível de 10% na performance da equipe, com métricas claras de sucesso: velocidade de entrega e redução de erros.

## Contexto 
O cenário atual do desenvolvimento de sistemas de informação é marcado por um dispêndio significativo de tempo na criação de operações CRUD, representando entre 20% a 40% do esforço total do projeto. Esse é um trabalho repetitivo e suscetível a erros humanos, aumentando custos e diminuindo a escalabilidade da equipe. Em um contexto no qual projetos precisam ser mais ágeis e entregar valor mais rapidamente, o tempo gasto em tarefas rotineiras gera impactos negativos na produtividade e no time-to-market.

**Dados Relevantes:**
- Tempo investido em CRUD: 20% a 40% do projeto. No ano de 2024, o projeto Conecta Fapes investiu mais de 16 mil horas de desenvolvimento para os módulos iniciais.
- Espera-se reduzir o esforço de CRUD para aproximadamente 10% do tempo total.
- Modelos UML e especificações de casos de uso já são frequentemente utilizados nas fases iniciais do projeto.

## Problema ou Oportunidade 
**Problema:** O excesso de esforço gasto em tarefas repetitivas, pouco criativas e mecânicas na criação de CRUDs. Isso gera custos adicionais, atraso na entrega e baixa motivação da equipe em tarefas de baixo valor agregado.

**Oportunidade:** Ao automatizar a geração de código, podemos aumentar drasticamente a velocidade de entrega, reduzindo retrabalho e erros. Além disso, a equipe pode se concentrar em problemas de negócio mais complexos e estratégicos.

**Insight:** Ao utilizar técnicas de MDD e IA, é possível transformar descrições em alto nível (diagramas UML e casos de uso) diretamente em código funcional. Isso reduz a necessidade de codificação manual, diminui erros e padroniza a base de código. Dessa forma, a partir de um conjunto de modelos, teremos a geração sistemática dos CRUDs.

## Solução Proposta 
**Crença:** Acreditamos que uma ferramenta de geração de código, baseada em metamodelos UML e IA, integrada ao VSCode, pode automatizar a criação de CRUDs, melhorando o desempenho da equipe e reduzindo drasticamente o tempo gasto.

**Proposta de Solução:**  
Desenvolver um plugin para o VSCode que:  
1. Interprete modelos UML (diagrama de classes, atributos, relacionamentos) e descrições de casos de uso.  
2. Use algoritmos de MDD e técnicas de IA (por exemplo, NLP ou LLMs) para converter esses modelos em código pronto para uso.  
3. Gere automaticamente as operações CRUD em uma plataforma-alvo, garantindo padronização e qualidade.

## Benefícios 
**Para a Organização:**  
1. **Redução de Tempo:** Diminuição do esforço com CRUD de 20-40% para cerca de 10% do tempo total de desenvolvimento.  
2. **Padronização:** Código gerado de forma consistente, reduzindo variações entre desenvolvedores e minimizando o risco de erros humanos.

**Resultados Esperados:**  
- Melhora de 10% na performance da equipe (medida em tempo de entrega e qualidade do código).  
- Aumento da previsibilidade e repetibilidade do processo de desenvolvimento, permitindo alocação mais estratégica dos recursos.

## Métricas de Sucesso
**1) Velocidade na Entrega:**  
- Comparar tempo médio de desenvolvimento de CRUDs antes e depois da automação.
  
**2) Redução de Bugs:**  
- Monitorar a quantidade de defeitos registrados relacionados a funcionalidades CRUD, comparando períodos antes e depois da adoção da solução.

## Detalhes Operacionais 
**Plano de Implementação:**  
1. **Criar uma Linguagem de Modelagem de UML Especializada:**  
   - Ajustar o metamodelo UML para capturar todos os elementos necessários à geração de CRUD.  
2. **Desenvolver Transformadores MDD + IA:**  
   - Criar algoritmos que, a partir dos modelos UML, gerem código de CRUD automaticamente.  
   - Treinar o modelo de IA para identificar padrões e mapear modelos em código fonte na linguagem-alvo.

**Recursos Necessários:**  
- 2 pessoas com conhecimento em MDD e IA.  
- Infraestrutura mínima para testes (VSCode, ambiente de build automatizado).

**Desafios e Mitigação:**  
- **Treinamento da Equipe:** Necessário capacitar desenvolvedores em MDD e IA.  
  - **Mitigação:** Promover workshops internos e documentar o processo.  
- **Ajustes de Metamodelo:** Refinar o metamodelo UML para garantir a completude da geração.  
  - **Mitigação:** Realizar iterações frequentes e protótipos, ajustando conforme o feedback.