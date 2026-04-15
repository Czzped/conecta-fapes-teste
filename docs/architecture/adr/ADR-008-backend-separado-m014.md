# ADR-008: Backend separado para M014 (Prestacao de Contas)

| Atributo | Valor |
|----------|-------|
| **Status** | Aceita |
| **Data** | 2026-04-14 |
| **Autores** | Time de Arquitetura ConectaFAPES |
| **Modulos impactados** | M014 |

## Contexto

O modulo M014 (Prestacao de Contas) foi o segundo bounded context implementado no ConectaFAPES, apos o M004 (Pagamento de Bolsistas). Na epoca da implementacao, havia necessidade de:

- isolamento de dados entre pagamento e prestacao de contas;
- integracao com API externa SERPRO (consulta NF-e) com autenticacao OAuth2 propria;
- ciclo de desenvolvimento independente do backend de pagamento;
- modelagem de dominio com Rich Domain (metodos de negocio nas entidades) diferente do padrao CRUD do M004.

## Decisao

O M014 foi implementado como um **projeto backend separado** (`ConectaFapes.PrestacaoContas.*`) com:

- AppDbContext proprio e SQL Server separado
- Estrutura de 5 projetos: API, Application, Domain, Infrastructure, Common
- Base URL propria: `/api/prestacao-de-contas/{entidade}`
- Integracoes proprias: SERPRO (NF-e), MinIO, Redis (opcional)
- Middleware dedicado: AuditMiddleware, ExceptionHandlingMiddleware (RFC 7807), PerformanceMonitoringMiddleware
- Entidades com Rich Domain Model (metodos Submeter, Aprovar, Negar, SolicitarRevisao)

### Referencia cruzada com M004

O M014 acessa dados de Projeto e AlocacaoBolsista via **views de banco de dados** (`ProjetoRef`, `AlocacaoBolsistaRef`) em vez de chamadas HTTP ao M003. Isso reduz latencia mas cria acoplamento a nivel de banco.

### Debito tecnico reconhecido

Entidades financeiras (ContaBancaria, Orcamento, ContaContabil, TransacaoFinanceira) foram implementadas no backend do M014 por conveniencia, mas pertencem conceitualmente a M016 (Contabilidade e Financeiro) e M013 (Gestao Orcamentaria). Ver [M014/backlog.md](../../implementation/modules/M014-prestacao-contas/backlog.md#debito-tecnico).

## Consequencias

### Positivas

- Isolamento completo: deploy, banco e ciclo de desenvolvimento independentes
- Dominio rico com encapsulamento de regras nas entidades
- Integracao SERPRO isolada, sem impacto no backend de pagamento
- Middleware de auditoria e performance especifico para o contexto

### Negativas

- Duplicacao de infraestrutura: dois AppDbContexts, duas instancias de MinIO, dois registros de DI
- Acoplamento via views de banco (ProjetoRef, AlocacaoBolsistaRef) em vez de API — fragilidade em caso de mudanca de schema
- Entidades financeiras no lugar errado (M014 em vez de M016/M013)

### Riscos

- Evolucao divergente dos dois backends (M004 e M014) sem padronizacao — mitigado por ADR-001 (mesma arquitetura base)
- Views de banco como integracao criam dependencia oculta entre schemas — mitigado por manter views explicitas e documentadas
- Unificacao futura dos backends pode ser custosa — decisao deve ser reavaliada quando M016 for implementado

## Referencias

- [Arquitetura - Dados e Operacao](../04-dados-e-operacao.md) — secao "Backend de Prestacao de Contas"
- [M014 - Prestacao de Contas](../../implementation/modules/M014-prestacao-contas/README.md)
- [ADR-001 — Backend em C# com Clean Architecture e CQRS](ADR-001-backend-csharp-clean-architecture-cqrs.md)
- [ADR-003 — Banco de Dados SQL Server](ADR-003-banco-de-dados-sql-server.md)
