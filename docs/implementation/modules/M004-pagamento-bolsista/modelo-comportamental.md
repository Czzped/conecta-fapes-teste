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
    Gerada --> Cancelada : Rejeitar Folha [DIRAF]
    Cancelada --> Gerada : Gerar Folha Novamente
    Autorizada --> EmAgendamento : Gerar Remessa
    EmAgendamento --> EmAgendamento : Gerar Remessa Adicional
    EmAgendamento --> Agendada : Processar Retorno [todas remessas agendadas]
    Agendada --> SolicitadoAoBandes : Solicitar Transferencia ao Bandes
    SolicitadoAoBandes --> RemessasAutorizadas : Autorizar Remessas [todas autorizadas]
    RemessasAutorizadas --> Paga : Processar DP9 [todas efetivadas]
```

### Ciclo de Vida: PagamentoBolsista

```mermaid
stateDiagram-v2
    [*] --> Alocado : Aprovar Alocacao / Importar Alocacao
    Alocado --> EmFolha : Gerar Folha
    EmFolha --> Alocado : Cancelar Folha / Rejeitar Folha
    EmFolha --> Enviado : Gerar Remessa [banco Banestes]
    EmFolha --> IncluidoEmGLAlternativa : Gerar Remessa [banco diferente de Banestes]
    Enviado --> Agendado : Processar Retorno [sucesso]
    Enviado --> FalhaAgendamento : Processar Retorno [falha]
    FalhaAgendamento --> Enviado : Gerar Nova Remessa
    FalhaAgendamento --> IncluidoEmGLAlternativa : Encaminhar para GL Alternativa
    Agendado --> Pago : Processar DP9 [remessa efetivada]
    IncluidoEmGLAlternativa --> Pago : Solicitar Transferencia ao Bandes
```

### Ciclo de Vida: Remessa

```mermaid
stateDiagram-v2
    [*] --> Enviada : Gerar e Enviar Remessa ao Banestes
    Enviada --> Agendada : Processar Retorno [pagamentos agendados]
    Agendada --> Autorizada : Autorizar Remessa [agencia de fomento confirma no Banestes]
    Autorizada --> Efetivada : Processar DP9 [pagamento efetuado]
```

### Ciclo de Vida: AlocacaoBolsista (Cadastro Banestes)

```mermaid
stateDiagram-v2
    [*] --> Pendente : Alocacao ativa
    Pendente --> Enviado : Enviar Remessa de Cadastro ao Banestes
    Enviado --> Cadastrado : Processar Retorno [sucesso]
    Enviado --> Pendente : Processar Retorno [erro]
```
