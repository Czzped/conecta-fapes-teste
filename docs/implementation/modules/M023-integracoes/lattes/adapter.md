# Adapter Lattes — Mapeamento e contrato interno

[← Voltar ao Adapter Lattes](README.md) | [M023](../README.md) | [Discovery Lattes](../../../../discovery/integracoes/lattes.md)

> **Modelo de execucao: sincrono.** Comandos invocados por M024 bloqueiam ate concluir (sucesso ou erro). Sem polling, sem eventos assincronos, sem agregado de sincronizacao persistido. Erros sao propagados em-linha como excecao tipada.

## Comandos genericos atendidos pelo adapter

| Comando | Acao | Retorno |
|---------|------|---------|
| `ImportarCurriculo(numeroLattes)` | Busca curriculo na fonte, parseia, extrai `dataAtualizacaoLattes` (data informada pelo CNPq), mapeia para entidades M024, persiste com `versao = 1`, atualiza `Curriculo.dataUltimaSincronizacao` | `ImportacaoCurriculoResult { numeroLattes, versao, dataSincronizacao, dataAtualizacaoLattes, contagens, areasNaoMapeadas[] }` ou excecao tipada |
| `SincronizarCurriculo(numeroLattes)` | Reimport completo -- apaga entidades filhas anteriores (RN-M024-03) e recria com snapshot atual. Incrementa `versao` | Mesmo DTO de `ImportarCurriculo` ou excecao |

### Excecoes (categorias de erro)

| Tipo | Quando | Acao do caller (M024) |
|------|--------|------------------------|
| `LattesTecnicoException` | Timeout, falha de rede, 5xx do wrapper | Apos esgotar retries internos (3 tentativas, backoff exponencial), propaga ao caller -- M024 traduz para HTTP `502 ADAPTER_LATTES_FALHOU` com `categoriaErro = Tecnico` |
| `LattesPermissaoException` | 401/403 do wrapper, captcha CNPq | Sem retry. Propaga -- HTTP `502` com `categoriaErro = Permissao` |
| `LattesParseException` | XML malformado, campo obrigatorio ausente, schema mismatch | Sem retry. Arquiva XML bruto para auditoria. Propaga -- HTTP `502` com `categoriaErro = ParseError` |
| `LattesFonteIndisponivelException` | CNPq fora do ar, wrapper retornando erro consistente | Propaga -- HTTP `502` com `categoriaErro = FonteIndisponivel` |
| `LattesAreaNaoMapeadaException` | **Nao e erro.** Areas nao mapeadas viram itens em `areasNaoMapeadas[]` do DTO de sucesso. M024 publica `AreaConhecimentoNaoMapeada` para cada item | -- |

Snapshot anterior (entidades filhas) permanece intacto enquanto a sincronizacao nao retorna sucesso. Adapter so persiste apos parse completo bem-sucedido (escrita atomica).

## Fontes de dados suportadas (parametrizavel)

Adapter e desacoplado da fonte. Configuracao em runtime escolhe:

| Fonte | Modo | Parser |
|-------|------|--------|
| `XML_UPLOAD` | Upload manual de XML do CNPq pelo pesquisador | Parser XML Lattes (XSD canonico CNPq) |
| `WRAPPER_API` | Wrapper externo (ScriptLattes, BrCris) via HTTP | Parser JSON do wrapper |
| `ORCID_OPENALEX` | Producao bibliografica via ORCID + OpenAlex | Parser JSON ORCID/OpenAlex (apenas Artigos/Livros) |

