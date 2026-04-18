# Domain 01 — Corporativo e Administrativo

Dados mestres transversais a toda a organizacao, gestao de identidades e parametros do sistema. Glossario dos conceitos centrais em [../glossario.md](../glossario.md).

**Modulos que implementam este domain:** M001, M005, M006, M007, M008

---

## 1.1 Acesso e Seguranca (IAM)

Gestao de identidades, autenticacao e controle de acesso aos portais da plataforma. Inclui integracao com o Acesso Cidadao (SSO do governo do ES) e o portal de transparencia aberto ao publico.

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 1.1.1 | Autenticacao via Acesso Cidadao | Sistema de autenticacao unica do governo do ES para acesso aos portais | Todos | Art. 3, 3 |
| 1.1.2 | Portal Back-office | Ambiente de acesso dos servidores da agencia de fomento para gestao administrativa, financeira e tecnica | Analista da Area Tecnica da Agencia | Art. 16 a 19 |
| 1.1.3 | Portal Front-office | Ambiente de acesso dos participantes de projeto para submissao, acompanhamento e prestacao de contas | Participante de Projeto, Bolsista | Art. 4; Art. 3, 1 |
| 1.1.4 | Portal da Transparencia | Portal aberto ao publico para consulta de projetos financiados, bolsas pagas e resultados da agencia, sem necessidade de autenticacao | Cidadao, SECONT | Art. 3, 3 |
| 1.1.5 | Cadastro automatico Front-office | Cadastro automatico de pessoas no portal do participante de projeto | Participante de Projeto | Art. 4 |
| 1.1.6 | Cadastro automatico Back-office (API Organograma) | Importacao automatica de servidores e cargos via API do Organograma do Estado do ES, evitando cadastro manual | Analista da Area Tecnica da Agencia | Art. 30 |

## 1.2 Pessoas e Organizacoes

Cadastro e manutencao de pessoas fisicas (beneficiarios, pesquisadores, consultores), instituicoes de ensino e pesquisa, e suas respectivas unidades organizacionais e dirigentes.

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 1.2.1 | Cadastro de Pessoa | Registrar dados de beneficiarios, pesquisadores e consultores ad hoc | Analista da Area Tecnica da Agencia | Art. 4, 2 e 3 |
| 1.2.2 | Suspender Pessoa | Registrar alteracoes funcionais e movimentacoes internas de pessoas | Analista da Area Tecnica da Agencia | Art. 30, II |
| 1.2.3 | Cadastro de Instituicoes de Ensino e Pesquisa | Registrar dados de instituicoes e seus representantes | Analista da Area Tecnica da Agencia | Art. 4 |
| 1.2.4 | Cadastro de Unidades Organizacionais e hierarquia | Definir a estrutura organizacional das instituicoes parceiras | Analista da Area Tecnica da Agencia | — |
| 1.2.5 | Cadastro de Reitor, Diretores e Chefes | Registrar dirigentes e responsaveis por unidades organizacionais | Analista da Area Tecnica da Agencia | Art. 4 |
| 1.2.6 | Dashboard de Iniciativas por unidade organizacional | Consolidar informacoes de programas, projetos e acoes por unidade | Analista da Area Tecnica da Agencia | Art. 3, 3 |

## 1.3 Cadastros Basicos

Dados de referencia e parametros do sistema: estrutura organizacional da agencia (areas tecnicas e servidores), tabelas geograficas, areas de conhecimento e rubricas financeiras.

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 1.3.1 | Cadastrar Unidade Organizacional da Agencia (Area Tecnica) | Definir a estrutura organizacional da agencia para gestao de editais, projetos e pagamentos | Analista da Area Tecnica da Agencia | Art. 16 |
| 1.3.2 | Cadastro de Servidores da Agencia | Registrar servidores com vinculo a suas respectivas areas tecnicas | Analista da Area Tecnica da Agencia | Art. 30 |
| 1.3.3 | Vincular Servidor a Area Tecnica | Lotar cada servidor em uma area tecnica para gestao de editais, projetos e pagamentos | Analista da Area Tecnica da Agencia | Art. 16 |
| 1.3.4 | Cadastro de Cidades | Manter cadastro de cidades do estado | Analista da Area Tecnica da Agencia | — |
| 1.3.5 | Cadastro de Regioes | Manter cadastro de regioes (agrupamento de cidades) | Analista da Area Tecnica da Agencia | — |
| 1.3.6 | Cadastro de Areas de Conhecimento | Manter tabela de areas de conhecimento (ex: Ciencias Exatas e da Terra) | Analista da Area Tecnica da Agencia | — |
| 1.3.7 | Rubricas Financeiras | Manter cadastro de rubricas para classificacao de despesas | Analista da Area Tecnica da Agencia | — |
| 1.3.8 | Definir Minimo de Avaliadores Ad Hoc | Configurar o numero minimo padrao de avaliacoes exigidas por iniciativa em nivel de sistema; este valor pode ser substituido pelo parametro especifico definido na configuracao de cada captacao | Analista da Area Tecnica da Agencia | Art. 4, 2; Art. 12 |

## 1.4 Modalidades de Bolsa

Cadastro e manutencao das modalidades, niveis e requisitos de bolsas definidos por resolucoes da agencia de fomento. Inclui versionamento de modalidades para preservar o historico conforme novas resolucoes sao publicadas.

**Implementado por:** [M001 — Modalidades de Bolsa](../../implementation/modules/M001-modalidade-bolsa/README.md)

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 1.4.1 | Cadastro de Modalidades (Bolsas/Niveis) | Cadastrar programas de concessao de bolsas organizadas por modalidade e nivel | Analista da Area Tecnica da Agencia | Art. 3, VII; Art. 14, I e VII |
| 1.4.2 | Cadastro de Resolucoes | Registrar resolucoes que criam ou alteram modalidades de bolsas | Analista da Area Tecnica da Agencia | Art. 14, VIII; Art. 3, 3 |
| 1.4.3 | Cadastro de Niveis | Registrar niveis dentro de cada modalidade com valores e requisitos | Analista da Area Tecnica da Agencia | Art. 3, VII; Art. 37 |
| 1.4.4 | Cadastro de Requisitos de Niveis | Definir requisitos de elegibilidade por nivel de bolsa | Analista da Area Tecnica da Agencia | Art. 14, I e VI; Art. 2 |
| 1.4.5 | Atualizar Valores de Bolsa | Atualizar valores de apoio financeiro conforme novas resolucoes | Analista da Area Tecnica da Agencia | Art. 14, VII; Art. 25, III |
