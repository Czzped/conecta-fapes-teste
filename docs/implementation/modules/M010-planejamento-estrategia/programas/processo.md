# Processo — Programas

[← Voltar ao M010](../README.md) | [Estrutural](modelo-estrutural.md) | [Comportamental](modelo-comportamental.md)

---

## Visao Geral

O processo de Programas foi dividido em fluxos independentes para explicitar as principais operacoes do ciclo de vida. Todo Programa possui exatamente uma Instituicao demandante, informada no cadastro e mantida como referencia institucional do Programa.

1. **Criacao e ativacao do Programa** — cadastro inicial, vinculacao a Instituicao demandante, eixos estrategicos e comite de governanca.
2. **Aditivo de tempo do Programa** — alteracao de datas do Programa, preservando a compatibilidade com Parcerias aportantes.
3. **Aditivo financeiro do Programa** — recebimento de aporte de uma ou mais Parcerias por meio de `AporteFinanceiroPrograma`.
4. **Retirada de aporte de Parceria do Programa** — remocao ou estorno de uma alocacao financeira quando ainda nao houver execucao vinculada.
5. **Suspensao do Programa** — interrupcao temporaria por decisao da Area Tecnica ou por cascata de Parceria.
6. **Reativacao do Programa** — retorno do Programa suspenso para `ATIVO` apos a resolucao da causa de suspensao.
7. **Encerramento ou remocao do Programa** — finalizacao do Programa ou remocao em caso permitido.
8. **Execucao operacional do Programa** — criacao ou vinculacao de editais e iniciativas a partir de um Programa ativo.
9. **Acompanhamento do Programa** — consulta de indicadores, aportes, eixos, comite e iniciativas vinculadas.

---

## Fluxo 1 — Criacao e Ativacao do Programa

Este fluxo inicia quando a Area Tecnica cria um Programa de fomento. O Programa nasce em `EM_PLANEJAMENTO` e so pode ser ativado quando possui exatamente uma Instituicao demandante, pelo menos um eixo estrategico e comite de governanca definido.

```mermaid
flowchart TB
    inicio((Inicio))
    fim((Programa Ativo))

    subgraph area["Area Tecnica"]
        A1["Cadastrar Programa"]
        A2["Informar exatamente uma Instituicao demandante"]
        A3["Informar periodo do Programa"]
        A4["Definir objetivo, beneficios, resultados e riscos"]
        A5["Solicitar ativacao"]
        G1{"Programa apto para ativacao?"}
        A6["Ativar Programa"]
        A7["Complementar cadastro"]
    end

    subgraph planejamento["Planejamento / M010"]
        P1["Selecionar eixos estrategicos"]
    end

    subgraph governanca["Governanca do Programa"]
        C1["Cadastrar Comite de Governanca"]
        C2["Cadastrar membros do comite"]
    end

    inicio --> A1 --> A2 --> P1 --> A3 --> A4 --> C1 --> C2 --> A5 --> G1
    G1 -- "Nao" --> A7 --> A2
    G1 -- "Sim" --> A6 --> fim
```

### Atividades da criacao

| # | Atividade | Responsavel | Resultado |
|---|-----------|-------------|-----------|
| 1 | Cadastrar Programa | Area Tecnica | Programa criado em `EM_PLANEJAMENTO`. |
| 2 | Informar Instituicao demandante | Area Tecnica | Programa vinculado a exatamente uma Instituicao demandante; o cadastro sem Instituicao ou com mais de uma Instituicao deve ser rejeitado. |
| 3 | Selecionar eixos estrategicos | Area Tecnica / Planejamento | Programa associado a pelo menos um eixo estrategico. |
| 4 | Informar periodo do Programa | Area Tecnica | Datas de inicio e fim registradas. |
| 5 | Cadastrar Comite de Governanca | Area Tecnica | Comite e membros definidos. |
| 6 | Ativar Programa | Area Tecnica | Programa transita para `ATIVO` e fica apto a orientar editais e iniciativas. |

---

## Fluxo 2 — Aditivo de Tempo do Programa

