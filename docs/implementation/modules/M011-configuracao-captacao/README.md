# M011 - Configuracao de Captacao

[<- Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 03 -- Fomento Pre-Award](../../../discovery/domains/03-fomento-pre-award.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural P1 - Fomento](modelo-estrutural/modelo-estrutural-p1-fomento.md) | Diagrama de classes, estados, dicionario e regras de Fomento |
| [Modelo Estrutural P2 - Configuracao da Captacao](modelo-estrutural/modelo-estrutural-p2-configuracao-selecao.md) | Diagrama de classes, estados, dicionario e regras de Captacao |
| [Modelo Estrutural P3 - Selecao de Projetos](modelo-estrutural/modelo-estrutural-p3-selecao-projetos.md) | Diagrama de classes da selecao dos projetos |

---

## Sobre o Modulo

A agencia de fomento configura e publica captacoes para selecionar projetos de pesquisa, desenvolvimento e inovacao. O ciclo do M011 envolve: configuracao da captacao, definicao do cronograma da captacao, selecao de formularios publicados no M021, recebimento de propostas, avaliacao documental, avaliacao ad hoc, revisao de resultado e publicacao do resultado final.

Atualmente esse processo e realizado por meio de documentos manuais, sem templates nem padronizacao, o que gera inconsistencias entre captacoes e retrabalho frequente. Este modulo visa resolver esse problema ao permitir a gestao do processo de captacao de projetos, desde a configuracao da captacao ate a publicacao do resultado final. O sucesso sera medido pela reducao do tempo de configuracao de captacoes, pela eliminacao de inconsistencias e pelo tempo medio do ciclo de captacao.

> **Referencia:** A analise do prototipo backoffice detalha todas as funcionalidades extraidas do prototipo e as lacunas identificadas na documentacao.

---

## Processos

O modulo M011 compreende 3 processos principais no namespace `pre_award.captacao`:

| # | Processo | Ator Principal | Descricao |
|---|----------|----------------|-----------|
| 1 | Fomento | AnalistaTecnico | Criacao e gestao do Fomento: configuracao de aportes, faixas, tipos de projeto, etapas, criterios e ciclo de vida (`EM_ELABORACAO` -> `PUBLICADO` / `EM_ANDAMENTO` / `INTERROMPIDO` / `CANCELADO` / `CONCLUIDO`). Prerequisito para qualquer captacao. |
| 2 | Configuracao da Captacao | AnalistaTecnico | Configuracao da Captacao vinculada a um Fomento ativo: limite de projetos, recurso maximo, cronograma com `EtapaCaptacao` baseada em `EtapaFomento`, etapa atual, extensoes de etapa e abertura/fechamento de submissao. Estados: `EM_ESPERA`, `EM_ANDAMENTO`, `ABERTA_PARA_SUBMISSAO`, `FECHADA_PARA_SUBMISSAO`, `FINALIZADA`. |
| 3 | Selecao dos Projetos | AnalistaTecnico, Proponente, RevisorAdHoc, ResponsavelInstitucional | Execucao do fluxo de selecao apos a Captacao ficar `ABERTA_PARA_SUBMISSAO`: recebimento de propostas, avaliacao documental, avaliacao ad hoc, revisao de resultado e publicacao do resultado final. |

---

## Atores

| Ator | Responsabilidades no M011 |
|------|--------------------------|
| AnalistaTecnico | Criar, alterar, publicar, suspender, prosseguir, concluir e cancelar Fomento; registrar aportes e aportes aditivos; configurar Captacao, etapas, extensoes e abertura/fechamento de submissao; conduzir o processo de selecao |
| Proponente | Submeter proposta dentro do periodo de recebimento; solicitar revisao do resultado preliminar |
| RevisorAdHoc | Registrar parecer e nota no formulario de avaliacao ad hoc |
| ResponsavelInstitucional | Aprovar ou recusar proposta quando `exigeAprovacaoInstitucional = true` |
| Sistema | Transicoes automaticas: Fomento -> `CONCLUIDO` quando `hoje > dataFim`; validacoes de vigencia, ordem e nao sobreposicao das etapas da Captacao |

---

## Dominio

A agencia de fomento configura um `Fomento` para financiar projetos de pesquisa, desenvolvimento e inovacao. O Fomento define vigencia, tipo de chamamento (`CHAMADA_PUBLICA` ou `DEMANDA_INDUZIDA`), tipo de outorgado, eixo estrategico, area tecnica, tipos de projeto aceitos, aportes financeiros, faixas, rubricas, bolsas, documentos, etapas e criterios de selecao.

Uma `Captacao` e criada a partir de um Fomento ativo e utiliza as `EtapaFomento` como base para montar seu cronograma operacional. Cada `EtapaCaptacao` possui datas proprias, pode ser encadeada com uma proxima etapa e pode registrar extensoes com justificativa. As datas das etapas da mesma Captacao nao podem se sobrepor e devem permanecer dentro da vigencia do Fomento.

**1. Configuracao do Fomento** — O AnalistaTecnico cria o Fomento em `EM_ELABORACAO`, informa dados basicos, aportes, faixas, regras por faixa, etapas e criterios, e publica o Fomento quando estiver completo.

**2. Configuracao da Captacao** — O AnalistaTecnico cria a Captacao em `EM_ESPERA`, define vigencia, limites, recurso maximo, cronograma com `EtapaCaptacao`, etapa atual e validacoes de submissao.

**3. Abertura e Fechamento de Submissao** — A Captacao transita para `EM_ANDAMENTO`, depois para `ABERTA_PARA_SUBMISSAO` quando a submissao e aberta, e para `FECHADA_PARA_SUBMISSAO` quando o prazo termina ou o limite configurado e atingido. Uma extensao pode reabrir a submissao, preservando historico.

