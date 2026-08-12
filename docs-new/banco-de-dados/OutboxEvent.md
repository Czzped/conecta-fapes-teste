---
title: OutboxEvent
tipo: tabela
---

# OutboxEvent

## Colunas

| Coluna | Tipo |
|---|---|
| Id | Guid |
| AggregateId | string |
| AggregateType | string |
| Attempts | int |
| EventType | int |
| IdempotencyKey | string |
| LastError | string |
| MaxAttempts | int |
| NextAttemptAt | DateTimeOffset? |
| PayloadJson | string |
| ProcessedAt | DateTimeOffset? |
| StartedAt | DateTimeOffset? |
| Status | int |
| DateCreated | DateTimeOffset |
| DateDeleted | DateTimeOffset? |
| DateUpdated | DateTimeOffset? |
