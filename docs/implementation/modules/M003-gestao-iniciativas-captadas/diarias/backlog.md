# Backlog - Diarias da Iniciativa

[← Voltar](README.md)

## Epicos

| ID | Titulo | Regras | Prioridade | Status | Documento |
|----|--------|--------|------------|--------|-----------|
| EPIC-M003-006 | Solicitar Diarias da Iniciativa | RN22-RN33 | Must | To Do | [EPIC-M003-006](epics/EPIC-M003-006.md) |

## Historias

As historias deste backlog cobrem apenas o ciclo da `SolicitacaoDiaria`. Cadastros de `TipoViagem` e `TipoDiaria` pertencem ao M008; movimentacao de saldo pertence ao M013 como `Transacao`; prestacao de contas pertence ao M014.

| ID | Historia | Prioridade | Status |
|----|----------|------------|--------|
| US-M003-021 | Validar referencias externas na criacao da solicitacao de diaria | Must | To Do |
| US-M003-022 | Criar solicitacao de diaria para beneficiarios da iniciativa | Must | To Do |
| US-M003-023 | Associar solicitacao de diaria ao tipo de diaria vigente do tipo de viagem | Must | To Do |
| US-M003-024 | Calcular quantidade e valor da solicitacao de diaria automaticamente | Must | To Do |
| US-M003-025 | Notificar bolsistas para aceite da diaria solicitada | Must | To Do |
| US-M003-026 | Assinar termo de aceite da diaria | Must | To Do |
| US-M003-027 | Validar saldo e comprometer rubrica ao criar solicitacao de diaria | Must | To Do |
| US-M003-028 | Registrar transacao da solicitacao na RubricaProjeto do tipo de viagem | Must | To Do |
| US-M003-029 | Remover solicitacao de diaria alocada/aprovada antes do inicio e gerar reversao | Must | To Do |
| US-M003-030 | Consultar solicitacoes de diaria da iniciativa | Must | To Do |
| US-M003-031 | Concluir solicitacao de diaria automaticamente apos aceite ou quando propria do coordenador | Must | To Do |
| US-M003-032 | Visualizar, aceitar ou recusar diaria pelo bolsista | Must | To Do |
| US-M003-033 | Consultar, filtrar e paginar solicitacoes de diaria no Backoffice | Must | To Do |
| US-M003-035 | Regularizar solicitacao de diaria nao utilizada apos o inicio previsto | Should | To Do |
| US-M003-036 | Notificar bolsista na Home e lateral quando houver solicitacao de diaria pendente de aceite | Must | To Do |
| US-M003-037 | Enviar e-mails sobre solicitacao de diaria pendente e aceite realizado | Must | To Do |

## Rastreabilidade

```text
EPIC-M003-006 (Solicitar Diarias da Iniciativa)
├── US-M003-021 Validar referencias externas na criacao da solicitacao de diaria
├── US-M003-022 Criar solicitacao de diaria para beneficiarios da iniciativa
├── US-M003-023 Associar solicitacao de diaria ao tipo de diaria vigente do tipo de viagem
├── US-M003-024 Calcular quantidade e valor da solicitacao de diaria automaticamente
├── US-M003-025 Notificar bolsistas para aceite da diaria solicitada
├── US-M003-026 Assinar termo de aceite da diaria
├── US-M003-027 Validar saldo e comprometer rubrica ao criar solicitacao de diaria
├── US-M003-028 Registrar transacao da solicitacao na RubricaProjeto do tipo de viagem
├── US-M003-029 Remover solicitacao de diaria alocada/aprovada antes do inicio e gerar reversao
├── US-M003-030 Consultar solicitacoes de diaria da iniciativa
├── US-M003-031 Concluir solicitacao de diaria automaticamente apos aceite ou quando propria do coordenador
├── US-M003-032 Visualizar, aceitar ou recusar diaria pelo bolsista
├── US-M003-033 Consultar, filtrar e paginar solicitacoes de diaria no Backoffice
├── US-M003-035 Regularizar solicitacao de diaria nao utilizada apos o inicio previsto
├── US-M003-036 Notificar bolsista na Home e lateral quando houver solicitacao de diaria pendente de aceite
└── US-M003-037 Enviar e-mails sobre solicitacao de diaria pendente e aceite realizado
```

## Criterios de pronto

- A solicitacao grava `tipoDiariaRef`, `tipoViagemRef` e snapshots de `valorUnitarioDiaria` e `fracaoCalculo` vindos dos cadastros corporativos do M008.
- Os beneficiarios sao validados em M009.
- O aceite registra versao do termo, data/hora, hash e conta bancaria confirmada.
- A criacao com saldo suficiente gera `Transacao` de comprometimento rastreavel, sem aprovacao manual da FAPES.
- Diaria com saldo comprometido e viagem futura fica `ALOCADA` ate aceite, remocao ou aprovacao automatica.
- A remocao antes do inicio gera transacao de reversao rastreavel.
- Rubrica, Transacao e movimento bancario ficam separados: `RubricaProjeto` classifica/limita, `Transacao` altera saldo, `TransacaoFinanceira` concilia pagamento em M014/M016.
- Diaria nao utilizada depois do inicio previsto segue regularizacao com justificativa e auditoria.
- A Home do Front-Office exibe a diaria pendente na secao **Notificacoes** e na lateral de notificacoes para o usuario logado.
- O sistema envia e-mail ao bolsista quando houver diaria aguardando aceite e envia e-mail ao coordenador quando o aceite for registrado.
- M014 consegue referenciar apenas solicitacoes aprovadas e nao canceladas.
- A tela operacional de Diarias no Backoffice possui filtros, paginacao e estado vazio para consultas sem resultado.