Este fluxo trata a alteracao do periodo do Programa a partir de uma solicitacao da Instituicao demandante. Quando o Programa ja recebeu aportes de Parcerias, a nova data de inicio e a nova data de fim precisam permanecer dentro da vigencia corrente de todas as Parcerias aportantes.

```mermaid
flowchart TB
    inicio((Programa existente))
    fim((Periodo atualizado))

    subgraph instituicao["Instituicao Demandante"]
        I1["Solicitar aditivo de tempo"]
        I2["Enviar justificativa e novo periodo desejado"]
        I3["Complementar solicitacao quando necessario"]
    end

    subgraph area["Area Tecnica"]
        A1["Receber solicitacao de aditivo"]
        A2["Selecionar Programa"]
        A3["Analisar justificativa e novo periodo"]
        A4["Confirmar alteracao"]
        A5["Revisar datas"]
    end

    subgraph parcerias["Parcerias / M010"]
        P1["Listar Parcerias aportantes"]
        P2["Validar vigencia corrente das Parcerias"]
        G1{"Novo periodo respeita as vigencias?"}
    end

    inicio --> I1 --> I2 --> A1 --> A2 --> A3 --> P1 --> P2 --> G1
    G1 -- "Nao" --> A5 --> I3 --> A3
    G1 -- "Sim" --> A4 --> fim
```

### Atividades do aditivo de tempo

| # | Atividade | Responsavel | Resultado |
|---|-----------|-------------|-----------|
| 1 | Solicitar aditivo de tempo | Instituicao Demandante | Pedido de alteracao de prazo iniciado pela Instituicao que demanda o Programa. |
| 2 | Enviar justificativa e novo periodo | Instituicao Demandante | Motivo e datas desejadas encaminhados para analise. |
| 3 | Selecionar Programa | Area Tecnica | Programa identificado para alteracao. |
| 4 | Analisar justificativa e periodo | Area Tecnica | Solicitacao validada do ponto de vista operacional. |
| 5 | Validar Parcerias aportantes | Parcerias / M010 | Verificacao da compatibilidade temporal com as Parcerias que aportam no Programa. |
| 6 | Confirmar alteracao | Area Tecnica | Periodo atualizado quando as regras forem atendidas. |

---

## Fluxo 3 — Aditivo Financeiro do Programa

Este fluxo trata o recebimento de recursos de uma Parceria a partir de uma solicitacao da Instituicao demandante. O Programa nao recebe uma relacao direta com Parceria; o vinculo financeiro e criado por `AporteFinanceiroPrograma`. Um Programa pode receber aportes de mais de uma Parceria.

```mermaid
flowchart TB
    inicio((Programa existente))
    fim((Aporte registrado))

    subgraph instituicao["Instituicao Demandante"]
        I1["Solicitar aditivo financeiro"]
        I2["Enviar justificativa e valor solicitado"]
        I3["Complementar solicitacao quando necessario"]
    end

    subgraph area["Area Tecnica"]
        A1["Receber solicitacao de aditivo"]
        A2["Selecionar Programa"]
        A3["Analisar justificativa e valor solicitado"]
        A4["Confirmar recebimento no Programa"]
        A5["Revisar solicitacao"]
    end

    subgraph parcerias["Area de Parcerias"]
        P1["Selecionar Parceria vigente"]
        P2["Consultar saldo da Parceria"]
        P3["Validar periodo do Programa"]
        G1{"Parceria apta e saldo suficiente?"}
        P4["Registrar AporteFinanceiroPrograma"]
        P5["Recalcular saldo da Parceria"]
    end

    inicio --> I1 --> I2 --> A1 --> A2 --> A3 --> P1 --> P2 --> P3 --> G1
    G1 -- "Nao" --> A5 --> I3 --> A3
    G1 -- "Sim" --> P4 --> P5 --> A4 --> fim
```

### Atividades do aditivo financeiro

