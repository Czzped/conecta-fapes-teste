# EPI-09 — Alternancia de Tipo Edital <-> Programa

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |
| **Fonte no codigo** | `app/routers/planilhas.py:switch_resource_kind`, `app/use_cases/switch_resource_kind_use_case.py`, `frontend/src/components/correction/KindSwitchModal.tsx`, migration `migrations/20260402_create_resource_kind_state.sql` |

## Jornada

Durante a correcao, o operador pode descobrir que classificou errado um recurso como `editais` quando na verdade deveria ser `programas` (ou vice-versa). Abre o `KindSwitchModal`, seleciona o novo tipo e marca o checkbox "Tenho certeza" (`confirm: true`). O backend: (1) valida que o recurso esta no tipo atual via `resolve_historico_kind_and_keys`; (2) valida o `lock_token` no kind atual; (3) clona a ultima versao da planilha do S3 para o prefixo do novo kind; (4) atualiza `resource_kind_state.active_kind = target_kind`; (5) registra linha em `resource_kind_switch_log` com `from_kind`, `to_kind`, `cloned_source_key`, `cloned_target_key`, `switched_by`; (6) libera lock antigo e gera novo lock para a nova `resource_key`. Audit em `planilha_version_audit` recebe `action=switch_clone`.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [M002](../../../implementation/modules/M002-importacao-editais/README.md) | Troca de tipo editais/programas | Done |

## User Stories

| ID | User Story |
|----|-----------|
| US-09-01 | Como operador, quero trocar o tipo do recurso de `editais` para `programas` ou inverso. |
| US-09-02 | Como operador, quero confirmar explicitamente a troca (`confirm: true`) para evitar acidentes. |
| US-09-03 | Como sistema, quero clonar a ultima versao da planilha para o novo tipo mantendo historico. |
| US-09-04 | Como sistema, quero migrar o lock atual para a nova `resource_key` sem interromper a sessao. |
| US-09-05 | Como sistema, quero registrar a troca em `resource_kind_switch_log` com origem, destino e ator. |
| US-09-06 | Como sistema, quero registrar `action=switch_clone` em `planilha_version_audit`. |

## Cenarios de aceitacao do produto

- **`POST /recurso-kind/switch`**: body `{edital_id, target_kind, lock_token, confirm: true}`. Sem `confirm` retorna HTTP 400.
- **Validacao de origem**: se o recurso ja estiver no `target_kind`, retorna HTTP 409.
- **Lock obrigatorio**: valida `lock_token` do kind atual; sem lock valido retorna HTTP 403.
- **Clone S3**: `clone_latest_historico_version_between_kinds` copia o objeto para `historicoCorrecoesPlanilhas/` do novo kind, preservando metadados de auditoria (`x-amz-meta-*`).
- **Estado ativo**: `resource_kind_state` (chave unica `edital_id + month_year`) recebe `active_kind = target_kind` e `updated_by = <user_id>`.
- **Log de troca**: `resource_kind_switch_log` recebe linha com `from_kind`, `to_kind`, `cloned_source_key`, `cloned_target_key`, `switched_by`, `created_at`.
- **Migracao de lock**: lock antigo liberado com `reason=kind_switch`; novo `lock_token` retornado na resposta.
- **Auditoria**: evento `switch_clone` em `planilha_version_audit` para a nova versao.
- **Endpoint `GET /recurso-kind`**: retorna tipo ativo e `historico_count`; se existir em ambos, responde HTTP 409 (estado inconsistente para resolucao manual).
