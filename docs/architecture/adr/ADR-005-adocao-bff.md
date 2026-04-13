# ADR-005: Adocao de Backend for Frontend (BFF) para composicao de interfaces

| Atributo | Valor |
|----------|-------|
| **Status** | Proposta |
| **Data** | 2026-04-13 |
| **Autores** | Time de Arquitetura ConectaFAPES |
| **Modulos impactados** | M003, M004, M007, M008, M009, M010, M011, M012, M013, M014, M015, M016, M017, M018, M019, M020 |

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

Adotar uma camada de **Backend for Frontend (BFF)** como composicao de aplicacao orientada a tela, preservando os contratos modulares como fonte canonica do dominio.

Diretrizes da decisao:

- o BFF fica **entre o frontend e o gateway interno/APIs modulares**;
- o **M007 continua sendo gateway tecnico**, responsavel por roteamento, autenticacao, rate limiting e enforcement de acesso, e nao deve ser transformado em BFF;
- na fase inicial, o BFF deve ser implementado preferencialmente **no proprio Nuxt/Nitro**, por meio de rotas server-side orientadas a pagina e jornada;
- o BFF **consome apenas APIs/contratos dos modulos** e nao acessa banco de dados diretamente;
- o BFF **nao se torna dono de regras centrais de negocio**; sua responsabilidade e compor respostas aderentes a interface, traduzir chamadas e orquestrar fluxos que dependem de varios modulos;
- a autorizacao continua baseada em **OpenFGA**, aplicada pelo gateway e confirmada pelos backends quando necessario;
- a introducao deve comecar por **queries agregadas e telas compostas**, expandindo para comandos multi-etapa apenas quando houver ganho claro de experiencia e rastreabilidade.

Fluxo alvo de referencia:

```text
Browser -> Frontend Nuxt -> BFF -> Gateway Interno -> APIs Modulares
```

Se a complexidade operacional crescer, o desenho pode evoluir futuramente para BFFs logicos separados por canal, como front-office e back-office, sem alterar a regra de que contratos modulares continuam sendo a fonte de verdade do dominio.

## Consequencias

### Positivas

- reduz o numero de chamadas do frontend para montar telas compostas;
- diminui acoplamento do cliente com varios contratos internos ao mesmo tempo;
- permite payloads aderentes a cada tela, sem expor detalhes desnecessarios dos modulos;
- facilita evolucao de experiencia de usuario em jornadas que cruzam varios modulos;
- preserva o gateway tecnico e a governanca dos contratos modulares.

### Negativas

- adiciona uma nova camada de aplicacao para desenvolver, observar e testar;
- cria mais um ponto onde contratos precisam ser versionados e monitorados;
- exige disciplina para que o BFF nao vire repositorio de regra de negocio ou integracao ad hoc.

### Riscos

- o BFF concentrar regras de negocio que deveriam permanecer nos modulos — mitigado por revisar contratos e manter ownership no bounded context correto;
- o BFF contornar o modelo de seguranca e autorizacao — mitigado por obrigar propagacao de identidade e enforcement no gateway/backend;
- duplicacao de orquestracao entre frontend, BFF e modulos — mitigado por introducao incremental e foco inicial em jornadas com dor clara de composicao;
- aumento de latencia se o BFF apenas empilhar chamadas sem consolidacao efetiva — mitigado por projetar endpoints orientados a caso de uso e observabilidade por jornada.

## Referencias

- [Arquitetura - Visao Geral](../01-visao-geral.md)
- [Arquitetura - Modulos e Integracoes](../02-modulos-e-integracoes.md)
- [Arquitetura - Acesso e Seguranca](../03-acesso-e-seguranca.md)
- [Arquitetura - Dados e Operacao](../04-dados-e-operacao.md)
- [ADR-001 — Backend em C# com Clean Architecture e CQRS](ADR-001-backend-csharp-clean-architecture-cqrs.md)
- [ADR-002 — Frontend em Vue com Nuxt UI](ADR-002-frontend-vue-nuxtui.md)
- [ADR-004 — Infraestrutura com Docker e Kubernetes](ADR-004-infraestrutura-docker-kubernetes.md)