| # | Atividade | Responsavel | Resultado |
|---|-----------|-------------|-----------|
| 1 | Solicitar aditivo financeiro | Instituicao Demandante | Pedido de reforco financeiro iniciado pela Instituicao que demanda o Programa. |
| 2 | Enviar justificativa e valor solicitado | Instituicao Demandante | Motivo e valor desejado encaminhados para analise. |
| 3 | Selecionar Programa | Area Tecnica | Programa que recebera o aporte identificado. |
| 4 | Analisar justificativa e valor | Area Tecnica | Solicitacao validada do ponto de vista tecnico. |
| 5 | Selecionar Parceria vigente | Area de Parcerias | Parceria aportante identificada. |
| 6 | Validar saldo da Parceria | Area de Parcerias | Garante que a alocacao nao deixa saldo negativo. |
| 7 | Validar periodo do Programa | Area de Parcerias | Garante que o Programa esta dentro da vigencia da Parceria aportante. |
| 8 | Registrar `AporteFinanceiroPrograma` | Area de Parcerias | Recurso alocado ao Programa com rastreabilidade da origem. |
| 9 | Recalcular saldo da Parceria | Area de Parcerias | Saldo disponivel da Parceria atualizado. |

---

## Fluxo 4 — Retirada de Aporte de Parceria do Programa

Este fluxo trata a retirada de um `AporteFinanceiroPrograma`. A retirada pode ser solicitada pela Instituicao Demandante ou pela Area Tecnica. A retirada direta so e permitida quando o valor ainda nao foi alocado em iniciativas ou outras execucoes vinculadas ao Programa. Quando o dinheiro ja estiver alocado, a retirada deve ser bloqueada ate que as iniciativas afetadas sejam canceladas, reduzidas ou realocadas formalmente.

O principal impacto e financeiro-operacional: a retirada devolve saldo para a Parceria e reduz o total disponivel do Programa. Pode haver impacto de tempo quando a retirada exigir cancelamento ou replanejamento de iniciativas, pois o Programa pode precisar suspender publicacoes ou revisar seu cronograma antes de concluir a retirada.

```mermaid
flowchart TB
    inicio((Aporte alocado ao Programa))
    fim1((Aporte retirado))
    fim2((Retirada bloqueada ate ajuste operacional))

    subgraph instituicao["Instituicao Demandante"]
        I1["Solicitar retirada do aporte"]
        I2["Enviar justificativa"]
    end

    subgraph area["Area Tecnica"]
        A0["Solicitar retirada do aporte"]
        A1["Receber solicitacao de retirada"]
        A2["Selecionar Programa"]
        A3["Identificar aporte da Parceria"]
        A4["Analisar impacto no Programa"]
        A5["Confirmar retirada"]
        A6["Solicitar cancelamento ou ajuste das iniciativas afetadas"]
    end

    subgraph parcerias["Area de Parcerias"]
        P1["Validar AporteFinanceiroPrograma"]
        P2["Reverter alocacao do aporte"]
        P3["Recalcular saldo da Parceria"]
    end

    subgraph iniciativas["Iniciativas e Execucoes / M003-M011"]
        E1["Verificar dinheiro ja alocado"]
        G1{"Valor ja esta alocado em iniciativa ou execucao?"}
        E2["Cancelar, reduzir ou realocar iniciativas afetadas"]
        G2{"Ajuste operacional concluido?"}
    end

    inicio --> I1 --> I2 --> A1 --> A2 --> A3 --> P1 --> E1 --> G1
    inicio --> A0 --> A2
    G1 -- "Nao" --> A4 --> A5 --> P2 --> P3 --> fim1
    G1 -- "Sim" --> A6 --> E2 --> G2
    G2 -- "Nao" --> fim2
    G2 -- "Sim" --> A4 --> A5
```

### Atividades da retirada de aporte

