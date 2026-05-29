# Processo 2 — Configuracao da Selecao

## Visao Geral

O Processo de Configuracao da Selecao e conduzido pelo AnalistaTecnico a partir de um Fomento
aprovado. Neste processo sao definidos:

- o tipo de chamamento (Chamada Publica ou Demanda Induzida);
- as faixas do Fomento ativadas nesta captacao;
- as datas das etapas do processo de selecao;
- os formularios, regras de submissao, requisitos do proponente, revisores ad hoc e exigencias de prestacao.

O resultado e uma `Captacao` com estado `PUBLICADO`, pronta para iniciar o Processo 3.

---

## Atores

| Ator | Papel no processo |
|------|-------------------|
| AnalistaTecnico | Configura e publica a captacao; encerra apos publicar resultado final |
| GestorFAPES | Pausa, retoma e cancela administrativamente a captacao |
| Sistema | Encerra automaticamente a captacao quando `RESULTADO_FINAL.dataFim` e atingida sem publicacao manual |

---

## Fluxo do Processo

```mermaid
flowchart TD
    subgraph AnalistaTecnico[AnalistaTecnico]
        A[Selecionar Fomento aprovado]
        B[Criar Captacao com titulo e descricao]
        C[Definir tipo de chamamento]
        E{Tipo de chamamento}
        TO[Definir tipo do outorgado — PF ou PJ]
        F[Informar link do edital ou anexar documento]
        G[Selecionar outorgado destinatario]
        GA{Tipo do outorgado}
        GB[Informar CPF e nome — PF]
        GC[Informar CNPJ, razao social e contato PF — PJ]
        FAI[Selecionar faixas do Fomento para esta captacao]
        H[Definir categorias e tipos de iniciativas aceitos]
        J[Configurar regras de submissao]
        JA{Exige aprovacao institucional?}
        JB[Habilitar solicitacao de assinatura institucional na submissao]
        K{Submissao restrita a escolhidos?}
        L[Selecionar proponentes autorizados]
        M[Configurar requisitos do proponente]
        N[Configurar documentos exigidos]
        O[Configurar regras de avaliacao de merito]
        P[Selecionar pool de revisores ad hoc]
        R[Definir exigencia de prestacao tecnica e financeira]
        S[Selecionar formularios no M021]
        MX[Configurar matriz de campos da proposta]
        W0[Definir data de publicacao da captacao]
        W1[Definir periodo de submissao de propostas]
        W2[Definir periodo de analise documental]
        W3[Definir periodo de avaliacao ad hoc]
        W4[Definir data de publicacao do resultado preliminar]
        W5[Definir periodo de recebimento de revisoes]
        W6[Definir data de publicacao do resultado apos revisao]
        W7[Definir data de publicacao do resultado final]
        X[Validar configuracao]
        Y{Configuracao valida?}
        Z[Publicar Captacao]
    end

    A --> B --> C --> E
    E -->|CHAMADA_PUBLICA| TO --> F
    E -->|DEMANDA_INDUZIDA| G --> GA
    GA -->|PESSOA_FISICA| GB --> F
    GA -->|PESSOA_JURIDICA| GC --> F
    F --> FAI --> H --> J --> JA
    JA -->|Sim| JB --> K
    JA -->|Nao| K
    K -->|Sim| L --> M
    K -->|Nao| M
    M --> N --> O --> P --> R --> S
    S --> MX --> W0 --> W1 --> W2 --> W3 --> W4 --> W5 --> W6 --> W7
    W7 --> X --> Y
    Y -->|Nao| C
    Y -->|Sim| Z
    Z --> ZA[Captacao disponivel para o Processo 3]
```

---

## Atividades e Responsaveis

