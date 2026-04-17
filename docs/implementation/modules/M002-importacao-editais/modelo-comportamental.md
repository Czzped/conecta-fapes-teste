# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

O comportamento do M002 se expressa em: (a) ciclos de vida dos recursos gerenciados (planilha, lock, tipo ativo, job de importacao) e (b) fluxos de orquestracao operacional, desde a producao diaria do dump SIGFAPES ate a geracao dos JSONLs de importacao.

## Ciclos de vida

### Planilha (por `kind + MM_YYYY + edital_id`)

```mermaid
stateDiagram-v2
    [*] --> Inexistente

    Inexistente --> Inicial : POST /cria-planilha-edital (v1)
    Inicial --> Corrigida : POST /upload-planilha-corrigida (v2+)
    Corrigida --> Corrigida : upload de nova versao (v3, v4, ...)
    Inicial --> Clonada : POST /trocar-tipo (clone para kind alternativo)
    Corrigida --> Clonada : POST /trocar-tipo

    Inicial : entry / registra em planilha_version_audit action=create_initial
    Corrigida : entry / valida upload, registra action=upload_corrigida
    Clonada : entry / copia v-mais-recente para kind alvo, registra action=switch_clone

    Corrigida --> [*] : JSONL gerado (planilha permanece disponivel)
```

### ResourceLock

```mermaid
stateDiagram-v2
    [*] --> Ativo : POST /locks/acquire
    Ativo --> Ativo : POST /locks/heartbeat (a cada 45s)
    Ativo --> Liberado : POST /locks/release
    Ativo --> Expirado : heartbeat > expires_at
    Ativo --> Tomado : takeover com razao justificada

    Liberado : exit / released_at preenchido, reason=released
    Expirado : exit / released_at preenchido, reason=expired
    Tomado : exit / released_at preenchido, reason=takeover

    Liberado --> [*]
    Expirado --> [*]
    Tomado --> [*]
```

### ResourceKindState

```mermaid
stateDiagram-v2
    [*] --> Editais : estado default

    Editais --> Programas : POST /trocar-tipo (clone realizado)
    Programas --> Editais : POST /trocar-tipo (clone realizado)

    Editais : entry / active_kind=editais
    Programas : entry / active_kind=programas

    Editais --> [*]
    Programas --> [*]
```

Cada transicao grava uma linha em `resource_kind_switch_log`.

### ImportJob

```mermaid
stateDiagram-v2
    [*] --> Pending : POST /gerar-jsonl (assincrono)
    Pending --> Running : worker pega o job
    Running --> Completed : JSONLs publicados no S3
    Running --> Failed : erro, attempts < limite
    Failed --> Running : retry (attempts++)
    Failed --> [*] : attempts >= limite

    Completed --> [*]
```

## Fluxo: Producao diaria dos dumps (SIGFAPES + Conecta)

Dois jobs independentes abastecem o S3 de trabalho. O backend nunca acessa o SIGFAPES em tempo de request — apenas le os Parquets e JSONs ja publicados.

### Dump SIGFAPES (API HTTP)

```mermaid
sequenceDiagram
    participant Op as Operador/Scheduler
    participant Job as scripts/sigfapes_dump_job.py
    participant Auth as FAPES_URL_AUTH
    participant API as FAPES_URL_CONSULTA
    participant S3 as S3 (dump_sigfapes/DD_MM_YYYY/)

    Op->>Job: executa (cron diario ou trigger)
    Job->>S3: HEAD dump_complete.json
    alt ja concluido hoje
        S3-->>Job: 200
        Job-->>Op: no-op (idempotencia)
    else nao concluido
        Job->>Auth: POST {username, password}
        Auth-->>Job: token
        loop AdaptiveRateController (janelas de 60s)
            Job->>API: POST {token, funcao=editais|projetos|bolsistas}
            API-->>Job: payload JSON
        end
        Job->>Job: converte para Parquet (pyarrow)
        Job->>S3: PUT editais.json / editais.parquet
        Job->>S3: PUT projetos_por_edital.json / .parquet
        Job->>S3: PUT bolsistas_projeto.jsonl / .parquet
        Job->>S3: PUT bolsistas_por_edital.json
        Job->>S3: PUT dump_complete.json
    end
```

