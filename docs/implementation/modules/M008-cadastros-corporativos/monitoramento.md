# Monitoramento e Observabilidade — M008 Cadastros Corporativos

Dominio e regras: ver [README.md](README.md) | Eventos: ver eventos-dominio.md (TODO: artefato ainda nao co-localizado no modulo)

## Objetivo de Sustentacao

Garantir que a base canonica de cadastros corporativos (pessoas fisicas, instituicoes, unidades organizacionais, responsaveis e referencias: rubricas, diarias, geografia, classificacoes) permaneca integra, unica e disponivel para todos os modulos consumidores. Em producao a sustentacao precisa enxergar: unicidade de CPF/CNPJ (RN01, RN02), suspensoes de pessoa que bloqueiam operacoes downstream (RN05), integridade de responsavel unico ativo por entidade (RN11, RN26, RI1, RI3), e a sincronizacao automatica de pessoas via Acesso Cidadao (RN10), que e a unica integracao externa do contrato. Por ser dado mestre com dado pessoal (PessoaFisica) e dado fiscal (CNPJ), nenhum sinal pode carregar `cpf`, `cnpj`, `nome` ou `email` em label de metrica ou atributo de span.

## Eventos de Negocio Monitorados

| Evento | Fonte | Sinal | Alerta? | Severidade |
|--------|-------|-------|---------|------------|
| PESSOA_SUSPENSA (bloqueia operacoes vinculadas, RN05) | AlterarEstadoPessoaFisica / eventos-dominio.md (TODO) | counter `m008_alterar_estado_pessoa_total{novo_estado="suspensa"}` | Sim | warning |
| CPF_DUPLICADO rejeitado (RN01) | CadastrarOuAtualizarPessoaFisica | counter `m008_cadastrar_pessoa_total{status="error",motivo="cpf_duplicado"}` | Sim | warning |
| CNPJ_DUPLICADO rejeitado (RN02) | CadastrarInstituicao | counter `m008_cadastrar_instituicao_total{status="error",motivo="cnpj_duplicado"}` | Sim | warning |
| MANDATO_SOBREPOSTO rejeitado (RN11/RN26/RI1/RI3) | RegistrarResponsavel | counter `m008_registrar_responsavel_total{status="error",motivo="mandato_sobreposto"}` | Sim | warning |
| Falha de sincronizacao via Acesso Cidadao (RN10) | SincronizarPessoaViaAcessoCidadao | counter `m008_sincronizar_pessoa_total{status="error"}` | Sim | critical |
| CONSULTA_VIGENTE ausente (diaria/parametro vigente nao encontrado) | ConsultarTipoDiariaVigente | counter `m008_consultar_tipo_diaria_vigente_total{status="error",motivo="vigente_ausente"}` | Sim | warning |

## Metricas (Prometheus)

RED por operacao publica do contrato. Todas com prefixo `m008_`, `snake_case`, unidade no sufixo, labels de baixa cardinalidade. Nunca `cpf`/`cnpj`/`nome`/`email`/id de entidade em label.

