# ADR-009: Hangfire para processamento de jobs em background

| Atributo | Valor |
|----------|-------|
| **Status** | Aceita |
| **Data** | 2026-04-14 |
| **Autores** | Time de Arquitetura ConectaFAPES |
| **Modulos impactados** | M004 |

## Contexto

O modulo M004 (Pagamento de Bolsistas) possui operacoes que nao podem ser executadas de forma sincrona numa requisicao HTTP:

- processamento de retornos bancarios (arquivos DP1 e DP9) vindos de filas Redis;
- geracao automatica de competencias de editais para planos mensais;
- cancelamento automatico de cotas quando alocacoes sao canceladas;
- finalizacao automatica de bolsas com prazo expirado.

Essas operacoes precisam ser recorrentes (a cada N minutos), resilientes a falhas, monitoraveis e com controle de concorrencia.

## Decisao

Adotado **Hangfire** com SQL Server storage para agendamento e execucao de jobs recorrentes em background.

### Infraestrutura

| Aspecto | Detalhe |
|---------|---------|
| **Servidor** | `ConectaFapes.Hangfire` — aplicacao ASP.NET Core dedicada |
| **Storage** | SQL Server (variavel `SQL_HANGFIRE_SERVER`) |
| **Dashboard** | Disponivel em `/hangfire` com autorizacao customizada |
| **Heartbeat** | 30 segundos |
| **Porta** | 8080 em producao |

### Jobs configurados

| Job | Frequencia | Modulo | Descricao |
|-----|------------|--------|-----------|
| `gerar-editais-competencia` | 10 min | M004 | Gera instancias de EditalCompetencia |
| `definir-plano-mensal` | Mensal | M004 | Ativa/desativa plano mensal vigente |
| `cancelar-cotas-com-alocacao-cancelada` | 2 min | M004 | Cancela cotas de alocacoes canceladas |
| `finalizar-alocacoes-bolsas-passadas` | 2 min | M004 | Finaliza bolsas expiradas |
| `processar-cancelamento-alocacao` | 5 min | M004 | Processa cancelamentos |
| `processar-retorno-remessa-cadastro` | 3 min | M004 | Consome fila Redis de retorno cadastro |
| `processar-retorno-remessa-pagamento` | 3 min | M004 | Consome fila Redis de retorno pagamento |

### Fluxo de processamento de retorno

```text
Redis (fila) → Job Hangfire → MinIO (busca arquivo) → Processamento → MinIO (salva resultado) → DB (atualiza status)
                                                                         ↓ (erro)
                                                                   DLQ (dead-letter queue)
```

## Consequencias

### Positivas

- Jobs recorrentes com configuracao declarativa (cron expressions)
- Dashboard visual para monitoramento e retry manual
- SQL Server storage — nao adiciona dependencia de infraestrutura nova
- Isolamento em aplicacao dedicada — crash de job nao afeta a API

### Negativas

- Servidor Hangfire e um componente extra para deployar e monitorar
- SQL Server storage pode ter contencao sob carga alta de jobs
- Dashboard requer autorizacao customizada para nao expor dados

### Riscos

- Jobs concorrentes processando a mesma remessa — mitigado por idempotencia (status EM_PROCESSAMENTO como lock)
- Falha silenciosa de jobs — mitigado por DLQ e log de excecoes com timezone Brasilia
- Acumulo de jobs na fila Redis se Hangfire ficar indisponivel — mitigado por heartbeat de 30s e monitoramento

## Referencias

- [Hangfire — Documentacao](https://www.hangfire.io/)
- [Arquitetura - Dados e Operacao](../04-dados-e-operacao.md) — secao "Hangfire"
- [M004 - Pagamento de Bolsistas](../../implementation/modules/M004-pagamento-bolsista/README.md)
