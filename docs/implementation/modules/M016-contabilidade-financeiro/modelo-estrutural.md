# Modelo Estrutural

Dominio e regras de negocio: ver [README.md](README.md)

### Diagrama de Classes

```mermaid
classDiagram
    direction TB

    class ContaContabil {
        +String codigo
        +String nome
        +String descricao
        +TipoContaContabil tipo
        +NaturezaConta natureza
        +boolean ativa
    }

    class TipoContaContabil {
        <<enumeration>>
        ATIVO
        PASSIVO
        RECEITA
        DESPESA
        PATRIMONIO_LIQUIDO
    }

    class NaturezaConta {
        <<enumeration>>
        DEVEDORA
        CREDORA
    }

    class AssociacaoConta {
        +TipoAssociacao tipo
        +Date dataAssociacao
    }

    class TipoAssociacao {
        <<enumeration>>
        INICIATIVA
        PROGRAMA
        PARCERIA
    }

    class ContaBancaria {
        +String banco
        +String agencia
        +String numeroConta
        +String descricao
        +boolean ativa
    }

    class MovimentacaoFinanceira {
        +String codigo
        +TipoMovimentacaoFinanceira tipo
        +double valor
        +Date dataMovimentacao
        +String descricao
        +String responsavel
        +Date dataRegistro
    }

    class TipoMovimentacaoFinanceira {
        <<enumeration>>
        ENTRADA
        SAIDA
    }

    class ConciliacaoBancaria {
        +String codigo
        +Date dataInicio
        +Date dataFim
        +Date periodoInicio
        +Date periodoFim
        +EstadoConciliacao estado
        +String observacao
    }

    class EstadoConciliacao {
        <<enumeration>>
        PENDENTE
        EM_ANDAMENTO
        CONCILIADA
        DIVERGENTE
    }

    class ItemConciliacao {
        +double valorSistema
        +double valorExtrato
        +double diferenca
        +String observacao
        +boolean conciliado
    }

    class FluxoCaixa {
        +Date periodoInicio
        +Date periodoFim
        +double saldoInicial
        +double totalEntradas
        +double totalSaidas
        +double saldoFinal
    }

    class SaldoConta {
        +double saldoAtual
        +Date dataAtualizacao
    }

    class Iniciativa {
        <<fora do escopo - M003>>
    }

    class Programa {
        <<fora do escopo - M010>>
    }

    class Parceria {
        <<fora do escopo - M010>>
    }

    ContaContabil "1" --> "*" AssociacaoConta : associacoes
    ContaContabil "1" --> "*" ContaContabil : subcontas
    AssociacaoConta "*" --> "0..1" Iniciativa : iniciativa
    AssociacaoConta "*" --> "0..1" Programa : programa
    AssociacaoConta "*" --> "0..1" Parceria : parceria
    ContaBancaria "*" --> "0..1" Iniciativa : vinculada a
    ContaBancaria "*" --> "0..1" Programa : compartilhada por
    ContaBancaria "*" --> "0..1" Parceria : dedicada a
    ContaBancaria "1" --> "*" MovimentacaoFinanceira : movimentacoes
    ContaBancaria "1" --> "1" SaldoConta : saldo
    ContaBancaria "1" --> "*" ConciliacaoBancaria : conciliacoes
    ConciliacaoBancaria "1" --> "*" ItemConciliacao : itens
    ItemConciliacao "*" --> "0..1" MovimentacaoFinanceira : registro sistema
    MovimentacaoFinanceira "*" --> "1" ContaContabil : classificacao contabil
    FluxoCaixa "*" --> "1" ContaBancaria : conta
```

## Dicionario de Dados

