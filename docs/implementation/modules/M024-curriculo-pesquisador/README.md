# M024 - Curriculo do Pesquisador

[<< Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 01 -- Corporativo e Administrativo](../../../discovery/domains/01-corporativo.md) | [Modelo conceitual](../../../discovery/domains/01-corporativo-pesquisador.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | EPICs, historias, metricas, riscos e pendencias do modulo |
| [Contrato](contrato.md) | Operacoes publicas, consumidores, dependencias e eventos do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Mapa estrutural consolidado e indice dos submodelos |
| [Submodelos Estruturais](submodelos/README.md) | Modelos menores por assunto: curriculo, formacao, artigos, orientacoes, projetos, eventos, premios e outros |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclos de vida, transicoes e fluxos de sincronizacao |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST: endpoints, payloads e autorizacao |
| [Eventos de Dominio](eventos-dominio.md) | Eventos publicados e consumidos pelo modulo |

---

## Sobre o Modulo

Hoje a plataforma armazena apenas a URL do curriculo Lattes em `PessoaFisica.lattes`. Nao ha qualquer estrutura para representar formacao academica, producao bibliografica, orientacoes, projetos de pesquisa, premios, participacao em eventos ou idiomas. Sem esses dados estruturados, a Agencia nao consegue selecionar consultor Ad Hoc por expertise, validar elegibilidade de proponente em edital, gerar indicador de producao cientifica ou montar vitrine de pesquisador.

Este modulo resolve esse problema ao introduzir o conceito de `Pesquisador` -- uma visao sobre `PessoaFisica` que possui `Curriculo` vinculado -- e ao manter, em replica local versionada, as entidades academicas do CV: `FormacaoAcademica`, `Artigo`, `Livro`, `Orientacao`, `Projeto`, `Premio`, `ParticipacaoEvento` e `Idioma`. M024 nao integra com a Plataforma Lattes do CNPq diretamente; quem faz isso e o adapter externo em [M023/lattes](../M023-integracoes/lattes/README.md), invocado sincronamente pelas operacoes de vinculacao e sincronizacao.

O sucesso do modulo sera medido por: numero de pesquisadores com curriculo valido, taxa de selecao automatica de Ad Hoc por area de expertise (M011), reducao do tempo de validacao manual de elegibilidade em editais e cobertura de indicadores de producao cientifica em M018 e M019.

---

## Dominio

O curriculo do pesquisador e replica local versionada da Plataforma Lattes do CNPq, que e a fonte canonica dos dados academicos. O Conecta nao edita o curriculo: reimportacao apaga e recria as entidades filhas e vinculos academicos do snapshot atual do Lattes (RN-M024-03). `Curriculo.dataUltimaSincronizacao` registra a ultima execucao bem-sucedida; tentativas falhas nao deixam estado intermediario persistido -- erros sao retornados em-linha ao chamador (HTTP 502) e gravados em log estruturado.

A vinculacao entre `PessoaFisica` e `Curriculo` se da pelo `numeroLattes` (identificador do CNPq) e e unica no sistema (RN-M024-02). Uma `PessoaFisica` so e tratada como `Pesquisador` apos ter um `Curriculo` vinculado e sincronizado com sucesso. `Pesquisador` nao e entidade separada: e flag derivado da existencia do curriculo.

O adapter externo que importa do CNPq vive em [M023/lattes](../M023-integracoes/lattes/README.md). M024 invoca o adapter de forma **sincrona** (`ImportarCurriculo`, `SincronizarCurriculo`): a chamada bloqueia ate o adapter coletar, parsear e retornar o snapshot academico, ou ate falhar com codigo de erro. A persistencia transacional do `Curriculo`, entidades filhas e vinculos compartilhados e responsabilidade do M024. Apos persistir com sucesso, M024 publica seus proprios eventos de dominio (`PesquisadorVinculado`, `CurriculoAtualizado` etc.) para os consumidores -- ver [eventos-dominio.md](eventos-dominio.md). M024 nao conhece XML do Lattes, wrappers ou parsers -- conhece apenas o snapshot academico normalizado retornado pelo adapter.

| Entidade | Descricao | Cardinalidade vs Curriculo |
|----------|-----------|----------------------------------|
| Pesquisador | Visao sobre `PessoaFisica` com `Curriculo` vinculado (nao e entidade, e flag derivado) | 1:1 com PessoaFisica |
| [Curriculo](submodelos/01-curriculo.md) | Raiz do curriculo importado, vinculada a PessoaFisica pelo `numeroLattes` | 1:1 com Pesquisador |
| [FormacaoAcademica](submodelos/02-formacao-academica.md) | Titulacao academica: Graduacao, Especializacao, Mestrado, Doutorado, PosDoutorado | 0..* |
| [Artigo](submodelos/03-artigos.md) | Producao bibliografica em periodico ou conferencia, compartilhavel entre curriculos de autores diferentes | 0..* |
| [Livro](submodelos/04-livros.md) | Livro completo ou capitulo de livro | 0..* |
| [Orientacao](submodelos/05-orientacoes.md) | Orientacao academica concluida ou em andamento | 0..* |
| [Projeto](submodelos/06-projetos.md) | Projeto de pesquisa compartilhavel entre curriculos de participantes diferentes | 0..* via `ParticipacaoProjeto` |
| [ParticipacaoEvento](submodelos/07-eventos.md) | Participacao em evento cientifico | 0..* |
| [Premio](submodelos/08-premios.md) | Premio, titulo honorifico ou homenagem recebida | 0..* |
| [Idioma](submodelos/09-idiomas.md) | Idioma falado e nivel de proficiencia | 0..* |
| [AreaConhecimento](../M008-cadastros-corporativos/classificacoes/area-conhecimento/README.md) | Areas de atuacao classificadas conforme CNPq, referenciando M008 §1.3.6 | N:N |

O mapa conceitual completo esta em [modelo-estrutural.md](modelo-estrutural.md); os dicionarios detalhados ficam nos [submodelos estruturais](submodelos/README.md).

> Autenticacao e controle de acesso (IAM) sao tratados em M005. A integracao com o CNPq Lattes esta em [M023/lattes](../M023-integracoes/lattes/README.md). O cadastro canonico de Area de Conhecimento esta em [M008 Classificacoes](../M008-cadastros-corporativos/classificacoes/area-conhecimento/README.md).

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN-M024-01 | Toda Pessoa identificada como `Pesquisador` deve possuir exatamente um `Curriculo` vinculado. | Must |
| RN-M024-02 | `numeroLattes` e unico no sistema -- nao pode haver duas `PessoaFisica` com o mesmo numero Lattes. | Must |
| RN-M024-03 | Reimportacao do curriculo apaga todas as entidades filhas anteriores e vinculos academicos anteriores do snapshot (incluindo vinculos com `Artigo` e `ParticipacaoProjeto`) e recria a partir do snapshot atual do Lattes. Registros compartilhados, como `Artigo`, `Projeto` e `Periodico`, nao sao apagados se ainda estiverem referenciados por outro curriculo. | Must |
| RN-M024-04 | Curriculo valido para uso em fluxos = `dataUltimaSincronizacao` nos ultimos 12 meses. | Must |
| RN-M024-05 | `Pesquisador` suspenso (PessoaFisica.estado = `SUSPENSA`) bloqueia uso do curriculo em selecao de Ad Hoc e elegibilidade, mas o curriculo permanece consultavel para auditoria. | Must |
| RN-M024-06 | AreaConhecimento referenciada pelo curriculo deve existir no cadastro canonico CNPq de M008 (§1.3.6) -- areas nao mapeadas sao registradas em log de discrepancia. | Must |
| RN-M024-07 | Sincronizacao automatica do `Curriculo` acontece **mensalmente** para todos os pesquisadores vinculados (job recorrente). Alem disso, a **primeira sincronizacao** e disparada sincronamente no momento da vinculacao do Lattes em `VincularCurriculo`. Pesquisador e Analista podem disparar `SincronizarCurriculo` sob demanda a qualquer momento. | Must |
| RN-M024-08 | Atualizacao manual do curriculo (acionada por Analista na tela de curriculo) respeita cooldown de **1 hora** por pesquisador para evitar sobrecarga no adapter M023/lattes. Job mensal e primeira vinculacao ignoram o cooldown. Tentativa antes do cooldown retorna 429 ATUALIZACAO_EM_COOLDOWN com timestamp de liberacao. | Must |

---

## Dependencias

| Modulo | Uso |
|--------|-----|
| [M005 - Autenticacao](../M005-autenticacao/README.md) | Identidade autenticada do pesquisador que vincula seu curriculo |
| [M008 - Cadastros Corporativos](../M008-cadastros-corporativos/README.md) | `PessoaFisica` canonical (pelo CPF) e cadastro canonico de `AreaConhecimento` (CNPq) |
| [M020 - Comunicacao](../M020-comunicacao/README.md) | Notificacao ao pesquisador sobre sincronizacao concluida, falha ou curriculo desatualizado |
| [M023/lattes - Adapter Lattes](../M023-integracoes/lattes/README.md) | Adapter externo invocado sincronamente para coletar, parsear e retornar snapshots normalizados do CNPq |

---

## Habilita

| Modulo | Funcionalidade habilitada |
|--------|---------------------------|
| [M011 - Configuracao de Captacao](../M011-configuracao-captacao/README.md) | Selecao automatica de consultor Ad Hoc por area de expertise e producao minima |
| [M018 - Business Intelligence](../M018-business-intelligence/README.md) | Indicadores de producao cientifica, distribuicao de titulacao e orientacoes na carteira |
| [M019 - Transparencia e Auditoria](../M019-transparencia-auditoria/README.md) | Publicacao de perfil academico de pesquisadores beneficiarios |
| M024 (interno) | Perfil/vitrine do pesquisador na plataforma |
