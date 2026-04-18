# Backlog — Importador SIGFAPES

[← Voltar ao Importador](README.md) | [Roadmap](../../management/roadmap.md)

> Versao: 2026-04-18
>
> Este backlog foi derivado da analise do codigo-fonte real em [`MateusLannes/importacao-conecta-backend`](https://github.com/MateusLannes/importacao-conecta-backend). Os EPICs EPI-01 a EPI-03 mantem os documentos originais; EPI-04 a EPI-18 sao listados aqui como capacidades ja implementadas identificadas a partir de routers, services, use cases e componentes.

---

## Visao geral dos EPICs

| Codigo | Titulo | Fonte no codigo | Status |
|--------|--------|-----------------|--------|
| [EPI-01](features/EPI-01-importacao-editais-selecao.md) | Listar e Selecionar Editais do SIGFAPES | `/editais-latest`, `EditaisPage.tsx` | Entregue |
| [EPI-02](features/EPI-02-completar-alocacoes.md) | Corrigir Planilha do Edital | `CorrectionPage.tsx`, `SpreadsheetEditor.tsx` | Entregue |
| [EPI-03](features/EPI-03-sincronizacao-sigfapes.md) | Gerar Arquivos de Importacao (JSONL) | `/gerar-jsonl`, `geraArquivosImportacao.py` | Entregue |
| [EPI-04](features/EPI-04-autenticacao-sessao.md) | Autenticacao e Sessao | `/auth/login`, `jwt_auth.py`, `AuthContext` | Entregue |
| [EPI-05](features/EPI-05-metricas-cobertura.md) | Metricas e Cobertura de Importacao | `/editais-grafico-metricas`, modo grafico | Entregue |
| [EPI-06](features/EPI-06-locks-exclusivos.md) | Locks Exclusivos por Recurso | `/locks/*`, `useLock.ts` | Entregue |
| [EPI-07](features/EPI-07-upload-validacao-planilha.md) | Upload e Validacao de Planilha Corrigida | `/validate-upload-planilha`, `/upload-planilha-corrigida` | Entregue |
| [EPI-08](features/EPI-08-configuracao-programas.md) | Configuracao de Programas e Areas Tecnicas | `/dados-programas`, `ProgramConfigModal` | Entregue |
| [EPI-09](features/EPI-09-alternancia-tipo-recurso.md) | Alternancia de Tipo Edital <-> Programa | `/recurso-kind/switch`, `KindSwitchModal` | Entregue |
| [EPI-10](features/EPI-10-historico-planilhas.md) | Historico de Planilhas Anteriores | `/planilhas-mes-passado`, `PreviousMonthModal` | Entregue |
| [EPI-11](features/EPI-11-geracao-planilha-base.md) | Geracao da Planilha Base a partir do Dump | `/cria-planilha-edital`, `planilha_edital.py` | Entregue |
| [EPI-12](features/EPI-12-consulta-dump-diagnostico.md) | Consulta de Dados Brutos para Diagnostico | `/bolsista-dump-json`, `BolsistaDumpModal` | Entregue |
| [EPI-13](features/EPI-13-jobs-assincronos.md) | Processamento Assincrono de Jobs | `?async=true`, `/jobs/{id}`, `job_worker.py` | Entregue |
| [EPI-14](features/EPI-14-integracao-airflow.md) | Integracao com Airflow (SigFapes2Conecta) | `/internal/airflow-check`, `/internal/airflow/trigger-sigfapes` | Entregue |
| [EPI-15](features/EPI-15-auditoria-versionamento.md) | Auditoria e Versionamento de Planilhas | `planilha_version_audit`, `x-amz-meta-*`, backfill | Entregue |
| [EPI-16](features/EPI-16-dump-adaptativo-sigfapes.md) | Dump Adaptativo do SIGFAPES | `sigfapes_dump_job.py` com `AdaptiveRateController` | Entregue |
| [EPI-17](features/EPI-17-dump-conecta.md) | Sincronizacao Conecta -> S3 | `conecta_dump_job.py` | Entregue |
| [EPI-18](features/EPI-18-operacoes-internas.md) | Operacoes Internas e Administracao | `/internal/*`, `INTERNAL_ALLOWED_ROLES` | Entregue |

---

## Modulo Backend

Todas as funcionalidades do Importador sao implementadas pelo modulo [M002 — Importacao de Editais](../../implementation/modules/M002-importacao-editais/README.md) (3 EPICs canonicos, todos Done).

Os EPICs EPI-04 a EPI-18 sao **capacidades transversais** observadas no codigo-fonte; nao possuem arquivo dedicado em `features/` ainda — este documento e a fonte de verdade.

---

## Detalhamento dos EPICs transversais

### EPI-04 — Autenticacao e Sessao

**Fonte:** `app/routers/auth.py`, `app/clients/supabase_auth.py`, `app/security/jwt_auth.py`, `frontend/src/contexts/AuthContext.tsx`, `frontend/src/components/auth/ProtectedRoute.tsx`

**Descricao:** Fluxo completo de autenticacao via Supabase Auth com email/senha. Tokens JWT entregues via cookie HttpOnly (`sb-access-token` + `sb-refresh-token`) e JSON. Validacao em todas as rotas protegidas usa JWKS publico do Supabase com cache de 1 hora e verifica `iss`, `aud` e algoritmo.

**User Stories:**

| ID | User Story | Endpoint/componente |
|----|-----------|---------------------|
| US-04-01 | Como operador, quero fazer login com email e senha para acessar a ferramenta. | `POST /auth/login` |
| US-04-02 | Como operador, quero manter minha sessao entre reloads (sessionStorage) sem reautenticar. | `AuthContext` |
| US-04-03 | Como operador, quero ser redirecionado para `/login` se minha sessao expirar. | `ProtectedRoute` |
| US-04-04 | Como sistema, quero validar JWT em todas as rotas protegidas via Bearer ou cookie. | `require_authenticated_user` |
| US-04-05 | Como operador, quero fazer logout e limpar cookies + sessionStorage. | `AuthContext.logout()` |

---

### EPI-05 — Metricas e Cobertura de Importacao

**Fonte:** `app/routers/editais.py:get_editais_grafico_metricas`, `app/services/editais.py:get_editais_grafico_metricas`, `frontend/src/pages/EditaisPage.tsx` (modo grafico)

**Descricao:** Visao grafica de cobertura de importacao cruzando o ultimo dump SIGFAPES com o ultimo dump Conecta. Calcula alocacoes (total FAPES vs importadas), auditoria de IDs (matched/unmatched) e ativos por edital.

**User Stories:**

| ID | User Story | Endpoint/componente |
|----|-----------|---------------------|
| US-05-01 | Como operador, quero visualizar cobertura de importacao em modo grafico. | `/editais-grafico-metricas` |
| US-05-02 | Como operador, quero alternar entre modo lista e modo grafico mantendo filtros. | `EditaisPage.tsx:setViewMode` |
| US-05-03 | Como operador, quero ver IDs SIGFAPES nao presentes no Conecta (e vice-versa). | `allocation_importacao_ativos_por_edital` |
| US-05-04 | Como sistema, quero retornar modo degradado (zeros + warnings) quando S3_BUCKET nao esta configurado. | Router fallback |

---

### EPI-06 — Locks Exclusivos por Recurso

**Fonte:** `app/routers/locks.py`, `app/services/locks.py`, `frontend/src/hooks/useLock.ts`, migration `20260227_create_resource_locks.sql`

**Descricao:** Controle de exclusividade por `resource_key = <MM_YYYY>/<kind>/<edital_id>`. Lock com TTL (1800s default), heartbeat automatico 45s e grace de 120s. Indice unico parcial `WHERE released_at IS NULL` garante uma so sessao ativa por recurso.

**User Stories:**

| ID | User Story | Endpoint |
|----|-----------|----------|
| US-06-01 | Como operador, quero adquirir lock exclusivo ao abrir edital. | `POST /locks/acquire` |
| US-06-02 | Como operador, quero ser impedido de editar recurso ja bloqueado, com dono e expiracao visiveis. | 409 `{locked_by, expires_at}` |
| US-06-03 | Como operador, quero que meu lock seja renovado automaticamente a cada 45s. | `POST /locks/heartbeat` |
| US-06-04 | Como operador, quero liberar lock ao sair (`manual`, `completed`, `abandon`). | `POST /locks/release` |
| US-06-05 | Como sistema, quero permitir takeover apos `LOCK_HEARTBEAT_GRACE_SECONDS` sem heartbeat. | Indice em `expires_at` |
| US-06-06 | Como operador, quero listar meus locks ativos. | `GET /locks/me` |
| US-06-07 | Como operador, quero consultar status de multiplos editais simultaneamente para renderizar badges. | `POST /locks/batch-status` |

---

### EPI-07 — Upload e Validacao de Planilha Corrigida

**Fonte:** `app/routers/upload.py`, `app/use_cases/upload_use_case.py`, `app/services/validacao_upload.py`, `geraArquivosImportacao.py:collect_all_planilha_validation_errors`

**Descricao:** Pipeline de upload em 2 etapas: validacao sem persistencia (retorna erros, warnings e diff) seguida de upload com controle otimista por `base_version`. Rejeita layout legado (2 niveis) e exige o layout novo (5 niveis). Extrai automaticamente `bolsista_ids` das mensagens de erro.

**User Stories:**

| ID | User Story | Endpoint |
|----|-----------|----------|
| US-07-01 | Como operador, quero validar a planilha sem salvar para receber feedback antes de confirmar. | `POST /validate-upload-planilha` |
| US-07-02 | Como operador, quero ver um resumo (delta) de celulas/linhas alteradas. | `compute_planilha_diff` |
| US-07-03 | Como sistema, quero rejeitar o layout legado (2 niveis) e exigir o layout novo (5 niveis). | `_validate_planilha_layout_or_raise` |
| US-07-04 | Como operador, quero que a validacao nunca retorne 4xx — sempre `{ok:false, errors:[]}`. | Router sem HTTPException em erro de negocio |
| US-07-05 | Como operador, quero controle otimista por `base_version` para evitar sobrescrever edicao alheia. | 409 em conflito |
| US-07-06 | Como sistema, quero extrair `bolsista_ids` das mensagens de erro para realcar celulas na UI. | `_extract_bolsista_ids_from_message` |
| US-07-07 | Como sistema, quero versionar a planilha no S3 com prefixo `<N>_<DD_MM_YYYY>_` e registrar em auditoria. | `POST /upload-planilha-corrigida` |

---

### EPI-08 — Configuracao de Programas e Areas Tecnicas

**Fonte:** `app/routers/programas.py`, `frontend/src/components/correction/ProgramConfigModal.tsx`, `frontend/src/hooks/useProgramConfig.ts`

**Descricao:** Quando o recurso e do tipo "programas", o operador mapeia cada projeto para uma das 4 areas tecnicas (GEPED, NUPEX, GECAP, GEINOV). O modal usa virtual scroll proprio. Validacoes impedem duplicidade de projeto entre areas.

**User Stories:**

| ID | User Story | Endpoint/componente |
|----|-----------|---------------------|
| US-08-01 | Como operador, quero mapear cada projeto a uma area tecnica (GEPED/NUPEX/GECAP/GEINOV). | `ProgramConfigModal` |
| US-08-02 | Como sistema, quero impedir que um mesmo projeto apareca em mais de uma area. | Validacao no service |
| US-08-03 | Como operador, quero salvar a configuracao para reuso posterior em `/gerar-jsonl`. | `POST /dados-programas` |
| US-08-04 | Como operador, quero que o modal suporte milhares de projetos sem travar (virtual scroll). | `ProgramConfigModal` |
| US-08-05 | Como sistema, quero exigir lock valido para salvar configuracao de programas. | `validate_write_lock` |
| US-08-06 | Como sistema, quero retornar 409 se o recurso nao for do tipo `programas`. | Router `get_dados_programas` |

---

### EPI-09 — Alternancia de Tipo Edital ↔ Programa

**Fonte:** `app/routers/planilhas.py:switch_resource_kind`, `app/use_cases/switch_resource_kind_use_case.py`, `frontend/src/components/correction/KindSwitchModal.tsx`, migrations `resource_kind_state` + `resource_kind_switch_log`

**Descricao:** Troca explicita do tipo ativo do recurso com clone da ultima versao da planilha para o novo tipo e migracao de lock. Registra em log dedicado com chaves de origem/destino.

**User Stories:**

| ID | User Story | Endpoint |
|----|-----------|----------|
| US-09-01 | Como operador, quero trocar o tipo do recurso (editais → programas ou inverso). | `POST /recurso-kind/switch` |
| US-09-02 | Como operador, quero confirmar explicitamente (`confirm: true`) para evitar troca acidental. | DTO |
| US-09-03 | Como sistema, quero clonar a ultima versao para o novo tipo mantendo historico. | `clone_latest_historico_version_between_kinds` |
| US-09-04 | Como sistema, quero migrar o lock atual para a nova `resource_key` sem perder a sessao. | Service de locks |
| US-09-05 | Como sistema, quero registrar em `resource_kind_switch_log` (from, to, cloned keys, ator). | Tabela |

---

### EPI-10 — Historico de Planilhas Anteriores

**Fonte:** `app/routers/planilhas.py:list_previous_month_sheets`, `/planilhas-mes-passado/download`, `frontend/src/components/correction/PreviousMonthModal.tsx`

**Descricao:** Consulta e download de planilhas corrigidas do mes anterior para o edital, incluindo ambos os tipos (editais e programas) quando existirem. Integra com auditoria quando `AUDIT_DB_ENABLED=1`.

**User Stories:**

| ID | User Story | Endpoint |
|----|-----------|----------|
| US-10-01 | Como operador, quero listar planilhas do mes anterior para consulta. | `GET /planilhas-mes-passado` |
| US-10-02 | Como operador, quero ver ambos os tipos (editais e programas) no mesmo resultado. | Listagem dupla |
| US-10-03 | Como operador, quero baixar uma planilha historica. | `GET /planilhas-mes-passado/download` |
| US-10-04 | Como operador, quero ver metadados de auditoria (ator, acao, timestamp) de cada versao. | Integracao com `planilha_version_audit` |

---

### EPI-11 — Geracao da Planilha Base a partir do Dump

**Fonte:** `app/routers/planilhas.py:create_planilha_edital`, `app/use_cases/create_planilha_edital_use_case.py`, `planilha_edital.py`, `frontend/src/components/correction/SheetSetupModal.tsx`

**Descricao:** Geracao do XLSX pre-preenchido a partir do ultimo dump SIGFAPES. 4 fetches S3 paralelos (bolsistas, projetos, editais, relatorio beneficiario), calculos vetorizados de datas e meses de atividade, montagem com `xlsxwriter`. Suporta modo `?async=true`.

**User Stories:**

| ID | User Story | Endpoint |
|----|-----------|----------|
| US-11-01 | Como operador, quero gerar a planilha base a partir do dump mais recente do SIGFAPES. | `POST /cria-planilha-edital` |
| US-11-02 | Como operador, quero que a planilha contenha ate 5 niveis de bolsa (layout novo). | `planilha_edital.py` |
| US-11-03 | Como operador, quero que datas e meses de atividade sejam calculados automaticamente. | `np.where` vetorizado |
| US-11-04 | Como operador, quero que dados bancarios venham do `relatorio_beneficiario.json` ou CSV Banestes. | `SIGFAPES_BANESTES_CSV_KEY` |
| US-11-05 | Como sistema, quero impedir recriar planilha se ja existir no mes atual. | `ensure_first_planilha_can_be_created` (409) |
| US-11-06 | Como operador, quero gerar de forma assincrona editais muito grandes. | `?async=true` + `/jobs/{id}` |
| US-11-07 | Como sistema, quero registrar a primeira versao como `action=create_initial` na auditoria. | `record_version_event` |

---

### EPI-12 — Consulta de Dados Brutos para Diagnostico

**Fonte:** `app/routers/planilhas.py:get_bolsista_dump_json`, `frontend/src/components/correction/BolsistaDumpModal.tsx`

**Descricao:** Acesso ao JSON bruto de um bolsista no ultimo dump SIGFAPES para diagnostico. Filtra o Parquet por `edital_id` + `formulario_bolsa_id` e retorna registros sem transformacao.

**User Stories:**

| ID | User Story | Endpoint |
|----|-----------|----------|
| US-12-01 | Como operador tecnico, quero consultar o JSON bruto de um bolsista para diagnostico. | `GET /bolsista-dump-json` |
| US-12-02 | Como operador, quero ver de qual `dump_prefix`/`source_key` vieram os dados. | Resposta inclui metadados |

---

### EPI-13 — Processamento Assincrono de Jobs

**Fonte:** `app/routers/jobs.py`, `app/services/jobs.py`, `app/use_cases/job_executor.py`, `scripts/job_worker.py`, migration `20260402_create_import_jobs.sql`

**Descricao:** Fila de jobs no Postgres para operacoes pesadas (gerar planilha e gerar JSONL). Worker dedicado faz polling a cada `ASYNC_JOBS_POLL_INTERVAL_SECONDS` (default 5s), claim → execute → complete/fail. Controlado por feature flag `ASYNC_JOBS_ENABLED`.

**User Stories:**

| ID | User Story | Endpoint |
|----|-----------|----------|
| US-13-01 | Como operador, quero enfileirar geracao de planilha/JSONL e receber `job_id` em 202. | `?async=true` |
| US-13-02 | Como operador, quero consultar status do job via polling. | `GET /jobs/{job_id}` |
| US-13-03 | Como operador, quero ver o resultado ou mensagem de erro do job. | Campos `result`/`error` |
| US-13-04 | Como sistema, quero restringir consulta ao owner do job OU role interno. | Validacao em `get_job_status` |
| US-13-05 | Como infra, quero worker que processa jobs continuamente com logs por evento. | `scripts/job_worker.py` |

---

### EPI-14 — Integracao com Airflow

**Fonte:** `app/routers/internal.py`, `app/services/airflow_check.py`, `app/services/airflow_trigger.py`, `scripts/check_airflow.py`

**Descricao:** Integracao para diagnostico e trigger manual da DAG `SigFapes2Conecta` (configuravel via `AIRFLOW_SIGFAPES_DAG_ID`). Healthcheck identifica estado de detected/authenticated/healthy.

**User Stories:**

| ID | User Story | Endpoint |
|----|-----------|----------|
| US-14-01 | Como infra, quero diagnosticar conectividade Airflow (health + auth + DAGs). | `GET /internal/airflow-check` |
| US-14-02 | Como infra, quero disparar a DAG `SigFapes2Conecta` com conf `{mes, tipo, numero}`. | `POST /internal/airflow/trigger-sigfapes` |
| US-14-03 | Como sistema, quero inferir automaticamente o `tipo` quando nao informado. | `resolve_historico_kind_and_keys` |
| US-14-04 | Como infra, quero diagnostico CLI equivalente ao endpoint. | `python scripts/check_airflow.py` |

---

### EPI-15 — Auditoria e Versionamento de Planilhas

**Fonte:** `app/services/planilha_audit_service.py`, `app/services/s3_audit_metadata.py`, `app/routers/internal.py:/internal/planilha-audit/backfill`, migration `20260406_create_planilha_version_audit.sql`

**Descricao:** Auditoria em tres camadas: metadados S3 (`x-amz-meta-*`), tabela `planilha_version_audit` no Postgres e logs JSON. Cobre 4 acoes: `create_initial`, `upload_corrigida`, `switch_clone`, `legacy_backfill`. Backfill manual para versoes pre-existentes.

**User Stories:**

| ID | User Story | Endpoint/componente |
|----|-----------|---------------------|
| US-15-01 | Como operador, quero ver quem gerou ou corrigiu cada versao (ator, email, timestamp). | `planilha_version_audit` |
| US-15-02 | Como sistema, quero gravar metadados S3 (`x-amz-meta-*`) em cada put para redundancia. | `build_s3_audit_metadata` |
| US-15-03 | Como sistema, quero registrar `switch_clone` quando um recurso muda de tipo. | Evento na tabela |
| US-15-04 | Como infra, quero backfill de auditoria para arquivos anteriores ao sistema. | `POST /internal/planilha-audit/backfill` |
| US-15-05 | Como sistema, quero modo strict que falha o write se auditoria DB falhar. | `AUDIT_DB_STRICT=1` |

---

### EPI-16 — Dump Adaptativo do SIGFAPES

**Fonte:** `scripts/sigfapes_dump_job.py`

**Descricao:** Job offline que consome a API HTTP SIGFAPES em 3 fases paralelas (EDITAIS, PROJETOS, BOLSISTAS). Cada fase tem `AdaptiveRateController` proprio: ajusta RPM dinamicamente com base em P95 de latencia e taxa de erro, em janelas de `SIGFAPES_CONTROL_WINDOW_SECONDS` (default 60s). Produz Parquets + JSONs + marker `dump_complete.json`.

**User Stories:**

| ID | User Story | Artefato |
|----|-----------|----------|
| US-16-01 | Como sistema, quero baixar editais, projetos e bolsistas do SIGFAPES periodicamente. | `scripts/sigfapes_dump_job.py` |
| US-16-02 | Como sistema, quero ajustar RPM dinamicamente para maximizar throughput sem sobrecarregar o SIGFAPES. | `AdaptiveRateController` |
| US-16-03 | Como infra, quero configurar RPM minimo/maximo e fator de aumento/reducao por env. | `SIGFAPES_RATE_*` |
| US-16-04 | Como infra, quero override por fase (EDITAIS/PROJETOS/BOLSISTAS). | `SIGFAPES_<phase>_*` |
| US-16-05 | Como sistema, quero escrever marker `dump_complete.json` somente quando todas as fases terminarem. | Idempotencia |
| US-16-06 | Como infra, quero logs JSON por fase (RPM, P95, retries) para tuning. | Logs estruturados |

---

### EPI-17 — Sincronizacao Conecta → S3

**Fonte:** `scripts/conecta_dump_job.py`, `app/services/conecta_dump.py`

**Descricao:** Job que copia Parquets do MinIO do Conecta para o bucket S3 consumido pelo Importador. Usado para cruzar com dumps SIGFAPES em `/editais-grafico-metricas`.

**User Stories:**

| ID | User Story | Artefato |
|----|-----------|----------|
| US-17-01 | Como sistema, quero copiar Parquets do MinIO Conecta para o S3 do Importador. | `scripts/conecta_dump_job.py` |
| US-17-02 | Como sistema, quero marker `dump_complete.json` para sinalizar integridade. | Idempotencia |
| US-17-03 | Como backend, quero identificar o dump Conecta mais recente para metricas. | `conecta_dump.select_latest_complete_conecta_dump_prefix` |

---

### EPI-18 — Operacoes Internas e Administracao

**Fonte:** `app/routers/internal.py`, `app/security/jwt_auth.py:require_internal_role`, `app/core/validation.py:ensure_internal_role`

**Descricao:** Rotas sob `/internal/*` que exigem role no JWT em `INTERNAL_ALLOWED_ROLES` (default `admin,service_role`). Cobrem diagnostico Airflow, trigger de DAG, backfill de auditoria e operacoes privilegiadas em jobs.

**User Stories:**

| ID | User Story | Endpoint |
|----|-----------|----------|
| US-18-01 | Como admin, quero acessar rotas internas apenas com role autorizada. | `require_internal_role` |
| US-18-02 | Como admin, quero consultar job de qualquer usuario. | `GET /jobs/{id}` com role interno |
| US-18-03 | Como admin, quero executar diagnostico e trigger de DAG. | `/internal/airflow-*` |
| US-18-04 | Como admin, quero backfill de auditoria em escopo arbitrario. | `/internal/planilha-audit/backfill` |

---

## Dependencias entre EPICs

```
EPI-16 (Dump SIGFAPES)  ─┐
EPI-17 (Dump Conecta)   ─┼─> Parquets no S3
                          │
EPI-04 (Autenticacao) ────┤
                          ├─> EPI-01 (Listar editais) ──> EPI-05 (Metricas)
                          │
                          └─> EPI-11 (Gerar planilha) ──> EPI-02 (Corrigir)
                                                              │
                              EPI-06 (Locks) ────────────────┤
                              EPI-07 (Upload/Validacao) ─────┤
                              EPI-08 (Programas) ────────────┤
                              EPI-09 (Trocar tipo) ──────────┤
                              EPI-10 (Historico) ────────────┤
                              EPI-12 (Dados brutos) ─────────┘
                                         │
                                         ▼
                                    EPI-03 (Gerar JSONL)
                                         │
                              ┌──────────┼──────────┐
                              ▼          ▼          ▼
                         EPI-13       EPI-14      EPI-15
                        (Jobs)      (Airflow)   (Auditoria)
                                         │
                                         ▼
                                    EPI-18 (Internal Admin)
```

---

## Relacao com Roadmap

Features do Importador sao rastreadas em [releases-2026.csv](../../management/releases-2026.csv) como produto "IMPORTADOR". A entrega principal foi a reformulacao completa do fluxo de correcao com lock exclusivo, versionamento auditado e virtual scroll para editais volumosos.

Documentos relacionados:

- [Arquitetura](architecture.md)
- [Tecnologia](technology.md)
- [Backend](backend-structure.md)
- [Frontend](frontend-structure.md)
- [Referencia de API](api-reference.md)
- [Setup](setup.md)
