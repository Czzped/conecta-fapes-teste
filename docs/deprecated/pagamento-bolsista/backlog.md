# Backlog de Epicos — ConectaFapes Backend Pagamento Bolsistas

> **Documento depreciado.** A documentacao canonica deste modulo migrou para [implementation/modules/M004-pagamento-bolsista/](../../implementation/modules/M004-pagamento-bolsista/README.md). Este documento e mantido como referencia historica. Ver [ADR-006](../../architecture/adr/ADR-006-reconciliacao-m004-pagamento-bolsista.md).

> Versao: 2026-04-09

| ID    | Titulo                                              | Bounded Context                  | Status | Detalhes |
|-------|-----------------------------------------------------|----------------------------------|--------|----------|
| EP-01 | Gestao de Calendario e Plano Mensal                 | Planejamento                     | Done   | [EP-01](features/ep-01-calendario-plano-mensal.md) |
| EP-02 | Cadastro Base (CRUDs)                               | Infraestrutura                   | Done   | [EP-02](features/ep-02-cadastro-base.md) |
| EP-03 | Alocacao de Bolsistas                               | Alocacao                         | Done   | [EP-03](features/ep-03-alocacao-bolsistas.md) |
| EP-04 | Gestao de Bolsistas                                 | Gestao de Bolsistas              | Done   | [EP-04](features/ep-04-gestao-bolsistas.md) |
| EP-05 | Pagamento de Bolsistas                              | Pagamento                        | Done   | [EP-05](features/ep-05-pagamento-bolsistas.md) |
| EP-06 | Bonus de Pagamento                                  | Pagamento                        | Done   | [EP-06](features/ep-06-bonus-pagamento.md) |
| EP-07 | Liberacao de Editais por Competencia                | Liberacao                        | Done   | [EP-07](features/ep-07-edital-competencia.md) |
| EP-08 | Geracao e Gestao de Folhas de Pagamento             | Folha de Pagamento               | Done   | [EP-08](features/ep-08-folha-pagamento.md) |
| EP-09 | Geracao de Remessas Bancarias                       | Remessa                          | Done   | [EP-09](features/ep-09-remessa-bancaria.md) |
| EP-10 | Processamento de Retorno Bancario                   | Remessa                          | Done   | [EP-10](features/ep-10-retorno-bancario.md) |
| EP-11 | Encaminhamento de Pagamento (Bandes)                | Pagamento                        | Done   | [EP-11](features/ep-11-encaminhar-pagamento.md) |
| EP-12 | Guia de Liberacao (PDF)                             | Documentos                       | Done   | [EP-12](features/ep-12-guia-liberacao.md) |
| EP-13 | Relatorios e Relacoes de Pagamento                  | Documentos                       | Done   | [EP-13](features/ep-13-relatorios-relacoes.md) |
| EP-14 | Monitoramento de Processos de Remessa               | Remessa                          | Done   | [EP-14](features/ep-14-processo-remessa.md) |
| EP-15 | Visualizacoes e Consultas                           | Consultas                        | Done   | [EP-15](features/ep-15-visualizacoes-consultas.md) |

## Grafo de Dependencias

```
EP-01 (Calendario e Plano Mensal)
  └── EP-02 (Cadastro Base)
        ├── EP-03 (Alocacao de Bolsistas)
        │     ├── EP-04 (Gestao de Bolsistas)
        │     │     └── EP-05 (Pagamento de Bolsistas)
        │     └── EP-06 (Bonus de Pagamento)
        └── EP-07 (Liberacao de Editais por Competencia)

EP-03 + EP-06 + EP-07 → EP-08 (Folha de Pagamento)
  ├── EP-09 (Remessas Bancarias)
  │     ├── EP-10 (Retorno Bancario)
  │     └── EP-14 (Processo de Remessa)
  ├── EP-11 (Encaminhar Pagamento Bandes)
  ├── EP-12 (Guia de Liberacao)
  └── EP-13 (Relatorios e Relacoes)

EP-15 (Visualizacoes e Consultas) — transversal, depende de multiplos epicos
```
