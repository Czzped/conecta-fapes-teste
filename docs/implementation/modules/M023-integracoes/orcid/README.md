# Adapter ORCID (Public API)

[← Voltar ao M023](../README.md) | [Discovery — ORCID](../../../../discovery/integracoes/orcid.md) | [M024 — Curriculo do Pesquisador](../../M024-curriculo-pesquisador/README.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [adapter.md](adapter.md) | Mapeamento de comandos M023 → endpoints ORCID Public API; parsing JSON; tratamento de erros |

---

## O que e

Adapter do M023 para o **ORCID** ([`orcid.org`](https://orcid.org/)) -- identificador internacional aberto de pesquisador, com **Public API** estavel ([info.orcid.org/what-is-orcid/services/public-api](https://info.orcid.org/what-is-orcid/services/public-api/)) que expoe o registro publico de cada pesquisador (identificacao, afiliacoes, formacao, producao bibliografica, financiamentos, premios).

Faz parte da mesma familia do adapter [lattes/](../lattes/README.md) -- ambos importam curriculo academico e alimentam o modelo de dominio do [M024](../../M024-curriculo-pesquisador/README.md). Adapter ORCID e **complementar** ao Lattes: cobre principalmente producao bibliografica internacional indexada (DOI) e pesquisador estrangeiro sem Lattes.

## Quando usar este adapter

- Pesquisador **estrangeiro** ou sem Lattes vinculado, identificavel pelo ORCID iD (16 digitos com hifens, ex.: `0000-0001-2345-6789`).
- Enriquecimento da producao bibliografica do Lattes com DOI/Crossref via ORCID (complemento, nao substituicao).
- Pesquisador que mantem ORCID atualizado mas Lattes estagnado.
- Selecao de Ad Hoc com perfil internacional (avaliadores fora do Brasil).

## Quando NAO usar este adapter

- Pesquisador brasileiro com Lattes ativo -- use o adapter [lattes/](../lattes/README.md) como fonte canonica primaria.
- Quando o curriculo exige orientacoes ou eventos cientificos -- ORCID **nao cobre orientacoes nem eventos** com a mesma riqueza do Lattes.
- Quando a producao bibliografica do pesquisador nao tem DOI -- ORCID indexa principalmente via DOI/Crossref.

## Estrategia de obtencao dos dados

ORCID oferece **API REST publica oficial e estavel** ([info.orcid.org/documentation/api-tutorials](https://info.orcid.org/documentation/api-tutorials/)) -- sem captcha, sem wrappers comunitarios. Adapter usa o canal **Public API** (`pub.orcid.org/v3.0`) com OAuth Client Credentials, scope `/read-public`.

Padrao **summary → detail**:

| Tipo | Padrao de URL | Retorno |
|------|---------------|---------|
| Summary (lista) | `GET /v3.0/{orcidId}/{secao}` | Itens resumidos com `put-code`, `visibility`, `display-index`, `last-modified-date` |
| Detail (item) | `GET /v3.0/{orcidId}/{secao-singular}/{put-code}` | Item completo (todos os campos, relacoes, identificadores externos) |
| Registro consolidado | `GET /v3.0/{orcidId}/record` | Snapshot do registro inteiro (mais pesado, util na primeira importacao) |

Secoes relevantes para o Conecta:

| Secao | Summary | Detail | Mapeia para |
|-------|---------|--------|-------------|
| Formacao | `/educations` | `/education/{put-code}` | `FormacaoAcademica` |
| Afiliacao | `/employments` | `/employment/{put-code}` | Match-or-create `Instituicao` (M008) |
| Obras | `/works` | `/work/{put-code}` | `Artigo` / `Livro` (DOI/ISSN/ISBN) |
| Financiamento | `/fundings` | `/funding/{put-code}` | `Projeto` (financiador → `Instituicao` M008) |
| Distincoes | `/distinctions` | `/distinction/{put-code}` | `Premio` |
| Pessoa | `/person` | -- | Nome + keywords (cross-reference com PessoaFisica) |

Adapter tambem usa o endpoint de **busca** quando o Conecta nao tem o ORCID iD a priori (Analista procurando especialistas estrangeiros):

| Endpoint | Funcao |
|----------|--------|
| `GET /v3.0/expanded-search/?q={query}` | Sintaxe Solr -- retorna nome, instituicao, email e ORCID iD numa unica chamada |
| `GET /v3.0/search/?q={query}` | Versao minima -- retorna apenas ORCID iD |

Detalhe completo de endpoints, autenticacao OAuth, sintaxe Solr e payload em [adapter.md](adapter.md).

## Ambientes

| Ambiente | API base | Quando usar |
|----------|----------|-------------|
| Sandbox | `https://pub.sandbox.orcid.org/v3.0` | Desenvolvimento, testes integrados |
| Producao | `https://pub.orcid.org/v3.0` | Operacao real |

## Pre-requisitos

1. **Registrar aplicacao Conecta** em [orcid.org/developer-tools](https://orcid.org/developer-tools) -- gera `client_id` e `client_secret`.
2. Solicitar **Public API token** (Client Credentials flow) -- token de leitura sem necessidade de login do pesquisador.
3. Persistir credenciais em vault (`orcid.adapter.clientId`, `orcid.adapter.clientSecret`).
4. Definir base legal LGPD para tratamento dos dados ORCID (dados publicos do registro -- consentimento implicito do proprio titular ao publicar no ORCID).

## Habilita

| Modulo | Uso |
|--------|-----|
| [M024](../../M024-curriculo-pesquisador/README.md) | Adapter ORCID popula entidades `FormacaoAcademica`, `Artigo`, `Livro`, `Projeto` (via financiamento), `Premio` -- mesma escrita do adapter Lattes |
| [M011](../../M011-configuracao-captacao/README.md) | Selecao de Ad Hoc com perfil internacional (avaliadores estrangeiros) |
| [M018](../../M018-business-intelligence/README.md) | Indicadores de producao internacional indexada |

## Limitacoes da fonte

| Limitacao | Impacto |
|-----------|---------|
| Sem `Orientacao` | ORCID nao mantem orientandos -- nao popula entidade `Orientacao` do M024 |
| Sem `ParticipacaoEvento` | ORCID nao indexa participacao em eventos cientificos |
| Sem `Idioma` | ORCID nao registra proficiencia em idiomas |
| `Qualis` indisponivel | Cross-reference Qualis CAPES feito separadamente (mesmo issue do Lattes) |
| Producao limitada a DOI | Obras sem DOI nao aparecem |

## Referencias

- [Discovery — ORCID](../../../../discovery/integracoes/orcid.md) -- visao de negocio, casos de uso, sequence diagrams
- [ORCID Public API](https://info.orcid.org/what-is-orcid/services/public-api/) -- documentacao oficial
- [ORCID API reference (v3.0)](https://github.com/ORCID/ORCID-Source/blob/main/orcid-api-web/tutorial/README.md)
- [Adapter Lattes](../lattes/README.md) -- adapter irmao da mesma familia
- [M024 — Modelo Estrutural](../../M024-curriculo-pesquisador/modelo-estrutural.md)
