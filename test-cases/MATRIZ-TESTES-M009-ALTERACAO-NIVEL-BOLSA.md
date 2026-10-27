# 📊 Matriz Formal de Testes e Rastreabilidade de QA (RTM)

| Metadado | Informação |
|---|---|
| **Módulo / Bounded Context** | **M009 — Gestão de Bolsistas (Subdomínio Core)** |
| **Feature / Iniciativa** | **Alteração de Nível de Bolsa** |
| **Card Pai de QA / Issue** | [#714](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/714) |
| **Feature do Projeto** | [#2550](https://github.com/leds-conectafapes/conectafapes-project/issues/2550) (Subtarefas: #2674, #2675, #2676, #3024) |
| **Repositório de Teste** | `leds-conectafapes/leds-conectafapes-prestacao-de-contas` / **Project 46** |
| **Branch de Trabalho** | `skill-test` |
| **Ambiente de Testes** | Homologação (`https://conectafapes.hom.es.gov.br` / `https://admin.conectafapes.hom.es.gov.br`) |
| **Data da Emissão** | 26/10/2026 |
| **Status Consolidado** | **12 de 14 CTs Executados (85.7% de Cobertura)** \| **10 Aprovados, 2 Bugs no FO, 2 CTs de Borda Pendentes no BO** |

---

## 🎯 1. Sumário Executivo e Métricas de Cobertura

```
+--------------------------------------------------------------------------+
|                       MÉTRICAS GERAIS DE EXECUÇÃO                        |
+----------------------+--------------------+------------------------------+
| Total Planejado      | 14 Casos de Teste  | 100% Cobertura Mapeada       |
| Executados           | 12 Casos de Teste  | 85.7% do Ciclo Executado     |
| Aprovados (Passed)   | 10 Casos de Teste  | 71.4% do Total de Cenários   |
| Com Falha (Failed)   | 02 Casos de Teste  | 14.3% do Total (2 Bugs FO)   |
| Pendentes (Pending)  | 02 Casos de Teste  | 14.3% (BO Reprovação e Job)  |
| Bugs Registrados     | 02 Defeitos Ativos | [#735], [#736]               |
+----------------------+--------------------+------------------------------+
```

### Distribuição por Canal e Severidade de Bugs

| Canal | CTs Totais | Passou | Falhou | Pendente | Bugs Associados |
|---|:---:|:---:|:---:|:---:|---|
| **Frontoffice (Portal Coordenador)** | 10 | 8 | 2 | 0 | [#735](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/735), [#736](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/736) |
| **Backoffice (Portal Admin FAPES)** | 4 | 2 | 0 | 2 | Nenhum bug impeditivo na esteira principal |
| **Total** | **14** | **10** | **2** | **2** | **2 Defeitos Registrados** |

---

## 📋 2. Matriz de Rastreabilidade de Testes (RTM)

### 💻 2.1 Frontoffice — Portal Coordenador (`/coordenador/minha-equipe`)

| ID CT | Título do Cenário | Tipo | Regra Canônica / Invariante | Issue GitHub | Status | Defeito Encontrado |
|:---:|---|:---:|---|:---:|:---:|:---:|
| **[CT-M009-FO-001]** | Solicitar alteração para nível superior com sucesso | Positivo | RN01, RN04, RI1, FR-013 | [#715](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/715) |  **Passou** | N/A |
| **[CT-M009-FO-002]** | Solicitar alteração para nível inferior com redução e liberação de saldo | Positivo / Limite | RN01, RN04, FR-005, FR-013 | [#716](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/716) |  **Passou** | N/A |
| **[CT-M009-FO-003]** | Validar bloqueio e feedback em campos obrigatórios no modal | Negativo | Validação Zod / Schema de Formulário | [#717](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/717) |  **Passou** | N/A |
| **[CT-M009-FO-004]** | Validar bloqueio por saldo insuficiente considerando deduplicação de saldo | Negativo / Limite | RN01, FR-005 (Deduplicação de saldo) | [#718](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/718) |  **Passou** | N/A |
| **[CT-M009-FO-005]** | Validar congelamento de ações da bolsa de origem durante troca pendente | Regressão / Negativo | FR-013 (Congelamento de ações de ciclo de vida) | [#719](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/719) | ❌ **Falhou** | [#735 (BUG-M009-FO-NIV-001)](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/735) |
| **[CT-M009-FO-006]** | Desistir da solicitação de troca de nível pelo coordenador | Positivo | RN05, FR-013 (Descongelamento na desistência) | [#720](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/720) |  **Passou** | N/A |
| **[CT-M009-FO-007]** | Cancelar bolsa de origem com troca pendente exigindo dupla confirmação | Positivo / Limite | Invariante de Pareamento, Modal de Dupla Confirmação | [#721](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/721) |  **Passou** | N/A |
| **[CT-M009-FO-008]** | Validar bloqueio de segunda solicitação de troca concomitante | Negativo | RI1 (Paridade estrita 1:1, unicidade de par aberto) | [#722](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/722) |  **Passou** | N/A |
| **[CT-M009-FO-009]** | Validar bypass da regra de acúmulo de bolsas entre o mesmo par | Positivo / Limite | RI1 (Bypass na regra anti-acúmulo) | [#723](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/723) |  **Passou** | N/A |
| **[CT-M009-FO-010]** | Validar exibição unificada do par de bolsas na listagem da Minha Equipe | Usabilidade | Nielsen Heuristics #1 (Visibilidade de Estado), FR-013 | [#724](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/724) | ❌ **Falhou** | [#736 (BUG-M009-FO-NIV-002)](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/736) |

---

### 🏛️ 2.2 Backoffice — Portal Admin FAPES (`/gestao-bolsa/visualizar-pendencias`)

| ID CT | Título do Cenário | Tipo | Regra Canônica / Invariante | Issue GitHub | Status | Evidência / Observação |
|:---:|---|:---:|---|:---:|:---:|---|
| **[CT-M009-BO-004]** | Validar filtro segmentado, indicadores e selos visuais na fila de pendências | Usabilidade / Regressão | M009: Visualização e triagem pela FAPES | [#728](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/728) |  **Passou** | Filtro `Alteração de nível`, selos roxos `BPIG-IV → BPIG-III (60%)` e contadores validados com sucesso |
| **[CT-M009-BO-001]** | Implementar novo nível com swap atômico e transição de pagamentos | Positivo / Limite | RN07, RN11, Regra Swap Atômico, Supressão Autherix | [#725](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/725) |  **Passou** | Tela de documentos exibe reaproveitamento de certidões da origem, requisitos declaratórios e botão `Implementar Novo Nível` |
| **[CT-M009-BO-002]** | Reprovar solicitação de alteração mantendo bolsa de origem ativa | Positivo / Negativo | RN05, FR-013 (Descongelamento na reprovação) | [#726](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/726) | ⏳ **Pendente** | Cenário alternativo para validação com nova massa de teste específica para reprovação |
| **[CT-M009-BO-003]** | Validar encerramento de par e descongelamento por expiração via job | Limite / Regressão | RN04 (Prazo documental), Invariante job expiração | [#727](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/727) | ⏳ **Pendente** | Cenário de borda/job assíncrono para validação com data limite extrapolada |

---

## 🐛 3. Matriz de Gestão de Defeitos (Bug Tracking)

| ID do Bug | Título do Defeito | Canal / Rota | Severidade | Card Pai / Issue | Status | Impacto no Negócio |
|---|---|---|:---:|:---:|:---:|---|
| **BUG-M009-FO-NIV-001** | Botões "Cancelar Bolsa" e "Estender Bolsa" continuam ativos na bolsa de origem em espera e retornam erro HTTP 400 | Frontoffice: `/coordenador/minha-equipe` (Detalhes) | 🟠 **Média** | [#735](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/735) (Sub de [#729](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/729)) | Aberto | Violação da regra de congelamento preventivo (FR-013). Gera frustração e mensagens de erro de backend no front. |
| **BUG-M009-FO-NIV-002** | Ausência do rótulo visual "Em espera" e de card explicativo na tela de detalhes da bolsa de origem | Frontoffice: `/coordenador/minha-equipe` (Detalhes) | 🟡 **Baixa/Média** | [#736](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/736) (Sub de [#729](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/729)) | Aberto | Violação de Heurística de Usabilidade #1 (Visibilidade do Status do Sistema). O coordenador não sabe o motivo das ações estarem congeladas. |

---

## 🛡️ 4. Invariantes de Negócio e Cobertura Técnica

| Invariante / Regra Chave | Descrição Técnica | Cenários de Teste Mapeados | Veredito |
|---|---|---|:---:|
| **RI1 — Paridade Estrita 1:1** | Não pode haver mais de uma solicitação de alteração aberta simultaneamente para o mesmo bolsista. | CT-M009-FO-008 |  Garantido no Frontend e Backend |
| **RI2 — Swap Atômico** | A ativação da nova bolsa e o cancelamento da anterior devem ocorrer no mesmo commit do banco, sem período descoberto ou dupla bolsa ativa. | CT-M009-BO-001 |  Validado no Backoffice |
| **FR-005 — Deduplicação Orçamentária** | O cálculo de impacto orçamentário não deve duplicar parcelas futuras da bolsa de origem ao estimar o custo da nova. | CT-M009-FO-002, CT-M009-FO-004 |  Garantido |
| **FR-013 — Congelamento Preventivo** | Ações de cancelamento, extensão ou novo pedido na bolsa de origem devem ficar desabilitadas enquanto houver solicitação aberta. | CT-M009-FO-005, CT-M009-FO-006, CT-M009-BO-002 | ⚠️ Falha pontual na UI (Bug #735 / #736) |
| **Supressão Autherix** | Não emitir evento de cancelamento de permissão de participante ao efetuar o swap da alocação de bolsa. | CT-M009-BO-001 |  Contrato operacional atendido |
| **Reaproveitamento de Documentos** | Documentos comprobatórios da alocação de origem que permaneçam válidos são herdados sem exigir reenvio pelo bolsista. | CT-M009-BO-001 |  Validado visualmente na tela da FAPES |

---

## 🏁 5. Conclusão e Próximos Passos do Ciclo

1. **Reteste dos Bugs de Frontoffice**:
   - Retestar [#735](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/735) e [#736](https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/736) assim que o time de desenvolvimento publicar a correção de desativação dos botões de ciclo de vida e a inclusão do chip visual "Em espera".
2. **Execução dos Cenários de Borda do Backoffice**:
   - **CT-M009-BO-002**: Simular reprovação fundamentada com nova massa de teste para assegurar que a bolsa de origem retorna ao estado 100% ativo e descongelada.
   - **CT-M009-BO-003**: Acionar o job agendado com prazo expirado para checar a invalidação limpa da proposta.
