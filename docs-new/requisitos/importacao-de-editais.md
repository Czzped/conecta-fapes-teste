---
title: Importação de editais
tipo: requisito
---
# Importação de editais

A importação de editais é o processo pelo qual a equipe da FAPES traz para o ConectaFapes os editais de fomento, seus projetos, coordenadores, planejamentos orçamentários e alocações de bolsistas a partir do SIGFAPES, o sistema de origem desses dados. É o ponto de entrada de toda a informação que alimenta a gestão de bolsas: sem a importação, não há projeto para coordenar, nem alocação para avaliar, nem cota para pagar.

O processo é seletivo e controlado por estados. Nem todo edital do SIGFAPES precisa ser trazido; o operador marca quais editais devem ser importados, indica a área técnica responsável por cada um e acompanha o andamento da importação. Ao importar, o sistema resolve automaticamente qual nível de bolsa se aplica a cada alocação (com base na modalidade, no valor e na existência de redução), gera matrículas únicas, importa o histórico de pagamentos e prepara as cotas. Também trata situações delicadas, como falhas no meio da importação e a necessidade de transferir bolsas de um projeto para outro.

Este requisito descreve o comportamento da área administrativa (equipe interna da FAPES). O operador é o perfil que conduz a importação.

## Atores

- **Operador da FAPES**: perfil que marca editais para importação, define a área técnica responsável, dispara e acompanha a importação de editais, projetos, alocações, pessoas e dados relacionados, e realiza a transferência de bolsas entre projetos.
- **Administrador**: acesso amplo; também conduz importações e operações relacionadas.
- **SIGFAPES (sistema de origem)**: fonte externa dos dados de editais, projetos, pessoas e alocações. Cada registro importado guarda a referência ao seu identificador de origem.
- **Sistema de pagamento (fonte externa de histórico)**: origem do histórico de pagamentos e base para a geração das cotas de cada bolsa.
- **Funcionalidades consumidoras**: a implementação de bolsa e o painel de pendências passam a operar sobre os dados importados.

## Fluxo principal

1. O operador registra ou visualiza um edital vindo do SIGFAPES. Ao ser criado, o edital nasce **não marcado para importação** e com situação **ativo**. Cada edital guarda a referência ao seu identificador de origem.
2. O operador **marca o edital para importação** e indica a **área técnica responsável**. A situação de importação passa a "a importar".
3. A importação é executada: projetos do edital, seus coordenadores, planejamentos e alocações de bolsistas são trazidos.
4. Para cada alocação, o sistema **resolve o nível de bolsa** correspondente a partir da sigla da modalidade, do valor e da existência ou não de redução; **gera a matrícula** (única no sistema); **importa o histórico de pagamento**; e **gera as cotas** de pagamento, salvo quando a bolsa já está em situação que dispensa cotas (finalizada, cancelada ou reprovada).
5. Concluída a importação do edital, sua situação passa a **importado** e a data de última sincronização é registrada.
6. O edital importado pode ser **sincronizado** novamente para atualizar dados; a data de última sincronização é renovada.
7. Quando necessário, o operador **transfere bolsas entre projetos** (substituição de projeto), movendo todas as alocações de um projeto de origem para um projeto de destino.

## Regras de negócio

### Situações de importação do edital

- Um edital passa por três situações de importação: **não importar** (estado inicial), **a importar** (marcado, com área técnica definida) e **importado** (importação concluída).
- Marcar para importação exige informar uma **área técnica** válida; a área é associada ao edital nesse momento.
- A conclusão da importação registra a **data de última sincronização**. Sincronizações posteriores renovam essa data.
- Independentemente da situação de importação, o edital tem uma situação própria (ativo). O edital também carrega marcações como permitir solicitação de bolsa, permitir pagamento avançado e exigir análise de voluntário, que condicionam funcionalidades posteriores.

### Projetos

- Cada projeto guarda a referência ao seu identificador de origem no SIGFAPES, que é **único**. Tentar importar/criar um projeto com identificador de origem já existente é recusado por unicidade.
- Um projeto nasce com preenchimento **incompleto** e passa a completo quando todas as suas alocações têm as cotas devidamente preenchidas.
- A data de fim prevista de atividade não pode ser anterior à data de início; a violação é recusada por validação.
- Um projeto tem coordenadores ao longo do tempo, mas apenas um **coordenador atual**. Ao atribuir um novo coordenador, o anterior é desativado (deixa de ser o atual e recebe data de fim), preservando o histórico completo de coordenação.

### Resolução automática do nível de bolsa

- Ao importar uma alocação, o sistema **identifica o nível de bolsa** (nível da versão) pela sigla da modalidade e pelo valor informado.
- Quando a alocação tem **redução de bolsa**, o sistema procura o nível cujo valor corresponde ao valor reduzido (por exemplo, o valor base ajustado pelo fator de redução da versão), e a sigla da modalidade reduzida é identificada pelo indicador de percentual. O fator de redução vem do cadastro de modalidades (ver [[gestao-de-modalidades]]).

### Matrículas

- A **matrícula** de cada alocação é gerada automaticamente e é **única** no sistema.
- Alterar os dados bancários de um bolsista com alocações ativas provoca a **regeneração das matrículas** dessas alocações (cada nova matrícula também é única) e coloca a situação de cadastro bancário como pendente.

### Cotas e pagamentos na importação

