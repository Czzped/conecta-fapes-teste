# Adapter ORCID — Mapeamento e contrato interno

[← Voltar ao Adapter ORCID](README.md) | [M023](../README.md) | [Discovery ORCID](../../../../discovery/integracoes/orcid.md)

> **Modelo de execucao: sincrono.** Mesma semantica do adapter [Lattes](../lattes/adapter.md). Comando invocado por M024 bloqueia ate concluir (sucesso ou erro). Sem polling, sem eventos assincronos. Erros propagados como excecao tipada.

## Comandos genericos atendidos pelo adapter

| Comando | Acao | Retorno |
|---------|------|---------|
| `ImportarCurriculoPorOrcid(orcidId)` | Garante token (cache ou novo), consulta `/record` + summaries por secao + details por put-code, parseia, mapeia para entidades M024, persiste com `versao = 1`, atualiza `Curriculo.dataUltimaSincronizacao` | `ImportacaoCurriculoResult { orcidId, versao, dataSincronizacao, dataAtualizacaoFonte, contagens, areasNaoMapeadas[] }` ou excecao tipada |
| `SincronizarCurriculoPorOrcid(orcidId)` | Reimport completo -- apaga entidades filhas anteriores oriundas de ORCID (RN-M024-03) e recria com snapshot atual. Incrementa `versao` | Mesmo DTO ou excecao |
| `BuscarOrcid(query, rows, start)` | Sintaxe Solr -- delega a `/expanded-search/`. Suporta `family-name`, `given-names`, `keyword`, `affiliation-org-name`, `grid-org-id`, `ror-org-id`, `email`, `digital-object-ids`, `profile-last-modified-date` (faixa) | `BuscaResult { total, hits: [{ orcidId, nome, instituicao, email }], proximoStart }` ou excecao |

### Excecoes (categorias de erro)

| Tipo | Quando | Acao do caller (M024) |
|------|--------|------------------------|
| `OrcidTecnicoException` | Timeout, falha de rede, 5xx da ORCID Public API | Retry com backoff exponencial (3 tentativas), depois propaga -- HTTP `502 ADAPTER_ORCID_FALHOU` com `categoriaErro = Tecnico` |
| `OrcidNaoEncontradoException` | ORCID iD nao existe ou registro privado | Sem retry -- HTTP `404 ORCID_NAO_ENCONTRADO` |
| `OrcidPermissaoException` | 401/403 (token expirado, scope insuficiente) | Sem retry -- HTTP `502` com `categoriaErro = Permissao` (admin revalida credenciais) |
| `OrcidParseException` | JSON malformado, schema mismatch | Sem retry. Arquiva resposta bruta para auditoria. Propaga -- HTTP `502` com `categoriaErro = ParseError` |
| `OrcidFonteIndisponivelException` | ORCID fora do ar | Propaga -- HTTP `502` com `categoriaErro = FonteIndisponivel` |

Snapshot anterior permanece intacto enquanto a sincronizacao nao retorna sucesso. Escrita atomica.

## Endpoints ORCID Public API (v3.0)

### OAuth (token)

| Endpoint | Uso |
|----------|-----|
| `POST https://orcid.org/oauth/token` | Obtem `access_token` (Client Credentials, scope `/read-public`). Sandbox: `https://sandbox.orcid.org/oauth/token` |

### Leitura de registro -- padrao summary → detail

Summaries (lista resumida com put-codes):

| Endpoint | Uso |
|----------|-----|
| `GET https://pub.orcid.org/v3.0/{orcidId}/record` | Registro publico consolidado (overview + put-codes em todas as secoes) |
| `GET https://pub.orcid.org/v3.0/{orcidId}/person` | Identificacao, biografia, outros nomes, keywords |
| `GET https://pub.orcid.org/v3.0/{orcidId}/activities` | Overview de works, funding, peer-reviews |
| `GET https://pub.orcid.org/v3.0/{orcidId}/educations` | Summaries de formacao academica |
| `GET https://pub.orcid.org/v3.0/{orcidId}/employments` | Summaries de afiliacoes profissionais |
| `GET https://pub.orcid.org/v3.0/{orcidId}/works` | Summaries de obras |
| `GET https://pub.orcid.org/v3.0/{orcidId}/fundings` | Summaries de financiamentos |
| `GET https://pub.orcid.org/v3.0/{orcidId}/distinctions` | Summaries de distincoes |
| `GET https://pub.orcid.org/v3.0/{orcidId}/qualifications`, `/memberships`, `/invited-positions` | Secoes adicionais (perfil enriquecido, futuro) |

