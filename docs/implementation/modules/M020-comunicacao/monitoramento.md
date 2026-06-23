# Monitoramento e Observabilidade — M020 Comunicacao

Dominio e regras: ver [README.md](README.md) | Eventos consumidos: ver [notificacoes/catalogo-eventos.md](notificacoes/catalogo-eventos.md)

## Objetivo de Sustentacao

O M020 e o servico transversal de notificacao e comunicacao da plataforma ConectaFAPES: todos os demais modulos dependem dele para entregar emails de mudanca de status, lembretes de prazo, solicitacoes de aprovacao, pagamento e comunicados em massa (RN08). A sustentacao precisa garantir, em producao:

- que notificacoes pendentes sejam efetivamente enviadas, respeitando o limite de ate 3 tentativas antes de falha definitiva (RN03);
- que notificacoes mandatorias (prazo e pagamento, RN04) nao fiquem retidas — uma falha aqui tem impacto operacional e regulatorio direto;
- que a fila de notificacoes pendentes nao cresca indefinidamente (sintoma de provedor de email indisponivel ou job parado);
- que os jobs Hangfire de envio (`ProcessarEnvioDeNotificacao`) e de lembretes (`ProcessarLembretesAtivos`, RN07 — T-30/15/7) executem no horario e sem falha;
- que o fluxo de aprovacao de comunicado em massa (RN05) nao deixe comunicados travados em `AGUARDANDO_APROVACAO`;
- que a disponibilidade e a latencia do provedor de email institucional (remetente `no-reply@fapes.es.gov.br`, RN01) sejam observaveis por dependencia.

Como o modulo trafega dados pessoais de destinatarios (email, nome), nenhum desses dados pode aparecer em label de metrica ou atributo de span.

## Eventos de Negocio Monitorados

Os eventos abaixo sao **consumidos** de outros modulos via `ReceberEventoDeNegocioParaNotificacao` e estao catalogados em [notificacoes/catalogo-eventos.md](notificacoes/catalogo-eventos.md) (a definicao do gatilho pertence ao modulo de origem). O M020 monitora o **resultado de notificacao**, nao redefine o evento. Labels `tipo` (enum `TipoNotificacao`) e `modulo_origem` sao de baixa cardinalidade.

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| Notificacao mandatoria (LEMBRETE_PRAZO / PAGAMENTO, RN04) com falha definitiva | catalogo-eventos.md | counter `m020_notificacoes_falha_total{mandatorio="true"}` | Sim | critical |
| Notificacao informativa com falha definitiva apos 3 tentativas (RN03) | catalogo-eventos.md | counter `m020_notificacoes_falha_total{mandatorio="false"}` | Sim | warning |
| Provedor de email institucional indisponivel (PROVEDOR_EMAIL_INDISPONIVEL) | contrato.md / catalogo-eventos.md | counter `m020_ext_email_total{status="error"}` | Sim | critical |
| Lembrete de prazo gerado (RN07, T-30/15/7) | catalogo-eventos.md (LEMBRETE_PRAZO) | counter `m020_lembretes_gerados_total{antecedencia}` | Nao | - |
| Comunicado em massa aguardando aprovacao do Diretor (RN05, COMUNICADO_AGUARDANDO_APROVACAO) | catalogo-eventos.md (M020 proprio) | gauge `m020_comunicados_aguardando_aprovacao` | Sim | warning |
| Template inexistente/inativo para evento recebido (TEMPLATE_NOTIFICACAO_INEXISTENTE) | contrato.md | counter `m020_receber_evento_total{status="error"}` | Sim | warning |

## Metricas (Prometheus)

