# Contrato - Diarias da Projeto

[← Voltar](README.md)

## Comandos

Nos contratos de diaria, cada `SolicitacaoDiaria` referencia exatamente uma `alocacaoBolsistaRef` do M009. Para uma viagem com varios bolsistas, o cliente deve criar uma solicitacao por alocacao. Quando a viagem possuir mais de um trecho logistico, a solicitacao deve registrar o roteiro para memoria de calculo e auditoria.

| Operacao | Tipo | Descricao | Entrada | Saida | Regras |
|----------|------|-----------|---------|-------|--------|
| SolicitarDiaria | Command | Criar solicitacao para uma alocacao de bolsista, validar roteiro/abrangencia, validar saldo, gerar comprometimento/alocacao e notificar quando houver aceite pendente | projetoId, ortogadoId, alocacaoBolsistaRef, abrangenciaRef, partida, chegada, origem, destino, roteiroViagem, motivo | SolicitacaoDiaria em ALOCADA ou APROVADA | RN22-RN28 |
| RegistrarAceiteDiaria | Command | Registrar aceite do bolsista na propria solicitacao | solicitacaoDiariaId, contaBancariaConfirmada | Solicitacao com aceite assinado | RN26 |
| RegistrarRecusaDiaria | Command | Registrar recusa do bolsista na propria solicitacao | solicitacaoDiariaId, justificativa | Solicitacao recusada quando aplicavel | RN26 |
| RemoverSolicitacaoDiaria | Command | Remover diaria alocada ou aprovada com justificativa antes do inicio da viagem | solicitacaoDiariaId, justificativa | Solicitacao cancelada e transacao de reversao quando aplicavel | RN32-RN33 |
| RegularizarDiariaNaoUtilizada | Command | Regularizar diaria que nao foi utilizada apos o inicio previsto | solicitacaoDiariaId, justificativa | Solicitacao regularizada e transacao de reversao quando aplicavel | RN32-RN33 |

## Consultas

| Operacao | Tipo | Descricao | Entrada | Saida |
|----------|------|-----------|---------|-------|
| ConsultarSolicitacoesDiaria | Query | Listar solicitacoes da projeto | projetoId, busca, estado, periodoPartida, pagina, tamanhoPagina | Lista paginada de SolicitacaoDiaria |
| ConsultarSolicitacaoDiaria | Query | Consultar detalhe da solicitacao | solicitacaoDiariaId | Solicitacao, aceite e lancamentos |

> `ConsultarTipoDiariaVigente` pertence ao contrato do M008. O M003 consome essa consulta por `abrangenciaRef` como dependencia externa antes de criar a solicitacao; a resposta deve trazer o `TipoDiaria` vigente e o `ParametroCalculoDiaria` vigente vinculado a ele.

## Eventos

| Evento | Quando ocorre | Payload minimo |
|--------|---------------|----------------|
| SolicitacaoDiariaAlocada | Coordenador cria solicitacao com saldo disponivel antes do inicio da viagem | solicitacaoDiariaId, projetoId, alocacaoBolsistaRef, abrangenciaRef, tipoDiariaRef, parametroCalculoDiariaRef, valorUnitarioDiaria, rubricaProjetoRef, transacaoComprometimentoRef |
| NotificacaoAceiteDiariaPendenteCriada | Existe diaria pendente de aceite para bolsista | solicitacaoDiariaId, alocacaoBolsistaRef, projetoId, destino, partida |
| EmailAceiteDiariaPendenteEnviado | E-mail de diaria pendente e enviado ao bolsista | solicitacaoDiariaId, alocacaoBolsistaRef, emailDestino, dataEnvio |
| AceiteDiariaRegistrado | Bolsista registra aceite da diaria | solicitacaoDiariaId, alocacaoBolsistaRef, dataAssinatura |
| EmailAceiteDiariaCoordenadorEnviado | E-mail de aceite realizado e enviado ao coordenador/ortogado | solicitacaoDiariaId, alocacaoBolsistaRef, coordenadorRef, emailDestino, dataEnvio |
| RecusaDiariaRegistrada | Bolsista recusa viagem | solicitacaoDiariaId, alocacaoBolsistaRef, dataRecusa, justificativa |
| SolicitacaoDiariaAprovada | Todos os aceites obrigatorios sao assinados ou a diaria e propria do coordenador | solicitacaoDiariaId, valorTotal, transacaoComprometimentoRef |
| SolicitacaoDiariaRemovida | Coordenador remove antes do inicio da viagem | solicitacaoDiariaId, justificativa, transacaoReversaoRef |
| SolicitacaoDiariaRegularizadaNaoUtilizada | Coordenador regulariza diaria nao utilizada apos o inicio previsto | solicitacaoDiariaId, justificativa, transacaoReversaoRef |

