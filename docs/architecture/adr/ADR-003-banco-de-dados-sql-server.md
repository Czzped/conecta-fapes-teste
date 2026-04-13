# ADR-003: Banco de Dados SQL Server (instancia unica)

| Atributo | Valor |
|----------|-------|
| **Status** | Aceita |
| **Data** | 2026-04-13 |
| **Autores** | Time de Arquitetura ConectaFAPES |
| **Modulos impactados** | M001, M002, M003, M004, M005, M006, M007, M009 |

## Contexto

O ConectaFAPES gerencia dados financeiros, contratos, bolsas e prestacoes de contas que exigem consistencia transacional forte e rastreabilidade auditavel. O banco de dados e um componente central do sistema e precisa suportar transacoes ACID, relacionamentos complexos entre entidades e consultas analiticas para relatorios.

A decisao envolve tanto o sistema gerenciador de banco de dados (SGBD) quanto a estrategia de isolamento — banco unico compartilhado entre todos os modulos versus bancos separados por dominio.

## Decisao

Adotado **SQL Server com banco de dados unico**, organizado em schemas por dominio.

A consistencia transacional e um requisito nao negociavel para operacoes financeiras do ConectaFAPES (ex.: pagamento de bolsa + registro contabil devem ser atomicos). Um banco unico elimina a necessidade de coordenacao distribuida. A separacao logica por schemas preserva o isolamento conceitual dos dominios sem fragmentar a infraestrutura.

Convencao de schemas:

| Schema | Dominio |
|--------|---------|
| `corporativo` | 01 Corporativo e Administrativo |
| `planejamento` | 02 Planejamento e Estrategia |
| `fomento` | 03 e 04 Fomento Pre e Post Award |
| `financeiro` | 05 Financeiro |
| `suporte` | 06 Suporte e Inteligencia |
| `importacao` | 07 Importacao SIGFAPES |

O acesso ao banco e exclusivo pela camada de Infrastructure do backend — nenhum cliente externo acessa o banco diretamente.

## Consequencias

### Positivas

- Transacoes ACID entre dominios sem overhead de coordenacao distribuida
- Backup, restore e monitoramento centralizados em um unico servidor
- Entity Framework Core com SQL Server tem suporte de primeira classe na stack .NET
- Migrations gerenciadas centralmente via EF Core Migrations, com historico versionado

### Negativas

- Schema unico exige disciplina para evitar acoplamento entre dominios via foreign keys cruzadas — a regra e: FK dentro do mesmo schema; referencia cruzada somente por ID sem FK declarada
- Escalabilidade de escrita e limitada a um no primario (leitura pode ser distribuida via replicas)

### Riscos

- Crescimento do volume de dados financeiros e historicos pode exigir particao de tabelas ou arquivamento — mitigado por planejamento de retencao de dados desde o inicio
- Migracao futura para multi-banco, caso necessaria, e custosa — decisao consciente de aceitar esse trade-off em troca de simplicidade operacional agora

## Referencias

- [SQL Server Schemas](https://learn.microsoft.com/en-us/sql/relational-databases/security/authentication-access/create-a-database-schema)
- [Entity Framework Core — SQL Server Provider](https://learn.microsoft.com/en-us/ef/core/providers/sql-server/)
- [ADR-001 — Backend C# com Clean Architecture e CQRS](ADR-001-backend-csharp-clean-architecture-cqrs.md)
