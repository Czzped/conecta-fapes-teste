# 📊 Matrizes de Testes e Rastreabilidade (RTM) — Conecta FAPES

Esta pasta centraliza as **Matrizes Formais de Testes e Rastreabilidade (Requirements Traceability Matrices — RTM)** de cada fluxo, funcionalidade ou ciclo de homologação do projeto.

---

## 🎯 Objetivo das Matrizes

Cada documento RTM nesta pasta tem a finalidade de:
1. **Consolidar a Visão de Execução:** Mostrar rapidamente o que já foi testado, o que passou, o que falhou e o que ainda resta executar em um fluxo específico.
2. **Garantir a Rastreabilidade Bidirecional:** Conectar cada caso de teste (`CT-*.md`) à sua respectiva regra canônica de negócio (RN, RI, FR) e a cada bug (`BUG-*.md`) relatado.
3. **Servir de Critério de Release:** Prover aos POs, Tech Leads e Analistas da FAPES evidências auditáveis de prontidão para deploy (*Definition of Done*).

---

## 🏷️ Padrão de Nomenclatura

Os arquivos de matriz devem seguir o formato:
`MATRIZ-TESTES-[M0XX]-[NOME-DO-FLUXO].md`

Exemplos:
* `MATRIZ-TESTES-M009-ALTERACAO-NIVEL-BOLSA.md`
* `MATRIZ-TESTES-M014-PRESTACAO-CONTAS-FINANCEIRA.md`

---

## 📁 Matrizes Disponíveis

| Módulo | Fluxo / Feature | Arquivo | Cobertura | Status |
|---|---|---|:---:|:---:|
| **M009** | Alteração de Nível de Bolsa | [`MATRIZ-TESTES-M009-ALTERACAO-NIVEL-BOLSA.md`](MATRIZ-TESTES-M009-ALTERACAO-NIVEL-BOLSA.md) | 85.7% (12/14 CTs) | Em Homologação (2 Bugs FO) |
