# Backlog — M024 Curriculo do Pesquisador

[M024](README.md) | [Modelo Estrutural](modelo-estrutural.md) | [Submodelos](submodelos/README.md) | [Modelo Comportamental](modelo-comportamental.md) | [Contrato](contrato.md) | [Contrato API](contrato-api.md)

## Leitura por subdominio

Os EPICs foram reorganizados a partir dos submodelos estruturais do M024. O modulo tem um nucleo de `Curriculo` e cinco conjuntos funcionais: formacao, producao bibliografica, atuacao academica, complementos do perfil e consumo transversal.

| Subdominio | Submodelos | EPIC |
|------------|------------|------|
| Nucleo do curriculo | 01 - Curriculo, 10 - Cadastros de Apoio e Referencias | EPIC-M024-001 |
| Formacao e titulacao | 02 - Formacao Academica, AreaConhecimento | EPIC-M024-002 |
| Producoes bibliograficas | 03 - Artigos, 04 - Livros e Capitulos, Periodico | EPIC-M024-003 |
| Atuacao academica | 05 - Orientacoes, 06 - Projetos | EPIC-M024-004 |
| Complementos do perfil | 07 - Eventos, 08 - Premios, 09 - Idiomas | EPIC-M024-005 |
| Consumo transversal | Consultas, busca por expertise, eventos de dominio | EPIC-M024-006 |

## EPICs

| ID | Titulo | Prioridade | Status | Documento |
|----|--------|------------|--------|-----------|
| EPIC-M024-001 | Nucleo do Curriculo e Sincronizacao Lattes | Must | To Do | [EPIC-M024-001](epics/EPIC-M024-001.md) |
| EPIC-M024-002 | Formacao Academica e Titulacao | Must | To Do | [EPIC-M024-002](epics/EPIC-M024-002.md) |
| EPIC-M024-003 | Producoes Bibliograficas | Must | To Do | [EPIC-M024-003](epics/EPIC-M024-003.md) |
| EPIC-M024-004 | Orientacoes e Projetos Academicos | Must | To Do | [EPIC-M024-004](epics/EPIC-M024-004.md) |
| EPIC-M024-005 | Complementos do Perfil Academico | Should | To Do | [EPIC-M024-005](epics/EPIC-M024-005.md) |
| EPIC-M024-006 | Consulta, Busca por Expertise e Eventos | Must | To Do | [EPIC-M024-006](epics/EPIC-M024-006.md) |

## Historias

| ID | Historia | EPIC | Prioridade | Status |
|----|----------|------|------------|--------|
| US-M024-001 | Vincular `numeroLattes` unico a uma `PessoaFisica` ativa | EPIC-M024-001 | Must | To Do |
| US-M024-002 | Executar primeira importacao sincrona via M023/lattes | EPIC-M024-001 | Must | To Do |
| US-M024-003 | Persistir `Curriculo` versionado com validade e areas de atuacao | EPIC-M024-001 | Must | To Do |
| US-M024-004 | Sincronizar curriculo sob demanda preservando snapshot anterior em falha | EPIC-M024-001 | Must | To Do |
| US-M024-024 | Executar job mensal de sincronizacao em massa de todos os curriculos vinculados | EPIC-M024-001 | Must | To Do |
| US-M024-005 | Persistir formacoes academicas importadas do Lattes | EPIC-M024-002 | Must | To Do |
| US-M024-006 | Calcular titulacao maxima concluida do pesquisador | EPIC-M024-002 | Must | To Do |
| US-M024-007 | Expor formacoes por curriculo com filtros por nivel, status e area | EPIC-M024-002 | Must | To Do |
| US-M024-008 | Persistir artigos e periodicos com autores compartilhados | EPIC-M024-003 | Must | To Do |
| US-M024-009 | Persistir livros e capitulos do curriculo | EPIC-M024-003 | Must | To Do |
| US-M024-010 | Consultar producoes bibliograficas por filtros operacionais | EPIC-M024-003 | Must | To Do |
| US-M024-011 | Persistir orientacoes concluidas e em andamento | EPIC-M024-004 | Must | To Do |
| US-M024-012 | Persistir projetos compartilhados com `ParticipacaoProjeto` | EPIC-M024-004 | Must | To Do |
| US-M024-013 | Consultar orientacoes e projetos por filtros | EPIC-M024-004 | Must | To Do |
| US-M024-014 | Persistir participacoes em eventos cientificos | EPIC-M024-005 | Should | To Do |
| US-M024-015 | Persistir premios, titulos e homenagens | EPIC-M024-005 | Should | To Do |
| US-M024-016 | Persistir idiomas e niveis de proficiencia | EPIC-M024-005 | Should | To Do |
| US-M024-017 | Consultar curriculo completo por CPF com `curriculoValido` | EPIC-M024-006 | Must | To Do |
| US-M024-018 | Listar colecoes do curriculo com filtros e paginacao | EPIC-M024-006 | Must | To Do |
| US-M024-019 | Buscar pesquisadores por area, titulacao minima e producao minima | EPIC-M024-006 | Must | To Do |
| US-M024-020 | Publicar eventos de dominio para consumidores internos | EPIC-M024-006 | Must | To Do |
| US-M024-021 | Atualizar curriculo manualmente pela tela de curriculo do pesquisador (backoffice FAPES) | EPIC-M024-001 | Must | To Do |
| US-M024-022 | Calcular compatibilidade pesquisador x edital por interseccao de areas de conhecimento | EPIC-M024-006 | Must | To Do |
| US-M024-023 | Publicar evento EditaisCompativeisIdentificados apos sincronizacao do curriculo | EPIC-M024-006 | Must | To Do |

## Consumidores

| Modulo | Uso |
|--------|-----|
| M009 | Dados academicos (titulacao, formacao) exibidos na tela de aprovacao de bolsas |
| M011 | Selecao automatica de consultor Ad Hoc por expertise e score |
| M018 | Indicadores de producao cientifica, titulacao, orientacoes e projetos |
| M019 | Vitrine publica do perfil academico |
| M020 | Notificacoes de vinculacao, sincronizacao, falha e editais compativeis |
| M008 | `PessoaFisica`, `Instituicao`, `AreaConhecimento` e recalculo de nivel academico |

## Dependencias e riscos essenciais

| Item | Tratamento |
|------|------------|
| Adapter M023/lattes indisponivel | Retornar erro ao chamador e preservar estado anterior |
| Reimportacao parcial | Persistir snapshot em transacao: apagar e recriar filhas/vinculos somente apos parse valido |
| Registros compartilhados | `Artigo`, `Projeto` e `Periodico` nao sao apagados se ainda estiverem referenciados por outro curriculo |
| AreaConhecimento nao mapeada | Publicar/registrar discrepancia e concluir sincronizacao |
| Curriculo desatualizado | Excluir de buscas por padrao (`apenasValidos=true`) |
