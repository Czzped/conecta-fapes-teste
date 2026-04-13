# Modelo Estrutural

Dominio e regras de negocio: ver [README.md](README.md)

### Diagrama de Classes

```mermaid
classDiagram
    direction TB

    class DashboardIniciativa {
        +String projetoId
        +String titulo
        +StatusProjeto statusProjeto
        +Date dataInicio
        +Date dataFim
        +int relatoriosPendentes
        +int relatoriosSubmetidos
        +int solicitacoesPendentes
    }

    class RelatorioTecnico {
        +String codigo
        +String titulo
        +String periodoReferencia
        +String conteudo
        +Date dataSubmissao
        +EstadoRelatorio estado
    }

    class EstadoRelatorio {
        <<enumeration>>
        RASCUNHO
        SUBMETIDO
        EM_ANALISE
        APROVADO
        REPROVADO
        CONTESTADO
        EM_REANALISE
        APROVADO_FINAL
        REPROVADO_FINAL
    }

    class ParecerRelatorio {
        +Date dataAnalise
        +boolean aprovado
        +String justificativa
        +TipoParecer tipo
    }

    class TipoParecer {
        <<enumeration>>
        ANALISE_INICIAL
        REANALISE
    }

    class Contestacao {
        +String justificativa
        +Date dataContestacao
        +Date prazoLimite
    }

    class DocumentoContestacao {
        +String nome
        +String tipo
        +URL url
        +Date dataEnvio
    }

    class SolicitacaoAlteracao {
        +String codigo
        +TipoAlteracao tipo
        +String descricao
        +String justificativa
        +Date dataSolicitacao
        +EstadoSolicitacao estado
    }

    class TipoAlteracao {
        <<enumeration>>
        ESCOPO
        CRONOGRAMA
        EQUIPE
        ORCAMENTO
    }

    class EstadoSolicitacao {
        <<enumeration>>
        PENDENTE
        EM_ANALISE
        DEFERIDA
        INDEFERIDA
    }

    class DecisaoSolicitacao {
        +Date dataDecisao
        +boolean deferida
        +String justificativa
    }

    class Projeto {
        <<fora do escopo - M003>>
    }

    class Coordenador {
        <<fora do escopo - M003>>
    }

    class Edital {
        <<fora do escopo - M003>>
    }

    DashboardIniciativa "*" --> "1" Projeto : consolida dados de
    RelatorioTecnico "*" --> "1" Projeto : vinculado a
    RelatorioTecnico "*" --> "1" Coordenador : submetido por
    RelatorioTecnico "1" --> "*" ParecerRelatorio : pareceres
    RelatorioTecnico "1" --> "0..1" Contestacao : contestacao
    Contestacao "1" --> "*" DocumentoContestacao : documentos
    SolicitacaoAlteracao "*" --> "1" Projeto : referente a
    SolicitacaoAlteracao "*" --> "1" Coordenador : solicitada por
    SolicitacaoAlteracao "1" --> "0..1" DecisaoSolicitacao : decisao
    Projeto "*" --> "1" Edital : vinculado a
```

## Dicionario de Dados

| Classe | Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|--------|----------|-----------|--------|------|---------|---------|-------|
| **DashboardIniciativa** | projetoId | Identificador do projeto no dashboard | Sim | String | Ex: PRJ-2026-001 | | |
| | titulo | Titulo do projeto | Sim | String | | 300 | |
| | statusProjeto | Status atual do projeto | Sim | StatusProjeto | Ativo, Concluido, Cancelado | | |
| | dataInicio | Data de inicio do projeto | Sim | Date | | | |
| | dataFim | Data prevista de fim do projeto | Sim | Date | | | |
| | relatoriosPendentes | Quantidade de relatorios pendentes de submissao | Gerado | Int | | | |
| | relatoriosSubmetidos | Quantidade de relatorios ja submetidos | Gerado | Int | | | |
| | solicitacoesPendentes | Quantidade de solicitacoes de alteracao pendentes | Gerado | Int | | | |
| **RelatorioTecnico** | codigo | Codigo de identificacao unica do relatorio | Gerado | String | Ex: RT-2026-001 | | Sim |
| | titulo | Titulo do relatorio tecnico | Sim | String | | 300 | |
| | periodoReferencia | Periodo coberto pelo relatorio | Sim | String | Ex: Jan/2026 a Jun/2026 | 100 | |
| | conteudo | Conteudo textual do relatorio tecnico | Sim | String | | 10000 | |
| | dataSubmissao | Data em que o relatorio foi submetido | Gerado | Date | Preenchida ao submeter | | |
| | estado | Estado atual do relatorio no ciclo de vida | Gerado | EstadoRelatorio | Ver enumeracao | | |
| **ParecerRelatorio** | dataAnalise | Data em que o parecer foi emitido | Sim | Date | | | |
| | aprovado | Indica se o relatorio foi aprovado | Sim | Boolean | true/false | | |
| | justificativa | Justificativa do parecer | Sim | String | | 2000 | |
| | tipo | Tipo do parecer (analise inicial ou reanalise) | Sim | TipoParecer | Ver enumeracao | | |
| **Contestacao** | justificativa | Justificativa da contestacao pelo coordenador | Sim | String | | 3000 | |
| | dataContestacao | Data em que a contestacao foi registrada | Gerado | Date | | | |
| | prazoLimite | Data limite para registro da contestacao (15 dias apos notificacao) | Gerado | Date | | | |
| **DocumentoContestacao** | nome | Nome do documento complementar | Sim | String | | 200 | |
| | tipo | Tipo/categoria do documento | Sim | String | | 100 | |
| | url | URL de acesso ao documento armazenado | Sim | URL | | | |
| | dataEnvio | Data de envio do documento | Sim | Date | | | |
| **SolicitacaoAlteracao** | codigo | Codigo de identificacao da solicitacao | Gerado | String | Ex: SA-2026-001 | | Sim |
| | tipo | Tipo de alteracao solicitada | Sim | TipoAlteracao | Ver enumeracao | | |
| | descricao | Descricao da alteracao pretendida | Sim | String | | 3000 | |
| | justificativa | Justificativa para a alteracao | Sim | String | | 3000 | |
| | dataSolicitacao | Data em que a solicitacao foi registrada | Gerado | Date | | | |
| | estado | Estado atual da solicitacao | Gerado | EstadoSolicitacao | Ver enumeracao | | |
| **DecisaoSolicitacao** | dataDecisao | Data em que a decisao foi registrada | Sim | Date | | | |
| | deferida | Indica se a solicitacao foi deferida | Sim | Boolean | true/false | | |
| | justificativa | Justificativa da decisao | Sim | String | | 2000 | |

## Notas de Implementacao

**Entidades externas:**
- Projeto, Coordenador, Edital: gerenciados por M002/M003 (Importacao e Gerenciamento de Editais)

**Navegabilidade:**
- Cardinalidade 1: atributo do tipo da classe destino (ex: RelatorioTecnico.projeto: Projeto)
- Cardinalidade N: atributo lista do tipo da classe destino (ex: RelatorioTecnico.pareceres: List&lt;ParecerRelatorio&gt;)
