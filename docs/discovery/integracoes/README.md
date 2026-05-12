# Integracoes Externas — ConectaFAPES

Documentos de discovery para sistemas externos consumidos pela plataforma. Cada documento descreve: visao geral do sistema, capacidades aproveitadas, fluxos onde aparece no Conecta, autenticacao, mapa de papeis e regras de negocio que dependem da integracao.

> **Escopo**: discovery. Decisoes de arquitetura, contratos REST detalhados e modulos consumidores ficam nos docs de implementation/architecture. Aqui esta o **porque** e **o que** — nao o **como tecnico**.

## Indice

| Sistema | Documento | Uso principal | Modulos consumidores |
|---------|-----------|---------------|----------------------|
| E-Docs ES | [e-docs.md](e-docs.md) | Assinatura digital qualificada de documentos por pesquisadores e servidores | M008 (Documento), M009 (Termo de Compromisso), M022 (Termo de Outorga), M003 (Termo de Aceite, Plano de Trabalho) |
| Organograma ES | [organograma.md](organograma.md) | Cadastro automatico e sincronizacao de servidores backoffice + estrutura organizacional FAPES | M005 (Autenticacao), M008 (PessoaFisica + UnidadeOrganizacional + Responsavel), M006 (Autorizacao) |
| Acesso Cidadao | (a documentar — ver [arquitetura/03-acesso-e-seguranca.md](../../architecture/03-acesso-e-seguranca.md)) | Provedor de identidade SSO compartilhado entre Conecta, E-Docs e Organograma | M005 |
| Plataforma Lattes (CNPq) | [lattes.md](lattes.md) | Importacao e sincronizacao de curriculos academicos de pesquisadores (formacao, producao bibliografica, orientacoes, projetos, premios, eventos, idiomas) | M024 (Curriculo do Pesquisador), M008 (PessoaFisica) |
| ORCID (Public API) | [orcid.md](orcid.md) | Fonte complementar de curriculo academico para pesquisador estrangeiro e producao bibliografica indexada por DOI. Tambem usado para busca por nome/afiliacao via `/expanded-search/` | M024 (Curriculo do Pesquisador), M008 (PessoaFisica), M011 (selecao de Ad Hoc internacional) |

## Documentos relacionados em discovery

- [glossario.md](../glossario.md) — verbetes E-Docs, Organograma, Lotacao, Passagem de Area, Signatario Externo
- [regras-passagem-areas-fapes.md](../regras-passagem-areas-fapes.md) — regras formalizadas de transferencia de servidores entre areas tecnicas, dependentes da integracao Organograma
- [personas.md](../personas.md) — personas Servidor, Analista, Coordenador, Bolsista, Orientador atuam como signatarios e/ou alvo de sincronizacao
