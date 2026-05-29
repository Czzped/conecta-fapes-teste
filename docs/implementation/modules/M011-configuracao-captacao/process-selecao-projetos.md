# Processo 3 — Selecao dos Projetos

## Visao Geral

Execucao concreta da captacao a partir de uma Captacao publicada (Processo 2). Cobre desde a
publicacao ate a divulgacao do resultado final.

Dois tipos de chamamento com pontos de entrada distintos:

- **Chamada Publica**: captacao aberta regida por edital; qualquer proponente habilitado pode submeter proposta dentro do periodo de recebimento.
- **Demanda Induzida**: captacao direcionada a um outorgado especifico (PF ou PJ). Quando PJ, a proposta e conduzida pelo contato PF indicado.

Em ambos os casos, o fluxo de analise, resultado e revisao e identico.

O M011 termina na publicacao do resultado final. Assinatura do termo de outorga e contratacao pertencem ao M022.

---

## Atores

| Ator | Papel no processo |
|------|-------------------|
| AnalistaTecnico | Publica captacao, conduz analise documental, distribui para revisores, consolida, classifica e publica resultados |
| GestorFAPES | Pode pausar e retomar a captacao em qualquer ponto do processo de selecao apos a publicacao |
| Proponente | Elabora e submete a proposta; solicita revisao do resultado preliminar |
| ResponsavelInstitucional | Assina a proposta antes da submissao formal — apenas quando `exigeAprovacaoInstitucional = true` |
| RevisorAdHoc | Registra parecer e nota de merito para cada proposta distribuida |

---

## Fluxo Principal

```mermaid
flowchart TD
    subgraph AnalistaTecnico[AnalistaTecnico]
        A1[Publicar captacao na data definida no cronograma]
        E[Encerrar periodo de recebimento]
        F[Analisar documentacao enviada]
        G{Documentacao habilitada?}
        H[Registrar inabilitacao com justificativa]
        I[Distribuir proposta aos revisores ad hoc]
        K[Consolidar pareceres e notas]
        L[Classificar propostas]
        M[Publicar resultado preliminar]
        O{Ha revisoes admissiveis?}
        P[Analisar revisoes]
        Q[Atualizar classificacao]
        R[Manter classificacao]
        S[Publicar resultado apos revisao]
        T[Publicar resultado final]
    end

    subgraph Proponente[Proponente]
        D[Elaborar proposta]
        D1{Exige assinatura institucional?}
        D2[Solicitar assinatura ao ResponsavelInstitucional]
        D3[Submeter proposta formalmente]
        N[Solicitar revisao do resultado preliminar]
    end

    subgraph ResponsavelInstitucional[ResponsavelInstitucional — condicional]
        RI1{Aprova proposta?}
        RI2[Assinar proposta]
        RI3[Recusar com justificativa]
    end

    subgraph RevisorAdHoc[RevisorAdHoc]
        J[Registrar parecer, nota e recomendacao]
    end

    A1 --> D --> D1
    D1 -->|Sim| D2 --> RI1
    RI1 -->|Sim| RI2 --> D3
    RI1 -->|Nao| RI3 --> D
    D1 -->|Nao| D3
    D3 --> E --> F --> G
    G -->|Nao| H
    G -->|Sim| I --> J --> K --> L --> M --> N --> O
    O -->|Sim| P --> Q --> S
    O -->|Nao| R --> S
    S --> T
```

---

## Atividades e Responsaveis