| Classe | Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|--------|----------|-----------|--------|------|---------|---------|-------|
| **ContaContabil** | codigo | Codigo da conta seguindo estrutura do plano de contas do governo | Sim | String | Ex: 1.1.1.01 | 20 | Sim |
| | nome | Nome da conta contabil | Sim | String | Ex: Caixa e Equivalentes | 200 | |
| | descricao | Descricao da finalidade da conta | Sim | String | | 500 | |
| | tipo | Tipo da conta no plano de contas | Sim | TipoContaContabil | Ativo, Passivo, Receita, Despesa, Patrimonio Liquido | | |
| | natureza | Natureza da conta (devedora ou credora) | Sim | NaturezaConta | Devedora, Credora | | |
| | ativa | Indica se a conta esta ativa para lancamentos | Sim | Boolean | true/false | | |
| **AssociacaoConta** | tipo | Tipo da entidade associada a conta | Sim | TipoAssociacao | Iniciativa, Programa, Parceria | | |
| | dataAssociacao | Data em que a associacao foi realizada | Gerado | Date | | | |
| **ContaBancaria** | banco | Nome ou codigo do banco | Sim | String | Ex: Banco do Brasil, Banestes | 100 | |
| | agencia | Numero da agencia bancaria | Sim | String | Ex: 0001 | 10 | |
| | numeroConta | Numero da conta bancaria | Sim | String | Ex: 12345-6 | 20 | Sim |
| | descricao | Descricao da finalidade da conta | Sim | String | | 300 | |
| | ativa | Indica se a conta esta ativa | Sim | Boolean | true/false | | |
| **MovimentacaoFinanceira** | codigo | Codigo de identificacao unica da movimentacao | Gerado | String | Ex: MOV-2026-001 | | Sim |
| | tipo | Tipo da movimentacao (entrada ou saida) | Sim | TipoMovimentacaoFinanceira | Entrada, Saida | | |
| | valor | Valor monetario da movimentacao | Sim | Double | | | |
| | dataMovimentacao | Data efetiva da movimentacao | Sim | Date | | | |
| | descricao | Descricao da movimentacao | Sim | String | | 500 | |
| | responsavel | Usuario que registrou a movimentacao | Gerado | String | | 200 | |
| | dataRegistro | Data e hora do registro no sistema | Gerado | Date | | | |
| **ConciliacaoBancaria** | codigo | Codigo de identificacao da conciliacao | Gerado | String | Ex: CONC-2026-001 | | Sim |
| | dataInicio | Data de inicio da conciliacao | Gerado | Date | | | |
| | dataFim | Data de conclusao da conciliacao | Cond. | Date | Preenchida ao concluir | | |
| | periodoInicio | Inicio do periodo conciliado | Sim | Date | | | |
| | periodoFim | Fim do periodo conciliado | Sim | Date | | | |
| | estado | Estado da conciliacao no ciclo de vida | Gerado | EstadoConciliacao | Pendente, Em Andamento, Conciliada, Divergente | | |
| | observacao | Observacoes gerais sobre a conciliacao | Nao | String | | 1000 | |
| **ItemConciliacao** | valorSistema | Valor registrado no sistema | Sim | Double | | | |
| | valorExtrato | Valor correspondente no extrato bancario | Sim | Double | | | |
| | diferenca | Diferenca entre valor do sistema e valor do extrato | Gerado | Double | | | |
| | observacao | Observacao sobre o item de conciliacao | Nao | String | | 500 | |
| | conciliado | Indica se o item foi conciliado com sucesso | Sim | Boolean | true/false | | |
| **FluxoCaixa** | periodoInicio | Data de inicio do periodo do fluxo | Sim | Date | | | |
| | periodoFim | Data de fim do periodo do fluxo | Sim | Date | | | |
| | saldoInicial | Saldo no inicio do periodo | Gerado | Double | | | |
| | totalEntradas | Total de entradas no periodo | Gerado | Double | | | |
| | totalSaidas | Total de saidas no periodo | Gerado | Double | | | |
| | saldoFinal | Saldo no final do periodo | Gerado | Double | | | |
| **SaldoConta** | saldoAtual | Saldo atual da conta bancaria | Gerado | Double | | | |
| | dataAtualizacao | Data e hora da ultima atualizacao do saldo | Gerado | Date | | | |

## Notas de Implementacao

**Entidades externas:**
- Iniciativa: gerenciada por M003 (Gerenciar Editais) como abstracao estrutural de iniciativas apoiadas.
- Programa e Parceria: gerenciados por M010 (Planejamento e Estrategia).

**Navegabilidade:**
- Cardinalidade 1: atributo do tipo da classe destino (ex: MovimentacaoFinanceira.contaContabil: ContaContabil)
- Cardinalidade N: atributo lista do tipo da classe destino (ex: ContaBancaria.movimentacoes: List<MovimentacaoFinanceira>)
