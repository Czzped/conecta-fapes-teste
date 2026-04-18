# Domain 07 — Importacao de Dados (SIGFAPES)

Dominio responsavel pela migracao operacional de dados do sistema legado **SIGFAPES** para a plataforma ConectaFAPES. O SIGFAPES e o sistema anterior da agencia de fomento e contem o historico de editais, projetos, bolsistas e pagamentos. A importacao combina tres camadas: dumps batch diarios em Parquet publicados por dois scripts Python (`scripts/sigfapes_dump_job.py`, que consome a API HTTP do SIGFAPES, e `scripts/conecta_dump_job.py`, que copia Parquets do MinIO do Conecta), uma etapa de correcao colaborativa por planilha XLSX versionada e a geracao final de arquivos JSONL consumidos pelos modulos donos do dominio.

**Modulos que implementam este domain:** M002.

> Glossario dos conceitos centrais em [../glossario.md](../glossario.md).

---

## 7.1 Dump e Disponibilizacao dos Dados do SIGFAPES

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 7.1.1 | Publicar Dumps Diarios no S3 | `scripts/sigfapes_dump_job.py` autentica na API HTTP do SIGFAPES (rate-limited) e publica `editais`, `projetos_por_edital` e `bolsistas_projeto` em Parquet/JSON; `scripts/conecta_dump_job.py` copia Parquets canonicos do MinIO do Conecta (`Edital`, `Projeto`, `AlocacaoBolsista`, `VersaoNivel`, `VersaoModalidade`, `NivelBolsa`, `ModalidadeBolsa`) para o S3 de trabalho. Orquestracao futura via DAG Airflow `SigFapes2Conecta`. | Equipe tecnica de dados | Art. 25, III |
| 7.1.2 | Listar Editais do Ultimo Dump | Exibir editais disponiveis com contagem de bolsistas, flag de edital novo (60 dias) e status de lock | Operador de Importacao | Art. 25, III |
| 7.1.3 | Identificar Editais Pendentes de Correcao | Sinalizar editais que ainda nao tem planilha corrigida ou cuja correcao esta em andamento | Operador de Importacao | Art. 25, III |

## 7.2 Correcao Colaborativa da Planilha

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 7.2.1 | Gerar Planilha Inicial do Edital | Produzir XLSX pre-preenchido a partir dos Parquets, com datas derivadas (`effective_end`, `MESES_DE_ATIVIDADE`) e 5 grupos de niveis de bolsa | Operador de Importacao | Art. 25, III |
| 7.2.2 | Adquirir Lock Exclusivo com Heartbeat | Garantir edicao unica por recurso (`kind, MM_YYYY, edital_id`), com heartbeat a cada 45s e takeover apos expiracao | Operador de Importacao | Art. 25, III |
| 7.2.3 | Editar Planilha com Validacoes em Tempo Real | Editor web com virtual scroll (52px/linha), validacao de datas, contas bancarias e obrigatoriedade | Operador de Importacao | Art. 25, III |
| 7.2.4 | Validar e Versionar Upload | Pre-validar arquivo enviado (errors/warnings/diff), persistir nova versao no S3 e registrar em `planilha_version_audit` | Operador de Importacao | Art. 25, III |
| 7.2.5 | Alternar entre Tipos editais e programas | Clonar planilha atual para o tipo alvo e registrar troca em `resource_kind_switch_log` | Operador de Importacao | Art. 25, III |
| 7.2.6 | Configurar Mapeamento Programa -> AreaTecnica | Manter o arquivo `dados-programas.json` associando cada `projeto_id` a uma Area Tecnica e programa | Operador de Importacao | Art. 25, III |

## 7.3 Producao de Arquivos de Importacao

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 7.3.1 | Gerar JSONLs por Entidade | Produzir `editais.jsonl`, `projetos.jsonl`, `pessoas.jsonl`, `alocacoes.jsonl` etc. a partir da planilha ativa | Operador de Importacao | Art. 25, III; Art. 27, II |
| 7.3.2 | Acompanhar Jobs Assincronos | Controle de fila via tabela `import_jobs` com retries e status observavel | Operador de Importacao | Art. 25, III |
| 7.3.3 | Bloquear Geracao com Mapeamento Incompleto | Recusar geracao quando existem projetos sem Area Tecnica mapeada | Operador de Importacao | Art. 25, III |
| 7.3.4 | Consultar Historico de Versoes e Arquivos | Listar versoes de planilha e JSONLs gerados por competencia | Operador de Importacao | Art. 25, III |

## 7.4 Governanca e Auditoria

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 7.4.1 | Auditar Versoes de Planilha | Toda versao gerada (inicial, upload, clone) registra ator, email, request_id e motivo | Analista da Area Tecnica | Art. 25, III |
| 7.4.2 | Auditar Trocas de Tipo Ativo | Registrar historico imutavel de alternancias `editais <-> programas` | Analista da Area Tecnica | Art. 25, III |
| 7.4.3 | Monitorar Estado de Locks | Consultar locks ativos, expirados e tomados por takeover | Operador de Importacao | Art. 25, III |
| 7.4.4 | Reprocessar Geracao de JSONL | Reexecutar jobs falhados apos correcao de mapeamento ou dados da planilha | Operador de Importacao | Art. 25, III |
