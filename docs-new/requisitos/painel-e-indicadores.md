---
title: Painel e Indicadores
tipo: requisito
---

# Painel e Indicadores

Ao entrar no ConectaFapes, cada usuário encontra uma página inicial montada de acordo com o seu papel: o coordenador vê o andamento dos projetos que coordena e as pendências que dependem dele, enquanto o pesquisador/bolsista vê um resumo das próprias bolsas e do que precisa da sua atenção. Além dessa página inicial, coordenadores e administradores contam com painéis analíticos mais profundos, que consolidam números de bolsistas, valores financeiros e saldo de cotas por projeto, edital e área técnica. Este requisito descreve a página inicial, os indicadores analíticos e a visualização detalhada dos projetos e de suas bolsas.

## Atores

- **Coordenador** — pesquisador responsável por um ou mais projetos; enxerga informes, prazos, projetos e painéis analíticos restritos aos projetos que coordena.
- **Pesquisador / Bolsista** — usuário vinculado a projetos como bolsista ou voluntário; enxerga contagens pessoais e os projetos em que participa.
- **Administrador (equipe FAPES)** — enxerga os painéis analíticos de acompanhamento da execução dos projetos.
- **Sistema** — monta as visões conforme o papel, apura as contagens e valores e aplica as regras de acesso.

## Fluxo principal

1. O usuário entra autenticado no portal (login via Acesso Cidadão).
2. O sistema identifica o papel do usuário e monta a página inicial correspondente.
3. **Coordenador**: recebe os informes por projeto (bolsas com avaliação pendente, reprovadas, canceladas, suspensas, finalizadas e expirando), pode consultar os próximos prazos dos planos mensais e vê a lista paginada dos projetos que coordena, ordenada por status.
4. **Pesquisador/Bolsista**: recebe as contagens das próprias bolsas por status (ativas, suspensas, canceladas, finalizadas, reprovadas), os voluntariados pendentes de aceite, os planos de atividade pendentes e a lista paginada dos projetos em que participa como bolsista ou voluntário.
5. A partir da página inicial, o coordenador pode abrir um projeto para ver suas bolsas implementadas e solicitadas, com busca e paginação.
6. Coordenadores e administradores podem abrir os painéis analíticos para acompanhar, por projeto/edital/área técnica, o fluxo mensal de bolsistas, os dados financeiros, os bolsistas pagos por período, as informações gerais, a contagem por modalidade e o saldo de cotas.

## Regras de negócio

### Página inicial

- A visão exibida depende exclusivamente do papel do usuário. O coordenador vê informações **por projeto**; o pesquisador/bolsista vê **contagens pessoais**.
- **Informes do coordenador** (por projeto que coordena): bolsas com avaliação pendente, bolsas reprovadas, bolsas canceladas, bolsas suspensas, bolsas finalizadas e bolsas expirando.
- **Próximos prazos**: o coordenador pode consultar as datas dos marcos futuros dos planos mensais. Somente coordenadores têm acesso a esse recurso — um pesquisador que tente consultar recebe o aviso "Somente coordenadores podem visualizar os próximos prazos".
- **Informes do pesquisador/bolsista**: contagem de bolsas ativas, suspensas, canceladas, finalizadas e reprovadas; voluntariados pendentes de aceite; planos de atividade pendentes.
- **Lista de projetos na página inicial**: sempre paginada e ordenada por status. Para o coordenador, traz os projetos que ele coordena; para o pesquisador/bolsista, traz os projetos em que ele participa como bolsista ou voluntário.

### Visualização de projetos e suas bolsas (coordenador)

- Dentro de um projeto, o coordenador consulta duas listas separadas e paginadas: **bolsas implementadas** (alocações ativas) e **bolsas solicitadas** (alocações pendentes de avaliação).
- Nas bolsas implementadas há **busca por nome do bolsista** — o sistema retorna apenas as bolsas cujo nome do bolsista contém o texto informado.
- O tamanho de página não pode passar de **100**.
- Só o coordenador do projeto pode consultar as bolsas daquele projeto. Um usuário que não coordena o projeto recebe o aviso "Você não é coordenador desse projeto".

### Painéis analíticos (coordenador e administrador)

