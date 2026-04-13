# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

### Ciclo de Vida: PrestacaoContas

```mermaid
stateDiagram-v2
    [*] --> EmPreparacao : Criar Prestacao de Contas

    EmPreparacao --> EmPreparacao : Importar extrato / Adicionar documentos
    EmPreparacao --> Submetida : Submeter Prestacao

    Submetida --> EmAnalise : Area Tecnica inicia analise

    EmAnalise --> Aprovada : Parecer favoravel (sem contestacao possivel)
    EmAnalise --> Recusada : Parecer desfavoravel

    Recusada --> EmContestacao : Coordenador contesta [dentro de 15 dias]
    Recusada --> RecusadaFinal : Prazo de contestacao expirado

    EmContestacao --> EmReanalise : Area Tecnica inicia reanalise

    EmReanalise --> AprovadaFinal : Contestacao deferida
    EmReanalise --> RecusadaFinal : Contestacao indeferida

    Aprovada --> EmAuditoria : SECONT inicia auditoria
    AprovadaFinal --> EmAuditoria : SECONT inicia auditoria

    EmAuditoria --> Auditada : SECONT emite parecer

    RecusadaFinal --> [*]
    Auditada --> [*]

    state EmPreparacao : Coordenador preparando documentos e extrato
    state Submetida : Aguardando inicio da analise
    state EmAnalise : Area Tecnica verificando documentos e extrato
    state Aprovada : Aprovada, sujeita a auditoria SECONT
    state Recusada : Recusada, aguardando contestacao ou expiracao
    state EmContestacao : Coordenador contestou a recusa
    state EmReanalise : Area Tecnica reanalisando contestacao
    state AprovadaFinal : Aprovada em carater definitivo e irreversivel
    state RecusadaFinal : Recusada em carater definitivo
    state EmAuditoria : SECONT auditando prestacao
    state Auditada : Auditoria concluida

    note right of Aprovada : Aprovacao primeira instancia\npode ser auditada pela SECONT
    note right of Recusada : Coordenador tem 15 dias\npara contestar (RN04)
    note right of AprovadaFinal : Irreversivel (RN06)
```

### Ciclo de Vida: Contestacao

```mermaid
stateDiagram-v2
    [*] --> Submetida : Coordenador contesta recusa

    Submetida --> EmReanalise : Area Tecnica inicia reanalise

    EmReanalise --> Deferida : Contestacao aceita
    EmReanalise --> Indeferida : Contestacao negada

    Deferida --> [*]
    Indeferida --> [*]

    state Submetida : Argumentacao e documentos complementares enviados
    state EmReanalise : Area Tecnica reavaliando
    state Deferida : Prestacao aprovada em carater final
    state Indeferida : Recusa mantida em carater final
```
