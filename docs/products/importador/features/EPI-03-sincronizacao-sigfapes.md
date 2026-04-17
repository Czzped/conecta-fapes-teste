# EPI-03 — Gerar Arquivos de Importacao (JSONL)

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |

## Jornada

Com a planilha corrigida e o mapeamento de programas completo, o operador dispara a geracao dos arquivos JSONL de importacao. O backend cria um job assincrono (`import_jobs`), le a planilha ativa segundo o `active_kind` vigente em `resource_kind_state`, cruza com os Parquets de referencia e produz um arquivo JSONL por entidade (editais, projetos, pessoas, alocacoes, etc.), persistidos em `importacao/MM_YYYY/<edital_id>/*.jsonl`. O operador acompanha o progresso em tela e consulta o historico de versoes e arquivos gerados.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [EPIC-M002-003](../../../implementation/modules/M002-importacao-editais/epics/EPIC-M002-003.md) | Gerar Arquivos de Importacao (JSONL) | Done |

## Cenarios de aceitacao do produto

- **Geracao sob demanda**: botao inicia job assincrono que retorna `job_id` em 202.
- **Validacao previa obrigatoria**: geracao recusada (422) quando `dados-programas.json` nao mapeia todos os projetos; UI abre modal destacando pendencias.
- **Acompanhamento de progresso**: polling em `GET /jobs/{id}` mostra status (`pending` -> `running` -> `completed` / `failed`) e contadores de tentativas.
- **JSONLs por entidade**: um arquivo por entidade com uma linha JSON por registro, prontos para ingestao por M003 e modulos donos.
- **Respeito ao tipo ativo**: geracao le sempre a planilha cujo `kind` coincide com `resource_kind_state.active_kind` da competencia.
- **Historico de versoes**: operador consulta `planilha_version_audit` e chaves S3 dos JSONLs gerados.
