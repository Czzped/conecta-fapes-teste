# Contrato - Aditivos da Iniciativa

[← Voltar](README.md)

## Consultas

| Consulta | Descricao |
|----------|-----------|
| `ConsultarVigenciaEAditivosIniciativa` | Retorna vigencia, dados originais e lista de aditivos da iniciativa |
| `ListarAditivosIniciativa` | Retorna apenas os aditivos vinculados a iniciativa |

## Payload consultivo

```json
{
  "iniciativaId": "INI-2026-001",
  "dataAprovacaoOriginal": "2024-02-20",
  "dataInicio": "2024-03-01",
  "dataFimOriginal": "2026-02-28",
  "dataFimVigente": "2026-08-31",
  "orcamentoOriginal": 1250000.00,
  "possuiAditivoTempo": true,
  "possuiAditivoFinanceiro": true,
  "valorAditivadoTotal": 250000.00,
  "aditivos": []
}
```

## Eventos consumidos

| Evento | Origem | Uso |
|--------|--------|-----|
| `IniciativaContratada` | M022 | Registrar dados originais de aprovacao, vigencia e orcamento |
| `AditivoIniciativaAprovado` | M010/M022 | Atualizar read model de vigencia e aditivos |
| `AditivoIniciativaCancelado` | M010/M022 | Atualizar situacao consultiva do aditivo |

## Eventos publicados

Este subfluxo e predominantemente consultivo. Nao publica eventos obrigatorios.