| Metrica | Tipo | Labels | Unidade | Descricao |
|---------|------|--------|---------|-----------|
| m008_cadastrar_pessoa_total | counter | status, motivo | - | chamadas a CadastrarOuAtualizarPessoaFisica |
| m008_cadastrar_pessoa_duration_seconds | histogram | - | s | latencia CadastrarOuAtualizarPessoaFisica |
| m008_alterar_estado_pessoa_total | counter | status, novo_estado | - | chamadas a AlterarEstadoPessoaFisica |
| m008_alterar_estado_pessoa_duration_seconds | histogram | - | s | latencia AlterarEstadoPessoaFisica |
| m008_cadastrar_instituicao_total | counter | status, motivo | - | chamadas a CadastrarInstituicao |
| m008_cadastrar_instituicao_duration_seconds | histogram | - | s | latencia CadastrarInstituicao |
| m008_cadastrar_unidade_total | counter | status, motivo | - | chamadas a CadastrarUnidadeOrganizacional |
| m008_cadastrar_unidade_duration_seconds | histogram | - | s | latencia CadastrarUnidadeOrganizacional |
| m008_registrar_responsavel_total | counter | status, motivo, alvo | - | chamadas a RegistrarResponsavel (alvo=instituicao|unidade) |
| m008_registrar_responsavel_duration_seconds | histogram | - | s | latencia RegistrarResponsavel |
| m008_sincronizar_pessoa_total | counter | status, resultado | - | eventos SincronizarPessoaViaAcessoCidadao (resultado=criada|vinculada) |
| m008_sincronizar_pessoa_duration_seconds | histogram | - | s | latencia processamento do evento Acesso Cidadao |
| m008_cadastrar_rubrica_total | counter | status, motivo | - | chamadas a CadastrarRubrica |
| m008_cadastrar_rubrica_duration_seconds | histogram | - | s | latencia CadastrarRubrica |
| m008_atualizar_rubrica_total | counter | status, motivo | - | chamadas a AtualizarRubrica |
| m008_atualizar_rubrica_duration_seconds | histogram | - | s | latencia AtualizarRubrica |
| m008_alterar_estado_rubrica_total | counter | status, ativa | - | chamadas a AlterarEstadoRubrica |
| m008_alterar_estado_rubrica_duration_seconds | histogram | - | s | latencia AlterarEstadoRubrica |
| m008_cadastrar_abrangencia_diaria_total | counter | status | - | chamadas a CadastrarAbrangenciaDiaria |
| m008_cadastrar_abrangencia_diaria_duration_seconds | histogram | - | s | latencia CadastrarAbrangenciaDiaria |
| m008_cadastrar_tipo_diaria_total | counter | status, motivo | - | chamadas a CadastrarTipoDiaria |
| m008_cadastrar_tipo_diaria_duration_seconds | histogram | - | s | latencia CadastrarTipoDiaria |
| m008_cadastrar_parametro_calculo_diaria_total | counter | status, motivo | - | chamadas a CadastrarParametroCalculoDiaria |
| m008_cadastrar_parametro_calculo_diaria_duration_seconds | histogram | - | s | latencia CadastrarParametroCalculoDiaria |
| m008_consultar_tipo_diaria_vigente_total | counter | status, motivo | - | chamadas a ConsultarTipoDiariaVigente |
| m008_consultar_tipo_diaria_vigente_duration_seconds | histogram | - | s | latencia ConsultarTipoDiariaVigente |
| m008_consultar_cadastros_total | counter | status, tipo_cadastro | - | chamadas a ConsultarCadastrosCorporativos (tipo_cadastro de baixa cardinalidade) |
| m008_consultar_cadastros_duration_seconds | histogram | tipo_cadastro | s | latencia ConsultarCadastrosCorporativos |
| m008_pessoas_ativas | gauge | - | - | pessoas fisicas em estado ATIVA (gauge de negocio) |
| m008_pessoas_suspensas | gauge | - | - | pessoas fisicas suspensas (RN05) |
| m008_instituicoes_ativas | gauge | - | - | instituicoes cadastradas ativas |
| m008_unidades_organizacionais_ativas | gauge | - | - | unidades organizacionais ativas |
| m008_rubricas_ativas | gauge | ativa | - | rubricas por indicador ativa (RN18) |
| m008_responsaveis_ativos | gauge | alvo | - | responsaveis ativos por tipo de alvo (instituicao/unidade) |
| m008_entidades_sem_responsavel_ativo | gauge | alvo | - | instituicoes/unidades violando RN11/RN26 (deveria ser zero) |

### Validacao externa de CPF/CNPJ (SERPRO / ReceitaWS) — TODO

O `contrato.md` so declara o **Acesso Cidadao** como sistema externo (origem de eventos de cadastro). Nao ha mencao a validacao sincrona de CPF via SERPRO nem de CNPJ via ReceitaWS na superficie publica atual. **TODO**: confirmar com o time se M008 chama SERPRO/ReceitaWS no momento de cadastrar pessoa/instituicao. Se confirmado, expor por dependencia:

| Metrica (condicional, TODO confirmar) | Tipo | Labels | Unidade | Descricao |
|---------------------------------------|------|--------|---------|-----------|
| m008_ext_validacao_total | counter | dep, status | - | chamadas de validacao externa (dep=serpro|receitaws) |
| m008_ext_validacao_duration_seconds | histogram | dep | s | latencia da validacao externa por dependencia |

## Tracing (SigNoz / OpenTelemetry)

Um span por operacao publica do contrato (`m008.{Operacao}`), span filho por chamada externa (`m008.ext.{dep}`). Atributos sempre nao sensiveis — nunca `cpf`, `cnpj`, `nome`, `email`.

