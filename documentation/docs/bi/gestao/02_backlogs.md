# 📋 Backlogs

## Ideias a serem pensadas

Backlog para ideias futuras e estudo

### Issues

| ID | Tipo | Título | Descrição | Status | Dependências |
| --- | --- | --- | --- | --- | --- |
| ideias.cdc | 🌟 Epic | Estudar CDC | - | - | - |

---

## Backlog do BI

Backlog dedicado a equipe de BI

### Issues

| ID | Tipo | Título | Descrição | Status | Dependências |
| --- | --- | --- | --- | --- | --- |
| bi.identificarobjetivo | 🌟 Epic | Criar dashboard ligado a bolsas | Criar um dashboard com metricas sobre bolsas para apoiar a tomada de decisão | - | - |
|   bi.identificarobjetivo.identificarobjetivos | ⭐ Story | Identificar objetivos | Queremos identificar quais objetivos organizacionais estão relacionado a bolsa | - | - |
|     bi.identificarobjetivo.identificarobjetivos.entrevista | ✅ Task | Entrevistar | Entrevista os clientes para levantar os objetivos organizacionais relacionados bolsa | - | - |
|     bi.identificarobjetivo.identificarobjetivos.validar | ✅ Task | Validar dos da entrevista | Validar objetivos organizacionais | - | bi.identificarobjetivo.identificarobjetivos.entrevista |
|   bi.identificarobjetivo.identificarnecessidadeinformacao | ⭐ Story | Identificar as necessidades de informacao | Identificar quais informações são relevantes para responder os objetivos organizacionais | - | bi.identificarobjetivo.identificarobjetivos |
|     bi.identificarobjetivo.identificarnecessidadeinformacao.entrevista | ✅ Task | Entrevistar | Entrevista os clientes para levantar os objetivos organizacionais relacionados bolsa | - | bi.identificarobjetivo.identificarobjetivos.validar |
|     bi.identificarobjetivo.identificarnecessidadeinformacao.validar | ✅ Task | Validar necessidade de informação | Validar as necessidade de informação | - | bi.identificarobjetivo.identificarnecessidadeinformacao.entrevista |
|   bi.identificarobjetivo.definirmedidasindicadores | ⭐ Story | Identificar as Medidas e Indicadores | Identificar quais informações são as medidas e indicadores para as necessidades de informação | - | bi.identificarobjetivo.identificarnecessidadeinformacao |
|     bi.identificarobjetivo.definirmedidasindicadores.pesquisar | ✅ Task | Pesquisar sobre Medidas e Indicadores | Pesquisar sobre medidas e indicadores para atender a necessidade de informações | - | bi.identificarobjetivo.identificarobjetivos.validar |
|     bi.identificarobjetivo.definirmedidasindicadores.validar | ✅ Task | Validar as medidas e indicadores  | Validar medias e indicadores | - | bi.identificarobjetivo.definirmedidasindicadores.pesquisar |
| bi.levantarinfraestruturaleds | 🌟 Epic | Levantar Infraestrutura de ETL | Construir uma infraestrutura conectando o banco Conecta ao Stage Data e Power BI, com Apache Airflow. | - | - |
|   bi.levantarinfraestruturaleds.levantardatastage | ⭐ Story | Configurar o banco Stage Data | Configurar o banco de dados Stage Data para armazenar os dados extraídos do banco Conecta. | - | - |
|     bi.levantarinfraestruturaleds.levantardatastage.alinharcomdevops | ✅ Task | Alinhar com a equipe de DevOps | Alinhar permissões e acessos do bnaco com a equipe de DevOps. | - | - |
|     bi.levantarinfraestruturaleds.levantardatastage.verificarfuncionamentodatastage | ✅ Task | Verificar funcionamento do Stage Data | Testar a conectividade e validação do banco Stage Data | - | bi.levantarinfraestruturaleds.levantardatastage.alinharcomdevops |
|   bi.levantarinfraestruturaleds.configurarairflowetl | ⭐ Story | Configurar o Airflow para pipelines ETL | Configurar o Airflow para extrair dados do banco Conecta, transformá-los e carregá-los no banco Stage Data. | - | bi.levantarinfraestruturaleds.levantardatastage.verificarfuncionamentodatastage |
|     bi.levantarinfraestruturaleds.configurarairflowetl.instalarconfigurarairflow | ✅ Task | Instalar e configurar o Airflow | Instalar o Airflow e configurar conexões com os bancos Conecta e Stage Data. | - | - |
|     bi.levantarinfraestruturaleds.configurarairflowetl.criararquivopythonetl | ✅ Task | Criar arquivos Python para ETL | Criar arquivos Python para duplicar o formato da tabela do Banco do Conecta para o Banco do BI | - | bi.levantarinfraestruturaleds.configurarairflowetl.criardagsetl |
|     bi.levantarinfraestruturaleds.configurarairflowetl.criararquivopythonetl2 | ✅ Task | Criar arquivos Python para ETL | Criar arquivos Python para duplicar o formato da tabela do Banco do Conecta para o Banco do BI. | - | bi.levantarinfraestruturaleds.configurarairflowetl.criardagsetl |
|     bi.levantarinfraestruturaleds.configurarairflowetl.criardagsetl | ✅ Task | Transformar arquivos Python em DAGs | Transformar os arquivos Python em DAGs para execução no Airflow. | - | bi.levantarinfraestruturaleds.configurarairflowetl.criararquivopythonetl |
|     bi.levantarinfraestruturaleds.configurarairflowetl.testarpipelinesetl | ✅ Task | Testar pipelines ETL | transformar as DAGS pipelines criados. | - | bi.levantarinfraestruturaleds.configurarairflowetl.criardagsetl |
|   bi.levantarinfraestruturaleds.conectarbancoaopowerbi | ⭐ Story | Conectar banco Stage Data ao Power BI | Integrar o banco Stage Data ao Power BI para criar relatórios baseados nos dados processados do Stage Data. | - | bi.levantarinfraestruturaleds.configurarairflowetl.testarpipelinesetl |
|     bi.levantarinfraestruturaleds.conectarbancoaopowerbi.importardadosnopowerbi | ✅ Task | Importar dados no Power BI | Configurar a conexão do Power BI com o banco Stage Data e importar dados. | - | - |
|     bi.levantarinfraestruturaleds.conectarbancoaopowerbi.criarmodelopowerbi | ✅ Task | Criar modelo de dados no Power BI | Configurar relacionamentos e transformações no Power BI para estruturar os dados para visualização. | - | bi.levantarinfraestruturaleds.conectarbancoaopowerbi.importardadosnopowerbi |
|     bi.levantarinfraestruturaleds.conectarbancoaopowerbi.criarrelatoriospowerbi | ✅ Task | Validar relatórios e gráficos no Power BI | Garantir que os relatórios e gráficos gerados no Power BI estão corretos e atendem aos requisitos do projeto. | - | bi.levantarinfraestruturaleds.conectarbancoaopowerbi.criarmodelopowerbi |
| bi.instalarairflow | 🌟 Epic | Instalar e configurar o Apache Airflow | Instalar e configurar o Apache Airflow para uso no projeto de BI | - | - |
|   bi.instalarairflow.instalarairflow | ⭐ Story | Instalar o Apache Airflow | Instalar o Apache Airflow no ambiente de desenvolvimento | - | - |
|   bi.instalarairflow.configurarconexoes | ⭐ Story | Configurar conexões | Configurar conexões com bancos de dados no Apache Airflow | - | bi.instalarairflow.instalarairflow |
|     bi.instalarairflow.configurarconexoes.testarconexoes | ✅ Task | Testar conexões | Testar as conexões com os bancos de dados no Apache Airflow | - | bi.instalarairflow.configurarconexoes |
|   bi.instalarairflow.criardags | ⭐ Story | Criar DAGs | Criar DAGs para execução de tarefas de ETL no Apache Airflow | - | bi.instalarairflow.configurarconexoes |
|     bi.instalarairflow.criardags.criardags | ✅ Task | Criar DAGs | Criar DAGs de duplicar o formato da tabela do Banco do Conecta para o Banco do BI | - | - |
|     bi.instalarairflow.criardags.criardags2 | ✅ Task | Criar DAGs | Criar DAGs de duplicar os dados da tabela do Banco do Conecta para o Banco do BI | - | - |
|   bi.instalarairflow.subirrepositorio | ⭐ Story | Subir repositório no GitHub | Subir o repositório do projeto de BI no GitHub | - | - |
|     bi.instalarairflow.subirrepositorio.testarrepositorio | ✅ Task | Testar repositório | Outra pessoa o airflow que esta no GitHub | - | bi.instalarairflow.criardags |

