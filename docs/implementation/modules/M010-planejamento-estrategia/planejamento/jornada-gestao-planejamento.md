# Jornada — Gestao do Planejamento Estrategico

[← Voltar ao M010](../README.md) | [Processo](processo.md) | [Estrutural](modelo-estrutural.md) | [Comportamental](modelo-comportamental.md)

---

## Jornada do Usuario

```mermaid
journey
    title Gestao do Planejamento Estrategico

    section 1. Criacao do Plano
      1.1 Acessar gestao do Planejamento Estrategico: 4: Area Tecnica
      1.2 Cadastrar Plano com nome, descricao e vigencia: 4: Area Tecnica
      1.3 Validar se ja existe Plano ativo: 3: Planejamento
      1.4 Salvar Plano ativo ou inativo: 4: Area Tecnica, Planejamento

    section 2. Eixos Estrategicos
      2.1 Selecionar Plano Estrategico: 4: Area Tecnica
      2.2 Cadastrar ou atualizar Eixo Estrategico: 4: Area Tecnica
      2.3 Informar prioridade do Eixo: 4: Area Tecnica
      2.4 Validar vinculo do Eixo com o Plano: 4: Planejamento

    section 3. Ativacao
      3.1 Solicitar ativacao de Plano: 3: Area Tecnica
      3.2 Confirmar substituicao do Plano ativo: 3: Area Tecnica
      3.3 Desativar Plano anterior: 4: Planejamento
      3.4 Ativar Plano selecionado: 5: Planejamento

    section 4. Acompanhamento
      4.1 Consultar dashboard do Plano: 4: Area Tecnica
      4.2 Visualizar Eixos Estrategicos: 4: Area Tecnica
      4.3 Consultar Programas vinculados aos Eixos: 4: Area Tecnica, Programas
      4.4 Analisar alinhamento estrategico: 5: Area Tecnica
```

## Etapas

| # | Etapa | Ator principal | Resultado |
|---|-------|----------------|-----------|
| 1 | Criacao do Plano | Area Tecnica | Plano Estrategico cadastrado com nome, descricao e vigencia. |
| 2 | Definicao de ativacao | Planejamento / M010 | Plano salvo como ativo quando nao houver outro Plano ativo; caso contrario, permanece inativo. |
| 3 | Cadastro de Eixos | Area Tecnica | Eixos Estrategicos cadastrados ou atualizados dentro de exatamente um Plano. |
| 4 | Priorizacao de Eixos | Area Tecnica | Ordem de prioridade definida para orientar Programas. |
| 5 | Ativacao ou substituicao | Area Tecnica / Planejamento | Plano selecionado torna-se ativo e o Plano anterior e desativado. |
| 6 | Acompanhamento | Area Tecnica | Dashboard apresenta Plano, Eixos e Programas vinculados. |

## Pontos de Atencao

| Momento | Atencao |
|---------|---------|
| Criacao do Plano | So pode haver um Plano ativo por vez. |
| Eixos Estrategicos | Cada Eixo deve pertencer a exatamente um Plano Estrategico. |
| Remocao de Eixo | A remocao deve ser bloqueada quando houver Programa orientado pelo Eixo. |
| Ativacao | A substituicao do Plano ativo deve ser confirmada para preservar clareza historica. |
| Acompanhamento | O dashboard deve evidenciar quais Programas executam cada diretriz estrategica. |

## Referencia de Regras

Regras aplicaveis: `RN01`, `RN08`, `RN09`. As definicoes oficiais ficam em [M010 — Regras de Negocio](../README.md#regras-de-negocio-consolidadas).
