# EPI-08 — Configuracao de Programas e Areas Tecnicas

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |
| **Fonte no codigo** | `app/routers/programas.py`, `frontend/src/components/correction/ProgramConfigModal.tsx`, `frontend/src/hooks/useProgramConfig.ts`, `geraArquivosImportacao.py:ALLOWED_AREAS` |

## Jornada

Quando o recurso e do tipo `programas`, antes de gerar o JSONL o operador precisa mapear cada projeto a uma area tecnica. No `ProgramConfigModal` (com virtual scroll para centenas de projetos), o operador escolhe entre as quatro areas validas: **GEPED**, **NUPEX**, **GECAP**, **GEINOV**. O sistema impede que um mesmo projeto seja associado a duas areas diferentes. A configuracao e persistida em `dados_programas.json` no S3 via `POST /dados-programas` e pode ser relida via `GET /dados-programas`. Se o recurso nao for do tipo `programas`, ambos os endpoints respondem HTTP 409 — o operador precisa usar `/recurso-kind/switch` antes.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [M002](../../../implementation/modules/M002-importacao-editais/README.md) | Mapeamento projeto -> area tecnica | Done |

## User Stories

| ID | User Story |
|----|-----------|
| US-08-01 | Como operador, quero mapear cada projeto a uma area tecnica (GEPED, NUPEX, GECAP, GEINOV). |
| US-08-02 | Como sistema, quero impedir que um mesmo projeto apareca em mais de uma area. |
| US-08-03 | Como operador, quero salvar a configuracao para reuso em `/gerar-jsonl`. |
| US-08-04 | Como operador, quero que o modal suporte centenas de projetos com virtual scroll. |
| US-08-05 | Como sistema, quero exigir lock valido para salvar configuracao de programas. |
| US-08-06 | Como sistema, quero retornar 409 se o recurso nao for do tipo `programas`. |
| US-08-07 | Como operador, quero ver quando a configuracao foi salva pela ultima vez (`saved_at` HH:MM). |

## Cenarios de aceitacao do produto

- **4 areas permitidas**: `ALLOWED_AREAS = {GEPED, NUPEX, GECAP, GEINOV}`. Area fora dessa lista retorna erro de validacao.
- **Unicidade de projeto**: projeto nao pode aparecer em `areaTecnica` diferente; duplicacao retorna HTTP 400.
- **`GET /dados-programas?edital_id=...`**: le `dados_programas.json` do S3 no mes atual. Resposta:
  ```json
  {"edital_id": "...", "month_year": "MM_YYYY", "key": "...", "found": true,
   "allowed_areas": ["GEPED","NUPEX","GECAP","GEINOV"],
   "items": [{"edital": "...", "areaTecnica": "NUPEX", "projetos": ["PRJ001"]}],
   "saved_at": "14:32"}
  ```
- **`POST /dados-programas`**: body lista de `ProgramaItem`; exige `lock_token` valido quando `LOCKS_ENABLED=1`.
- **Auditoria S3**: put com `x-amz-meta-*` + `record_version_event`.
- **Tipo incorreto**: se o recurso for `editais`, ambos os endpoints retornam HTTP 409 com mensagem explicativa.
- **Modal virtualizado**: `ProgramConfigModal` usa virtual scroll proprio para centenas de projetos.
- **Obrigatoriedade em `/gerar-jsonl`**: quando `is_programa=true`, `dados_programas` ou `dados_programas.json` devem cobrir todos os projetos.
