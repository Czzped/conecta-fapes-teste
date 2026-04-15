# ADR-005: Adocao de Backend for Frontend (BFF) para composicao de interfaces

| Atributo | Valor |
|----------|-------|
| **Status** | Aceita |
| **Data** | 2026-04-14 |
| **Autores** | Time de Arquitetura ConectaFAPES |
| **Modulos impactados** | Todos os modulos consumidos por produtos frontend |

## Contexto

O ConectaFAPES possui jornadas de usuario que agregam dados e operacoes de varios modulos ao mesmo tempo. Exemplos recorrentes:

- configuracao e publicacao de edital, que combinam informacoes de planejamento, edital e parametrizacao;
- acompanhamento da execucao de iniciativas, que combina projeto, resultados, orcamento, prestacao de contas e suspensao/finalizacao;
- operacao financeira e de pagamento, que cruza bolsistas, pagamentos, compliance PLD e indicadores.

Sem uma camada de composicao orientada a interface, o frontend tende a:

- chamar muitos endpoints modulares para montar uma unica tela;
- replicar logica de orquestracao no cliente;
- acoplar-se demais a contratos internos de varios modulos;
- sofrer com payloads excessivos ou insuficientes para a necessidade real da interface.

Ao mesmo tempo, o projeto ja possui um desenho arquitetural com gateways tecnicos, autenticacao federada via Acesso Cidadao, autorizacao com OpenFGA e backend modular com contratos por modulo. A decisao precisa preservar esse desenho e evitar que o gateway tecnico vire dono de regras de apresentacao ou que a interface passe a depender diretamente do banco de dados.

## Decisao

Adotar **um BFF (Backend for Frontend) por produto**, como camada de composicao orientada a tela, preservando os contratos modulares como fonte canonica do dominio.

### Topologia: um BFF por produto

Cada produto frontend possui seu proprio BFF, otimizado para as jornadas e perfis de usuario daquele produto:

```text
Portal Coordenador ──→ BFF Coordenador ──→ Gateway Interno ──→ APIs Modulares
Portal Admin ──────→ BFF Admin ────────→ Gateway Interno ──→ APIs Modulares
Importador ─────────→ (sem BFF — chama M002 diretamente)
```

A decisao de um BFF por produto (e nao um BFF unico compartilhado) se baseia em:

- **jornadas distintas**: o coordenador de projeto e o operador da agencia tem fluxos completamente diferentes;
- **modulos consumidos parcialmente sobrepostos**: M003/M004/M008 sao compartilhados, mas as composicoes sao especificas por tela;
- **ciclo de deploy independente**: mudancas no portal admin nao impactam o portal do coordenador;
- **escalabilidade de equipe**: times podem trabalhar em paralelo nos BFFs sem coordenacao.

O Importador nao possui BFF porque consome essencialmente M002 sem jornadas multi-modulo.

### BFF Coordenador — Mapa de composicao

| Jornada | Modulos compostos | Endpoint BFF |
|---------|-------------------|--------------|
| Meu Projeto | M003 (projeto) + M009 (bolsas) + M004 (pagamentos) | `GET /bff/coordenador/projeto/:id/resumo` |
| Minha Equipe | M003 (projeto) + M009 (bolsas, docs) + M008 (pessoas) | `GET /bff/coordenador/projeto/:id/equipe` |
| Cadastro Bolsista | M003 (alocacao) + M009 (bolsa) + M001 (modalidades) + M008 (pessoa) | `POST /bff/coordenador/projeto/:id/bolsista` |
| Pagamentos | M004 (pagamentos) + M003 (projeto) | `GET /bff/coordenador/projeto/:id/pagamentos` |
| Prestacao Financeira | M014 (prestacao) + M013 (orcamento) + M003 (projeto) | `GET /bff/coordenador/projeto/:id/prestacao` |
| Remanejamento | M013 (orcamento) + M001 (modalidades) | `POST /bff/coordenador/projeto/:id/remanejamento` |
| Perfil | M008 (pessoa, endereco, banco) | `PUT /bff/coordenador/perfil` |

**Stack recomendada:** Nuxt/Nitro (server routes no mesmo runtime do frontend).

### BFF Admin — Mapa de composicao

