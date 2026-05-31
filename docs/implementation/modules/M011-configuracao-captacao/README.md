# M011 - Configuracao de Captacao

[<- Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 03 -- Fomento Pre-Award](../../../discovery/domains/03-fomento-pre-award.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida da configuracao e da instancia de captacao |

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
| 1 | Fomento | GestorFomento | Criacao e gestao do fomento: configuracao de aportes, faixas, tipos de projeto e ciclo de vida (EM_ELABORACAO → APROVADO → INTERROMPIDO / ENCERRADO / CONCLUIDO). Prerequisito para qualquer captacao. |
| 2 | Configuracao da Selecao | AnalistaTecnico | Configuracao completa da captacao vinculada a um fomento APROVADO: cronograma com 8 etapas, formularios, regras, faixas, rubricas, revisores e publicacao. Estados: EM_ANDAMENTO, PUBLICADO, NAO_PUBLICADO, PAUSADO, ENCERRADO, CANCELADO. |
| 3 | Selecao dos Projetos | AnalistaTecnico, Proponente, RevisorAdHoc, ResponsavelInstitucional | Execucao do fluxo de selecao apos publicacao: recebimento de propostas, avaliacao documental, avaliacao ad hoc, revisao de resultado e publicacao do resultado final. |

---

## Atores

| Ator | Responsabilidades no M011 |
|------|--------------------------|
| GestorFomento | Criar, editar e aprovar Fomento; registrar aportes, aportes aditivos e remanejamentos de faixas; interromper, retomar e encerrar Fomento |
| GestorFAPES | Criar, publicar, despublicar, reabrir, pausar, retomar e cancelar Captacao |
| AnalistaTecnico | Configurar Captacao; encerrar apos publicacao do resultado final; conduzir o processo de selecao |
| Proponente | Submeter proposta dentro do periodo de recebimento; solicitar revisao do resultado preliminar |
| RevisorAdHoc | Registrar parecer e nota no formulario de avaliacao ad hoc |
| ResponsavelInstitucional | Aprovar ou recusar proposta quando `exigeAprovacaoInstitucional = true` |
| Sistema | Transicoes automaticas: Fomento → CONCLUIDO quando `hoje >= dataFim`; Captacao → ENCERRADO por expiracao quando `RESULTADO_FINAL.dataFim` e atingida sem publicacao manual |

---

## Dominio

A agencia de fomento publica captacoes de fomento (`Chamada Publica` ou `Demanda Induzida`) para selecionar projetos. O processo de captacao de projetos possui as seguintes etapas:

**1. Configuracao da Captacao** — A agencia configura a captacao com: aportes financeiros de programas ou parcerias, area tecnica responsavel pela gestao dos projetos, tipo de captacao, outorgado destinatario quando for demanda induzida, categorias e tipos de projeto aceitos, cronograma da captacao com exatamente 8 etapas obrigatorias (publicacao, recebimento de propostas, avaliacao documental, avaliacao ad hoc, resultado preliminar, recebimento de revisao, resultado apos revisao, resultado final), selecao de formularios da base M021 (submissao, avaliacao ad hoc, revisao de resultado e anexos quando aplicavel), faixas, regras de submissao, requisitos do proponente, documentos exigidos, criterios de avaliacao, rubricas e subrubricas permitidas, modalidades e niveis de bolsa quando a rubrica Bolsa estiver permitida, pool de revisores ad hoc e regras de distribuicao.

**2. Publicacao da Captacao** — A captacao fica visivel apenas na data de publicacao definida no cronograma da captacao. A configuracao precisa estar publicada para que uma instancia de captacao seja criada.

**3. Recebimento de Propostas** — Proponentes submetem propostas usando o formulario de submissao selecionado no M021, dentro do periodo de recebimento previsto no cronograma.

**4. Avaliacao Documental e Ad Hoc** — A area tecnica associada a captacao confere a documentacao enviada, habilita ou inabilita propostas e envia propostas habilitadas para revisores ad hoc. Os revisores registram pareceres e notas no formulario de avaliacao selecionado no M021.

**5. Revisao de Resultado** — Proponentes podem solicitar revisao do resultado preliminar dentro do periodo configurado. A area tecnica analisa as revisoes admissiveis e atualiza a classificacao quando aplicavel.

**6. Resultado Final** — A area tecnica publica o resultado final. Esse marco encerra o processo de captacao no M011.

Uma captacao pode receber aporte financeiro de um ou mais programas ou parcerias do M010. A contratacao/outorga das propostas aprovadas ocorre no M022. Apos a contratacao/outorga, o projeto passa a ser gerenciado no M003.

> O M011 termina na publicacao do resultado final. O M022 formaliza a contratacao/outorga e o M003 gerencia o projeto pos-contratacao.

### Estados da Captacao

| Estado | Descricao |
|--------|-----------|
| EM_ANDAMENTO | Configuracao em elaboracao pelo AnalistaTecnico. |
| PUBLICADO | Captacao visivel e operacional para recebimento de propostas e selecao. |
| NAO_PUBLICADO | Captacao despublicada apos publicacao inicial; pode ser reaberta. |
| PAUSADO | Captacao suspensa administrativamente pelo GestorFAPES com justificativa. Bloqueia todas as operacoes de selecao (AX-M011-032). Para retomar, todos os periodos futuros do cronograma devem ter `dataFim >= hoje` (AX-M011-033). |
| ENCERRADO | Estado final por encerramento normal apos resultado final ou expiracao automatica. |
| CANCELADO | Estado final por cancelamento administrativo pelo GestorFAPES, com justificativa obrigatoria. |

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Toda configuracao de captacao deve possuir ao menos um aporte financeiro originado de Programa, Parceria ou recurso interno. | Must |
| RN02 | Toda configuracao de captacao deve possuir tipo: `Chamada Publica` ou `Demanda Induzida`. | Must |
| RN03 | Um revisor ad hoc nao pode avaliar propostas da propria instituicao (conflito de interesses). | Must |
| RN04 | Toda configuracao deve possuir edital ou link do edital antes de ser aprovada. | Must |
| RN05 | O cronograma da captacao deve possuir exatamente 8 etapas sequenciais obrigatorias: PUBLICACAO_CAPTACAO, RECEBIMENTO_PROPOSTAS, AVALIACAO_DOCUMENTAL, AVALIACAO_AD_HOC, RESULTADO_PRELIMINAR, RECEBIMENTO_REVISAO, RESULTADO_APOS_REVISAO, RESULTADO_FINAL. | Must |
| RN06 | Formularios usados na captacao devem ser selecionados a partir de versoes publicadas no M021. | Must |
| RN07 | O total financeiro da captacao deve ser calculado pela soma dos aportes financeiros configurados. | Must |
| RN08 | Uma configuracao de captacao so pode ser publicada quando cronograma, formularios e configuracoes obrigatorias estiverem completos. | Must |
| RN09 | Alteracoes relevantes apos a publicacao devem gerar nova versao de configuracao vinculada a mesma captacao. | Must |
| RN10 | Uma captacao pode definir faixas com duracao, valor minimo, valor maximo e valor aportado por faixa. | Should |
| RN11 | As regras de submissao definem se multiplas propostas sao permitidas e se o proponente pode ter outro projeto ativo. | Must |
| RN12 | Os requisitos do proponente podem exigir nivel academico minimo, vinculo institucional e restricao de vinculo empregaticio. | Must |
| RN13 | A captacao deve definir as rubricas e subrubricas permitidas para os projetos financiados, incluindo a rubrica Bolsa quando houver bolsas. | Must |
| RN14 | Quando a rubrica Bolsa estiver permitida, a captacao deve definir modalidades e niveis de bolsa vinculados as versoes de niveis do M001, maximo de bolsistas e quantidade de cotas. | Must |
| RN15 | Uma proposta submetida fora do periodo de recebimento deve ser recusada automaticamente. | Must |
| RN16 | O resultado final so pode ser publicado apos o encerramento e a analise das revisoes admissiveis. | Must |
| RN17 | Toda captacao do tipo `Demanda Induzida` deve ser direcionada para um outorgado destinatario. | Must |
| RN18 | A publicacao do resultado final encerra o processo de captacao no M011 e disponibiliza propostas aprovadas para o M022. | Must |
| RN19 | A captacao deve permitir selecionar uma ou mais categorias de projetos aceitos. | Must |
| RN20 | A captacao pode possuir varias faixas, cada uma com duracao maxima do projeto, valor minimo, valor maximo e valor aportado. | Should |
| RN21 | A captacao deve explicitar regras de submissao e requisitos do proponente, incluindo direcionamento aberto, para instituicao ou para tipo de instituicao. | Must |
| RN22 | A captacao deve definir a quantidade minima de revisores ad hoc por proposta quando exigir avaliacao ad hoc. | Must |
| RN23 | A captacao deve indicar se os projetos resultantes exigirao prestacao tecnica e/ou financeira. | Must |
| RN24 | Documentos exigidos do proponente devem ser cadastraveis como itens reutilizaveis e associados a captacao com formatos permitidos, obrigatoriedade e regra de reaproveitamento do cadastro corporativo. | Must |
| RN25 | Cada aporte financeiro da captacao deve indicar origem do tipo Programa, Parceria ou recurso interno, valor aportado maior que zero, data do aporte, indicacao se e aporte aditivo e justificativa quando aplicavel. | Must |
| RN26 | Rubricas permitidas devem ser selecionadas a partir de Rubricas ativas do M008. | Must |
| RN27 | A captacao pode definir limite por Rubrica em valor absoluto ou percentual da faixa de financiamento. | Must |
| RN28 | Restricoes, exclusoes e observacoes por Rubrica devem ser registrados na configuracao da captacao quando o edital trouxer regra especifica. | Should |
| RN30 | Quando a submissao for restrita a proponentes escolhidos, a captacao deve indicar as instituicoes ou pessoas autorizadas a submeter proposta. | Must |
| RN31 | A soma dos valores aportados nas faixas nao deve ultrapassar o total financeiro calculado pelos aportes da captacao. | Must |
| RN32 | Ao adiar uma etapa do cronograma, o sistema deve registrar historico com justificativa, datas originais e novas datas. | Must |
| RN29 | Ao adiar uma etapa do cronograma, as etapas posteriores devem ser deslocadas pela mesma quantidade de dias. | Must |
| RI1 | Um revisor nao pode ser associado mais de uma vez ao mesmo pool da captacao. | Must |
| RI2 | Uma captacao nao pode ter dois formularios de submissao ativos simultaneamente. | Must |

---

## Observacoes de Dominio

- Quando o proponente for uma empresa ou instituicao, deve existir uma pessoa fisica representante vinculada ao cadastro desse proponente. Documentos recorrentes da pessoa juridica, como contrato social, balanco, certidoes e comprovantes institucionais, devem preferencialmente estar no cadastro corporativo do M008. No M011, a captacao apenas indica quais documentos ou comprovacoes serao exigidos, reutilizando o cadastro quando a documentacao ja existir.

---

## Duvidas em Aberto

| ID | Duvida | Impacto |
|----|--------|---------|
| DA01 | Definir se `DocumentoExigido` deve representar apenas documentos solicitados diretamente na submissao ou se alguns itens devem ser modelados como `RequisitoProponente` que exigem um documento comprobatório. | Afeta o desenho do formulario de submissao, a validacao documental e a separacao entre regra de elegibilidade e anexo comprobatório. |
