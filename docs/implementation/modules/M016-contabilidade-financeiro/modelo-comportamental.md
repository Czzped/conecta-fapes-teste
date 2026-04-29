# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

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

### Ciclo de Vida: ReservaAcaoTransversal

```mermaid
stateDiagram-v2
    [*] --> Recebida : ReceberReservaAcaoTransversal

    Recebida --> Classificada : Vincular conta contabil, fundo e centro de custo
    Classificada --> Planejada : Cadastrar plano de aplicacao por rubrica
    Planejada --> EmExecucao : Registrar primeira despesa
    EmExecucao --> EmExecucao : Registrar nova despesa
    EmExecucao --> EmPrestacaoFinanceira : Submeter prestacao financeira institucional
    EmPrestacaoFinanceira --> Encerrada : Aprovar sem pendencias
    EmPrestacaoFinanceira --> EncerradaComGlosa : Aprovar com glosa
    EmPrestacaoFinanceira --> Planejada : Solicitar ajuste
    EmPrestacaoFinanceira --> Reprovada : Reprovar prestacao

    Encerrada --> [*]
    EncerradaComGlosa --> [*]
    Reprovada --> [*]

    state Recebida : Reserva recebida do M010, ainda sem classificacao completa
    state Classificada : Reserva vinculada a ContaContabil, FundoFinanceiro e CentroCusto
    state Planejada : Plano de aplicacao por rubricas criado
    state EmExecucao : Despesas institucionais registradas
    state EmPrestacaoFinanceira : Despesas em analise financeira institucional
    state Encerrada : Prestacao financeira aprovada
    state EncerradaComGlosa : Prestacao aprovada com valores glosados
    state Reprovada : Prestacao financeira reprovada
```

### Ciclo de Vida: PlanoAplicacaoAcaoTransversal

```mermaid
stateDiagram-v2
    [*] --> EmElaboracao : Criar plano
    EmElaboracao --> Aprovado : Aprovar plano [total <= saldo da reserva]
    EmElaboracao --> Cancelado : Cancelar plano
    Aprovado --> Substituido : Criar novo plano substitutivo
    Aprovado --> [*]
    Cancelado --> [*]
    Substituido --> [*]

    state EmElaboracao : Itens por rubrica em edicao
    state Aprovado : Plano apto a orientar despesas
    state Cancelado : Plano descartado antes da execucao
    state Substituido : Plano preservado historicamente, mas nao vigente
```
