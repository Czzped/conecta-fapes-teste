# Monitoramento e Observabilidade — M001 Modalidades de Bolsas

Dominio e regras: ver [README.md](README.md) | Contrato: ver [contrato.md](contrato.md)

## Objetivo de Sustentacao

M001 e a fonte canonica de referencia (resolucoes, modalidades, versoes, niveis e requisitos) consumida por M003, M004, M009 e M013. E majoritariamente CRUD de dados de referencia, com baixo risco operacional e sem integracao externa nesta rodada. A sustentacao precisa garantir: (1) que as operacoes de leitura — sobretudo `ConsultarModalidadeVigente` e `ListarNiveisERequisitosDaVersao` — respondam com latencia e taxa de erro saudaveis, pois alimentam modulos a jusante; (2) que os comandos de escrita (criacao/versionamento/publicacao) nao falhem silenciosamente, garantindo a integridade cadastral que motiva o modulo; (3) que a transicao critica `PublicarVersaoModalidade` (que ativa uma versao e inativa a anterior) seja observavel, pois sustenta a invariante RN11. Como nao ha evento de dominio publico nem dependencia externa fixados no `contrato.md`, o monitoramento se concentra nas RED metrics das operacoes e em gauges de inventario do cadastro.

## Eventos de Negocio Monitorados

> O `contrato.md` nao fixa eventos publicos para M001 nesta rodada (ver secao "Mapeamento de Transporte"). Os sinais abaixo derivam de transicoes de estado das operacoes do contrato com impacto operacional, nao de eventos de dominio publicados.

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| Falha ao publicar versao de modalidade | contrato.md (PublicarVersaoModalidade) | counter m001_publicar_versao_modalidade_total{status="error"} | Sim | warning |
| Falha em comando de escrita (criar/versionar/registrar nivel) | contrato.md (Commands) | counter m001_{operacao}_total{status="error"} | Sim | warning |
| Falha em consulta de referencia canonica | contrato.md (ConsultarModalidadeVigente, ListarNiveisERequisitosDaVersao) | counter m001_{operacao}_total{status="error"} | Sim | warning |

## Metricas (Prometheus)

RED por operacao publica do `contrato.md` (label `status` em `success|error`):

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m001_criar_resolucao_total | counter | status | - | chamadas a CriarResolucao |
| m001_criar_resolucao_duration_seconds | histogram | - | s | latencia de CriarResolucao |
| m001_listar_consultar_resolucoes_total | counter | status | - | chamadas a ListarOuConsultarResolucoes |
| m001_listar_consultar_resolucoes_duration_seconds | histogram | - | s | latencia de ListarOuConsultarResolucoes |
| m001_criar_modalidade_total | counter | status | - | chamadas a CriarModalidade |
| m001_criar_modalidade_duration_seconds | histogram | - | s | latencia de CriarModalidade |
| m001_criar_versao_modalidade_total | counter | status | - | chamadas a CriarVersaoModalidade |
| m001_criar_versao_modalidade_duration_seconds | histogram | - | s | latencia de CriarVersaoModalidade |
| m001_publicar_versao_modalidade_total | counter | status | - | chamadas a PublicarVersaoModalidade |
| m001_publicar_versao_modalidade_duration_seconds | histogram | - | s | latencia de PublicarVersaoModalidade |
| m001_consultar_modalidade_vigente_total | counter | status | - | chamadas a ConsultarModalidadeVigente |
| m001_consultar_modalidade_vigente_duration_seconds | histogram | - | s | latencia de ConsultarModalidadeVigente |
| m001_registrar_nivel_versao_total | counter | status | - | chamadas a RegistrarNivelDaVersao |
| m001_registrar_nivel_versao_duration_seconds | histogram | - | s | latencia de RegistrarNivelDaVersao |
| m001_listar_niveis_requisitos_versao_total | counter | status | - | chamadas a ListarNiveisERequisitosDaVersao |
| m001_listar_niveis_requisitos_versao_duration_seconds | histogram | - | s | latencia de ListarNiveisERequisitosDaVersao |