RED por operacao publica do [contrato.md](contrato.md) (label `status` em `{ok,error}`; `tipo`/`modulo_origem`/`antecedencia` sempre de baixa cardinalidade; nunca email, nome ou id de destinatario).

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m020_receber_evento_total | counter | status, modulo_origem, tipo | - | chamadas a ReceberEventoDeNegocioParaNotificacao |
| m020_receber_evento_duration_seconds | histogram | - | s | latencia de ReceberEventoDeNegocioParaNotificacao |
| m020_processar_envio_total | counter | status | - | execucoes de ProcessarEnvioDeNotificacao |
| m020_processar_envio_duration_seconds | histogram | - | s | latencia de ProcessarEnvioDeNotificacao |
| m020_configurar_template_total | counter | status | - | chamadas a ConfigurarTemplateNotificacao |
| m020_configurar_template_duration_seconds | histogram | - | s | latencia de ConfigurarTemplateNotificacao |
| m020_consultar_historico_total | counter | status | - | chamadas a ConsultarHistoricoDeNotificacoes |
| m020_consultar_historico_duration_seconds | histogram | - | s | latencia de ConsultarHistoricoDeNotificacoes |
| m020_solicitar_comunicado_total | counter | status | - | chamadas a SolicitarComunicadoMassa |
| m020_solicitar_comunicado_duration_seconds | histogram | - | s | latencia de SolicitarComunicadoMassa |
| m020_aprovar_comunicado_total | counter | status | - | chamadas a AprovarComunicadoMassa |
| m020_aprovar_comunicado_duration_seconds | histogram | - | s | latencia de AprovarComunicadoMassa |
| m020_rejeitar_comunicado_total | counter | status | - | chamadas a RejeitarComunicadoMassa |
| m020_rejeitar_comunicado_duration_seconds | histogram | - | s | latencia de RejeitarComunicadoMassa |
| m020_configurar_lembrete_total | counter | status | - | chamadas a ConfigurarLembreteDePrazo |
| m020_configurar_lembrete_duration_seconds | histogram | - | s | latencia de ConfigurarLembreteDePrazo |
| m020_processar_lembretes_total | counter | status | - | execucoes de ProcessarLembretesAtivos |
| m020_processar_lembretes_duration_seconds | histogram | - | s | latencia de ProcessarLembretesAtivos |
| m020_notificacoes_enviadas_total | counter | tipo, mandatorio | - | notificacoes entregues com sucesso (RN06) |
| m020_notificacoes_falha_total | counter | tipo, mandatorio | - | notificacoes em falha definitiva apos 3 tentativas (RN03) |
| m020_notificacoes_tentativas_total | counter | resultado | - | tentativas individuais de envio (RN03, ate 3 por notificacao) |
| m020_notificacoes_pendentes | gauge | - | - | tamanho da fila de notificacoes pendentes de envio |
| m020_comunicados_aguardando_aprovacao | gauge | - | - | comunicados em massa em AGUARDANDO_APROVACAO (RN05) |
| m020_lembretes_gerados_total | counter | antecedencia | - | notificacoes de lembrete geradas por marco T-30/15/7 (RN07) |
| m020_job_processar_envio_duration_seconds | histogram | - | s | duracao do job Hangfire de envio |
| m020_job_processar_envio_last_success_timestamp_seconds | gauge | - | s | timestamp da ultima execucao bem-sucedida do job de envio |
| m020_job_processar_lembretes_duration_seconds | histogram | - | s | duracao do job Hangfire de lembretes |
| m020_job_processar_lembretes_last_success_timestamp_seconds | gauge | - | s | timestamp da ultima execucao bem-sucedida do job de lembretes |
| m020_ext_email_total | counter | status | - | chamadas ao provedor de email institucional |
| m020_ext_email_duration_seconds | histogram | - | s | latencia do provedor de email institucional |

## Tracing (SigNoz / OpenTelemetry)

