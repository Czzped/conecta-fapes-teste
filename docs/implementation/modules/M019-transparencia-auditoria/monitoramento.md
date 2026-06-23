# Monitoramento e Observabilidade — M019 Transparencia e Auditoria

Dominio e regras: ver [README.md](README.md) | Eventos: ver [eventos-dominio.md](eventos-dominio.md)

## Objetivo de Sustentacao

A equipe de sustentacao precisa garantir que o portal de transparencia esteja sempre atualizado (publicacao diaria conforme RN01), que a trilha de auditoria ingira sem perda todos os eventos de operacao vindos dos demais modulos (RN05) e que os artefatos de controle externo (relatorios SECONT, exportacoes de auditoria) sejam gerados sob demanda sem falha. Os sinais centrais sao: frescor do dado publico (deteccao de publicacao desatualizada), taxa/atraso/lacunas de ingestao do log de auditoria e saude do job de publicacao. A imutabilidade da trilha (RN04) e tratada como evento critico de violacao. Nenhum sinal pode expor dado pessoal (CPF, nome, email), inclusive porque o portal opera sob LGPD (RN02).

## Eventos de Negocio Monitorados

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| PUBLICACAO_DESATUALIZADA | eventos-dominio.md | gauge `m019_publicacao_idade_horas` ultrapassa janela diaria; counter `m019_publicacao_desatualizada_total` | Sim | critical |
| Falha no job de publicacao (PUBLICACAO_TRANSPARENCIA_FALHOU) | contrato.md (AtualizarPublicacaoTransparencia) | counter `m019_atualizar_publicacao_total{status="error"}` | Sim | critical |
| Anonimizacao inconsistente (ANONIMIZACAO_DADOS_INVALIDA) | contrato.md (AtualizarPublicacaoTransparencia) | counter `m019_anonimizacao_falha_total` | Sim | critical |
| Lacuna na ingestao da trilha de auditoria | contrato.md (RegistrarEventoDeAuditoria) | gauge `m019_auditoria_ingestao_lag_seconds`; counter `m019_auditoria_evento_descartado_total` | Sim | critical |
| Tentativa de alteracao retroativa da trilha (TRILHA_AUDITORIA_IMUTAVEL) | contrato.md (RegistrarEventoDeAuditoria) | counter `m019_auditoria_violacao_imutabilidade_total` | Sim | critical |
| Evento de auditoria inconsistente (EVENTO_AUDITORIA_INCONSISTENTE) | contrato.md (RegistrarEventoDeAuditoria) | counter `m019_auditoria_evento_total{status="error"}` | Sim | warning |
| Falha na geracao de relatorio SECONT | contrato.md (GerarRelatorioSECONT) | counter `m019_gerar_relatorio_secont_total{status="error"}` | Sim | warning |
| Falha na exportacao para auditoria | contrato.md (ExportarDadosParaAuditoria) | counter `m019_exportar_auditoria_total{status="error"}` | Sim | warning |

## Metricas (Prometheus)

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m019_atualizar_publicacao_total | counter | status | - | execucoes do job de atualizacao do portal por status |
| m019_atualizar_publicacao_duration_seconds | histogram | - | s | duracao da atualizacao da publicacao de transparencia |
| m019_consultar_portal_publico_total | counter | status | - | consultas publicas ao portal de transparencia por status |
| m019_consultar_portal_publico_duration_seconds | histogram | - | s | latencia da consulta publica ao portal |
| m019_gerar_relatorio_secont_total | counter | status, tipo_relatorio | - | geracoes de relatorio SECONT por status |
| m019_gerar_relatorio_secont_duration_seconds | histogram | tipo_relatorio | s | duracao da geracao do relatorio SECONT |
| m019_exportar_auditoria_total | counter | status, formato | - | exportacoes de dados para auditoria por status |
| m019_exportar_auditoria_duration_seconds | histogram | formato | s | duracao da exportacao de auditoria |
| m019_registrar_evento_auditoria_total | counter | status, modulo_origem | - | eventos de auditoria recebidos para registro por status |
| m019_registrar_evento_auditoria_duration_seconds | histogram | - | s | latencia do registro de evento de auditoria |
| m019_consultar_indicadores_total | counter | status | - | consultas a indicadores de transparencia por status |
| m019_consultar_indicadores_duration_seconds | histogram | - | s | latencia da consulta de indicadores |
| m019_publicacao_idade_horas | gauge | - | h | tempo desde a ultima publicacao bem-sucedida do portal |
| m019_publicacao_desatualizada_total | counter | - | - | deteccoes de publicacao desatualizada (evento PUBLICACAO_DESATUALIZADA) |
| m019_publicacao_registros_publicados | gauge | - | - | registros publicados na ultima atualizacao do portal |
| m019_anonimizacao_falha_total | counter | - | - | falhas de anonimizacao detectadas antes da publicacao |
| m019_auditoria_eventos_ingeridos_total | counter | modulo_origem | - | eventos de auditoria ingeridos na trilha por modulo de origem |
| m019_auditoria_ingestao_lag_seconds | gauge | - | s | atraso entre ocorrencia e persistencia do evento na trilha |
| m019_auditoria_evento_descartado_total | counter | motivo | - | eventos de auditoria descartados (lacuna potencial na trilha) |
| m019_auditoria_violacao_imutabilidade_total | counter | - | - | tentativas de alteracao/exclusao de registro da trilha |
| m019_job_publicacao_last_success_timestamp_seconds | gauge | - | s | timestamp Unix da ultima execucao bem-sucedida do job de publicacao |
| m019_job_relatorio_secont_last_success_timestamp_seconds | gauge | - | s | timestamp Unix da ultima geracao programada de relatorio SECONT |