| # | Atividade | Responsavel | Descricao |
|---|-----------|-------------|-----------|
| 1 | Selecionar Fomento aprovado | AnalistaTecnico | Escolhe o Fomento com estado APROVADO que financiara esta captacao. |
| 2 | Criar Captacao com titulo e descricao | AnalistaTecnico | Registra a Captacao vinculada ao Fomento. Inicia no estado `EM_ANDAMENTO`. |
| 3 | Definir tipo de chamamento | AnalistaTecnico | Define se a captacao e `CHAMADA_PUBLICA` (edital aberto) ou `DEMANDA_INDUZIDA` (destinatario especifico). |
| 4 | Definir tipo do outorgado | AnalistaTecnico | Define se o outorgado e `PESSOA_FISICA` ou `PESSOA_JURIDICA`. Em `CHAMADA_PUBLICA` declara o perfil dos proponentes habilitados a receber outorga. Em `DEMANDA_INDUZIDA` deve coincidir com o tipo do destinatario informado no passo seguinte. |
| 5 | Selecionar outorgado destinatario | AnalistaTecnico | Apenas quando `DEMANDA_INDUZIDA`. Informa o destinatario especifico: PF (CPF + nome) ou PJ (CNPJ + razao social + contato PF). O tipo deve coincidir com o definido no passo anterior. |
| 6 | Adicionar edital | AnalistaTecnico | Informa o titulo do edital e ao menos um dos seguintes: link externo (URL) ou upload do documento. Pode informar versao quando houver rerratificacoes. Obrigatorio antes da publicacao. |
| 7 | Selecionar faixas do Fomento | AnalistaTecnico | Seleciona uma ou mais faixas do Fomento que serao ativadas nesta captacao. As faixas determinam os limites de investimento, tipos de iniciativa, rubricas e bolsas disponiveis para as propostas. Herdados do Fomento — nao reconfigurados aqui. |
| 8 | Definir categorias e tipos de iniciativas aceitos | AnalistaTecnico | Seleciona quais categorias e tipos de iniciativa a captacao aceita, dentre os tipos cobertos pelas faixas selecionadas. |
| 9 | Configurar regras de submissao | AnalistaTecnico | Define se permite multiplas propostas, acumulo de bolsa, participacao em outra proposta e se a submissao e restrita a proponentes escolhidos. Tambem define se exige aprovacao institucional (`exigeAprovacaoInstitucional`). |
| 9b | Habilitar solicitacao de assinatura institucional | AnalistaTecnico | **Condicional — apenas quando `exigeAprovacaoInstitucional = true`.** Configura que o proponente devera solicitar a assinatura do ResponsavelInstitucional durante o periodo de submissao. A proposta so pode ser submetida formalmente apos a assinatura ser obtida. |
| 10 | Selecionar proponentes autorizados | AnalistaTecnico | Quando submissao restrita, seleciona as instituicoes ou pessoas autorizadas a submeter proposta. |
| 11 | Configurar requisitos do proponente | AnalistaTecnico | Define direcionamento (aberto, instituicao, tipo de instituicao), exigencia de vinculo empregaticio, gestor institucional e nivel academico minimo. |
| 12 | Configurar documentos adicionais exigidos | AnalistaTecnico | Define quais documentos o proponente deve anexar na submissao, alem dos blocos estruturais da proposta. Exemplos: certidoes, contratos sociais, comprovantes de vinculo, declaracoes especificas do edital. Para cada documento informa: nome, descricao, formatos permitidos (PDF, DOCX, etc.), obrigatoriedade, e se pode ser reaproveitado do cadastro corporativo do M008 quando valido. |
| 13 | Configurar regras de avaliacao de merito | AnalistaTecnico | Define se a captacao exige avaliacao ad hoc e a quantidade minima de revisores por proposta. |
| 14 | Selecionar pool de revisores ad hoc | AnalistaTecnico | Adiciona as pessoas fisicas que comporao o pool de revisores, com area de atuacao e titulacao. |
| 15 | Definir exigencia de prestacao | AnalistaTecnico | Define se os projetos gerados exigirao prestacao tecnica e/ou financeira. |
| 16 | Selecionar formularios no M021 | AnalistaTecnico | Seleciona na base do M021: formulario de submissao da proposta, formulario de avaliacao ad hoc (usado pelos revisores para registrar parecer e nota), formulario de revisao de resultado e formulario de anexos (opcional). |
| 17 | Configurar matriz de campos da proposta | AnalistaTecnico | Para cada bloco fixo da proposta define se e `EXIGIDO` ou `DISPENSADO`. Os blocos configurados aqui determinam o que aparece no formulario de submissao para o proponente. |
| 18 | Configurar datas do processo de selecao | AnalistaTecnico | Define as 8 etapas obrigatorias do cronograma: PUBLICACAO_CAPTACAO, RECEBIMENTO_PROPOSTAS, AVALIACAO_DOCUMENTAL, AVALIACAO_AD_HOC, RESULTADO_PRELIMINAR, RECEBIMENTO_REVISAO, RESULTADO_APOS_REVISAO e RESULTADO_FINAL. Todas as datas devem estar dentro da vigencia do Fomento. |
| 19 | Validar e publicar Captacao | AnalistaTecnico | Verifica configuracao completa e publica. Captacao transita para `PUBLICADO`. |

