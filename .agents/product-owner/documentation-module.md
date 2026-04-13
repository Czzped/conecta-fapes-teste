# Workflow: Documentacao de Modulo

Workflow para criar ou atualizar a documentacao de um modulo do Conecta FAPES. Seguir os steps **em ordem**.

Referencia canonica: `/docs/implementation/modules/M001-modalidade-bolsa/`

---

## Step 1: README.md (Dominio + Regras)

Create `/docs/implementation/modules/{M00x-name}/README.md`

Este e o documento ancora do modulo. Toda informacao de dominio e regras de negocio vive aqui. Os outros documentos linkam para ca.

```markdown
# M00x - [Nome do Modulo]

[← Voltar ao Backlog Central](../../../management/backlog-product.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
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

## Step 2: Contrato do Modulo

Create `/docs/implementation/modules/{M00x-name}/contrato.md`

Este documento traduz o dominio do `README.md` em **servicos expostos pelo modulo**. Ele documenta a superficie publica do bounded context sem duplicar o texto do dominio.

Use o contrato para registrar:
- comandos;
- consultas;
- jobs/processos assincronos;
- eventos consumidos;
- eventos emitidos;
- integracoes externas;
- recusas/erros de negocio;
- garantias operacionais relevantes.
- exemplos JSON de entrada e saida para cada operacao publica;
- excecoes e mensagens de erro exemplificadas para cada operacao publica.

```markdown
# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

[O que o modulo expoe e para quem]

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| ... | ... |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| ... | Modulo, Sistema Externo, Cadastro | ... |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| CriarExemplo | Command | ... | ... | ... | RN01, RI1 | ... | ... | Nao | Perfil X | API interna a definir |

## Padrao de Payload e Erro

- Os JSON do contrato sao exemplos ilustrativos do contrato de aplicacao do modulo.
- Nao inventar endpoint, handler ou serializacao tecnica como se fossem definitivos.

**Envelope de erro sugerido**

\```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "campo": "valor-relacionado-ao-erro"
    }
  }
}
\```

## Exemplos JSON por Operacao

Repetir a estrutura abaixo para **cada** operacao listada em `Operacoes Publicas`.

### CriarExemplo

**Exemplo de entrada**

\```json
{
  "campo": "valor"
}
\```

**Exemplo de saida**

\```json
{
  "resultado": {
    "id": "EX-001"
  }
}
\```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| EXEMPLO_DADO_INVALIDO | Os dados informados para a operacao sao invalidos. |
| EXEMPLO_NAO_ENCONTRADO | O recurso informado nao foi encontrado. |

## Mapeamento de Transporte

- Quando o transporte ainda nao estiver decidido, registrar `a definir`.
- O contrato do modulo e canonico; endpoint, fila ou job sao mapeamentos secundarios.

## Eventos e Efeitos Colaterais

- [Operacao] gera / dispara / registra ...

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- EPICs: [EPIC-M00x-001](epics/EPIC-M00x-001.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
```

**Principios**:
- `README.md` continua sendo a fonte de verdade do dominio e das regras.
- `contrato.md` documenta **servicos de aplicacao do modulo**, nao classes concretas.
- O contrato nao deve redefinir ownership, entidades ou invariantes do modulo.
- Cada operacao publica deve ter exemplo JSON de entrada, saida e excecoes com mensagens de erro.

---

## Step 3: EPICs com User Stories em Gherkin

Create `/docs/implementation/modules/{M00x-name}/epics/EPIC-M00x-NNN.md`

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

## Step 4: Backlog do Modulo

Create `/docs/implementation/modules/{M00x-name}/backlog.md`

Indexa os EPICs e mostra a rastreabilidade EPIC → US.

```markdown
# Sub-Backlog: M00x - [Nome]

[← Voltar ao Backlog Central](../../../management/backlog-product.md)

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

## Step 5: Modelo Estrutural

Create `/docs/implementation/modules/{M00x-name}/modelo-estrutural.md`

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

## Step 6: Modelo Comportamental

Create `/docs/implementation/modules/{M00x-name}/modelo-comportamental.md`

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

## Step 7: Atualizar Backlog Central

Update `/docs/management/backlog-product.md` — adicionar ou atualizar a linha do modulo na tabela com dor, capacidade, KPI e % de desenvolvimento.

---

## Estrutura Final do Modulo

```
docs/implementation/modules/{M00x-name}/
├── README.md                # Indice + Dominio + Regras de Negocio
├── contrato.md             # Comandos + Consultas + Jobs + Eventos do modulo
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
- [ ] contrato.md documenta a superficie publica do modulo sem duplicar o dominio
- [ ] Cada operacao do contrato aponta para RNxx/RIx existentes no README
- [ ] Nenhum outro documento repete texto do dominio
- [ ] Cada EPIC contem suas US com cenarios Gherkin
- [ ] Regras de negocio nos EPICs sao links para o README
- [ ] Backlog lista todos os EPICs com rastreabilidade
- [ ] Modelo estrutural usa Mermaid (sem JPG/PNG)
- [ ] Modelo comportamental usa Mermaid (sem JPG/PNG)
- [ ] `docs/management/backlog-product.md` foi atualizado