Details (item completo por `put-code`):

| Endpoint | Uso |
|----------|-----|
| `GET https://pub.orcid.org/v3.0/{orcidId}/education/{put-code}` | Item completo de educacao |
| `GET https://pub.orcid.org/v3.0/{orcidId}/employment/{put-code}` | Item completo de afiliacao |
| `GET https://pub.orcid.org/v3.0/{orcidId}/work/{put-code}` | Item completo de obra (relacoes, identificadores externos) |
| `GET https://pub.orcid.org/v3.0/{orcidId}/funding/{put-code}` | Item completo de financiamento |
| `GET https://pub.orcid.org/v3.0/{orcidId}/distinction/{put-code}` | Item completo de distincao |

> **Estrategia do adapter:** sempre buscar summaries primeiro, depois consultar detail apenas para itens com `last-modified-date` mais recente que `Curriculo.dataAtualizacaoLattes` do snapshot anterior (na primeira importacao, todos).

### Busca de pesquisador

| Endpoint | Retorno |
|----------|---------|
| `GET https://pub.orcid.org/v3.0/search/?q={query}` | Apenas lista de ORCID iDs (depois e preciso ir em `/record`) |
| `GET https://pub.orcid.org/v3.0/expanded-search/?q={query}` | ORCID iD + given-names + family-name + institution-name + email -- preferido pelo Conecta |
| `GET https://pub.orcid.org/v3.0/csv-search/?q={query}&fl=...` | Formato CSV com colunas customizaveis |

**Paginacao:** `start`, `rows` (max 1000/request). Total absoluto na Public API: **10.000 resultados**; alem disso adapter retorna erro de "resultado truncado" e exige filtros adicionais.

### Cabecalhos padrao

```
Authorization: Bearer {access_token}
Accept: application/json
```

XML disponivel via `Accept: application/vnd.orcid+xml`. Adapter usa JSON por simplicidade de parsing.

## Mapeamento ORCID → entidades M024

| Recurso ORCID | Campo JSON | Entidade M024 | Notas |
|---------------|------------|---------------|-------|
| `/record` -> `last-modified-date` | `last-modified-date.value` | `Curriculo.dataAtualizacaoLattes` | Reaproveita o campo (sera renomeado para `dataAtualizacaoFonte` quando o modelo for source-agnostic). Por ora, popula com valor do ORCID quando essa for a fonte |
| `/educations` -> `education-summary` | `role-title`, `organization.name`, `start-date`, `end-date` | `FormacaoAcademica` | `nivel` inferido por heuristica a partir de `role-title` (Bachelor → Graduacao, Master → Mestrado, PhD → Doutorado, Postdoc → PosDoutorado); quando ambiguo, vai para log de discrepancia |
| `/employments` -> `employment-summary` | `organization.name` | `Instituicao` (M008) | Match-or-create em M008 a partir de `organization.name` + `organization.disambiguated-organization` (ROR/GRID quando presente) |
| `/works` -> `work-summary` com `type = JOURNAL_ARTICLE` | `title`, `external-ids` (doi, issn), `journal-title`, `publication-date` | `Artigo` + `Periodico` | Match-or-create `Periodico` pelo ISSN; `qualis` indisponivel via ORCID |
| `/works` -> `work-summary` com `type IN (BOOK, BOOK_CHAPTER, EDITED_BOOK)` | `title`, `external-ids` (isbn), `publication-date` | `Livro` | `tipo = Livro` ou `Capitulo` |
| `/fundings` -> `funding-summary` | `title`, `organization.name`, `start-date`, `end-date` | `Projeto` | Financiador → `Instituicao` (M008); `papel` assumido `Coordenador` quando ORCID nao discrimina |
| `/distinctions` -> `affiliation-summary` | `role-title`, `organization.name`, `start-date` | `Premio` | Entidade → `Instituicao` (M008) |
| Campos sem equivalente | -- | -- | ORCID **nao cobre** `Orientacao`, `ParticipacaoEvento`, `Idioma` -- ver §Limitacoes em [README.md](README.md) |

## DTO de retorno

```json
{
  "orcidId": "0000-0001-2345-6789",
  "versao": 1,
  "dataSincronizacao": "2026-05-11T14:32:42Z",
  "dataAtualizacaoFonte": "2026-04-22",
  "contagens": {
    "formacoes": 3,
    "artigos": 27,
    "livros": 2,
    "orientacoes": 0,
    "projetos": 5,
    "premios": 1,
    "eventos": 0,
    "idiomas": 0,
    "areasDeAtuacao": 0
  },
  "areasNaoMapeadas": []
}
```

