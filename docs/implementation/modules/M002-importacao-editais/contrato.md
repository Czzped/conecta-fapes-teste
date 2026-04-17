# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M002 como contexto tecnico de selecao, correcao assistida e geracao de arquivos de importacao para o ConectaFAPES a partir de dumps periodicos do sistema legado SigFapes. O modulo recebe dumps tabulares (Parquet/JSON) gerados por um job externo, monta uma planilha de correcao por edital, registra versoes das correcoes aplicadas por um operador e produz os arquivos JSONL consumidos pelos modulos donos de dominio para ingestao final.

O modulo nao e dono das entidades de negocio sincronizadas; ele expoe operacoes de aplicacao para selecionar um edital, adquirir posse exclusiva do recurso, versionar correcoes e materializar os arquivos finais de importacao.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Operador do Importador (equipe tecnica) | Lista editais, adquire lock, corrige planilhas, envia uploads e dispara geracao de JSONL |
| [Importador (frontend)](../../../products/importador/README.md) | UI que consome integralmente a API do M002 |
| M003 e demais modulos operacionais | Recebem os JSONL finais para ingerir Editais, Projetos, Alocacoes e Bolsistas |
| Job Airflow (SigFapes2Conecta) | Produz os dumps Parquet que alimentam o M002 e, opcionalmente, e disparado ao final do fluxo |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| Dump SigFapes em S3 | Entrada de dados | Parquets `bolsistas_projeto`, `projetos_por_edital`, `editais` e JSON `relatorio_beneficiario`, gerados por job externo |
| S3 (bucket unico) | Armazenamento | Dump de entrada, planilhas corrigidas versionadas, configuracao de programas e JSONL de saida |
| Supabase (Postgres) | Persistencia de controle | Tabelas de lock, classificacao edital/programa, auditoria de planilhas e log de switches |
| Supabase Auth | Autenticacao | JWT Bearer; cookies HttpOnly para sessao |
| Airflow | Orquestrador externo | DAG `SigFapes2Conecta` disparada opcionalmente para processar os JSONL gerados |
| M003 | Modulo interno | Ownership canonico de Edital, Projeto, AlocacaoBolsista, Bolsista, Coordenador |
| M008 | Modulo interno | Ownership canonico de PessoaFisica e AreaTecnica |
| M001 | Modulo interno | Ownership canonico de VersaoNivel (referenciada pelos 5 niveis de bolsa na planilha) |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| AutenticarOperador | Command | Autenticar operador e iniciar sessao | email, senha | Tokens de acesso/refresh + cookies HttpOnly | RN11 | Credencial valida no Supabase Auth | Credenciais invalidas, provedor indisponivel | N/A | Publica | `POST /auth/login` |
| ListarEditaisDoUltimoDump | Query | Exibir editais do dump mais recente anotados com status de importacao e contagem de bolsistas | `include_importados` | Lista de editais com `edital_id`, nome, `qtd_bolsistas`, `ja_importado`, `novo_este_mes` | RN09, RNF01 | Existe ao menos um dump completo em S3 | Dump nao encontrado, S3 indisponivel | Sim (consulta pura) | Operador | `GET /editais-latest` |
| ConsultarMetricasDeImportacao | Query | Obter metricas agregadas de alocacao, auditoria e ativos por edital | — | Tres blocos de metricas (importacao, auditoria, ativos por edital) | — | Dump Conecta e dump SigFapes disponiveis | S3 indisponivel, bucket nao configurado | Sim | Operador | `GET /editais-grafico-metricas` |
| AdquirirLockDoRecurso | Command | Obter posse exclusiva sobre `{month_year}/{kind}/{edital_id}` para correcao | edital_id, kind | Lock ativo com token, `expires_at`, `heartbeat_at` | RN01 | Recurso sem lock ativo de outro usuario | Recurso ja sob lock de outro operador | Sim (retorna o mesmo lock para o proprio usuario) | Operador | `POST /locks/acquire` |
| RenovarLockDoRecurso | Command | Estender validade do lock ativo | resource_key, lock_token | `expires_at` e `heartbeat_at` atualizados | RN06 | Lock ativo com token valido | Token invalido, lock expirado | Sim | Operador | `POST /locks/heartbeat` |
| LiberarLockDoRecurso | Command | Encerrar posse do recurso | resource_key, lock_token, motivo | Lock marcado como liberado | RN01 | Lock ativo | Token invalido | Sim | Operador | `POST /locks/release` |
| ConsultarLocksAtivosDoUsuario | Query | Listar locks ativos do chamador | — | Lista de locks | RN01 | — | — | Sim | Operador | `GET /locks/me` |
| ConsultarStatusDeLocksEmLote | Query | Obter status de lock de varios editais | edital_ids, month_year | Mapa `edital_id -> {locked, locked_by, expires_at}` | RN01 | — | — | Sim | Operador | `POST /locks/batch-status` |
| DescobrirTipoDoRecurso | Query | Identificar se o recurso esta sendo tratado como `editais` ou `programas` | edital_id | kind ativo, chave S3 e historico | RN05 | — | Historico inexistente, conflito entre tipos | Sim | Operador | `GET /recurso-kind` |
| CriarPlanilhaInicialDoEdital | Command | Gerar a planilha base (versao 0) do edital a partir dos dumps | edital_id, is_programa | Chave S3 da planilha gerada | RN02, RN03, RN07, RNF01, RNF02, RNF03 | Dumps disponiveis, nao existe planilha inicial para o recurso | Primeira planilha ja existente, dados ausentes | Nao | Operador | `POST /cria-planilha-edital` (opcional `?async=true`) |
| ObterPlanilhaSelecionada | Query | Baixar a planilha corrigida mais recente em base64 | edital_id | XLSX base64 + metadata (version, kind, last_action) | RN02 | Planilha existente para o recurso | Planilha nao encontrada | Sim | Operador + lock recomendado | `GET /planilha-selecionada` |
| ListarPlanilhasDoMesAnterior | Query | Listar versoes corrigidas do mes anterior para consulta | edital_id | Lista de versoes `{kind, filename, version, last_action, actor_email}` | RN10 | — | — | Sim | Operador | `GET /planilhas-mes-passado` |
| BaixarPlanilhaDoMesAnterior | Query | Download XLSX de versao historica | edital_id, kind, filename | Arquivo XLSX | RN10 | Arquivo existente | Arquivo nao encontrado | Sim | Operador | `GET /planilhas-mes-passado/download` |
| VisualizarBolsistaNoDump | Query | Inspecionar registro bruto do bolsista no dump SigFapes | edital_id, formulario_bolsa_id | Registros JSON, prefixo e chave de origem | RNF01 | Dump disponivel | Registro nao encontrado | Sim | Operador | `GET /bolsista-dump-json` |
| ValidarUploadDePlanilha | Query | Validar uma planilha candidata sem persistir | edital_id, kind, data_url | `errors[]`, `warnings[]`, `diff` | RN04 | — | — | Sim | Operador | `POST /validate-upload-planilha` |
| EnviarPlanilhaCorrigida | Command | Persistir uma nova versao da planilha com validacao e versao otimista | edital_id, kind, base_version, lock_token, data_url | Nova versao versionada + metadata S3 | RN01, RN02, RN04, RN10, RNF01 | Lock valido, base_version = latest_version, layout valido | Conflito de versao, lock invalido, layout invalido | Nao | Operador | `POST /upload-planilha-corrigida` |
| UploadDeArquivoBruto | Command | Upload de arquivo arbitrario para um path controlado (uso tecnico) | name, content_type, data_url, path | Chave S3 gravada | — | Caminho nao existente ou permitido | Arquivo ja existe | Nao | Operador | `POST /upload` |
| TrocarTipoDoRecurso | Command | Alternar recurso entre `editais` e `programas` clonando a ultima versao | edital_id, target_kind, lock_token, confirm | Chaves de origem e destino, novo lock | RN01, RN05, RN10 | Lock valido, confirm=true, nao ha recurso ativo no destino | Conflito de tipo, lock invalido | Nao | Operador | `POST /recurso-kind/switch` |
| ConsultarDadosDeProgramas | Query | Obter configuracao de areas tecnicas para um edital tratado como programa | edital_id | `items[] { edital, areaTecnica, projetos[] }`, `allowed_areas`, `saved_at` | RN08 | Recurso classificado como `programas` | — | Sim | Operador | `GET /dados-programas` |
| SalvarDadosDeProgramas | Command | Persistir mapeamento projeto -> area tecnica | edital_id, lock_token, items[] | Arquivo `dados_programas.json` gravado em S3 | RN01, RN08 | Lock valido, todos projetos mapeados a area permitida | Area invalida, projeto ausente, lock invalido | Sim por conteudo | Operador | `POST /dados-programas` |
| GerarArquivosJsonlDeImportacao | Command | Gerar os JSONL de importacao a partir da planilha corrigida | edital_id, is_programa, dados_programas?, lock_token | Lista de chaves S3 dos JSONL | RN01, RN02, RN03, RNF01, RNF04 | Lock valido, planilha corrigida existente | Lock invalido, planilha inexistente, S3 indisponivel | Sim (mesma planilha + mesma config -> mesmo conteudo) | Operador | `POST /gerar-jsonl` (opcional `?async=true`) |
| ConsultarStatusDeJobAssincrono | Query | Acompanhar jobs disparados em modo assincrono | job_id | Estado do job (pending/processing/completed/failed) | RNF04 | Job existente | Job inexistente, chamador nao autorizado | Sim | Operador ou servico | `GET /jobs/{job_id}` |
| ConsultarStatusDoServico | Query | Healthcheck publico e status de configuracao | — | `{ ok, time_utc, s3_bucket_configured }` | — | — | — | Sim | Publica | `GET /status`, `GET /health` |