## Tracing (SigNoz / OpenTelemetry)

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m019.AtualizarPublicacaoTransparencia | por execucao do job de publicacao | data_referencia, registros_publicados, resultado |
| m019.ConsultarPortalTransparenciaPublica | por consulta publica ao portal | programa.id, filtro_tipo, total_resultados |
| m019.GerarRelatorioSECONT | por geracao de relatorio SECONT | tipo_relatorio, periodo_inicio, periodo_fim, resultado |
| m019.ExportarDadosParaAuditoria | por exportacao de auditoria | escopo, formato, periodo_inicio, periodo_fim, resultado |
| m019.RegistrarEventoDeAuditoria | por evento de auditoria recebido | modulo_origem, operacao, resultado |
| m019.ConsultarIndicadoresTransparencia | por consulta de indicadores | periodo_inicio, periodo_fim |
| m019.ext.m010 | ao obter `Programa` do M010 | peer.service, http.status_code, resultado |
| m019.ext.m003 | ao obter `Iniciativa` do M003 | peer.service, http.status_code, resultado |
| m019.ext.m009 | ao obter `BolsaPesquisa` do M009 | peer.service, http.status_code, resultado |
| m019.job.publicacao | por execucao agendada da publicacao diaria | resultado, itens_processados, data_referencia |
| m019.job.relatorio_secont | por geracao programada (mensal) do SECONT | resultado, tipo_relatorio, periodo |

> Atributos de span nunca carregam dado pessoal. O atributo `usuario` recebido por RegistrarEventoDeAuditoria nao e propagado em span nem em label de metrica — apenas persistido na trilha imutavel.

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| frescor da publicacao do portal (% de dias com publicacao concluida dentro da janela diaria) | 99% | 30d |
| taxa de sucesso do job de atualizacao da publicacao | 99% | 30d |
| taxa de ingestao integra de eventos na trilha de auditoria (eventos persistidos / recebidos) | 99,9% | 30d |
| taxa de sucesso da geracao de relatorio SECONT | 99% | 30d |
| latencia da consulta publica ao portal (p95) | < 2 s | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Publicacao desatualizada | `m019_publicacao_idade_horas > 26` | critical | TODO runbook: verificar execucao do job de publicacao e fontes de dados (M003/M009/M010) |
| Job de publicacao nao executou | `time() - m019_job_publicacao_last_success_timestamp_seconds > 93600` | critical | TODO runbook: investigar agendador e logs do job de publicacao |
| Falha de anonimizacao | `increase(m019_anonimizacao_falha_total[1h]) > 0` | critical | TODO runbook: bloquear publicacao e corrigir pipeline de anonimizacao (RN02/LGPD) |
| Lacuna na trilha de auditoria | `increase(m019_auditoria_evento_descartado_total[15m]) > 0` | critical | TODO runbook: reprocessar eventos descartados e validar integridade da trilha |
| Atraso de ingestao da auditoria | `m019_auditoria_ingestao_lag_seconds > 300` | warning | TODO runbook: verificar fila/consumidor de eventos de auditoria |
| Violacao de imutabilidade da trilha | `increase(m019_auditoria_violacao_imutabilidade_total[5m]) > 0` | critical | TODO runbook: investigar tentativa de alteracao retroativa (RN04) e acionar seguranca |
| Falha na geracao SECONT | `increase(m019_gerar_relatorio_secont_total{status="error"}[1h]) > 0` | warning | TODO runbook: validar dados de origem e formato padronizado SECONT |
| Falha na exportacao de auditoria | `increase(m019_exportar_auditoria_total{status="error"}[1h]) > 0` | warning | TODO runbook: validar formato/escopo e disponibilidade da exportacao |
| SLO de frescor em risco | error budget de frescor da publicacao consumido > 80% em 30d | warning | TODO runbook: revisar tendencia de execucao do job diario |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M019 | rate/errors/duration por operacao do contrato | Grafana |
| Frescor do portal | m019_publicacao_idade_horas, registros publicados, ultima execucao do job | Grafana |
| Saude da trilha de auditoria | taxa de ingestao, lag, descartes e violacoes de imutabilidade por modulo de origem | Grafana |
| Saude de jobs | duracao e ultimo sucesso dos jobs de publicacao e relatorio SECONT | Grafana |
| Integracoes externas | latencia e taxa de erro por dependencia (M003, M009, M010) | Grafana |
| Trace explorer | spans m019.* fim-a-fim | SigNoz |