---

> ⚠️ **IDEIA EM AVALIACAO** — Associar tipos de resultados, riscos e metricas de sucesso por tipo de iniciativa. Ao selecionar o tipo de iniciativa na proposta, esses campos viriam pre-preenchidos para o coordenador aceitar ou ajustar. Objetivo: padronizar a analise de impacto para a FAPES. Requer modelagem em M008 (TipoIniciativa) ou novo modulo de templates. Nao implementado nesta versao.

## Matriz de Campos da Proposta

O AnalistaTecnico define, para cada bloco fixo da proposta, se ele e `EXIGIDO` ou `DISPENSADO`.
Blocos dispensados nao aparecem para o proponente — nao sao exibidos nem solicitados no
formulario de submissao. Blocos exigidos sao obrigatorios para a submissao ser concluida.

| Bloco | Descricao | Opcoes |
|-------|-----------|--------|
| Equipe | Papeis, quantidade prevista ou membros da equipe do projeto. | EXIGIDO / DISPENSADO |
| Resultados | Entregas e resultados esperados do projeto. | EXIGIDO / DISPENSADO |
| Riscos | Riscos identificados com impacto, probabilidade e mitigacao. | EXIGIDO / DISPENSADO |
| Cronograma do projeto | Atividades com datas e vinculos com resultados. | EXIGIDO / DISPENSADO |
| Orcamento | Valores planejados classificados por rubrica. | EXIGIDO / DISPENSADO |
| Objetivos | Objetivo geral e objetivos especificos do projeto. | EXIGIDO / DISPENSADO |
| Beneficios | Beneficios esperados e indicadores de alcance. | EXIGIDO / DISPENSADO |

---

## Cronograma da Selecao

| Etapa | TipoPeriodo | Tipo | Obrigatoriedade | Descricao |
|-------|-------------|------|-----------------|-----------|
| Publicacao da Captacao | PUBLICACAO_CAPTACAO | Data (inicio + fim) | Obrigatoria | Data em que a captacao e tornada publica para os proponentes. Marca o inicio formal do processo. |
| Recebimento de Propostas | RECEBIMENTO_PROPOSTAS | Periodo (inicio + fim) | Obrigatoria | Janela em que proponentes podem enviar propostas. Quando `exigeAprovacaoInstitucional = true`, o ResponsavelInstitucional deve assinar a proposta **dentro deste mesmo periodo** — nao ha etapa separada para aprovacao. |
| Avaliacao Documental | AVALIACAO_DOCUMENTAL | Periodo (inicio + fim) | Obrigatoria | AnalistaTecnico confere documentacao e habilita ou inabilita propostas. |
| Avaliacao Ad Hoc | AVALIACAO_AD_HOC | Periodo (inicio + fim) | Obrigatoria | Revisores ad hoc registram pareceres e notas das propostas habilitadas. |
| Resultado Preliminar | RESULTADO_PRELIMINAR | Data (inicio + fim) | Obrigatoria | Data em que o resultado preliminar e divulgado aos proponentes, abrindo prazo para interposicao de recursos. |
| Recebimento de Revisoes | RECEBIMENTO_REVISAO | Periodo (inicio + fim) | Obrigatoria | Proponentes podem solicitar revisao do resultado preliminar. |
| Resultado Apos Revisao | RESULTADO_APOS_REVISAO | Data (inicio + fim) | Obrigatoria | Data em que e publicado o resultado apos analise dos recursos e revisoes interpostos. |
| Resultado Final | RESULTADO_FINAL | Data | Obrigatoria | Data em que o resultado final e divulgado e o processo de selecao e encerrado no M011. Quando atingida sem publicacao manual, o Sistema encerra a Captacao automaticamente. |

