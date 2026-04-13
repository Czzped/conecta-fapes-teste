# Modelo Estrutural

Dominio e regras de negocio: ver [README.md](README.md)

### Diagrama de Classes

```mermaid
classDiagram
    direction TB

    class Edital {
        <<fora do escopo - M003>>
    }

    class Programa {
        <<fora do escopo - M010>>
    }

    class Parceria {
        <<fora do escopo - M010>>
    }

    class Cronograma {
        +String descricao
    }

    class PeriodoCronograma {
        +String nome
        +TipoPeriodo tipo
        +Date dataInicio
        +Date dataFim
    }

    class TipoPeriodo {
        <<enumeration>>
        SUBMISSAO
        AVALIACAO_MERITO
        RESULTADO_PRELIMINAR
        RECURSO
        RESULTADO_FINAL
        CONTRATACAO
    }

    class FormularioSubmissao {
        +String titulo
        +String descricao
        +int versao
        +boolean ativo
        +Date dataCriacao
    }

    class FormularioAvaliacao {
        +String titulo
        +String descricao
        +int versao
        +boolean ativo
        +Date dataCriacao
    }

    class VersaoFormulario {
        +int numeroVersao
        +Date dataCriacao
        +String conteudo
        +boolean publicado
    }

    class RevisorAdHoc {
        +String nome
        +String cpf
        +String email
        +String instituicao
        +String areaAtuacao
        +String titulacao
    }

    class ParametroFomento {
        +double orcamentoTotal
        +double valorMaximoProjeto
        +int quantidadeMaximaProjetos
        +double valorParceria
    }

    class CotaArea {
        +String areaConhecimento
        +double valorAlocado
        +int quantidadeVagas
    }

    Edital "1" --> "1" Cronograma : configurado por
    Edital "1" --> "0..1" Programa : vinculado a programa
    Edital "1" --> "0..1" FormularioSubmissao : formulario de submissao
    Edital "1" --> "0..1" FormularioAvaliacao : formulario de avaliacao
    Edital "1" --> "1" ParametroFomento : parametros
    Edital "1" --> "*" RevisorAdHoc : revisores associados
    ParametroFomento "1" --> "0..1" Parceria : parceria financeira
    Cronograma "1" --> "*" PeriodoCronograma : periodos
    FormularioSubmissao "1" --> "*" VersaoFormulario : versoes
    FormularioAvaliacao "1" --> "*" VersaoFormulario : versoes
    ParametroFomento "1" --> "*" CotaArea : cotas por area
```

## Dicionario de Dados

| Classe | Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|--------|----------|-----------|--------|------|---------|---------|-------|
| **Cronograma** | descricao | Descricao geral do cronograma | Sim | String | | 500 | |
| **PeriodoCronograma** | nome | Nome descritivo do periodo | Sim | String | Ex: Periodo de Submissao | 200 | |
| | tipo | Tipo do periodo no fluxo do edital | Sim | TipoPeriodo | Ver enumeracao | | |
| | dataInicio | Data de inicio do periodo | Sim | Date | | | |
| | dataFim | Data de fim do periodo | Sim | Date | | | |
| **FormularioSubmissao** | titulo | Titulo do formulario | Sim | String | | 200 | |
| | descricao | Descricao do proposito do formulario | Sim | String | | 1000 | |
| | versao | Numero da versao ativa | Gerado | Int | | | |
| | ativo | Indica se o formulario esta ativo no edital | Sim | Boolean | true/false | | |
| | dataCriacao | Data de criacao do formulario | Gerado | Date | | | |
| **FormularioAvaliacao** | titulo | Titulo do formulario de avaliacao | Sim | String | | 200 | |
| | descricao | Descricao do proposito do formulario | Sim | String | | 1000 | |
| | versao | Numero da versao ativa | Gerado | Int | | | |
| | ativo | Indica se o formulario esta ativo no edital | Sim | Boolean | true/false | | |
| | dataCriacao | Data de criacao do formulario | Gerado | Date | | | |
| **VersaoFormulario** | numeroVersao | Numero sequencial da versao | Gerado | Int | Ex: 1, 2, 3 | | |
| | dataCriacao | Data de criacao da versao | Gerado | Date | | | |
| | conteudo | Definicao dos campos e estrutura do formulario | Sim | String | JSON com campos | | |
| | publicado | Indica se a versao foi publicada (nao editavel) | Sim | Boolean | true/false | | |
| **RevisorAdHoc** | nome | Nome completo do revisor | Sim | String | | 200 | |
| | cpf | CPF do revisor | Sim | String | Ex: 123.456.789-00 | 14 | Sim |
| | email | E-mail de contato do revisor | Sim | String | | 200 | |
| | instituicao | Instituicao de vinculo do revisor | Sim | String | | 200 | |
| | areaAtuacao | Area de conhecimento do revisor | Sim | String | | 200 | |
| | titulacao | Titulacao academica do revisor | Sim | String | Ex: Doutor, Mestre | 100 | |
| **ParametroFomento** | orcamentoTotal | Orcamento total do edital | Sim | Double | Ex: 5000000.00 | | |
| | valorMaximoProjeto | Valor maximo por projeto | Sim | Double | | | |
| | quantidadeMaximaProjetos | Numero maximo de projetos financiaveis | Sim | Int | | | |
| | valorParceria | Valor da parceria destinado ao edital, quando houver | Nao | Double | | | |
| **CotaArea** | areaConhecimento | Nome da area de conhecimento | Sim | String | Ex: Ciencias Exatas | 200 | |
| | valorAlocado | Valor alocado para a area | Sim | Double | | | |
| | quantidadeVagas | Numero de vagas disponiveis para a area | Sim | Int | | | |

## Notas de Implementacao

**Entidades externas:**
- Edital: gerenciado por M003 (Gerenciar Editais). O modulo M011 apenas configura cronograma, formularios, revisores e parametros do edital.
- Programa e Parceria: gerenciados por M010 (Planejamento e Estrategia). Podem ser associados ao edital durante a configuracao.

**Navegabilidade:**
- Cardinalidade 1: atributo do tipo da classe destino (ex: Edital.cronograma: Cronograma)
- Cardinalidade N: atributo lista do tipo da classe destino (ex: Cronograma.periodos: List<PeriodoCronograma>)
