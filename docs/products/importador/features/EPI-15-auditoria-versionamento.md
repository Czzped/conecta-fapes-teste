# EPI-15 — Auditoria e Versionamento de Planilhas

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |
| **Fonte no codigo** | `app/services/planilha_audit_service.py`, `app/services/s3_audit_metadata.py`, `app/routers/internal.py:/internal/planilha-audit/backfill`, migration `migrations/20260406_create_planilha_version_audit.sql` |

## Jornada

Toda operacao de escrita sobre planilhas produz um registro auditavel em tres camadas simultaneas: (1) **metadados S3** — cada PUT grava headers `x-amz-meta-user-id`, `x-amz-meta-user-email`, `x-amz-meta-action`, `x-amz-meta-request-id` no proprio objeto; (2) **banco Supabase** — linha em `planilha_version_audit` com `month_year, kind, edital_id, version, s3_key, action, actor_user_id, actor_email, request_id, created_at`; (3) **logs JSON estruturados** correlacionados por `X-Request-ID`. As quatro acoes auditadas sao `create_initial`, `upload_corrigida`, `switch_clone` e `legacy_backfill`. Para arquivos existentes antes do sistema de auditoria, admins podem rodar `POST /internal/planilha-audit/backfill` que varre o S3 de um escopo (`month_year`, opcional `edital_id` e `kind`) e insere eventos `legacy_backfill`. Quando `AUDIT_DB_STRICT=1`, falhas ao gravar na tabela cancelam o PUT no S3; quando `=0`, a falha e apenas logada.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [M002](../../../implementation/modules/M002-importacao-editais/README.md) | Auditoria tripla de planilhas | Done |

## User Stories

| ID | User Story |
|----|-----------|
| US-15-01 | Como operador, quero ver quem gerou e editou cada versao de planilha (ator, email, timestamp). |
| US-15-02 | Como sistema, quero gravar metadados S3 (`x-amz-meta-*`) em cada PUT para redundancia. |
| US-15-03 | Como sistema, quero registrar `create_initial`, `upload_corrigida`, `switch_clone` em tabela dedicada. |
| US-15-04 | Como admin, quero rodar backfill para arquivos historicos como `legacy_backfill`. |
| US-15-05 | Como sistema, quero opcao strict que cancela o PUT no S3 se auditoria DB falhar. |
| US-15-06 | Como operador, quero propagar `X-Request-ID` em toda operacao para correlacao nos logs. |

## Cenarios de aceitacao do produto

- **Tripla gravacao**: toda escrita em `historicoCorrecoesPlanilhas/` ou `planilhaBase/` grava: metadata S3 + linha audit + log estruturado.
- **`planilha_version_audit`**: `UNIQUE (month_year, kind, edital_id, version)` e `UNIQUE (s3_key)` previnem duplicatas; indices facilitam query por escopo e por ator.
- **Acoes validas**: `{create_initial, upload_corrigida, switch_clone, legacy_backfill}` (enum por CHECK constraint).
- **`build_s3_audit_metadata`**: gera dict com `user-id`, `user-email`, `action`, `request-id` a partir de claims + ContextVar.
- **`POST /internal/planilha-audit/backfill`**: body `{month_year, edital_id?, kind?, actor_user_id?}`; retorna `{ok, inserted_count, skipped_count}`.
- **Strict mode** (`AUDIT_DB_STRICT=1`): falha de INSERT gera rollback do PUT S3 (delete do objeto recem-criado).
- **Lenient mode** (`AUDIT_DB_STRICT=0`, default): falha logada como warning `event=audit_write_skipped`.
- **Query por escopo**: servico `list_events_by_scope(month_year, edital_id?, kind?)` retorna eventos ordenados por `version DESC`.
- **Endpoint `/planilha-selecionada`**: cruza historico S3 com audit DB para exibir `last_action`, `last_action_at`, `last_actor_email` do arquivo atual.
- **Versao zero**: primeira planilha base e `version=0`, uploads subsequentes incrementam.