Um span por operacao publica do contrato (`m020.{Operacao}`), span filho por chamada ao provedor de email (`m020.ext.email`) e span por job Hangfire. Atributos sempre nao sensiveis — nunca email, nome ou conteudo da mensagem.

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m020.ReceberEventoDeNegocioParaNotificacao | por evento consumido de outro modulo | modulo.origem, evento.origem, tipo, template.codigo |
| m020.ProcessarEnvioDeNotificacao | por execucao do envio | tipo, mandatorio, tentativa, resultado |
| m020.ConfigurarTemplateNotificacao | por comando | template.codigo, tipo, mandatorio, ativo |
| m020.ConsultarHistoricoDeNotificacoes | por consulta | modulo.origem, estado, total_resultados |
| m020.SolicitarComunicadoMassa | por comando | comunicado.codigo, template.codigo, total_destinatarios |
| m020.AprovarComunicadoMassa | por comando | comunicado.codigo, estado_resultante |
| m020.RejeitarComunicadoMassa | por comando | comunicado.codigo, estado_resultante |
| m020.ConfigurarLembreteDePrazo | por comando | lembrete.codigo, modulo.origem, entidade.referencia, dias_antecedencia |
| m020.ProcessarLembretesAtivos | por execucao | lembretes_avaliados, notificacoes_geradas, lembretes_desativados |
| m020.ext.email | por chamada ao provedor institucional | peer.service, net.peer.name, http.status_code, resultado |
| m020.job.processar_envio | por execucao do job Hangfire de envio | resultado, processadas, enviadas, falhas |
| m020.job.processar_lembretes | por execucao do job Hangfire de lembretes | resultado, lembretes_avaliados, notificacoes_geradas |

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| % de notificacoes mandatorias (prazo/pagamento, RN04) entregues em ate 3 tentativas (RN03) | 99,5% | 30d |
| % de notificacoes informativas entregues em ate 3 tentativas (RN03) | 99% | 30d |
| % de execucoes do job ProcessarEnvioDeNotificacao concluidas sem erro | 99% | 30d |
| % de execucoes do job ProcessarLembretesAtivos concluidas no horario agendado e sem erro (RN07) | 99% | 30d |
| Disponibilidade do provedor de email institucional (1 - taxa de erro de m020_ext_email_total) | 99% | 30d |
| Capacidade de vazao de comunicado em massa: >= 1000 emails/hora sustentados (RN09) | atendido | janela do envio |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Falha em notificacao mandatoria | `increase(m020_notificacoes_falha_total{mandatorio="true"}[15m]) > 0` | critical | TODO: runbook reprocessar notificacao mandatoria + escalar provedor de email |
| Falha em notificacao informativa elevada | `increase(m020_notificacoes_falha_total{mandatorio="false"}[1h]) > 10` | warning | TODO: runbook investigar template/destinatario |
| Provedor de email indisponivel | `rate(m020_ext_email_total{status="error"}[5m]) / rate(m020_ext_email_total[5m]) > 0.1` | critical | TODO: runbook acionar provedor institucional / pausar envios |
| Fila de notificacoes pendentes crescente | `m020_notificacoes_pendentes > 500 and deriv(m020_notificacoes_pendentes[30m]) > 0` | warning | TODO: runbook verificar job de envio e provedor de email |
| Job de envio nao executado | `time() - m020_job_processar_envio_last_success_timestamp_seconds > 900` | critical | TODO: runbook verificar Hangfire / reiniciar job de envio |
| Job de lembretes nao executado | `time() - m020_job_processar_lembretes_last_success_timestamp_seconds > 86400` | critical | TODO: runbook verificar Hangfire / reexecutar lembretes (RN07) |
| Comunicado em massa travado em aprovacao | `m020_comunicados_aguardando_aprovacao > 0 for 24h` | warning | TODO: runbook lembrar Diretor de aprovacao pendente (RN05) |
| SLO de notificacao mandatoria em risco | error budget burn rate de `m020_notificacoes_falha_total{mandatorio="true"}` excede limite na janela de 30d | critical | TODO: runbook revisao de SLO de notificacao mandatoria |
| Latencia alta do provedor de email | `histogram_quantile(0.95, rate(m020_ext_email_duration_seconds_bucket[10m])) > 5` | warning | TODO: runbook investigar latencia do provedor institucional |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M020 | rate/errors/duration por operacao do contrato (m020_*_total, m020_*_duration_seconds) | Grafana |
| Entrega de notificacoes | enviadas vs falha por tipo e mandatorio (RN03/RN04), tentativas por notificacao | Grafana |
| Fila de notificacoes | m020_notificacoes_pendentes ao longo do tempo + tendencia | Grafana |
| Saude dos jobs Hangfire | duracao, ultima execucao bem-sucedida e taxa de erro dos jobs de envio e lembretes | Grafana |
| Provedor de email institucional | latencia (p50/p95) e taxa de erro de m020_ext_email_* | Grafana |
| Comunicados em massa | comunicados aguardando aprovacao e vazao de envio (RN05/RN09) | Grafana |
| Lembretes de prazo | lembretes gerados por antecedencia T-30/15/7 (RN07) | Grafana |
| Trace explorer | spans m020.* fim-a-fim (operacao, m020.ext.email, jobs) | SigNoz |
