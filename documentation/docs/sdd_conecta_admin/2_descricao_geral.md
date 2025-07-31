---
title: Descrição Geral
sidebar_position: 2
---
### 2.1 Perspectiva do Produto
O **ConectaFapes**, desenvolvido pela equipe do **LEDS** do **IFES Campus Serra**, é uma solução tecnológica que visa gerenciar e integrar os processos operacionais de apoio à Pesquisa, Desenvolvimento e Inovação (PD&I) da FAPES

A solução foi desenvolvida dentre utilizando as melhores práticas de desenvolvimento de software ágil, e é organizadas e componentes modulares que utilizam uma base de dados comum.

### 2.2 Funções do Produto

#### 2.2.1 - Módulo Administrativo
Este módulo está relacionado às atividades da equipe interna de colaboradores da **FAPES**. Visa agilizar o processo de pagamento de bolsistas cadastro de modalidades de bolsa, importação de editais do sistema legado, gerenciamento de Editais, etc. de As principais funções do **ConectaFapes Admin** incluem, até o momento:

- **Gerenciamento de Modalidades de Bolsas:** Permite o cadastro e manutenção das Modalidades, Níveis e Requisitos de Bolsas definidos por meio de Resoluções da FAPES.

- **Importação de Editais:** Possibilita a importação a partir do SigFapes, de informações relativas a Editais, Projetos e Alocações, necessárias para alimentar o processo Gerar Folha de Pagamento de Bolsistas.
  
- **Dashboards para Gerenciamento de Editais:** Proporciona a visualização de dados em formato de dashboards referentes aos Editais e Projetos para melhor tomada de decisão das gerencias das Áreas Técnicas.

- **Pagamento de Bolsistas:** O módulo Pagamento de Bolsistas visa permitir o controle de pagamentos mensais aos bolsistas de editais da FAPES. Esta especificação tem como Escopo a Definição de Calendário, Liberação de Editais, Geração de Folha e Autorização de Folha.

### 2.3 Classes e Características do Usuário

#### 2.3.1 - Módulo Administrativo
Atualmente o módulo administrativo é acessível apenas para **colaboradores internos** da **FAPES**. Essa restrição deve ser aplicada a nível de rede Internet, gateway de aplicação e aplicação. O sistema conta com um usuário Administrador, que é capaz de acessar o sistema de controle de políticas de acesso, que também deve ter acesso restrito. Neste sistema é possível cadastrar usuário e vincula-los a políticas de acesso **RBAC** (Role-Based Access Control) e **ABAC** (Attribute-Based Access Control).

### 2.4 Ambiente de Operação e Restrições de Design e Implementação

- O sistema foi desenvolvido buscando-se, ao máximo, compatibilidade com o portifólio de tecnologias utilizadas pelo **Prodest**, atendendo-se os requisitos definidos pela **FAPES**. 

- Todas os componentes executam em **containers** e são produzidos após a realização de uma esteira de integração contínua e implantação contínua (CI/CD). As imagens geradas são armazenadas durante o desenvolvimento no Github Container Registry (GHCR), cujo acesso será compartilhado entre a equipe do LEDS, da FAPES e da Prodest. Espera-se que no final do CI/CD o código fonte e as imagens também estejam disponíveis nas plataformas de controle de versão e registry internos da Prodest.

- Espera-se que esses componentes sejam hospedados e orquestrados pelo **Prodest** em ambiente de produção. Neste contexto, espera-se que os serviços sejam mantidos em Pods em um namespace isolados, com interfaces externas específicas, provendo isolamento adequado aos componentes, reforçando a segurança de acesso à aplicação.

- Para controle de autenticação de usuários, é utilizado o serviço **Acesso Cidadão** fornecido pelo **Prodest**.

- Para controle de autorização de usuários, devido à um requisito de controle granular de acesso à documentos e relatórios, assim como, para aumentar a flexibilidade e a segurança no desenvolvimento da aplicação, optou-se por implementar a estratégia de "Defesa em Profundidade" e "Zero Trust". Para tal, é necessário garantir barreiras físicas e regras a nível de rede, a nível de sistema e componentes de containers, e a nível de aplicação. A lógica de autorização é centralizada e gerenciada distribuidamente em componentes de Administração de políticas (PAP), de aquisição de informações e dados para aplicação de políticas (PIP), de Decisão centralizada de política (PDP), e de Execução centralização de políticas (PEP).

- Definiu-se e se desenvolveu gateways de aplicação específicos para políticas de acesso de aplicações interas à FAPES e externas para o público geral.

- Há necessidade de acesso de importação de dados com sistemas legados, operados pela **FAPES**, durante a implantação do **ConectaFapes**.

- O banco de dados roda externamente e foi desenvolvido baseado no SGBD Microsoft SQL Server, para ser implantado e mantido pela equipe do Prodest.

- Há a exportação de informações da base de dados do sistema **ConectaFapes** para o PowerBI da Prodest por meio da utilização do **AirFlow**.

- Para o módulo de **Pagamento de Bolsistas**, gera-se arquivos de remessa e de confirmação que precisam ser enviados/recebidos para/de o **Banco Banestes**.

