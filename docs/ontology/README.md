# ConectaFAPES — Ontologia de Domínio

Esta seção contém a **arquitetura semântica** do sistema ConectaFAPES, expressa em YAML. Os arquivos aqui não são código: são a fonte de verdade do domínio, usados para orientar agentes IA, geração de specs, APIs, frontends e testes.

---

## Onde ficam os arquivos

As ontologias de domínio vivem **dentro de cada módulo**, junto com o `modelo-estrutural.md`. Isso garante que modelo e ontologia envelheçam juntos.

```
docs/implementation/modules/
  M001-modalidade-bolsa/
    modelo-estrutural.md
    ontology.yaml              ← ontologia do módulo
  M003-gestao-projetos-captados/
    modelo-estrutural.md
    ontology.yaml
    diarias/
      modelo-estrutural.md
      ontology.yaml            ← ontologia do submodulo
  M008-cadastros-corporativos/
    ontology.yaml              ← index do módulo
    instituicoes/
      ontology.yaml
    diarias/
      ontology.yaml
    rubricas/
      ontology.yaml
  M010-planejamento-estrategia/
    ontology.yaml
    planejamento/
      ontology.yaml
    parcerias/
      ontology.yaml
    programas/
      ontology.yaml
  M024-curriculo-pesquisador/
    ontology.yaml
    formacao.yaml
    artigos.yaml
    livros.yaml
    orientacoes.yaml
    projetos.yaml
    eventos.yaml
    premios.yaml
    idiomas.yaml
```

Arquivos **cross-cutting** (sem módulo dono único) ficam em `docs/ontology/`:

```
docs/ontology/
  shared/          Tipos base reutilizados por todos os módulos
  workflows/       Fluxos que cruzam múltiplos módulos
  policies/        Controle de acesso e compliance
  integrations/    Sistemas externos
  ui/              Dicas de componentes de interface
```

---

## Anatomia de um Arquivo

Todo arquivo segue esta estrutura de nível superior:

```yaml
ontology:    # Nome descritivo do arquivo
namespace:   # Identificador único do módulo (ex: "post_award.orcamentaria")
imports:     # Dependências de outros arquivos de ontologia
metadata:    # Origem, versão, módulo de negócio
entities:    # Classes de domínio com seus campos
relationships: # Associações entre entidades
axioms:      # Regras de negócio deriváveis e fórmulas
invariants:  # Regras que NUNCA podem ser quebradas
enums:       # Listas de valores fixos
value_objects: # Tipos compostos reutilizáveis (ex: CPF, Auditavel)
events:      # Eventos de domínio emitidos por transições
workflows:   # Máquinas de estado (estados + transições)
policies:    # Permissões por papel
agent_instructions: # Regras para agentes IA que consomem este arquivo
```

---

## Seções em Detalhe

### `namespace`

Identificador hierárquico único do módulo. Usado nos imports de outros arquivos para referenciar entidades sem ambiguidade.

```yaml
namespace: "post_award.orcamentaria"
```

Referenciar uma entidade de outro módulo:

```yaml
type: "ref:post_award.orcamentaria.RubricaProjeto"
```

---

### `imports`

Lista de dependências. O `path` é relativo ao arquivo atual.

```yaml
imports:
  - namespace: shared
    path: "../../../ontology/shared/base.yaml"
  - namespace: corporativo.rubricas
    path: "../M008-cadastros-corporativos/rubricas/ontology.yaml"
```

---

### `entities`

Entidades são os objetos centrais do domínio — o equivalente a classes no modelo de domínio.

```yaml
entities:
  RubricaProjeto:
    description: "Linha orçamentária de um projeto, com saldo canônico."
    extends: "shared.Auditavel"
    fields:
      valorAprovado:
        type: decimal
        required: true
        description: "Valor total aprovado para esta rubrica."
      saldoDisponivel:
        type: decimal
        required: true
        derived: true
        formula: "valorAprovado - valorComprometido - valorExecutado + valorEstornado"
      estado:
        type: "enum:EstadoRubrica"
        required: true
```

**Tipos de campo suportados:**

| Tipo | Descrição |
|------|-----------|
| `string` | Texto livre |
| `integer` | Número inteiro |
| `decimal` | Número com casas decimais |
| `boolean` | Verdadeiro / falso |
| `date` | Data (sem hora) |
| `datetime` | Data e hora |
| `uuid` | Identificador único (UUID v4) |
| `enum:NomeDoEnum` | Valor de lista fixa definida em `enums:` |
| `ref:namespace.Entidade` | Referência a outra entidade (FK semântica) |

**Atributos especiais de campo:**

| Atributo | Significado |
|----------|-------------|
| `required: true` | Campo obrigatório |
| `unique: true` | Valor único na coleção |
| `derived: true` | Campo calculado — não persiste diretamente |
| `formula: "..."` | Expressão de cálculo do campo derivado |
| `generated: true` | Gerado automaticamente pelo sistema |
| `todo: "..."` | Campo com definição incompleta — requer revisão |

---

### `relationships`

Associações semânticas entre entidades, com cardinalidade explícita.

```yaml
relationships:
  - from: "post_award.orcamentaria.RubricaProjeto"
    relation: "pertence_a"
    to: "post_award.iniciativas.Iniciativa"
    cardinality: "N:1"
    description: "Cada rubrica pertence a exatamente uma iniciativa."
```

**Cardinalidades:** `1:1`, `1:N`, `N:1`, `N:N`

