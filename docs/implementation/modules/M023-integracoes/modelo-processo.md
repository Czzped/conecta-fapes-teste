# Modelo de Processo

[README.md](README.md) | [Modelo Estrutural](modelo-estrutural.md) | [Modelo Comportamental](modelo-comportamental.md) | [Contrato](contrato.md)

---

## Atores

| Ator | Responsabilidade |
|------|------------------|
| **Modulo Consumidor** | M009/M022/M003/M010 — gera PDF e dispara coleta de assinatura |
| **M023 (Adapter)** | Orquestra autenticacao, upload, registro, polling e arquivamento |
| **Provedor (E-Docs V2)** | Recebe documento, gera link de assinatura, registra assinaturas, devolve PDF assinado |
| **Acesso Cidadao** | IdP do Estado ES — token de aplicacao + login dos signatarios |
| **Signatario** | Pesquisador, Coordenador, Bolsista, Diretor, Servidor — assina via portal E-Docs |
| **M020 (Comunicacao)** | Envia notificacoes (email/SMS) aos signatarios |
| **M008 (Documento)** | Arquiva PDF assinado com `protocoloAssinatura` + `hashAssinatura` |
| **Job ReconciliarAssinaturas** | Job interno do M023 (a cada 5 min) — pollar status |
| **Job AlertarExpiracoes** | Job interno do M023 (diario) — alerta proximo a 25 dias |
| **Sysadmin** | Reconcilia manualmente solicitacoes em ERRO |

---

## Processo principal — End-to-End

Macro-fluxo do envio ate arquivamento.

```mermaid
flowchart LR
    subgraph Consumidor[Modulo Consumidor]
        A1[Gera PDF do termo] --> A2[Documento CRIADO em M008]
        A2 --> A3[Chama EnviarDocumentoParaAssinatura]
    end

    subgraph M023[M023 Adapter]
        B1[Autentica via Acesso Cidadao] --> B2[Gera URL upload]
        B2 --> B3[Upload PDF MinIO]
        B3 --> B4[Registra documento + assinantes]
        B4 --> B5[Polling captura inicial]
        B5 --> B6[Persiste SolicitacaoAssinatura]
        B6 --> B7[Devolve idSolicitacao + urlPortal]
    end

    subgraph Notif[M020 Comunicacao]
        C1[Envia email/SMS aos signatarios] --> C2[Link portal E-Docs]
    end

    subgraph Sign[Signatario externo]
        D1[Acessa portal E-Docs] --> D2[Login Acesso Cidadao]
        D2 --> D3[Assina ou recusa]
    end

    subgraph Sync[Job ReconciliarAssinaturas]
        E1[GET /v2/documentos/idEdocs] --> E2{Estado mudou?}
        E2 -- Sim, parcial --> E3[Atualiza contadores + emite DocumentoAssinadoParcialmente]
        E2 -- Sim, completo --> E4[Baixa PDF + hash + arquiva M008 + emite DocumentoAssinadoCompletamente]
        E2 -- Recusa --> E5[Marca RECUSADA + emite AssinaturaRecusada]
        E2 -- Expirou --> E6[Marca ERRO + emite ErroIntegracaoAssinatura]
        E2 -- Nada --> E7[Aguarda proxima rodada 5 min]
    end

    A3 --> B1
    B7 --> C1
    C2 --> D1
    D3 -.-> E1
    E1 -.-> E2

    E4 --> F1[Documento M008 = ASSINADO]
    F1 --> F2[Modulo consumidor avanca fluxo]
```

---

## Diagrama BPMN-style com raias (swim lanes)

Visao detalhada com responsabilidades de cada ator.

