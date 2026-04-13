# ConectaFAPES — Visao do Produto

## Proposito

O ConectaFAPES e a plataforma digital da FAPES (Fundacao de Amparo a Pesquisa e Inovacao do Espirito Santo) para a gestao do ciclo completo de fomento a pesquisa, ao desenvolvimento e a inovacao. O sistema substitui processos manuais e fragmentados por fluxos digitais integrados — do planejamento estrategico a prestacao de contas.

---

## Personas

### Comunidade Cientifica

Personas externas que interagem com a FAPES como beneficiarias, proponentes ou participantes de projetos.

O Cidadao e a persona base. Ao se associar a um projeto, torna-se Participante de Projeto. O Participante com bolsa e um Bolsista; sem bolsa, e um Voluntario. O Orientador e um Participante de Projeto responsavel pela orientacao de outros participantes. Um Terceiro (PJ) e uma pessoa juridica que participa do projeto. O Coordenador e o responsavel pela coordenacao do projeto.

| Persona | Descricao |
|---------|-----------|
| **Cidadao** | Pessoa que acessa o portal publico da FAPES para consultar editais, programas e resultados |
| **Participante de Projeto** | Cidadao associado a um projeto de pesquisa |
| **Bolsista** | Participante de projeto com bolsa ativa vinculada |
| **Voluntario** | Participante de projeto sem bolsa associada |
| **Terceiro (PJ)** | Pessoa juridica que participa de um projeto como prestadora de servico ou fornecedora |
| **Coordenador** | Cidadao responsavel pela coordenacao de um projeto ou iniciativa contratada |
| **Orientador** | Participante de projeto responsavel pela orientacao de outros participantes em programas de pos-graduacao |

### Instituicoes

Uma Instituicao e uma organizacao generica. Uma Instituicao de Ensino e Pesquisa e um tipo de Instituicao. Toda Instituicao e composta por Unidades Organizacionais, e cada Unidade possui um Diretor ou responsavel. A Instituicao de Ensino e Pesquisa possui um Reitor como dirigente maximo.

| Persona | Descricao |
|---------|-----------|
| **Reitor** | Dirigente maximo de uma Instituicao de Ensino e Pesquisa |
| **Diretor / Responsavel** | Responsavel por uma Unidade Organizacional dentro de uma Instituicao |

### Parceiros e Agencia de Fomento

A FAPES e uma agencia de fomento — entidade que gerencia recursos financeiros de parceiros para investimento em pesquisa, desenvolvimento e inovacao (PD&I). Entidades Parceiras firmam parcerias com a FAPES mediante aporte financeiro, e a FAPES administra esses recursos vinculando-os a programas e projetos.

| Persona | Descricao |
|---------|-----------|
| **Agencia de Fomento** | A FAPES e uma Agencia estadual que gerencia recursos financeiros de parceiros para investimento em PD&I |
| **Entidade Parceira** | Instituicao (publica ou privada) que firma parceria com a FAPES mediante aporte financeiro para execucao conjunta de programas e projetos |

### FAPES (Interno)

Personas internas da FAPES responsaveis pela operacao e administracao do sistema.

| Persona | Descricao |
|---------|-----------|
| **Analista da Area Tecnica da Agencia** | Funcionario da FAPES responsavel pela gestao administrativa, financeira e tecnica |
| **Analista** | Servidor lotado em uma Area Tecnica, responsavel por gerenciar projetos, bolsas e prestacoes de contas |
| **Area Tecnica** | Unidade organizacional da FAPES, composta por servidores, responsavel pela analise e liberacao de editais e pagamentos |
| **SUCON** | Superintendencia de Contratos e Convenios — unidade organizacional da FAPES |

### Orgaos de Controle e Transparencia

