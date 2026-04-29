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
| US-M010-018 | Dashboard Local da Parceria | UC02 | Must | To Do | [EPIC-M010-004 — US-M010-018](parcerias/epics/EPIC-M010-004.md#us-m010-018-dashboard-local-da-parceria) |
| EPIC-M010-003 | Gestao de Programas | UC03 | Must | In Progress | [EPIC-M010-003](programas/epics/EPIC-M010-003.md) |
| EPIC-M010-004 | Dashboard de Parcerias | UC02 | Must | To Do | [EPIC-M010-004](parcerias/epics/EPIC-M010-004.md) |

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
├── US-M010-009 Encerrar Parceria (cascata RI2 + justificativa)         #1744
├── US-M010-010 Registrar Vigencia (Aditivo)                            #1791
├── US-M010-011 Registrar Aditivo de Aporte Financeiro (isAditivo)      #1792
├── US-M010-012 Anexar Documentos a Parceria (Documento/TipoDocumento em M008) #1793
├── US-M010-013 Suspender Parceria em Cascata
├── US-M010-014 Registrar Aporte Financeiro da Parceria em Programa (N:N) #1794
├── US-M010-015 Validar Invariante Temporal Programa/Parceria (RN13)    #1795
├── US-M010-016 Consultar Saldo da Parceria (RN14)                      #1796
├── US-M010-017 Remover Parceria (em caso de erro, RI3)                 #1797
├── US-M010-018 Dashboard Local da Parceria (impactos, investido, aportado, alocado, consumido, disponivel e rubricas)
├── US-M010-031 Calcular Reserva de Acao Transversal da Parceria
└── US-M010-032 Enviar Reserva de Acao Transversal para M016

Issues fechadas (conceitos removidos):
  ├── #1741 Registrar Coordenacao   — Coordenacao removida do dominio M010
  └── #1742 Associar Finalidade     — Finalidade removida de Parceria (permanece em M008)

EPIC-M010-004 (Dashboard de Parcerias)  <- depende de EPIC-M010-002
├── US-M010-019 Dashboard Global de Parcerias (visao de portfolio)
└── US-M010-018 Dashboard Local da Parceria (ref. EPIC-M010-002)

EPIC-M010-003 (Gestao de Programas)  <- depende de EPIC-M010-001
├── US-M010-020 Cadastrar Programa (inclui RN01 e RN16)
├── US-M010-021 Cadastrar Comite de Governanca
├── US-M010-025 Registrar Aditivo de Tempo do Programa
├── US-M010-026 Solicitar Reforco Financeiro do Programa
├── US-M010-027 Retirar Aporte de Parceria do Programa
├── US-M010-028 Suspender Programa
├── US-M010-029 Reativar Programa
├── US-M010-030 Dashboard Global de Programas
├── US-M010-023 Dashboard Local do Programa
└── US-M010-024 Encerrar ou Remover Programa (RI1)
```
