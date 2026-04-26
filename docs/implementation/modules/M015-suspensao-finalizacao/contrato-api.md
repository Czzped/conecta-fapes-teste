# Contrato API - M015 Suspensao e Finalizacao

Dominio e regras de negocio: ver [README.md](README.md)
Contrato funcional: ver [contrato.md](contrato.md)

## Convencoes

- Base path sugerido: `/api/v1/m015`
- `iniciativaId` referencia uma `Iniciativa` gerenciada pelo M003.
- O M015 coordena o fluxo; bloqueios e verificacoes dependem de M004, M009 e M014.

## Endpoints

| Metodo | Path | Operacao | Descricao |
|--------|------|----------|-----------|
| POST | `/iniciativas/{iniciativaId}/suspensoes` | SolicitarSuspensaoIniciativa | Solicita suspensao temporaria |
| POST | `/suspensoes/{codigo}/decisao` | DecidirSolicitacaoSuspensao | Aprova ou rejeita suspensao |
| POST | `/iniciativas/{iniciativaId}/reativacoes` | ReativarIniciativaSuspensa | Reativa iniciativa suspensa |
| POST | `/iniciativas/{iniciativaId}/finalizacoes` | SolicitarFinalizacaoIniciativa | Solicita encerramento definitivo |
| GET | `/iniciativas/{iniciativaId}/pendencias-finalizacao` | ConsultarPendenciasDeFinalizacao | Consulta pendencias impeditivas |
| POST | `/finalizacoes/{codigo}/concluir` | ConcluirFinalizacaoIniciativa | Encerra iniciativa apos pendencias resolvidas |

## Erros

| HTTP | Codigo | Situacao |
|------|--------|----------|
| 400 | PAYLOAD_INVALIDO | Dados obrigatorios ausentes |
| 404 | INICIATIVA_NAO_ENCONTRADA | Iniciativa inexistente no M003 |
| 409 | INICIATIVA_JA_SUSPENSA | Iniciativa ja esta suspensa |
| 409 | INICIATIVA_JA_ENCERRADA | Iniciativa ja esta encerrada |
| 422 | INICIATIVA_EM_ENCERRAMENTO | Iniciativa em encerramento nao pode ser suspensa |
| 422 | PENDENCIAS_FINALIZACAO_ABERTAS | Existem pendencias impeditivas |
| 422 | REATIVACAO_INICIATIVA_NAO_PERMITIDA | Reativacao nao autorizada pela Area Tecnica |

## POST `/iniciativas/{iniciativaId}/suspensoes`

```json
{
  "origem": "ORTOGADO",
  "justificativa": "Iniciativa em replanejamento metodologico."
}
```

```json
{
  "solicitacaoSuspensao": {
    "codigo": "SS-2026-001",
    "estado": "SUBMETIDA"
  }
}
```

## POST `/suspensoes/{codigo}/decisao`

```json
{
  "aprovado": true,
  "justificativa": "Suspensao autorizada pela Area Tecnica."
}
```

```json
{
  "solicitacaoSuspensao": {
    "codigo": "SS-2026-001",
    "estado": "APROVADA"
  }
}
```

## POST `/iniciativas/{iniciativaId}/reativacoes`

```json
{
  "justificativa": "Pendencias regularizadas e iniciativa apta a retomar execucao."
}
```

```json
{
  "iniciativa": {
    "id": "INI-2026-014",
    "estado": "ATIVA"
  }
}
```

## POST `/iniciativas/{iniciativaId}/finalizacoes`

```json
{
  "motivo": "CONCLUSAO_NATURAL",
  "justificativa": "Metas executadas e iniciativa concluida."
}
```

```json
{
  "solicitacaoFinalizacao": {
    "codigo": "SF-2026-002",
    "estado": "SUBMETIDA"
  }
}
```

## GET `/iniciativas/{iniciativaId}/pendencias-finalizacao`

```json
{
  "iniciativaId": "INI-2026-014",
  "pendencias": [
    {
      "tipo": "PRESTACAO_PENDENTE",
      "descricao": "Prestacao de contas final ainda nao aprovada.",
      "impeditiva": true,
      "resolvida": false
    }
  ]
}
```

## POST `/finalizacoes/{codigo}/concluir`

```json
{
  "justificativa": "Todas as pendencias foram verificadas e resolvidas."
}
```

```json
{
  "iniciativa": {
    "id": "INI-2026-014",
    "estado": "ENCERRADA"
  }
}
```

## Autorizacao

| Endpoint | Perfis sugeridos |
|----------|------------------|
| `POST /iniciativas/{iniciativaId}/suspensoes` | ORTOGADO, ANALISTA_AGENCIA |
| `POST /suspensoes/{codigo}/decisao` | ANALISTA_AGENCIA |
| `POST /iniciativas/{iniciativaId}/reativacoes` | ANALISTA_AGENCIA |
| `POST /iniciativas/{iniciativaId}/finalizacoes` | ORTOGADO, ANALISTA_AGENCIA |
| `GET /iniciativas/{iniciativaId}/pendencias-finalizacao` | ORTOGADO, ANALISTA_AGENCIA |
| `POST /finalizacoes/{codigo}/concluir` | ANALISTA_AGENCIA |
