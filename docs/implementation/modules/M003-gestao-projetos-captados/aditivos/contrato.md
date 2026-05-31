# Contrato - Aditivos da Projeto

[← Voltar](README.md)

## Consultas

| Consulta | Descricao |
|----------|-----------|
| `ConsultarVigenciaEAditivosProjeto` | Retorna vigencia, dados originais e lista de aditivos da projeto |
| `ListarAditivosProjeto` | Retorna apenas os aditivos vinculados a projeto |

## Payload consultivo

```json
{
  "projetoId": "INI-2026-001",
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
| `ProjetoContratada` | M022 | Registrar dados originais de aprovacao, vigencia e orcamento |
| `AditivoProjetoAprovado` | M010/M022 | Atualizar read model de vigencia e aditivos |
| `AditivoProjetoCancelado` | M010/M022 | Atualizar situacao consultiva do aditivo |

## Eventos publicados

Este subfluxo e predominantemente consultivo. Nao publica eventos obrigatorios.
