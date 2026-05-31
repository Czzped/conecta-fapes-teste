# Contrato do Modulo

Dominio e regras: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do M023 — como modulos consumidores (M009, M022, M003, M010) interagem com a integracao E-Docs sem precisar conhecer protocolo OAuth, MinIO ou polling.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| M009 (Bolsa) | Envio do Termo de Compromisso para assinatura (5 signatarios) |
| M022 (Outorga) | Envio do Termo de Outorga (Outorgado + Diretor) |
| M003 (Iniciativas) | Envio do Termo de Aceite e Plano de Trabalho |
| M010 (Parcerias) | Envio do Termo de Cooperacao e aditivos |
| M008 (Cadastros Corporativos) | Recebe `ArquivarDocumentoAssinado` apos conclusao |
| M020 (Comunicacao) | Recebe pedidos de notificacao de signatarios e alertas de expiracao |
| Sysadmin (Portal Admin) | Consultas de status e reconciliacao manual |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| E-Docs API V2 | Sistema externo | `https://api.e-docs.es.gov.br` (`/v2/...`) |
| Acesso Cidadao | Sistema externo | OAuth Client Credentials para servidor↔servidor |
| MinIO E-Docs | Sistema externo | Storage de upload temporario; URL devolvida pelo E-Docs |
| M005 (Autenticacao) | Modulo interno | Identidade do servidor capturador (`idPapel`) |
| M008 (Cadastros Corporativos) | Modulo interno | `Documento` canonico, `PessoaFisica` para signatarios |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| EnviarDocumentoParaAssinatura | Command | Enviar PDF de M008.Documento ao E-Docs com lista de signatarios; iniciar coleta | `documentoId`, `signatarios[{pessoaId, papel, ordem, tipo}]` | `SolicitacaoAssinatura` criada com `idEventoCapturaInicial` | RN01, RN02, RN03, RN04, RN10, RN11, RN12, RI2 | Documento existe e em `CRIADO`; PDF disponivel; nao ha solicitacao nao terminal para o mesmo Documento | DOCUMENTO_NAO_ENCONTRADO, DOCUMENTO_INVALIDO_PDF, DOCUMENTO_EXCEDE_LIMITE, SOLICITACAO_DUPLICADA, EDOCS_INDISPONIVEL | Sim por `documentoId` (retorna a solicitacao existente) | Modulo consumidor (M009/M022/M003/M010) | Comando interno |
| ConsultarStatusAssinatura | Query | Retornar estado atual de uma SolicitacaoAssinatura | `solicitacaoId` ou `documentoId` | `SolicitacaoAssinatura` com `estado`, `totalAssinados`, `totalRecusados`, lista de signatarios | RN05, RN09 | Solicitacao existe | SOLICITACAO_NAO_ENCONTRADA | N/A | Qualquer modulo interno autorizado | API interna a definir |
| BaixarDocumentoAssinado | Query | Devolver PDF assinado + manifesto apos `ASSINADA` | `solicitacaoId` ou `documentoId` | PDF binario + `hashAssinatura` + `protocoloAssinatura` | RN06 | Solicitacao em estado `ASSINADA`; PDF arquivado em M008 | SOLICITACAO_NAO_ASSINADA, DOCUMENTO_NAO_ENCONTRADO | Sim — bytes nao mudam apos arquivado | M008 (durante arquivamento), modulos consumidores ou Portal Admin | API interna a definir |
| CancelarSolicitacao | Command | Cancelar solicitacao ainda nao assinada | `solicitacaoId`, `motivo` | `SolicitacaoAssinatura` em estado `ERRO` (cancelada manualmente) | RN07 | Estado em `ENVIADA`, `AGUARDANDO_ASSINATURAS` ou `PARCIALMENTE_ASSINADA` | SOLICITACAO_TERMINAL | Nao | Sysadmin ou modulo consumidor | API interna a definir |
| ReconciliarSolicitacaoManualmente | Command | Forcar polling imediato em uma solicitacao especifica | `solicitacaoId` | Estado atualizado da solicitacao | RN05, RN09 | Solicitacao existe | SOLICITACAO_NAO_ENCONTRADA, EDOCS_INDISPONIVEL | Sim — polling e idempotente | Sysadmin | API interna a definir |

### Jobs

| Job | Tipo | Objetivo | Frequencia | Regras |
|-----|------|----------|------------|--------|
| ReconciliarAssinaturas | Job | Polling de status para todas SolicitacaoAssinatura em estado nao terminal | A cada 5 min | RN05, RN09 — chama `GET /v2/documentos/{idEdocs}` para cada solicitacao pendente |
| AlertarSolicitacoesExpirando | Job | Emitir `AssinaturaExpirando` para solicitacoes com > 25 dias sem conclusao | Diario as 09:00 | RN08 |
| MarcarSolicitacoesExpiradas | Job | Transicionar solicitacoes pendentes ha > 30 dias para `ERRO` | Diario as 03:00 | RN08, RI1 |

### Eventos publicados

| Evento | Quando | Carga util |
|--------|--------|-----------|
| `DocumentoAssinadoCompletamente` | Solicitacao chega em `ASSINADA` | `solicitacaoId`, `documentoId`, `protocoloAssinatura`, `hashAssinatura`, `dataCapturaFinal` |
| `DocumentoAssinadoParcialmente` | Cada nova assinatura individual | `solicitacaoId`, `documentoId`, `signatarioId`, `totalAssinados`, `totalAssinantes` |
| `AssinaturaRecusada` | Solicitacao chega em `RECUSADA` | `solicitacaoId`, `documentoId`, `signatarioRecusante`, `motivoRecusa` |
| `AssinaturaExpirando` | Solicitacao > 25 dias sem conclusao | `solicitacaoId`, `documentoId`, `dataEnvio`, `diasRestantes` |
| `ErroIntegracaoAssinatura` | Solicitacao chega em `ERRO` | `solicitacaoId`, `documentoId`, `tipoErro`, `mensagem` |