| Persona | Descricao |
|---------|-----------|
| **SECONT** | Secretaria de Controle e Transparencia do Espirito Santo ([secont.es.gov.br](https://secont.es.gov.br/)) — orgao responsavel pela fiscalizacao, auditoria e transparencia da administracao publica estadual |

### Avaliadores Externos

| Persona | Descricao |
|---------|-----------|
| **Consultor Ad Hoc** | Cidadao com curriculo Lattes, convidado como avaliador externo de merito tecnico-cientifico |

---

## Mapa de Dominios

Cada domain define uma capacidade de negocio. Um modulo e a implementacao de um domain.

| Domain | Descricao | Arquivo | Modulos |
|--------|-----------|---------|---------|
| 01 Corporativo e Administrativo | Identidades, cadastros mestres, estrutura organizacional e modalidades de bolsa | [01-corporativo.md](domains/01-corporativo.md) | M001, M005, M006, M007 |
| 02 Planejamento e Estrategia | Plano estrategico, parcerias e programas de fomento | [02-planejamento.md](domains/02-planejamento.md) | — |
| 03 Fomento Pre-Award | Captacao, selecao e contratacao de iniciativas | [03-fomento-pre-award.md](domains/03-fomento-pre-award.md) | M003 |
| 04 Fomento Post-Award | Execucao, acompanhamento, bolsistas e finalizacao | [04-fomento-post-award.md](domains/04-fomento-post-award.md) | M009 |
| 05 Financeiro | Contabilidade, contas bancarias, pagamentos e PLD | [05-financeiro.md](domains/05-financeiro.md) | M004 |
| 06 Suporte e Inteligencia | BI, transparencia, auditoria e comunicacao | [06-suporte-inteligencia.md](domains/06-suporte-inteligencia.md) | — |
| 07 Importacao SIGFAPES | Migracao de editais, projetos, pessoas e pagamentos do sistema legado | [07-importacao-sigfapes.md](domains/07-importacao-sigfapes.md) | M002 |

---

## Regras de Negocio Transversais

Regras que atravessam multiplos domains e nao pertencem a nenhum especificamente.

### Solicitacao de Bolsa — Prazo e Competencia

A solicitacao de bolsa envolve dois atores em sequencia: o coordenador abre a solicitacao e o bolsista envia a documentacao. A competencia do pagamento e determinada pelo prazo de envio da documentacao: dentro do prazo, o pagamento e processado no mes corrente; fora do prazo, no mes seguinte.

### Pagamento a Maior — Desconto em Parcelas Futuras

Quando identificado um pagamento acima do valor correto ao bolsista, o excedente e registrado como debito e descontado automaticamente nos pagamentos futuros ate quitacao total.

### Nota Fiscal — Uso Unico por Projeto

Cada nota fiscal pode ser vinculada a um unico projeto e registrada uma unica vez no sistema. O XML e validado junto ao SERPRO no momento da submissao.

### Conflito de Interesse com PJ

O coordenador e participantes do projeto nao podem ter vinculo com pessoas juridicas contratadas pelo projeto — societario, familiar (ate segundo grau) ou empregaticio. A contratacao e bloqueada automaticamente quando identificado conflito.

---

## Fundamentacao Legal

Este documento e os domains referenciam artigos da **LEC 978/2021** — Lei Complementar que dispoe sobre a Fundacao de Amparo a Pesquisa e Inovacao do Espirito Santo (FAPES).

| Artigo | Tema | Domains Relacionados |
|--------|------|----------------------|
| Art. 2 | Finalidades da FAPES | 01 |
| Art. 3 | Publicidade, prestacao de contas e acompanhamento | 01, 03, 04, 05, 06 |
| Art. 4 | Apoio financeiro, habilitacao e avaliacao de merito | 01, 03, 04 |
| Art. 5 | Registros, programas e escrituracao contabil | 05, 06 |
| Art. 6, par. unico | Motivacao e transparencia dos atos | 02, 03, 04 |
| Art. 12 | Camaras e comites de avaliacao de merito | 02, 03 |
| Art. 14 | Politicas, financiamento e homologacao | 01, 02, 03 |
| Art. 15 | Editais, pareceres e prestacao de contas | 03, 04 |
| Art. 16 | Autorizacao de pagamentos | 05 |
| Art. 18 | Relatorios tecnicos | 04, 06 |
| Art. 25 e 26 | Registros contabeis e ajustes orcamentarios | 04, 05 |
| Art. 27 | Prestacao de contas financeira | 04, 05, 07 |
| Art. 28 | Instrumentos de fomento e liberacao de recursos | 02, 03, 05 |
| Art. 30 | Recursos humanos e movimentacoes | 01 |
| Art. 37 | Politicas de capacitacao | 01 |
