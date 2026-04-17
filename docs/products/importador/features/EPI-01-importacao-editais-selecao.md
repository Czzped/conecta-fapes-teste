# EPI-01 — Listar e Selecionar Editais do SIGFAPES

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |

## Jornada

O operador se autentica com email e senha no Supabase Auth, acessa a lista de editais do dump SIGFAPES mais recente, filtra por numero ou titulo, ordena por "Novos" (badge automatico para editais cadastrados nos ultimos 60 dias) ou por data, identifica quais editais ja estao sendo editados por outros operadores via indicador de lock ativo e seleciona o edital para abrir o fluxo de correcao.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [EPIC-M002-001](../../../implementation/modules/M002-importacao-editais/epics/EPIC-M002-001.md) | Listar e Selecionar Editais do SIGFAPES | Done |

## Cenarios de aceitacao do produto

- **Login com Supabase Auth**: email e senha validos retornam cookies HttpOnly e redirecionam para `/editais-latest`.
- **Listagem do dump mais recente**: cards exibem numero, titulo, data de cadastro e contagem de bolsistas.
- **Flag "Novo" automatica**: editais com `edital_data_cadastro` nos ultimos 60 dias recebem badge verde.
- **Status de lock em tempo real**: polling exibe qual operador esta editando cada edital e bloqueia abertura para terceiros.
- **Filtro por texto e ordenacao**: busca incremental por numero/titulo; ordenacao por data, contagem ou prioridade "Novos".
- **Indicacao de planilha existente**: cards mostram versao mais recente e data do ultimo upload quando ha correcao em andamento.