**4. Selecao dos Projetos** — Proponentes submetem propostas no periodo permitido. A area tecnica conduz as etapas internas, revisores registram pareceres e o resultado final encerra o processo no M011.

A contratacao/outorga das propostas aprovadas ocorre no M022. Apos a contratacao/outorga, o projeto passa a ser gerenciado no M003.

> O M011 termina na publicacao do resultado final. O M022 formaliza a contratacao/outorga e o M003 gerencia o projeto pos-contratacao.

### Estados do Fomento

| Estado | Descricao |
|--------|-----------|
| EM_ELABORACAO | Fomento em configuracao. Permite salvar, alterar e adicionar aportes. |
| PUBLICADO | Fomento publicado e apto ao ciclo operacional. |
| EM_ANDAMENTO | Subestado operacional do Fomento publicado enquanto esta ativo para captacoes. Permite alteracoes e aportes aditivos com auditoria. |
| INTERROMPIDO | Fomento suspenso temporariamente por `suspenderFomento()`. Pode ser retomado por `prosseguirFomento()`. |
| CANCELADO | Estado terminal por cancelamento administrativo. |
| CONCLUIDO | Estado terminal por `concluir()` ou por ultrapassagem de `dataFim`. |

### Estados da Captacao

| Estado | Descricao |
|--------|-----------|
| EM_ESPERA | Captacao criada por `criarCaptacao()` e aguardando inicio operacional. |
| EM_ANDAMENTO | Captacao iniciada por `iniciar()` e aguardando abertura de submissao ou execucao de etapas internas. |
| ABERTA_PARA_SUBMISSAO | Captacao aberta para cadastro/submissao de projetos. |
| FECHADA_PARA_SUBMISSAO | Submissao fechada por prazo, limite ou acionamento manual. Pode voltar para `ABERTA_PARA_SUBMISSAO` por extensao. |
| FINALIZADA | Estado terminal da Captacao. Nao permite novas submissoes, extensoes ou etapas operacionais. |

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Todo Fomento deve possuir codigo, titulo, vigencia, eixo estrategico, area tecnica, tipo de chamamento e tipo de outorgado. | Must |
| RN02 | Todo Fomento deve possuir ao menos um aporte financeiro originado de Programa, Parceria ou ContaContabil antes de ser publicado. | Must |
| RN03 | Todo Fomento deve possuir ao menos uma faixa, um TipoProjeto aceito e um Edital associado antes de ser publicado. | Must |
| RN04 | Quando `tipoChamamento=DEMANDA_INDUZIDA`, o Fomento deve possuir exatamente um OutorgadoDemanda compatível com o tipo de outorgado. | Must |
| RN05 | Fomento pode ser alterado a qualquer momento enquanto nao estiver em estado terminal, preservando auditoria quando houver captacoes vinculadas. | Must |
| RN06 | `suspenderFomento()` transiciona Fomento publicado/ativo para `INTERROMPIDO`; `prosseguirFomento()` retoma um Fomento `INTERROMPIDO`. | Must |
| RN07 | Somente Fomento `PUBLICADO` ou `EM_ANDAMENTO` pode originar novas Captacoes. | Must |
| RN08 | Toda Captacao deve referenciar exatamente um Fomento ativo e manter `dataInicio`/`dataFim` dentro da vigencia desse Fomento. | Must |
| RN09 | Toda Captacao deve possuir ao menos uma EtapaCaptacao baseada em EtapaFomento pertencente ao Fomento referenciado. | Must |
| RN10 | Datas de EtapaCaptacao da mesma Captacao nao podem se sobrepor; a proxima etapa so pode iniciar apos o marco final da etapa anterior. | Must |
| RN11 | A cadeia `EtapaCaptacao.proxima` deve pertencer a mesma Captacao e nao pode formar ciclo. | Must |
| RN12 | `limiteProjetos`, quando informado, bloqueia novas submissoes ao atingir a quantidade maxima configurada. | Must |
| RN13 | `recursoMaximo`, quando informado, nao pode exceder o recurso disponivel do Fomento para a Captacao. | Must |
| RN14 | Toda ExtensaoEtapaCaptacao deve possuir `numeroDias > 0` e justificativa. Ao estender uma etapa, as etapas posteriores devem ser deslocadas quando necessario para manter a sequencia e impedir sobreposicao. | Must |
| RN15 | Uma proposta submetida fora do periodo em que a Captacao esta `ABERTA_PARA_SUBMISSAO` deve ser recusada automaticamente. | Must |
| RN16 | O resultado final da selecao encerra o processo de captacao no M011 e disponibiliza propostas aprovadas para o M022. | Must |

---

## Observacoes de Dominio

- Quando o proponente for uma empresa ou instituicao, deve existir uma pessoa fisica representante vinculada ao cadastro desse proponente. Documentos recorrentes da pessoa juridica, como contrato social, balanco, certidoes e comprovantes institucionais, devem preferencialmente estar no cadastro corporativo do M008. No M011, a captacao apenas indica quais documentos ou comprovacoes serao exigidos, reutilizando o cadastro quando a documentacao ja existir.

---

## Duvidas em Aberto

| ID | Duvida | Impacto |
|----|--------|---------|
| DA01 | Definir se `DocumentoExigido` deve representar apenas documentos solicitados diretamente na submissao ou se alguns itens devem ser modelados como `RequisitoProponente` que exigem um documento comprobatório. | Afeta o desenho do formulario de submissao, a validacao documental e a separacao entre regra de elegibilidade e anexo comprobatório. |
