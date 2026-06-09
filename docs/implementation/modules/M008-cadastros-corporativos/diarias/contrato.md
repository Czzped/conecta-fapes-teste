# Contrato - Diarias (M008)

[M008](../README.md) | [Modelo Estrutural](modelo-estrutural.md) | [Backlog](backlog.md)

## Consumidores

| Consumidor | Uso |
|------------|-----|
| M003 — Gestao de Projetos Captados | Consulta `TipoDiaria` e `ParametroCalculoDiaria` vigentes para calcular `SolicitacaoDiaria` e gravar snapshots imutaveis |

## Operacoes Publicas

| Operacao | Tipo | Entrada | Saida |
|----------|------|---------|-------|
| `buscarTipoDiariaVigente(abrangenciaCodigo, data)` | Query | codigo da abrangencia + data de referencia | `TipoDiaria` ativo com vigencia cobrindo a data |
| `buscarParametroCalculoVigente(tipoDiariaId, data)` | Query | id do TipoDiaria + data de referencia | `ParametroCalculoDiaria` ativo com vigencia cobrindo a data |

**Pre-condicao:** deve existir exatamente um `TipoDiaria` ativo e um `ParametroCalculoDiaria` ativo para a combinacao de abrangencia e data. Se nao houver, M003 bloqueia a criacao da solicitacao.

---

## Seed de Carga Inicial

### Abrangencias

```json
{
  "abrangencias": [
    { "id": "ABR-001", "codigo": "DENTRO_ESTADO", "nome": "Dentro do Estado", "descricao": "Deslocamento dentro do Espirito Santo.", "ativo": true },
    { "id": "ABR-002", "codigo": "NACIONAL",      "nome": "Nacional",         "descricao": "Deslocamento para outros estados do Brasil.", "ativo": true },
    { "id": "ABR-003", "codigo": "INTERNACIONAL", "nome": "Internacional",    "descricao": "Deslocamento para fora do Brasil.", "ativo": true }
  ]
}
```

### Tipos de Diaria

```json
{
  "tiposDiaria": [
    { "id": "DIA-2026-001", "abrangenciaId": "ABR-001", "valorUnitario": 260.00, "vigenciaInicio": "2026-05-01", "vigenciaFim": null, "ativo": true },
    { "id": "DIA-2026-002", "abrangenciaId": "ABR-002", "valorUnitario": 320.00, "vigenciaInicio": "2026-05-01", "vigenciaFim": null, "ativo": true },
    { "id": "DIA-2026-003", "abrangenciaId": "ABR-003", "valorUnitario": 620.00, "vigenciaInicio": "2026-05-01", "vigenciaFim": null, "ativo": true }
  ]
}
```

### Parametros de Calculo

```json
{
  "parametrosCalculoDiaria": [
    {
      "id": "PCD-2026-001",
      "tipoDiariaId": "DIA-2026-001",
      "normaReferencia": "Decreto ES no 5533-R/2023",
      "horasMinimasSemPernoite": 6,
      "percentualDiariaSemPernoite": 0.5,
      "horaLimiteRetornoAcrescimo": 14,
      "percentualAcrescimoRetorno": 0.5,
      "distanciaMinimaKm": 150,
      "bloqueiaRegiaoMetropolitanaSemPernoite": true,
      "bloqueiaMunicipioLimitrofeSemPernoite": true,
      "estadoOrigemValido": "ES",
      "percentualComplementoTransporte": null,
      "vigenciaInicio": "2026-05-01",
      "vigenciaFim": null,
      "ativo": true
    },
    {
      "id": "PCD-2026-002",
      "tipoDiariaId": "DIA-2026-002",
      "normaReferencia": "Decreto ES no 5533-R/2023",
      "horasMinimasSemPernoite": 6,
      "percentualDiariaSemPernoite": 0.5,
      "horaLimiteRetornoAcrescimo": 14,
      "percentualAcrescimoRetorno": 0.5,
      "distanciaMinimaKm": null,
      "bloqueiaRegiaoMetropolitanaSemPernoite": false,
      "bloqueiaMunicipioLimitrofeSemPernoite": false,
      "estadoOrigemValido": "ES",
      "percentualComplementoTransporte": 0.2,
      "vigenciaInicio": "2026-05-01",
      "vigenciaFim": null,
      "ativo": true
    },
    {
      "id": "PCD-2026-003",
      "tipoDiariaId": "DIA-2026-003",
      "normaReferencia": "Decreto ES no 5533-R/2023",
      "horasMinimasSemPernoite": 6,
      "percentualDiariaSemPernoite": 0.5,
      "horaLimiteRetornoAcrescimo": 14,
      "percentualAcrescimoRetorno": 0.5,
      "distanciaMinimaKm": null,
      "bloqueiaRegiaoMetropolitanaSemPernoite": false,
      "bloqueiaMunicipioLimitrofeSemPernoite": false,
      "estadoOrigemValido": "ES",
      "percentualComplementoTransporte": 0.2,
      "vigenciaInicio": "2026-05-01",
      "vigenciaFim": null,
      "ativo": true
    }
  ]
}
```
