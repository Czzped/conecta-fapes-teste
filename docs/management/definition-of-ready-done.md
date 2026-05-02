# Definition of Ready / Definition of Done — Modulos ConectaFAPES

Criterios de prontidao (Ready) para iniciar implementacao e criterios de aceitacao (Done) para considerar um modulo concluido.

[← Voltar ao Management](README.md)

---

## Premissa Nao Negociavel do Projeto

> **Todo codigo entregue DEVE ter testes unitarios e testes de integracao.**
>
> Esta premissa aplica-se a **todas as entregas de codigo** em qualquer modulo, produto ou sprint. E parte obrigatoria do DoD de qualquer US, Task ou EPIC de desenvolvimento.
>
> - **Testes unitarios** cobrindo regras de negocio documentadas
> - **Testes de integracao** cobrindo fluxos end-to-end (endpoint → persistencia → resposta)
> - Cobertura validada em CI antes do merge
> - Execucao automatizada em pipeline sem dependencias manuais
>
> **PRs sem testes serao automaticamente reprovados no review.**

---

## Criterios Gerais

### Definition of Ready (DoR) — Aplicavel a qualquer modulo

Um modulo esta **Ready** quando:

1. README.md com dominio e regras de negocio documentados
2. contrato.md com operacoes publicas, dependencias e consumidores definidos
3. modelo-estrutural.md com diagrama de classes e dicionario de dados
4. backlog.md com EPICs e user stories mapeados
5. Dependencias upstream identificadas e com % minimo viavel (ver tabela por modulo)
6. Integracoes externas documentadas e com ambiente de teste disponivel

### Definition of Done (DoD) — Aplicavel a qualquer modulo

Um modulo esta **Done** quando:

1. Todas as operacoes do contrato.md implementadas e testadas
2. Todos os EPICs do backlog.md com status Done
3. Todas as regras de negocio do README.md cobertas por testes
4. Dependencias upstream atendidas (modulos dependentes prontos ou com stub funcional)
5. Integracoes externas funcionais em ambiente de homologacao
6. Modelo comportamental validado (maquina de estados implementada conforme spec)
7. contrato-api.md com endpoints implementados e documentados
8. Sem debito tecnico de prioridade Alta pendente

### Premissa Nao Negociavel — Testes

**Todo codigo entregue DEVE ter:**

- **Testes unitarios** cobrindo as regras de negocio documentadas
- **Testes de integracao** cobrindo os fluxos end-to-end (endpoint → persistencia → resposta)
- Cobertura validada em CI antes do merge
- Execucao automatizada em pipeline de CI sem dependencias manuais

PRs sem testes unitarios e de integracao serao **automaticamente reprovados** no review, independentemente do modulo ou US.

---

## Por Modulo

### M001 — Modalidades de Bolsas (80%)

| Criterio | DoR | Status |
|----------|-----|--------|
| Documentacao (README, contrato, modelo) | Completa | OK |
| M008 (Moeda como cadastro corporativo) | Parcial (40%) | Dados de referencia |

| Criterio | DoD | Status |
|----------|-----|--------|
| 7 operacoes do contrato implementadas | Implementadas | OK |
| 3 EPICs Done | Done | OK |
| 11 regras de negocio cobertas | Cobertas | OK |
| Correcao Versao de Bolsa (Sprint-006) | Pendente | Bloqueio |
| M008 Moeda consolidada | Parcial | Nao bloqueante |

**Pendencias para 100%:** Correcao do cadastro de VersaoBolsa (Sprint-006).

---

### M002 — Importacao SIGFAPES (100%)

| Criterio | DoD | Status |
|----------|-----|--------|
| 7 operacoes do contrato | Implementadas | OK |
| 3 EPICs Done | Done | OK |
| Integracao SigFapes funcional | Funcional | OK |

**Status:** Concluido.

---

### M003 — Gestao de Iniciativas Captadas (80%)

| Criterio | DoR | Status |
|----------|-----|--------|
| M001 (VersaoNivel) | 80% | OK |
| M008 (AreaTecnica, PessoaFisica) | 40% | Parcial |
| M010 (Programa, Parceria) | 15% | Bloqueio |

| Criterio | DoD | Status |
|----------|-----|--------|
| 5 operacoes do contrato | Implementadas | OK |
| 5 EPICs Done | Done | OK |
| US-M003-003 Vincular Edital a Programa/Parceria | Bloqueado por M010 | Bloqueio |
| Testes com usuarios | Sprint-004 | Pendente |

**Pendencias para 100%:** M010 precisa entregar Programa/Parceria; testes com usuarios.

---

### M004 — Pagamento de Bolsistas (100%)

| Criterio | DoD | Status |
|----------|-----|--------|
| 15 operacoes do contrato | Implementadas | OK |
| 12 EPICs Done | Done | OK |
| Integracoes Banestes/BANDES/MinIO/Redis | Funcionais | OK |