| # | Atividade | Responsavel | Descricao |
|---|-----------|-------------|-----------|
| 1 | Publicar captacao | AnalistaTecnico | Na data de publicacao definida no cronograma, a captacao fica visivel e disponivel para os proponentes. |
| 2 | Elaborar proposta | Proponente | Proponente preenche os campos da proposta conforme a matriz de configuracao definida na captacao. |
| 3 | Solicitar assinatura institucional | Proponente | **Condicional** — apenas quando `exigeAprovacaoInstitucional = true`. Proponente envia a proposta para o ResponsavelInstitucional assinar antes do prazo de submissao. |
| 4 | Assinar ou recusar proposta | ResponsavelInstitucional | **Condicional**. Responsavel assina a proposta (aprova) ou recusa com justificativa, devolvendo ao proponente para correcao. Deve ocorrer dentro do periodo de submissao. |
| 5 | Submeter proposta formalmente | Proponente | Proposta e submetida ao sistema. Quando exigida, so pode ser submetida apos assinatura institucional. |
| 6 | Encerrar periodo de recebimento | AnalistaTecnico | Ao atingir a data final, nenhuma nova proposta e aceita. Propostas sem assinatura institucional sao descartadas quando exigido. |
| 7 | Analisar documentacao | AnalistaTecnico | Confere a documentacao enviada por cada proponente e habilita ou inabilita a proposta. Inabilitacao requer justificativa. |
| 8 | Distribuir propostas aos revisores | AnalistaTecnico | Propostas habilitadas sao distribuidas ao pool de revisores ad hoc conforme regras de distribuicao configuradas. |
| 9 | Registrar parecer e nota | RevisorAdHoc | Cada revisor registra parecer, nota e recomendacao de merito para as propostas distribuidas, dentro do periodo de analise de merito. |
| 10 | Consolidar pareceres | AnalistaTecnico | Reune pareceres e notas de todos os revisores por proposta. |
| 11 | Classificar propostas | AnalistaTecnico | Ordena propostas habilitadas com base nas notas consolidadas. |
| 12 | Publicar resultado preliminar | AnalistaTecnico | Classificacao preliminar fica disponivel aos proponentes. |
| 13 | Solicitar revisao | Proponente | Dentro do periodo de recursos, proponente pode questionar o resultado preliminar indicando o ponto contestado e a justificativa. |
| 14 | Analisar revisoes | AnalistaTecnico | Confere admissibilidade e reavalia o ponto questionado. Atualiza classificacao quando pertinente ou mantem sem alteracao. |
| 15 | Publicar resultado apos revisao | AnalistaTecnico | Decisoes sobre recursos e eventuais ajustes de classificacao ficam disponiveis. |
| 16 | Publicar resultado final | AnalistaTecnico | Resultado final publicado. Processo de selecao encerrado no M011. Propostas aprovadas disponibilizadas para o M022. |

---

## Subprocesso: Pausa da Captacao

O GestorFAPES pode pausar a captacao em qualquer momento apos a publicacao. Durante a pausa, todas as operacoes do processo de selecao ficam bloqueadas. A retomada exige verificacao obrigatoria das datas do cronograma — periodos futuros expirados devem ser aditados antes de o sistema permitir a retomada.

```mermaid
flowchart TD
    subgraph GestorFAPES[GestorFAPES]
        P1[Registrar pausa com justificativa]
        P4[Solicitar retomada]
        P5[Registrar AdiamentoPeriodoCronograma\npara cada periodo expirado]
        P6[Solicitar retomada novamente]
    end

    subgraph Sistema[Sistema]
        S1[Bloquear operacoes de selecao:\nsubmissao, parecer, avanco de etapas]
        S2[Captacao PAUSADO — aguarda retomada]
        S3{Todos os periodos futuros\ncom dataFim >= hoje?}
        S4[Rejeitar retomada —\nexibir periodos expirados]
        S5[Retomada autorizada —\nCaptacao volta a PUBLICADO]
    end

    PUBLICADO --> P1 --> S1 --> S2
    S2 --> P4 --> S3
    S3 -->|Nao| S4 --> P5 --> P6 --> S3
    S3 -->|Sim| S5
    S5 --> PUBLICADO_retomado[PUBLICADO — processo continua\ndo ponto em que estava]
```

---

## Subprocesso: Demanda Induzida

```mermaid
flowchart TD
    subgraph Proponente[Proponente]
        A[Captacao publicada como Demanda Induzida]
        B{Tipo do outorgado}
        C[Outorgado PF acessa e elabora proposta]
        D[Contato PF da PJ elabora proposta em nome da organizacao]
    end

    A --> B
    B -->|PESSOA_FISICA| C --> E[Segue fluxo principal]
    B -->|PESSOA_JURIDICA| D --> E
```

