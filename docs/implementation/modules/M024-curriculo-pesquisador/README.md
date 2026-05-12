# M024 - Curriculo do Pesquisador

[<< Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 01 -- Corporativo e Administrativo](../../../discovery/domains/01-corporativo.md) | [Modelo conceitual](../../../discovery/domains/01-corporativo-pesquisador.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados do curriculo |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST: endpoints, payloads e autorizacao |
| [Eventos de Dominio](eventos-dominio.md) | Eventos publicados e consumidos pelo modulo |

---

## Sobre o Modulo

Hoje a plataforma armazena apenas a URL do curriculo Lattes em `PessoaFisica.lattes`. Nao ha qualquer estrutura para representar formacao academica, producao bibliografica, orientacoes, projetos de pesquisa, premios, participacao em eventos ou idiomas. Sem esses dados estruturados, a Agencia nao consegue selecionar consultor Ad Hoc por expertise, validar elegibilidade de proponente em edital, gerar indicador de producao cientifica ou montar vitrine de pesquisador.

Este modulo resolve esse problema ao introduzir o conceito de `Pesquisador` -- uma visao sobre `PessoaFisica` que possui `Curriculo` vinculado -- e ao manter, em replica local versionada, as entidades academicas do CV: `FormacaoAcademica`, `Artigo`, `Livro`, `Orientacao`, `Projeto`, `Premio`, `ParticipacaoEvento` e `Idioma`. M024 nao integra com a Plataforma Lattes do CNPq diretamente; quem faz isso e o adapter externo em [M023/lattes](../M023-integracoes/lattes/README.md), que popula essas entidades atraves dos eventos descritos em [eventos-dominio.md](eventos-dominio.md).

O sucesso do modulo sera medido por: numero de pesquisadores com curriculo valido, taxa de selecao automatica de Ad Hoc por area de expertise (M011), reducao do tempo de validacao manual de elegibilidade em editais e cobertura de indicadores de producao cientifica em M018 e M019.

---

## Dominio

O curriculo do pesquisador e replica local versionada da Plataforma Lattes do CNPq, que e a fonte canonica dos dados academicos. O Conecta nao edita o curriculo: reimportacao apaga e recria as entidades filhas a partir do snapshot atual do Lattes (RN-M024-03). `Curriculo.dataUltimaSincronizacao` registra a ultima execucao bem-sucedida; tentativas falhas nao deixam estado intermediario persistido -- erros sao retornados em-linha ao chamador (HTTP 502) e gravados em log estruturado.

A vinculacao entre `PessoaFisica` e `Curriculo` se da pelo `numeroLattes` (identificador do CNPq) e e unica no sistema (RN-M024-02). Uma `PessoaFisica` so e tratada como `Pesquisador` apos ter um `Curriculo` vinculado e sincronizado com sucesso. `Pesquisador` nao e entidade separada: e flag derivado da existencia do curriculo.

O adapter externo que importa do CNPq vive em [M023/lattes](../M023-integracoes/lattes/README.md). M024 invoca o adapter de forma **sincrona** (`ImportarCurriculo`, `SincronizarCurriculo`): a chamada bloqueia ate o adapter parseiar, persistir e retornar o snapshot, ou ate falhar com codigo de erro. Apos persistir com sucesso, M024 publica seus proprios eventos de dominio (`PesquisadorVinculado`, `CurriculoAtualizado` etc.) para os consumidores -- ver [eventos-dominio.md](eventos-dominio.md). M024 nao conhece XML do Lattes, wrappers ou parsers -- conhece apenas o modelo academico.

| Entidade | Descricao | Cardinalidade vs Curriculo |
|----------|-----------|----------------------------------|
| Pesquisador | Visao sobre `PessoaFisica` com `Curriculo` vinculado (nao e entidade, e flag derivado) | 1:1 com PessoaFisica |
| [Curriculo](modelo-estrutural.md#curriculo) | Raiz do curriculo importado, vinculada a PessoaFisica pelo `numeroLattes` | 1:1 com Pesquisador |
| [FormacaoAcademica](modelo-estrutural.md#formacaoacademica) | Titulacao academica: Graduacao, Especializacao, Mestrado, Doutorado, PosDoutorado | 0..* |
| [Artigo](modelo-estrutural.md#artigo) | Producao bibliografica em periodico ou conferencia | 0..* |
| [Livro](modelo-estrutural.md#livro) | Livro completo ou capitulo de livro | 0..* |
| [Orientacao](modelo-estrutural.md#orientacao) | Orientacao academica concluida ou em andamento | 0..* |
| [Projeto](modelo-estrutural.md#projeto) | Projeto de pesquisa do qual o pesquisador participou | 0..* |
| [Premio](modelo-estrutural.md#premio) | Premio, titulo honorifico ou homenagem recebida | 0..* |
| [ParticipacaoEvento](modelo-estrutural.md#participacaoevento) | Participacao em evento cientifico | 0..* |
| [Idioma](modelo-estrutural.md#idioma) | Idioma falado e nivel de proficiencia | 0..* |
| AreaConhecimento | Areas de atuacao classificadas conforme CNPq, referenciando M008 §1.3.6 | N:N |

O modelo conceitual completo, com diagrama de classes e dicionario de dados, esta em [modelo-estrutural.md](modelo-estrutural.md).

> Autenticacao e controle de acesso (IAM) sao tratados em M005. A integracao com o CNPq Lattes esta em [M023/lattes](../M023-integracoes/lattes/README.md). O cadastro canonico de Area de Conhecimento esta em [M008 Classificacoes](../M008-cadastros-corporativos/classificacoes/area-conhecimento/README.md).

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN-M024-01 | Toda Pessoa identificada como `Pesquisador` deve possuir exatamente um `Curriculo` vinculado. | Must |
| RN-M024-02 | `numeroLattes` e unico no sistema -- nao pode haver duas `PessoaFisica` com o mesmo numero Lattes. | Must |
| RN-M024-03 | Reimportacao do curriculo apaga todas as entidades filhas anteriores (FormacaoAcademica, Artigo, Livro, Orientacao, Projeto, Premio, ParticipacaoEvento, Idioma) e recria a partir do snapshot atual do Lattes. | Must |
| RN-M024-04 | Curriculo valido para uso em fluxos = `dataUltimaSincronizacao` nos ultimos 12 meses. | Must |
| RN-M024-05 | `Pesquisador` suspenso (PessoaFisica.estado = `SUSPENSA`) bloqueia uso do curriculo em selecao de Ad Hoc e elegibilidade, mas o curriculo permanece consultavel para auditoria. | Must |
| RN-M024-06 | AreaConhecimento referenciada pelo curriculo deve existir no cadastro canonico CNPq de M008 (§1.3.6) -- areas nao mapeadas sao registradas em log de discrepancia. | Must |
| RN-M024-07 | Sincronizacao automatica do `Curriculo` acontece **semanalmente** para todos os pesquisadores vinculados (job recorrente). Alem disso, a **primeira sincronizacao** e disparada sincronamente no momento da vinculacao do Lattes em `VincularCurriculo`. Pesquisador e Analista podem disparar `SincronizarCurriculo` sob demanda a qualquer momento. | Must |

---

## Dependencias

| Modulo | Uso |
|--------|-----|
| [M005 - Autenticacao](../M005-autenticacao/README.md) | Identidade autenticada do pesquisador que vincula seu curriculo |
| [M008 - Cadastros Corporativos](../M008-cadastros-corporativos/README.md) | `PessoaFisica` canonical (pelo CPF) e cadastro canonico de `AreaConhecimento` (CNPq) |
| [M020 - Comunicacao](../M020-comunicacao/README.md) | Notificacao ao pesquisador sobre sincronizacao concluida, falha ou curriculo desatualizado |
| [M023/lattes - Adapter Lattes](../M023-integracoes/lattes/README.md) | Adapter externo que importa do CNPq e publica os eventos consumidos por M024 |

---

## Habilita

| Modulo | Funcionalidade habilitada |
|--------|---------------------------|
| [M011 - Configuracao de Captacao](../M011-configuracao-captacao/README.md) | Selecao automatica de consultor Ad Hoc por area de expertise e producao minima |
| [M018 - Business Intelligence](../M018-business-intelligence/README.md) | Indicadores de producao cientifica, distribuicao de titulacao e orientacoes na carteira |
| [M019 - Transparencia e Auditoria](../M019-transparencia-auditoria/README.md) | Publicacao de perfil academico de pesquisadores beneficiarios |
| M024 (interno) | Perfil/vitrine do pesquisador na plataforma |
