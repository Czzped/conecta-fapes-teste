# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

### Ciclo de Vida: AlocacaoBolsista

```mermaid
stateDiagram-v2
    [*] --> EmEdicao : Solicitar Bolsa
    EmEdicao --> DocumentacaoPendente : Enviar Documentacao
    DocumentacaoPendente --> AguardandoAceites : Completar Documentacao
    AguardandoAceites --> PendenteDeAvaliacao : Enviar a agencia de fomento
    PendenteDeAvaliacao --> EmAvaliacao : Iniciar Avaliacao
    EmAvaliacao --> Ativa : Aprovar Alocacao
    EmAvaliacao --> Cancelada : Reprovar Alocacao
    Ativa --> Suspensa : Suspender Alocacao
    Ativa --> Finalizada : Finalizar Alocacao
    Ativa --> Cancelada : Cancelar Alocacao
    Suspensa --> Ativa : Reativar Alocacao
    Suspensa --> Cancelada : Cancelar Alocacao
```

### Ciclo de Vida: EditalCompetencia

```mermaid
stateDiagram-v2
    [*] --> SemDecisao : M1+1 dia / Importacao de edital ativo
    SemDecisao --> Liberado : Liberar Edital [area tecnica decide]
    SemDecisao --> NaoLiberado : Nao Liberar Edital [area tecnica decide]
    NaoLiberado --> Liberado : Liberar Edital [area tecnica decide]
    Liberado --> NaoLiberado : Nao Liberar Edital [area tecnica decide]
    Liberado --> IncluidoEmFolha : Gerar Folha
    NaoLiberado --> NaoLiberado : Editar Justificativa
    IncluidoEmFolha --> Liberado : Cancelar Folha / Rejeitar Folha [sem pagamentos em outra folha]
```

### Ciclo de Vida: Folha

```mermaid
stateDiagram-v2
    [*] --> Gerada : Gerar Folha
    Gerada --> Cancelada : Cancelar Folha
    Gerada --> Autorizada : Autorizar Folha [DIRAF]
    Gerada --> Rejeitada : Rejeitar Folha [DIRAF]
    Cancelada --> Gerada : Gerar Folha Novamente
    Rejeitada --> Gerada : Gerar Folha Novamente
    Autorizada --> EmAgendamento : Gerar Remessa
    EmAgendamento --> EmAgendamento : Gerar Remessa Adicional
    EmAgendamento --> Agendada : Processar Retorno [todas remessas agendadas]
    Agendada --> Paga : Processar DP9 [todas efetivadas]
```

> **Nota:** Os estados `SOLICITADO_AO_BANDES` e `REMESSAS_AUTORIZADAS` estao previstos no design para o fluxo completo Bandes (entre Agendada e Paga), mas ainda nao foram implementados no codigo.

### Ciclo de Vida: PagamentoBolsista

```mermaid
stateDiagram-v2
    [*] --> Alocado : Aprovar Alocacao / Importar Alocacao
    Alocado --> Programado : Programar Pagamento
    Alocado --> EmFolha : Gerar Folha
    Programado --> EmFolha : Gerar Folha
    EmFolha --> Alocado : Cancelar Folha / Rejeitar Folha
    EmFolha --> Enviado : Gerar Remessa [banco Banestes]
    Enviado --> Agendado : Processar Retorno [sucesso]
    Enviado --> FalhaAgendamento : Processar Retorno [falha]
    FalhaAgendamento --> Enviado : Gerar Nova Remessa
    Agendado --> Pago : Processar DP9 [remessa efetivada]
    Alocado --> Cancelado : Cancelar Alocacao
    Alocado --> SuspensaoPorSolicitacao : Suspender Pagamento
    SuspensaoPorSolicitacao --> Alocado : Reativar Pagamento
    Alocado --> PagamentoExterno : Registrar Pagamento Externo
```

> **Nota:** O estado `INCLUIDO_EM_GL_ALTERNATIVA` esta previsto no design para pagamentos via banco diferente de Banestes (Guia de Liberacao Alternativa), mas ainda nao foi implementado no codigo.

### Ciclo de Vida: BonusPagamento

```mermaid
stateDiagram-v2
    [*] --> AguardandoFolha : Criar Bonus
    AguardandoFolha --> InclusoNaFolha : Gerar Folha
    InclusoNaFolha --> AguardandoFolha : Cancelar Folha
    InclusoNaFolha --> Pago : Processar Pagamento
```

### Ciclo de Vida: Remessa

```mermaid
stateDiagram-v2
    [*] --> Gerando : Iniciar Geracao
    Gerando --> Gerada : Concluir Geracao
    Gerada --> Enviada : Enviar Remessa ao Banestes
    Enviada --> Agendada : Processar Retorno [pagamentos agendados]
    Agendada --> Autorizada : Autorizar Remessa [agencia confirma no Banestes]
    Autorizada --> Efetivada : Processar DP9 [pagamento efetuado]
```

### Ciclo de Vida: ProcessoRemessa

```mermaid
stateDiagram-v2
    [*] --> AguardandoProcessamento : Enfileirar no Redis
    AguardandoProcessamento --> EmProcessamento : Job Hangfire consome fila
    EmProcessamento --> ProcessadaComSucesso : Processamento concluido
    EmProcessamento --> ProcessadaComErro : Erro no processamento
    ProcessadaComErro --> AguardandoProcessamento : Reprocessar [tentativa < limite]
```

### Ciclo de Vida: AlocacaoBolsista (Cadastro Banestes)

```mermaid
stateDiagram-v2
    [*] --> Pendente : Alocacao ativa
    Pendente --> Enviado : Enviar Remessa de Cadastro ao Banestes
    Enviado --> Cadastrado : Processar Retorno [sucesso]
    Enviado --> Pendente : Processar Retorno [erro]
```
