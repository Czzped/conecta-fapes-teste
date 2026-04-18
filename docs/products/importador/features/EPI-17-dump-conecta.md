# EPI-17 — Sincronizacao Conecta -> S3

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |
| **Fonte no codigo** | `scripts/conecta_dump_job.py`, `app/services/conecta_dump.py` |

## Jornada

Job offline que copia Parquets ja materializados no MinIO do Conecta para o bucket S3 consumido pelo Importador. O backend precisa desses dumps para cruzar com os do SIGFAPES em `/editais-grafico-metricas` e em `/editais-latest` (flag `importado`). O script preserva a estrutura `<CONNECTA_DUMP_PREFIX>/<DD_MM_YYYY>/<entidade>.parquet` e escreve `dump_complete.json` como marker ao fim. Suporta configuracao separada de endpoint/bucket/credenciais para origem (MinIO) e destino (S3).

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [M002](../../../implementation/modules/M002-importacao-editais/README.md) | Dump Conecta -> S3 | Done |

## User Stories

| ID | User Story |
|----|-----------|
| US-17-01 | Como sistema, quero copiar Parquets do MinIO Conecta para o S3 consumido pelo Importador. |
| US-17-02 | Como sistema, quero marker `dump_complete.json` para sinalizar integridade. |
| US-17-03 | Como backend, quero identificar o dump Conecta mais recente para calcular metricas. |
| US-17-04 | Como infra, quero configurar origem e destino com credenciais/endpoint distintos. |

## Cenarios de aceitacao do produto

- **Origem**: `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_ENDPOINT`, `MINIO_BUCKET`, `MINIO_REGION` (ou `CONNECTA_SOURCE_*`).
- **Destino**: bucket em `CONNECTA_DUMP_BUCKET` (fallback para `S3_BUCKET`) com prefixo `CONNECTA_DUMP_PREFIX` (default `ConectaFapes/dados_input/dump_conecta/`).
- **Entidades copiadas**: editais, projetos, alocacoes de bolsistas e tabelas auxiliares (nivel, modalidade) conforme origem.
- **Marker**: `dump_complete.json` gravado no final com timestamp.
- **Descoberta pelo backend**: `select_latest_complete_conecta_dump_prefix` lista prefixos `<DD_MM_YYYY>/` com marker.
- **Uso**: `/editais-grafico-metricas` usa o dump Conecta para calcular `imported_rows`, `matched_rows`, `conecta_not_in_sigfapes_ids`.
- **Idempotencia**: segunda execucao na mesma data pode sobrescrever ou pular arquivos ja presentes.
- **Logs**: JSON estruturado com timing por entidade.
