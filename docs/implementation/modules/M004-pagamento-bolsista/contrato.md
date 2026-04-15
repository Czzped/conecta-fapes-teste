# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M004 como contexto responsavel por calendario mensal, decisao de liberacao, geracao de folhas, bonus de pagamento, remessas bancarias, retornos, guias de liberacao, relatorios e acompanhamento do pagamento de bolsistas.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Gerente GEPOF | Define marcos mensais, gera folhas, gera remessas, acompanha processos |
| Area Tecnica | Decide a liberacao de editais por competencia |
| Diretor (DIRAF) | Autoriza ou rejeita folhas de pagamento |
| [Portal Coordenador](../../../products/portal-coordenador/README.md) | Consulta pagamentos por projeto ([EP-09](../../../products/portal-coordenador/features/EP-09-pagamentos-bolsa.md)) |
| M015 e M017 | Bloqueiam ou restringem processamento de pagamentos em cenarios especificos |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M003 | Modulo interno | Fornece `Edital`, `Projeto` e `AlocacaoBolsista` |
| M001 | Modulo interno | Fornece `VersaoNivel` e `VersaoModalidade` |
| M008 | Modulo interno | Fornece `AreaTecnica` |
| M009 | Modulo interno | Fornece gestao do ciclo de vida de bolsistas |
| Banestes | Sistema externo | Recebe remessas de cadastro e pagamento, retorna status |
| BANDES | Sistema externo | Recebe encaminhamento de pagamento |
| MinIO | Sistema externo | Armazenamento de arquivos de remessa, retorno, guias e relacoes |
| Redis | Sistema externo | Filas de processamento de retorno de remessas |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| ConfigurarPlanoMensalDeFolhas | Command | Definir os marcos M1, M2 e M3 da competencia | competencia, marcoSolicitacao, marcoGeracaoFolha, marcoPagamento | `PlanoMensal` criado/atualizado | RN01, RN02, RN03, RN07, RN08, RN09 | Datas informadas | Datas fora da janela, sequencia invalida | Nao | Gerente GEPOF | `POST /api/planoMensal` |
| RegistrarDecisaoDeLiberacaoDoEditalCompetencia | Command | Liberar ou nao liberar edital para a competencia | edital, competencia, ehLiberado, justificativa | `EditalCompetencia` atualizado | RN12, RN13, RN18, RN24 | EditalCompetencia existente ou gerado | Prazo invalido, edital ja incluido em folha | Nao | Area Tecnica | `POST /api/editalCompetencia` |
| GerarFolhaDePagamento | Command | Gerar folha normal ou complementar para a competencia | competencia, dataPagamento, tipoFolha | `Folha` gerada com pagamentos vinculados | RN10, RN15, RN16, RN23 | Marco de geracao atingido e folha anterior resolvida | Folha anterior pendente, pagamentos indisponiveis | Nao | Gerente GEPOF | `POST /api/folha` |
| RegistrarDecisaoSobreFolha | Command | Autorizar, rejeitar ou cancelar uma folha gerada | folha, tipoAcao, justificativa | `Folha` e pagamentos atualizados | RN14, RN20, RN21, RN22, RN25 | Folha existente | Estado da folha invalido, cancelamento nao permitido | Nao | Gerente GEPOF ou Diretor | `POST /api/folha/{id}/decisao` |
| GerenciarBonusPagamento | Command | Criar, editar ou excluir bonus de pagamento | nome, valorFixo/porcentagem, tipoBonus, planoMensalId, versaoModalidades | `BonusPagamento` criado/atualizado/excluido | — | PlanoMensal existente | Bonus ja incluso em folha | Nao | Gerente GEPOF | `POST/PUT/DELETE /api/bonusPagamento` |
| GerarRemessaCadastroBolsista | Command | Gerar arquivo de remessa de cadastro para o Banestes | alocacoes com StatusCadastroBaneste PENDENTE | `RemessaCadastro` com arquivo gerado no MinIO | — | Alocacoes ativas com cadastro pendente | Dados bancarios incompletos | Nao | Gerente GEPOF | `POST /api/remessaCadastro` |
| GerarRemessaPagamento | Command | Gerar arquivo de remessa de pagamento para o Banestes | folhaId | `RemessaPagamento` com arquivo gerado no MinIO | RN17 | Folha autorizada | Folha nao autorizada, falha de geracao | Sim por folha | Gerente GEPOF / Sistema | `POST /api/remessaPagamento` |
| ProcessarRetornoRemessaCadastro | Async Job | Processar arquivo de retorno de remessa de cadastro | mensagem da fila Redis | Alocacoes atualizadas (CADASTRADO ou PENDENTE) | — | Mensagem na fila Redis | Arquivo invalido, erro de processamento | Sim por remessa | Sistema (Job Hangfire) | Fila Redis `pagamentobolsista.remessa.cadastro` |
| ProcessarRetornoRemessaPagamento | Async Job | Processar arquivo de retorno de remessa de pagamento | mensagem da fila Redis | Pagamentos atualizados (AGENDADO ou FALHA_AGENDAMENTO) | — | Mensagem na fila Redis | Arquivo invalido, erro de processamento | Sim por remessa | Sistema (Job Hangfire) | Fila Redis `pagamentobolsista.remessa.pagamento` |
| EncaminharPagamentoBandes | Command | Encaminhar pagamentos ao BANDES para transferencia | folhaId | Pagamentos encaminhados | — | Folha com remessas agendadas | Folha nao agendada | Nao | Gerente GEPOF | `POST /api/folha/{id}/encaminhar-bandes` |
| GerarGuiaLiberacao | Command | Gerar guia de liberacao (PDF) para Banestes ou Bandes | folhaId, tipo (NORMAL/ALTERNATIVA) | `GuiaLiberacao` com PDF gerado no MinIO | — | Folha existente com pagamentos | Folha sem pagamentos | Nao | Gerente GEPOF | `POST /api/folha/{id}/guia` |
| GerarRelacaoPagamento | Query | Gerar relacao de pagamento por edital ou bolsista | folhaId, editalId, filtros | Documento de relacao gerado no MinIO | — | Folha existente | Nenhum pagamento encontrado | N/A | Gerente GEPOF | `GET /api/folha/{id}/relacao` |
| ConsultarFolhasDaCompetencia | Query | Consultar folhas, decisoes, guias e remessas de uma competencia | competencia, edital, status | Lista de folhas e seus artefatos | RN10, RN17 | Competencia informada | Nenhuma folha encontrada | N/A | Gerente GEPOF ou Area Tecnica | `GET /api/folha` |
| ConsultarProcessosRemessa | Query | Consultar processos de remessa e seus status | filtros de status e tipo | Lista de processos com detalhes | — | — | Nenhum processo encontrado | N/A | Gerente GEPOF | `GET /api/processoRemessa` |
| SuspenderPagamento | Command | Suspender pagamento de um bolsista | pagamentoId, justificativa | Pagamento com status SUSPENSAO_POR_SOLICITACAO | — | Pagamento com status ALOCADO | Pagamento ja em folha | Nao | Gerente GEPOF | `POST /api/pagamentoBolsista/{id}/suspender` |
| EstenderPagamento | Command | Estender cotas de pagamento de um bolsista | alocacaoId, quantidadeCotas | Novas cotas de pagamento criadas | — | Alocacao ativa | Alocacao nao ativa | Nao | Gerente GEPOF | `POST /api/pagamentoBolsista/{id}/estender` |
| ExportarFolhaCsv | Query | Exportar dados da folha em formato CSV | folhaId | Arquivo CSV | — | Folha existente | Folha nao encontrada | N/A | Gerente GEPOF | `GET /api/folha/{id}/csv` |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "competencia": "2026-05"
    }
  }
}
```

## Exemplos JSON por Operacao

### ConfigurarPlanoMensalDeFolhas

**Exemplo de entrada**

```json
{
  "competencia": "2026-05",
  "marcoSolicitacao": "2026-05-05",
  "marcoGeracaoFolha": "2026-05-12",
  "marcoPagamento": "2026-05-20"
}
```

**Exemplo de saida**

```json
{
  "planoMensal": {
    "competencia": "2026-05",
    "ehAtual": true
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| MARCO_PLANO_INVALIDO | Os marcos informados para a competencia nao respeitam as janelas permitidas. |
| SEQUENCIA_MARCOS_INVALIDA | O marco M1 deve ocorrer antes de M2, e M2 antes de M3. |

### RegistrarDecisaoDeLiberacaoDoEditalCompetencia

**Exemplo de entrada**

```json
{
  "editalId": "EDT-2026-001",
  "competencia": "2026-05",
  "ehLiberado": true,
  "justificativa": null
}
```

**Exemplo de saida**

```json
{
  "editalCompetencia": {
    "status": "LIBERADO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PRAZO_LIBERACAO_INVALIDO | Ainda nao e permitido decidir a liberacao do edital para esta competencia. |
| EDITAL_COMPETENCIA_BLOQUEADO | O edital ja foi incluido em folha e nao pode mais ter a decisao alterada. |

### GerarFolhaDePagamento

**Exemplo de entrada**

```json
{
  "competencia": "2026-05",
  "tipoFolha": "NORMAL",
  "dataPagamento": "2026-05-20"
}
```

**Exemplo de saida**

```json
{
  "folha": {
    "id": "FOL-2026-05-01",
    "status": "GERADA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FOLHA_ANTERIOR_PENDENTE | Nao e possivel gerar nova folha enquanto a ultima estiver gerada e sem decisao final. |
| DATA_PAGAMENTO_INVALIDA | A data de pagamento informada e invalida para o tipo de folha solicitado. |

### RegistrarDecisaoSobreFolha

**Exemplo de entrada**

```json
{
  "folhaId": "FOL-2026-05-01",
  "tipoAcao": "AUTORIZAR",
  "justificativa": "Folha validada para envio bancario."
}
```

**Exemplo de saida**

```json
{
  "folha": {
    "id": "FOL-2026-05-01",
    "status": "AUTORIZADA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| ACAO_FOLHA_INVALIDA | A acao solicitada nao pode ser aplicada ao estado atual da folha. |
| CANCELAMENTO_FOLHA_NAO_PERMITIDO | A folha nao pode mais ser cancelada no momento informado. |

### GerarRemessaPagamento

**Exemplo de entrada**

```json
{
  "folhaId": "FOL-2026-05-01",
  "tipoRemessa": "PAGAMENTO"
}
```

**Exemplo de saida**

```json
{
  "remessa": {
    "numero": 1042,
    "status": "GERADA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FOLHA_NAO_AUTORIZADA | Somente folhas autorizadas podem gerar remessa de pagamento. |
| REMESSA_BANCARIA_INDISPONIVEL | Nao foi possivel enviar a remessa para o banco neste momento. |

### ConsultarFolhasDaCompetencia

**Exemplo de entrada**

```json
{
  "competencia": "2026-05",
  "status": "AUTORIZADA"
}
```

**Exemplo de saida**

```json
{
  "items": [
    {
      "id": "FOL-2026-05-01",
      "status": "AUTORIZADA",
      "dataPagamento": "2026-05-20"
    }
  ],
  "total": 1
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FOLHA_NAO_ENCONTRADA | Nenhuma folha foi encontrada para os filtros informados. |
| FILTRO_FOLHA_INVALIDO | Os filtros informados para consulta de folhas sao invalidos. |

## Mapeamento de Transporte

A implementacao atual utiliza controllers genéricos do framework (`BaseCrudController`, `BaseController`) com endpoints no padrao `/api/{entidade}`. O mapeamento concreto de cada operacao esta documentado na coluna "Mapeamento de transporte" da tabela acima.

Jobs assincronos:
- `ProcessarRetornoRemessaCadastro`: consome fila Redis `pagamentobolsista.remessa.cadastro` a cada 3 min via Hangfire.
- `ProcessarRetornoRemessaPagamento`: consome fila Redis `pagamentobolsista.remessa.pagamento` a cada 3 min via Hangfire.

## Eventos e Efeitos Colaterais

- `RegistrarDecisaoDeLiberacaoDoEditalCompetencia` registra historico formal de decisao da area (DecisaoLiberacao).
- `GerarFolhaDePagamento` altera o status dos pagamentos vinculados para EM_FOLHA, EditalCompetencia para INCLUIDO_EM_FOLHA, BonusPagamento para INCLUSO_NA_FOLHA.
- `RegistrarDecisaoSobreFolha` pode devolver pagamentos para ALOCADO e EditalCompetencia para LIBERADO, conforme regras do modulo.
- `GerarRemessaCadastroBolsista` atualiza StatusCadastroBaneste para ENVIADO e gera arquivo no MinIO.
- `GerarRemessaPagamento` gera arquivo de largura fixa no MinIO com hash SHA256 e vincula pagamentos a remessa.
- `ProcessarRetornoRemessaCadastro` atualiza status de cadastro (CADASTRADO ou PENDENTE) e registra erros.
- `ProcessarRetornoRemessaPagamento` atualiza status de pagamento (AGENDADO ou FALHA_AGENDAMENTO) e registra erros.
- `EncaminharPagamentoBandes` inicia a comunicacao com o BANDES para transferencia de recursos.
- `GerarGuiaLiberacao` gera documento PDF e armazena no MinIO (bucket BUCKET_GUIAS).
- `GerarRelacaoPagamento` gera documento de relacao e armazena no MinIO (bucket BUCKET_RELACOES).

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