- **Fluxo mensal de bolsistas** (por projeto): para cada mês, quantidade de bolsistas ativos, quantos entraram (iniciaram no mês) e quantos saíram (encerraram no mês).
- **Dados financeiros por projeto** (por bolsista): nome, status da alocação, sigla do nível (por exemplo IC, MS, DR), indicação de redução por vínculo, cotas já pagas, cotas restantes, valor unitário da bolsa e valor total restante a pagar.
- **Fator de redução**: quando o bolsista possui redução por vínculo, o valor da bolsa é multiplicado pelo fator correspondente (por exemplo, redução de 60% corresponde a multiplicar por 0,6). O mesmo cálculo de redução vale para o saldo de cotas.
- **Bolsistas pagos por período** (por projeto): para cada mês, quantos bolsistas foram pagos, quantos estavam alocados (em andamento) e quantos estavam planejados conforme o planejamento de níveis do projeto.
- **Informações gerais**: podem ser consultadas em três recortes — por **projeto** (coordenador, quantidade de bolsistas ativos e dados do edital), por **edital** (quantidade de projetos e de bolsistas vinculados) e por **área técnica** (a hierarquia completa: editais, projetos e bolsistas).
- **Quantidade por modalidade** (por projeto): contagem de bolsistas agrupada por tipo de bolsa (IC, MS, DR e demais).
- **Saldo de cotas** (por projeto): para cada nível — sigla, valor unitário, indicação se a cota é com redução, quantidade planejada, quantidade já alocada e quantidade disponível (planejada menos alocada).

## Estados e transições

- A página inicial não altera dados; ela reflete o estado atual das bolsas, dos projetos e dos planos. Os estados de bolsa que alimentam as contagens e informes são: **pendente de avaliação**, **ativa/implementada**, **suspensa**, **cancelada**, **finalizada**, **reprovada** e **expirando**.
- No fluxo mensal, cada bolsista é contado como "entrou" no mês de início da atividade e como "saiu" no mês de encerramento; entre os dois, conta como "ativo".
- No saldo de cotas, a quantidade disponível diminui conforme as cotas planejadas vão sendo alocadas; o resultado é sempre planejada menos alocada.

## Casos especiais e exceções

- **Dados de identificação vazios**: se os dados de identificação do usuário (vindos do Acesso Cidadão) chegarem vazios, o acesso à página inicial e à consulta de projetos é bloqueado com aviso claro ("dados de identificação vieram vazios do Acesso Cidadão").
- **Página inválida**: consultar uma lista com número de página inválido (por exemplo, página 0) resulta em aviso "A página é inválida!".
- **Tamanho de página acima do limite**: pedir mais de 100 itens por página resulta em aviso "Page size não pode ser maior que 100".
- **Projeto sem alocações**: consultar o fluxo mensal de um projeto que não tem bolsistas alocados resulta em aviso de que nenhuma alocação foi encontrada para o projeto.
- **Projeto inexistente**: consultar bolsas ou fluxo de um projeto que não existe resulta em aviso de que o projeto não foi encontrado.
- **Saldo de cotas sem planejamento**: se o projeto não possui planejamento de alocação atual, o saldo de cotas não pode ser calculado e o sistema avisa que não há planejamento. Se o planejamento existe, mas não tem cotas por nível configuradas, o sistema avisa que nenhuma cota por nível foi encontrada.
- **Pesquisador tentando ver prazos**: acesso negado com o aviso de que somente coordenadores podem visualizar os próximos prazos.

## Dados envolvidos

[[Projeto]] · [[AlocacaoBolsista]] · [[PlanoMensal]] · [[Edital]] · [[AreaTecnica]] · [[Coordenacao]] · [[Voluntariacao]] · [[ModalidadeBolsa]] · [[NivelBolsa]] · [[VersaoNivel]] · [[VersaoModalidade]] · [[PlanejamentoAlocacao]] · [[PlanejamentoNivel]] · [[CotasPorNivel]] · [[PagamentoBolsista]] · [[Pessoa]] · [[User]]

## Funcionalidades relacionadas

- [[autenticacao-autorizacao]] — define o papel do usuário e libera cada visão.
- [[implementacao-de-bolsa]] — origem dos estados de bolsa (implementada, reprovada) refletidos nos informes.
- [[solicitacao-de-bolsa]] — origem das bolsas solicitadas listadas no projeto.
- [[voluntariacao]] — origem dos voluntariados pendentes de aceite exibidos ao pesquisador.
- [[pagamentos]] — origem dos números de bolsistas pagos e das cotas pagas.
- [[remanejamento-de-cotas]] — afeta o planejamento e o saldo de cotas exibidos.
- [[gestao-de-modalidades]] — origem das modalidades, níveis e valores usados nos painéis.