---

### `axioms`

Regras de negócio formalizadas. Um axiom expressa uma verdade do domínio que pode ser derivada, calculada ou verificada.

```yaml
axioms:
  - id: "AX-SLD01"
    natural_language: >
      O saldo disponível de uma rubrica é o valor aprovado menos o comprometido
      e o executado, mais os estornos.
    formal_rule: >
      RubricaProjeto.saldoDisponivel =
        valorAprovado - valorComprometido - valorExecutado + valorEstornado
```

**Axiom vs Invariant:**
- Use `axiom` para regras que *derivam* um valor ou *descrevem* como algo funciona.
- Use `invariant` para regras que *nunca podem ser violadas* — restrições absolutas.

---

### `invariants`

Restrições absolutas do domínio. Se um invariant for quebrado, o sistema está em estado inválido.

```yaml
invariants:
  - id: "INV-SLD1"
    rule: "RubricaProjeto.saldoDisponivel >= 0"
    description: "Saldo disponível nunca pode ser negativo."
  - id: "INV-SLD2"
    rule: "valorExecutado <= valorComprometido"
    description: "Não se pode executar mais do que foi comprometido."
```

---

### `enums`

Listas de valores fixos. Referenciar em campos com `type: "enum:NomeDoEnum"`.

```yaml
enums:
  EstadoPrograma:
    description: "Ciclo de vida de um Programa de fomento."
    values:
      EM_PLANEJAMENTO: "Programa em elaboração, ainda não ativo."
      ATIVO: "Programa ativo, aceitando captações."
      SUSPENSO: "Programa temporariamente suspenso."
      ENCERRADO: "Programa encerrado definitivamente."
```

---

### `value_objects`

Tipos compostos reutilizáveis. Não têm identidade própria; existem como parte de uma entidade.

```yaml
value_objects:
  Auditavel:
    fields:
      createdAt:
        type: datetime
        required: true
      updatedAt:
        type: datetime
        required: true
      createdBy:
        type: uuid
        required: true
      updatedBy:
        type: uuid
        required: true
```

`Auditavel` é o mixin padrão. Toda entidade persistida deve declarar `extends: "shared.Auditavel"`.

---

### `events`

Eventos de domínio emitidos quando algo relevante acontece.

```yaml
events:
  - name: "ProgramaAtivado"
    description: "Emitido quando um Programa transita para o estado ATIVO."
    payload_entity: "planejamento.programas.Programa"
    trigger: "state_transition.ATIVO"
```

---

### `workflows`

Máquinas de estado com estados válidos e transições permitidas.

```yaml
workflows:
  ContratacaoOutorga:
    states:
      - EM_CONVOCACAO
      - EM_FORMALIZACAO
      - FORMALIZADA
      - CANCELADA
    transitions:
      - from: EM_CONVOCACAO
        to: EM_FORMALIZACAO
        trigger: "iniciar_formalizacao"
        guard: "Outorgado aceite convocação"
      - from: EM_FORMALIZACAO
        to: FORMALIZADA
        trigger: "assinar_termo"
```

- `trigger`: ação ou evento que dispara a transição
- `guard`: condição que deve ser verdadeira para a transição ocorrer

---

### `policies`

Permissões por papel, alinhadas com OpenFGA (M006).

```yaml
policies:
  permissions:
    Coordenador:
      can:
        - submeter_proposta
        - solicitar_alteracao
```

---

### `agent_instructions`

Regras e notas para agentes IA. Sempre presentes em todo arquivo.

```yaml
agent_instructions:
  rules:
    - "Não criar entidades fora da ontologia."
    - "Toda spec deve respeitar axioms."
    - "Toda implementação deve seguir workflows definidos."
  notes:
    - "Módulo canônico de saldo. Todos que validam saldo consultam M013."
```

---

### `todo:`

Marcador de pendência. Aparece onde a definição está incompleta ou ambígua.

```yaml
# Em um campo:
tipoDocumento:
  type: string
  todo: "enum candidates: NF, RECIBO, PASSAGEM"

# Em módulo stub:
entities:
  todo: "Define when modelo-estrutural.md is available"
```

---

## Convenção de IDs

| Prefixo | Uso |
|---------|-----|
| `AX-M013-001` | Axiom do módulo M013 |
| `AX-SLD01` | Axiom canônico de saldo (plataforma) |
| `INV-M009-001` | Invariant do módulo M009 |
| `INV-SLD1` | Invariant canônico de saldo (plataforma) |

---

## Módulos Stub

Módulos com `source: "stub"` não possuem `modelo-estrutural.md` ainda. Todos os campos têm `todo:`. Não gerar implementações a partir de stubs sem revisão humana.

**Módulos stub:** M005, M006, M007, M015, M016, M017, M018, M019, M020, M021, M023.

---

## Para Agentes IA

1. **Leia `shared/base.yaml` primeiro** — define mixins usados em tudo.
2. **Respeite `imports:`** — não referencie namespace que não foi importado.
3. **Axioms e invariants têm precedência** — não os ignore nem contradiga.
4. **Campos `derived: true` não devem ser persistidos** — calculados em runtime.
5. **Workflows definem as únicas transições válidas** — toda mudança de estado fora do workflow é inválida.
6. **Arquivos stub são incompletos** — sinalize ao usuário antes de prosseguir.
7. **`todo:` significa ambiguidade não resolvida** — não decida sozinho.