- Durante a importação da alocação, o **histórico de pagamento** é trazido da fonte externa e as **cotas** de pagamento são geradas.
- As cotas **não** são geradas quando a bolsa já está em situação que as dispensa: finalizada, cancelada ou reprovada.
- A quantidade de **cotas pagas** não pode ultrapassar a quantidade de **cotas alocadas**. O acompanhamento de cotas está detalhado em [[pagamentos]] e [[remanejamento-de-cotas]].

### Transferência de bolsas entre projetos (substituição de projeto)

- A transferência move **todas as alocações** de um projeto de origem para um projeto de destino, identificados pelos respectivos identificadores de origem do SIGFAPES. A data de atualização de cada alocação transferida é renovada.
- **Projeto de origem inexistente**: recusado com a mensagem de que o projeto não foi encontrado.
- **Projeto de destino inexistente**: recusado com a mensagem de que o projeto não foi encontrado.
- **Origem e destino iguais**: recusado com a mensagem de que o projeto de origem e o de destino não podem ser o mesmo.
- **Identificador inválido** (menor ou igual a zero): recusado por validação.

### Dados de pessoas e cadastros de apoio

- Cada pessoa tem **CPF único**; CPF duplicado é recusado por unicidade.
- São importados e mantidos os dados pessoais e de apoio: endereço, telefones, documentos pessoais, dados bancários, naturalidade (vínculo um-para-um com a pessoa), além de bancos, áreas técnicas e atividades.
- O planejamento de alocação controla o orçamento por projeto; o planejamento por nível calcula o total como quantidade de bolsistas multiplicada pela quantidade de meses.
- As cotas por nível podem ser importadas e são registradas ou **incrementadas** quando já existem para o mesmo nível e planejamento; há também o tratamento de redução de cotas.

### Listagens

- As listagens de editais, projetos e alocações são **paginadas**. A listagem de editais inclui a área técnica; a de projetos inclui coordenadores e pessoas.
- Há uma listagem simplificada de alocações, com dados básicos (datas, redução, quantidades de cotas, identificador de origem e matrícula), sem expandir projeto, pessoa ou pagamentos. Também há listagem simplificada de pessoas, com dados básicos (identificador de origem, nome e CPF).

## Estados e transições

Situação de importação do edital:

- **Não importar** (inicial) → **A importar** (ao marcar para importação, com área técnica definida) → **Importado** (ao concluir a importação, registrando data de última sincronização).
- Importado → Importado (sincronização): renova a data de última sincronização.

Preenchimento do projeto:

- **Incompleto** (inicial) → **Completo** (quando todas as alocações têm cotas preenchidas).

Coordenação do projeto:

- Novo coordenador atual atribuído → coordenador anterior deixa de ser atual e recebe data de fim (histórico preservado).

Alocação (na importação): nasce em situação de avaliação e segue o ciclo de vida descrito em [[implementacao-de-bolsa]].

## Casos especiais e exceções

- **Falha no meio da importação**: se ocorrer erro ao importar uma alocação, a alocação criada é desfeita (revertida), evitando registros incompletos.
- **Identificador de origem duplicado** (edital, projeto ou pessoa): recusado por unicidade.
- **Data de fim anterior à data de início** no projeto: recusada.
- **Transferência inválida**: origem inexistente, destino inexistente, origem igual ao destino ou identificador não positivo são recusados, cada um com sua mensagem.
- **Bolsa em situação que dispensa cotas** (finalizada, cancelada ou reprovada): cotas não são geradas na importação.
- **Regeneração de matrícula** ao alterar dados bancários de bolsista com alocações ativas: novas matrículas únicas e situação de cadastro bancário pendente.
- **Cotas pré-existentes**: nova importação de cotas para o mesmo nível e planejamento incrementa a quantidade em vez de duplicar o registro.

## Dados envolvidos

- [[Edital]] — o edital: situação de importação, situação do edital, área técnica e atividade responsáveis, marcações de solicitação de bolsa, pagamento avançado e análise de voluntário, identificador de origem, data de última sincronização.
- [[Projeto]] — projetos do edital: preenchimento, datas, orçamento, identificador de origem único, vínculo com [[Edital]].
- [[Coordenacao]] — coordenadores do projeto ao longo do tempo, com coordenador atual e datas.
- [[AlocacaoBolsista]] — bolsas concedidas: matrícula única, redução, cotas alocadas e pagas, situação, vínculo com [[Pessoa]], [[Projeto]] e [[VersaoNivel]].
- [[Pessoa]] — bolsistas: dados cadastrais, CPF único, identificador de origem.
- [[DadosBancarios]] — dados bancários que condicionam a matrícula.
- [[AreaTecnica]] — área responsável pelo edital.
- [[Atividade]] — atividade associada ao edital.
- [[PlanejamentoAlocacao]] e [[PlanejamentoNivel]] — planejamento orçamentário por projeto e por nível.
- [[CotasPorNivel]] — controle de cotas por nível e planejamento (registro ou incremento).
- [[ModalidadeBolsa]], [[VersaoModalidade]], [[VersaoNivel]], [[NivelBolsa]] — cadastro consultado na resolução automática do nível.

## Funcionalidades relacionadas

- [[gestao-de-modalidades]]
- [[implementacao-de-bolsa]]
- [[captacao-de-projetos]]
- [[pagamentos]]
- [[remanejamento-de-cotas]]
- [[cancelamento-de-bolsa]]
- [[voluntariacao]]
- [[gestao-pessoas-fisicas]]
- [[painel-e-indicadores]]
- [[autenticacao-autorizacao]]