| # | Atividade | Responsavel | Resultado |
|---|-----------|-------------|-----------|
| 1 | Solicitar retirada do aporte | Instituicao Demandante ou Area Tecnica | Pedido formalizado com justificativa. |
| 2 | Identificar aporte da Parceria | Area Tecnica / Area de Parcerias | `AporteFinanceiroPrograma` localizado no Programa. |
| 3 | Verificar dinheiro ja alocado | M003-M011 | Confirma se o valor foi comprometido em iniciativa ou execucao vinculada. |
| 4 | Bloquear retirada quando houver alocacao | Area Tecnica | Retirada direta impedida enquanto houver dinheiro alocado em iniciativas ou execucoes vinculadas. |
| 5 | Cancelar, reduzir ou realocar iniciativas afetadas | M003-M011 | Ajuste operacional realizado antes da retirada financeira. |
| 6 | Reverter alocacao do aporte | Area de Parcerias | Aporte retirado do Programa e saldo devolvido a Parceria. |
| 7 | Recalcular saldo da Parceria | Area de Parcerias | Saldo disponivel da Parceria atualizado. |
| 8 | Revisar impacto no cronograma | Area Tecnica | Cronograma do Programa e iniciativas afetadas e ajustado quando necessario. |

---

## Fluxo 5 — Suspensao do Programa

Este fluxo cobre a interrupcao temporaria do Programa. A suspensao pode ser solicitada diretamente pela Area Tecnica ou herdada da suspensao de uma Parceria aportante. Enquanto suspenso, o Programa nao deve gerar novas publicacoes ou novas execucoes vinculadas.

```mermaid
flowchart TB
    inicio((Programa Ativo))
    fim((Programa Suspenso))

    subgraph area["Area Tecnica"]
        A1["Solicitar suspensao do Programa"]
        A2["Informar motivo da suspensao"]
        A3["Suspender Programa"]
    end

    subgraph parcerias["Parcerias / M010"]
        P1["Receber suspensao em cascata da Parceria"]
        P2["Registrar motivo herdado da Parceria"]
    end

    subgraph iniciativas["Iniciativas e Editais / M003-M011"]
        I1["Bloquear novas publicacoes"]
        I2["Notificar iniciativas vinculadas"]
    end

    inicio --> A1 --> A2 --> A3
    inicio --> P1 --> P2 --> A3
    A3 --> I1 --> I2 --> fim
```

### Atividades da suspensao

| # | Atividade | Responsavel | Resultado |
|---|-----------|-------------|-----------|
| 1 | Solicitar suspensao | Area Tecnica ou Parcerias / M010 | Pedido de suspensao registrado. |
| 2 | Informar motivo | Area Tecnica ou Parcerias / M010 | Motivo proprio ou herdado da Parceria registrado. |
| 3 | Suspender Programa | Area Tecnica | Programa transita para `SUSPENSO`. |
| 4 | Bloquear novas publicacoes | M003-M011 | Novos editais, iniciativas ou execucoes vinculadas ficam bloqueados. |
| 5 | Notificar iniciativas vinculadas | M003-M011 | Areas responsaveis sao informadas da suspensao. |

---

## Fluxo 6 — Reativacao do Programa

Este fluxo trata o retorno de um Programa suspenso para `ATIVO`. A reativacao pode ser solicitada pela Instituicao demandante ou pela Area Tecnica. Quando a suspensao foi herdada de uma Parceria, o Programa so pode ser reativado depois que a Parceria aportante tambem estiver reativada ou nao estiver mais bloqueando a execucao.

```mermaid
flowchart TB
    inicio((Programa Suspenso))
    fim((Programa Ativo))

    subgraph instituicao["Instituicao Demandante"]
        I1["Solicitar reativacao do Programa"]
        I2["Enviar justificativa ou evidencias"]
        I3["Complementar informacoes quando necessario"]
    end

    subgraph area["Area Tecnica"]
        A0["Iniciar reativacao interna"]
        A1["Receber solicitacao de reativacao"]
        A2["Selecionar Programa suspenso"]
        A3["Analisar motivo original da suspensao"]
        A4["Verificar pendencias tecnicas"]
        G1{"Causa da suspensao foi resolvida?"}
        A5["Reativar Programa"]
        A6["Manter Programa suspenso"]
    end

    subgraph parcerias["Parcerias / M010"]
        P1["Verificar se suspensao foi herdada de Parceria"]
        G2{"Bloqueio herdado da Parceria foi resolvido?"}
    end

    subgraph iniciativas["Iniciativas e Editais / M003-M011"]
        E1["Desbloquear novas publicacoes"]
        E2["Notificar iniciativas vinculadas"]
    end

    inicio --> I1 --> I2 --> A1 --> A2 --> A3 --> P1 --> G2
    inicio --> A0 --> A2
    G2 -- "Nao" --> A6
    G2 -- "Sim ou nao se aplica" --> A4 --> G1
    G1 -- "Nao" --> A6 --> I3 --> A3
    G1 -- "Sim" --> A5 --> E1 --> E2 --> fim
```

