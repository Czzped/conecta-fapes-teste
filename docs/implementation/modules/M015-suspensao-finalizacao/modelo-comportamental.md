# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

### Ciclo de Vida: Projeto (extensao de estados para Suspensao e Finalizacao)

```mermaid
stateDiagram-v2
    [*] --> Ativo : Projeto contratado (M003)

    Ativo --> Suspenso : Suspensao aprovada
    Ativo --> EmEncerramento : Solicitar Encerramento

    Suspenso --> Reativado : Area Tecnica aprova reativacao
    Suspenso --> EmEncerramento : Solicitar Encerramento durante suspensao

    Reativado --> Ativo : Projeto retorna a operacao normal

    EmEncerramento --> Encerrado : Todas pendencias resolvidas

    Encerrado --> [*]

    state Ativo : Projeto em execucao normal\npagamentos e bolsas habilitados
    state Suspenso : Pagamentos bloqueados (M004)\nNovas bolsas bloqueadas (M009)
    state Reativado : Transicao para retorno a operacao
    state EmEncerramento : Verificando pendencias\n(PC, bolsas, pagamentos)
    state Encerrado : Projeto finalizado\nIrreversivel (RN06)

    note right of Suspenso : Suspensao bloqueia\npagamentos e novas bolsas
    note right of EmEncerramento : Todas PC devem estar aprovadas (RN04)\nTodas bolsas devem estar encerradas (RN05)
```

### Ciclo de Vida: SolicitacaoSuspensao

```mermaid
stateDiagram-v2
    [*] --> Submetida : Solicitar Suspensao

    Submetida --> EmAnalise : Area Tecnica inicia analise

    EmAnalise --> Aprovada : Parecer favoravel
    EmAnalise --> Rejeitada : Parecer desfavoravel

    Aprovada : entry / Bloquear pagamentos do projeto
    Aprovada : entry / Bloquear alocacao de novas bolsas
    Aprovada : entry / Alterar status do projeto para Suspenso

    Rejeitada --> [*]
    Aprovada --> [*]

    state Submetida : Aguardando inicio da analise
    state EmAnalise : Area Tecnica avaliando justificativa
    state Aprovada : Suspensao efetivada no projeto
    state Rejeitada : Suspensao negada com justificativa
```

### Ciclo de Vida: SolicitacaoFinalizacao

```mermaid
stateDiagram-v2
    [*] --> Submetida : Solicitar Encerramento

    Submetida --> VerificandoPendencias : Sistema verifica pendencias

    VerificandoPendencias --> PendenciasResolvidas : Nenhuma pendencia encontrada
    VerificandoPendencias --> PendenciasPendentes : Pendencias identificadas

    PendenciasPendentes --> VerificandoPendencias : Pendencias resolvidas externamente

    PendenciasResolvidas --> Encerrada : Confirmar encerramento

    Encerrada : entry / Alterar status do projeto para Encerrado
    Encerrada : entry / Registrar data de encerramento

    Encerrada --> [*]

    state Submetida : Solicitacao registrada
    state VerificandoPendencias : Sistema consultando M009, M014, M004
    state PendenciasResolvidas : Pronto para encerramento
    state PendenciasPendentes : Aguardando resolucao das pendencias
    state Encerrada : Projeto encerrado definitivamente
```
