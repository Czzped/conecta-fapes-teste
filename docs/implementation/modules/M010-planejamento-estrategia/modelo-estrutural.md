# Modelo Estrutural

Dominio e regras de negocio: ver [README.md](README.md)

### Diagrama de Classes

```mermaid
classDiagram
    direction TB

    class PlanoEstrategico {
        +String nome
        +String descricao
        +Date dataInicio
        +Date dataFim
        +boolean ativo
    }

    class EixoEstrategico {
        +String nome
        +String descricao
        +int prioridade
    }

    class Programa {
        +String codigo
        +String nome
        +String instituicaoDemandante
        +String resumo
        +String riscosRestricoes
        +String enquadramentoRepasse
        +Date dataInicio
        +Date dataFim
        +EstadoPrograma estado
    }

    class EstadoPrograma {
        <<enumeration>>
        EM_PLANEJAMENTO
        ATIVO
        SUSPENSO
        ENCERRADO
    }

    class ComiteGestor {
        +String nome
        +String descricao
    }

    class MembroComite {
        +PapelMembro papel
        +Date dataInicio
        +Date dataFim
        +boolean ativo
    }

    class PapelMembro {
        <<enumeration>>
        PRESIDENTE
        MEMBRO
        SUPLENTE
    }

    class RecursoPrograma {
        +String origemRecurso
        +String instituicaoOrigem
        +double valor
        +Date dataAporte
        +String documentoDescentralizacao
    }

    class Parceria {
        +String codigo
        +String nome
        +String area
        +String numeroProcesso
        +Date dataAssinatura
        +Date dataInicioVigencia
        +Date dataFimVigencia
        +String objetivo
        +String coordenadorNome
        +String coordenadorEmail
        +String coordenadorCelular
        +String pontoFocalInterno
        +String gerenciaResponsavel
        +EstadoParceria estado
    }

    class EstadoParceria {
        <<enumeration>>
        EM_NEGOCIACAO
        VIGENTE
        SUSPENSA
        ENCERRADA
    }

    class EntidadeParceira {
        +String nome
        +String cnpj
        +String representante
        +double valorInvestido
    }

    class AporteFinanceiro {
        +double valor
        +Date dataAporte
        +Date dataRegistro
        +String documentoDescentralizacao
        +String descricao
    }

    class Aditivo {
        +TipoAditivo tipo
        +String justificativa
        +URL documentoComprobatorio
        +Date dataRegistro
    }

    class TipoAditivo {
        <<enumeration>>
        TEMPO
        APORTE
    }

    class AditivoTempo {
        +Date novaDataFim
    }

    class AditivoAporte {
        +double valorAdicional
    }

    class AportePrograma {
        +double percentual
        +double valorCalculado
        +Date dataVinculacao
    }

    class BeneficioPrograma {
        +String descricao
    }

    class ResultadoPrograma {
        +String descricao
    }

    class DocumentoParceria {
        +String nome
        +String tipo
        +Date dataReferencia
    }

    class PessoaFisica {
        <<fora do escopo - M008>>
    }

    class Instituicao {
        <<fora do escopo - M008>>
    }

    PlanoEstrategico "1" --> "*" EixoEstrategico : possui eixos
    EixoEstrategico "*" --> "*" Programa : orienta programas
    Programa "1" --> "0..1" ComiteGestor : comite gestor
    ComiteGestor "1" --> "*" MembroComite : membros
    MembroComite "*" --> "1" PessoaFisica : pessoa
    Programa "1" --> "*" RecursoPrograma : recursos
    Programa "*" --> "0..1" Parceria : parceria de referencia
    Programa "1" --> "*" BeneficioPrograma : beneficios
    Programa "1" --> "*" ResultadoPrograma : resultados
    Parceria "1" --> "*" EntidadeParceira : parceiros
    EntidadeParceira "*" --> "1" Instituicao : instituicao
    Parceria "1" --> "*" AporteFinanceiro : aportes
    Parceria "1" --> "*" DocumentoParceria : documentos
    Parceria "1" --> "*" Programa : programas relacionados
    AporteFinanceiro "*" --> "1" EntidadeParceira : aportado por
    Parceria "1" --> "*" Aditivo : aditivos
    Aditivo <|-- AditivoTempo
    Aditivo <|-- AditivoAporte
    Parceria "1" --> "*" AportePrograma : aportes ao programa
    AportePrograma "*" --> "1" AporteFinanceiro : origem
```

