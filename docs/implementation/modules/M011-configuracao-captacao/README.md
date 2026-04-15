# M011 - Configuracao de Captacao

[<- Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 03 -- Fomento Pre-Award](../../../discovery/domains/03-fomento-pre-award.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida do Edital |
| [Analise Prototipo](specifications/analise-prototipo-captacao.md) | Cruzamento prototipo backoffice vs documentacao — funcionalidades descobertas |

---

## Sobre o Modulo

A agencia de fomento publica editais para selecionar e financiar projetos de pesquisa, desenvolvimento e inovacao. O ciclo completo de uma captacao envolve: configuracao do edital (cronograma, formularios, parametros, bolsas, requisitos), recebimento de inscricoes, avaliacao de merito por revisores ad hoc, analise de recursos e publicacao do resultado final.

Atualmente esse processo e realizado por meio de documentos manuais, sem templates nem padronizacao, o que gera inconsistencias entre editais e retrabalho frequente. Este modulo visa resolver esse problema ao permitir a gestao completa do processo de captacao de iniciativas, desde a configuracao do edital ate a publicacao do resultado. O sucesso sera medido pela reducao do tempo de configuracao de editais, pela eliminacao de inconsistencias e pelo tempo medio do ciclo de captacao.

> **Referencia:** A [analise do prototipo backoffice](specifications/analise-prototipo-captacao.md) detalha todas as funcionalidades extraidas do prototipo e as lacunas identificadas na documentacao.

---

## Dominio

A agencia de fomento publica editais de fomento (demanda publica ou induzida) para selecionar e financiar projetos de pesquisa. O processo de captacao de iniciativas possui as seguintes etapas:

**1. Configuracao do Edital** — A agencia configura o edital com: identificacao (titulo, tipo de captacao, setor responsavel, tipo de fomento, numero, datas), cronograma (periodos sequenciais de submissao, avaliacao, resultado preliminar, recurso, resultado final, contratacao), formularios (submissao, avaliacao, recurso — versionados e reutilizaveis), parametros de fomento (faixas de financiamento com duracao/valor min/max, orcamento total, cotas por area, origens de recurso), regras de submissao (multiplas submissoes, coordenador com outro projeto), requisitos do coordenador (nivel academico, vinculo institucional, restricao empregaticia), rubricas permitidas e bolsas da captacao (modalidade M001, nivel, max bolsistas, cotas).

**2. Publicacao** — O edital e publicado quando cronograma, formularios e parametros estao completos. Uma vez publicado, nao pode ser editado, apenas retificado via nova versao.

**3. Inscricoes** — Proponentes submetem propostas usando o formulario de inscricao. A agencia acompanha inscricoes com filtros por area, status, instituicao e setor.

**4. Avaliacao de Merito** — Revisores ad hoc (consultores externos) sao associados ao edital e avaliam as propostas. Um revisor nao pode avaliar propostas da propria instituicao. O formulario de avaliacao define perguntas com nota e peso.

**5. Recurso** — Proponentes podem contestar a avaliacao com motivo, descricao e anexos. A agencia analisa e decide sobre o recurso.

**6. Resultado Final** — Publicacao do resultado com lista de aprovados e reprovados.

Quando houver alinhamento estrategico, o edital pode ser vinculado a um programa (M010) e parceria (M010) para rastreabilidade. O edital operacional (projeto, cota, alocacao) apos contratacao e gerenciado por M003.

> O edital operacional pos-contratacao e gerenciado por M003. Programas e parcerias sao gerenciados por M010. Este modulo cobre o ciclo de captacao de ponta a ponta: da configuracao a publicacao do resultado.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Um edital deve possuir ao menos um periodo de submissao no cronograma antes de ser publicado. | Must |
| RN02 | O formulario de avaliacao deve estar configurado antes do inicio da fase de avaliacao de merito. | Must |
| RN03 | Um revisor ad hoc nao pode avaliar propostas da propria instituicao (conflito de interesses). | Must |
| RN04 | Um edital publicado nao pode ter sua configuracao alterada diretamente, somente retificada por meio de nova versao de configuracao. | Must |
| RN05 | As datas do cronograma devem ser sequenciais (submissao antes de avaliacao, avaliacao antes de resultado, etc.). | Must |
| RN06 | Um formulario publicado nao pode ser alterado, apenas versionado. | Must |
| RN07 | O orcamento total do edital deve ser igual ou superior a soma dos valores alocados por area. | Must |
| RN08 | Um edital so pode ser publicado quando cronograma, formularios e parametros obrigatorios estiverem completos. | Must |
| RN09 | Alteracoes relevantes apos a publicacao devem gerar nova versao de configuracao vinculada ao mesmo edital. | Must |
| RN10 | Um edital pode definir faixas de financiamento com duracao, valor minimo e valor maximo por faixa. | Should |
| RN11 | As regras de submissao definem se multiplas propostas sao permitidas e se o coordenador pode ter outro projeto ativo. | Must |
| RN12 | Os requisitos do coordenador podem exigir nivel academico minimo, vinculo institucional e restricao de vinculo empregaticio. | Must |
| RN13 | O edital deve definir as rubricas financeiras permitidas para os projetos financiados. | Must |
| RN14 | O edital define as bolsas da captacao vinculando modalidade (M001), nivel, versao, maximo de bolsistas e quantidade de cotas. | Must |
| RN15 | Uma proposta submetida apos o fim do periodo de submissao deve ser recusada automaticamente. | Must |
| RN16 | O resultado final so pode ser publicado apos a conclusao do periodo de recurso. | Must |
| RI1 | Um revisor nao pode ser associado mais de uma vez ao mesmo edital. | Must |
| RI2 | Um edital nao pode ter dois formularios de submissao ativos simultaneamente. | Must |
