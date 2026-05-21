# Classificacoes — AreaConhecimento e Rubrica

```yaml
ontology: "Shared Classifications — Knowledge Areas, Purposes and Expense Nature"
namespace: "shared.classifications"
imports:
  - namespace: "shared"
    path: path: "base.yaml"
metadata:
  module: "M008"
  source: "docs/implementation/modules/M008-cadastros-corporativos/classificacoes/modelo-estrutural.md"
  version: "1.0.0"
  description: "Transversal classification tables: CNPq knowledge area hierarchy (AreaConhecimento), institutional purposes (Finalidade), and budget expense nature (NaturezaDespesa) from M008 rubricas."

entities:
  AreaConhecimento:
    description: "Hierarchical classification of knowledge areas following CNPq reference, used in calls, evaluations, quotas, proposal framing and indicators."
    extends: null
    fields:
      id:
        type: uuid
        required: true
        description: "Surrogate primary key."
      codigo:
        type: string
        required: true
        unique: true
        description: "Código da área conforme CNPq, máximo 20 caracteres. Ex: 1.03.04. Deve ser único (RN06)."
      nome:
        type: string
        required: true
        description: "Nome da área de conhecimento, máximo 200 caracteres. Ex: Ciência da Computação."
      nivel:
        type: "enum:NivelArea"
        required: true
        description: "Nível hierárquico da área na taxonomia CNPq."
      areaPaiId:
        type: uuid
        required: false
        description: "FK auto-referencial para AreaConhecimento — área superior na hierarquia CNPq. Nulo para GRANDE_AREA."
      # Auditavel mixin
      createdAt:
        type: datetime
        required: true
        description: "Timestamp de criação do registro."
      updatedAt:
        type: datetime
        required: true
        description: "Timestamp da última atualização."
      createdBy:
        type: uuid
        required: true
        description: "Identificador do usuário que criou o registro."
      updatedBy:
        type: uuid
        required: true
        description: "Identificador do usuário que realizou a última atualização."

  Finalidade:
    description: "Corporate reference table of institutional purposes used to classify partnerships, programs, calls and other transversal configurations."
    extends: null
    fields:
      id:
        type: uuid
        required: true
        description: "Surrogate primary key."
      nome:
        type: string
        required: true
        unique: true
        description: "Nome da finalidade, máximo 200 caracteres. Ex: Pesquisa, Inovação, Extensão. Deve ser único."
      descricao:
        type: string
        required: false
        description: "Descrição do propósito institucional, máximo 500 caracteres."
      ativa:
        type: boolean
        required: true
        description: "Indica se a finalidade está ativa. Finalidade inativa não deve ser ofertada em novas configurações."
        todo: "Field 'ativa' inferred from rule 'Finalidade inativa não deve ser ofertada'; not explicitly listed in dicionário de dados — needs confirmation."
      # Auditavel mixin
      createdAt:
        type: datetime
        required: true
        description: "Timestamp de criação do registro."
      updatedAt:
        type: datetime
        required: true
        description: "Timestamp da última atualização."
      createdBy:
        type: uuid
        required: true
        description: "Identificador do usuário que criou o registro."
      updatedBy:
        type: uuid
        required: true
        description: "Identificador do usuário que realizou a última atualização."
      deletedAt:
        type: datetime
        required: false
        description: "Timestamp de exclusão lógica. Nulo indica registro ativo. Finalidade excluída permanece consultável para histórico."

  Rubrica:
    description: "Master catalog of normative/budgetary categories used to classify expenses. A sub-rubrica is a child Rubrica (via rubricaPai), not a separate entity. Does not represent financial transactions."
    extends: null
    fields:
      id:
        type: uuid
        required: true
        description: "Surrogate primary key."
      codigo:
        type: string
        required: true
        unique: true
        description: "Código canônico da rubrica, máximo 40 caracteres. Ex: RUB-DIARIAS. Deve ser único (RN16)."
      nome:
        type: string
        required: true
        description: "Nome de exibição da rubrica, máximo 150 caracteres. Ex: Diárias."
      descricao:
        type: string
        required: true
        description: "Descrição da rubrica, máximo 500 caracteres."
      naturezaDespesa:
        type: "enum:NaturezaDespesa"
        required: true
        description: "Natureza da despesa da rubrica (RN16)."
      ativa:
        type: boolean
        required: true
        description: "Indica se a rubrica está ativa. Rubrica inativa não deve ser ofertada em novas configurações, mas permanece consultável para histórico (RN18)."
      rubricaPaiId:
        type: uuid
        required: false
        description: "FK auto-referencial para Rubrica — rubrica superior quando esta rubrica detalha uma categoria maior (RN17). Nulo indica rubrica raiz."
      # Auditavel mixin
      createdAt:
        type: datetime
        required: true
        description: "Timestamp de criação do registro."
      updatedAt:
        type: datetime
        required: true
        description: "Timestamp da última atualização."
      createdBy:
        type: uuid
        required: true
        description: "Identificador do usuário que criou o registro."
      updatedBy:
        type: uuid
        required: true
        description: "Identificador do usuário que realizou a última atualização."

relationships:
  - from: "shared.classifications.AreaConhecimento"
    relation: "hasParent"
    to: "shared.classifications.AreaConhecimento"
    cardinality: "0..1"
    description: "Uma AreaConhecimento pode ter uma área pai na hierarquia CNPq. GRANDE_AREA não possui pai."
  - from: "shared.classifications.AreaConhecimento"
    relation: "hasChildren"
    to: "shared.classifications.AreaConhecimento"
    cardinality: "0..*"
    description: "Uma AreaConhecimento pode ter zero ou mais subáreas filhas."
  - from: "shared.classifications.Rubrica"
    relation: "hasParent"
    to: "shared.classifications.Rubrica"
    cardinality: "0..1"
    description: "Uma Rubrica pode ter uma rubrica pai, tornando-se subrubrica (RN17)."
  - from: "shared.classifications.Rubrica"
    relation: "hasChildren"
    to: "shared.classifications.Rubrica"
    cardinality: "0..*"
    description: "Uma Rubrica pode ter zero ou mais subrubricas filhas."

axioms:
  - id: "AX-CLS-01"
    natural_language: "CNPq code uniquely identifies a knowledge area."
    formal_rule: "∀a1, a2 ∈ AreaConhecimento: a1.codigo = a2.codigo → a1 = a2"
  - id: "AX-CLS-02"
    natural_language: "Knowledge area hierarchy follows CNPq taxonomy: GRANDE_AREA has no parent; AREA parent is GRANDE_AREA; SUBAREA parent is AREA; ESPECIALIDADE parent is SUBAREA."
    formal_rule: "nivel(a) = GRANDE_AREA → areaPaiId = null; nivel(a) = AREA → nivel(areaPai) = GRANDE_AREA; nivel(a) = SUBAREA → nivel(areaPai) = AREA; nivel(a) = ESPECIALIDADE → nivel(areaPai) = SUBAREA"
  - id: "AX-CLS-03"
    natural_language: "Rubrica code is unique across all rubricas."
    formal_rule: "∀r1, r2 ∈ Rubrica: r1.codigo = r2.codigo → r1 = r2"
  - id: "AX-CLS-04"
    natural_language: "Finalidade name is unique."
    formal_rule: "∀f1, f2 ∈ Finalidade: f1.nome = f2.nome → f1 = f2"
  - id: "AX-CLS-05"
    natural_language: "Inactive Rubrica must not be offered in new configurations but remains queryable."
    formal_rule: "∀r ∈ Rubrica: r.ativa = false → r ∉ NewConfigurationOptions ∧ r ∈ HistoricalQuerySet"

invariants:
  - id: "INV-CLS-01"
    rule: "AreaConhecimento with nivel = GRANDE_AREA must have areaPaiId = null"
    description: "Grande área é a raiz da hierarquia CNPq e não possui pai."
  - id: "INV-CLS-02"
    rule: "Rubrica.rubricaPaiId ≠ Rubrica.id"
    description: "Auto-referência em rubricaPai é rejeitada."
  - id: "INV-CLS-03"
    rule: "Rubrica does not store financial transactions or balance movements"
    description: "RN21: movimentação financeira pertence ao M013 (Transacao) e M014/M016."

enums:
  NivelArea:
    description: "Hierarchical level of a knowledge area in the CNPq taxonomy."
    values:
      GRANDE_AREA: "Grande área do conhecimento — nível raiz da hierarquia CNPq."
      AREA: "Área do conhecimento — segundo nível da hierarquia."
      SUBAREA: "Subárea do conhecimento — terceiro nível da hierarquia."
      ESPECIALIDADE: "Especialidade — nível folha da hierarquia CNPq."

  NaturezaDespesa:
    description: "Budget nature of an expense category (Rubrica), distinguishing operational costs from capital investments."
    values:
      CUSTEIO: "Despesa de custeio — gastos operacionais, consumíveis e serviços."
      CAPITAL: "Despesa de capital — aquisição de bens permanentes e equipamentos."

value_objects: null

events: []

workflows: null
policies: null

agent_instructions:
  rules:
    - "Não criar entidades fora da ontologia."
    - "Toda spec deve respeitar axioms."
    - "Toda implementação deve seguir workflows definidos."
    - "AreaConhecimento segue estritamente a classificação CNPq; não criar níveis adicionais."
    - "Rubrica não armazena movimentação financeira; transações pertencem ao M013."
    - "Rubrica inativa deve permanecer consultável para histórico — não aplicar hard delete."
    - "Subrubrica é uma Rubrica com rubricaPaiId preenchido; não é entidade separada."
    - "Finalidade inativa não deve ser ofertada em novos cadastros, mas permanece visível em consultas históricas."
  notes:
    - "Rubrica entity is placed in shared.classifications (rather than a separate shared.rubricas namespace) per ontology instructions to include NaturezaDespesa from M008/rubricas in this file."
    - "Finalidade.ativa field is inferred from the rule 'Finalidade inativa não deve ser ofertada'; not explicitly listed in the dicionário de dados table — marked with todo for confirmation."
    - "AreaConhecimento.areaPaiId hierarchy constraint (AX-CLS-02) should be validated at application layer, not only at DB level."

```