### Dump Conecta (MinIO -> S3)

```mermaid
sequenceDiagram
    participant Op as Operador/Scheduler
    participant Job as scripts/conecta_dump_job.py
    participant MinIO as MinIO Conecta (ConectaFapes/)
    participant S3 as S3 (dump_conecta/DD_MM_YYYY/)

    Op->>Job: executa
    Job->>S3: HEAD dump_complete.json
    alt ja concluido
        Job-->>Op: no-op
    else nao concluido
        loop cada Parquet mapeado
            Job->>MinIO: GET <Source>.parquet
            MinIO-->>Job: bytes
            Job->>S3: PUT <target>.parquet
        end
        Job->>S3: PUT dump_complete.json
    end
```

## Fluxo: Autenticacao e listagem de editais

```mermaid
sequenceDiagram
    participant U as Operador
    participant FE as Frontend (React)
    participant API as Backend FastAPI
    participant SB as Supabase Auth
    participant S3 as S3

    U->>FE: informa email + senha
    FE->>API: POST /auth/login
    API->>SB: signInWithPassword
    SB-->>API: access_token + refresh_token
    API-->>FE: cookies HttpOnly + usuario
    FE->>API: GET /editais-latest (Bearer)
    API->>S3: GetObject editais.parquet
    API->>S3: GetObject bolsistas.parquet
    API->>API: contagem por edital + flag novo_este_mes (60d)
    API->>API: verifica planilhas ja criadas por edital
    API-->>FE: lista de editais com contagem e status
    FE-->>U: renderiza EditaisPage
```

## Fluxo: Geracao da planilha inicial e ciclo de lock

```mermaid
sequenceDiagram
    participant U as Operador
    participant FE as Frontend
    participant API as Backend
    participant S3 as S3
    participant DB as Supabase

    U->>FE: seleciona edital na listagem
    FE->>API: POST /locks/acquire (resource_key)
    API->>DB: insert resource_locks (unique ativo)
    alt lock ocupado por outro operador
        API-->>FE: 409 Conflict + dono atual
        FE-->>U: exibe quem esta com o recurso
    else lock adquirido
        DB-->>API: lock_token
        API-->>FE: {lock_token, expires_at}
        FE->>API: POST /cria-planilha-edital
        par fetches S3 paralelos
            API->>S3: GetObject editais.parquet
            API->>S3: GetObject projetos.parquet
            API->>S3: GetObject bolsistas.parquet
            API->>S3: GetObject relatorio_beneficiario.json
        end
        API->>API: vetoriza effective_end, MESES_DE_ATIVIDADE, total
        API->>API: monta XLSX (xlsxwriter) com 5 niveis
        API->>S3: PUT planilhas/editais/MM_YYYY/{id}/v1.xlsx
        API->>DB: insert planilha_version_audit action=create_initial
        API-->>FE: {s3_key, version=1}
        FE->>API: GET planilha (download base64)
        FE-->>U: renderiza SpreadsheetEditor com virtual scroll
        loop a cada 45s
            FE->>API: POST /locks/heartbeat (lock_token)
            API->>DB: update heartbeat_at, expires_at
        end
        U->>FE: sai da pagina / fecha aba
        FE->>API: POST /locks/release (lock_token)
        API->>DB: set released_at, reason=released
    end
```

## Fluxo: Correcao, validacao e upload da planilha

