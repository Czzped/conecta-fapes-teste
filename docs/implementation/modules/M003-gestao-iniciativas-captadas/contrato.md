# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do M003 como bounded context de gestao pos-contratacao da `Iniciativa`. O modulo registra a iniciativa outorgada, mantem seu plano versionado, controla alteracoes de rubrica, solicita diarias operacionais para bolsistas alocados e oferece consultas consolidadas para programas, parcerias, acompanhamento de resultados, suspensao/finalizacao, BI e transparencia.

O M003 nao publica comandos para criar edital, cota de edital, alocacao de bolsista ou documento de prestacao de contas. Esses objetos pertencem aos modulos M011, M009 e M014. A solicitacao de diaria pertence ao M003; a comprovacao financeira posterior pertence ao M014.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Analista da Agencia de Fomento | Registra e acompanha iniciativas contratadas |
| Ortogado | Consulta a iniciativa e solicita alteracao de rubrica |
| M010 | Consulta iniciativas vinculadas a programas e parcerias |
| M012 | Consulta resultados, beneficios e objetivos da iniciativa |
| M014 | Envia ou disponibiliza lancamentos de execucao financeira para consolidacao |
| M014 | Consulta solicitacoes de diaria aprovadas para registrar justificativas e comprovantes na prestacao de contas |
| M015 | Consulta estado da iniciativa para suspensao, reativacao e encerramento |
| M018/M019 | Consomem visoes consolidadas para BI, transparencia e auditoria |
| Portal Coordenador | Exibe contexto da iniciativa, plano, equipe, cronograma e orcamento |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M008 | Modulo interno | Fornece `PessoaFisica` para o papel de `Ortogado`, membros da equipe e dados bancarios confirmados no aceite de diaria |
| M008 | Modulo interno | Dono dos cadastros corporativos `TipoViagem` e `TipoDiaria`, consumidos pelo M003 no calculo de solicitacoes de diaria |
| M009 | Modulo interno | Fornece e valida alocacoes de bolsistas usadas como beneficiarios de diaria |
| M010 | Modulo interno | Fornece referencias de `Programa` e `Parceria` associadas a iniciativa |
| M011 | Modulo interno | Dono de `Edital`; M003 pode guardar referencia de origem da captacao, mas nao gerencia edital |
| M014 | Modulo interno | Dono da execucao financeira detalhada e prestacao de contas |
| M020 | Modulo interno | Envia notificacoes aos bolsistas para assinatura do termo de aceite de diaria |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|
| RegistrarIniciativaContratada | Command | Criar a iniciativa apos contratacao/outorga | tipoIniciativaId, titulo, resumo, datas, valorAprovado, ortogadoId, referencias externas | `Iniciativa` criada | RN01-RN04, RN13 | TipoIniciativa e PessoaFisica existentes | Tipo inexistente, ortogado invalido, referencia externa inconsistente | Nao | Analista da Agencia |
| CriarVersaoPlanoIniciativa | Command | Criar versao inicial ou nova versao do plano | iniciativaId, justificativa, objetivos, resultados, riscos, beneficios, equipe, cronograma, orcamento | `VersaoPlanoIniciativa` criada | RN04-RN09 | Iniciativa existente | Plano invalido, objetivo geral ausente, resultado sem vinculo | Nao | Analista da Agencia |
| AtivarVersaoPlanoIniciativa | Command | Tornar uma versao de plano vigente | iniciativaId, versaoId, dataVigenciaInicio | Versao `VIGENTE` | RN04, RN08 | Versao criada e valida | Mais de uma versao vigente, versao incompleta | Nao | Analista da Agencia |
| SolicitarAlteracaoRubrica | Command | Registrar solicitacao de inclusao ou retirada de rubrica | iniciativaId, ortogadoId, rubricaId, tipoAlteracao, justificativa | `SolicitacaoAlteracaoRubrica` criada | RN09, RN11, RN12 | Ortogado ativo da iniciativa | Ortogado invalido, rubrica inexistente, retirada impedida | Nao | Ortogado |
| DecidirSolicitacaoAlteracaoRubrica | Command | Aprovar ou rejeitar solicitacao de rubrica | solicitacaoId, decisao, justificativa, versaoPlanoGeradaId | Solicitacao decidida | RN08, RN11, RN12 | Solicitacao em analise | Solicitacao encerrada, retirada impedida, versao ausente quando obrigatoria | Nao | Analista da Agencia |
| SolicitarDiaria | Command | Registrar solicitacao operacional de diaria para um ou mais bolsistas da iniciativa, validar saldo, alocar/comprometer valor e notificar beneficiarios quando houver aceite pendente | iniciativaId, ortogadoId, tipoViagemRef, dataHoraPartida, dataHoraChegada, destino, motivo, beneficiarios | `SolicitacaoDiaria` em `ALOCADA` ou `APROVADA` | RN22-RN31 | Iniciativa ativa, ortogado ativo, beneficiarios validos em M009, tipo de diaria vigente no M008, rubrica de diaria com saldo | Periodo invalido, beneficiario invalido, tipo de diaria vigente ausente, rubrica ausente, saldo insuficiente | Nao | Ortogado |
| AssinarTermoAceiteDiaria | Command | Registrar assinatura do bolsista no termo de aceite da diaria | solicitacaoDiariaId, beneficiarioId, pessoaFisicaId, contaBancariaConfirmada | `TermoAceiteDiaria` assinado; solicitacao `APROVADA` quando todos os aceites forem assinados | RN26, RN29 | Beneficiario pendente e usuario corresponde ao bolsista | Beneficiario invalido, aceite ja registrado, conta bancaria ausente | Nao | Bolsista |
| RecusarTermoAceiteDiaria | Command | Registrar recusa do bolsista com justificativa obrigatoria e reverter comprometimento quando aplicavel | solicitacaoDiariaId, beneficiarioId, pessoaFisicaId, justificativa | `TermoAceiteDiaria` recusado, solicitacao em `RECUSADA` e credito gerado quando havia debito | RN26, RN29 | Beneficiario pendente e usuario corresponde ao bolsista | Beneficiario invalido, aceite ja registrado, justificativa ausente | Nao | Bolsista |
| RemoverSolicitacaoDiaria | Command | Remover diaria alocada ou aprovada com justificativa antes do inicio da viagem, revertendo o comprometimento quando houver | solicitacaoDiariaId, justificativa | Solicitacao cancelada e credito gerado quando havia debito | RN22-RN33 | Justificativa informada; data/hora atual anterior a partida | Justificativa ausente, viagem ja iniciada, estado invalido | Nao | Ortogado |
| RegularizarDiariaNaoUtilizada | Command | Regularizar diaria nao utilizada quando a data/hora de partida ja passou, sem apagar a solicitacao | solicitacaoDiariaId, justificativa | Solicitacao regularizada e credito gerado quando cabivel | RN22-RN33 | Justificativa informada; viagem ja iniciada; diaria sem prestacao finalizada | Justificativa ausente, prestacao finalizada, estado invalido | Nao | Ortogado |
| RegistrarLancamentoExecucao | Command | Registrar lancamento recebido de integracao financeira | iniciativaId, rubricaId, data, valor, tipo, origem | `LancamentoExecucao` criado | RN09, RN10, RN15 | Iniciativa e rubrica existentes | Lancamento duplicado, rubrica invalida, valor invalido | Sim, por chave de origem | Modulo interno autorizado |
| ConsultarIniciativaConsolidada | Query | Consultar dados completos da iniciativa e plano vigente | iniciativaId | Visao consolidada da iniciativa | RN01-RN15 | Iniciativa existente | Iniciativa nao encontrada | N/A | Usuario autorizado ou modulo interno |
| ConsultarIniciativasPorPrograma | Query | Listar iniciativas vinculadas a um programa | programaId | Lista de iniciativas | RN01 | Programa existente | Programa sem iniciativas | N/A | M010/modulo interno |
| ConsultarIniciativasPorParceria | Query | Listar iniciativas vinculadas a uma parceria | parceriaId | Lista de iniciativas | RN01 | Parceria existente | Parceria sem iniciativas | N/A | M010/modulo interno |
| ConsultarExecucaoConsolidadaIniciativa | Query | Consultar valores planejados, executados e saldo por rubrica | iniciativaId | Resumo financeiro consolidado | RN09, RN10 | Iniciativa existente | Execucao indisponivel | N/A | Usuario autorizado ou modulo interno |
| ConsultarCicloFomentoIniciativa | Query | Consultar timeline transversal de pre-award, award e post-award | iniciativaId ou propostaId | Lista ordenada de `EstagioCicloFomento` | RN16-RN19 | Iniciativa ou proposta existente | Ciclo nao encontrado | N/A | Usuario autorizado ou modulo interno |
| ConsultarSolicitacoesDiaria | Query | Listar solicitacoes de diaria da iniciativa | iniciativaId, busca, estado, periodoPartida, pagina, tamanhoPagina | Lista paginada de `SolicitacaoDiaria` | RN22-RN27 | Iniciativa existente | Iniciativa nao encontrada | N/A | Usuario autorizado ou modulo interno |
| ConsultarSolicitacaoDiaria | Query | Consultar detalhe da solicitacao de diaria, beneficiarios, calculo e aceites | solicitacaoDiariaId | Detalhe de `SolicitacaoDiaria` | RN22-RN27 | Solicitacao existente | Solicitacao nao encontrada | N/A | Usuario autorizado ou modulo interno |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- O contrato explicita a intencao funcional; endpoint, handler e serializacao concreta ficam no [contrato-api.md](contrato-api.md).

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "campo": "valor-relacionado-ao-erro"
    }
  }
}
```

## Exemplos JSON por Operacao

### RegistrarIniciativaContratada

```json
{
  "tipoIniciativaId": "TIPO-PESQUISA",
  "titulo": "Laboratorio de Dados Publicos",
  "resumo": "Iniciativa para estruturacao de laboratorio institucional.",
  "dataContratacao": "2026-05-01",
  "dataInicio": "2026-06-01",
  "dataFim": "2027-05-31",
  "valorAprovado": 250000.00,
  "ortogadoPessoaFisicaId": "PF-2026-011",
  "programaId": "PROG-2026-01",
  "parceriaId": "PAR-2026-03",
  "origemCaptacaoId": "EDITAL-M011-2026-001"
}
```

### CriarVersaoPlanoIniciativa

```json
{
  "iniciativaId": "INI-2026-014",
  "justificativa": "Plano inicial aprovado na contratacao.",
  "objetivoGeral": {
    "descricao": "Estruturar ambiente institucional de dados para apoio a politicas publicas."
  },
  "objetivosEspecificos": [
    {
      "descricao": "Implantar infraestrutura minima do laboratorio.",
      "percentualImportancia": 60,
      "resultadoIds": ["RES-2026-001"]
    }
  ],
  "orcamentoPlanejado": {
    "valorTotal": 250000.00,
    "valorBolsas": 120000.00,
    "valorCapital": 130000.00
  }
}
```

### SolicitarAlteracaoRubrica

```json
{
  "iniciativaId": "INI-2026-014",
  "ortogadoId": "ORT-2026-001",
  "rubricaId": "RUB-CAPITAL",
  "tipoAlteracao": "INCLUSAO",
  "justificativa": "Necessidade de compra de equipamento nao previsto no plano vigente."
}
```

### SolicitarDiaria

```json
{
  "iniciativaId": "INI-2026-014",
  "ortogadoId": "ORT-2026-001",
  "tipoViagemRef": "TVI-001",
  "dataHoraPartida": "2026-06-10T08:00:00-03:00",
  "dataHoraChegada": "2026-06-12T18:00:00-03:00",
  "destino": "Vitoria/ES - evento de acompanhamento tecnico",
  "motivo": "Participacao dos bolsistas na apresentacao de resultados parciais da iniciativa.",
  "beneficiarios": [
    {
      "alocacaoBolsistaRef": "ALOC-M009-2026-031",
      "pessoaFisicaRef": "PF-2026-045"
    },
    {
      "alocacaoBolsistaRef": "ALOC-M009-2026-032",
      "pessoaFisicaRef": "PF-2026-046"
    }
  ]
}
```

Saida esperada:

```json
{
  "solicitacaoDiaria": {
    "id": "SD-2026-001",
    "codigo": "SD-2026-001",
    "estado": "ALOCADA",
    "quantidadeDiariasCalculada": 2.5,
    "tipoViagemRef": "TVI-001",
    "tipoDiariaRef": "DIA-2026-001",
    "valorUnitarioDiaria": 260.00,
    "fracaoCalculoSnapshot": "12H",
    "valorTotalCalculado": 1300.00,
    "rubricaDebitoRef": "RUB-DIARIAS-PASSAGENS",
    "lancamentoDebitoRef": "LEX-2026-045",
    "beneficiarios": [
      {
        "beneficiarioId": "BD-2026-001",
        "pessoaFisicaRef": "PF-2026-045",
        "quantidadeDiariasCalculada": 2.5,
        "valorCalculado": 650.00,
        "aceite": "PENDENTE"
      },
      {
        "beneficiarioId": "BD-2026-002",
        "pessoaFisicaRef": "PF-2026-046",
        "quantidadeDiariasCalculada": 2.5,
        "valorCalculado": 650.00,
        "aceite": "PENDENTE"
      }
    ]
  }
}
```

### AssinarTermoAceiteDiaria

```json
{
  "solicitacaoDiariaId": "SD-2026-001",
  "beneficiarioId": "BD-2026-001",
  "pessoaFisicaId": "PF-2026-045",
  "aceite": true,
  "contaBancariaConfirmada": {
    "banco": "021",
    "agencia": "0001",
    "conta": "12345-6",
    "tipo": "CONTA_CORRENTE"
  }
}
```

Saida esperada:

```json
{
  "solicitacaoDiaria": {
    "id": "SD-2026-001",
    "estado": "APROVADA",
    "valorTotalAprovado": 1600.00,
    "rubricaDebitoRef": "RUB-DIARIAS-PASSAGENS",
    "lancamentoDebitoRef": "LEX-2026-045"
  },
  "lancamentoExecucao": {
    "id": "LEX-2026-045",
    "tipo": "DEBITO",
    "valor": 1600.00,
    "origem": "M003:SolicitacaoDiaria:SD-2026-001"
  }
}
```

### RemoverSolicitacaoDiaria

```json
{
  "solicitacaoDiariaId": "SD-2026-001",
  "justificativa": "Viagem cancelada por alteracao na agenda da atividade."
}
```

Saida esperada quando a solicitacao estava alocada ou aprovada e a viagem ainda nao iniciou:

```json
{
  "solicitacaoDiaria": {
    "id": "SD-2026-001",
    "estado": "CANCELADA",
    "justificativaCancelamento": "Viagem cancelada por alteracao na agenda da atividade.",
    "lancamentoCreditoRef": "LEX-2026-046"
  },
  "lancamentoExecucao": {
    "id": "LEX-2026-046",
    "tipo": "CREDITO",
    "valor": 1600.00,
    "rubricaId": "RUB-DIARIAS-PASSAGENS",
    "origem": "M003:SolicitacaoDiariaRemovida:SD-2026-001"
  }
}
```

### RegularizarDiariaNaoUtilizada

```json
{
  "solicitacaoDiariaId": "SD-2026-001",
  "justificativa": "Viagem nao realizada por cancelamento da agenda apos a data prevista."
}
```

Saida esperada:

```json
{
  "solicitacaoDiaria": {
    "id": "SD-2026-001",
    "estado": "REGULARIZADA_NAO_UTILIZADA",
    "justificativaRegularizacao": "Viagem nao realizada por cancelamento da agenda apos a data prevista.",
    "lancamentoCreditoRef": "LEX-2026-052"
  }
}
```

### RegistrarLancamentoExecucao

```json
{
  "iniciativaId": "INI-2026-014",
  "rubricaId": "RUB-CAPITAL",
  "data": "2026-08-10",
  "descricao": "Nota fiscal de equipamento de processamento",
  "valor": 18400.00,
  "tipo": "EXECUCAO",
  "origem": "M014:DocumentoFiscal:DF-2026-223"
}
```

### ConsultarIniciativaConsolidada

```json
{
  "iniciativa": {
    "id": "INI-2026-014",
    "titulo": "Laboratorio de Dados Publicos",
    "tipo": "Projeto de Pesquisa",
    "estado": "EM_EXECUCAO",
    "ortogado": {
      "id": "ORT-2026-001",
      "pessoaFisicaId": "PF-2026-011"
    }
  },
  "planoVigente": {
    "versao": 1,
    "objetivosEspecificos": 3,
    "resultados": 4,
    "atividades": 9
  },
  "orcamento": {
    "valorPlanejado": 250000.00,
    "valorExecutado": 18400.00,
    "saldo": 231600.00
  }
}
```

### ConsultarCicloFomentoIniciativa

```json
{
  "iniciativaId": "INI-2026-014",
  "propostaId": "PROP-2026-088",
  "marcoAtual": "EM_EXECUCAO",
  "estagios": [
    {
      "ordem": 1,
      "fase": "PRE_AWARD",
      "marco": "SUBMISSAO",
      "estado": "CONCLUIDO",
      "dataInicio": "2024-01-15",
      "moduloOrigem": "M011",
      "referenciaOrigemId": "PROP-2026-088"
    },
    {
      "ordem": 2,
      "fase": "PRE_AWARD",
      "marco": "AVALIACAO_DOCUMENTOS",
      "estado": "CONCLUIDO",
      "dataInicio": "2024-01-20",
      "moduloOrigem": "M011",
      "referenciaOrigemId": "HAB-2026-021"
    },
    {
      "ordem": 3,
      "fase": "PRE_AWARD",
      "marco": "AVALIACAO_AD_HOC",
      "estado": "CONCLUIDO",
      "dataInicio": "2024-02-05",
      "moduloOrigem": "M011",
      "referenciaOrigemId": "AVAL-2026-044"
    },
    {
      "ordem": 4,
      "fase": "AWARD",
      "marco": "EM_CONTRATACAO",
      "estado": "CONCLUIDO",
      "dataInicio": "2024-02-20",
      "moduloOrigem": "M022",
      "referenciaOrigemId": "TO-2026-014"
    },
    {
      "ordem": 5,
      "fase": "AWARD",
      "marco": "CONTRATADO",
      "estado": "CONCLUIDO",
      "dataInicio": "2024-03-01",
      "moduloOrigem": "M003",
      "referenciaOrigemId": "INI-2026-014"
    },
    {
      "ordem": 6,
      "fase": "POST_AWARD",
      "marco": "EM_EXECUCAO",
      "estado": "ATUAL",
      "dataInicio": "2024-03-16",
      "moduloOrigem": "M003",
      "referenciaOrigemId": "INI-2026-014"
    },
    {
      "ordem": 7,
      "fase": "POST_AWARD",
      "marco": "SUSPENSA",
      "estado": "PENDENTE",
      "moduloOrigem": "M015"
    },
    {
      "ordem": 8,
      "fase": "POST_AWARD",
      "marco": "EM_APROVACAO_CONTAS",
      "estado": "PENDENTE",
      "moduloOrigem": "M014"
    },
    {
      "ordem": 9,
      "fase": "POST_AWARD",
      "marco": "CONCLUIDO",
      "estado": "PENDENTE",
      "moduloOrigem": "M015"
    },
    {
      "ordem": 10,
      "fase": "POST_AWARD",
      "marco": "CANCELADA",
      "estado": "PENDENTE",
      "moduloOrigem": "M015"
    }
  ]
}
```

## Eventos e Efeitos Colaterais

- `IniciativaContratadaRegistrada`: emitido apos criacao da iniciativa.
- `VersaoPlanoIniciativaAtivada`: emitido quando uma nova versao passa a ser vigente.
- `SolicitacaoAlteracaoRubricaCriada`: emitido quando o ortogado solicita inclusao ou retirada de rubrica.
- `SolicitacaoAlteracaoRubricaAprovada`: emitido quando a alteracao e aprovada e, quando aplicavel, gera nova versao do plano.
- `LancamentoExecucaoRegistrado`: emitido quando um lancamento de execucao financeira e incorporado a visao consolidada.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: a definir no M003