---

## Backlog inicio do ano

### Issues

| ID | Tipo | Título | Descrição | Status | Dependências |
| --- | --- | --- | --- | --- | --- |
| backlogsprint4.deployprototipobolsaprodest | 🌟 Epic | Deploy do protótipo de Bolsa na Prodest | Deploy do protótipo de Bolsa na Prodest, sem live coonection | - | - |
|   backlogsprint4.deployprototipobolsaprodest.deployprototipobolsaprodest | ⭐ Story | Deploy do protótipo de Bolsa na Prodest | Deploy do protótipo de Bolsa na Prodest, sem live coonection | - | - |
|     backlogsprint4.deployprototipobolsaprodest.deployprototipobolsaprodest.deployprototipobolsaprodest | ✅ Task | Deploy do protótipo de Bolsa na Prodest | Deploy do protótipo de Bolsa na Prodest, sem live coonection | - | - |
|     backlogsprint4.deployprototipobolsaprodest.deployprototipobolsaprodest.deployprototipobolsaprodestrs | ✅ Task | transferir Paineis para a versão do Power BI Desktop adaptado para RS, versão maio 2024 | Deploy do protótipo de Bolsa na Prodest, sem live coonection | - | - |
|     backlogsprint4.deployprototipobolsaprodest.deployprototipobolsaprodest.deployprototipobolsaprodestrs2 | ✅ Task | transferir Paineis para a versão do Power BI Desktop adaptado para RS, versão maio 2023 | Deploy do protótipo de Bolsa na Prodest, sem live coonection | - | - |
| backlogsprint4.epico | 🌟 Epic | Ajeitar Semana | - | - | - |
|   backlogsprint4.epico.ajudarbackend | ⭐ Story | Ajudar o Backend no Made | - | - | - |
|     backlogsprint4.epico.ajudarbackend.ajudarbackendmade | ✅ Task | Ajudar o Backend no Made | Ajudar o backend a entender o Made e como ele pode ser utilizado para gerenciar as tarefas | - | - |
|     backlogsprint4.epico.ajudarbackend.ajudarbackenddocker | ✅ Task | Ajudar o Backend com problemas no docker | - | - | - |
|   backlogsprint4.epico.roadmapfrancisco | ⭐ Story | Roadmap com as entregas do ano de 2024 | Roadmap com as entregas do ano de 2024, para apresentação para o francisco | - | - |
|     backlogsprint4.epico.roadmapfrancisco.roadmapcominfraestrutura | ✅ Task | Roadmap | Roadmap no excalidraw com toda infraestrutura do projeto atual, Docker, GitHub, Airflow, PowerBI | - | - |
|     backlogsprint4.epico.roadmapfrancisco.roadmapcomentregas | ✅ Task | Entregas no Roadmap | Roadmap no excalidraw com os objetivos cumpridos, planejados e aqueles que serão feitos, onde evoluímos e o que temos atualmente. Além de
                colocar visualmente o power BI que temos e processo de ETL e todo o processo até a criação do primeiro dashboard | - | - |
