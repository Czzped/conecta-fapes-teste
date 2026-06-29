# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

> **Subdominios proprios.** O ciclo de vida da `TaxaGestaoParcerias` (CALCULADA -> CLASSIFICADA -> REPASSADA -> VINCULADA -> ENCERRADA) e da `VersaoPoliticaTaxaGestao` esta em [taxa-gestao/modelo-comportamental.md](taxa-gestao/modelo-comportamental.md). O ciclo da `AcaoTransversal`, `PlanoAplicacaoAcaoTransversal`, `DespesaAcaoTransversal` e `PrestacaoContasAcaoTransversal` esta em [acao-transversal/](acao-transversal/modelo/README.md). Este modelo cobre apenas o **nucleo contabil/financeiro** do M016.

### Ciclo de Vida: ConciliacaoBancaria

```mermaid
stateDiagram-v2
    [*] --> Pendente : Criar Conciliacao

    Pendente --> EmAndamento : Iniciar Conciliacao

    EmAndamento --> EmAndamento : Registrar Item de Conciliacao
    EmAndamento --> Conciliada : Concluir sem divergencias
    EmAndamento --> Divergente : Concluir com divergencias

    Divergente --> EmAndamento : Reabrir para tratamento
    Divergente --> Conciliada : Resolver divergencias

    Conciliada --> [*]

    state Pendente : Conciliacao criada, aguardando inicio
    state EmAndamento : Comparando registros do sistema com extrato bancario
    state Conciliada : Todos os itens conciliados com sucesso
    state Divergente : Existem diferencas entre sistema e extrato

    note right of EmAndamento : Cada item compara valor\ndo sistema com extrato
    note right of Divergente : Divergencias devem ser\ntratadas antes do fechamento
```

### Ciclo de Vida: ContaBancaria (Saldo)

```mermaid
stateDiagram-v2
    [*] --> Ativa : Cadastrar Conta Bancaria

    Ativa --> Ativa : Registrar Movimentacao [saldo >= 0]
    Ativa --> Bloqueada : Saldo negativo sem autorizacao
    Ativa --> Inativa : Desativar Conta

    Bloqueada --> Ativa : Gestor autoriza saldo negativo
    Bloqueada --> Ativa : Registrar Entrada [saldo >= 0]

    Inativa --> [*]

    state Ativa : Conta operacional, movimentacoes permitidas
    state Bloqueada : Saldo negativo detectado, aguardando autorizacao
    state Inativa : Conta desativada, sem novas movimentacoes
```

> Os ciclos de vida da Taxa de Gestao de Parcerias e da Acao Transversal (incluindo `PlanoAplicacaoAcaoTransversal`) foram movidos para os respectivos subdominios — ver [taxa-gestao/modelo-comportamental.md](taxa-gestao/modelo-comportamental.md) e [acao-transversal/modelo/README.md](acao-transversal/modelo/README.md).