Decisao final entre fontes esta na [pendencia critica 1 do discovery Lattes](../../../../discovery/integracoes/lattes.md#pendencias-de-discovery).

## Mapeamento Lattes → entidades M024

| Elemento Lattes (XML/JSON) | Entidade M024 | Notas |
|----------------------------|---------------|-------|
| `<FORMACAO-ACADEMICA-TITULACAO>` | `FormacaoAcademica` | Tipo (graduacao/mestrado/doutorado/pos-doc) → enum `NivelFormacao` |
| `<ARTIGO-PUBLICADO>` em `<DETALHAMENTO-DO-ARTIGO>` | `Artigo` | DOI extraido de `<DOI>`; periodico vira referencia para `Periodico` (match-or-create por ISSN); Qualis exige cross-reference externa |
| `<LIVRO-PUBLICADO>` ou `<CAPITULO-DE-LIVRO>` | `Livro` | `tipo` = `Livro` ou `Capitulo`; editora vira referencia para `Instituicao` |
| `<ORIENTACAO-EM-ANDAMENTO>` e `<ORIENTACAO-CONCLUIDA>` | `Orientacao` | `status` = `EmAndamento` ou `Concluida`; nivel mapeado para `NivelOrientacao` (cadastro M024); orientando vira referencia para `PessoaFisica` (match-or-create) |
| `<PROJETO-DE-PESQUISA>` | `Projeto` | `papel` derivado de `<INTEGRANTES-DO-PROJETO>` (Coordenador/Membro); tipo mapeado para `TipoProjeto` (cadastro M024); financiador vira referencia para `Instituicao` |
| `<PREMIO-TITULO>` | `Premio` | Entidade que conferiu vira referencia para `Instituicao` |
| `<PARTICIPACAO-EM-EVENTO>` (Congresso, Simposio, Encontro, etc) | `ParticipacaoEvento` | Papel mapeado; local vira referencia opcional para `Cidade` (M008) |
| `<IDIOMA>` | `Idioma` | Niveis traduzidos para enum `NivelProficienciaIdioma` |
| `<AREA-DO-CONHECIMENTO>` (formacao/projeto/atuacao) | `AreaConhecimento` (referencia M008 §1.3.6) | Cross-reference contra cadastro canonico CNPq; nao mapeadas viram itens em `areasNaoMapeadas[]` do DTO de retorno |

## DTO de retorno

```json
{
  "numeroLattes": "1234567890123456",
  "versao": 5,
  "dataSincronizacao": "2026-05-11T14:32:42Z",
  "dataAtualizacaoLattes": "2026-05-03",
  "contagens": {
    "formacoes": 3,
    "artigos": 27,
    "livros": 4,
    "orientacoes": 12,
    "projetos": 8,
    "premios": 2,
    "eventos": 18,
    "idiomas": 3,
    "areasDeAtuacao": 2
  },
  "areasNaoMapeadas": [
    { "areaLattesString": "Computacao Quantica Aplicada" }
  ]
}
```

## Idempotencia

- Reimportacao apaga entidades filhas anteriores antes de inserir o snapshot atual (RN-M024-03). Operacao e atomica por chamada.
- Falha durante o processo (excecao tipada) deixa o snapshot anterior intacto -- adapter nao faz commit parcial.
- Re-execucao apos falha simplesmente refaz a chamada. Sem estado de "sincronizacao em andamento" a recuperar.

## Configuracao

| Parametro | Valor padrao | Descricao |
|-----------|--------------|-----------|
| `lattes.adapter.fonte` | `XML_UPLOAD` | Fonte ativa: `XML_UPLOAD`, `WRAPPER_API`, `ORCID_OPENALEX` |
| `lattes.adapter.wrapper.baseUrl` | (vazio) | URL base do wrapper quando `WRAPPER_API` |
| `lattes.adapter.wrapper.apiKey` | (vazio, vault) | Credencial do wrapper |
| `lattes.adapter.timeoutSegundos` | 60 | Timeout por chamada a fonte externa |
| `lattes.adapter.retries.tecnico` | 3 | Tentativas para erros tecnicos com backoff exponencial |

## Referencias

- [Discovery — Lattes](../../../../discovery/integracoes/lattes.md) — visao de negocio, pendencias, sequence diagrams
- [M024 — Modelo Estrutural](../../M024-curriculo-pesquisador/modelo-estrutural.md) — entidades alimentadas pelo adapter
- [M024 — Eventos de Dominio](../../M024-curriculo-pesquisador/eventos-dominio.md) — eventos publicados por M024 apos sincronizacao
- [Documentacao XML do curriculo Lattes](http://memoria.cnpq.br/lattes/conteudo/cnpq_extra_2017.htm)
- [ORCID API](https://info.orcid.org/documentation/) — caso fonte alternativa
- [OpenAlex API](https://docs.openalex.org/) — caso fonte alternativa
