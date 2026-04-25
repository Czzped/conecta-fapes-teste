# Jornada — Criacao e Ativacao do Programa

[← Voltar ao Indice](README.md) | [Processo](processo.md) | [Estrutural](modelo-estrutural.md) | [Comportamental](modelo-comportamental.md)

---

## Jornada do Usuario

```mermaid
journey
    title Criacao e Ativacao do Programa

    section 1. Criacao
      1.1 Cadastrar Programa em planejamento: 4: Area Tecnica
      1.2 Informar exatamente uma Instituicao demandante: 4: Area Tecnica
      1.3 Selecionar eixos estrategicos: 4: Area Tecnica, Planejamento
      1.4 Informar periodo, objetivo, beneficios e riscos: 4: Area Tecnica
      1.5 Cadastrar comite de governanca: 3: Area Tecnica

    section 2. Validacao
      2.1 Validar Instituicao demandante: 4: Area Tecnica
      2.2 Validar vinculo com eixos estrategicos: 4: Area Tecnica, Planejamento
      2.3 Validar comite de governanca: 3: Area Tecnica
      2.4 Complementar cadastro quando necessario: 2: Area Tecnica

    section 3. Ativacao
      3.1 Solicitar ativacao: 4: Area Tecnica
      3.2 Ativar Programa: 5: Area Tecnica
      3.3 Disponibilizar Programa para editais e iniciativas: 5: Area Tecnica
```

## Etapas

| # | Etapa | Ator principal | Resultado |
|---|-------|----------------|-----------|
| 1 | Criacao | Area Tecnica | Programa criado em `EM_PLANEJAMENTO`. |
| 2 | Instituicao demandante | Area Tecnica | Programa vinculado a exatamente uma Instituicao demandante. |
| 3 | Eixos estrategicos | Area Tecnica / Planejamento | Programa associado a pelo menos um eixo estrategico. |
| 4 | Governanca | Area Tecnica | Comite de governanca cadastrado. |
| 5 | Ativacao | Area Tecnica | Programa transita para `ATIVO`. |

## Referencia de Regras

Regras aplicaveis: `RN01`, `RN16`. As definicoes oficiais ficam em [M010 — Regras de Negocio](../README.md#regras-de-negocio-consolidadas).