| Span | Quando | Atributos (nao sensiveis) |
|------|--------|----------------------------|
| m008.CadastrarOuAtualizarPessoaFisica | por command | resultado (criada/atualizada), modulo.origem |
| m008.AlterarEstadoPessoaFisica | por command | novo_estado, tem_justificativa |
| m008.CadastrarInstituicao | por command | is_publica, tem_instituicao_superior, tipo_instituicao.codigo |
| m008.CadastrarUnidadeOrganizacional | por command | tem_parent_instituicao, tem_parent_unidade |
| m008.RegistrarResponsavel | por command | alvo (instituicao/unidade), mandato_ativo |
| m008.SincronizarPessoaViaAcessoCidadao | por evento consumido | origem, resultado (criada/vinculada) |
| m008.CadastrarRubrica | por command | natureza_despesa, tem_rubrica_pai |
| m008.AtualizarRubrica | por command | tem_justificativa, alterou_pai |
| m008.AlterarEstadoRubrica | por command | ativa, tem_justificativa |
| m008.CadastrarAbrangenciaDiaria | por command | ativo |
| m008.CadastrarTipoDiaria | por command | ativo, abrangencia.codigo |
| m008.CadastrarParametroCalculoDiaria | por command | ativo |
| m008.ConsultarTipoDiariaVigente | por query | abrangencia.codigo, vigente_encontrado |
| m008.ConsultarCadastrosCorporativos | por query | tipo_cadastro, total_resultados |
| m008.ext.acesso_cidadao | por sincronizacao com Acesso Cidadao | peer.service, http.status_code, resultado |
| m008.ext.serpro (TODO) | por validacao de CPF via SERPRO, se confirmada | peer.service, http.status_code, valido |
| m008.ext.receitaws (TODO) | por validacao de CNPJ via ReceitaWS, se confirmada | peer.service, http.status_code, valido |

## SLIs / SLOs

| SLI | SLO | Janela |
|-----|-----|--------|
| taxa de sucesso de SincronizarPessoaViaAcessoCidadao (status!=error) | 99% | 30d |
| latencia p95 de ConsultarCadastrosCorporativos (consulta canonica usada por todos os modulos) | < 500 ms | 30d |
| taxa de sucesso de CadastrarOuAtualizarPessoaFisica (excluindo recusas de negocio cpf_duplicado/dados_invalidos) | 99,5% | 30d |
| entidades sem responsavel ativo (m008_entidades_sem_responsavel_ativo) | = 0 (RN11/RN26) | continuo |

## Alertas

| Alerta | Condicao | Severidade | Acao / Runbook |
|--------|----------|------------|----------------|
| Falha de sincronizacao Acesso Cidadao | `sum(rate(m008_sincronizar_pessoa_total{status="error"}[5m])) > 0` por 10m | critical | TODO: runbook reprocessamento de evento Acesso Cidadao |
| Acesso Cidadao indisponivel | `sum(rate(m008_ext_validacao_total{dep="acesso_cidadao",status="error"}[5m])) / sum(rate(m008_ext_validacao_total{dep="acesso_cidadao"}[5m])) > 0.2` (TODO: se metrica ext for instrumentada) | critical | TODO: runbook integracao Acesso Cidadao |
| Entidade sem responsavel ativo | `max(m008_entidades_sem_responsavel_ativo) > 0` por 15m | warning | TODO: runbook reatribuir responsavel (RN11/RN26) |
| Consulta cadastral lenta (SLO em risco) | `histogram_quantile(0.95, sum(rate(m008_consultar_cadastros_duration_seconds_bucket[5m])) by (le)) > 0.5` por 15m | warning | TODO: runbook performance consulta canonica |
| Pico de CPF duplicado | `sum(rate(m008_cadastrar_pessoa_total{status="error",motivo="cpf_duplicado"}[15m])) > 0.1` | warning | TODO: runbook investigar tentativa de duplicidade (RN01) |
| Pico de mandato sobreposto | `sum(rate(m008_registrar_responsavel_total{status="error",motivo="mandato_sobreposto"}[15m])) > 0.1` | warning | TODO: runbook conflito de responsavel (RN11/RN26/RI1/RI3) |

## Dashboards

| Painel | Conteudo | Ferramenta |
|--------|----------|------------|
| RED M008 | rate/errors/duration por operacao do contrato | Grafana |
| Gauges de negocio M008 | pessoas ativas/suspensas, instituicoes/unidades/rubricas ativas, responsaveis ativos, entidades sem responsavel | Grafana |
| Saude integracao externa | latencia/erro por dependencia (acesso_cidadao; serpro/receitaws se confirmadas) | Grafana |
| Trace explorer | spans `m008.*` filtrados por operacao e dependencia | SigNoz |
