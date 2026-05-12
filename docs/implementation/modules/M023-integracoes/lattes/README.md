# Adapter Plataforma Lattes (CNPq)

[← Voltar ao M023](../README.md) | [Discovery — Lattes](../../../../discovery/integracoes/lattes.md) | [M024 — Curriculo do Pesquisador](../../M024-curriculo-pesquisador/README.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [adapter.md](adapter.md) | Mapeamento de comandos M023 → fonte Lattes; parsing XML/JSON; tratamento de erros |

---

## O que e

Adapter do M023 para a **Plataforma Lattes** ([`lattes.cnpq.br`](https://lattes.cnpq.br)) — repositorio nacional de curriculos academicos mantido pelo CNPq. Diferente do adapter [E-Docs](../e-docs/README.md), este adapter **nao coleta assinaturas**: faz **importacao e sincronizacao de curriculos academicos** do CNPq para alimentar o modelo de dominio do [M024 — Curriculo do Pesquisador](../../M024-curriculo-pesquisador/README.md).

Implementa os comandos genericos de integracao do M023 (`ImportarCurriculo`, `SincronizarCurriculo`, `ConsultarStatusSincronizacao`) traduzindo-os em chamadas a fonte Lattes (API, wrapper externo ou parser de XML — ver Pendencia 1 em [discovery/integracoes/lattes.md](../../../../discovery/integracoes/lattes.md)) e mapeando o resultado para as entidades do M024 (`FormacaoAcademica`, `Artigo`, `Livro`, `Orientacao`, `Projeto`, `Premio`, `ParticipacaoEvento`, `Idioma`).

## Quando usar este adapter

- Pesquisador brasileiro com numero Lattes (16 digitos) cadastrado em PessoaFisica (M008).
- Necessidade de alimentar M024 com curriculo completo (formacao + producao + orientacoes + projetos + premios + eventos + idiomas).
- Selecao de Consultor Ad Hoc por expertise, validacao de elegibilidade em editais, indicadores agregados de producao cientifica, perfil/vitrine do pesquisador.

## Quando NAO usar este adapter

- Pesquisador estrangeiro sem numero Lattes — usar adapter alternativo (ORCID, a definir).
- Coleta apenas de producao bibliografica indexada — pode bastar adapter OpenAlex/Crossref (a definir como adapter complementar).
- Cadastro academico manual sem integracao externa — entidades M024 sao alimentadas direto via UI/API interna.

## Estrategia de obtencao dos dados (CRITICO — pendencia aberta)

A Plataforma Lattes nao oferece API REST publica oficial. As alternativas estao listadas em [discovery/integracoes/lattes.md §Pendencias](../../../../discovery/integracoes/lattes.md#pendencias-de-discovery). Plano provisorio:

| Opcao | Descricao | Status |
|-------|-----------|--------|
| (a) Upload manual de XML | Pesquisador exporta XML no portal do CNPq (via captcha) e faz upload no Conecta | Caminho oficial provisorio — mais robusto, requer acao do pesquisador |
| (b) Wrapper externo (ScriptLattes/BrCris) | Adapter consulta wrapper comunitario | Pendente validacao juridica e tecnica |
| (c) Fonte alternativa (ORCID + OpenAlex) | Producao bibliografica via DOI/ORCID, com Lattes apenas como URL | Adapter complementar, nao substitui caminho oficial |

**Decisao**: validar com CNPq/PRODEST e Juridica FAPES antes de qualquer implementacao definitiva. O modelo de dominio do M024 e desacoplado da fonte — qualquer estrategia produz as mesmas entidades.

## Ambientes

| Ambiente | Endpoint/Fonte | Quando usar |
|----------|----------------|-------------|
| Homologacao | Definir conforme estrategia escolhida (sandbox CNPq, mock local) | Desenvolvimento, testes integrados |
| Producao | [`lattes.cnpq.br`](https://lattes.cnpq.br) ou wrapper escolhido | Operacao real |

## Pre-requisitos

1. Resolver Pendencia 1 (estrategia de obtencao) — ver acima.
2. Definir base legal LGPD para tratamento dos dados academicos (consentimento explicito do pesquisador na vinculacao do Lattes ao Conecta).
3. Cadastrar AreaConhecimento canonica CNPq em M008 §1.3.6 — adapter mapeia areas do Lattes contra este cadastro; areas nao mapeadas vao para log de discrepancia.
4. Configurar credenciais (token de wrapper, chave OAuth ORCID, etc.) em vault.

## Habilita

| Modulo | Uso |
|--------|-----|
| [M024](../../M024-curriculo-pesquisador/README.md) | Dono do modelo de dominio do Curriculo e entidades filhas. M023/lattes popula essas entidades |
| [M011](../../M011-configuracao-captacao/README.md) | Selecao de Consultor Ad Hoc por area de conhecimento e producao recente |
| [M018](../../M018-business-intelligence/README.md) | Indicadores agregados de producao cientifica dos beneficiarios FAPES |
| [M019](../../M019-transparencia-auditoria/README.md) | Transparencia ativa do perfil de pesquisadores beneficiarios |

## Referencias

- [Discovery — Plataforma Lattes](../../../../discovery/integracoes/lattes.md) — visao geral, capacidades, casos de uso, sequence diagrams, pendencias
- [M024 — Curriculo do Pesquisador](../../M024-curriculo-pesquisador/README.md) — modelo de dominio do CV
- [Discovery — Modelo conceitual do Pesquisador](../../../../discovery/domains/01-corporativo-pesquisador.md) — entidades e cardinalidades
- [Plataforma Lattes (portal publico)](https://lattes.cnpq.br)
- [Documentacao XML do curriculo](http://memoria.cnpq.br/lattes/conteudo/cnpq_extra_2017.htm)
- [ORCID](https://orcid.org/) — identificador alternativo internacional
- [OpenAlex](https://openalex.org/) — base aberta de producao cientifica
