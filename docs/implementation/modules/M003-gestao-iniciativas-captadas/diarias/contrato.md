# Contrato - Diarias da Iniciativa

[← Voltar](README.md)

## Comandos

| Operacao | Tipo | Descricao | Entrada | Saida | Regras |
|----------|------|-----------|---------|-------|--------|
| SolicitarDiaria | Command | Criar solicitacao para um ou mais beneficiarios, validar saldo, gerar comprometimento/alocacao e notificar bolsistas quando houver aceite pendente | iniciativaId, ortogadoId, tipoViagemRef, partida, chegada, destino, motivo, beneficiarios | SolicitacaoDiaria em ALOCADA ou APROVADA | RN22-RN28 |
| AssinarTermoAceiteDiaria | Command | Registrar aceite do bolsista | beneficiarioDiariaId, contaBancariaConfirmada | Termo assinado | RN26 |
| RecusarTermoAceiteDiaria | Command | Registrar recusa do bolsista | beneficiarioDiariaId, justificativa | Termo recusado e solicitacao recusada quando aplicavel | RN26 |
| RemoverSolicitacaoDiaria | Command | Remover diaria alocada ou aprovada com justificativa antes do inicio da viagem | solicitacaoDiariaId, justificativa | Solicitacao cancelada e transacao de reversao quando aplicavel | RN32-RN33 |
| RegularizarDiariaNaoUtilizada | Command | Regularizar diaria que nao foi utilizada apos o inicio previsto | solicitacaoDiariaId, justificativa | Solicitacao regularizada e transacao de reversao quando aplicavel | RN32-RN33 |

## Consultas

| Operacao | Tipo | Descricao | Entrada | Saida |
|----------|------|-----------|---------|-------|
| ConsultarSolicitacoesDiaria | Query | Listar solicitacoes da iniciativa | iniciativaId, busca, estado, periodoPartida, pagina, tamanhoPagina | Lista paginada de SolicitacaoDiaria |
| ConsultarSolicitacaoDiaria | Query | Consultar detalhe da solicitacao | solicitacaoDiariaId | Solicitacao, beneficiarios, termos e lancamentos |

> `ConsultarTiposViagem` e `ConsultarTipoDiariaVigente` pertencem ao contrato do M008. O M003 consome essas consultas como dependencia externa antes de criar a solicitacao.

## Eventos

| Evento | Quando ocorre | Payload minimo |
|--------|---------------|----------------|
| SolicitacaoDiariaAlocada | Coordenador cria solicitacao com saldo disponivel antes do inicio da viagem | solicitacaoDiariaId, iniciativaId, tipoViagemRef, tipoDiariaRef, valorUnitarioDiaria, rubricaProjetoRef, transacaoComprometimentoRef |
| NotificacaoAceiteDiariaPendenteCriada | Existe diaria pendente de aceite para bolsista beneficiario | solicitacaoDiariaId, beneficiarioDiariaId, pessoaFisicaRef, iniciativaId, destino, partida |
| EmailAceiteDiariaPendenteEnviado | E-mail de diaria pendente e enviado ao bolsista | solicitacaoDiariaId, beneficiarioDiariaId, pessoaFisicaRef, emailDestino, dataEnvio |
| TermoAceiteDiariaAssinado | Bolsista assina termo | beneficiarioDiariaId, pessoaFisicaRef, dataAssinatura |
| EmailAceiteDiariaCoordenadorEnviado | E-mail de aceite realizado e enviado ao coordenador/ortogado | solicitacaoDiariaId, beneficiarioDiariaId, coordenadorRef, emailDestino, dataEnvio |
| TermoAceiteDiariaRecusado | Bolsista recusa viagem/termo | beneficiarioDiariaId, pessoaFisicaRef, dataRecusa, justificativa |
| SolicitacaoDiariaAprovada | Todos os aceites obrigatorios sao assinados ou a diaria e propria do coordenador | solicitacaoDiariaId, valorTotal, transacaoComprometimentoRef |
| SolicitacaoDiariaRemovida | Coordenador remove antes do inicio da viagem | solicitacaoDiariaId, justificativa, transacaoReversaoRef |
| SolicitacaoDiariaRegularizadaNaoUtilizada | Coordenador regulariza diaria nao utilizada apos o inicio previsto | solicitacaoDiariaId, justificativa, transacaoReversaoRef |

## Exemplo - SolicitarDiaria

```json
{
  "iniciativaId": "INI-2026-014",
  "ortogadoId": "ORT-2026-001",
  "tipoViagemRef": "TVI-001",
  "dataHoraPartida": "2026-06-10T08:00:00-03:00",
  "dataHoraChegada": "2026-06-12T18:00:00-03:00",
  "destino": "Vitoria/ES",
  "motivo": "Participacao em reuniao tecnica do projeto.",
  "beneficiarios": [
    { "alocacaoBolsistaRef": "ALO-2026-001" },
    { "alocacaoBolsistaRef": "ALO-2026-002" }
  ]
}
```

Resposta esperada:

```json
{
  "solicitacaoDiariaId": "SD-2026-001",
  "estado": "ALOCADA",
  "tipoViagemRef": "TVI-001",
  "tipoViagemSnapshot": "Dentro do Estado - Nacional",
  "tipoDiariaRef": "DIA-2026-001",
  "fracaoCalculoSnapshot": "12H",
  "regraCalculoSnapshot": "Normativa FAPES vigente",
  "valorUnitarioDiaria": 260.0,
  "quantidadeDiariasCalculada": 2.5,
  "valorTotalCalculado": 1300.0,
  "rubricaProjetoRef": "RP-DIARIAS",
  "transacaoComprometimentoRef": "TR-2026-045"
}
```

## Fronteira Rubrica x Lancamento x Transacao

| Conceito | Papel no contrato |
|----------|-------------------|
| `RubricaProjeto` | Classifica a diaria no orcamento aprovado e fornece saldo/limite. |
| `Transacao` | Registra comprometimento ou reversao do valor calculado. |
| `TransacaoFinanceira` | Nao faz parte da criacao da diaria; aparece depois, na prestacao/conciliacao do pagamento em M014/M016. |
