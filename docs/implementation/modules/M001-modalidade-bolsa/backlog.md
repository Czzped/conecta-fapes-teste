# Sub-Backlog: M001 - Modalidades de Bolsas

[← Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

Atualmente, as modalidades, niveis e requisitos de bolsas sao controlados manualmente via planilhas, o que gera inconsistencias frequentes entre as resolucoes publicadas e os dados efetivamente cadastrados. Este modulo visa resolver esse problema ao permitir o cadastro e manutencao de Modalidades, Niveis e Requisitos de Bolsas diretamente vinculados as Resolucoes da agencia de fomento, garantindo integridade e rastreabilidade dos dados. O sucesso sera medido pela reducao de inconsistencias cadastrais e pelo tempo necessario para cadastrar uma nova modalidade.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M001-001 | Cadastro de Resolucoes | UC02 | Must | Done | [EPIC-M001-001](epics/EPIC-M001-001.md) |
| EPIC-M001-002 | Controle de Modalidades de Bolsa | UC01 | Must | Done | [EPIC-M001-002](epics/EPIC-M001-002.md) |
| EPIC-M001-003 | Cadastro de Niveis de Bolsa | UC03 | Must | Done | [EPIC-M001-003](epics/EPIC-M001-003.md) |

---

## Rastreabilidade

```
EPIC-M001-001 (Cadastro de Resolucoes)
├── US-M001-001 Incluir Resolucao
├── US-M001-002 Listar e Consultar Resolucoes
├── US-M001-003 Alterar Resolucao
└── US-M001-004 Excluir Resolucao

EPIC-M001-002 (Controle de Modalidades)  ← depende de EPIC-M001-001
├── US-M001-005 Incluir Modalidade
├── US-M001-006 Listar e Consultar Modalidades
├── US-M001-007 Criar Versao de Modalidade
├── US-M001-008 Alterar Versao da Modalidade
├── US-M001-009 Ativar Versao da Modalidade
├── US-M001-010 Excluir Versao de Modalidade
└── US-M001-011 Desativar Modalidade

EPIC-M001-003 (Cadastro de Niveis)  ← depende de EPIC-M001-001, EPIC-M001-002
├── US-M001-012 Incluir Nivel
├── US-M001-013 Listar e Consultar Niveis
├── US-M001-014 Alterar Nivel
└── US-M001-015 Excluir Nivel
```

