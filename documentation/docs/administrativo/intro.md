---
title: Organograma
sidebar_position: 1
---
## Organograma Geral do Projeto

```mermaid

graph TD
    A[Coordenação Geral] --> B[Guild]
    
    A --> S[Stream-aligned Teams]    
   
    A --> P[Equipe de Plataforma]    
    
    A --> Q[Equipe de Qualidade]    

    A --> AC[Equipe de Formação]    
    
    A --> PR[Produtos Internos]       


```

| Unidade Organizacional | Descrição   |
|------------------------|-------------|
| Guild                | É um conjunto de profissionais com as mesmas habilidades e dentro da mesma área de competência, dentro da mesma tribo, e que trocam informações, conhecimentos e experiências. Guilds são normalmente liderados por um Guild lead. | 
| Stream-aligned Team  | Um squad de desenvolvimento é uma equipe multidisciplinar e autônoma, formada por profissionais de diferentes áreas, como desenvolvedores, designers, analistas, testadores, etc., que trabalham juntos em um projeto específico, com um objetivo comum e um prazo definido. | 
| Equipe de Plataforma       |Equipe que cria e mantém uma plataforma interna composta por ferramentas, serviços, APIs ou infraestrutura que outras equipes (como Stream-aligned Teams) utilizam para acelerar a entrega de valor. | 
| Equipe de Qualidade          | Equipe responsável por garantir a que os artefatos sejam desenvolvidos com a qualidade definida.|     
| Produtos Internos          | Uma equipe que cria e mantém uma plataforma interna composta por ferramentas que ajudam a melhorar o dia-a-dia do desenvolvimento |     
| Equipe de Formação | Uma equipe que cria e mantém uma plataforma de formação inicial e continuada do Conecta |     

## Coordenação Geral

```mermaid

graph TD
    B[<b>Coordenação Geral</b>]
   
    B --> F[<b>Coodenador Geral</b><br>Paulo Sérgio dos Santos Júnior]
    B --> R[<b>Coordenadora Financeira e Pessoal</b><br> Michele Rudio Constantino]
    R --> C[<b>Análista de Redes Sociais</b><br> Renan]
    R --> D[<b>Desenvolvedor</b><br> Alonso]
    R --> E[<b>Psicologo</b><br> Lênio Oliveira ]
    

```
| Unidade Organizacional | Descrição   |
|------------------------|-------------|
| Coordenador Geral      | Reponsável por garantir que a equipe tenha sucesso nas entregas do projeto e atenda as necessidades da FAPES | 
| Coordenadora Financeira e Pessoal  | Responsável por garantir a saúde financeira e da cultura organizacional do projeto|  
| Análista de Redes Sociais  | Responsável pelo planejamento, análise e publicação nas redes sociais do LEDS.|
| Desenvolvedor  | Responsável pelo automação dos processos administrativos.|   
| Psicólogo  | Responsável pela saúde mental e organizacional do projeto|   


## Guild

```mermaid

graph TD
    B[<b>Guild</b>]
   
    B --> F[<b>Guild Lead Gestão de Projetos</b><br>Felipe Frechiani de Oliveira]
    B --> R[<b>Guild Lead DevOps </b><br> Rafael Emerick Zape de Oliveira]
    B --> D[<b>Guild Lead IA </b><br> Daniel Cruz Cavalieri]
    B --> M[<b>Guild Lead BI </b><br> Moises Savedra Omena]
    B --> C[<b>Guild Lead Formação </b><br> Rodrigo Fernandes Calhau]      
    B --> H[<b>Guild Design </b><br> Hugo Cristo Sant’Anna]      
    

```

| Papel             | Descrição            |
|------------------------|-----------------------|
| Guild Lead Gestão de Projetos | Responsável por definir e garantir que as boas práticas de gestão de projeto sejam aplicadas no projeto. | 
| Guild Lead DevOps    | Responsável por definir e garantir que as boas práticas da cultura DevOps sejam aplicadas no projeto.| 
| Guild Lead IA| Responsável por definir e garantir que as boas práticas de IA sejam aplicadas no projeto.| 
| Guild Lead BI | Responsável por definir e garantir que as boas práticas de BI sejam aplicadas no projeto. | 
| Guild Lead Formação | Responsável por definir e garantir que as práticas de ensino e aprendizagem sejam aplicadas no projeto. | 
| Guild Lead Design | Responsável por definir e garantir que as boas práticas de Design (UX/UI) sejam aplicadas no projeto. | 

## Equipes

O formato das equipes é apresentados a baixo.

```mermaid

graph TD
    B[<b>Equipe</b>]
   
    B --> F[<b> Tech Leader</b>]
    B --> R[<b>Desenvolvedores </b>]
    
```
| Papel             | Descrição            |
|------------------------|-----------------------|
| Tech Leader | Responsável por liderar a equipe de desenvolvimento de software, garantindo que as soluções técnicas estejam alinhadas com os objetivos do projeto e da empresa. | 
| Desenvolvedor    | Responsável por definir e construir a solução.| 

### Stream-aligned Team

Equipe responsável por entregas de demandas do cliente.