|   backlogsprint4.epico.posreuniao | ⭐ Story | Pos Reunião | Pos reunião com o Francisco para alinhar as entregas do ano de 2024 e futuro | - | backlogsprint4.epico.roadmapfrancisco |
|     backlogsprint4.epico.posreuniao.anotardemandas | ✅ Task | Anotar demandas | Anotar as demandas que temos para as proximas semanas, utilizando com base a reunião | - | - |
|     backlogsprint4.epico.posreuniao.fazerplanejamento | ✅ Task | Fazer planejamento | Reunião com Felipe para planejar dos dias 09 ao 24 de janeiro de 2025 as entregas | - | backlogsprint4.epico.posreuniao.anotardemandas |
|     backlogsprint4.epico.posreuniao.atualizarmade | ✅ Task | Atualizar Made | Atualizar o Made com as entregas planejadas | - | backlogsprint4.epico.posreuniao.fazerplanejamento |
|   backlogsprint4.epico.adicionargraficosnodashboardbolsa | ⭐ Story | Adicionar gráficos no Dashboard de Bolsa | Adicionar gráficos no Dashboard de Bolsa para melhorar a visualização dos dados | - | - |
|     backlogsprint4.epico.adicionargraficosnodashboardbolsa.inspiracaodegraficos | ✅ Task | Inspirar gráficos | Procurar inspirações, olhar os dados, analisar cases de gráficos para adicionar no Dashboard de Bolsa | - | - |
|     backlogsprint4.epico.adicionargraficosnodashboardbolsa.prototipardashboard | ✅ Task | Prototipar novo Dashboard de Bolsa | - | - | backlogsprint4.epico.adicionargraficosnodashboardbolsa.inspiracaodegraficos |
|   backlogsprint4.epico.melhorardesigndashboard | ⭐ Story | Melhorar Design Dashboard | - | - | - |
|     backlogsprint4.epico.melhorardesigndashboard.inspiracao | ✅ Task | inspirar Design Dashboard de Bolsa | Procurar inspirações de design de dashboard para melhorar o design do dashboard de Bolsa atual | - | - |
|     backlogsprint4.epico.melhorardesigndashboard.implementardesign | ✅ Task | Implementar Design Dashboard de Bolsa | Implementar o design do dashboard de Bolsa atual | - | - |

