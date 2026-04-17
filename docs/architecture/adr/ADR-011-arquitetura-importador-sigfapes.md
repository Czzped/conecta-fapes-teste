# ADR-011: Arquitetura do Importador SIGFAPES

| Atributo | Valor |
|----------|-------|
| **Status** | Aceita |
| **Data** | 2026-04-17 |
| **Autores** | Time de Arquitetura ConectaFAPES |
| **Modulos impactados** | M002 |

## Contexto

O Importador SIGFAPES e um produto operado pela equipe tecnica para trazer dados do sistema legado SIGFAPES para o ConectaFAPES. As opcoes historicas eram (a) consumir Web Services sincronos do SIGFAPES em tempo de request, (b) rodar a importacao direto contra a base legado ou (c) exportar dados em batch e trabalhar sobre copias imutaveis.

A opcao (a) foi descartada porque o SIGFAPES nao expoe endpoints estaveis o suficiente para suportar a carga; (b) foi descartada por risco operacional (o SIGFAPES e sistema vivo e nao pode receber queries pesadas em horario comercial). Alem disso, a correcao dos dados exige etapa humana com validacao - datas inconsistentes, contas bancarias desatualizadas e bolsistas com mudanca de nivel no meio do periodo precisam de intervencao do operador antes de virar dados canonicos.

Tambem precisamos controlar concorrencia: apesar de poucos usuarios (<10), dois operadores editando a mesma planilha em paralelo produziriam conflitos silenciosos, e o ciclo de correcao pode levar dias por edital.

## Decisao

Adotada arquitetura em quatro camadas integradas por S3 e Supabase Postgres:

1. **Dois dumps batch independentes publicados no S3** — nenhum acesso ao SIGFAPES em tempo de request:
   - `scripts/sigfapes_dump_job.py` — autentica na API HTTP do SIGFAPES (`FAPES_URL_AUTH` -> token; `FAPES_URL_CONSULTA` para `editais`/`projetos`/`bolsistas`), com `AdaptiveRateController` (janelas de 60s + backoff) para nao saturar o legado. Publica em `<SIGFAPES_DUMP_PREFIX>/<DD_MM_YYYY>/` os arquivos `editais.json|.parquet`, `projetos_por_edital.json|.parquet`, `bolsistas_projeto.jsonl|.parquet`, `bolsistas_por_edital.json` e marker `dump_complete.json` (idempotencia por data).
   - `scripts/conecta_dump_job.py` — copia Parquets ja materializados no MinIO do Conecta (prefixo `ConectaFapes/`) para `<CONNECTA_DUMP_PREFIX>/<DD_MM_YYYY>/`, renomeando (`Edital.parquet` -> `editais.parquet`, `Projeto.parquet` -> `projetos.parquet`, `AlocacaoBolsista.parquet` -> `alocacoes_bolsistas.parquet`, alem de `VersaoNivel`, `VersaoModalidade`, `NivelBolsa`, `ModalidadeBolsa`). Tambem usa marker `dump_complete.json`.
   - Futuramente os jobs serao orquestrados pela DAG `SigFapes2Conecta` no Airflow — o backend ja expoe rotas de trigger/status (`app/services/airflow_trigger.py`, `app/services/airflow_check.py`), mas o disparo manual pelo frontend ainda nao foi implementado.
2. **Backend FastAPI** - le os Parquets on-demand (com 4 fetches S3 paralelos via `ThreadPoolExecutor`), vetoriza calculos derivados (`effective_end`, `MESES_DE_ATIVIDADE`, `total_deve_receber`) com NumPy e gera planilhas XLSX via `xlsxwriter`. Expoe 26 endpoints REST autenticados com JWT Bearer do Supabase Auth.
3. **Frontend React + TypeScript + Vite** - editor de planilhas com virtual scroll manual (`SPREADSHEET_ROW_HEIGHT=52px`, `overscan=5`), validacoes em tempo real e heartbeat automatico de lock a cada 45 segundos.
4. **Persistencia auxiliar em Supabase Postgres** - tabelas para estado transacional que nao cabe em Parquet:
   - `resource_locks` - lock exclusivo por recurso `(kind, MM_YYYY, edital_id)` com indice unico parcial
   - `resource_kind_state` - tipo ativo (`editais` ou `programas`) por competencia
   - `resource_kind_switch_log` - historico imutavel de alternancias com chaves S3 clonadas
   - `planilha_version_audit` - auditoria de cada versao gerada (ator, email, request_id, motivo)
   - `import_jobs` - fila de jobs assincronos com retries

