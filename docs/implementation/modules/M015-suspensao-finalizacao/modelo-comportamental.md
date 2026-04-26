# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

## Ciclo de Vida da Iniciativa em Suspensao e Finalizacao

```mermaid
stateDiagram-v2
    [*] --> Ativa : Iniciativa em execucao

    Ativa --> SuspensaoSolicitada : Solicitar suspensao
    SuspensaoSolicitada --> Suspensa : Suspensao aprovada
    SuspensaoSolicitada --> Ativa : Suspensao rejeitada
    Suspensa --> ReativacaoSolicitada : Solicitar reativacao
    ReativacaoSolicitada --> Ativa : Reativacao aprovada
    ReativacaoSolicitada --> Suspensa : Reativacao rejeitada

    Ativa --> EmEncerramento : Solicitar finalizacao
    Suspensa --> EmEncerramento : Solicitar finalizacao
    EmEncerramento --> Encerrada : Pendencias resolvidas
    EmEncerramento --> Ativa : Finalizacao cancelada

    Encerrada --> [*]

    state Ativa : Pagamentos e bolsas habilitados
    state Suspensa : Pagamentos bloqueados\nNovas bolsas bloqueadas
    state EmEncerramento : Pendencias em verificacao
    state Encerrada : Estado terminal
```

## Ciclo de Vida da Solicitacao de Suspensao

```mermaid
stateDiagram-v2
    [*] --> Submetida
    Submetida --> EmAnalise
    EmAnalise --> Aprovada
    EmAnalise --> Rejeitada
    Aprovada --> [*]
    Rejeitada --> [*]

    state Aprovada : Altera iniciativa para Suspensa\nBloqueia pagamentos e novas bolsas
```

## Ciclo de Vida da Solicitacao de Finalizacao

```mermaid
stateDiagram-v2
    [*] --> Submetida
    Submetida --> EmAnalise
    EmAnalise --> PendenciasIdentificadas
    PendenciasIdentificadas --> EmAnalise : Pendencias resolvidas
    EmAnalise --> Aprovada
    EmAnalise --> Rejeitada
    Aprovada --> Encerrada
    Rejeitada --> [*]
    Encerrada --> [*]
```