### Atividades da reativacao

| # | Atividade | Responsavel | Resultado |
|---|-----------|-------------|-----------|
| 1 | Solicitar reativacao | Instituicao Demandante ou Area Tecnica | Pedido de retorno do Programa recebido. |
| 2 | Enviar justificativa ou evidencias | Instituicao Demandante | Comprovacao de que a causa da suspensao foi tratada. |
| 3 | Analisar motivo original | Area Tecnica | Contexto da suspensao recuperado para decisao. |
| 4 | Verificar Parcerias aportantes | Parcerias / M010 | Suspensao herdada so permite reativacao se a Parceria aportante estiver ativa ou sem bloqueio. |
| 5 | Verificar pendencias tecnicas | Area Tecnica | Confirma que nao ha impedimentos operacionais para retorno. |
| 6 | Reativar Programa | Area Tecnica | Programa transita para `ATIVO`. |
| 7 | Desbloquear publicacoes | M003-M011 | Editais e iniciativas vinculadas voltam a aceitar novas operacoes quando aplicavel. |

---

## Fluxo 7 — Encerramento ou Remocao do Programa

Este fluxo trata o encerramento definitivo do Programa e a remocao em caso de erro de cadastro. O encerramento preserva historico; a remocao pode ocorrer sem impacto quando o Programa nao possui nenhuma Iniciativa vinculada. Se ja existe Iniciativa vinculada, o Programa nao deve ser removido: deve ser encerrado para preservar a rastreabilidade operacional e financeira.

```mermaid
flowchart TB
    inicio((Programa existente))
    fim1((Programa Encerrado))
    fim2((Programa Removido))

    subgraph area["Area Tecnica"]
        A1["Selecionar Programa"]
        G1{"Acao solicitada"}
        A2["Solicitar encerramento"]
        A3["Informar justificativa"]
        A4["Encerrar Programa"]
        A5["Solicitar remocao"]
        A6["Remover Programa"]
        A7["Cancelar operacao"]
    end

    subgraph iniciativas["Iniciativas e Editais / M003-M011"]
        I1["Verificar editais vinculados para encerramento"]
        I2["Verificar iniciativas em andamento"]
        G2{"Pode encerrar?"}
        I3["Verificar iniciativas vinculadas ao Programa"]
        G3{"Existe alguma Iniciativa vinculada?"}
    end

    inicio --> A1 --> G1
    G1 -- "Encerrar" --> A2 --> A3 --> I1 --> I2 --> G2
    G1 -- "Remover" --> A5 --> I3 --> G3
    G2 -- "Sim" --> A4 --> fim1
    G2 -- "Nao" --> A7
    G3 -- "Sim" --> A7
    G3 -- "Nao" --> A6 --> fim2
```

### Atividades de encerramento ou remocao

| # | Atividade | Responsavel | Resultado |
|---|-----------|-------------|-----------|
| 1 | Selecionar Programa | Area Tecnica | Programa identificado para encerramento ou remocao. |
| 2 | Informar justificativa | Area Tecnica | Motivo do encerramento registrado. |
| 3 | Verificar editais e iniciativas | M003-M011 | Bloqueios operacionais identificados antes do encerramento. |
| 4 | Encerrar Programa | Area Tecnica | Programa transita para `ENCERRADO` e preserva historico. |
| 5 | Remover Programa | Area Tecnica | Programa removido sem impacto quando nao possui nenhuma Iniciativa vinculada. |

---

## Fluxo 8 — Execucao Operacional do Programa