---

## Subprocesso: Revisao do Resultado

```mermaid
flowchart TD
    subgraph Proponente[Proponente]
        A[Solicitar revisao indicando ponto questionado e justificativa]
    end

    subgraph AnalistaTecnico[AnalistaTecnico]
        B[Conferir admissibilidade]
        C{Admissivel?}
        D[Registrar indeferimento com justificativa]
        E[Reavaliar ponto questionado]
        F{Revisao altera resultado?}
        G[Manter classificacao]
        H[Atualizar nota ou classificacao]
        I[Consolidar respostas de todas as revisoes]
        J[Publicar resultado apos revisao]
        K[Publicar resultado final]
    end

    A --> B --> C
    C -->|Nao| D --> I
    C -->|Sim| E --> F
    F -->|Nao| G --> I
    F -->|Sim| H --> I
    I --> J --> K
```

---

## Marcos Temporais

| Marco | Efeito operacional | Responsavel |
|-------|--------------------|-------------|
| Data de publicacao | Captacao fica visivel para os proponentes | AnalistaTecnico |
| Periodo de submissao (inicio a fim) | Proponentes elaboram e submetem propostas. Quando `exigeAprovacaoInstitucional = true`, assinatura institucional deve ocorrer dentro deste mesmo periodo. | Proponente + ResponsavelInstitucional |
| Encerramento do recebimento | Nenhuma proposta aceita apos a data final. Propostas sem assinatura institucional descartadas quando exigido. | AnalistaTecnico |
| Periodo de analise documental | AnalistaTecnico habilita ou inabilita propostas | AnalistaTecnico |
| Periodo de analise de merito | Revisores registram pareceres e notas | RevisorAdHoc |
| Data de publicacao do resultado preliminar | Classificacao preliminar disponivel aos proponentes | AnalistaTecnico |
| Periodo de recursos | Proponentes podem solicitar revisao do resultado preliminar | Proponente |
| Data de publicacao do resultado apos revisao | Decisoes sobre recursos disponibilizadas | AnalistaTecnico |
| Data de publicacao do resultado final | Resultado final disponivel; M011 encerrado pelo AnalistaTecnico; propostas aprovadas consumidas pelo M022 | AnalistaTecnico |
| `RESULTADO_FINAL.dataFim` sem publicacao manual | Sistema encerra automaticamente a captacao por expiracao. Propostas aprovadas ate entao ficam disponiveis ao M022 | Sistema |

---

## Estados da Instancia

```mermaid
stateDiagram-v2
    [*] --> Publicada : AnalistaTecnico publica captacao
    Publicada --> RecebendoPropostas : Periodo de submissao iniciado
    RecebendoPropostas --> EmHabilitacao : Periodo de submissao encerrado
    EmHabilitacao --> EmAnalise : Propostas habilitadas distribuidas aos revisores
    EmAnalise --> ResultadoPreliminarPublicado : Pareceres consolidados e resultado publicado
    ResultadoPreliminarPublicado --> EmRevisao : Ha solicitacoes de revisao admissiveis
    ResultadoPreliminarPublicado --> ResultadoFinalPublicado : Sem revisoes admissiveis
    EmRevisao --> ResultadoFinalPublicado : Revisoes analisadas e resultado final publicado
    ResultadoFinalPublicado --> Encerrada : AnalistaTecnico encerra apos publicar resultado final
    ResultadoFinalPublicado --> Encerrada : Sistema expira ao atingir RESULTADO_FINAL.dataFim
    Publicada --> Encerrada : GestorFAPES cancela administrativamente
    Pausada --> Encerrada : GestorFAPES cancela administrativamente
    Encerrada --> [*]

    Publicada --> Pausada : GestorFAPES pausa com justificativa
    RecebendoPropostas --> Pausada : GestorFAPES pausa com justificativa
    EmHabilitacao --> Pausada : GestorFAPES pausa com justificativa
    EmAnalise --> Pausada : GestorFAPES pausa com justificativa
    ResultadoPreliminarPublicado --> Pausada : GestorFAPES pausa com justificativa
    EmRevisao --> Pausada : GestorFAPES pausa com justificativa
    Pausada --> Publicada : GestorFAPES retoma (apos aditamento de cronograma se necessario)

    note right of Pausada
        Todas as operacoes bloqueadas.
        Cronograma nao avanca.
        GestorFAPES pode aditaretapas antes de retomar.
    end note
```

