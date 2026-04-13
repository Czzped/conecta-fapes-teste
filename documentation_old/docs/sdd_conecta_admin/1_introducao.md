---
title: Introdução
sidebar_position: 1
---


## 1.1 Propósito deste documento

Este *Software Design Description (SDD)*, baseado no padrão IEEE 1016-2009, tem como objetivo descrever de forma detalhada a arquitetura, os componentes e as decisões de design do sistema **Conecta FAPES**, uma plataforma de apoio à Pesquisa, Desenvolvimento e Inovação desenvolvida em parceria entre a FAPES e o LEDS/Ifes. O documento serve como referência técnica para a equipe de desenvolvimento, garantindo consistência na implementação, facilitando a manutenção futura e assegurando que os requisitos funcionais e não funcionais sejam atendidos. 

## 1.2 Necessidade do SDD

Considerando o porte do sistema e a multiplicidade de times e tecnologias envolvidas, a formalização do projeto em um SDD é essencial para:

- Documentar decisões arquiteturais e de design;
- Reduzir ambiguidade técnica entre as equipes;
- Facilitar a manutenção e evolução do sistema;
- Suportar processos de validação, verificação e auditoria de qualidade;
- Viabilizar a integração entre componentes e equipes distintas;
- Facilitar a comunicação entre novos membros e stakeholders.

## 1.3 Público-alvo

Este documento é destinado aos seguintes perfis:

- **Desenvolvedores e Arquitetos de Software**: para guiar o processo de codificação e integração entre módulos.
- **Equipe de Qualidade (QA)**: para compreender os componentes e suas interfaces, facilitando o desenvolvimento de casos de teste.
- **Gestores Técnicos e Coordenadores de Projeto**: para acompanhar decisões técnicas e avaliar impactos.
- **Equipe de Suporte e Operações (DevOps)**: para entender os requisitos de implantação e segurança do sistema.
- **Novos membros da equipe**: como material de onboarding técnico.

## 1.4 Organização do documento

Este SDD está organizado em seções temáticas, conforme descrito a seguir:

- **[2. Descrição Geral](2_descricao_geral.md)**: Apresenta uma visão resumida do sistema, seu contexto, objetivos e principais componentes.
- **[3. Requisitos Funcionais](3_requisitos_funcionais.md)**: Lista os requisitos de software que o sistema deve atender.
- **[4. Interfaces Externas](4_interfaces_externas.md)**: Detalha os pontos de integração com sistemas externos, usuários e dispositivos.
- **[5. Design Detalhado](5_design_detalhado.md)**: Especifica a arquitetura do sistema, padrões adotados e organização modular.
- **[6. Banco de Dados](6_banco_dados.md)**: Descreve o modelo de dados, estrutura das tabelas e relacionamentos.
- **[7. Diretrizes de Design](7_diretrizes_design.md)**: Consolida convenções, restrições técnicas e boas práticas adotadas no projeto.
- **[8. Plano de Testes](8_plano_de_testes.md)**: Apresenta a estratégia de testes aplicada ao sistema, incluindo critérios de aceitação.
- **[9. Segurança](9_seguranca.md)**: Detalha aspectos de segurança, autenticação, autorização e proteção de dados sensíveis.
- **[10. Glossário](10_glossario.md)**: Define termos técnicos, siglas e conceitos relevantes para o entendimento do sistema.

Cada seção do documento pode ser lida de forma independente, mas recomenda-se a leitura sequencial para melhor entendimento da progressão de requisitos até o design detalhado.

 