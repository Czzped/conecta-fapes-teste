# Sub-Backlog: M021 - Gestao de Formularios

[Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

O M021 oferece uma base central de formularios reutilizaveis e versionados para uso pelos demais modulos.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M021-001 | Cadastro e Classificacao de Formularios | RN01, RN08 | Must | To Do | [EPIC-M021-001](epics/EPIC-M021-001.md) |
| EPIC-M021-002 | Versionamento e Publicacao de Formularios | RN02-RN05, RN09, RN10 | Must | To Do | [EPIC-M021-002](epics/EPIC-M021-002.md) |
| EPIC-M021-003 | Modelagem de Campos e Regras | RN05-RN07 | Must | To Do | [EPIC-M021-003](epics/EPIC-M021-003.md) |
| EPIC-M021-004 | Consulta e Selecao de Formularios por Modulos | RN09 | Must | To Do | [EPIC-M021-004](epics/EPIC-M021-004.md) |

---

## Rastreabilidade

```text
EPIC-M021-001 (Cadastro e Classificacao de Formularios)
|-- US-M021-001 Criar formulario
|-- US-M021-002 Classificar formulario
`-- US-M021-003 Inativar formulario

EPIC-M021-002 (Versionamento e Publicacao de Formularios)
|-- US-M021-004 Criar versao de formulario
|-- US-M021-005 Publicar versao de formulario
`-- US-M021-006 Criar nova versao a partir de versao publicada

EPIC-M021-003 (Modelagem de Campos e Regras)
|-- US-M021-007 Criar secoes do formulario
|-- US-M021-008 Criar campos do formulario
`-- US-M021-009 Configurar obrigatoriedade e regras condicionais

EPIC-M021-004 (Consulta e Selecao de Formularios por Modulos)
|-- US-M021-010 Listar formularios ativos por classificacao
`-- US-M021-011 Consultar versao publicada do formulario
```
