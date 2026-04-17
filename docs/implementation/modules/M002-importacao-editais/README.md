# M002 - Importacao de Editais

[← Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 07 — Importacao de Dados (SIGFAPES)](../../../discovery/domains/07-importacao-sigfapes.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Artefatos S3, tabelas Supabase, layout XLSX e regras derivadas |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclos de vida e fluxos operacionais completos |

---

## Sobre o Modulo

O M002 e o modulo responsavel por trazer os dados operacionais do SIGFAPES (o sistema legado de bolsistas da FAPES/ES) para o ConectaFAPES, permitindo que o operador corrija inconsistencias antes da importacao para os modulos donos do dominio. O fluxo completo cobre desde o dump Parquet diario do SIGFAPES ate a geracao dos arquivos JSONL consumidos por M003 (Iniciativas Captadas).

O problema resolvido e concreto: os editais do SIGFAPES chegam com datas inconsistentes, contas bancarias desatualizadas e bolsistas cadastrados em mais de um nivel sem registro explicito. Sem este modulo, esses dados seriam importados com erros sistemicos para o novo sistema. Com ele, o operador baixa a planilha pre-preenchida, corrige no proprio navegador e envia de volta - o sistema versiona, audita e so gera os arquivos de importacao quando todos os invariantes estao respeitados.

---

## Dominio

O M002 nao e dono das entidades operacionais: `Edital`, `Projeto`, `AlocacaoBolsista`, `PessoaFisica` e `AreaTecnica` pertencem a M003, M008 e M001. Aqui, essas entidades sao referenciadas apenas como dados de entrada (dumps Parquet) e como saida (JSONLs de importacao). O ownership do M002 e sobre os artefatos tecnicos que mediam a correcao:

- **Planilha versionada** por escopo `(kind, MM_YYYY, edital_id)` com auditoria de cada versao.
- **Lock exclusivo** do recurso durante edicao, com heartbeat de 45s.
- **Tipo ativo** do recurso (`editais` vs `programas`), governando qual planilha alimenta os JSONLs.
- **Configuracao de programas** - mapa `projeto_id -> AreaTecnica`, obrigatorio antes da geracao de JSONLs.
- **Jobs de importacao** que produzem os arquivos JSONL.

A origem dos dados e o SIGFAPES atraves de dumps Parquet publicados diariamente por um job Airflow (`SigFapes2Conecta` / `sigfapes_dump_job`) - nao ha integracao online via Web Services.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | A listagem de editais disponiveis sempre vem do dump Parquet mais recente publicado em S3 pelos jobs `sigfapes_dump_job.py` (API HTTP SIGFAPES) e `conecta_dump_job.py` (MinIO Conecta); o backend nao consulta o SIGFAPES em tempo de request. | Must |
| RN02 | Uma planilha so pode ser editada por um operador por vez; o acesso concorrente e controlado por lock exclusivo com heartbeat de 45 segundos. | Must |
| RN03 | Cada versao de planilha (inicial, upload corrigida, clone de tipo) e imutavel e registrada em `planilha_version_audit` com ator, request_id e motivo. | Must |
| RN04 | Um edital pode ser gerido como `kind=editais` ou `kind=programas` por competencia (`MM_YYYY`); a alternancia clona a planilha mais recente e registra em `resource_kind_switch_log`. | Must |
| RN05 | Editais com data de cadastro SIGFAPES nos ultimos 60 dias recebem a flag `novo_este_mes` para priorizacao na UI. | Should |
| RN06 | Upload de planilha corrigida bloqueia quando ha erros estruturais (cabecalhos, chaves obrigatorias, tipos); `warnings` nao bloqueiam mas exigem confirmacao do operador. | Must |
| RN07 | Geracao de JSONLs exige mapeamento completo `projeto -> Area Tecnica` em `dados-programas.json`; projetos nao mapeados bloqueiam a geracao. | Must |
| RN08 | Todas as rotas de escrita exigem Bearer JWT emitido pelo Supabase Auth; rotas de heartbeat e release exigem o `lock_token` adquirido. | Must |
| RN09 | Locks expirados (sem heartbeat apos `expires_at`) podem ser tomados por outro operador com registro de `release_reason=takeover`. | Must |
| RN10 | O calculo de `MESES_DE_ATIVIDADE` segue a semantica de `months_between` do Spark, com clipe inferior em zero; alteracoes nesta regra afetam todos os editais historicos. | Must |

### Requisitos Nao-Funcionais

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RNF01 | Toda operacao de escrita gera log tecnico estruturado (JSON) suficiente para auditoria de quem fez o que, quando e com qual request_id. | Must |
| RNF02 | A origem dos dados sao dumps Parquet publicados no S3 por dois scripts Python (`sigfapes_dump_job.py` consome a API HTTP do SIGFAPES; `conecta_dump_job.py` copia Parquets do MinIO do Conecta); o backend FastAPI so le os artefatos ja materializados e nao faz chamadas ao SIGFAPES em tempo de request. | Must |
| RNF03 | A geracao de planilha executa 4 fetches S3 em paralelo via `ThreadPoolExecutor` e vetoriza calculos com NumPy; editais com 5000+ bolsistas devem gerar em menos de 30 segundos. | Must |
| RNF04 | A UI usa virtual scroll (`SPREADSHEET_ROW_HEIGHT=52px`, `overscan=5`) para manter 60fps mesmo com 5000+ linhas. | Must |
| RNF05 | As credenciais de S3 e Supabase sao lidas de variaveis de ambiente (`app/settings.py`); nao ha segredo commitado no repositorio. | Must |

---

## Stack

- **Backend**: Python 3.12, FastAPI + Uvicorn, pandas 3.0 + pyarrow 23, xlsxwriter, boto3.
- **Frontend**: React 18 + TypeScript + Vite, `xlsx` para parse, `react-datepicker` para campos de data.
- **Armazenamento**: S3 (Parquets, JSONs, XLSX, JSONLs) + Supabase Postgres (tabelas auxiliares).
- **Autenticacao**: Supabase Auth + JWT Bearer com cookies HttpOnly (`sb-access-token`, `sb-refresh-token`).
- **Orquestracao**: Airflow (DAG `SigFapes2Conecta`) publica dumps diarios.
- **Deploy**: Render (backend + frontend).
