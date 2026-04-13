# ADR-001: Backend em C# com Clean Architecture e CQRS

| Atributo | Valor |
|----------|-------|
| **Status** | Aceita |
| **Data** | 2026-04-13 |
| **Autores** | Time de Arquitetura ConectaFAPES |
| **Modulos impactados** | M001, M002, M003, M004, M005, M006, M007, M009 |

## Contexto

O ConectaFAPES precisa de um backend capaz de suportar fluxos complexos de negocio (gestao de editais, bolsas, pagamentos, prestacao de contas), regras transversais e integracao com sistemas externos (SERPRO, SIGFAPES). A base de codigo devera ser mantida por um time de desenvolvimento ao longo de varios anos, exigindo clareza de responsabilidades, testabilidade e capacidade de evolucao independente por dominio.

A escolha da linguagem, da arquitetura e do padrao de acesso a dados impacta diretamente a produtividade do time, a qualidade do codigo e a facilidade de onboarding de novos desenvolvedores.

## Decisao

Adotado **C# (.NET) com Clean Architecture e CQRS**.

A escolha se baseia na combinacao de tipagem forte, suporte nativo a dominio rico (value objects, aggregates, domain events), maturidade do ecossistema .NET para sistemas financeiros e governamentais, e na clareza que o CQRS traz para fluxos com regras de negocio complexas como os do ConectaFAPES.

A estrutura de pastas segue o modelo de quatro camadas:

```
src/
  ConectaFAPES.Domain/          # Entidades, value objects, regras de dominio
  ConectaFAPES.Application/     # Use cases, commands, queries, handlers (MediatR)
  ConectaFAPES.Infrastructure/  # Persistencia (EF Core), integrações externas
  ConectaFAPES.API/             # Controllers, middlewares, configuracao HTTP
```

## Consequencias

### Positivas

- Regras de negocio isoladas na camada de Domain sao testadas sem dependencia de banco ou framework
- CQRS permite otimizar queries de leitura (ex.: relatorios de BI) sem impactar o modelo de escrita
- Cada caso de uso e um handler independente, facilitando rastreabilidade e auditoria de operacoes
- Onboarding guiado pela estrutura de pastas: novos desenvolvedores sabem exatamente onde cada responsabilidade reside

### Negativas

- Volume de arquivos maior por caso de uso (command, handler, validator, response)
- Times sem experiencia previa em Clean Architecture precisam de nivelamento inicial

### Riscos

- Aplicacao incorreta dos conceitos pode gerar camadas vazias ou acoplamento encoberto — mitigado por revisao de codigo e linting de dependencias entre camadas
- MediatR pode obscurecer o fluxo de execucao para quem nao conhece o padrao — mitigado por documentacao dos handlers e convencoes de nomenclatura claras

## Referencias

- [Clean Architecture — Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [CQRS Pattern — Microsoft Docs](https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs)
- [MediatR — Jimmy Bogard](https://github.com/jbogard/MediatR)
