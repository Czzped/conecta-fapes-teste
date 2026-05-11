# Adapter E-Docs — Mapeamento V2

[← Voltar ao adapter](README.md) | [M023](../README.md) | [Discovery completo](../../../../discovery/integracoes/e-docs.md)

## Autenticacao

| Operacao | Endpoint | Fluxo OAuth |
|----------|----------|-------------|
| Token de aplicacao (Conecta backend) | `POST https://acessocidadao.es.gov.br/is/connect/token` | Client Credentials |
| Login do signatario (cidadao) | `https://acessocidadao.es.gov.br/is/connect/authorize` | Hybrid / Authorization Code (executado pelo navegador do signatario, fora do M023) |

Token e enviado em header `Authorization: Bearer {access_token}` (RFC 6750).

### Scopes V2

| Scope | Uso pelo M023 |
|-------|---------------|
| `api-sigades-consultar` | Polling: `GET /v2/eventos/{id}`, `GET /v2/documentos/{id}` |
| `api-sigades-documento` | Upload + captura: `GET upload-arquivo/gerar-url-upload`, `POST capturar/...` |
| `api-sigades-encaminhamento` | Quando aplicavel — encaminhamento entre setores apos assinatura |
| `api-organograma` | Consultas diretas ao Organograma (opcional, se M024 nao cobrir) |

Token deve ser cacheado ate `expires_in` e renovado proativamente. Reutilizar entre requisicoes.

---

## Mapeamento Comandos M023 → Endpoints V2

| Comando M023 | Sequencia E-Docs |
|--------------|------------------|
| `EnviarDocumentoParaAssinatura(documentoId, signatarios[])` | 1) `GET /v2/documentos/upload-arquivo/gerar-url-upload/{tamanho}` → recebe `{ url, body, idArquivo }` <br> 2) `POST {url}` multipart com `body{...}` + arquivo PDF binario → 204 <br> 3) `POST /v2/documentos/capturar/nato-digital/auto-assinado/servidor` com lista de assinantes → 202 + `idEvento` <br> 4) `GET /v2/eventos/{idEvento}` ate `status=Executado` → recebe `idDocumento` |
| `ConsultarStatusAssinatura(solicitacaoId)` | `GET /v2/documentos/{idDocumento}` → retorna `{ assinaturas[], capturadoFinal, totalAssinantes, totalAssinados }` |
| `BaixarDocumentoAssinado(solicitacaoId)` | `GET /v2/documentos/{idDocumento}/conteudo` → PDF binario com manifesto de assinaturas embutido |
| `CancelarSolicitacao(solicitacaoId, motivo)` | Operacao apenas local no M023; E-Docs V2 nao expoe cancelamento direto. M023 marca solicitacao como `ERRO` subcategoria CANCELAMENTO_MANUAL e ignora eventos futuros do `idEdocs` |

---

## Endpoints E-Docs V2 consumidos

### Upload + captura

```
GET /v2/documentos/upload-arquivo/gerar-url-upload/{tamanhoBytes}
Authorization: Bearer {token}

→ 200 OK
{
  "url": "https://minio.e-docs.es.gov.br/edocs-tmp/...",
  "body": {
    "key": "edocs-tmp/abc123/arquivo.pdf",
    "policy": "...",
    "x-amz-credential": "...",
    "x-amz-signature": "..."
  },
  "idArquivo": "8f9a1b2c-3d4e-5f6a-7b8c-9d0e1f2a3b4c"
}
```

> **Atencao**: a URL retornada **expira em segundos**. Adapter deve fazer o POST do arquivo imediatamente.

```
POST {url}
Content-Type: multipart/form-data

(todos os campos de body + file: arquivo binario)

→ 204 No Content
```

### Capturar com assinantes

```
POST /v2/documentos/capturar/nato-digital/auto-assinado/servidor
Authorization: Bearer {token}
Content-Type: application/json

{
  "idArquivo": "8f9a1b2c-...",
  "idPapel": "11111111-...",
  "idClasseDocumental": "aaaaaaaa-...",
  "resumo": "Termo de Compromisso de Bolsa - PES-2026-012",
  "valorLegal": "Original",
  "natureza": "NatoDigital",
  "genero": "Textual",
  "assinantes": [
    { "tipo": "Servidor", "idPapel": "..." },
    { "tipo": "Servidor", "idPapel": "..." },
    { "tipo": "Cidadao",  "idPapel": "..." }
  ],
  "restricaoAcesso": { "transparenciaAtiva": true }
}

→ 202 Accepted
{ "idEvento": "f1e2d3c4-...", "capturado": false }
```

