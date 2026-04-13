# Workflow: Documentacao de Modulo

Workflow para criar ou atualizar a documentacao de um modulo do Conecta FAPES. Seguir os steps **em ordem**.

Referencia canonica: `/docs/modules/M001-modalidade-bolsa/`

---

## Step 1: README.md (Dominio + Regras)

Create `/docs/modules/{M00x-name}/README.md`

Este e o documento ancora do modulo. Toda informacao de dominio e regras de negocio vive aqui. Os outros documentos linkam para ca.

```markdown
# M00x - [Nome do Modulo]

[← Voltar ao Backlog Central](../../backlog-product.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida das entidades |

---

## Sobre o Modulo

[Texto corrido: dor do cliente → capacidade → KPI de sucesso]

---

## Dominio

[Texto corrido descrevendo o minimundo: entidades, relacoes, exemplos concretos]

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | ... | Must |
| RI1 | ... | Must |
```

**Principio**: README e a unica fonte de verdade para dominio e regras. Todos os outros documentos linkam para ca.

---

## Step 2: EPICs com User Stories em Gherkin

Create `/docs/modules/{M00x-name}/epics/EPIC-M00x-NNN.md`

Cada EPIC contem suas User Stories com cenarios Gherkin. Nao criar arquivos separados de US.

```markdown
# EPIC-M00x-NNN: [Titulo]

[← Voltar ao Sub-Backlog](../backlog.md)

## Contexto

[Por que este EPIC existe — dor, impacto, motivacao]

## Objetivo

[1-2 frases do que o EPIC entrega]

## Regras de Negocio

RNxx, RNyy — ver [Regras de Negocio](../README.md#regras-de-negocio)

## Dependencias

- **Depende de**: [EPICs ou modulos]
- **Habilita**: [EPICs ou modulos]

## User Stories

| ID | Titulo | Prioridade | Status |
|----|--------|------------|--------|

---

### US-M00x-NNN: [Titulo]

Como [persona],
quero [acao],
para que [valor].

\```gherkin
Funcionalidade: [Nome]

  Cenario: [Nome do cenario]
    Dado que [precondição]
    Quando [acao]
    Entao [resultado esperado]
\```
```

---

## Step 3: Backlog do Modulo

Create `/docs/modules/{M00x-name}/backlog.md`

Indexa os EPICs e mostra a rastreabilidade EPIC → US.

```markdown
# Sub-Backlog: M00x - [Nome]

[← Voltar ao Backlog Central](../../backlog-product.md)

## Sobre o Modulo

[Mesmo texto do README — dor → capacidade → KPI]

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Prioridade | Status | Documento |
|----|--------|------------|--------|-----------|
| EPIC-M00x-001 | ... | Must | To Do | [link](epics/EPIC-M00x-001.md) |

---

## Rastreabilidade

\```
EPIC-M00x-001 (Titulo)
├── US-M00x-001 Titulo
├── US-M00x-002 Titulo
└── US-M00x-003 Titulo
\```

```

---

## Step 4: Modelo Estrutural

Create `/docs/modules/{M00x-name}/modelo-estrutural.md`

Sem texto narrativo. So diagrama Mermaid e dicionario de dados.

```markdown
# Modelo Estrutural

Dominio e regras de negocio: ver [README.md](README.md)

### Diagrama de Classes

\```mermaid
classDiagram
    ...
\```

## Dicionario de Dados

| Classe | Atributo | Definicao | Obrig. | Tipo | Dominio | Unico |
|--------|----------|-----------|--------|------|---------|-------|
```

---

## Step 5: Modelo Comportamental

Create `/docs/modules/{M00x-name}/modelo-comportamental.md`

Sem texto narrativo. So diagramas Mermaid de ciclo de vida.

```markdown
# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

### Ciclo de Vida: [Entidade]

\```mermaid
stateDiagram-v2
    ...
\```
```

---

## Step 6: Atualizar Backlog Central

Update `/docs/backlog-product.md` — adicionar ou atualizar a linha do modulo na tabela com dor, capacidade, KPI e % de desenvolvimento.

---

## Estrutura Final do Modulo

```
docs/modules/{M00x-name}/
├── README.md                # Indice + Dominio + Regras de Negocio
├── backlog.md               # EPICs + Rastreabilidade
├── modelo-estrutural.md     # Diagrama de classes + Dicionario de dados
├── modelo-comportamental.md # Diagramas de estado
└── epics/
    ├── EPIC-M00x-001.md     # Contexto + US com Gherkin
    ├── EPIC-M00x-002.md
    └── ...
```

## Checklist de Validacao

Antes de considerar a documentacao do modulo completa:

- [ ] README.md contem dominio e todas as regras de negocio
- [ ] Nenhum outro documento repete texto do dominio
- [ ] Cada EPIC contem suas US com cenarios Gherkin
- [ ] Regras de negocio nos EPICs sao links para o README
- [ ] Backlog lista todos os EPICs com rastreabilidade
- [ ] Modelo estrutural usa Mermaid (sem JPG/PNG)
- [ ] Modelo comportamental usa Mermaid (sem JPG/PNG)
- [ ] backlog-product.md foi atualizado
