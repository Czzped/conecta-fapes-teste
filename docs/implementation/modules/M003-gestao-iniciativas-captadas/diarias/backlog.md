# Backlog - Diarias da Iniciativa

[← Voltar](README.md)

## Epicos

| ID | Titulo | Regras | Prioridade | Status | Documento |
|----|--------|--------|------------|--------|-----------|
| EPIC-M003-006 | Solicitar Diarias da Iniciativa | RN22-RN33 | Must | To Do | [EPIC-M003-006](epics/EPIC-M003-006.md) |

## Historias

| ID | Historia | Prioridade | Status |
|----|----------|------------|--------|
| US-M003-021 | Cadastrar tipos de diaria com valor, vigencia, fracao de calculo e tipo de viagem | Must | To Do |
| US-M003-022 | Criar solicitacao de diaria para beneficiarios da iniciativa | Must | To Do |
| US-M003-023 | Associar solicitacao ao tipo de diaria vigente do tipo de viagem | Must | To Do |
| US-M003-024 | Calcular quantidade e valor da diaria automaticamente | Must | To Do |
| US-M003-025 | Submeter solicitacao para aceite dos bolsistas | Must | To Do |
| US-M003-026 | Assinar termo de aceite da diaria | Must | To Do |
| US-M003-027 | Aprovar ou rejeitar solicitacao de diaria | Must | To Do |
| US-M003-028 | Gerar debito na rubrica de Diarias e Passagens | Must | To Do |
| US-M003-029 | Cancelar solicitacao de diaria e gerar credito | Must | To Do |
| US-M003-030 | Consultar solicitacoes de diaria da iniciativa | Must | To Do |
| US-M003-031 | Aprovar automaticamente diaria propria do coordenador | Must | To Do |
| US-M003-032 | Visualizar, aceitar ou recusar diaria pelo bolsista | Must | To Do |
| US-M003-033 | Filtrar e paginar diarias no Backoffice | Must | To Do |

## Rastreabilidade

```text
EPIC-M003-006 (Solicitar Diarias da Iniciativa)
├── US-M003-021 Cadastrar tipos de diaria com valor, vigencia, fracao de calculo e tipo de viagem
├── US-M003-022 Criar solicitacao de diaria para beneficiarios da iniciativa
├── US-M003-023 Associar solicitacao ao tipo de diaria vigente do tipo de viagem
├── US-M003-024 Calcular quantidade e valor da diaria automaticamente
├── US-M003-025 Submeter solicitacao para aceite dos bolsistas
├── US-M003-026 Assinar termo de aceite da diaria
├── US-M003-027 Aprovar ou rejeitar solicitacao de diaria
├── US-M003-028 Gerar debito na rubrica de Diarias e Passagens
├── US-M003-029 Cancelar solicitacao de diaria e gerar credito
├── US-M003-030 Consultar solicitacoes de diaria da iniciativa
├── US-M003-031 Aprovar automaticamente diaria propria do coordenador
├── US-M003-032 Visualizar, aceitar ou recusar diaria pelo bolsista
└── US-M003-033 Filtrar e paginar diarias no Backoffice
```

## Criterios de pronto

- A solicitacao grava `tipoDiariaRef`, `tipoViagemRef` e snapshots de `valorUnitarioDiaria` e `fracaoCalculo` vindos do tipo de diaria vigente associado ao tipo de viagem selecionado.
- Os beneficiarios sao validados em M009.
- O aceite registra versao do termo, data/hora, hash e conta bancaria confirmada.
- A aprovacao gera lancamento de debito rastreavel.
- O cancelamento gera lancamento de credito rastreavel.
- M014 consegue referenciar apenas solicitacoes aprovadas e nao canceladas.
- A tela operacional de Diarias no Backoffice possui filtros, paginacao e estado vazio para consultas sem resultado.