## Exemplo - SolicitarDiaria

> Exemplo ilustrativo de roteiro com trecho interno de apoio e trecho internacional. A forma de consumir a rubrica, como diaria unica ou diarias separadas por trecho, depende da decisao do PO registrada na politica de calculo vigente.

```json
{
  "projetoId": "INI-2026-014",
  "ortogadoId": "ORT-2026-001",
  "alocacaoBolsistaRef": "ALO-2026-001",
  "abrangenciaRef": "ABR-2026-003",
  "dataHoraPartida": "2026-06-10T08:00:00-03:00",
  "dataHoraChegada": "2026-06-12T18:00:00-03:00",
  "origem": "Anchieta/ES",
  "destino": "Lisboa/Portugal",
  "roteiroViagem": [
    {
      "ordem": 1,
      "origem": "Anchieta/ES",
      "destino": "Vitoria/ES",
      "tipoTrecho": "APOIO_INTERNO",
      "meioTransporte": "TERRESTRE"
    },
    {
      "ordem": 2,
      "origem": "Vitoria/ES",
      "destino": "Lisboa/Portugal",
      "tipoTrecho": "PRINCIPAL",
      "meioTransporte": "AEREO"
    }
  ],
  "motivo": "Participacao em evento internacional do projeto."
}
```

Resposta esperada:

```json
{
  "solicitacaoDiariaId": "SD-2026-001",
  "estado": "ALOCADA",
  "alocacaoBolsistaRef": "ALO-2026-001",
  "abrangenciaRef": "ABR-2026-003",
  "abrangenciaSnapshot": {
    "codigo": "INTERNACIONAL",
    "nome": "Internacional"
  },
  "tipoDiariaRef": "DIA-2026-003",
  "parametroCalculoDiariaRef": "PCD-2026-003",
  "regraCalculoSnapshot": "Normativa FAPES vigente",
  "roteiroViagemSnapshot": [
    {
      "ordem": 1,
      "origem": "Anchieta/ES",
      "destino": "Vitoria/ES",
      "tipoTrecho": "APOIO_INTERNO",
      "abrangenciaTrecho": "DENTRO_ESTADO"
    },
    {
      "ordem": 2,
      "origem": "Vitoria/ES",
      "destino": "Lisboa/Portugal",
      "tipoTrecho": "PRINCIPAL",
      "abrangenciaTrecho": "INTERNACIONAL"
    }
  ],
  "trechoPrincipalIndice": 1,
  "distanciaKm": null,
  "valorUnitarioDiaria": 620.0,
  "quantidadeDiariasCalculada": 2.5,
  "valorTotalCalculado": 1550.0,
  "rubricaProjetoRef": "RP-DIARIAS-INTERNACIONAL",
  "transacaoComprometimentoRef": "TR-2026-045"
}
```

## Regra de Roteiro

- A solicitacao deve registrar o roteiro da viagem quando houver mais de um trecho logistico.
- **Duvida para PO:** definir se trechos de apoio interno, como deslocamento ate aeroporto ou rodoviaria antes de viagem nacional/internacional, geram diaria separada ou compoem a diaria principal.
- A decisao deve considerar impacto no valor consumido da rubrica e aderencia a normativa FAPES.
- Enquanto a duvida estiver aberta, a API deve retornar `roteiroViagemSnapshot`, `trechoPrincipalIndice` e `memoriaCalculoSnapshot` suficientes para auditar a politica aplicada.

## Fronteira Rubrica x Lancamento x Transacao

| Conceito | Papel no contrato |
|----------|-------------------|
| `RubricaProjeto` | Classifica a diaria no orcamento aprovado e fornece saldo/limite. |
| `Transacao` | Registra comprometimento ou reversao do valor calculado. |
| `TransacaoFinanceira` | Nao faz parte da criacao da diaria; aparece depois, na prestacao/conciliacao do pagamento em M014/M016. |