### Polling do evento

```
GET /v2/eventos/{idEvento}
Authorization: Bearer {token}

→ 200 OK
{
  "idEvento": "f1e2d3c4-...",
  "tipo": "CapturaDocumento",
  "status": "Executado",
  "idDocumento": "9b8a7c6d-..."
}
```

### Polling do documento (status das assinaturas)

```
GET /v2/documentos/{idDocumento}
Authorization: Bearer {token}

→ 200 OK
{
  "id": "9b8a7c6d-...",
  "capturadoFinal": false,
  "totalAssinantes": 5,
  "totalAssinados": 3,
  "assinaturas": [
    { "idAssinante": "...", "assinou": true,  "dataAssinatura": "2026-05-09T10:15:00Z" },
    { "idAssinante": "...", "assinou": true,  "dataAssinatura": "2026-05-10T08:30:00Z" },
    { "idAssinante": "...", "assinou": true,  "dataAssinatura": "2026-05-10T14:45:00Z" },
    { "idAssinante": "...", "assinou": false, "dataAssinatura": null },
    { "idAssinante": "...", "assinou": false, "dataAssinatura": null }
  ]
}
```

### Download do PDF assinado

```
GET /v2/documentos/{idDocumento}/conteudo
Authorization: Bearer {token}

→ 200 OK (PDF binario com manifesto de assinaturas)
```

---

## Mapeamento de tipos de captura por cenario

| Cenario | Endpoint |
|---------|----------|
| Nato-digital + multiplos assinantes E-Docs | `POST /v2/documentos/capturar/nato-digital/auto-assinado/{servidor\|cidadao}` |
| Nato-digital + so capturador assina | `POST /v2/documentos/fase-assinatura/enviar/{servidor\|cidadao}` |
| Nato-digital ICP-Brasil (assinado externamente) | `POST /v2/documentos/capturar/nato-digital/icp-brasil/{servidor\|cidadao}` |
| Copia digital | `POST /v2/documentos/capturar/nato-digital/copia/{servidor\|cidadao}` |
| Digitalizado (escaneado) | `POST /v2/documentos/capturar/digitalizado/{servidor\|cidadao}` |

> M023 atual implementa apenas o primeiro cenario (multiplos assinantes E-Docs). Outros cenarios entram conforme necessidade dos modulos consumidores.

---

## Tratamento de erros

| HTTP do E-Docs | Mapeamento M023 |
|----------------|------------------|
| `400` (payload invalido) | `SOLICITACAO_DADOS_INVALIDOS` ao consumidor; persiste `EventoAssinatura` ERRO |
| `401` (token invalido/expirado) | Renova token e tenta novamente uma vez; se persistir, escala para sysadmin |
| `403` (sem permissao) | `EDOCS_PERMISSAO_NEGADA`; verifica scopes; persiste evento ERRO |
| `404` (documento/evento inexistente) | `EDOCS_RECURSO_NAO_ENCONTRADO`; pode indicar inconsistencia entre M023 e E-Docs (forcar reconciliacao) |
| `409` (estado invalido) | `EDOCS_CONFLITO_ESTADO`; reanalisar antes de acao |
| `422` (regra de negocio) | `EDOCS_REGRA_VIOLADA`; mensagem repassada ao consumidor |
| `5xx` | Retentativa com backoff exponencial; apos 10 falhas consecutivas em polling, transita Solicitacao para `ERRO` |

## Pendencias do adapter

1. Confirmar com PRODEST se existe webhook ou apenas polling (V2 nao documenta webhook).
2. Tamanho exato da URL temporaria de upload (segundos para expiracao).
3. Estrutura completa do payload de recusa (formato do campo de motivo).
4. Cadastro previo do signatario externo no Acesso Cidadao — automatico ou manual?
5. PDF/A obrigatorio ou PDF padrao serve.
6. Rate limit + SLA dos ambientes.

Ver pendencias completas em [discovery/integracoes/e-docs.md](../../../../discovery/integracoes/e-docs.md#pendencias-de-discovery-atualizadas-com-docs-v2).
