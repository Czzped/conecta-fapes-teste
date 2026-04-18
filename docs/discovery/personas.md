# ConectaFAPES — Personas

> Glossario central de conceitos da plataforma: [glossario.md](glossario.md).

## Rastreabilidade de Personas por Dominio

| Persona | Dominios onde atua | Modulos principais |
|---------|--------------------|--------------------|
| Cidadao | 01 (portal de transparencia), 03 (submissao de propostas) | M005, M008, M011 |
| Participante de Projeto | 04 (execucao de iniciativas) | M003, M009 |
| Bolsista | 04 (bolsas, documentos, plano de trabalho) | M009 |
| Voluntario | 04 (participacao em projeto sem bolsa) | M009 |
| Terceiro (PJ) | 04 (prestacao de servico a projetos) | M014 |
| Coordenador | 03 (submissao), 04 (execucao, prestacao de contas, bolsistas) | M003, M009, M012, M013, M014 |
| Orientador | 04 (orientacao de bolsistas em pos-graduacao) | M003, M009 |
| Reitor | 01 (dirigente maximo de Instituicao de Ensino e Pesquisa) | M008 |
| Diretor / Responsavel | 01 (responsavel por Unidade Organizacional) | M008 |
| Agencia de Fomento | 01-06 (opera toda a plataforma como entidade gestora) | Todos |
| Entidade Parceira | 02 (parcerias com aporte financeiro para programas) | M010 |
| Analista da Area Tecnica da Agencia | 04 (analise de prestacao), 05 (liberacao de pagamento) | M004, M009, M012, M014 |
| Analista | 04 (gestao de projetos, bolsas e prestacoes) | M003, M009, M014 |
| Area Tecnica | 05 (liberacao de editais para folha de pagamento) | M004 |
| SUCON | 03 (contratos e convenios da agencia) | M003, M011 |
| SECONT | 04 (auditoria de prestacao de contas) | M014, M019 |
| Consultor Ad Hoc | 03 (avaliacao de merito tecnico-cientifico) | M011 |

---

## Comunidade Cientifica

Personas externas que interagem com a agencia de fomento como beneficiarias, proponentes ou participantes de projetos.

O Cidadao e a persona base. Ao se associar a um projeto, torna-se Participante de Projeto. O Participante com bolsa e um Bolsista; sem bolsa, e um Voluntario. O Orientador e um Participante de Projeto responsavel pela orientacao de outros participantes. Um Terceiro (PJ) e uma pessoa juridica que participa do projeto. O Coordenador e o responsavel pela coordenacao do projeto.

| Persona | Descricao |
|---------|-----------|
| **Cidadao** | Pessoa que acessa o portal publico da agencia de fomento para consultar editais, programas e resultados |
| **Participante de Projeto** | Cidadao associado a um projeto de pesquisa |
| **Bolsista** | Participante de projeto com bolsa ativa vinculada com um plano de trabalho|
| **Voluntario** | Participante de projeto sem bolsa associada com um plano de trabalho|
| **Terceiro (PJ)** | Pessoa juridica que participa de um projeto como prestadora de servico ou fornecedora |
| **Coordenador** | Cidadao responsavel pela coordenacao de um projeto ou iniciativa contratada |
| **Orientador** | Participante de projeto responsavel pela orientacao de outros participantes em programas de pos-graduacao |

## Instituicoes

Uma Instituicao e uma organizacao generica. Uma Instituicao de Ensino e Pesquisa e um tipo de Instituicao. Toda Instituicao e composta por Unidades Organizacionais, e cada Unidade possui um Diretor ou responsavel. A Instituicao de Ensino e Pesquisa possui um Reitor como dirigente maximo.

| Persona | Descricao |
|---------|-----------|
| **Reitor** | Dirigente maximo de uma Instituicao de Ensino e Pesquisa |
| **Diretor / Responsavel** | Responsavel por uma Unidade Organizacional dentro de uma Instituicao |

## Parceiros e Agencia de Fomento

A agencia de fomento e a entidade que gerencia recursos financeiros de parceiros para investimento em pesquisa, desenvolvimento e inovacao (PD&I). Entidades Parceiras firmam parcerias com a agencia de fomento mediante aporte financeiro, e a agencia de fomento administra esses recursos vinculando-os a programas e projetos.

| Persona | Descricao |
|---------|-----------|
| **Agencia de Fomento** | A agencia de fomento e uma Agencia estadual que gerencia recursos financeiros de parceiros para investimento em PD&I |
| **Entidade Parceira** | Instituicao (publica ou privada) que firma parceria com a agencia de fomento mediante aporte financeiro para execucao conjunta de programas e projetos |

## Agencia de Fomento (Interno)

Personas internas da agencia de fomento responsaveis pela operacao e administracao do sistema.

| Persona | Descricao |
|---------|-----------|
| **Analista da Area Tecnica da Agencia** | Funcionario da agencia de fomento responsavel pela gestao administrativa, financeira e tecnica |
| **Analista** | Servidor lotado em uma Area Tecnica, responsavel por gerenciar projetos, bolsas e prestacoes de contas |
| **Area Tecnica** | Unidade organizacional da agencia de fomento, composta por servidores, responsavel pela analise e liberacao de editais e pagamentos |
| **SUCON** | Superintendencia de Contratos e Convenios — unidade organizacional da agencia de fomento |

## Orgaos de Controle e Transparencia

| Persona | Descricao |
|---------|-----------|
| **SECONT** | Secretaria de Controle e Transparencia do Espirito Santo ([secont.es.gov.br](https://secont.es.gov.br/)) — orgao responsavel pela fiscalizacao, auditoria e transparencia da administracao publica estadual |

## Avaliadores Externos

| Persona | Descricao |
|---------|-----------|
| **Consultor Ad Hoc** | Cidadao com curriculo Lattes, convidado como avaliador externo de merito tecnico-cientifico |
