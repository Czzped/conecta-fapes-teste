# M023 - Integracao E-Docs

[← Voltar ao Backlog Central](../../../management/backlog-product.md) | [Discovery — Integracao E-Docs](../../../discovery/integracoes/e-docs.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST interna do modulo: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida da `SolicitacaoAssinatura` e do `Signatario` |
| [Modelo de Processo](modelo-processo.md) | Fluxo end-to-end com raias dos atores |

---

## Sobre o Modulo

Conecta precisa coletar **assinaturas eletronicas qualificadas** de pesquisadores, coordenadores, bolsistas, orientadores e servidores em documentos formais (Termo de Compromisso M009, Termo de Outorga M022, Termo de Aceite e Plano de Trabalho M003, Termo de Cooperacao M010). Hoje o sistema apenas registra `dataAssinatura` localmente, sem evidencia juridica. Esse vacuo bloqueia a formalizacao de bolsa (M009 EPIC-003) e a publicacao em Diario Oficial.

O **E-Docs** (`api.e-docs.es.gov.br`) e o sistema oficial do Estado do ES para gestao de documentos eletronicos com assinatura juridicamente valida (Lei 14.063/20). Identidade dos signatarios e fornecida pelo Acesso Cidadao — mesmo IdP que o Conecta consome via M005.

O M023 encapsula toda a comunicacao com o E-Docs e expoe contratos limpos para os modulos consumidores: **enviar documento, solicitar assinatura, polling de conclusao, baixar documento assinado**. Outros modulos nao precisam conhecer OAuth, MinIO, scopes ou protocolo assincrono.

| Atributo | Valor |
|----------|-------|
| **Dor do Cliente** | Ausencia de assinatura digital qualificada bloqueia formalizacao de bolsas, outorgas e parcerias |
| **Solucao** | Bounded context dedicado que adapta E-Docs V2 para Conecta, com polling de eventos e arquivamento local |
| **KPI** | Tempo medio de coleta de assinaturas; taxa de recusa; taxa de sucesso de captura |
| **Integracao externa** | [E-Docs ES](https://docs.e-docs.es.gov.br/api/) — V2 |
| **Identidade compartilhada** | [Acesso Cidadao](https://acessocidadao.es.gov.br) |

---

## Dominio

O M023 e dono apenas dos artefatos de integracao. Os documentos canonicos (`Documento`) pertencem ao M008. Os fluxos de negocio (Termo de Compromisso, Outorga, Aceite, Cooperacao) pertencem aos modulos respectivos. Aqui ficam:

- **`SolicitacaoAssinatura`** — agregado que representa um pedido de assinatura. Liga `Documento` (M008) ao `idDocumento` no E-Docs e mantem estado local sincronizado por polling.
- **`Signatario`** — entidade-filha que representa cada signatario do pedido (com papel, ordem, estado individual e motivo de recusa quando aplicavel).
- **`EventoAssinatura`** — log imutavel de cada evento detectado durante polling. Auditoria + replay em caso de erro.

Padrao de comunicacao com E-Docs: **assincrono**. Toda mutacao retorna `idEvento` (`HTTP 202 Accepted`); cliente faz polling via `GET /v2/eventos/{idEvento}` e `GET /v2/documentos/{idDocumento}`. **Nao ha webhook**.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Toda solicitacao de assinatura deve referenciar exatamente um `Documento` (M008) com PDF ja gerado e armazenado localmente. | Must |
| RN02 | A lista de signatarios e definida no momento do envio e nao pode ser alterada apos a captura inicial no E-Docs. Para mudar signatarios, criar nova solicitacao. | Must |
| RN03 | M023 usa exclusivamente a versao V2 da API E-Docs (`/v2/...`). V1 e descontinuada. | Must |
| RN04 | Token Acesso Cidadao e de **fluxo Client Credentials** para operacoes servidor-a-servidor (upload, captura, polling). Hybrid e usado apenas para fluxo do signatario, fora do M023. | Must |
| RN05 | Polling de status executa a cada 5 minutos para `SolicitacaoAssinatura` em estado `AGUARDANDO_ASSINATURAS` ou `PARCIALMENTE_ASSINADA`. | Must |
| RN06 | Quando todos os signatarios assinaram (`assinados == totalAssinantes && capturadoFinal == true`), M023 baixa o PDF assinado, calcula hash, arquiva em `M008.Documento` (`protocoloAssinatura`, `hashAssinatura`, `urlConteudoAssinado`) e emite evento `DocumentoAssinadoCompletamente`. | Must |
| RN07 | Recusa de qualquer signatario marca a solicitacao como `RECUSADA` e emite `AssinaturaRecusada` com motivo. Modulo consumidor decide o que fazer (M009: estado `AssinaturaRecusada`). | Must |
| RN08 | Solicitacao em estado pendente por mais de 30 dias dispara alerta para sysadmin via M020 (`AssinaturaExpirandoEdocs`). | Should |
| RN09 | Cada chamada `GET /v2/documentos/{id}` durante polling persiste `EventoAssinatura` para auditoria e idempotencia. | Must |
| RN10 | Tipo de assinatura (eletronica avancada vs ICP-Brasil) e parametrizado por classe documental. Termo de Compromisso e Outorga usam **eletronica avancada via E-Docs**; aditivos com chancela externa podem usar ICP-Brasil. Validar com Diretoria Juridica. | Must |
| RN11 | Toda PDF enviado deve ser **PDF com texto pesquisavel**, tamanho `<= 250 MB`. M023 valida antes do upload. | Must |
| RN12 | URL de upload temporaria do MinIO **expira em segundos**; M023 deve fazer `POST` do arquivo imediatamente apos receber a URL. | Must |
| RI1 | Uma `SolicitacaoAssinatura` so pode estar em **um estado** ativo (`ENVIADA`, `AGUARDANDO_ASSINATURAS`, `PARCIALMENTE_ASSINADA`, `ASSINADA`, `RECUSADA`, `ERRO`) — terminais sao `ASSINADA`, `RECUSADA`, `ERRO`. | Must |
| RI2 | Para um mesmo `Documento` (M008), so pode existir **uma `SolicitacaoAssinatura` nao terminal**. Reabrir documento ja assinado exige novo Documento. | Must |

---

## Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| E-Docs API V2 | Sistema externo | Assinatura, captura, encaminhamento, eventos |
| Acesso Cidadao | Sistema externo | OAuth Client Credentials para servidor↔servidor |
| M005 (Autenticacao) | Modulo interno | Identidade do servidor capturador (papel/lotacao) |
| M008 (Cadastros Corporativos) | Modulo interno | `Documento` canonico, `PessoaFisica` para signatarios |
| M020 (Comunicacao) | Modulo interno | Notificacao de signatarios + alertas de expiracao |

## Habilita

| Modulo | Uso |
|--------|-----|
| M009 (Bolsa) | Coleta de Termo de Compromisso (5 signatarios: Coordenador, Orientador, Bolsista, DIRAF, DIPRE) |
| M022 (Outorga) | Coleta de Termo de Outorga (Outorgado + Diretor) |
| M003 (Iniciativas) | Coleta de Termo de Aceite e Plano de Trabalho (Bolsista, Coordenador, Orientador) |
| M010 (Parcerias) | Coleta de Termo de Cooperacao e aditivos (Diretor FAPES + representante da Entidade Parceira) |

---

## Documentos relacionados

### Discovery interno

- [Discovery — E-Docs](../../../discovery/integracoes/e-docs.md) — capacidades, fluxos V2, sequence diagrams, scopes
- [Discovery — Organograma](../../../discovery/integracoes/organograma.md) — papeis dos signatarios servidores
- [Glossario](../../../discovery/glossario.md) — verbetes E-Docs, Assinatura Eletronica Qualificada, Protocolo E-Docs, Signatario Externo, Acesso Cidadao
- [Personas](../../../discovery/personas.md) — Coordenador, Orientador, Bolsista, Outorgado, Diretor, Servidor

### Documentacao oficial do provedor (E-Docs V2)

- [Documentacao E-Docs API V2](https://docs.e-docs.es.gov.br/api/) — referencia canonica
- [Solicitar Acesso](https://docs.e-docs.es.gov.br/api/SolicitarAcesso) — registrar aplicacao Conecta
- [Autenticacao](https://docs.e-docs.es.gov.br/api/Autenticacao) — OAuth 2.0, Client Credentials, Hybrid, scopes
- [Documentos](https://docs.e-docs.es.gov.br/api/Documentos) — upload, fase de assinatura, validacao
- [Captura](https://docs.e-docs.es.gov.br/api/Captura) — registro institucional + endpoints por tipo
- [Encaminhamentos](https://docs.e-docs.es.gov.br/api/Encaminhamentos) — roteamento entre setores/agentes
- [Restricao de Acesso](https://docs.e-docs.es.gov.br/api/RestricaoAcesso) — niveis Publico/Organizacional/Sigiloso/Classificado
- [Agente](https://docs.e-docs.es.gov.br/api/Agente) — quem assina/encaminha (servidor, cidadao, papel)
- [Classificacao Documental](https://docs.e-docs.es.gov.br/api/ClassificacaoDocumental) — tabela TTDD + retencao
- [Migracao V1 → V2](https://docs.e-docs.es.gov.br/api/MigracaoV1V2) — guia de migracao
- [Swagger publico V2](https://api.e-docs.es.gov.br/swagger/index.html?urls.primaryName=V2.0) — OpenAPI

### Sistemas integrados (referencias externas)

- [Acesso Cidadao](https://acessocidadao.es.gov.br) — IdP do Estado ES
- [API Acesso Cidadao](https://sistemas.es.gov.br/prodest/acessocidadao.webapi/swagger) — Swagger
- [Organograma ES](https://api.organograma.es.gov.br) — orgaos/setores/servidores
- Lei 14.063/20 — assinatura eletronica em atos administrativos do Estado

### Modulos consumidores Conecta

- [M005 — Autenticacao](../M005-autenticacao/README.md) — Acesso Cidadao como IdP comum
- [M008 — Cadastros Corporativos](../M008-cadastros-corporativos/README.md) — `Documento`, `PessoaFisica`
- [M009 — Gestao Bolsista](../M009-gestao-bolsista/README.md) — Termo de Compromisso de Bolsa
- [M010 — Parcerias](../M010-planejamento-estrategia/parcerias/modelo-estrutural.md) — Termo de Cooperacao
- [M020 — Comunicacao](../M020-comunicacao/README.md) — notificacoes a signatarios e alertas de expiracao
- [M022 — Contratacao Outorga](../M022-contratacao-outorga/modelo-estrutural.md) — Termo de Outorga
- [M003 — Iniciativas Captadas](../M003-gestao-iniciativas-captadas/README.md) — Termo de Aceite, Plano de Trabalho

### Ambientes

- Treinamento (homologacao): `https://api.treinamento.e-docs.es.gov.br`
- Producao: `https://api.e-docs.es.gov.br`
