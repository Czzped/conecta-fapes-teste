# Modelo Estrutural

Dominio e regras de negocio: ver [README.md](README.md)

### Diagrama de Classes

```mermaid
classDiagram
    direction TB

    class SolicitacaoSuspensao {
        +String codigo
        +OrigemSuspensao origem
        +String justificativa
        +Date dataSolicitacao
        +Date dataAprovacao
        +EstadoSolicitacaoSuspensao estado
    }

    class OrigemSuspensao {
        <<enumeration>>
        COORDENADOR
        FAPES
    }

    class EstadoSolicitacaoSuspensao {
        <<enumeration>>
        SUBMETIDA
        EM_ANALISE
        APROVADA
        REJEITADA
    }

    class SolicitacaoFinalizacao {
        +String codigo
        +MotivoFinalizacao motivo
        +String justificativa
        +Date dataSolicitacao
        +EstadoSolicitacaoFinalizacao estado
    }

    class MotivoFinalizacao {
        <<enumeration>>
        CONCLUSAO_NATURAL
        DECISAO_COORDENADOR
        DETERMINACAO_FAPES
    }

    class EstadoSolicitacaoFinalizacao {
        <<enumeration>>
        SUBMETIDA
        VERIFICANDO_PENDENCIAS
        PENDENCIAS_RESOLVIDAS
        PENDENCIAS_PENDENTES
        ENCERRADA
    }

    class VerificacaoPendencia {
        +TipoPendencia tipo
        +String descricao
        +boolean resolvida
        +Date dataVerificacao
    }

    class TipoPendencia {
        <<enumeration>>
        PRESTACAO_CONTAS_PENDENTE
        BOLSA_ATIVA
        PAGAMENTO_PENDENTE
        DOCUMENTO_PENDENTE
    }

    class ParecerSuspensao {
        +Date dataAnalise
        +boolean aprovado
        +String justificativa
        +String analistaResponsavel
    }

    class HistoricoProjetoSF {
        +Date data
        +TipoEventoSF tipo
        +String descricao
    }

    class TipoEventoSF {
        <<enumeration>>
        SOLICITACAO_SUSPENSAO
        APROVACAO_SUSPENSAO
        REJEICAO_SUSPENSAO
        SUSPENSAO_EFETIVADA
        REATIVACAO
        SOLICITACAO_ENCERRAMENTO
        VERIFICACAO_PENDENCIAS
        ENCERRAMENTO_EFETIVADO
    }

    class Projeto {
        <<fora do escopo - M003>>
    }

    class BolsaPesquisa {
        <<fora do escopo - M009>>
    }

    class PrestacaoContas {
        <<fora do escopo - M014>>
    }

    SolicitacaoSuspensao "*" --> "1" Projeto : vinculada a
    SolicitacaoSuspensao "1" --> "0..1" ParecerSuspensao : parecer
    SolicitacaoFinalizacao "*" --> "1" Projeto : vinculada a
    SolicitacaoFinalizacao "1" --> "*" VerificacaoPendencia : pendencias verificadas
    Projeto "1" --> "*" HistoricoProjetoSF : historico suspensao/finalizacao
    Projeto "1" --> "*" BolsaPesquisa : bolsas do projeto
    Projeto "1" --> "*" PrestacaoContas : prestacoes do projeto
```

## Dicionario de Dados

| Classe | Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|--------|----------|-----------|--------|------|---------|---------|-------|
| **SolicitacaoSuspensao** | codigo | Codigo de identificacao unica da solicitacao | Gerado | String | Ex: SS-2026-001 | | Sim |
| | origem | Indica se a suspensao foi solicitada pelo coordenador ou pela FAPES | Sim | OrigemSuspensao | Ver enumeracao | | |
| | justificativa | Justificativa para a suspensao | Sim | String | | 2000 | |
| | dataSolicitacao | Data em que a solicitacao foi registrada | Gerado | Date | | | |
| | dataAprovacao | Data em que a suspensao foi aprovada | Cond. | Date | Preenchida ao aprovar | | |
| | estado | Estado atual da solicitacao | Gerado | EstadoSolicitacaoSuspensao | Ver enumeracao | | |
| **SolicitacaoFinalizacao** | codigo | Codigo de identificacao unica da solicitacao de encerramento | Gerado | String | Ex: SF-2026-001 | | Sim |
| | motivo | Motivo do encerramento do projeto | Sim | MotivoFinalizacao | Ver enumeracao | | |
| | justificativa | Justificativa detalhada para o encerramento | Sim | String | | 2000 | |
| | dataSolicitacao | Data em que a solicitacao foi registrada | Gerado | Date | | | |
| | estado | Estado atual da solicitacao de encerramento | Gerado | EstadoSolicitacaoFinalizacao | Ver enumeracao | | |
| **VerificacaoPendencia** | tipo | Tipo de pendencia verificada | Sim | TipoPendencia | Ver enumeracao | | |
| | descricao | Descricao da pendencia encontrada | Sim | String | Ex: PC do periodo 2025-S2 nao submetida | 500 | |
| | resolvida | Indica se a pendencia foi resolvida | Gerado | Boolean | true/false | | |
| | dataVerificacao | Data da verificacao | Gerado | Date | | | |
| **ParecerSuspensao** | dataAnalise | Data em que o parecer foi emitido | Sim | Date | | | |
| | aprovado | Indica se a suspensao foi aprovada | Sim | Boolean | true/false | | |
| | justificativa | Justificativa do parecer | Sim | String | | 1000 | |
| | analistaResponsavel | Nome do analista que emitiu o parecer | Sim | String | | 200 | |
| **HistoricoProjetoSF** | data | Data do evento | Gerado | Date | | | |
| | tipo | Tipo do evento registrado | Sim | TipoEventoSF | Ver enumeracao | | |
| | descricao | Descricao textual do evento | Sim | String | | 500 | |

## Notas de Implementacao

**Entidades externas:**
- Projeto: gerenciado por M002/M003 (Importacao e Gerenciamento de Editais)
- BolsaPesquisa: gerenciada por M009 (Gestao Bolsa Pesquisa)
- PrestacaoContas: gerenciada por M014 (Prestacao de Contas)

**Navegabilidade:**
- Cardinalidade 1: atributo do tipo da classe destino (ex: SolicitacaoSuspensao.projeto: Projeto)
- Cardinalidade N: atributo lista do tipo da classe destino (ex: SolicitacaoFinalizacao.pendencias: List&lt;VerificacaoPendencia&gt;)