Qualquer etapa pode ser adiada pelo AnalistaTecnico mediante justificativa. O sistema desloca
automaticamente todas as etapas posteriores pelo mesmo numero de dias e preserva historico com
datas originais e novas datas.

---

## Saida do Processo 2

Captacao publicada contendo:

- referencia ao Fomento aprovado;
- faixas do Fomento selecionadas para esta captacao;
- tipo de chamamento: `CHAMADA_PUBLICA` ou `DEMANDA_INDUZIDA`;
- outorgado destinatario (PF ou PJ com contato PF), quando `DEMANDA_INDUZIDA`;
- link do edital;
- categorias e tipos de iniciativa aceitos;
- regras de submissao e proponentes autorizados quando restrita;
- requisitos do proponente;
- documentos exigidos com formatos e obrigatoriedade;
- regras de avaliacao de merito e pool de revisores ad hoc;
- exigencia de prestacao tecnica e/ou financeira;
- formularios de submissao, avaliacao, recursos e anexos selecionados no M021;
- cronograma com as 8 etapas obrigatorias (PUBLICACAO_CAPTACAO, RECEBIMENTO_PROPOSTAS, AVALIACAO_DOCUMENTAL, AVALIACAO_AD_HOC, RESULTADO_PRELIMINAR, RECEBIMENTO_REVISAO, RESULTADO_APOS_REVISAO, RESULTADO_FINAL).

---

## Estados da Configuracao

```mermaid
stateDiagram-v2
    [*] --> EmAndamento : AnalistaTecnico cria Captacao
    EmAndamento --> Publicado : AnalistaTecnico publica
    Publicado --> NaoPublicado : AnalistaTecnico despublica
    NaoPublicado --> EmAndamento : AnalistaTecnico reabre para ajustes
    Publicado --> Pausado : GestorFAPES pausa com justificativa
    Pausado --> Publicado : GestorFAPES retoma (datas validas)
    Publicado --> Encerrado : AnalistaTecnico encerra apos resultado final
    Publicado --> Encerrado : Sistema expira ao atingir RESULTADO_FINAL.dataFim
    Publicado --> Encerrado : GestorFAPES cancela administrativamente
    Pausado --> Encerrado : GestorFAPES cancela administrativamente
    Encerrado --> [*]
```

---

## Regras de Negocio