**Status:** Concluido. Debito tecnico DDD catalogado (9 itens, nenhum bloqueante).

---

### M005 — Autenticacao (30%)

| Criterio | DoR | Status |
|----------|-----|--------|
| contrato.md definido | Ausente | Bloqueio |
| backlog.md com EPICs | Ausente | Bloqueio |
| modelo-estrutural.md | Ausente | Bloqueio |
| Integracao Acesso Cidadao documentada | Parcial (funcional no Portal) | OK |

| Criterio | DoD | Status |
|----------|-----|--------|
| Autenticacao via Acesso Cidadao | Funcional | OK |
| Logs de auditoria | Nao implementados | Pendente |
| Contrato e EPICs definidos e concluidos | Nao existem | Bloqueio |

**Pendencias para 100%:** Criar contrato, backlog e modelo estrutural; implementar auditoria.

---

### M006 — Autorizacao (0%)

| Criterio | DoR | Status |
|----------|-----|--------|
| M005 (Autenticacao) funcional | 30% | Bloqueio |
| contrato.md e backlog.md | Ausentes | Bloqueio |
| Decisao OpenFGA (ADR-007) | Aceita | OK |

**Pendencias para Ready:** M005 funcional; criar toda a especificacao.

---

### M007 — API Gateway (0%)

| Criterio | DoR | Status |
|----------|-----|--------|
| M005 e M006 funcionais | 30% / 0% | Bloqueio |
| Decisao BFF vs Gateway (ADR-005) | Aceita | OK |

**Pendencias para Ready:** M005 e M006 como pre-requisitos.

---

### M008 — Cadastros Corporativos (40%)

| Criterio | DoR | Status |
|----------|-----|--------|
| Documentacao completa | Completa | OK |
| Integracao Acesso Cidadao (M005) | 30% | Parcial |

| Criterio | DoD | Status |
|----------|-----|--------|
| 6 operacoes do contrato | Parcialmente implementadas | In Progress |
| 3 EPICs Done | In Progress | In Progress |
| PessoaFisica, Instituicao, AreaTecnica completos | Parcial | In Progress |
| Cadastros de referencia (areas CNPq, rubricas, cidades) | Parcial | In Progress |

**Pendencias para 100%:** Completar 3 EPICs; SincronizarPessoa depende de M005.

---

### M009 — Gestao Bolsa Pesquisa (35%)

| Criterio | DoR | Status |
|----------|-----|--------|
| M003 (Projeto, Coordenador, Bolsista) | 80% | OK |
| M001 (VersaoNivel) | 80% | OK |
| Integracao assinatura/Diario Oficial | A definir | Bloqueio para EPIC-003 |

| Criterio | DoD | Status |
|----------|-----|--------|
| 5 operacoes do contrato | Parcial | In Progress |
| EPIC-001 Indicacao | In Progress | In Progress |
| EPIC-002 Avaliacao Documental | In Progress | In Progress |
| EPIC-003 Formalizacao | To Do | Pendente |
| EPIC-004 Ciclo de Vida | To Do | Pendente |

**Pendencias para 100%:** Completar indicacao e avaliacao; implementar formalizacao (assinatura); implementar ciclo de vida (renovacao, suspensao, encerramento).

---

### M010 — Planejamento e Estrategia (15%)

| Criterio | DoR | Status |
|----------|-----|--------|
| M008 (PessoaFisica, Instituicao) | 40% | Parcial |
| Documentacao completa | Completa | OK |

| Criterio | DoD | Status |
|----------|-----|--------|
| 6 operacoes do contrato | 1 parcial | In Progress |
| EPIC-001 Plano Estrategico | To Do | Pendente |
| EPIC-002 Parcerias | To Do | Pendente |
| EPIC-003 Programas | In Progress | In Progress |

**Pendencias para 100%:** Modulo critico — bloqueia M003 e M011. Priorizar.

---

### M011 — Configuracao de Captacao (10%)

| Criterio | DoR | Status |
|----------|-----|--------|
| M003 (Edital) | 80% | OK |
| M010 (Programa, Parceria) | 15% | Bloqueio parcial |
| M001 (Modalidades de Bolsa) | 80% | OK |
| M008 (Revisores, Instituicoes) | 40% | Parcial |

| Criterio | DoD | Status |
|----------|-----|--------|
| 14 operacoes do contrato | 6 parciais | In Progress |
| EPIC-001 Config Edital | In Progress | In Progress |
| EPIC-002 Formularios | To Do | Pendente |
| EPIC-003 Revisores | To Do | Pendente |
| EPIC-004 Inscricoes | To Do | Sem doc detalhada |
| EPIC-005 Avaliacao Merito | To Do | Sem doc detalhada |
| EPIC-006 Recursos Pre-Award | To Do | Sem doc detalhada |
| EPIC-007 Resultado | To Do | Sem doc detalhada |