## Padrao de Payload e Erro

### Envelope de erro sugerido

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "documentoId": "DOC-2026-001"
    }
  }
}
```

## Exemplos JSON por Operacao

### EnviarDocumentoParaAssinatura

**Exemplo de entrada (Termo de Compromisso M009 com 5 signatarios)**

```json
{
  "documentoId": "DOC-2026-001",
  "tipo": "TERMO_COMPROMISSO_BOLSA",
  "signatarios": [
    { "pessoaId": "PES-2026-010", "papel": "Coordenador", "ordem": 1 },
    { "pessoaId": "PES-2026-011", "papel": "Orientador",  "ordem": 2 },
    { "pessoaId": "PES-2026-012", "papel": "Bolsista",    "ordem": 3 },
    { "pessoaId": "PES-2026-020", "papel": "DIRAF",       "ordem": 4 },
    { "pessoaId": "PES-2026-021", "papel": "DIPRE",       "ordem": 5 }
  ]
}
```

**Exemplo de saida**

```json
{
  "solicitacao": {
    "id": "SOL-2026-001",
    "documentoId": "DOC-2026-001",
    "estado": "ENVIADA",
    "idEventoCapturaInicial": "f1e2d3c4-...",
    "idArquivoMinIO": "8f9a1b2c-...",
    "totalAssinantes": 5,
    "dataEnvio": "2026-05-08T14:00:00Z",
    "dataExpiracao": "2026-06-07T14:00:00Z"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| DOCUMENTO_NAO_ENCONTRADO | O documento informado nao foi encontrado no M008. |
| DOCUMENTO_INVALIDO_PDF | O documento nao possui PDF valido (sem texto pesquisavel). |
| DOCUMENTO_EXCEDE_LIMITE | O PDF excede o limite de 250 MB do E-Docs. |
| SOLICITACAO_DUPLICADA | Ja existe solicitacao nao terminal para este documento (RI2). |
| EDOCS_INDISPONIVEL | A API E-Docs esta indisponivel; tentar novamente. |

### ConsultarStatusAssinatura

**Exemplo de saida**

```json
{
  "solicitacao": {
    "id": "SOL-2026-001",
    "documentoId": "DOC-2026-001",
    "idEdocs": "9b8a7c6d-...",
    "estado": "PARCIALMENTE_ASSINADA",
    "totalAssinantes": 5,
    "totalAssinados": 3,
    "totalRecusados": 0,
    "signatarios": [
      { "pessoaId": "PES-2026-010", "papel": "COORDENADOR", "estado": "ASSINOU",  "dataAssinatura": "2026-05-09T10:15:00Z" },
      { "pessoaId": "PES-2026-011", "papel": "ORIENTADOR",  "estado": "ASSINOU",  "dataAssinatura": "2026-05-10T08:30:00Z" },
      { "pessoaId": "PES-2026-012", "papel": "BOLSISTA",    "estado": "ASSINOU",  "dataAssinatura": "2026-05-10T14:45:00Z" },
      { "pessoaId": "PES-2026-020", "papel": "SERVIDOR",    "estado": "PENDENTE", "dataAssinatura": null },
      { "pessoaId": "PES-2026-021", "papel": "SERVIDOR",    "estado": "PENDENTE", "dataAssinatura": null }
    ]
  }
}
```

### BaixarDocumentoAssinado

**Exemplo de saida**

```json
{
  "documento": {
    "id": "DOC-2026-001",
    "protocoloAssinatura": "9b8a7c6d-...",
    "hashAssinatura": "a1b2c3d4...",
    "dataCapturaFinal": "2026-05-12T16:20:00Z",
    "urlConteudoAssinado": "https://storage.conecta.fapes.es.gov.br/docs/DOC-2026-001.pdf"
  }
}
```

### CancelarSolicitacao

**Exemplo de entrada**

```json
{
  "solicitacaoId": "SOL-2026-001",
  "motivo": "Documento substituido por nova versao."
}
```

**Excecoes e mensagens**

| Codigo | Mensagem |
|--------|----------|
| SOLICITACAO_TERMINAL | Solicitacao ja em estado terminal (ASSINADA/RECUSADA/ERRO); cancelamento rejeitado. |

---

## Referencias

- **Discovery interno**:
  - [integracoes/e-docs.md](../../../discovery/integracoes/e-docs.md) — passo a passo, sequence diagrams, scopes
  - [integracoes/organograma.md](../../../discovery/integracoes/organograma.md) — papel servidor
  - [glossario.md](../../../discovery/glossario.md)
- **Documentacao oficial (V2)** — fonte dos contratos remotos consumidos pelo adapter:
  - [Autenticacao](https://docs.e-docs.es.gov.br/api/Autenticacao) — `POST /is/connect/token`
  - [Documentos](https://docs.e-docs.es.gov.br/api/Documentos) — upload + captura
  - [Captura](https://docs.e-docs.es.gov.br/api/Captura) — endpoints por tipo
- **Sistemas integrados**: [Acesso Cidadao](https://acessocidadao.es.gov.br), [Organograma](https://api.organograma.es.gov.br)
- **Lei 14.063/20** — base juridica das assinaturas
- **Modulos consumidores**: [M008](../M008-cadastros-corporativos/contrato.md), [M009](../M009-gestao-bolsista/contrato.md), [M020](../M020-comunicacao/README.md), [M022](../M022-contratacao-outorga/contrato.md), [M003](../M003-gestao-projetos-captados/contrato.md), [M010](../M010-planejamento-estrategia/contrato.md)