---

## Desenvolver Dashboard de Bolsa

### Issues

| ID | Tipo | Título | Descrição | Status | Dependências |
| --- | --- | --- | --- | --- | --- |
| backlogsprint5.atualizarmade | 🌟 Epic | Atualizar Made | Atualizar o Made com as entregas planejadas | - | - |
|   backlogsprint5.atualizarmade.atualizarmade | ⭐ Story | Atualizar Made | Atualizar o Made com as entregas planejadas | - | - |
| backlogsprint5.desenvolverdashboardbolsa | 🌟 Epic | Desenvolver Dashboard de Bolsa | Desenvolver o Dashboard de Bolsa com as métricas definidas | - | - |
|   backlogsprint5.desenvolverdashboardbolsa.aprimorarprototipopainelbolsa | ⭐ Story | Aprimorar Protótipo do Painel de Bolsa | Aprimorar o protótipo do Painel de Bolsa com feedback do Moises | - | - |
|     backlogsprint5.desenvolverdashboardbolsa.aprimorarprototipopainelbolsa.aprimorarprototipopainelbolsamoises | ✅ Task | Aprimorar Protótipo do Painel de Bolsa | Aprimorar o protótipo do Painel de Bolsa com feedback do Moises | - | - |
|     backlogsprint5.desenvolverdashboardbolsa.aprimorarprototipopainelbolsa.criarnovapagina | ✅ Task | Criar nova página de Bolsa | nova página com dagboard de distribuição de bolsa por mes, Bolsistas por municipio e um mapa | - | - |
|     backlogsprint5.desenvolverdashboardbolsa.aprimorarprototipopainelbolsa.aprimorarprototipopainelbolsavitor | ✅ Task | Aprimorar Protótipo do Painel de Bolsa | Aprimorar o protótipo do Painel de Bolsa com feedback do Vitor | - | - |
|   backlogsprint5.desenvolverdashboardbolsa.criacaodedagsbolsa | ⭐ Story | Desenvolver Dashboard de Bolsa | Desenvolver o Dashboard de Bolsa com as métricas definidas | - | - |
|     backlogsprint5.desenvolverdashboardbolsa.criacaodedagsbolsa.criardagsdebolsa | ✅ Task | Criar DAGs com tratamento de dados para Bolsa | Criar DAGs com tratamento de dados no Apache Airflow para o painel de Bolsas | - | - |
|   backlogsprint5.desenvolverdashboardbolsa.liveconnection | ⭐ Story | Estudar e implantar Live Connection | Estudar e implantar Live Connection no Power BI | - | - |
|     backlogsprint5.desenvolverdashboardbolsa.liveconnection.estudarliveconnection | ✅ Task | Estudar Live Connection | Estudar como implantar Live Connection no Power BI | - | - |
|     backlogsprint5.desenvolverdashboardbolsa.liveconnection.implantarliveconnection | ✅ Task | Implantar Live Connection | Implantar Live Connection no Power BI | - | - |
|   backlogsprint5.desenvolverdashboardbolsa.tratamentodedadosbolsapowerquery | ⭐ Story | Tratamento de Dados de Bolsa com Power Query | Tratar os dados de Bolsa com Power Query no Power BI | - | - |
|     backlogsprint5.desenvolverdashboardbolsa.tratamentodedadosbolsapowerquery.tratardadosbolsa | ✅ Task | Tratar dados de Bolsa | Tratar os dados de Bolsa no Power BI com Power Query | - | backlogsprint5.desenvolverdashboardbolsa.criacaodedagsbolsa |