Note: contagens em `orientacoes`, `eventos`, `idiomas`, `areasDeAtuacao` virao tipicamente zeradas -- ORCID nao oferece esses dados (ver §Limitacoes).

## Sintaxe de busca (Solr)

Adapter aceita query Solr direta ou monta a partir de filtros tipados. Campos uteis:

| Campo | Uso |
|-------|-----|
| `given-names`, `family-name`, `credit-name`, `other-names` | Busca por nome |
| `email` | Busca por email (respeita visibilidade do ORCID) |
| `keyword` | Palavras-chave declaradas pelo pesquisador (proxy de area de atuacao) |
| `affiliation-org-name` | Instituicao por nome (entre aspas para multi-palavras) |
| `grid-org-id`, `ror-org-id`, `ringgold-org-id` | Instituicao por identificador canonico |
| `work-titles`, `digital-object-ids`, `doi-self` | Busca por titulo de obra ou DOI |
| `profile-last-modified-date` | Faixa ISO 8601: `[2024-01-01T00:00:00Z TO NOW]` |
| `orcid` | Busca direta por ORCID iD |

Operadores Solr: `AND`/`OR` em maiusculas, parenteses, aspas para frase exata, `*` para wildcard.

Exemplos uteis no Conecta:

```
family-name:Silva AND affiliation-org-name:"Universidade Federal do Espirito Santo"
keyword:Bioinformatica AND profile-last-modified-date:[2024-01-01T00:00:00Z TO NOW]
grid-org-id:grid.412331.6 AND keyword:"Quantum Computing"
```

## Autenticacao

Public API usa **Client Credentials flow** (servidor-a-servidor) -- sem login do pesquisador, dados publicos somente. Para escopo `/read-limited` (dados marcados como "limited visibility" pelo pesquisador) e escrita no registro, seria necessario **Member API** + 3-legged OAuth -- fora do escopo atual (ver Pendencia 4 em [discovery/integracoes/orcid.md](../../../../discovery/integracoes/orcid.md)).

```
POST https://orcid.org/oauth/token
Content-Type: application/x-www-form-urlencoded

client_id={ORCID_CLIENT_ID}
&client_secret={ORCID_CLIENT_SECRET}
&grant_type=client_credentials
&scope=/read-public
```

Resposta:

```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "refresh_token": "...",
  "expires_in": 631138518,
  "scope": "/read-public"
}
```

Token tem validade longa (~20 anos para `/read-public`). Adapter mantem em cache e renova preventivamente.

## Idempotencia

- Reimportacao apaga entidades filhas anteriores oriundas de ORCID antes de inserir o snapshot atual (RN-M024-03). Operacao atomica.
- Falha durante o processo (excecao tipada) deixa o snapshot anterior intacto.
- Re-execucao apos falha simplesmente refaz a chamada.

## Configuracao

| Parametro | Valor padrao | Descricao |
|-----------|--------------|-----------|
| `orcid.adapter.baseUrl` | `https://pub.orcid.org/v3.0` | URL base da Public API |
| `orcid.adapter.oauthUrl` | `https://orcid.org/oauth/token` | URL do endpoint de token |
| `orcid.adapter.clientId` | (vazio, vault) | Client ID registrado em orcid.org/developer-tools |
| `orcid.adapter.clientSecret` | (vazio, vault) | Client secret |
| `orcid.adapter.timeoutSegundos` | 30 | Timeout por chamada |
| `orcid.adapter.retries.tecnico` | 3 | Tentativas para erros tecnicos com backoff exponencial |

## Referencias

- [Discovery — ORCID](../../../../discovery/integracoes/orcid.md) -- visao de negocio, casos de uso, sequence diagrams
- [ORCID Public API (oficial)](https://info.orcid.org/what-is-orcid/services/public-api/)
- [ORCID API reference v3.0](https://github.com/ORCID/ORCID-Source/blob/main/orcid-api-web/tutorial/README.md)
- [ORCID Developer Tools](https://orcid.org/developer-tools)
- [Adapter Lattes](../lattes/adapter.md) -- adapter irmao da mesma familia
- [M024 — Modelo Estrutural](../../M024-curriculo-pesquisador/modelo-estrutural.md)
