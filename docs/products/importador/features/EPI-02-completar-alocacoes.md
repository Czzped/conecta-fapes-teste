# EPI-02 — Corrigir Planilha do Edital

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |

## Jornada

Apos selecionar um edital, o operador adquire lock exclusivo sobre o recurso (com heartbeat automatico a cada 45 segundos), recebe a planilha XLSX pre-preenchida com dados dos Parquets, datas calculadas (`effective_end`, `MESES_DE_ATIVIDADE`) e contas bancarias atualizadas via `relatorio_beneficiario.json`. Edita na tela com virtual scroll (52px/linha) e validacoes em tempo real, corrige inconsistencias, configura o mapeamento `projeto -> AreaTecnica` e envia a versao corrigida com auditoria completa. Quando necessario, alterna entre os tipos `editais` e `programas` — o sistema clona a planilha mais recente para o tipo alvo.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [EPIC-M002-002](../../../implementation/modules/M002-importacao-editais/epics/EPIC-M002-002.md) | Corrigir Planilha do Edital | Done |

## Cenarios de aceitacao do produto

- **Lock exclusivo com heartbeat**: um operador por vez por `(kind, MM_YYYY, edital_id)`; heartbeat de 45s impede expiracao; takeover de lock expirado e rastreado.
- **Planilha inicial gerada do dump**: 4 fetches S3 paralelos, calculos vetorizados com NumPy, layout com 5 grupos de colunas de nivel.
- **Editor com virtual scroll**: edita editais com 5000+ bolsistas sem perda de performance; datas com `react-datepicker`.
- **Validacao em tempo real**: 9 regras por celula (datas consistentes, tipos corretos, obrigatoriedade).
- **Pre-validacao de upload**: API retorna errors, warnings e diff linha a linha antes do envio definitivo.
- **Versionamento auditado**: cada versao (inicial, upload, clone) gera linha em `planilha_version_audit` com ator e `request_id`.
- **Alternancia de tipo (editais <-> programas)**: clona a planilha mais recente e registra troca em `resource_kind_switch_log`.
- **Mapeamento de programas**: modal virtualizado para associar cada `projeto_id` a uma Area Tecnica e programa; obrigatorio antes de gerar JSONL.