```mermaid
sequenceDiagram
    participant U as Operador
    participant FE as Frontend
    participant API as Backend
    participant S3 as S3
    participant DB as Supabase

    U->>FE: edita celulas, datas, contas
    FE->>FE: validacoes em tempo real (9 regras)
    U->>FE: clica "Validar upload"
    FE->>API: POST /validate-upload-planilha (arquivo base64)
    API->>S3: GetObject versao vigente
    API->>API: parse XLSX + diff linha a linha
    API-->>FE: {errors[], warnings[], diff}
    FE-->>U: ValidationSidebar com contagem
    alt erros bloqueantes
        U->>FE: corrige no editor, re-valida
    else tudo ok ou so warnings aceitos
        U->>FE: clica "Enviar"
        FE->>API: POST /upload-planilha-corrigida (version=N)
        API->>DB: verifica lock_token ativo do ator
        API->>API: valida integridade e cabecalhos
        API->>S3: PUT planilhas/.../v{N+1}.xlsx
        API->>DB: insert planilha_version_audit action=upload_corrigida
        API-->>FE: {version: N+1, s3_key}
        FE-->>U: toast de sucesso
    end
```

## Fluxo: Troca do tipo de recurso (editais <-> programas)

```mermaid
sequenceDiagram
    participant U as Operador
    participant FE as Frontend
    participant API as Backend
    participant S3 as S3
    participant DB as Supabase

    U->>FE: escolhe "Alternar para programas"
    FE->>API: POST /trocar-tipo (edital_id, month_year)
    API->>DB: verifica lock ativo do ator no kind origem
    API->>S3: GetObject versao mais recente (kind origem)
    API->>S3: PUT versao clonada no kind destino
    API->>DB: insert planilha_version_audit action=switch_clone
    API->>DB: upsert resource_kind_state active_kind=destino
    API->>DB: insert resource_kind_switch_log
    API-->>FE: {active_kind, cloned_target_key}
    FE-->>U: sidebar exibe novo tipo ativo
```

## Fluxo: Geracao dos arquivos de importacao (JSONL)

```mermaid
sequenceDiagram
    participant U as Operador
    participant FE as Frontend
    participant API as Backend
    participant S3 as S3
    participant DB as Supabase

    U->>FE: clica "Gerar arquivos de importacao"
    FE->>API: POST /gerar-jsonl (edital_id, month_year)
    API->>DB: SELECT active_kind em resource_kind_state
    API->>DB: valida lock ativo
    API->>S3: verifica dados-programas.json (mapeamento completo)
    alt mapeamento incompleto
        API-->>FE: 422 lista de projetos faltantes
        FE-->>U: ProgramConfigModal para completar mapeamento
    else mapeamento ok
        API->>DB: insert import_jobs status=pending
        API-->>FE: 202 {job_id}
        FE->>API: GET /jobs/{id} (polling)
        API->>DB: update status=running
        API->>S3: GetObject planilha ativa
        API->>S3: GetObject Parquets de referencia
        API->>API: geraArquivosImportacao (editais, projetos, pessoas, alocacoes)
        API->>S3: PUT importacao/MM_YYYY/{id}/*.jsonl
        API->>DB: update status=completed + result
        API-->>FE: {status: completed, arquivos[]}
        FE-->>U: lista de arquivos gerados com links S3
    end
```

## Invariantes comportamentais

- **Exclusividade de edicao**: nenhuma operacao de escrita em planilha (cria-planilha, upload-corrigida, trocar-tipo) avanca sem lock_token ativo do ator solicitante.
- **Consistencia de tipo**: a geracao de JSONL sempre consulta `resource_kind_state` antes de escolher a planilha fonte, evitando divergencia entre o que foi corrigido e o que foi exportado.
- **Auditoria total**: toda versao produzida (inicial, upload, clone) tem uma linha em `planilha_version_audit` com ator, request_id e motivo.
- **Heartbeat obrigatorio**: falha em emitir heartbeat a cada 45s leva o lock a `expires_at` e permite takeover por outro operador.
- **Versionamento monotonico**: versoes so crescem; nao ha "rollback" destrutivo - para reverter, o operador sobe uma nova versao com o conteudo desejado.