---

## Regras de Negocio

| ID | Responsavel | Regra |
|----|-------------|-------|
| RN-SP01 | AnalistaTecnico | A captacao somente fica visivel para os proponentes a partir da data de publicacao definida no cronograma. |
| RN-SP02 | Proponente | Propostas somente podem ser submetidas entre a data inicial e a data final do periodo de recebimento. |
| RN-SP03 | Proponente | Quando `exigeAprovacaoInstitucional = true`, a proposta so pode ser submetida formalmente apos a assinatura do ResponsavelInstitucional. |
| RN-SP04 | ResponsavelInstitucional | A assinatura institucional deve ocorrer dentro do periodo de submissao. Recusa deve ter justificativa e devolve a proposta ao proponente. |
| RN-SP05 | AnalistaTecnico | Somente propostas com documentacao habilitada seguem para analise de merito. Inabilitacao requer justificativa. |
| RN-SP06 | RevisorAdHoc | Revisores somente podem registrar pareceres dentro do periodo de analise de merito. |
| RN-SP07 | AnalistaTecnico | O resultado preliminar deve ser publicado antes do inicio do periodo de recursos. |
| RN-SP08 | Proponente | Solicitacoes de revisao somente podem ser enviadas dentro do periodo de recursos. |
| RN-SP09 | AnalistaTecnico | O resultado final somente pode ser publicado apos o encerramento e analise de todas as revisoes admissiveis. |
| RN-SP10 | AnalistaTecnico | A publicacao do resultado final pelo AnalistaTecnico encerra o processo de selecao no M011 (encerramento normal). |
| RN-SP16 | Sistema | Quando `RESULTADO_FINAL.dataFim` e atingida sem publicacao manual do resultado final, o Sistema encerra a captacao automaticamente (expiração). |
| RN-SP17 | GestorFAPES | O GestorFAPES pode cancelar a captacao administrativamente a partir dos estados PUBLICADO ou PAUSADO, com justificativa obrigatoria. Propostas aprovadas nao sao consumidas pelo M022 apos cancelamento. |
| RN-SP11 | AnalistaTecnico | Quando `tipoCaptacao = DEMANDA_INDUZIDA` e outorgado for PJ, a proposta e conduzida pelo contato PF indicado na configuracao. |
| RN-SP12 | AnalistaTecnico | Propostas aprovadas ficam disponiveis para consumo pelo M022 apos a publicacao do resultado final. |
| RN-SP13 | GestorFAPES | O processo de selecao pode ser pausado em qualquer ponto apos a publicacao da captacao. A pausa requer justificativa obrigatoria. |
| RN-SP14 | Sistema | Durante a pausa, nenhuma operacao e permitida: proponentes nao podem submeter nem solicitar revisao, revisores nao podem registrar pareceres, e o AnalistaTecnico nao pode avancar etapas. |
| RN-SP15 | Sistema | A retomada e bloqueada pelo sistema enquanto existir qualquer periodo futuro nao concluido com `dataFim` anterior a data de retomada. O GestorFAPES deve registrar `AdiamentoPeriodoCronograma` para cada periodo expirado antes de acionar a retomada. O sistema nao compensa automaticamente o tempo de pausa. |

---

## Integracao

| Modulo | Papel |
|--------|-------|
| M008 | Fornece dados de PessoaFisica para revisores e para o contato PF do outorgado PJ. |
| M021 | Formularios selecionados na configuracao estruturam a coleta na submissao, avaliacao e revisao. |
| M022 | Consome propostas aprovadas para contratacao e assinatura do termo de outorga. |
