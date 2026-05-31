# M023 - Integracoes

[← Voltar ao Backlog Central](../../../management/backlog-product.md) | [Discovery — Integracoes](../../../discovery/integracoes/README.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos genericos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST interna do modulo: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes generico (provedor agnostico) |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida da `SolicitacaoAssinatura` e do `Signatario` |
| [Modelo de Processo](modelo-processo.md) | Fluxo end-to-end com raias dos atores |

### Adapters por provedor

| Provedor | Pasta | Capacidade | Descricao |
|----------|-------|------------|-----------|
| **E-Docs ES** | [e-docs/](e-docs/README.md) | Assinatura eletronica qualificada | Adapter para o sistema oficial de documentos eletronicos do Estado do ES — V2 |
| **Plataforma Lattes (CNPq)** | [lattes/](lattes/README.md) | Importacao de curriculo academico | Adapter para importar e sincronizar curriculos do CNPq, alimentando entidades de [M024 — Curriculo do Pesquisador](../M024-curriculo-pesquisador/README.md) |
| **ORCID (Public API)** | [orcid/](orcid/README.md) | Importacao de curriculo academico | Adapter para o registro publico ORCID. Fonte complementar ao Lattes, especialmente para pesquisador estrangeiro e producao bibliografica indexada por DOI. Alimenta entidades de M024 |

> Novos provedores (ICP-Brasil direto, GovBR, DocuSign, OpenAlex etc.) entram como subpastas adicionais. Cada adapter tem dominio proprio — assinatura usa `SolicitacaoAssinatura`/`Signatario`; adapters de curriculo (Lattes, ORCID) sao sincronos e populam entidades do M024 sem agregado persistido em M023.

---

## Sobre o Modulo

M023 e o modulo de **integracoes com sistemas externos** do Conecta. Hospeda adapters plugaveis que abstraem a comunicacao com APIs e plataformas externas atras de comandos e eventos genericos, isolando os modulos consumidores de detalhes de OAuth, polling, parsing, retries e idiossincrasias de cada provedor.

Hoje cobre duas familias de integracao:

### Familia 1 — Assinatura eletronica qualificada

Coleta de assinaturas com valor juridico sobre documentos do Conecta:

- Termo de Compromisso de Bolsa (M009)
- Termo de Outorga (M022)
- Termo de Aceite e Plano de Trabalho (M003)
- Termo de Cooperacao e aditivos (M010)

Antes do M023, o sistema apenas registrava `dataAssinatura` localmente, sem evidencia juridica. Esse vacuo bloqueava a formalizacao de bolsa (M009 EPIC-003 explicitamente "A definir") e a publicacao em Diario Oficial. Adapter ativo: **E-Docs ES V2** ([e-docs/](e-docs/README.md)).

### Familia 2 — Importacao de curriculo academico

Importacao e sincronizacao do curriculo do pesquisador para alimentar o modelo de dominio do M024:

- Selecao de Consultor Ad Hoc por expertise (M011)
- Validacao automatica de elegibilidade em editais (M011, M024)
- Indicadores agregados de producao cientifica FAPES (M018, M019)
- Perfil/vitrine do pesquisador no Conecta (M024)

Adapters ativos:
- **Plataforma Lattes (CNPq)** ([lattes/](lattes/README.md)) -- fonte canonica para pesquisador brasileiro.
- **ORCID Public API** ([orcid/](orcid/README.md)) -- complementar, especialmente para pesquisador estrangeiro e producao bibliografica indexada por DOI.

| Atributo | Valor |
|----------|-------|
| **Dor do Cliente** | Ausencia de assinatura digital qualificada bloqueia formalizacao de bolsas, outorgas e parcerias |
| **Solucao** | Bounded context dedicado com modelo agnostico de provedor + adapters plugaveis |
| **KPI** | Tempo medio de coleta de assinaturas; taxa de recusa; taxa de sucesso de captura |
| **Identidade** | [Acesso Cidadao](https://acessocidadao.es.gov.br) (compartilhado entre Conecta e provedores ES) |

---

## Dominio

O M023 e dono apenas dos artefatos de integracao. Os documentos canonicos (`Documento`) pertencem ao M008; o curriculo academico (`Curriculo` e entidades filhas) pertence ao M024. Os fluxos de negocio (Termo de Compromisso, Outorga, Aceite, Cooperacao, selecao de Ad Hoc, etc.) pertencem aos modulos respectivos. Aqui ficam:

### Dominio da Familia 1 (Assinatura)

- **`SolicitacaoAssinatura`** — agregado que representa um pedido de assinatura. Liga `Documento` (M008) ao `idExterno` no provedor e mantem estado local sincronizado.
- **`Signatario`** — entidade-filha que representa cada signatario do pedido (com papel, ordem, estado individual e motivo de recusa quando aplicavel).
- **`EventoAssinatura`** — log imutavel de cada evento detectado durante polling. Auditoria + replay em caso de erro.

Atributo `provedor` da `SolicitacaoAssinatura` indica qual adapter foi usado (`E_DOCS`, `ICP_BRASIL_DIRETO`, `GOVBR`, `OUTRO`).

### Dominio da Familia 2 (Importacao de curriculo)

A Familia 2 opera de forma **sincrona**: os adapters Lattes e ORCID retornam o snapshot persistido ou excecao tipada em-linha. Nao ha agregado de auditoria persistido em M023 -- sucesso e refletido em `Curriculo.dataUltimaSincronizacao` (M024); falhas vao para log estruturado.

- **`AreaConhecimentoNaoMapeada`** — log de discrepancia quando o adapter encontra area do Lattes/ORCID que nao bate com cadastro CNPq canonico de M008. Sem agregado persistido; e item do DTO de retorno do adapter (publicado por M024 como evento de dominio).

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Toda solicitacao de assinatura deve referenciar exatamente um `Documento` (M008) com PDF ja gerado e armazenado localmente. | Must |
| RN02 | A lista de signatarios e definida no momento do envio e nao pode ser alterada apos a captura inicial no provedor. Para mudar signatarios, criar nova solicitacao. | Must |
| RN03 | Cada `SolicitacaoAssinatura` e atendida por exatamente um adapter (`provedor`). Nao ha mistura de provedores no mesmo pedido. | Must |
| RN04 | Token de aplicacao do provedor (servidor↔servidor) usa fluxo Client Credentials. Token de signatario (login do cidadao no portal do provedor) usa fluxo Hybrid quando disponivel. | Must |
| RN05 | Polling de status executa a cada 5 minutos para `SolicitacaoAssinatura` em estado `AGUARDANDO_ASSINATURAS` ou `PARCIALMENTE_ASSINADA`. | Must |
| RN06 | Quando todos os signatarios assinaram, M023 baixa o PDF assinado, calcula hash, arquiva em `M008.Documento` (`protocoloAssinatura`, `hashAssinatura`, `urlConteudoAssinado`) e emite evento `DocumentoAssinadoCompletamente`. | Must |
| RN07 | Recusa de qualquer signatario marca a solicitacao como `RECUSADA` e emite `AssinaturaRecusada` com motivo. Modulo consumidor decide o que fazer. | Must |
| RN08 | Solicitacao em estado pendente por mais de 30 dias dispara alerta `AssinaturaExpirando` para sysadmin via M020. | Should |
| RN09 | Cada chamada ao provedor durante polling persiste `EventoAssinatura` para auditoria e idempotencia. | Must |
| RN10 | Tipo de assinatura (eletronica avancada vs ICP-Brasil) e parametrizado por classe documental. Validar com Diretoria Juridica conforme Lei 14.063/20. | Must |
| RN11 | PDF enviado deve ser texto pesquisavel; tamanho conforme limite do provedor (E-Docs: 250 MB). M023 valida antes do upload. | Must |
| RN12 | URL de upload temporaria do storage do provedor pode expirar em segundos; M023 deve fazer `POST` do arquivo imediatamente apos receber a URL. | Must |
| RI1 | Uma `SolicitacaoAssinatura` so pode estar em **um estado** ativo (`ENVIADA`, `AGUARDANDO_ASSINATURAS`, `PARCIALMENTE_ASSINADA`, `ASSINADA`, `RECUSADA`, `ERRO`) — terminais sao `ASSINADA`, `RECUSADA`, `ERRO`. | Must |
| RI2 | Para um mesmo `Documento` (M008), so pode existir **uma `SolicitacaoAssinatura` nao terminal**. Reabrir documento ja assinado exige novo Documento. | Must |

---

## Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| Provedor de assinatura externo (E-Docs V2 hoje) | Sistema externo | Futuros provedores entram como adapters em subpastas deste modulo |
| Acesso Cidadao | Sistema externo | OAuth Client Credentials (servidor↔servidor) + Hybrid (login do signatario) |
| M005 (Autenticacao) | Modulo interno | Identidade do servidor capturador |
| M008 (Cadastros Corporativos) | Modulo interno | `Documento` canonico, `PessoaFisica` para signatarios |
| M020 (Comunicacao) | Modulo interno | Notificacao de signatarios + alertas |

## Habilita

| Modulo | Uso | Familia |
|--------|-----|---------|
| M009 (Bolsa) | Termo de Compromisso (5 signatarios) | Assinatura |
| M022 (Outorga) | Termo de Outorga (Outorgado + Diretor) | Assinatura |
| M003 (Iniciativas) | Termo de Aceite, Plano de Trabalho | Assinatura |
| M010 (Parcerias) | Termo de Cooperacao + aditivos | Assinatura |
| [M024 (Curriculo Pesquisador)](../M024-curriculo-pesquisador/README.md) | Importa e sincroniza Curriculo via adapters Lattes e ORCID | Curriculo |
| [M011 (Captacao)](../M011-configuracao-captacao/README.md) | Selecao de Ad Hoc consome curriculo importado | Curriculo |
| [M018 (BI)](../M018-business-intelligence/README.md) | Indicadores agregados de producao cientifica | Curriculo |

---

## Documentos relacionados

### Discovery interno

- [Discovery — E-Docs](../../../discovery/integracoes/e-docs.md) — capacidades, fluxos V2, sequence diagrams, scopes
- [Discovery — Organograma](../../../discovery/integracoes/organograma.md) — papeis dos signatarios servidores
- [Glossario](../../../discovery/glossario.md) — verbetes Assinatura Eletronica Qualificada, Signatario Externo, Acesso Cidadao
- [Personas](../../../discovery/personas.md) — Coordenador, Orientador, Bolsista, Outorgado, Diretor, Servidor

### Adapter E-Docs (subpasta deste modulo)

- [e-docs/README.md](e-docs/README.md) — overview do adapter
- [e-docs/adapter.md](e-docs/adapter.md) — mapeamento V2 + endpoints + scopes
- [e-docs/fluxos.md](e-docs/fluxos.md) — fluxos especificos com sequence diagrams

### Sistemas integrados (referencias externas)

- [Acesso Cidadao](https://acessocidadao.es.gov.br) — IdP do Estado ES
- [API Acesso Cidadao](https://sistemas.es.gov.br/prodest/acessocidadao.webapi/swagger) — Swagger
- [Documentacao E-Docs API V2](https://docs.e-docs.es.gov.br/api/) — referencia canonica
- Lei 14.063/20 — assinatura eletronica em atos administrativos do Estado

### Modulos consumidores Conecta

- [M005 — Autenticacao](../M005-autenticacao/README.md)
- [M008 — Cadastros Corporativos](../M008-cadastros-corporativos/README.md)
- [M009 — Gestao Bolsista](../M009-gestao-bolsista/README.md)
- [M010 — Parcerias](../M010-planejamento-estrategia/parcerias/modelo-estrutural.md)
- [M020 — Comunicacao](../M020-comunicacao/README.md)
- [M022 — Contratacao Outorga](../M022-contratacao-outorga/modelo-estrutural.md)
- [M003 — Iniciativas Captadas](../M003-gestao-projetos-captados/README.md)