| Jornada | Modulos compostos | Endpoint BFF |
|---------|-------------------|--------------|
| Dashboard Pagamento | M004 (folhas, remessas) + M003 (editais) + M008 (areas tecnicas) | `GET /bff/admin/dashboard/pagamento` |
| Folha de Pagamento | M004 (folha, decisoes, guias) + M003 (editais, projetos) | `GET /bff/admin/folha/:id/detalhes` |
| Importacao | M002 (importacao) + M003 (editais) + M008 (pessoas) | `GET /bff/admin/importacao/status` |
| Modalidades | M001 (resolucao, versao, nivel) | `GET /bff/admin/modalidades` |

**Stack recomendada:** Nuxt/Nitro ou .NET minimal API (decisao da equipe responsavel).

### Regras do BFF

1. O BFF **so consome APIs modulares** — nunca acessa banco de dados diretamente.
2. O BFF **nao contem regras de negocio** — apenas composicao, transformacao e cache.
3. O BFF e **dono do contrato com o frontend** — mudancas nos modulos backend nao quebram o frontend se o BFF absorver a diferenca.
4. Cada BFF **vive no repositorio do seu produto** — nao e um modulo de `implementation/`.
5. O **M007 (Gateway) continua sendo a camada tecnica** — autenticacao, rate limiting, routing. O BFF fica entre o frontend e o gateway.
6. A autorizacao continua baseada em **OpenFGA**, aplicada pelo gateway e confirmada pelos backends quando necessario.
7. A introducao deve comecar por **queries agregadas e telas compostas**, expandindo para comandos multi-etapa apenas quando houver ganho claro.

### Implementacao incremental

A introducao do BFF deve ser incremental:

1. **Fase 1** — Queries compostas: telas que hoje fazem 3+ chamadas ao backend passam a chamar 1 endpoint BFF.
2. **Fase 2** — Comandos multi-etapa: jornadas como cadastro de bolsista (M003 + M009 + M001 + M008) ganham endpoint BFF que orquestra a sequencia.
3. **Fase 3** — Cache e otimizacao: BFF passa a cachear dados de referencia (modalidades, areas tecnicas, pessoas) para reduzir latencia.

## Consequencias

### Positivas

- Reduz o numero de chamadas do frontend para montar telas compostas.
- Diminui acoplamento do cliente com varios contratos internos ao mesmo tempo.
- Permite payloads aderentes a cada tela, sem expor detalhes desnecessarios dos modulos.
- Facilita evolucao de experiencia de usuario em jornadas que cruzam varios modulos.
- Preserva o gateway tecnico e a governanca dos contratos modulares.
- Deploy independente por produto: mudancas no BFF Admin nao afetam o BFF Coordenador.
- Times podem trabalhar em paralelo nos BFFs de cada produto.

### Negativas

- Adiciona uma camada de aplicacao por produto para desenvolver, observar e testar.
- Cria mais pontos onde contratos precisam ser versionados e monitorados.
- Exige disciplina para que o BFF nao vire repositorio de regra de negocio.

### Riscos

- O BFF concentrar regras de negocio que deveriam permanecer nos modulos — mitigado por revisao de contratos e ownership claro no bounded context.
- O BFF contornar o modelo de seguranca e autorizacao — mitigado por obrigar propagacao de identidade e enforcement no gateway/backend.
- Duplicacao de orquestracao entre frontend, BFF e modulos — mitigado por introducao incremental e foco em jornadas com dor clara.
- Aumento de latencia se o BFF apenas empilhar chamadas sem consolidacao — mitigado por endpoints orientados a caso de uso e observabilidade por jornada.

## Referencias

- [Arquitetura - Visao Geral](../01-visao-geral.md)
- [Arquitetura - Modulos e Integracoes](../02-modulos-e-integracoes.md)
- [Arquitetura - Acesso e Seguranca](../03-acesso-e-seguranca.md)
- [Arquitetura - Dados e Operacao](../04-dados-e-operacao.md)
- [ADR-001 — Backend em C# com Clean Architecture e CQRS](ADR-001-backend-csharp-clean-architecture-cqrs.md)
- [ADR-002 — Frontend em Vue com Nuxt UI](ADR-002-frontend-vue-nuxtui.md)
- [ADR-004 — Infraestrutura com Docker e Kubernetes](ADR-004-infraestrutura-docker-kubernetes.md)
- [Portal Coordenador](../../products/portal-coordenador/README.md)
- [Portal Admin](../../products/portal-admin/README.md)
