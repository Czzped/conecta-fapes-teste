# Contrato API - Aditivos da Iniciativa

[← Voltar](README.md)

## Consultar vigencia e aditivos

```http
GET /api/m003/iniciativas/{iniciativaId}/vigencia-aditivos
```

### Resposta 200

```json
{
  "iniciativaId": "INI-2026-001",
  "dataAprovacaoOriginal": "2024-02-20",
  "dataInicio": "2024-03-01",
  "dataFimOriginal": "2026-02-28",
  "dataFimVigente": "2026-08-31",
  "orcamentoOriginal": 1250000.00,
  "possuiAditivoTempo": true,
  "diasAditados": 184,
  "possuiAditivoFinanceiro": true,
  "valorAditivadoTotal": 250000.00,
  "aditivos": [
    {
      "id": "TA-2026-014",
      "tipo": "TEMPO_E_FINANCEIRO",
      "situacao": "APROVADO",
      "dataFormalizacao": "2026-02-15",
      "dataFimAnterior": "2026-02-28",
      "dataFimAditada": "2026-08-31",
      "valorAditivado": 250000.00,
      "documentoReferencia": "Termo Aditivo 014/2026",
      "observacao": "Prorrogacao de vigencia e suplementacao financeira."
    }
  ]
}
```

## Listar aditivos

```http
GET /api/m003/iniciativas/{iniciativaId}/aditivos
```

### Resposta 200

```json
[
  {
    "id": "TA-2026-014",
    "tipo": "TEMPO_E_FINANCEIRO",
    "situacao": "APROVADO",
    "dataFormalizacao": "2026-02-15",
    "impactoPrazo": {
      "dataFimAnterior": "2026-02-28",
      "dataFimAditada": "2026-08-31",
      "diasAditados": 184
    },
    "impactoFinanceiro": {
      "valorAditivado": 250000.00
    },
    "documentoReferencia": "Termo Aditivo 014/2026"
  }
]
```