## Dicionario de Dados

| Classe | Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|--------|----------|-----------|--------|------|---------|---------|-------|
| **PlanoEstrategico** | nome | Nome do plano estrategico | Sim | String | Ex: Plano Estrategico 2024-2027 | 300 | Sim |
| | descricao | Descricao dos objetivos do plano | Sim | String | | 2000 | |
| | dataInicio | Data de inicio da vigencia do plano | Sim | Date | | | |
| | dataFim | Data de fim da vigencia do plano | Sim | Date | | | |
| | ativo | Indica se o plano esta ativo | Sim | Boolean | true/false | | |
| **EixoEstrategico** | nome | Nome do eixo estrategico | Sim | String | Ex: Formacao de Recursos Humanos | 300 | |
| | descricao | Descricao do escopo e objetivos do eixo | Sim | String | | 2000 | |
| | prioridade | Ordem de prioridade do eixo no plano | Sim | Int | Ex: 1, 2, 3 | | |
| **Programa** | codigo | Codigo de identificacao do programa | Gerado | String | Ex: PRG-2025-001 | | Sim |
| | nome | Nome do programa de fomento | Sim | String | Ex: Programa de Bolsas de Pesquisa | 300 | |
| | instituicaoDemandante | Instituicao que demanda ou patrocina a criacao do programa | Sim | String | Ex: Secretaria de Ciencia e Tecnologia | 300 | |
| | resumo | Resumo do programa, sua justificativa e objetivo geral | Sim | String | | 2000 | |
| | riscosRestricoes | Riscos e restricoes para a viabilidade tecnica do programa | Nao | String | | 2000 | |
| | enquadramentoRepasse | Regras de enquadramento dos projetos e forma de repasse dos recursos | Nao | String | | 2000 | |
| | dataInicio | Data de inicio do programa | Sim | Date | | | |
| | dataFim | Data de fim do programa | Sim | Date | | | |
| | estado | Estado atual do programa | Gerado | EstadoPrograma | Ver enumeracao | | |
| **ComiteGestor** | nome | Nome do comite | Sim | String | Ex: Comite Gestor do PRG-2025-001 | 300 | |
| | descricao | Descricao das atribuicoes do comite | Nao | String | | 1000 | |
| **MembroComite** | papel | Papel do membro no comite | Sim | PapelMembro | Presidente, Membro, Suplente | | |
| | dataInicio | Data de inicio da participacao | Sim | Date | | | |
| | dataFim | Data de fim da participacao | Nao | Date | | | |
| | ativo | Indica se o membro esta ativo no comite | Gerado | Boolean | true/false | | |
| **RecursoPrograma** | origemRecurso | Origem do recurso do programa | Sim | String | Ex: LOA, LDO, PPA, Parceria | 200 | |
| | instituicaoOrigem | Instituicao de origem do recurso, quando aplicavel | Nao | String | Ex: CNPQ, UFES | 300 | |
| | valor | Valor registrado para o programa | Sim | Double | | | |
| | dataAporte | Data do aporte ou liberacao do recurso | Sim | Date | | | |
| | documentoDescentralizacao | Documento que formaliza a disponibilizacao do recurso | Nao | String | Ex: DES-2026-001 | 100 | |
| **Parceria** | codigo | Codigo de identificacao da parceria | Gerado | String | Ex: PRC-2025-001 | | Sim |
| | nome | Nome da parceria | Sim | String | Ex: Parceria Pesquisa em Saude 2026 | 300 | |
| | area | Area tematica predominante da parceria | Sim | String | Ex: Pesquisa, Inovacao | 200 | |
| | numeroProcesso | Numero do processo administrativo da parceria | Sim | String | Ex: PRC-2026-001 | 100 | Sim |
| | dataAssinatura | Data da assinatura do instrumento da parceria | Sim | Date | | | |
| | dataInicioVigencia | Data de inicio da vigencia | Sim | Date | | | |
| | dataFimVigencia | Data de fim da vigencia | Sim | Date | | | |
| | objetivo | Objetivo geral da parceria | Sim | String | | 2000 | |
| | coordenadorNome | Nome do coordenador responsavel pela parceria | Sim | String | | 300 | |
| | coordenadorEmail | E-mail do coordenador da parceria | Sim | String | | 200 | |
| | coordenadorCelular | Celular do coordenador da parceria | Nao | String | | 20 | |
| | pontoFocalInterno | Ponto focal interno da agencia de fomento | Sim | String | | 300 | |
| | gerenciaResponsavel | Gerencia responsavel pela parceria | Sim | String | Ex: GECAP | 100 | |
| | estado | Estado atual da parceria | Gerado | EstadoParceria | Ver enumeracao | | |
| **EntidadeParceira** | nome | Nome da entidade parceira | Sim | String | | 300 | |
| | cnpj | CNPJ da entidade | Sim | String | | 14 | |
| | representante | Nome do representante legal | Sim | String | | 300 | |
| | valorInvestido | Valor comprometido pela instituicao parceira | Nao | Double | | | |
| **AporteFinanceiro** | valor | Valor do aporte financeiro | Sim | Double | | | |
| | dataAporte | Data de realizacao do aporte | Sim | Date | | | |
| | dataRegistro | Data do registro do aporte | Gerado | Date | | | |
| | documentoDescentralizacao | Documento que formaliza o aporte | Nao | String | Ex: DES-2026-001 | 100 | |
| | descricao | Descricao do aporte | Nao | String | | 500 | |
| **Aditivo** | tipo | Tipo do aditivo | Sim | TipoAditivo | Tempo, Aporte | | |
| | justificativa | Justificativa para o aditivo | Sim | String | | 2000 | |
| | documentoComprobatorio | URL do documento comprobatorio anexado | Sim | URL | | | |
| | dataRegistro | Data do registro do aditivo | Gerado | Date | | | |
| **AditivoTempo** | novaDataFim | Nova data de fim da vigencia | Sim | Date | | | |
| **AditivoAporte** | valorAdicional | Valor financeiro adicional | Sim | Double | | | |
| **AportePrograma** | percentual | Percentual do aporte alocado ao programa | Sim | Double | Ex: 50.0 (50%) | | |
| | valorCalculado | Valor calculado com base no percentual | Gerado | Double | | | |
| | dataVinculacao | Data da vinculacao do aporte ao programa | Gerado | Date | | | |
| **BeneficioPrograma** | descricao | Beneficio esperado com a execucao do programa | Sim | String | | 1000 | |
| **ResultadoPrograma** | descricao | Resultado esperado com a execucao do programa | Sim | String | | 1000 | |
| **DocumentoParceria** | nome | Nome do documento ou formulario relacionado a parceria | Sim | String | Ex: Termo de Cooperacao | 300 | |
| | tipo | Tipo do documento relacionado | Sim | String | Ex: PDF, Monitoramento | 100 | |
| | dataReferencia | Data de referencia do documento | Nao | Date | | | |

## Notas de Implementacao

**Entidades externas:**
- PessoaFisica: gerenciado por M008 (Cadastros Corporativos). Membros do comite gestor sao pessoas fisicas.
- Instituicao: gerenciado por M008 (Cadastros Corporativos). Entidades parceiras referenciam instituicoes cadastradas.

**Heranca:**
- Aditivo e uma classe abstrata com duas especializacoes: AditivoTempo e AditivoAporte. O tipo do aditivo define qual especializacao e utilizada.

**Navegabilidade:**
- Cardinalidade 1: atributo do tipo da classe destino (ex: Programa.comiteGestor: ComiteGestor)
- Cardinalidade N: atributo lista do tipo da classe destino (ex: Parceria.aportes: List&lt;AporteFinanceiro&gt;)
