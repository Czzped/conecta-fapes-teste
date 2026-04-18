# Glossario de Conceitos — ConectaFAPES

Dicionario central dos conceitos da plataforma. Cada entrada define o termo de forma concisa e aponta para a fonte canonica (modulo, domain ou ADR) onde ele e detalhado.

> Objetivo: eliminar duplicacao. Este arquivo **define** e **linka**, nao reformula o conteudo das fontes.

---

## Indice

1. [Personas](#1-personas)
2. [Instrumentos de Fomento](#2-instrumentos-de-fomento)
3. [Vigencia e Aditivos](#3-vigencia-e-aditivos)
4. [Instituicoes e Organizacoes](#4-instituicoes-e-organizacoes)
5. [Bolsas e Planos de Trabalho](#5-bolsas-e-planos-de-trabalho)
6. [Gestao Orcamentaria](#6-gestao-orcamentaria)
7. [Prestacao de Contas](#7-prestacao-de-contas)
8. [PLD e Controles](#8-pld-e-controles)
9. [Documentos e Tipos](#9-documentos-e-tipos)
10. [Siglas](#10-siglas)
11. [Enumeracoes Principais](#11-enumeracoes-principais)

---

## 1. Personas

Catalogo completo em [personas.md](personas.md). Resumo rapido por agrupamento:

| Agrupamento | Personas | Definido em |
|-------------|----------|-------------|
| Comunidade cientifica | Cidadao, Participante de Projeto, Bolsista, Voluntario, Coordenador, Orientador, Terceiro (PJ) | [personas.md](personas.md) |
| Instituicoes | Reitor, Diretor/Responsavel | [personas.md](personas.md) |
| Parceiros | Agencia de Fomento, Entidade Parceira | [personas.md](personas.md) |
| Agencia (interno) | Analista da Area Tecnica da Agencia, Analista, Area Tecnica, SUCON, Diretoria da Agencia, Servidor da Area Tecnica, Servidor da Area de Parcerias | [personas.md](personas.md), [M010/README.md](../implementation/modules/M010-planejamento-estrategia/README.md) |
| Orgaos de controle | SECONT | [personas.md](personas.md) |
| Avaliadores externos | Consultor Ad Hoc | [personas.md](personas.md) |

---

## 2. Instrumentos de Fomento

| Termo | Definicao | Definido em |
|-------|-----------|-------------|
| **Plano Estrategico** | Documento que define objetivos e metas estrategicas da agencia. Possui vigencia e so pode haver um ativo por vez. | [M010 planejamento](../implementation/modules/M010-planejamento-estrategia/planejamento/modelo-estrutural.md) |
| **Eixo Estrategico** | Agrupamento tematico dentro de um Plano Estrategico que orienta a criacao de Programas. Pertence a exatamente um Plano (RN08). | [M010 planejamento](../implementation/modules/M010-planejamento-estrategia/planejamento/modelo-estrutural.md) |
| **Programa** | Instrumento de execucao do fomento, vinculado a pelo menos um Eixo (RN01), demandado por uma Instituicao (RN16). Recebe recursos internos e aportes via `AporteFinanceiroParceriaPrograma`. | [M010 programas](../implementation/modules/M010-planejamento-estrategia/programas/modelo-estrutural.md) |
| **Parceria** | Instrumento formal de cooperacao entre a Agencia e uma ou mais Instituicoes (RN10). Possui Vigencia (original + aditivos), AporteFinanceiro recebido e Documentos regularizadores. Aporta recursos em Programas via `AporteFinanceiroParceriaPrograma`. | [M010 parcerias](../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md) |
| **Edital** | Documento publico que formaliza uma Captacao, contendo regras, cronograma e requisitos. | [M011 configuracao-captacao](../implementation/modules/M011-configuracao-captacao/README.md) |
| **Captacao** | Processo de recepcao de propostas, associado a um Edital. Tipos: **Chamada Publica** (aberta) ou **Demanda Induzida** (direcionada). Vinculada a um Programa ou a uma Parceria. | [M011](../implementation/modules/M011-configuracao-captacao/README.md), [Domain 03](domains/03-fomento-pre-award.md) |
| **Iniciativa** | Proposta de trabalho apoiada pela agencia: projeto de pesquisa, visita tecnica, publicacao, evento cientifico etc. | [Domain 03](domains/03-fomento-pre-award.md) |
| **Projeto Contratado** | Iniciativa aprovada, formalizada por Termo de Outorga, em execucao com coordenador, datas e orcamento. | [M003](../implementation/modules/M003-gestao-iniciativas-captadas/README.md) |
| **Termo de Outorga** | Instrumento formal de fomento assinado pelo Coordenador que contrata a iniciativa aprovada. | [M003](../implementation/modules/M003-gestao-iniciativas-captadas/README.md), [Art. 28, I] |

---

## 3. Vigencia e Aditivos

Conceitos centrais a M010 (Parcerias e Programas).

| Termo | Definicao | Definido em |
|-------|-----------|-------------|
| **Vigencia** | Janela temporal (`dataInicio`, `dataFim`) de uma Parceria. A primeira Vigencia tem `isAditivo = false`; alteracoes posteriores sao novas Vigencias com `isAditivo = true` (RN06). | [M010 parcerias](../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md) |
| **vigenciaInicioCorrente** (derivado) | `MIN(Vigencia.dataInicio)` da Parceria (RN15). | M010 parcerias |
| **vigenciaFimCorrente** (derivado) | `MAX(Vigencia.dataFim)` da Parceria (RN15). | M010 parcerias |
| **AporteFinanceiro** | Valor aportado a uma Parceria por uma Instituicao. O primeiro aporte tem `isAditivo = false`; adicionais sao aditivos (RN17). Exige Documento (RN12) e origem em Instituicao M008 (RN04). | [M010 parcerias](../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md) |
| **AporteFinanceiroParceriaPrograma** | Relacao N:N entre Parceria e Programa — destino do aporte de uma Parceria em um Programa. Valor sempre `>= 0`, exige Parceria vigente (RN11). | [M010 programas](../implementation/modules/M010-planejamento-estrategia/programas/modelo-estrutural.md) |
| **Aditivo** | Nova Vigencia ou AporteFinanceiro com `isAditivo = true`, documentado por termo aditivo e sujeito a regras de ordenacao temporal (RN06, RN17). | M010 parcerias |
| **saldo** (Parceria, derivado) | `SUM(AporteFinanceiro.valorInvestido) − SUM(AporteFinanceiroParceriaPrograma.valor)`, sempre `>= 0` (RN14). | M010 parcerias |

---

## 4. Instituicoes e Organizacoes

| Termo | Definicao | Definido em |
|-------|-----------|-------------|
| **Instituicao** | Organizacao generica (publica ou privada) cadastrada no sistema. | [M008](../implementation/modules/M008-cadastros-corporativos/README.md) |
| **Instituicao de Ensino e Pesquisa (IE&P)** | Tipo de Instituicao com dirigente maximo (Reitor) e Unidades Organizacionais. | M008 |
| **Unidade Organizacional** | Subdivisao interna de uma Instituicao, com Diretor/Responsavel. | M008 |
| **Entidade Parceira** | Instituicao que firma Parceria com a Agencia de Fomento mediante aporte financeiro. | [personas.md](personas.md), [M010 parcerias](../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md) |
| **Pessoa Fisica** | Registro de beneficiario, pesquisador ou consultor. | M008 |
| **Pessoa Juridica (PJ)** | Entidade contratada por projeto (ver restricao de conflito de interesse em [5.4.10](domains/05-financeiro.md)). | M008, Domain 05 |
| **Area Tecnica** | Unidade organizacional da Agencia de Fomento, composta por servidores, responsavel por analise e liberacao de editais e pagamentos. | [personas.md](personas.md) |

---

## 5. Bolsas e Planos de Trabalho

| Termo | Definicao | Definido em |
|-------|-----------|-------------|
| **Modalidade de Bolsa** | Classe de bolsa definida por Resolucao da Agencia (ex.: IC, PIBIC, Mestrado, Doutorado). | [M001](../implementation/modules/M001-modalidade-bolsa/README.md) |
| **Nivel de Bolsa** | Subdivisao da Modalidade com valor e requisitos de elegibilidade. Versionado por Resolucao. | M001 |
| **Resolucao** | Ato normativo que cria ou altera modalidades/niveis de bolsa. | M001 |
| **Cota de Bolsa** | Quantidade de bolsas disponiveis por versao de Nivel em um Edital operacional. | [M003](../implementation/modules/M003-gestao-iniciativas-captadas/README.md) |
| **Plano de Trabalho** | Secao dedicada do bolsista contendo atividades previstas, cronograma e entregas. Vinculado a solicitacao de bolsa. | [M009](../implementation/modules/M009-gestao-bolsista/README.md) |
| **Alocacao Operacional de Bolsista** | Vinculo do bolsista a um Projeto Contratado, consumindo Cota, com orientador designado. | M003 |

---

## 6. Gestao Orcamentaria

| Termo | Definicao | Definido em |
|-------|-----------|-------------|
| **Orcamento do Projeto** | Planejamento financeiro do projeto, com valor total, previsao de bolsas e capital, e rubricas. | [M013](../implementation/modules/M013-gestao-orcamentaria-projeto/README.md) |
| **Orcamento Anual** | Planejamento financeiro anual agrupando ContasContabeis com limites. Implementado em M014 como debito tecnico (DT-M014-001), pertence conceitualmente a M013. | [M014 modelo-estrutural](../implementation/modules/M014-prestacao-contas/modelo-estrutural.md) |
| **Rubrica** | Categoria de despesa do orcamento aprovado. Cada rubrica tem limite e pode ter subrubricas hierarquicas. | [M013](../implementation/modules/M013-gestao-orcamentaria-projeto/README.md) |
| **Conta Contabil** | Classificacao contabil hierarquica dentro de um Orcamento Anual, com Limite e subcontas. | M014 |
| **Remanejamento Orcamentario** | Transferencia de recursos entre rubricas. Entre subrubricas de mesma rubrica, aprovacao e automatica. | [Domain 04, 4.3.6–4.3.8](domains/04-fomento-post-award.md) |
| **Adicao Orcamentaria** | Solicitacao de aumento do orcamento do projeto, sujeita a aprovacao da Agencia. | Domain 04, 4.3.1–4.3.3 |
| **LOA / LDO / PPA** | Instrumentos legais de planejamento orcamentario publico — Lei Orcamentaria Anual, Lei de Diretrizes Orcamentarias, Plano Plurianual — referencia para dotacao de Programas. | Domain 02, 05 |

---

## 7. Prestacao de Contas

Conceitos centrais ao M014.

| Termo | Definicao | Definido em |
|-------|-----------|-------------|
| **Prestacao (de Contas)** | Agregado que agrupa Justificativas de Despesa e Transacoes Financeiras para analise. Ciclo: `RASCUNHO → EM_ANALISE → {FINALIZADO \| NEGADO \| REVISAO → EM_ANALISE}`. | [M014 modelo-estrutural](../implementation/modules/M014-prestacao-contas/modelo-estrutural.md) |
| **Justificativa de Despesa** | Documentacao que comprova uma despesa. Tipos: NF, Diaria, Invoice. | M014 |
| **JustificativaNF** | Baseada em Nota Fiscal nacional (NF-e de produto ou NFS-e de servico). Validada via SERPRO pela ChaveAcesso (RN06). | M014 |
| **JustificativaDiaria** | Baseada em diarias de viagem com `ValorDiaria`, `Quantidade` e bolsista beneficiario (`AlocacaoBolsistaRef`). | M014 |
| **JustificativaInvoice** | Baseada em fatura internacional com `ValorCambio` e `TipoMoeda`. | M014 |
| **DocumentoFiscal** | Nota fiscal eletronica (NF-e ou NFS-e) com ChaveAcesso de 44 digitos, emitente, valores e impostos. | M014 |
| **ItemDocumentoFiscal** | Linha de um DocumentoFiscal. Obrigatoriamente classificado em uma Conta Contabil (RN07). `ValorTotal = Quantidade × ValorUnitario` (RI3). | M014 |
| **OrcamentoFornecedor** | Cotacao de fornecedor usada para comprovar melhor preco. Ate 3 por justificativa, no maximo 1 escolhido (RN05). | M014 |
| **TransacaoFinanceira** | Lancamento bancario (DEBITO/CREDITO) importado do extrato. Pode ser vinculada a uma Prestacao (RN04). Status derivado do Status da Prestacao (RI2). | M014 |
| **Conta Bancaria** | Conta do projeto usada para movimentacoes financeiras. | M014 |
| **ChaveAcesso (NF-e)** | Codigo de 44 digitos numericos que identifica unicamente uma nota fiscal eletronica na SEFAZ. Validada via API SERPRO. | M014 |
| **SERPRO** | Servico Federal de Processamento de Dados — fornece API para consulta e validacao de NF-e. | M014 |
| **MinIO** | Armazenamento de objetos (S3-compatible) usado para PDFs de orcamentos e arquivos comprobatorios. | M014 |

---

## 8. PLD e Controles

| Termo | Definicao | Definido em |
|-------|-----------|-------------|
| **PLD** | Prevencao a Lavagem de Dinheiro — controles para detectar e reportar operacoes suspeitas. | [Domain 05, 5.4](domains/05-financeiro.md) |
| **KYC** | *Know Your Customer* — verificacao cadastral de beneficiarios e parceiros antes de pagamentos ou contratos. | Domain 05 |
| **PEP** | Pessoa Exposta Politicamente — categoria monitorada em verificacoes de PLD. | Domain 05 |
| **COAF** | Conselho de Controle de Atividades Financeiras — orgao que recebe comunicacoes de operacoes suspeitas. | Domain 05 |
| **Conflito de Interesse com PJ** | Vinculo societario, familiar ou empregaticio entre Coordenador/participantes e PJ contratada. Contratacao bloqueada automaticamente quando identificado. | Domain 05, 5.4.10 |
| **Lista Restritiva** | Listas de sancoes nacionais e internacionais (OFAC, ONU, UE) usadas para verificacao. | Domain 05 |

---

## 9. Documentos e Tipos

| Termo | Definicao | Definido em |
|-------|-----------|-------------|
| **Documento** | Arquivo anexado a uma entidade do dominio (Parceria, AporteFinanceiro, Vigencia, Programa etc.), classificado por TipoDocumento. | [M008](../implementation/modules/M008-cadastros-corporativos/README.md), [M010 parcerias](../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md) |
| **TipoDocumento** | Classificacao do Documento (ex.: Termo de Descentralizacao, Termo Aditivo). | M008 |
| **Termo de Descentralizacao** | TipoDocumento usado obrigatoriamente para formalizar AporteFinanceiro de Parceria (RN12). | M010 parcerias |
| **Termo Aditivo** | Documento que formaliza um aditivo (nova Vigencia ou AporteFinanceiro com `isAditivo = true`). | M010 parcerias |

---

## 10. Siglas

| Sigla | Significado | Contexto |
|-------|-------------|----------|
| FAPES | Fundacao de Amparo a Pesquisa e Inovacao do Espirito Santo | toda a plataforma |
| SIGFAPES | Sistema legado da FAPES (sera migrado) | [Domain 07](domains/07-importacao-sigfapes.md) |
| SERPRO | Servico Federal de Processamento de Dados | [M014](../implementation/modules/M014-prestacao-contas/README.md) |
| SECONT | Secretaria de Controle e Transparencia do ES | Domain 06 |
| SUCON | Superintendencia de Contratos e Convenios (da Agencia) | Domain 03 |
| LEC 978/2021 | Lei Complementar que dispoe sobre a FAPES | [product-vision.md](product-vision.md) |
| LOA | Lei Orcamentaria Anual | Domain 02, 05 |
| LDO | Lei de Diretrizes Orcamentarias | Domain 02, 05 |
| PPA | Plano Plurianual | Domain 02, 05 |
| NF-e | Nota Fiscal Eletronica (produtos) | M014 |
| NFS-e | Nota Fiscal de Servicos Eletronica | M014 |
| NCM | Nomenclatura Comum do Mercosul (classificacao de produtos) | M014 |
| CFOP | Codigo Fiscal de Operacoes e Prestacoes | M014 |
| ICMS | Imposto sobre Circulacao de Mercadorias e Servicos | M014 |
| PIS | Programa de Integracao Social | M014 |
| IPI | Imposto sobre Produtos Industrializados | M014 |
| ISS | Imposto sobre Servicos | M014 |
| CNPJ | Cadastro Nacional da Pessoa Juridica | M008 |
| CPF | Cadastro de Pessoas Fisicas | M008 |
| PLD | Prevencao a Lavagem de Dinheiro | Domain 05 |
| KYC | Know Your Customer | Domain 05 |
| PEP | Pessoa Exposta Politicamente | Domain 05 |
| COAF | Conselho de Controle de Atividades Financeiras | Domain 05 |
| PD&I | Pesquisa, Desenvolvimento e Inovacao | toda a plataforma |
| BANDES | Banco de Desenvolvimento do ES | M004 |
| Banestes | Banco do Estado do ES | M004 |
| BFF | Backend for Frontend | architecture |

---

## 11. Enumeracoes Principais

| Enum | Entidade | Valores | Definido em |
|------|----------|---------|-------------|
| **StatusPrestacao** | Prestacao (M014) | `RASCUNHO`, `EM_ANALISE`, `REVISAO`, `FINALIZADO`, `NEGADO` | [M014 modelo-estrutural](../implementation/modules/M014-prestacao-contas/modelo-estrutural.md) |
| **StatusTransacao** | TransacaoFinanceira (M014) | `PENDENTE`, `EM_RASCUNHO`, `EM_ANALISE`, `EM_REVISAO`, `APROVADA`, `REJEITADA` (derivado do Status da Prestacao) | M014 |
| **TipoOperacao** | TransacaoFinanceira (M014) | `DEBITO`, `CREDITO` | M014 |
| **TipoNota** | DocumentoFiscal (M014) | `PRODUTO`, `SERVICO` | M014 |
| **TipoJustificativa** | JustificativaDespesa (M014) | `NF`, `INVOICE`, `DIARIA` | M014 |
| **TipoMoeda** | JustificativaInvoice (M014) | `BRL`, `USD`, `EUR`, `GBP` | M014 |
| **EstadoParceria** | Parceria (M010) | `EmElaboracao`, `Vigente`, `Suspensa`, `Encerrada` | [M010 parcerias](../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md) |
| **EstadoPrograma** | Programa (M010) | `EmElaboracao`, `Ativo`, `Suspenso`, `Encerrado` | [M010 programas](../implementation/modules/M010-planejamento-estrategia/programas/modelo-estrutural.md) |
| **StatusCaptacao** | Captacao (M011) | `EmElaboracao`, `Aberta`, `EmAnalise`, `Publicada`, `EmExecucao`, `Fechada` | [Domain 03](domains/03-fomento-pre-award.md) |
| **TipoCaptacao** | Captacao (M011) | `ChamadaPublica`, `DemandaInduzida` | Domain 03 |

---

## Como contribuir com este glossario

- Ao introduzir um novo conceito de dominio em um modulo, adicionar entrada aqui com link para a fonte canonica
- Ao renomear um conceito, atualizar a definicao e marcar sinonimos a evitar
- Nao duplicar regras de negocio — apenas definir o termo e apontar para o RN/RI canonico
- Entrada vazia ("conceito citado mas nao definido") e indicador de debito de documentacao
