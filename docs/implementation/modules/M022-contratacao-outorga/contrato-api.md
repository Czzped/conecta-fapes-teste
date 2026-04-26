# Contrato API - M022 Contratacao e Outorga

Base sugerida: `/api/v1/m022`

| Metodo | Path | Operacao | Descricao |
|--------|------|----------|-----------|
| GET | `/captacoes/{captacaoId}/propostas-aprovadas` | ListarPropostasAprovadas | Lista propostas aprovadas no resultado final |
| POST | `/contratacoes-outorgas` | ConvocarPropostaAprovada | Cria contratacao/outorga em convocacao |
| POST | `/contratacoes-outorgas/{id}/conferencia-final` | ConferirRequisitosFinais | Registra conferencia de requisitos finais |
| POST | `/contratacoes-outorgas/{id}/formalizar` | FormalizarContratacaoOutorga | Formaliza contratacao/outorga |
| POST | `/contratacoes-outorgas/{id}/cancelar` | CancelarContratacaoOutorga | Cancela contratacao/outorga |
| POST | `/contratacoes-outorgas/{id}/encaminhar-m003` | EncaminharIniciativaParaM003 | Encaminha iniciativa para registro no M003 |

## Exemplo: Convocar Proposta Aprovada

```json
{
  "captacaoId": "CAP-2026-001",
  "propostaId": "PROP-2026-100",
  "resultadoFinalId": "RES-2026-001"
}
```

## Exemplo: Formalizar Contratacao/Outorga

```json
{
  "contratacaoOutorgaId": "CO-2026-001",
  "outorgado": {
    "pessoaFisicaId": "PF-2026-010"
  },
  "termo": {
    "numero": "TO-2026-001",
    "dataAssinatura": "2026-08-15",
    "linkDocumento": "https://documentos.fapes/to-2026-001"
  }
}
```