| ID | Responsavel | Regra |
|----|-------------|-------|
| RN-CS00 | AnalistaTecnico | Rubricas e tipos de projetos sao definidos no Fomento e herdados pela Captacao atraves das faixas selecionadas. Nao sao reconfigurados no processo de selecao. |
| RN-CS01 | AnalistaTecnico | A Captacao deve referenciar um Fomento com estado APROVADO. |
| RN-CS02 | AnalistaTecnico | A Captacao deve ter tipo CHAMADA_PUBLICA ou DEMANDA_INDUZIDA. |
| RN-CS03 | AnalistaTecnico | Quando DEMANDA_INDUZIDA, deve ser indicado o outorgado destinatario (PF ou PJ). |
| RN-CS04 | AnalistaTecnico | OutorgadoDestinatario PJ deve ter pessoa fisica de contato informada. |
| RN-CS05 | AnalistaTecnico | A Captacao deve selecionar ao menos uma faixa do Fomento. |
| RN-CS06 | AnalistaTecnico | As faixas selecionadas devem pertencer ao Fomento referenciado. |
| RN-CS07 | AnalistaTecnico | A Captacao deve ter link do edital preenchido antes da publicacao. |
| RN-CS08 | AnalistaTecnico | O cronograma deve conter as 8 etapas obrigatorias antes da publicacao: PUBLICACAO_CAPTACAO, RECEBIMENTO_PROPOSTAS, AVALIACAO_DOCUMENTAL, AVALIACAO_AD_HOC, RESULTADO_PRELIMINAR, RECEBIMENTO_REVISAO, RESULTADO_APOS_REVISAO e RESULTADO_FINAL. |
| RN-CS09 | AnalistaTecnico | Todas as datas do cronograma devem estar dentro da vigencia do Fomento (dataInicio a dataFim efetiva). |
| RN-CS10 | AnalistaTecnico | Toda Captacao deve selecionar formulario de submissao, avaliacao ad hoc e revisao de resultado no M021. |
| RN-CS11 | AnalistaTecnico | Quando submissao restrita a escolhidos, deve ser selecionada ao menos uma instituicao ou pessoa autorizada. |
| RN-CS12 | AnalistaTecnico | Qualquer etapa do cronograma pode ser adiada mediante justificativa, preservando historico das datas originais. |
| RN-CS13 | AnalistaTecnico | Ao adiar uma etapa, todas as etapas posteriores sao deslocadas pela mesma quantidade de dias. |
| RN-CS14 | AnalistaTecnico | A Captacao so pode ser publicada quando toda a configuracao obrigatoria estiver preenchida. |
| RN-CS15 | AnalistaTecnico | A Captacao so pode ser despublicada quando nenhuma proposta estiver submetida no periodo ativo. |
| RN-CS16 | AnalistaTecnico | O tipo do outorgado deve ser definido em qualquer tipo de chamamento: em CHAMADA_PUBLICA declara o perfil esperado; em DEMANDA_INDUZIDA deve coincidir com o tipo do outorgado destinatario selecionado. |
| RN-CS17 | AnalistaTecnico | O edital deve conter ao menos um link externo ou um arquivo anexado antes da publicacao da captacao. |
| RN-CS18 | AnalistaTecnico | O edital pode ser rerratificado informando nova versao. O historico de versoes deve ser preservado. |
| RN-CS19 | AnalistaTecnico | Cada bloco fixo da proposta deve ser configurado como EXIGIDO ou DISPENSADO antes da publicacao. |
| RN-CS25 | Sistema | Quando `exigeAprovacaoInstitucional = true`, a assinatura do ResponsavelInstitucional deve ocorrer dentro do periodo de Submissao de Propostas. Nao ha etapa separada para aprovacao institucional. |
| RN-CS26 | Sistema | Proposta sem assinatura institucional nao pode ser submetida formalmente quando `exigeAprovacaoInstitucional = true`. |
| RN-CS27 | ResponsavelInstitucional | O responsavel assina ou recusa a proposta antes da dataFim do periodo de submissao. Recusa deve ter justificativa registrada e devolve a proposta ao proponente para correcao ou desistencia. |
| RN-CS22 | AnalistaTecnico | O AnalistaTecnico pode exigir documentos adicionais especificos do edital, independentes dos blocos da matriz. Cada documento tem nome, formatos permitidos e obrigatoriedade propria. |
| RN-CS23 | Sistema | Documentos marcados como obrigatorios bloqueiam a submissao da proposta quando ausentes. |
| RN-CS24 | Sistema | Quando `reutilizarCadastroCorporativo = true`, o sistema verifica se o proponente ja possui o documento valido no M008 e o reaproveita, dispensando novo upload. Se o documento estiver vencido e `exigirNovoEnvioSeVencido = true`, novo upload e solicitado. |
| RN-CS20 | Sistema | Blocos configurados como DISPENSADO nao aparecem no formulario de submissao do proponente. |
| RN-CS21 | Sistema | Blocos configurados como EXIGIDO sao obrigatorios — a proposta nao pode ser submetida sem que estejam preenchidos. |

---

## Integracao

| Modulo | Papel |
|--------|-------|
| M011/Fomento | Fornece as faixas de investimento, rubricas, bolsas, tipos de iniciativa e vigencia. |
| M008 | Fornece AreaTecnica, Instituicoes, TiposInstituicao, NivelAcademico e PessoaFisica. |
| M021 | Fornece a base de formularios reutilizaveis e versionados. |