Este fluxo representa o uso do Programa ativo como base para editais e iniciativas. O Programa nao executa o edital em si, mas orienta e autoriza a criacao de instrumentos operacionais nos modulos responsaveis.

```mermaid
flowchart TB
    inicio((Programa Ativo))
    fim((Edital ou Iniciativa vinculada))

    subgraph area["Area Tecnica"]
        A1["Selecionar Programa ativo"]
        A2["Definir demanda operacional"]
        G1{"Tipo de instrumento"}
        A3["Encaminhar para criacao de edital"]
        A4["Encaminhar para criacao de iniciativa"]
    end

    subgraph editais["Editais / M011"]
        E1["Criar edital vinculado ao Programa"]
        E2["Publicar edital quando autorizado"]
    end

    subgraph iniciativas["Iniciativas / M003"]
        I1["Criar iniciativa vinculada ao Programa"]
        I2["Acompanhar execucao operacional"]
    end

    inicio --> A1 --> A2 --> G1
    G1 -- "Edital" --> A3 --> E1 --> E2 --> fim
    G1 -- "Iniciativa" --> A4 --> I1 --> I2 --> fim
```

### Atividades da execucao operacional

| # | Atividade | Responsavel | Resultado |
|---|-----------|-------------|-----------|
| 1 | Selecionar Programa ativo | Area Tecnica | Programa apto a orientar editais e iniciativas. |
| 2 | Definir demanda operacional | Area Tecnica | Necessidade de edital ou iniciativa identificada. |
| 3 | Criar edital vinculado | M011 | Edital associado ao Programa. |
| 4 | Criar iniciativa vinculada | M003 | Iniciativa associada ao Programa. |
| 5 | Acompanhar execucao | Area Tecnica / M003-M011 | Situacao operacional refletida no acompanhamento do Programa. |

---

## Fluxo 9 — Acompanhamento do Programa

Este fluxo representa a consulta de gestao do Programa. Ele consolida informacoes de planejamento, governanca, aportes recebidos, saldo financeiro vinculado a Parcerias e iniciativas/editais associados.

```mermaid
flowchart TB
    inicio((Necessidade de acompanhamento))
    fim((Indicadores apresentados))

    subgraph area["Area Tecnica"]
        A1["Acessar dashboard de Programas"]
        A2["Filtrar por estado, eixo ou Instituicao demandante"]
        A3["Selecionar Programa"]
        A4["Analisar detalhes do Programa"]
    end

    subgraph planejamento["Planejamento / M010"]
        P1["Consultar eixos estrategicos"]
    end

    subgraph parcerias["Parcerias / M010"]
        F1["Consultar Parcerias aportantes"]
        F2["Consultar valores aportados ao Programa"]
    end

    subgraph iniciativas["Iniciativas e Editais / M003-M011"]
        I1["Consultar editais e iniciativas vinculadas"]
        I2["Consultar situacao operacional"]
    end

    inicio --> A1 --> A2 --> A3
    A3 --> P1 --> A4
    A3 --> F1 --> F2 --> A4
    A3 --> I1 --> I2 --> A4
    A4 --> fim
```

### Atividades de acompanhamento

| # | Atividade | Responsavel | Resultado |
|---|-----------|-------------|-----------|
| 1 | Acessar dashboard | Area Tecnica | Visao consolidada dos Programas por estado. |
| 2 | Filtrar Programas | Area Tecnica | Lista refinada por estado, eixo ou Instituicao demandante. |
| 3 | Consultar aportes | Area Tecnica / Parcerias | Valores aportados por Parceria exibidos com rastreabilidade. |
| 4 | Consultar editais e iniciativas | Area Tecnica / M003-M011 | Situacao operacional do Programa apresentada. |
| 5 | Analisar detalhes | Area Tecnica | Base para decisao de aditivo, suspensao, reativacao ou encerramento. |

## Referencia de Regras

Regras aplicaveis aos fluxos de Programas: `RN01`, `RN02`, `RN11`, `RN13`, `RN14`, `RN16`, `RI1`, `RI2`, `RI4`. As definicoes oficiais ficam em [M010 — Regras de Negocio](../README.md#regras-de-negocio-consolidadas).
