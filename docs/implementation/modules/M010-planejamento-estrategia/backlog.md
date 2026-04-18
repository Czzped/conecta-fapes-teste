# Sub-Backlog: M010 - Planejamento e Estrategia

[<< Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

Planejamento estrategico, parcerias e programas sao gerenciados de forma isolada. Este modulo centraliza a gestao do plano estrategico, parcerias institucionais (com aportes, Vigencias e Documentos regularizadores) e programas de fomento (com Instituicao demandante).

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M010-001 | Gestao do Plano Estrategico | UC01 | Must | To Do | [EPIC-M010-001](planejamento/epics/EPIC-M010-001.md) |
| EPIC-M010-002 | Gestao de Parcerias | UC02 | Must | In Progress | [EPIC-M010-002](parcerias/epics/EPIC-M010-002.md) / [GitHub #1724](https://github.com/leds-conectafapes/conectafapes-project/issues/1724) |
| EPIC-M010-003 | Gestao de Programas | UC03 | Must | In Progress | [EPIC-M010-003](programas/epics/EPIC-M010-003.md) |

---

## Rastreabilidade

```
EPIC-M010-001 (Gestao do Plano Estrategico)
├── US-M010-001 Cadastrar Plano Estrategico
├── US-M010-002 Cadastrar Eixo Estrategico
└── US-M010-003 Dashboard de Plano Estrategico

EPIC-M010-002 (Gestao de Parcerias)  GitHub: #1724
├── US-M010-004 Cadastrar e Formalizar Parceria (com Vigencia original) #1739
├── US-M010-005 Registrar Aporte Financeiro (Instituicao→Parceria)      #1740
├── US-M010-008 Listar e Consultar Parcerias                            #1743
├── US-M010-009 Encerrar Parceria                                       #1744
├── US-M010-010 Registrar Vigencia (Aditivo)
├── US-M010-011 Registrar Aditivo de Aporte Financeiro (isAditivo)
├── US-M010-012 Anexar Documentos a Parceria (Documento/TipoDocumento em M008)
├── US-M010-014 Registrar Aporte Financeiro da Parceria em Programa
├── US-M010-015 Validar Invariante Temporal Programa/Parceria (RN13)
├── US-M010-016 Consultar Saldo da Parceria (RN14)
└── US-M010-017 Remover Parceria (em caso de erro) (RI3)

EPIC-M010-003 (Gestao de Programas)  <- depende de EPIC-M010-001
├── US-M010-020 Cadastrar Programa (inclui validacao RN13)
├── US-M010-021 Cadastrar Comite de Governanca
├── US-M010-022 Registrar Recursos do Programa (fontes internas)
├── US-M010-023 Dashboard de Programas
└── US-M010-024 Remover Programa (RI1)
```
