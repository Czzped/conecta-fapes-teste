# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do M003 como bounded context de gestao pos-contratacao da `Iniciativa`. O modulo registra a iniciativa outorgada, mantem seu plano versionado, controla alteracoes de rubrica e oferece consultas consolidadas para programas, parcerias, acompanhamento de resultados, suspensao/finalizacao, BI e transparencia.

O M003 nao publica comandos para criar edital, cota de edital, alocacao de bolsista ou documento de prestacao de contas. Esses objetos pertencem aos modulos M011, M009 e M014.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Analista da Agencia de Fomento | Registra e acompanha iniciativas contratadas |
| Ortogado | Consulta a iniciativa e solicita alteracao de rubrica |
| M010 | Consulta iniciativas vinculadas a programas e parcerias |
| M012 | Consulta resultados, beneficios e objetivos da iniciativa |
| M014 | Envia ou disponibiliza lancamentos de execucao financeira para consolidacao |
| M015 | Consulta estado da iniciativa para suspensao, reativacao e encerramento |
| M018/M019 | Consomem visoes consolidadas para BI, transparencia e auditoria |
| Portal Coordenador | Exibe contexto da iniciativa, plano, equipe, cronograma e orcamento |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M008 | Modulo interno | Fornece `PessoaFisica` para o papel de `Ortogado` e membros da equipe |
| M010 | Modulo interno | Fornece referencias de `Programa` e `Parceria` associadas a iniciativa |
| M011 | Modulo interno | Dono de `Edital`; M003 pode guardar referencia de origem da captacao, mas nao gerencia edital |
| M014 | Modulo interno | Dono da execucao financeira detalhada e prestacao de contas |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|
| RegistrarIniciativaContratada | Command | Criar a iniciativa apos contratacao/outorga | tipoIniciativaId, titulo, resumo, datas, valorAprovado, ortogadoId, referencias externas | `Iniciativa` criada | RN01-RN04, RN13 | TipoIniciativa e PessoaFisica existentes | Tipo inexistente, ortogado invalido, referencia externa inconsistente | Nao | Analista da Agencia |
| CriarVersaoPlanoIniciativa | Command | Criar versao inicial ou nova versao do plano | iniciativaId, justificativa, objetivos, resultados, riscos, beneficios, equipe, cronograma, orcamento | `VersaoPlanoIniciativa` criada | RN04-RN09 | Iniciativa existente | Plano invalido, objetivo geral ausente, resultado sem vinculo | Nao | Analista da Agencia |
| AtivarVersaoPlanoIniciativa | Command | Tornar uma versao de plano vigente | iniciativaId, versaoId, dataVigenciaInicio | Versao `VIGENTE` | RN04, RN08 | Versao criada e valida | Mais de uma versao vigente, versao incompleta | Nao | Analista da Agencia |
| SolicitarAlteracaoRubrica | Command | Registrar solicitacao de inclusao ou retirada de rubrica | iniciativaId, ortogadoId, rubricaId, tipoAlteracao, justificativa | `SolicitacaoAlteracaoRubrica` criada | RN09, RN11, RN12 | Ortogado ativo da iniciativa | Ortogado invalido, rubrica inexistente, retirada impedida | Nao | Ortogado |
| DecidirSolicitacaoAlteracaoRubrica | Command | Aprovar ou rejeitar solicitacao de rubrica | solicitacaoId, decisao, justificativa, versaoPlanoGeradaId | Solicitacao decidida | RN08, RN11, RN12 | Solicitacao em analise | Solicitacao encerrada, retirada impedida, versao ausente quando obrigatoria | Nao | Analista da Agencia |
| RegistrarLancamentoExecucao | Command | Registrar lancamento recebido de integracao financeira | iniciativaId, rubricaId, data, valor, tipo, origem | `LancamentoExecucao` criado | RN09, RN10, RN15 | Iniciativa e rubrica existentes | Lancamento duplicado, rubrica invalida, valor invalido | Sim, por chave de origem | Modulo interno autorizado |
| ConsultarIniciativaConsolidada | Query | Consultar dados completos da iniciativa e plano vigente | iniciativaId | Visao consolidada da iniciativa | RN01-RN15 | Iniciativa existente | Iniciativa nao encontrada | N/A | Usuario autorizado ou modulo interno |
| ConsultarIniciativasPorPrograma | Query | Listar iniciativas vinculadas a um programa | programaId | Lista de iniciativas | RN01 | Programa existente | Programa sem iniciativas | N/A | M010/modulo interno |
| ConsultarIniciativasPorParceria | Query | Listar iniciativas vinculadas a uma parceria | parceriaId | Lista de iniciativas | RN01 | Parceria existente | Parceria sem iniciativas | N/A | M010/modulo interno |
| ConsultarExecucaoConsolidadaIniciativa | Query | Consultar valores planejados, executados e saldo por rubrica | iniciativaId | Resumo financeiro consolidado | RN09, RN10 | Iniciativa existente | Execucao indisponivel | N/A | Usuario autorizado ou modulo interno |

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
