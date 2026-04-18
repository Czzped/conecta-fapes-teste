# EPI-07 — Upload e Validacao de Planilha Corrigida

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |
| **Fonte no codigo** | `app/routers/upload.py`, `app/use_cases/upload_use_case.py`, `app/services/validacao_upload.py`, `geraArquivosImportacao.py:collect_all_planilha_validation_errors`, `frontend/src/hooks/useUploadPlanilha.ts`, `frontend/src/components/correction/ValidationSidebar.tsx` |

## Jornada

Apos editar a planilha no `SpreadsheetEditor`, o operador clica em "Validar". O frontend envia o XLSX em base64 via `POST /validate-upload-planilha` — esse endpoint **nunca** retorna 4xx por falha de validacao: sempre responde 200 com `{ok: true/false, errors: [], warnings: [], diff: {...}}`. As regras aplicadas: layout novo com 5 niveis de bolsa (rejeita layout legado de 2 niveis), datas validas e intervalos coerentes, `BOLSA VALOR_*` inteiros, campos obrigatorios (`ID SIGFAPES BOLSISTA`, `CPF`, `BOLSISTA`) e `edital_id` casando com a planilha. A `ValidationSidebar` mostra erros agrupados, warnings e diff (`changed_cells`, `changed_rows`, `added_count`, `removed_count`). Se erros bloqueantes, botao "Salvar" e desabilitado. Quando aprovado, `POST /upload-planilha-corrigida` envia com `lock_token` e `base_version` para controle otimista: se a versao atual no S3 for diferente de `base_version`, retorna HTTP 409. Em sucesso, escreve `<N+1>_<DD_MM_YYYY>_....xlsx` com metadata S3 de auditoria e registra evento `upload_corrigida` em `planilha_version_audit`.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [M002](../../../implementation/modules/M002-importacao-editais/README.md) | Validacao e upload de planilha | Done |

## User Stories

| ID | User Story |
|----|-----------|
| US-07-01 | Como operador, quero validar a planilha antes de enviar e receber erros e warnings claros. |
| US-07-02 | Como operador, quero ver um resumo do delta (celulas alteradas, linhas adicionadas/removidas) antes de confirmar. |
| US-07-03 | Como sistema, quero rejeitar o layout legado (2 niveis) e exigir o layout novo (5 niveis). |
| US-07-04 | Como operador, quero que a validacao sempre retorne 200 com erros no payload (nunca 4xx). |
| US-07-05 | Como operador, quero ser protegido contra sobrescrita por controle otimista (`base_version`). |
| US-07-06 | Como sistema, quero extrair `bolsista_ids` de mensagens de erro para realcar celulas. |
| US-07-07 | Como sistema, quero versionar a planilha com prefixo numerico `<N>_` e registrar em auditoria. |

## Cenarios de aceitacao do produto

- **`POST /validate-upload-planilha`**: body `{edital_id, kind, data_url}`; resposta sempre 200 com `{ok, errors, warnings, diff}`; nao requer lock.
- **Layout novo obrigatorio**: colunas `BOLSA NIVEL_1..5`, `BOLSA VALOR_1..5`, `60 DA BOLSA_1..5`, `MESES DE ATIVIDADE_1..5`, `TOTAL DEVE RECEBER_1..5`. Layout legado (2 niveis) gera erro.
- **Campos obrigatorios**: `ID SIGFAPES BOLSISTA`, `CPF`, `BOLSISTA`.
- **Validacao de datas**: intervalos coerentes, sem vencimento invertido.
- **Valores inteiros**: `BOLSA VALOR_*` deve ser inteiro; valores fracionados sao erro.
- **Extracao de IDs em erros**: regex `id_sigfapes_bolsista\s*[=:]\s*([^\n;|)]+)` lista `bolsista_ids` afetados.
- **Summary curto**: cada erro tem `message` completo e `summary` (primeiro trecho antes de `;`).
- **Diff**: compara com versao atual no S3; retorna `changed_cells`, `changed_rows`, `added_count`, `removed_count`, `no_current_version`.
- **`POST /upload-planilha-corrigida`**: requer `lock_token` (se `LOCKS_ENABLED=1`) e `base_version`. HTTP 409 em conflito de versao.
- **Versionamento S3**: novo arquivo `<N+1>_<DD_MM_YYYY>_....xlsx` em `historicoCorrecoesPlanilhas/`.
- **Metadata S3**: `x-amz-meta-user-id`, `x-amz-meta-user-email`, `x-amz-meta-action`, `x-amz-meta-request-id` em toda escrita.
- **Auditoria DB**: evento `upload_corrigida` em `planilha_version_audit` com versao, ator e request_id.
- **Content-Type**: apenas `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (xlsx); Base64 deve comecar com assinatura `PK`.
