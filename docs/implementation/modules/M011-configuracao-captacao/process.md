# M011 — Processos de Captacao de Projetos

O modulo M011 cobre o fluxo **pre-award** da captacao de projetos, dividido em tres processos
sequenciais e dependentes.

---

## Processos

| # | Processo | Responsavel principal | Descricao resumida |
|---|----------|-----------------------|--------------------|
| 1 | [Fomento](process-fomento.md) | GestorFAPES | Aporte financeiro de Programa ou Parceria para um eixo estrategico. Define faixas de investimento, rubricas por faixa e resultados esperados. |
| 2 | [Configuracao da Selecao](process-configuracao-selecao.md) | AnalistaTecnico | A Area Tecnica define tipo de chamamento, cronograma das etapas, formularios e regras de selecao sobre um Fomento aprovado. |
| 3 | [Selecao dos Projetos](process-selecao-projetos.md) | AnalistaTecnico | Execucao da captacao: recebimento de propostas, analise documental, analise de merito, resultado preliminar, revisao e resultado final. |

---

## Dependencias entre Processos

```mermaid
flowchart LR
    P1[Processo 1\nFomento] -->|Fomento APROVADO| P2[Processo 2\nConfiguracao da Selecao]
    P2 -->|Captacao PUBLICADA| P3[Processo 3\nSelecao dos Projetos]
    P3 -->|Propostas aprovadas| M022[M022\nContratacao e Outorga]
```

- O Processo 2 exige um Fomento com estado `APROVADO`.
- O Processo 3 exige uma Captacao com estado `PUBLICADO`.
- O M011 termina na publicacao do resultado final. A assinatura do termo de outorga e contratacao pertencem ao M022.

---

## Atores do Modulo

| Ator | Processos |
|------|-----------|
| GestorFomento | 1 — papel atribuivel a qualquer funcionario da FAPES autorizado a buscar aportes de Programas e Parcerias |
| GestorFAPES | 2 (publicacao/encerramento da captacao) |
| AnalistaTecnico (Area Tecnica) | 1 (rubricas/bolsas por faixa), 2, 3 |
| Proponente | 3 |
| RevisorAdHoc | 3 |

---

## Integracao com Outros Modulos

| Modulo | Papel |
|--------|-------|
| M010 | Fornece Programa, Parceria e EixoEstrategico para o Fomento. |
| M001 | Fornece modalidades, niveis e versoes ativas de bolsa configuradas por faixa. |
| M008 | Fornece Rubricas, AreaTecnica, Instituicoes, NivelAcademico e PessoaFisica. |
| M021 | Fornece a base de formularios versionados usados na selecao. |
| M022 | Consome propostas aprovadas para contratacao e assinatura do termo de outorga. |
| M003 | Recebe a iniciativa apos contratacao no M022. |
