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
