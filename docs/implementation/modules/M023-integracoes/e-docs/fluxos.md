# Adapter E-Docs — Fluxos

[← Voltar ao adapter](README.md) | [Mapeamento V2](adapter.md) | [Modelo de Processo M023](../modelo-processo.md)

---

## Fluxo 1 — Envio + captura inicial

```mermaid
sequenceDiagram
    autonumber
    participant Cons as Modulo Consumidor (M009/M022/M003/M010)
    participant M023 as M023 (generico)
    participant Edocs as Adapter E-Docs
    participant AC as Acesso Cidadao
    participant API as E-Docs API V2
    participant MinIO as Storage MinIO

    Cons->>M023: EnviarDocumentoParaAssinatura(documentoId, signatarios[])
    M023->>Edocs: dispara adapter (provedor=E_DOCS)
    Edocs->>AC: POST /is/connect/token (Client Credentials)
    AC-->>Edocs: access_token
    Edocs->>API: GET /v2/documentos/upload-arquivo/gerar-url-upload/{tamanho}
    API-->>Edocs: { url, body, idArquivo }
    Edocs->>MinIO: POST multipart (body + file)
    MinIO-->>Edocs: 204
    Edocs->>API: POST /v2/documentos/capturar/nato-digital/auto-assinado/servidor
    API-->>Edocs: 202 { idEvento }

    loop ate status=Executado
        Edocs->>API: GET /v2/eventos/{idEvento}
        API-->>Edocs: { status, idDocumento? }
    end

    Edocs->>M023: persiste SolicitacaoAssinatura<br/>(provedor=E_DOCS, idExterno=idDocumento)
    M023-->>Cons: { solicitacaoId, estado=AGUARDANDO_ASSINATURAS }
```

## Fluxo 2 — Polling + detec'cao de conclusao

```mermaid
sequenceDiagram
    autonumber
    participant Job as Job ReconciliarAssinaturas (5 min)
    participant DB as DB Conecta
    participant Edocs as Adapter E-Docs
    participant API as E-Docs API V2
    participant M008 as M008 (Documento)
    participant Cons as Modulo Consumidor

    Job->>DB: SELECT SolicitacaoAssinatura WHERE provedor=E_DOCS AND estado nao terminal
    DB-->>Job: [solicitacoes pendentes]
    loop para cada solicitacao
        Edocs->>API: GET /v2/documentos/{idExterno}
        API-->>Edocs: { totalAssinantes, totalAssinados, capturadoFinal, assinaturas[] }
        Edocs->>DB: persiste EventoAssinatura

        alt capturadoFinal == true
            Edocs->>API: GET /v2/documentos/{idExterno}/conteudo
            API-->>Edocs: PDF binario
            Edocs->>Edocs: calcula SHA-256
            Edocs->>M008: ArquivarDocumentoAssinado(documentoId, pdf, hash, protocolo)
            Edocs->>DB: UPDATE estado=ASSINADA
            Edocs->>Cons: emite DocumentoAssinadoCompletamente
        else algum recusou
            Edocs->>DB: UPDATE estado=RECUSADA + motivo
            Edocs->>Cons: emite AssinaturaRecusada
        else parcial
            Edocs->>DB: UPDATE totalAssinados, estado=PARCIALMENTE_ASSINADA
            Edocs->>Cons: emite DocumentoAssinadoParcialmente
        end
    end
```

## Fluxo 3 — Recusa de signatario

```mermaid
sequenceDiagram
    autonumber
    participant Pesq as Signatario
    participant Portal as Portal E-Docs
    participant AC as Acesso Cidadao
    participant API as E-Docs API V2
    participant Job as Job Polling
    participant Edocs as Adapter E-Docs
    participant Cons as Modulo Consumidor

    Pesq->>Portal: clica link de assinatura
    Portal->>AC: redirect login
    AC-->>Pesq: autentica
    Pesq->>Portal: clica "Recusar" + informa motivo
    Portal->>API: registra recusa internamente

    Job->>Edocs: 5 min depois, polling executa
    Edocs->>API: GET /v2/documentos/{idExterno}
    API-->>Edocs: { assinaturas: [..., { recusou:true, motivoRecusa: "..." }] }
    Edocs->>Edocs: detecta recusa
    Edocs->>Cons: emite AssinaturaRecusada(documentoId, signatarioId, motivo)
    Cons->>Cons: M009: Bolsa = AssinaturaRecusada<br/>(M020 notifica gestor)
```

## Fluxo 4 — Expiracao (>30 dias)

```mermaid
sequenceDiagram
    autonumber
    participant CronExp as Job MarcarSolicitacoesExpiradas (diario 03:00)
    participant CronAlerta as Job AlertarSolicitacoesExpirando (diario 09:00)
    participant DB as DB Conecta
    participant Edocs as Adapter E-Docs
    participant Cons as Modulo Consumidor
    participant Comm as M020

    CronAlerta->>DB: SELECT WHERE dataEnvio + 25 dias < hoje < dataEnvio + 30 dias
    DB-->>CronAlerta: [pendentes proximas]
    CronAlerta->>Edocs: emite AssinaturaExpirando para cada
    Edocs->>Comm: notifica signatarios pendentes
    Edocs->>Cons: evento informativo (estado nao muda)

    CronExp->>DB: SELECT WHERE dataEnvio + 30 dias < hoje AND nao terminal
    DB-->>CronExp: [pendentes expiradas]
    CronExp->>DB: UPDATE estado=ERRO subcategoria EXPIRACAO
    CronExp->>Edocs: emite ErroIntegracaoAssinatura
    Edocs->>Cons: estado de negocio degradado<br/>(consumidor decide nova solicitacao ou cancelamento)
```

## Fluxo 5 — Reconciliacao manual

```mermaid
sequenceDiagram
    autonumber
    participant Sys as Sysadmin
    participant API as Conecta API
    participant Edocs as Adapter E-Docs
    participant ApiE as E-Docs API V2
    participant DB as DB Conecta

    Sys->>API: POST /api/v1/m023/solicitacoes-assinatura/{id}/reconciliar
    API->>Edocs: forca polling imediato
    Edocs->>ApiE: GET /v2/documentos/{idExterno}
    ApiE-->>Edocs: estado atual completo
    Edocs->>DB: persiste EventoAssinatura + atualiza solicitacao
    Edocs-->>API: estado atualizado
    API-->>Sys: resposta com novo estado
```

## Referencias

- [Modelo de Processo M023 — fluxo agnostico de provedor](../modelo-processo.md)
- [Discovery — sequence diagrams V2 detalhados](../../../../discovery/integracoes/e-docs.md)
- [Adapter — mapeamento de comandos](adapter.md)