**Pendencias para 100%:** Criar docs detalhados dos EPICs 004-007; M010 para Programa/Parceria.

---

### M012 — Acompanhamento e Resultados (0%)

| Criterio | DoR | Status |
|----------|-----|--------|
| M003 (Projeto/Edital) | 80% | OK |
| M020 (Comunicacao para notificacoes) | 0% | Bloqueio parcial |

**Pendencias para Ready:** Pode iniciar dashboards sem M020. M020 bloqueia notificacoes de prazo.

---

### M013 — Gestao Orcamentaria do Projeto (0%)

| Criterio | DoR | Status |
|----------|-----|--------|
| M003 (Projeto) | 80% | OK |
| M008 (Rubrica) | 40% | Bloqueio (RN03) |
| M001 (VersaoNivel) | 80% | OK |

**Pendencias para Ready:** M008 precisa completar rubricas corporativas.

---

### M014 — Prestacao de Contas (55%)

| Criterio | DoD | Status |
|----------|-----|--------|
| 6 EPICs Done (001, 004-008) | Done | OK |
| EPIC-002 Analise | To Do | Pendente |
| EPIC-003 Contestacao/Auditoria SECONT | To Do | Pendente |
| M013 (RubricaProjeto) para limites | 0% | Bloqueio |
| Maquina de estados alinhada (11 estados) | 5 estados implementados | Debito tecnico |

**Pendencias para 100%:** EPICs 002/003; M013 para validacao de limites; alinhar maquina de estados.

---

### M015 — Suspensao e Finalizacao (0%)

| Criterio | DoR | Status |
|----------|-----|--------|
| M003 (Projeto) | 80% | OK |
| M009 (BolsaPesquisa) | 35% | Bloqueio parcial |
| M014 (PrestacaoContas) | 55% | Bloqueio parcial |
| M004 (Pagamento) | 100% | OK |

**Pendencias para Ready:** M009 e M014 precisam estar mais maduros.

---

### M016 — Contabilidade e Financeiro (0%)

| Criterio | DoR | Status |
|----------|-----|--------|
| M003 (Iniciativa) | 80% | OK |
| M010 (Programa/Parceria) | 15% | Bloqueio |
| Decisao sobre entidades em M014 | Pendente (DT-M014-001) | Bloqueio |

**Pendencias para Ready:** M010; resolver debito tecnico de entidades financeiras em M014.

---

### M017 — Prevencao a Lavagem de Dinheiro (0%)

| Criterio | DoR | Status |
|----------|-----|--------|
| M016 (MovimentacaoFinanceira) | 0% | Bloqueio |
| M008 (Beneficiario) | 40% | Parcial |
| M004 (Pagamento) | 100% | OK |
| Integracoes externas (COAF, listas restritivas) | Nao especificadas | Bloqueio |

**Pendencias para Ready:** M016; especificar integracoes externas.

---

### M018 — Business Intelligence (0%)

| Criterio | DoR | Status |
|----------|-----|--------|
| Dados transacionais suficientes (M003, M009) | Parcial | Pode iniciar com M003 |
| M010 (Programa) | 15% | Bloqueio parcial |

**Pendencias para Ready:** Pode iniciar paineis com dados de M003/M004 disponiveis.

---

### M019 — Transparencia e Auditoria (0%)

| Criterio | DoR | Status |
|----------|-----|--------|
| Formato SECONT definido | Nao especificado | Bloqueio |
| Trilha de auditoria como servico transversal | Nao implementada | Bloqueio |

**Pendencias para Ready:** Definir formato SECONT; trilha de auditoria deveria ser priorizada cedo.

---

### M020 — Comunicacao (0%)

| Criterio | DoR | Status |
|----------|-----|--------|
| M005 (base de usuarios) | 30% | Bloqueio |
| Provedor de email institucional | Nao integrado | Bloqueio |

**Pendencias para Ready:** M005 mais maduro; integrar provedor de email. Modulo transversal — priorizar para desbloquear M012 e outros.

---

## Cadeia de Bloqueios Criticos

```
M005/M006/M007 (0-30%)  →  Camada de seguranca inexistente
M008 (40%)              →  Cadastros corporativos bloqueiam M001, M003, M009, M010, M013
M010 (15%)              →  Bloqueia M003 (100%), M011, M016
M013 (0%)               →  Bloqueia M014 (100%)
M016 (0%)               →  Bloqueia M017
M020 (0%)               →  Bloqueia notificacoes em M012
```

## Recomendacao de Priorizacao

1. **M008** (40%→100%) — desbloqueia maior numero de modulos dependentes
2. **M010** (15%→100%) — desbloqueia M003, M011, M016
3. **M005** (30%→100%) — especificar e formalizar; desbloqueia M006, M007, M020
4. **M020** (0%→100%) — servico transversal que varios modulos precisam