Gauges de negocio (inventario do cadastro, baixa cardinalidade):

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m001_modalidades_ativas_total | gauge | - | - | modalidades com versao ativa publicada |
| m001_versoes_modalidade_em_edicao_total | gauge | - | - | versoes de modalidade no estado EM_EDICAO (RN08) |
| m001_versoes_modalidade_ativas_total | gauge | - | - | versoes de modalidade no estado ATIVA (RN11) |
| m001_niveis_ativos_total | gauge | - | - | versoes de nivel pertencentes a versoes ativas |
| m001_resolucoes_total | gauge | - | - | resolucoes cadastradas |

## Tracing (SigNoz / OpenTelemetry)

Um span por operacao publica do `contrato.md`. Nao ha integracao externa nesta rodada (so dependencias internas e referencia ao cadastro de Moeda), portanto sem spans `m001.ext.*`. Atributos sao identificadores de negocio nao sensiveis — nunca dado pessoal.

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m001.CriarResolucao | por chamada a CriarResolucao | resolucao.numero, resultado |
| m001.ListarOuConsultarResolucoes | por chamada a ListarOuConsultarResolucoes | filtro.numero, total_itens |
| m001.CriarModalidade | por chamada a CriarModalidade | modalidade.sigla, resolucao.id, resultado |
| m001.CriarVersaoModalidade | por chamada a CriarVersaoModalidade | modalidade.id, versao.copiada_de, resultado |
| m001.PublicarVersaoModalidade | por chamada a PublicarVersaoModalidade | versao.id, versao_anterior.id, resultado |
| m001.ConsultarModalidadeVigente | por chamada a ConsultarModalidadeVigente | modalidade.sigla, versao.estado |
| m001.RegistrarNivelDaVersao | por chamada a RegistrarNivelDaVersao | versao_modalidade.id, nivel.sigla, moeda, resultado |
| m001.ListarNiveisERequisitosDaVersao | por chamada a ListarNiveisERequisitosDaVersao | versao_modalidade.id, total_niveis |

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| taxa de sucesso de ConsultarModalidadeVigente (referencia canonica consumida por outros modulos) | 99,9% | 30d |
| taxa de sucesso de ListarNiveisERequisitosDaVersao | 99,5% | 30d |
| latencia p95 das consultas de referencia (ConsultarModalidadeVigente, ListarNiveisERequisitosDaVersao) | < 500ms | 30d |
| taxa de sucesso dos comandos de escrita (criar/versionar/publicar/registrar nivel) | 99% | 30d |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Consulta de modalidade vigente degradada | `sum(rate(m001_consultar_modalidade_vigente_total{status="error"}[5m])) / sum(rate(m001_consultar_modalidade_vigente_total[5m])) > 0.005` por 10m | critical | Referencia canonica afetando M003/M004/M009/M013 — verificar logs por trace_id no SigNoz. Runbook: TODO |
| Latencia alta nas consultas de referencia | `histogram_quantile(0.95, sum(rate(m001_consultar_modalidade_vigente_duration_seconds_bucket[5m])) by (le)) > 0.5` por 15m | warning | Investigar consultas/indices do cadastro. Runbook: TODO |
| Falha ao publicar versao de modalidade | `increase(m001_publicar_versao_modalidade_total{status="error"}[15m]) > 0` | warning | Transicao critica (RN11) falhando — checar estado da versao e versao anterior via span m001.PublicarVersaoModalidade. Runbook: TODO |
| Erros em comandos de escrita | `sum(rate(m001_criar_modalidade_total{status="error"}[15m])) + sum(rate(m001_criar_versao_modalidade_total{status="error"}[15m])) + sum(rate(m001_registrar_nivel_versao_total{status="error"}[15m])) > 0` por 15m | warning | Risco a integridade cadastral — analisar erro de validacao vs erro tecnico nos logs. Runbook: TODO |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M001 | rate/errors/duration por operacao do contrato | Grafana |
| Inventario do cadastro M001 | gauges de modalidades/versoes/niveis/resolucoes | Grafana |
| Saude da referencia canonica | sucesso e latencia de ConsultarModalidadeVigente e ListarNiveisERequisitosDaVersao | Grafana |
| Trace explorer M001 | spans m001.* | SigNoz |