### Invariantes arquiteturais

- Planilhas sao arquivos S3 versionados monotonicamente (`v1`, `v2`, ...) - nao ha rollback destrutivo; reverter uma correcao significa subir uma nova versao com o conteudo desejado.
- Indice unico parcial em `resource_locks` garante no maximo um lock ativo por `resource_key`; locks expirados podem ser tomados por takeover registrado.
- JSONLs de importacao sempre leem a planilha cujo `kind` coincide com `resource_kind_state.active_kind` - alternar o tipo clona a planilha para o kind alvo.
- A geracao de JSONL exige mapeamento completo `projeto_id -> AreaTecnica` em `dados-programas.json`; projetos sem mapeamento bloqueiam (422) a geracao.

## Consequencias

### Positivas

- **Desacoplamento do SIGFAPES online**: falhas do sistema legado nao afetam o fluxo de correcao; o backend opera sobre copias imutaveis.
- **Auditoria completa**: cada versao de planilha e cada troca de tipo tem rastro com ator, email, request_id e motivo.
- **Performance escalavel**: editais com 5000+ bolsistas geram em menos de 30s gracas a fetches paralelos S3 + calculos vetorizados NumPy + layout com `xlsxwriter`.
- **Concorrencia explicita**: lock exclusivo com heartbeat evita edicoes sobrepostas; takeover permite retomar sessoes abandonadas.
- **Evolucao incremental**: a alternancia `editais <-> programas` permite reformar o agrupamento dos dados sem perder o trabalho ja feito.

### Negativas

- **Latencia de dados**: como o dump e diario, correcoes feitas no SIGFAPES durante o dia so aparecem no Importador no dia seguinte.
- **Dependencia de dois jobs de dump**: falha em qualquer um (SIGFAPES HTTP ou copia MinIO Conecta) impede novos editais de aparecerem na listagem ate o proximo dump; como a autenticacao na API do SIGFAPES usa credenciais compartilhadas, uma rotacao de senha exige atualizacao coordenada.
- **Duas fontes de verdade transacionais**: estado de lock/auditoria no Supabase, dados em S3 - exige coordenacao cuidadosa em operacoes compostas (ex.: upload grava S3 e audit).
- **Virtual scroll manual**: mais codigo para manter do que uma biblioteca pronta, mas o ganho de bundle size compensa para este produto.

### Riscos

- **Lock orfao**: uma sessao que expira sem emitir release deixa lock ativo ate `expires_at`; mitigado por heartbeat curto (45s) e takeover explicito.
- **Divergencia entre tipo ativo e planilha consumida**: geracao de JSONL que leia o `kind` errado produziria importacao incorreta; mitigado por consulta obrigatoria a `resource_kind_state` no inicio do job.
- **Custo de storage crescente**: versoes acumulam indefinidamente; mitigado por politica de retencao a ser definida (hoje, todos os historicos permanecem).

## Alternativas consideradas

- **Integracao online com SIGFAPES via Web Services**: rejeitada por instabilidade do legado e carga excessiva em horario comercial.
- **Importar direto para o banco canonico sem etapa de correcao**: rejeitada porque propaga inconsistencias sistemicas do SIGFAPES para o ConectaFAPES.
- **Frontend com biblioteca de virtual scroll (ex.: react-window)**: considerada, mas a implementacao manual com 52px/linha fixa e `overscan=5` ja atende os requisitos com menos dependencias.
- **Locks otimistas com versionamento**: insuficiente porque o ciclo de edicao dura horas/dias - um lock pessimista com heartbeat e mais adequado para a UX.
- **Trigger sincrono no endpoint `/gerar-jsonl`**: substituido por job assincrono via `import_jobs` para suportar editais volumosos sem estourar timeouts HTTP.

## Referencias

- [M002 - Importacao de Editais](../../implementation/modules/M002-importacao-editais/README.md)
- [Importador SIGFAPES - Arquitetura](../../products/importador/architecture.md)
- [Domain 07 - Importacao de Dados (SIGFAPES)](../../discovery/domains/07-importacao-sigfapes.md)
- [ADR-010 - MinIO como armazenamento de objetos S3-compativel](ADR-010-minio-armazenamento-objetos.md)
