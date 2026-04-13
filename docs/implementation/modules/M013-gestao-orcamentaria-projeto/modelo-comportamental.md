# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

### Ciclo de Vida: SolicitacaoOrcamentaria

```mermaid
stateDiagram-v2
    [*] --> Rascunho : Criar Solicitacao

    Rascunho --> Rascunho : Editar Solicitacao
    Rascunho --> Submetida : Submeter Solicitacao

    Submetida --> EmAnalise : Area Tecnica inicia analise

    EmAnalise --> Aprovada : Parecer favoravel
    EmAnalise --> Rejeitada : Parecer desfavoravel

    Aprovada : entry / Atualizar saldo das rubricas
    Aprovada : entry / Registrar no historico orcamentario

    Rejeitada --> [*]
    Aprovada --> [*]

    state Rascunho : Coordenador preparando solicitacao
    state Submetida : Aguardando inicio da analise
    state EmAnalise : Area Tecnica avaliando justificativa e valores
    state Aprovada : Movimentacao efetivada, saldos atualizados
    state Rejeitada : Solicitacao negada com justificativa

    note right of EmAnalise : Remanejamento > 25%\nexige aprovacao do Diretor
```

### Fluxo de Remanejamento entre Rubricas

```mermaid
stateDiagram-v2
    [*] --> VerificandoSaldo : Solicitar Remanejamento

    VerificandoSaldo --> CalculandoPercentual : Saldo suficiente na origem
    VerificandoSaldo --> Impedido : Saldo insuficiente

    CalculandoPercentual --> AnaliseAreaTecnica : Percentual <= 25%
    CalculandoPercentual --> AnaliseComDiretor : Percentual > 25%

    AnaliseAreaTecnica --> RemanejamentoAprovado : Aprovado
    AnaliseAreaTecnica --> RemanejamentoRejeitado : Rejeitado

    AnaliseComDiretor --> RemanejamentoAprovado : Diretor aprova
    AnaliseComDiretor --> RemanejamentoRejeitado : Diretor rejeita

    RemanejamentoAprovado : entry / Debitar rubrica origem
    RemanejamentoAprovado : entry / Creditar rubrica destino

    Impedido --> [*]
    RemanejamentoAprovado --> [*]
    RemanejamentoRejeitado --> [*]
```