```mermaid
flowchart TB
    subgraph Lane1[Modulo Consumidor M009/M022/M003/M010]
        S1((Inicio: PDF gerado)) --> S2[Cadastra Documento M008<br/>estado=CRIADO]
        S2 --> S3[POST /api/v1/m023/solicitacoes-assinatura<br/>com signatarios]
        S3 --> S4{Sucesso?}
        S4 -- Nao --> S5[Trata erro<br/>422/409/503]
        S5 --> SE1((Fim erro consumidor))
        S4 -- Sim --> S6[Aguarda evento de conclusao]
        S6 -.-> S22[Reage a evento publico]
        S22 --> S23[Avanca estado de negocio<br/>ex: Bolsa = TermoAssinado]
        S23 --> SF((Fim sucesso consumidor))
    end

    subgraph Lane2[M023 Adapter]
        T1[Valida PDF<br/>texto pesquisavel + tamanho] --> T2[Token Client Credentials]
        T2 --> T3[Gera URL upload + idArquivo]
        T3 --> T4[POST PDF MinIO]
        T4 --> T5[POST capturar com assinantes<br/>retorna idEvento]
        T5 --> T6[Persiste SolicitacaoAssinatura<br/>estado=ENVIADA]
        T6 --> T7[Polling do evento captura inicial]
        T7 --> T8{Captura inicial OK?}
        T8 -- Sim --> T9[Atualiza estado=AGUARDANDO_ASSINATURAS<br/>com idExterno]
        T8 -- Falha --> T10[estado=ERRO]
        T9 --> T11[Devolve idSolicitacao ao consumidor]

        T20[Ciclo polling 5 min] --> T21[GET v2/documentos/idEdocs]
        T21 --> T22{Mudanca?}
        T22 -- ParcialmenteAssinada --> T23[Emite DocumentoAssinadoParcialmente]
        T22 -- Completo --> T24[GET v2/documentos/idEdocs/conteudo]
        T22 -- Recusa --> T25[Emite AssinaturaRecusada<br/>estado=RECUSADA]
        T22 -- Sem mudanca --> T20
        T24 --> T26[Calcula hash<br/>delega ArquivarDocumentoAssinado]
        T26 --> T27[Emite DocumentoAssinadoCompletamente<br/>estado=ASSINADA]

        T30[Job diario expiracao] --> T31{> 25 dias?}
        T31 -- Sim --> T32[Emite AssinaturaExpirando]
        T31 -- > 30 dias --> T33[estado=ERRO<br/>Emite ErroIntegracaoAssinatura]
    end

    subgraph Lane3[Provedor E-Docs V2]
        U1[Recebe POST /v2/documentos/upload-arquivo/gerar-url-upload] --> U2[Devolve URL MinIO + idArquivo]
        U3[POST capturar/auto-assinado/servidor] --> U4[Enfileira evento captura inicial]
        U4 --> U5[Devolve idEvento]
        U6[Signatario assina via portal] --> U7[Atualiza assinatura interna]
        U8[Ultima assinatura] --> U9[Captura final automatica]
        U10[GET /v2/documentos/idEdocs/conteudo] --> U11[Devolve PDF assinado]
    end

    subgraph Lane4[Comunicacao M020]
        V1[Recebe NotificarSignatarios] --> V2[Envia email/SMS<br/>com urlPortal]
    end

    subgraph Lane5[Signatario]
        W1((Recebe link)) --> W2[Acessa portal E-Docs]
        W2 --> W3[Login Acesso Cidadao]
        W3 --> W4{Decisao}
        W4 -- Assina --> W5((Assinatura registrada))
        W4 -- Recusa --> W6((Recusa registrada))
    end

    subgraph Lane6[M008 Cadastros]
        X1[Recebe ArquivarDocumentoAssinado] --> X2[Salva PDF + hash + protocolo<br/>Documento=ASSINADO]
    end

    S3 -.-> T1
    T3 -.-> U1
    T4 -.-> U2
    T5 -.-> U3
    T11 -.-> S6
    T11 --> V1
    V2 --> W1
    W5 -.-> U7
    W6 -.-> U7
    T21 -.-> U7
    T24 -.-> U10
    T26 -.-> X1
    T23 -.-> S22
    T27 -.-> S22
    T25 -.-> S22
```

---

## Subprocesso A — Envio inicial

