---
name: ddd
description: Apply Domain-Driven Design to Conecta FAPES module documentation and modeling. Use when creating or reviewing module docs, defining bounded contexts, modeling entities, value objects, aggregates, domain services, application services or business rules, analyzing module boundaries, or checking consistency across README, contrato, backlog, EPICs, modelo-estrutural, and modelo-comportamental.
---

# DDD for Module Documentation

Use this skill when the task involves domain definition, minimundo, business rules, entity relationships, or module boundaries in `docs/implementation/modules/`.

This skill complements `.agents/product-owner/documentation-module.md`. Use DDD here to decide what the module is, what belongs to it, and where each rule or concept should live. Then apply the document workflow from `documentation-module.md`.

## Core Outcome

At the end of the work, the module should have:

- one clear bounded context
- one ubiquitous language for its core concepts
- explicit invariants and business rules
- one explicit contract for the module's public application surface
- tactical modeling that matches the business language
- no artificial coupling with neighboring modules

## Recommended Workflow

1. Define the bounded context before writing artifacts.
2. Normalize the ubiquitous language and remove competing synonyms.
3. Classify each concept as entity, value object, aggregate, domain service, or policy.
4. Write invariants once in the right place, then reference them from the other artifacts.
5. Check neighboring modules to avoid stealing concepts or duplicating rules.
6. Validate consistency across `README.md`, `contrato.md`, `backlog.md`, `EPICs`, `modelo-estrutural.md`, and `modelo-comportamental.md`.

## Strategic DDD

### Bounded Context

Treat each module as a candidate bounded context. Keep the module focused on a single business capability.

Use these questions:

- Does this concept have its own lifecycle and business decisions inside this module?
- Is the term central to the module's purpose or only referenced by it?
- Would moving this concept to another module reduce duplication and clarify ownership?

Heuristics for Conecta FAPES:

- `Programa` and `Parceria` belong to the planning domain when the module owns their definition, lifecycle, and governance.
- `Edital` may reference `Programa` and `Parceria`, but the captacao module should not redefine their domain meaning.
- `Modalidade de Bolsa` should not absorb payment or post-award rules that belong to other modules.

If a concept is only selected, linked, or consulted by a module, keep the ownership in the source module and document the dependency instead of cloning the concept.

### Ubiquitous Language

Pick one preferred term for each business concept and use it consistently across all artifacts.

Do this:

- keep one canonical term per concept
- register important aliases only when they appear in legacy language or stakeholder speech
- prefer business terms over UI labels when they conflict

Do not do this:

- alternate between near-synonyms as if they were different concepts
- rename a concept in `EPICs` or diagrams without updating the `README.md`
- treat local labels from prototype screens as new domain concepts without validation

## Tactical DDD

### Entity

Use an entity when the concept has identity, lifecycle, traceability, or business history.

Typical signals:

- it is created, updated, activated, suspended, archived, or linked to other records
- stakeholders care which instance it is, not only its attributes

Examples:

- `Programa`
- `Parceria`
- `Edital`

### Value Object

Use a value object when the concept is defined by its attributes, has no independent lifecycle, and can be replaced as a whole.

Typical signals:

- no separate identity is needed
- equality is based on value
- it qualifies or describes an entity

Examples that often fit this pattern:

- `Periodo de Vigencia`
- `Valor de Aporte`
- `Dados do Processo`

### Aggregate

Use an aggregate when multiple concepts must stay consistent under one business boundary.

Ask:

- which entity protects the invariant?
- which root should receive commands and validations?

Example:

- if a `Parceria` contains participants, vigencia, and financial commitments that must remain consistent together, `Parceria` is the aggregate root and the supporting records stay inside its boundary

### Domain Service

Use a domain service when the rule is important to the business but does not naturally belong to one entity or value object.

Signals:

- the rule coordinates multiple entities
- the behavior is business-specific, not technical orchestration

Example:

- validating whether a captacao can consume a partnership allocation without violating planned limits

### Application Service

Use an application service when the module exposes a command, query, async job, or event-handling entrypoint that coordinates domain objects and policies.

Signals:

- it is the public surface of the bounded context
- it orchestrates entities, aggregates, and domain services
- it translates business intent into executable operations

Document application services in `contrato.md`, not in `modelo-estrutural.md`.

Do not confuse:

- **domain service**: business rule that does not fit one entity
- **application service**: public operation of the module, such as `CriarVersaoModalidade`, `ExecutarSincronizacao`, or `EnviarNotificacao`

### Policy or Business Rule

Treat a policy as a stable business decision that constrains behavior, prioritization, eligibility, transition, or composition.

Examples:

- one partnership may support multiple programs
- an edital must reference an approved program before publication
- a status transition requires previous validation or approval

## Invariants and Where They Live

Document invariants explicitly. An invariant is a rule that must always remain true for the model to be valid.

Use this distribution:

- `README.md`: domain meaning, rules, invariants, ownership, and cross-module dependencies
- `contrato.md`: commands, queries, jobs, events, preconditions, rejections, side effects, and optional transport mapping
- `backlog.md`: traceability from business outcomes to EPICs; do not restate the full rule
- `EPICs`: reference the relevant rules from `README.md` and express user-facing behavior in Gherkin
- `modelo-estrutural.md`: reflect entities, value objects, aggregates, and relationships implied by the rules
- `modelo-comportamental.md`: reflect state transitions and guards implied by the rules

If an invariant cannot be pointed to in `README.md`, the model is probably underspecified.

## Cross-Module Relationships

Only create a structural relationship between modules when there is an explicit business reason.

Prefer this sequence:

1. identify the owning module
2. define whether the current module creates, updates, approves, references, or only consults the concept
3. document the dependency direction
4. keep rules in the owning module and link to them from the dependent module

Good pattern:

- `M011` references `Programa` and `Parceria` from `M010` because captacao consumes planning decisions
- `M020` documents notification commands and consumed events in `contrato.md`, while ownership of business events remains in the source modules

Bad pattern:

- `M011` redefines the full meaning, lifecycle, and invariants of `Programa` just because the screen has a selector for it

## Consistency Checklist

Before finishing the module:

- Does the module represent one bounded context with a clear business capability?
- Are the main terms used with one meaning across all files?
- Is each core concept classified correctly as entity, value object, aggregate, service, or policy?
- Are invariants explicit in `README.md` and only referenced elsewhere?
- Does `contrato.md` expose only application services that are supported by the domain and rules?
- Do `EPICs` and Gherkin scenarios reflect the same business language as the `README.md`?
- Does `modelo-estrutural.md` show only relationships supported by business rules?
- Does `modelo-comportamental.md` reflect real lifecycle transitions and guards?
- Are dependencies on neighboring modules documented without cloning their domain rules?

## Anti-Patterns

- Mixing two bounded contexts in the same module because the UI shows them together
- Repeating the same rule in `README.md`, `EPICs`, and models with small wording changes
- Modeling an attribute as an entity when a value object is enough
- Creating a relationship in the structural model without a business rule that justifies it
- Moving ownership of a concept to the wrong module just because another flow depends on it
- Using `contrato.md` to redefine the domain, copy long narratives from `README.md`, or expose operations that belong to another module