## Padrao de Payload e Erro

- O transporte concreto e HTTP/JSON (FastAPI). Datas em ISO 8601. Arquivos binarios trafegam como `data_url` base64 nas operacoes de planilha.
- Operacoes de validacao de planilha nunca retornam 4xx por regra de negocio violada: o resultado e exposto no corpo (`ok=false`, `errors[]`, `warnings[]`) para que a UI possa exibir a sidebar de erros sem tratamento de excecao.

**Envelope de erro**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "resource_key": "02_2026/editais/7777"
    }
  }
}
```

## Exemplos JSON por Operacao

### AdquirirLockDoRecurso

**Exemplo de entrada**

```json
{
  "edital_id": "7777",
  "kind": "editais"
}
```

**Exemplo de saida**

```json
{
  "ok": true,
  "resource_key": "02_2026/editais/7777",
  "lock_token": "c2f4e8a0-9a1b-4e19-8a2f-3e6d9c4b77aa",
  "expires_at": "2026-04-17T18:40:00Z",
  "heartbeat_at": "2026-04-17T17:40:00Z",
  "owner_user_id": "u_abc123",
  "owner_email": "operador@agencia.gov.br"
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| RECURSO_EM_USO | Recurso em uso por outro operador. Tente novamente apos a expiracao. |
| LOCKS_DESABILITADOS | Locks desabilitados na configuracao do servico. |

### CriarPlanilhaInicialDoEdital

**Exemplo de entrada**

```json
{
  "edital_id": "7777",
  "is_programa": "NAO"
}
```

**Exemplo de saida**

```json
{
  "ok": true,
  "bucket": "conecta-fapes-importador",
  "key": "editais_corrigidos/02_2026/editais/7777/historicoCorrecoesPlanilhas/0_17_04_2026.xlsx"
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PLANILHA_INICIAL_JA_EXISTE | Ja existe uma planilha inicial criada para este recurso. |
| DADOS_DO_DUMP_AUSENTES | Nao foram encontrados dados do edital no dump SigFapes mais recente. |
| SIGFAPES_DUMP_INDISPONIVEL | Nao foi possivel acessar o dump do SigFapes neste momento. |

### ValidarUploadDePlanilha

**Exemplo de entrada**

```json
{
  "edital_id": "7777",
  "kind": "editais",
  "data_url": "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBB..."
}
```

**Exemplo de saida**

```json
{
  "ok": false,
  "errors": [
    {
      "message": "FIM DAS ATIVIDADES anterior ao INICIO DAS ATIVIDADES (id_sigfapes_bolsista = [123456, 123457])",
      "summary": "FIM DAS ATIVIDADES anterior ao INICIO DAS ATIVIDADES",
      "bolsista_ids": ["123456", "123457"]
    }
  ],
  "warnings": [],
  "diff": {
    "changed_cells": 12,
    "changed_rows": 4,
    "added_count": 0,
    "removed_count": 0,
    "no_current_version": false
  }
}
```

**Excecoes e mensagens**

- Nao retorna 4xx por regra violada. Erros e diff sao sempre entregues no corpo.

### EnviarPlanilhaCorrigida

**Exemplo de entrada**

```json
{
  "edital_id": "7777",
  "kind": "editais",
  "base_version": 3,
  "lock_token": "c2f4e8a0-9a1b-4e19-8a2f-3e6d9c4b77aa",
  "data_url": "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBB..."
}
```

**Exemplo de saida**

```json
{
  "ok": true,
  "bucket": "conecta-fapes-importador",
  "kind": "editais",
  "key": "editais_corrigidos/02_2026/editais/7777/historicoCorrecoesPlanilhas/4_17_04_2026.xlsx",
  "filename": "4_17_04_2026.xlsx",
  "version": 4,
  "base_version": 3,
  "latest_version": 4
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CONFLITO_DE_VERSAO | Conflito de versao: base_version informada nao corresponde a latest_version atual. |
| LOCK_INVALIDO | Lock invalido ou expirado para o recurso informado. |
| LAYOUT_INVALIDO | A planilha enviada nao respeita o layout obrigatorio. |

### GerarArquivosJsonlDeImportacao

**Exemplo de entrada (edital simples)**

```json
{
  "edital_id": "7777",
  "is_programa": false,
  "lock_token": "c2f4e8a0-9a1b-4e19-8a2f-3e6d9c4b77aa"
}
```

**Exemplo de saida**

```json
{
  "ok": true,
  "bucket": "conecta-fapes-importador",
  "keys": [
    "editais_corrigidos/02_2026/importacao/7777/bolsistas.jsonl",
    "editais_corrigidos/02_2026/importacao/7777/projetos.jsonl",
    "editais_corrigidos/02_2026/importacao/7777/alocacoes.jsonl"
  ]
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| LOCK_INVALIDO | Lock invalido ou expirado para o recurso informado. |
| PLANILHA_CORRIGIDA_AUSENTE | Nao foi encontrada planilha corrigida para gerar o JSONL. |
| CONFIG_PROGRAMAS_INVALIDA | A configuracao de programas nao atende as areas permitidas ou tem projetos ausentes. |

### TrocarTipoDoRecurso

**Exemplo de entrada**

```json
{
  "edital_id": "7777",
  "target_kind": "programas",
  "lock_token": "c2f4e8a0-9a1b-4e19-8a2f-3e6d9c4b77aa",
  "confirm": true
}
```

**Exemplo de saida**

```json
{
  "ok": true,
  "from_kind": "editais",
  "to_kind": "programas",
  "cloned_from_key": "editais_corrigidos/02_2026/editais/7777/historicoCorrecoesPlanilhas/4_17_04_2026.xlsx",
  "cloned_to_key": "editais_corrigidos/02_2026/programas/7777/historicoCorrecoesPlanilhas/0_17_04_2026.xlsx",
  "lock": {
    "resource_key": "02_2026/programas/7777",
    "lock_token": "d4e5f6a7-b8c9-4d01-8e2f-1234567890ab",
    "expires_at": "2026-04-17T18:45:00Z"
  }
}
```

## Mapeamento de Transporte

- Todas as operacoes sao expostas via HTTP REST por um backend FastAPI.
- Autenticacao: JWT Bearer obrigatorio em todas as rotas (exceto `/auth/login`, `/status` e `/health`). Tokens tambem podem trafegar em cookies HttpOnly (`sb-access-token`, `sb-refresh-token`).
- Operacoes longas (`CriarPlanilhaInicialDoEdital`, `GerarArquivosJsonlDeImportacao`) podem ser executadas em modo assincrono (`?async=true`), caso em que retornam `job_id` rastreavel em `/jobs/{job_id}`.
- Locks sao mantidos via heartbeat periodico disparado pelo frontend a cada 45 segundos.
- Integracoes externas: S3 (boto3) para storage, Supabase REST para tabelas de controle e autenticacao, Airflow REST para disparo da DAG `SigFapes2Conecta`.

## Eventos e Efeitos Colaterais

- `CriarPlanilhaInicialDoEdital` le `bolsistas_projeto.parquet`, `projetos_por_edital.parquet`, `editais.parquet` e `relatorio_beneficiario.json`, calcula colunas derivadas (`effective_end`, `MESES_DE_ATIVIDADE`, `60_DA_BOLSA_N`, `total_deve_receber_N`) e grava a versao 0 em `editais_corrigidos/{month_year}/{kind}/{edital_id}/historicoCorrecoesPlanilhas/`.
- `EnviarPlanilhaCorrigida` incrementa `latest_version`, grava o XLSX com metadata de auditoria (usuario, email, timestamp) e registra em `planilha_audit_log` quando auditoria persistente esta habilitada.
- `TrocarTipoDoRecurso` clona o ultimo XLSX para o novo `kind`, cria novo lock e registra o switch em `resource_kind_switch_log`.
- `GerarArquivosJsonlDeImportacao` recupera a planilha corrigida mais recente, combina com o dump SigFapes e grava tres JSONL em `importacao/{edital_id}/`. Pode disparar opcionalmente a DAG Airflow via `POST {AIRFLOW_BASE_URL}/dags/{AIRFLOW_SIGFAPES_DAG_ID}/dagRuns`.
- Liberacoes de lock por heartbeat ausente (apos `LOCK_TTL_SECONDS + LOCK_HEARTBEAT_GRACE_SECONDS`) sao realizadas passivamente na proxima consulta ao `resource_locks`.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- EPICs: [EPIC-M002-001](epics/EPIC-M002-001.md), [EPIC-M002-002](epics/EPIC-M002-002.md), [EPIC-M002-003](epics/EPIC-M002-003.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
- Contrato HTTP: [contrato-api.md](contrato-api.md)
- Produto consumidor: [Importador SIGFAPES](../../../products/importador/README.md)
- ADR da arquitetura do produto: [ADR-011](../../../architecture/adr/ADR-011-arquitetura-importador-sigfapes.md)
