# Backlog de Epicos — ConectaFapes Prestacao de Contas

> **Documento depreciado.** A documentacao canonica deste modulo migrou para [implementation/modules/M014-prestacao-contas/backlog.md](../../implementation/modules/M014-prestacao-contas/backlog.md). As features em `feature/` correspondem aos EPICs EPIC-M014-001 a EPIC-M014-008.

> Versao: 2026-04-10

| ID    | Titulo                                          | Bounded Context         | Status | Detalhes |
|-------|-------------------------------------------------|-------------------------|--------|----------|
| EP-01 | Gestao de Contas Bancarias                      | Financeiro              | Done   | [feature/ep-01](feature/ep-01-gestao-contas-bancarias.md) |
| EP-02 | Gestao de Orcamento                             | Financeiro              | Done   | [feature/ep-02](feature/ep-02-gestao-orcamento.md) |
| EP-03 | Gestao de Contas Contabeis                      | Financeiro              | Done   | [feature/ep-03](feature/ep-03-gestao-contas-contabeis.md) |
| EP-04 | Gestao de Transacoes Financeiras                | Financeiro              | Done   | [feature/ep-04](feature/ep-04-gestao-transacoes-financeiras.md) |
| EP-05 | Gestao de Prestacao de Contas                   | Prestacao de Contas     | Done   | [feature/ep-05](feature/ep-05-gestao-prestacao-de-contas.md) |
| EP-06 | Justificativas de Despesa por NF                | Comprovacao de Despesas | Done   | [feature/ep-06](feature/ep-06-justificativas-despesa-nf.md) |
| EP-07 | Justificativas de Despesa por Diaria            | Comprovacao de Despesas | Done   | [feature/ep-07](feature/ep-07-justificativas-despesa-diaria.md) |
| EP-08 | Justificativas de Despesa por Invoice           | Comprovacao de Despesas | Done   | [feature/ep-08](feature/ep-08-justificativas-despesa-invoice.md) |
| EP-09 | Documentos Fiscais e Integracao SERPRO           | Comprovacao de Despesas | Done   | [feature/ep-09](feature/ep-09-documentos-fiscais-e-integracao-serpro.md) |
| EP-10 | Itens de Documento Fiscal                       | Comprovacao de Despesas | Done   | [feature/ep-10](feature/ep-10-itens-documento-fiscal.md) |
| EP-11 | Orcamentos de Fornecedor                        | Comprovacao de Despesas | Done   | [feature/ep-11](feature/ep-11-orcamentos-fornecedor.md) |
| EP-12 | Fluxo de Submissao e Analise                    | Prestacao de Contas     | Done   | [feature/ep-12](feature/ep-12-fluxo-submissao-e-analise.md) |

## Grafo de Dependencias

```
EP-01 (Contas Bancarias) — independente
EP-02 (Orcamento) — independente

EP-01
  └── EP-04 (Transacoes Financeiras)
        └── EP-05 (Prestacao de Contas)
              ├── EP-06 (Justificativa NF)
              │     └── EP-09 (Documentos Fiscais + SERPRO)
              ├── EP-07 (Justificativa Diaria)
              └── EP-08 (Justificativa Invoice)

EP-02
  └── EP-03 (Contas Contabeis)

EP-09 + EP-03 → EP-10 (Itens Documento Fiscal)

EP-06 + EP-07 + EP-08 → EP-11 (Orcamentos Fornecedor)

EP-05 + EP-06 + EP-07 + EP-08 + EP-09 + EP-10 → EP-12 (Fluxo Submissao e Analise)
```
