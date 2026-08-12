---
title: Edital
tipo: tabela
aliases: [edital]
---

# Edital

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| AnaliseDeVoluntario | bool |
| DataCriacao | DateTimeOffset |
| DataUltimaSincronizacao | DateTimeOffset? |
| EditalAreaTecnicaId | Guid? |
| EditalAtividadeId | Guid? |
| IdSigfapes | int? |
| InscricaoGenerica | string |
| Nome | string |
| NomeEditalSigfapes | string |
| NumeroProcessoPagamento | string |
| PermitePagamentoAvancado | bool |
| PermiteSolicitarBolsa | bool |
| Processo | string |
| Status | int |
| StatusImportacao | int |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |

## Relacionamentos (chaves estrangeiras)

- [[AreaTecnica]]
- [[Atividade]]
