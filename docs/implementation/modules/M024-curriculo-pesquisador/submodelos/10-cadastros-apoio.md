# Submodelo 10 — Cadastros de Apoio e Referencias

[← Modelo Estrutural](../modelo-estrutural.md) | [M024](../README.md)

## Escopo

Consolida tres tipos de dependencia estrutural usadas por mais de um submodelo:

- cadastros locais mantidos em M024 (`Periodico`, `NivelOrientacao`, `TipoProjeto`);
- entidades compartilhaveis do proprio dominio (`Artigo`, `Projeto`);
- referencias canonicas externas mantidas em M008 (`PessoaFisica`, `Instituicao`, `AreaConhecimento`, `Cidade`).

## Diagrama

```mermaid
classDiagram
    direction LR

    class Periodico {
        +String nome
        +String issn
        +String qualis
    }

    class NivelOrientacao {
        +String codigo
        +String nome
        +String descricao
    }

    class TipoProjeto {
        +String codigo
        +String nome
        +String descricao
    }

    class PessoaFisica {
        << M008 >>
    }

    class Instituicao {
        << M008 >>
    }

    class AreaConhecimento {
        << M008 §1.3.6 >>
    }

    class Cidade {
        << M008 §1.3.4 >>
    }
```

## Dicionario de Dados

| Classe | Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|--------|----------|-----------|--------|------|---------|---------|-------|
| **Periodico** | nome | Nome do periodico ou anais de conferencia | Sim | String | | 300 | Nao |
| | issn | Identificador internacional do periodico | Nao | String | ISSN quando disponivel | 20 | Sim |
| | qualis | Estrato Qualis CAPES do periodico | Nao | String | A1, A2, A3, A4, B1, B2, B3, B4, C | 5 | Nao |
| **NivelOrientacao** | codigo | Codigo canonico do nivel de orientacao | Sim | String | IC, M, D, PD | 5 | Sim |
| | nome | Nome do nivel de orientacao | Sim | String | | 100 | Nao |
| | descricao | Descricao do nivel de orientacao | Nao | String | | 500 | Nao |
| **TipoProjeto** | codigo | Codigo canonico do tipo de projeto | Sim | String | PESQUISA, EXTENSAO, DESENVOLVIMENTO, ENSINO, OUTRO | 20 | Sim |
| | nome | Nome do tipo de projeto | Sim | String | | 100 | Nao |
| | descricao | Descricao do tipo de projeto | Nao | String | | 500 | Nao |

## Cadastros Locais M024

| Entidade | Usado por | Observacao |
|----------|-----------|------------|
| `Periodico` | [Artigos](03-artigos.md) | Cadastro compartilhado, deduplicado por `issn` ou nome normalizado |
| `NivelOrientacao` | [Orientacoes](05-orientacoes.md) | Valores iniciais: IC, M, D, PD |
| `TipoProjeto` | [Projetos](06-projetos.md) | Valores iniciais: PESQUISA, EXTENSAO, DESENVOLVIMENTO, ENSINO, OUTRO |

## Entidades Compartilhaveis M024

| Entidade | Usado por | Observacao |
|----------|-----------|------------|
| `Artigo` | [Artigos](03-artigos.md) | Pode aparecer em mais de um curriculo; deduplicado por `doi` ou `(titulo, ano, periodico)` |
| `Projeto` | [Projetos](06-projetos.md) | Pode aparecer em mais de um curriculo por meio de `ParticipacaoProjeto` |

## Referencias Canonicas M008

| Entidade | Usado por | Observacao |
|----------|-----------|------------|
| `PessoaFisica` | Curriculo, Artigos, Orientacoes, Projetos | Titular do curriculo, autores de artigos, orientandos e participantes de projetos |
| `Instituicao` | Formacao, Livros, Orientacoes, Projetos, Premios | Associada por M024 durante a persistencia do snapshot; nomes sem correspondencia seguem politica de reconciliacao/match-or-create de M008 |
| `AreaConhecimento` | Curriculo, Formacao | Cadastro canonico CNPq |
| `Cidade` | Eventos | Local de evento quando inferivel |

## Regras

- Cadastros locais e producoes compartilhadas do M024 nao sao apagados por reimportacao de curriculo quando ainda estiverem referenciados.
- Entidades filhas compostas pelo `Curriculo` sao apagadas e recriadas na reimportacao; referencias e vinculos compartilhados sao reconciliados.
- Areas CNPq sem correspondencia geram `AreaConhecimentoNaoMapeada` e nao bloqueiam a sincronizacao.
