# Casos de Teste — Conecta FAPES

Repositório de casos de teste funcionais e de integração da plataforma.

> 🤖 **Atenção Agentes de IA:** Para otimização de tokens e conformidade nas entregas, leiam o manual de diretrizes em [instrucoes-ia-casos-de-teste.md](referencias/instrucoes-ia-casos-de-teste.md) antes de criar novos casos.

## Organização

Os casos de teste devem ser agrupados pelo módulo proprietário da regra de negócio:

```text
test-cases/
  M0XX-nome-do-modulo/
    CT-M0XX-001-nome-do-caso.md
```

Cada caso deve referenciar a regra de negócio no `README.md` do módulo e, quando aplicável, o EPIC e o cenário Gherkin correspondentes. Regras e invariantes continuam pertencendo à documentação do módulo; esta pasta apenas registra sua verificação.

## Conteúdo mínimo de um caso

- Identificador e título
- Módulo e requisito/regra de negócio de origem
- Pré-condições e dados de teste
- Passos de execução
- Resultado esperado
- Tipo: unitário, integração ou ponta a ponta
- Status e evidência de execução, quando houver

Todo código implementado deve manter testes unitários e de integração, conforme a Definition of Done do projeto.
