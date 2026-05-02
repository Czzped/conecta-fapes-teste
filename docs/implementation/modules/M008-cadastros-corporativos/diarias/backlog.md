# Backlog - Diarias

[M008](../README.md) | [Modelo Estrutural](modelo-estrutural.md)

## EPICs

| ID | Titulo | Prioridade | Status | Documento |
|----|--------|------------|--------|-----------|
| EPIC-M008-005 | Gestao Corporativa de Diarias | Must | To Do | [EPIC-M008-005](epics/EPIC-M008-005.md) |

## Historias

| ID | Historia | Prioridade | Status | Observacao |
|----|----------|------------|--------|------------|
| US-M008-021 | Gerenciar valores vigentes de diaria por abrangencia | Must | To Do | Mantem abrangencia, valor unitario e vigencia |
| US-M008-022 | Gerenciar abrangencias de diaria | Must | To Do | Mantem codigo, nome, descricao e situacao ativa/inativa |
| US-M008-023 | Bloquear vigencias sobrepostas para a mesma abrangencia | Must | To Do | Garante apenas um valor vigente por data de referencia |
| US-M008-024 | Consultar diaria e parametros vigentes para consumo do M003 | Must | To Do | Retorna TipoDiaria, abrangencia e ParametroCalculoDiaria vigente vinculado ao tipo |
| US-M008-025 | Ativar e inativar valores de diaria preservando historico | Should | To Do | Inativos nao aparecem em novas solicitacoes, mas seguem consultaveis |
| US-M008-026 | Auditar alteracoes dos cadastros de diaria | Should | To Do | Registra usuario, data, antes/depois e justificativa quando aplicavel |
| US-M008-027 | Gerenciar parametros normativos de calculo de diaria | Must | To Do | Mantem percentuais, limites, bloqueios, norma e vigencia vinculados ao TipoDiaria |

## Rastreabilidade

| Historia | Entidade principal | Regras relacionadas | Consumidor |
|----------|--------------------|---------------------|------------|
| US-M008-021 | TipoDiaria | RN22, RN23 | M003 |
| US-M008-022 | Abrangencia | RN22 | M003 |
| US-M008-023 | TipoDiaria | RN23 | M003 |
| US-M008-024 | TipoDiaria | RN22, RN23 | M003 |
| US-M008-025 | TipoDiaria | RN22, RN23 | Back-office, M003 |
| US-M008-026 | TipoDiaria | RN22, RN23 | Auditoria interna |
| US-M008-027 | ParametroCalculoDiaria | RN24 | M003 |

## Observacoes de Escopo

- O contexto Diarias pertence ao M008 e fica em **Configuracoes > Referencias Corporativas > Diarias**.
- M003 nao cadastra valor de diaria; apenas consulta o cadastro vigente pela abrangencia e grava snapshot na solicitacao.
- A abrangencia da viagem e classe corporativa de referencia, mantida no M008.
- Os parametros normativos de calculo pertencem ao M008, ficam vinculados ao `TipoDiaria` e sao consumidos pelo M003 no momento da solicitacao.
- Alteracoes posteriores em valor, abrangencia ou parametros normativos nao alteram solicitacoes ja criadas.