```mermaid
flowchart LR
    A1((Inicio)) --> A2[Modulo consumidor gera PDF]
    A2 --> A3[POST /api/v1/m023/solicitacoes-assinatura]
    A3 --> A4{PDF valido?<br/>texto + max 250MB}
    A4 -- Nao --> A5[Erro DOCUMENTO_INVALIDO_PDF<br/>ou DOCUMENTO_EXCEDE_LIMITE]
    A4 -- Sim --> A6[Token Acesso Cidadao]
    A6 --> A7[Gera URL upload]
    A7 --> A8[Upload PDF MinIO em segundos]
    A8 --> A9[POST capturar com assinantes]
    A9 --> A10[Persiste SolicitacaoAssinatura<br/>estado=ENVIADA]
    A10 --> A11[Polling captura inicial<br/>ate Executado]
    A11 --> A12{Captura OK em < 1h?}
    A12 -- Sim --> A13[estado=AGUARDANDO_ASSINATURAS]
    A12 -- Nao --> A14[estado=ERRO]
    A13 --> A15((Fim ok))
    A14 --> A16((Fim erro))
    A5 --> A17((Fim erro))
```

## Subprocesso B — Coleta de assinaturas e detec'cao de conclusao

```mermaid
flowchart LR
    B1((Inicio: AGUARDANDO_ASSINATURAS)) --> B2[Job ReconciliarAssinaturas a cada 5 min]
    B2 --> B3[GET /v2/documentos/idEdocs]
    B3 --> B4[Persiste EventoAssinatura]
    B4 --> B5{capturadoFinal?}
    B5 -- Sim --> B6[GET conteudo]
    B5 -- Nao --> B7{Algum recusou?}
    B6 --> B8[Calcula hash + arquiva M008]
    B8 --> B9[estado=ASSINADA]
    B9 --> B10[Emite DocumentoAssinadoCompletamente]
    B10 --> BF1((Fim ok))
    B7 -- Sim --> B11[estado=RECUSADA]
    B11 --> B12[Emite AssinaturaRecusada]
    B12 --> BF2((Fim recusa))
    B7 -- Nao --> B13{Total mudou?}
    B13 -- Sim --> B14[estado=PARCIALMENTE_ASSINADA]
    B14 --> B15[Emite DocumentoAssinadoParcialmente]
    B15 --> B16[Aguarda proxima rodada]
    B16 --> B2
    B13 -- Nao --> B16
```

## Subprocesso C — Expiracao e tratamento de erro

```mermaid
flowchart LR
    C1((Inicio: solicitacao pendente)) --> C2[Job AlertarSolicitacoesExpirando<br/>diario as 09:00]
    C2 --> C3{> 25 dias?}
    C3 -- Sim --> C4[Emite AssinaturaExpirando<br/>estado nao muda]
    C3 -- Nao --> C5((aguarda))
    C4 --> C6[M020 lembra signatarios pendentes]

    C7((Inicio)) --> C8[Job MarcarSolicitacoesExpiradas<br/>diario as 03:00]
    C8 --> C9{> 30 dias?}
    C9 -- Sim --> C10[estado=ERRO subcategoria EXPIRACAO]
    C10 --> C11[Emite ErroIntegracaoAssinatura]
    C11 --> C12[Sysadmin reconcilia manualmente<br/>ou consumidor cria nova solicitacao]

    C13((Inicio: 5xx repetido)) --> C14{10 falhas consecutivas?}
    C14 -- Sim --> C15[estado=ERRO subcategoria FALHA_TECNICA]
    C15 --> C11
```

## Subprocesso D — Reconciliacao manual pelo Sysadmin

```mermaid
flowchart LR
    D1((Sysadmin investiga solicitacao)) --> D2[POST /api/v1/m023/solicitacoes-assinatura/id/reconciliar]
    D2 --> D3[M023 chama GET v2/documentos/idEdocs]
    D3 --> D4[Persiste novo EventoAssinatura]
    D4 --> D5[Re-avalia estado conforme retorno]
    D5 --> D6{Mudanca?}
    D6 -- Sim --> D7[Atualiza estado + emite evento publico apropriado]
    D6 -- Nao --> D8[Mantem estado atual]
    D7 --> DF1((Fim))
    D8 --> DF1
```

