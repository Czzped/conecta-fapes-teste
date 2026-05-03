# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

> **Atencao — duas maquinas de estados.** Este modulo documenta dois ciclos de vida para `PrestacaoContas`:
>
> - **V1 (implementada):** ciclo nuclear de 5 estados — `RASCUNHO → EM_ANALISE → {FINALIZADO | NEGADO | REVISAO → EM_ANALISE}`. E o que o backend atual (`ConectaFapes.PrestacaoContas.*`) executa hoje e o que o `contrato-api.md`, README, modelo-estrutural e processos refletem.
> - **Pos-MVP (target evolutivo, aguardando DT-M014-002 + EPIC-M014-002/003):** ciclo de 11 estados PascalCase incluindo contestacao (EmContestacao, EmReanalise, AprovadaFinal, RecusadaFinal) e auditoria SECONT (EmAuditoria, Auditada). Permanece documentado abaixo apenas como referencia evolutiva e **nao** esta implementado.
>
> Toda regra/codigo do M014 hoje aplica a maquina V1. Diagramas Pos-MVP entram em vigor apenas quando os EPICs correspondentes forem priorizados.

### Ciclo de Vida V1: PrestacaoContas (implementado)

```mermaid
stateDiagram-v2
    [*] --> RASCUNHO : Criar Prestacao
    RASCUNHO --> RASCUNHO : Adicionar/editar/remover documentos, justificativas e vinculos
    RASCUNHO --> EM_ANALISE : Submeter Prestacao
    REVISAO --> EM_ANALISE : Resubmeter apos revisao
    EM_ANALISE --> FINALIZADO : Parecer favoravel
    EM_ANALISE --> NEGADO : Parecer desfavoravel
    EM_ANALISE --> REVISAO : Solicitada complementacao

    FINALIZADO --> [*]
    NEGADO --> [*]

    state RASCUNHO : Coordenador prepara prestacao
    state EM_ANALISE : Area Tecnica analisa (edicao bloqueada)
    state REVISAO : Coordenador completa pendencias
    state FINALIZADO : Aprovada (terminal)
    state NEGADO : Recusada (terminal)
    note right of EM_ANALISE : RN03 bloqueia edicao\ndo agregado
    note right of FINALIZADO : RN08 terminal
```

### Ciclo de Vida Pos-MVP: PrestacaoContas (target evolutivo, aguardando DT-M014-002)

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

### Ciclo de Vida Pos-MVP: Contestacao (EPIC-M014-003)

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

### Ciclo de Classificacao: TransacaoFinanceira de Credito

> **Aviso de versao.** Os estados detalhados (`CreditoImportado`, `EmClassificacao`, `PareadoSemPrestacao`, `Conciliavel`, `VinculadaPrestacao`, `ClassificacaoConfirmada`) descrevem o pipeline Pos-MVP. **No V1, o que o sistema persiste sao apenas as 4 categorias de `TipoClassificacaoTransacao`: `DESPESA`, `ESTORNO`, `RENDIMENTO`, `PENDENTE_CLASSIFICACAO`** (ver RN11 no README e enum em modelo-estrutural). O diagrama abaixo descreve o ciclo conceitual completo planejado.

Creditos importados do extrato bancario precisam ser classificados antes ou durante a conciliacao da prestacao. Um credito pode ser rendimento, estorno ou permanecer pendente de classificacao. O estorno representa devolucao de terceiro, como vendedor ou fornecedor, anulando um debito anterior de mesmo valor referente a compra nao concluida, cancelada ou nao entregue. Esse debito pode ainda nao ter prestacao de contas, justificativa ou validacao pela FAPES.

```mermaid
stateDiagram-v2
    [*] --> CreditoImportado : CNAB 240 importa CREDITO

    CreditoImportado --> EmClassificacao : Processar regras automaticas

    EmClassificacao --> Estorno : Ha debito anterior de mesmo valor\ne terceiro relacionado
    EmClassificacao --> Rendimento : Credito identificado como rendimento bancario
    EmClassificacao --> PendenteClassificacao : Sem pareamento seguro

    PendenteClassificacao --> Estorno : Analista confirma debito estornado
    PendenteClassificacao --> Rendimento : Analista confirma rendimento
    PendenteClassificacao --> PendenteClassificacao : Informacao insuficiente

    Estorno --> PareadoSemPrestacao : Debito ainda sem Prestacao
    Estorno --> Conciliavel : Debito ja vinculado a Prestacao
    PareadoSemPrestacao --> Conciliavel : Coordenador associa estorno na prestacao
    Rendimento --> Conciliavel : Classificado como receita financeira

    Conciliavel --> VinculadaPrestacao : Coordenador vincula a prestacao
    VinculadaPrestacao --> EmAnalise : Prestacao submetida
    EmAnalise --> ClassificacaoConfirmada : FAPES aprova conciliacao
    EmAnalise --> PendenteClassificacao : FAPES solicita revisao

    ClassificacaoConfirmada --> [*]

    state CreditoImportado : TransacaoFinanceira Tipo=CREDITO
    state EmClassificacao : M014 tenta classificar automaticamente
    state Estorno : Classificacao=ESTORNO\nTransacaoEstornadaId preenchido
    state PareadoSemPrestacao : Credito e debito pareados\nsem Prestacao vinculada
    state Rendimento : Classificacao=RENDIMENTO
    state PendenteClassificacao : Classificacao=PENDENTE_CLASSIFICACAO
    state Conciliavel : Pronta para montagem da prestacao
    state VinculadaPrestacao : Transacao associada a Prestacao
    state EmAnalise : Prestacao bloqueada para edicao
    state ClassificacaoConfirmada : Classificacao aceita na analise
```

#### Regras comportamentais do estorno

- O estorno so pode ser aplicado a `TransacaoFinanceira` de `Tipo = CREDITO`.
- O credito classificado como `ESTORNO` deve ser pareado a uma `TransacaoFinanceira` anterior de `Tipo = DEBITO`.
- O valor do credito deve ser igual ao valor do debito estornado.
- A origem do credito deve indicar terceiro relacionado ao debito original, como vendedor, fornecedor, operadora ou prestador.
- O debito estornado pode estar sem `Prestacao`, sem justificativa e sem validacao pela FAPES; o estorno deve ser permitido como pareamento financeiro antes da prestacao de contas.
- Quando o pareamento automatico nao for seguro, a classificacao deve permanecer `PENDENTE_CLASSIFICACAO` ate revisao manual.
- Quando confirmado e vinculado a uma prestacao, o par debito/estorno deve aparecer junto na conciliacao, com efeito liquido `R$ 0,00`.
- A associacao manual do estorno pode ocorrer em `RASCUNHO` ou `REVISAO` como parte da elaboracao. Se a `Prestacao` ja estiver `EM_ANALISE`, `FINALIZADO` ou `NEGADO`, a associacao deve ser registrada como ajuste conciliatorio pos-prestacao, append-only, com auditoria e sem alterar documentos ou justificativas ja submetidos.