```mermaid

graph TD
    B[<b>Stream-Aligned Team</b>]
   
    B --> M[<b>Tech Leader </b><br>Manoel]
    B --> V[<b>Tech Leader </b><br>Vinicius]
    B --> RO[<b>Consultor de Back-end</b><br>Robson]
    B --> MAY[<b> Consultor de Front-End </b><br>Mayara]
    
    M --> MA[<b> Desenvolvedor</b><br> Marcos]
    M --> C[<b> Desenvolvedor</b><br> João Pedro]
    M --> D[<b> Desenvolvedor</b><br> Marcela]
    V --> E[<b> Desenvolvedor</b><br> Harian]
    V --> F[<b> Desenvolvedor</b><br> Gustavo]
    V --> G[<b> Desenvolvedor</b><br> Bruno]
    V --> R[<b> Desenvolvedor</b><br> Rafael]
    
```

### Equipe de Designer
Equipe responsável por definir e Auditar a implementação do  Design System e  componentes de UX/UI do projeto.

```mermaid

graph TD
    B[<b>Equipe de Designer</b>]
   
    B --> F[<b>Tech Leader de UX </b><br>Isabela]    
    B --> D[<b>Tech Leader de UI </b><br>Dara]
    F --> A[<b> Designer UX</b><br> ANA]
    D --> M[<b> Designer UI</b><br> Mariana]
```

### Equipe de Negócio
Equipe responsável por entender as necessidade do negócio e passar as informações iniciais para os Stream-aligned Team.

```mermaid

graph TD
    B[<b>Equipe de Negócio</b>]
   
    B --> F[<b>Tech Leader </b><br>Jennifer]
    B --> M[<b> Desenvolvedor Front-End</b><br> Marcela]
    B --> BR[<b> Desenvolvedor Back-End</b><br> Bruno]
    B --> R[<b> Designer</b><br> Isabela]
```

### Equipe de Plataforma de Qualidade

```mermaid

graph TD
    B[<b>Equipe de Qualidade</b>]
   
    B --> F[<b>Tech Leader </b><br>Sofia]
    B --> R[<b> Tester</b><br> Leandro]
    B --> C[<b> Tester</b><br> Davi]
    B --> D[<b> Tester com foco em automação</b><br> Gian]    
```

| Papel             | Descrição            |
|------------------------|-----------------------|
| Tech Leader | Responsável por liderar a equipe, garantindo que as soluções técnicas estejam alinhadas com os objetivos do projeto e da empresa. | 
| Tester    | Responsável pelo desenvolvimento e avaliação de testes criados pelos desenvolvedores e criar testes de performance e outros tipos de testes.| 
| Tester com foco em automação    | Responsável pelo desenvolvimento de automações de teste.| 

### Equipe de Plataforma

```mermaid

graph TD
    B[<b>Equipe de Plataforma</b>]
   
    B --> F[<b>Tech Leader </b><br>João Marcos]
    B --> R[<b> Engenheiro de Plataforma</b><br> Heitor]
    B --> C[<b> Engenheiro de Plataforma</b><br> Luan]
    B --> D[<b> Engenheiro de Plataforma</b><br> Cremasco]    
```

| Papel             | Descrição            |
|------------------------|-----------------------|
| Tech Leader | Responsável por liderar a equipe, garantindo que as soluções técnicas estejam alinhadas com os objetivos do projeto e da empresa. | 
| Engenheiro de Plataforma    |  Reponsável por integrar desenvolvimento e operações, criando pipelines de CI/CD e automatizando implantações e foca na disponibilidade dos sistemas, monitora desempenho e implementa alertas para reduzir falhas.| 


### Equipe de Plataforma de Produtos Internos

Equipe responsável por implementar soluções que melhorem o dia-a-dia do desenvolvimento de software. 

```mermaid

graph TD
    B[<b>Equipe Produtos Internos</b>]
   
    B --> F[<b>Tech Leader </b><br>Paulo Sérgio dos Santos]
    B --> R[<b> Integrador de Dados</b><br> André Coelho]
    B --> C[<b> Especialista em IA </b><br> Gabriel]
    B --> D[<b> Especialista em IA </b><br> Guilherme]    
```

| Papel             | Descrição            |
|------------------------|-----------------------|
| Tech Leader | Responsável por liderar a equipe, garantindo que as soluções técnicas estejam alinhadas com os objetivos do projeto e da empresa. | 
| Integrador de Dados    | responsável por integrar dados das ferramentas de desenvolvimento e gerar das dashboard e estatisticas sobre o desenvolvimento de software.|
| Especialista em IA | responsável por desenvolver e implementar soluções para melhorar o dia-a-dia das squads de desenvolvimento.|


### Equipe de Formação

Equipe responsável pela formação início e contínuada das equipes.

```mermaid

graph TD
    B[<b>Equipe Formação</b>]
   
    B --> F[<b>Tech Leader </b><br>Rodrigo Fernandes Calhau]
    B --> E[<b>Desenvolvedor </b><br> Eduardo]
    B --> D[<b>Arquiteto de LMS </b><br> Daniel]
    
```

| Papel             | Descrição            |
|------------------------|-----------------------|
| Tech Leader | Responsável por liderar a equipe, garantindo que as soluções técnicas estejam alinhadas com os objetivos do projeto e da empresa. | 
| Desenvolvedor | Responsável pelo sistema de gestão de competência.| 
| Arquiteto | Responsável por manter e customizar o LMS. | 