## Subprocesso E — Cancelamento manual

```mermaid
flowchart LR
    E1((Sysadmin ou consumidor)) --> E2[POST /api/v1/m023/solicitacoes-assinatura/id/cancelar]
    E2 --> E3{Estado nao terminal?}
    E3 -- Nao --> E4[409 SOLICITACAO_TERMINAL]
    E3 -- Sim --> E5[estado=ERRO subcategoria CANCELAMENTO_MANUAL]
    E5 --> E6[Emite ErroIntegracaoAssinatura]
    E6 --> EF((Fim))
    E4 --> EF
```

---

## Cenarios de excecao consolidados

| Cenario | Detec'cao | Acao do M023 | Evento publico |
|---------|-----------|--------------|----------------|
| PDF invalido (sem texto pesquisavel) | Validacao no envio | Rejeita com 422 antes de chamar provedor | — |
| PDF > 250 MB | Validacao no envio | Rejeita com 422 | — |
| Provedor 503 no upload | Falha imediata | Retorna 503 ao consumidor; nao cria solicitacao | — |
| Provedor 5xx durante polling (1-9x) | Job de polling | Persiste EventoAssinatura ERRO; mantem estado; tenta novamente | — |
| Provedor 5xx durante polling (10x consecutivos) | Job de polling | Transita para ERRO | `ErroIntegracaoAssinatura` |
| Signatario recusa | Polling detecta flag/motivo | Marca Signatario.RECUSOU + Solicitacao.RECUSADA | `AssinaturaRecusada` |
| > 25 dias sem conclusao | Job diario | Emite alerta; estado nao muda | `AssinaturaExpirando` |
| > 30 dias sem conclusao | Job diario | Transita para ERRO subcategoria EXPIRACAO | `ErroIntegracaoAssinatura` |
| Cancelamento manual | Comando Sysadmin/consumidor | Transita para ERRO subcategoria CANCELAMENTO_MANUAL | `ErroIntegracaoAssinatura` |
| Solicitacao duplicada para mesmo Documento | Validacao no envio (RI2) | Retorna 409 com idSolicitacao existente (idempotencia) | — |

---

## Tempos esperados (SLA referencial)

| Fase | Duracao tipica | Limite |
|------|-----------------|--------|
| Envio + captura inicial | 5-30 segundos | 1 hora (apos isso, ERRO) |
| Coleta de 1 assinatura | minutos a dias (depende do signatario) | 30 dias total |
| Polling de status | a cada 5 minutos | latencia maxima de 6 min entre assinatura e atualizacao |
| Captura final + download | 1-5 segundos apos ultima assinatura | — |
| Arquivamento em M008 | < 1 segundo | — |

---

## Referencias

- **Modelos relacionados**:
  - [modelo-estrutural.md](modelo-estrutural.md) — entidades e atributos
  - [modelo-comportamental.md](modelo-comportamental.md) — state machines + dicionario detalhado de estados e eventos
- **Contratos**:
  - [contrato.md](contrato.md) — operacoes publicas, eventos, jobs
  - [contrato-api.md](contrato-api.md) — endpoints HTTP REST internos
- **Discovery**:
  - [integracoes/e-docs.md](../../../discovery/integracoes/e-docs.md) — sequence diagrams + 11 etapas detalhadas
  - [integracoes/organograma.md](../../../discovery/integracoes/organograma.md) — papeis dos servidores capturadores
  - [glossario.md](../../../discovery/glossario.md)
- **Documentacao oficial provedor (E-Docs V2)**: [docs.e-docs.es.gov.br/api](https://docs.e-docs.es.gov.br/api/)
- **Lei 14.063/20** — base juridica das assinaturas eletronicas em atos administrativos do Estado
- **EPICs**:
  - [EPIC-M023-001 — Envio + captura inicial](epics/EPIC-M023-001.md)
  - [EPIC-M023-002 — Sync + arquivamento](epics/EPIC-M023-002.md)
  - [EPIC-M023-003 — Recusa + expiracao + reconciliacao](epics/EPIC-M023-003.md)