---

## Subprocesso: Prorrogacao de Prazo do Cronograma

A Area Tecnica pode prorrogar qualquer etapa do cronograma de uma Captacao publicada,
mediante justificativa. A prorrogacao desloca automaticamente todas as etapas posteriores
pelo mesmo numero de dias, preservando a sequencia operacional. O historico completo de
datas originais e novas datas e registrado de forma imutavel.

Exemplo tipico: prorrogacao do periodo de submissao de propostas por demanda insuficiente
ou por solicitacao dos proponentes.

```mermaid
flowchart TD
    subgraph AnalistaTecnico[AnalistaTecnico]
        A[Identificar necessidade de prorrogacao]
        B[Selecionar etapa do cronograma a prorrogar]
        C[Informar quantidade de dias a acrescentar]
        D[Informar justificativa]
        E[Confirmar prorrogacao]
    end

    subgraph Sistema[Sistema]
        F[Registrar AdiamentoPeriodoCronograma com datas originais e novas datas]
        G[Deslocar todas as etapas posteriores pelo mesmo numero de dias]
        H[Verificar se novas datas respeitam a vigencia do Fomento]
    end

    A --> B --> C --> D --> E --> F --> G --> H
    H -->|Dentro da vigencia| I[Cronograma atualizado]
    H -->|Fora da vigencia| J[Erro — prorrogacao requer aditivo de data no Fomento primeiro]
```

### Atividades

| # | Atividade | Responsavel | Descricao |
|---|-----------|-------------|-----------|
| 1 | Identificar necessidade de prorrogacao | AnalistaTecnico | Identifica que uma etapa do cronograma precisa ser estendida — ex: baixa adesao no periodo de submissao, demanda de proponentes, decisao da diretoria. |
| 2 | Selecionar etapa a prorrogar | AnalistaTecnico | Seleciona qual periodo do cronograma sera estendido (ex: Submissao de Propostas, Analise Documental). |
| 3 | Informar quantidade de dias | AnalistaTecnico | Define quantos dias serao acrescidos ao periodo selecionado. Deve ser maior que zero. |
| 4 | Informar justificativa | AnalistaTecnico | Registra o motivo da prorrogacao. Obrigatorio. |
| 5 | Confirmar prorrogacao | AnalistaTecnico | Confirma a operacao. |
| 6 | Registrar adiamento | Sistema | Grava registro imutavel com datas originais, novas datas e data do registro. |
| 7 | Deslocar etapas posteriores | Sistema | Todas as etapas com ordem posterior a etapa prorrogada sao deslocadas pelo mesmo numero de dias automaticamente. |
| 8 | Validar vigencia do Fomento | Sistema | Verifica se as novas datas estao dentro da vigencia efetiva do Fomento. Se nao estiverem, bloqueia a prorrogacao e orienta o GestorFomento a registrar aditivo de data no Fomento primeiro. |

### Regras

| ID | Responsavel | Regra |
|----|-------------|-------|
| RN-PR01 | AnalistaTecnico | Prorrogacao pode ser aplicada a qualquer etapa do cronograma de uma Captacao com estado PUBLICADO. |
| RN-PR02 | AnalistaTecnico | A quantidade de dias deve ser maior que zero. |
| RN-PR03 | AnalistaTecnico | Justificativa e obrigatoria para toda prorrogacao. |
| RN-PR04 | Sistema | Ao prorrogar uma etapa, todas as etapas com ordem posterior sao deslocadas pelo mesmo numero de dias. |
| RN-PR05 | Sistema | O registro da prorrogacao e imutavel — preserva dataInicioOriginal, dataFimOriginal, dataInicioNova e dataFimNova. |
| RN-PR06 | Sistema | As novas datas nao podem ultrapassar a dataFim efetiva do Fomento. Se ultrapassarem, a prorrogacao e bloqueada ate que o GestorFomento registre um aditivo de data no Fomento. |
