# Processo - Prestacao de Contas

[<< Voltar ao M014](README.md) | [Estrutural](modelo-estrutural.md) | [Comportamental](modelo-comportamental.md)

---

## Visao Geral

O processo de Prestacao de Contas cobre o ciclo operacional do modulo: importacoes financeiras e orcamentarias, preparacao da prestacao pelo Coordenador, submissao para analise e decisao do Responsavel FAPES. A prestacao nasce em `RASCUNHO`, pode ir para `EM_ANALISE`, retornar para `REVISAO`, ou terminar como `FINALIZADO` ou `NEGADO`.

1. **Carga unica do orcamento original** - primeira integracao entre Conecta FAPES e SIGFAPES para importar o orcamento original aprovado da iniciativa.
2. **Importacao diaria de movimentos bancarios** - processo diario que captura o CNAB 240 gerado pelo EDI Banestes em uma pasta de servidor, envia o arquivo para a API/Base M014, que salva no MinIO e publica a referencia em uma fila para workers processarem em paralelo.
3. **Elaboracao da prestacao** - criacao da `Prestacao`, vinculacao de transacoes, registro de justificativas e classificacao de documentos fiscais.
4. **Submissao e analise** - validacao de conciliacao, bloqueio de edicoes e parecer do Responsavel FAPES.
5. **Revisao pelo Coordenador** - ajustes solicitados pela FAPES e nova submissao para analise.

---

## Fluxo 1 - Carga Unica do Orcamento Original

Este fluxo representa a primeira integracao do modulo: o Conecta FAPES consulta o SIGFAPES para importar o orcamento original aprovado da iniciativa. Essa carga e executada apenas uma vez por iniciativa; depois de concluida com sucesso, o orcamento fica marcado como importado para evitar nova carga automatica.

```mermaid
sequenceDiagram
    autonumber
    participant Job as Job de Integracao
    participant API as API Prestacao de Contas
    participant SIG as SIGFAPES
    participant DB as Base M014

    Job->>API: Solicita carga unica do orcamento original(iniciativaId)
    API->>DB: Verifica se orcamento original ja foi importado

    alt Orcamento ja importado
        DB-->>API: Orcamento existente
        API-->>Job: Ignora nova carga automatica
    else Orcamento ainda nao importado
        API->>SIG: Consulta orcamento original aprovado da iniciativa
        SIG-->>API: Retorna orcamento, rubricas e subrubricas
        API->>DB: Persiste Orcamento e RubricaOrcamentaria
        API->>DB: Marca orcamento original como importado
        API-->>Job: Confirma carga unica concluida
    end
```

### Atividades da carga unica

| # | Atividade | Responsavel | Resultado |
|---|-----------|-------------|-----------|
| 1 | Solicitar carga unica | Job de Integracao | API de Prestacao de Contas acionada para importar o orcamento original da iniciativa. |
| 2 | Consultar SIGFAPES | API Prestacao de Contas / SIGFAPES | Orcamento original aprovado da iniciativa retornado pelo SIGFAPES. |
| 3 | Persistir orcamento e rubricas | API Prestacao de Contas | `Orcamento` e `RubricaOrcamentaria` criados na base M014. |
| 4 | Marcar orcamento como importado | API Prestacao de Contas | Carga unica registrada para evitar nova importacao automatica do mesmo orcamento. |

---

## Fluxo 2 - Importacao Diaria de Movimentos Bancarios

Este fluxo e independente da carga unica do SIGFAPES. Diariamente, o EDI Banestes grava o arquivo CNAB 240 em uma pasta de servidor. Um job de captura le essa pasta e envia o arquivo para a API/Base M014. A API registra a captura, salva o arquivo bruto no MinIO e publica uma mensagem em fila com a referencia do objeto. Workers de importacao consomem a fila em paralelo e chamam a API de Prestacao de Contas para processar o arquivo e persistir os debitos e creditos como `TransacaoFinanceira`. As transacoes ficam pendentes ate serem vinculadas a uma prestacao.

```mermaid
sequenceDiagram
    autonumber
    participant EDI as EDI Banestes
    participant Pasta as Pasta no Servidor
    participant Captura as Job de Captura CNAB
    participant API as API Prestacao de Contas
    participant DB as Base M014
    participant MinIO as MinIO
    participant Fila as Fila de Importacao
    participant Worker as Workers de Importacao

    EDI->>Pasta: Grava arquivo CNAB 240 diario
    Captura->>Pasta: Le arquivos CNAB 240 pendentes
    Pasta-->>Captura: Retorna arquivo CNAB 240
    Captura->>API: Envia arquivo CNAB 240 para registro
    API->>DB: Registra captura do arquivo
    API->>MinIO: Salva arquivo bruto CNAB 240
    MinIO-->>API: Retorna bucket e chave do objeto
    API->>DB: Atualiza captura com referencia MinIO
    API->>Fila: Publica mensagem de importacao(bucket, chave, metadados)
    par Processamento paralelo
        Worker->>Fila: Consome proxima mensagem disponivel
        Worker->>API: Solicita importacao do CNAB 240(bucket, chave, metadados)
    end
    API->>MinIO: Recupera arquivo CNAB 240
    MinIO-->>API: Retorna conteudo do arquivo
    API->>API: Processa linhas de debito e credito
    API->>DB: Identifica ContaBancaria da iniciativa

    alt Conta bancaria encontrada
        API->>DB: Persiste debitos e creditos como TransacaoFinanceira
        API->>DB: Classifica creditos como estorno, rendimento ou pendente
        API->>DB: Atualiza saldo da ContaBancaria
        API-->>Worker: Confirma transacoes importadas
        Worker->>DB: Marca arquivo como importado
        Worker->>Fila: Confirma processamento da mensagem
    else Conta bancaria nao encontrada
        API->>DB: Registra falha da importacao com referencia MinIO
        API-->>Worker: Informa falha de conciliacao da conta
        Worker->>DB: Marca arquivo com falha de importacao
        Worker->>Fila: Confirma mensagem com falha registrada
    end
```

### Atividades da importacao diaria

| # | Atividade | Responsavel | Resultado |
|---|-----------|-------------|-----------|
| 1 | Gerar CNAB 240 | EDI Banestes | Arquivo diario gravado em uma pasta no servidor. |
| 2 | Capturar arquivo | Job de Captura CNAB | Arquivo CNAB 240 lido da pasta do servidor. |
| 3 | Enviar arquivo para API | Job de Captura CNAB | Arquivo CNAB 240 enviado para a API/Base M014. |
| 4 | Registrar e armazenar captura | API Prestacao de Contas / MinIO | API registra a captura na Base M014 e salva o CNAB 240 no MinIO. |
| 5 | Publicar mensagem | API Prestacao de Contas / Fila de Importacao | Mensagem criada com bucket, chave e metadados do CNAB 240. |
| 6 | Consumir em paralelo | Workers de Importacao | Workers consomem mensagens da fila para acelerar o processamento. |
| 7 | Enviar para API | Workers de Importacao | API de Prestacao de Contas acionada com a referencia do objeto no MinIO. |
| 8 | Processar CNAB 240 | API Prestacao de Contas | Arquivo recuperado do MinIO e interpretado em linhas de debito e credito. |
| 9 | Identificar conta bancaria | API Prestacao de Contas | Conta da iniciativa localizada para associar os movimentos importados. |
| 10 | Salvar debitos e creditos | API Prestacao de Contas | Debitos e creditos persistidos como `TransacaoFinanceira`. |
| 11 | Classificar creditos | API Prestacao de Contas | Creditos classificados como `ESTORNO`, `RENDIMENTO` ou `PENDENTE_CLASSIFICACAO`, conforme RN11. |
| 12 | Atualizar saldo | API Prestacao de Contas / Financeiro M016 | Saldo da `ContaBancaria` atualizado a partir dos movimentos importados. |
| 13 | Registrar resultado | API Prestacao de Contas / Workers de Importacao | Arquivo marcado como importado ou com falha registrada; mensagem da fila confirmada. |

---

## Fluxo 3 - Elaboracao da Prestacao

Este fluxo inicia quando o Coordenador cria a prestacao em `RASCUNHO` e vincula as transacoes bancarias importadas. A partir dessa base comum, a elaboracao se divide em modelos separados por tipo de despesa: nota fiscal de produto, produto sem nota fiscal, nota fiscal de servico, invoice, diarias e passagens. Nota fiscal de produto passa pela integracao SERPRO. Nota fiscal de servico, no fluxo atual, e validada por biblioteca interna; a validacao por SERPRO fica prevista como evolucao futura. Os demais tipos seguem por validacoes internas, armazenamento dos arquivos e classificacao em rubricas.

### Fluxo 3.1 - Base da Prestacao

```mermaid
sequenceDiagram
    autonumber
    actor Coord as Coordenador / Outorgado
    participant API as API Prestacao de Contas
    participant DB as Base M014

    Coord->>API: Cria Prestacao em RASCUNHO
    API->>DB: Persiste Prestacao
    Coord->>API: Solicita transacoes pendentes da iniciativa
    API->>DB: Consulta TransacaoFinanceira sem vinculo
    DB-->>API: Retorna transacoes disponiveis
    API-->>Coord: Exibe transacoes para selecao
    Coord->>API: Vincula transacoes selecionadas a Prestacao
    API->>DB: Verifica se transacoes ja possuem prestacao

    alt Transacao ja vinculada
        API-->>Coord: Rejeita nova vinculacao
    else Transacao disponivel
        API->>DB: Vincula transacoes a Prestacao
    end
```

### Fluxo 3.2 - Nota Fiscal de Produto

Nota fiscal de produto e o unico tipo que passa pelo SERPRO. Antes de persistir o documento, a API verifica se a nota ja foi usada. Se a nota ja foi utilizada, for falsa ou for invalida no SERPRO, o uso e impedido. Quando a nota e verdadeira, o SERPRO retorna os dados da nota fiscal e o sistema usa os itens retornados para encaixar as compras nas rubricas do orcamento.

```mermaid
sequenceDiagram
    autonumber
    actor Coord as Coordenador / Outorgado
    participant API as API Prestacao de Contas
    participant SERPRO as SERPRO
    participant DB as Base M014
    participant MinIO as MinIO

    Coord->>API: Registra nota fiscal de produto e envia arquivos
    API->>DB: Registra metadados dos arquivos
    API->>MinIO: Salva arquivos enviados
    MinIO-->>API: Retorna URLs dos arquivos
    API->>DB: Atualiza URLs dos arquivos
    Coord->>API: Informa chave de acesso da nota de produto
    API->>DB: Verifica se a nota ja foi usada

    alt Nota ja usada
        API-->>Coord: Impede uso da nota fiscal
    else Nota ainda nao usada
        API->>SERPRO: Verifica autenticidade da nota fiscal
        SERPRO-->>API: Retorna situacao, dados da nota e itens

        alt Nota falsa ou invalida
            API-->>Coord: Impede uso da nota fiscal
        else Nota verdadeira
            API->>DB: Consulta rubricas orcamentarias da iniciativa
            API->>API: Encaixa itens da nota nas rubricas
            API->>DB: Persiste DocumentoFiscal de produto e itens
            API-->>Coord: Exibe itens e rubricas sugeridas
            Coord->>API: Confirma ou ajusta rubricas dos itens
            API->>DB: Valida rubricas e limites orcamentarios
            Coord->>API: Informa orcamentos da compra
            API->>DB: Persiste OrcamentoFornecedor
            Coord->>API: Marca no maximo um orcamento escolhido
            API->>DB: Atualiza orcamento escolhido
            API->>DB: Calcula saldo da prestacao
            API-->>Coord: Confirma nota de produto registrada
        end
    end
```

### Fluxo 3.3 - Nota Fiscal de Servico

Nota fiscal de servico, no fluxo atual, nao passa pelo SERPRO. A API usa uma biblioteca interna para validar os dados informados, verifica se a nota ja foi usada e impede novo uso quando houver duplicidade. A validacao por SERPRO para servicos fica prevista como evolucao futura.

```mermaid
sequenceDiagram
    autonumber
    actor Coord as Coordenador / Outorgado
    participant API as API Prestacao de Contas
    participant DB as Base M014
    participant MinIO as MinIO

    Coord->>API: Registra nota fiscal de servico e envia arquivos
    API->>DB: Registra metadados dos arquivos
    API->>MinIO: Salva arquivos enviados
    MinIO-->>API: Retorna URLs dos arquivos
    API->>DB: Atualiza URLs dos arquivos
    API->>DB: Verifica se a nota ja foi usada

    alt Nota ja usada
        API-->>Coord: Impede uso da nota fiscal
    else Nota disponivel
        API->>API: Valida nota de servico via biblioteca interna
        API->>DB: Persiste DocumentoFiscal de servico e itens
        Coord->>API: Define rubrica do servico contratado
        API->>DB: Valida rubrica e limite orcamentario
        Coord->>API: Informa orcamentos da compra quando aplicavel
        API->>DB: Persiste OrcamentoFornecedor
        API->>DB: Calcula saldo da prestacao
        API-->>Coord: Confirma nota de servico registrada
    end
```

### Fluxo 3.4 - Produto sem Nota Fiscal

Compra de produto sem nota fiscal e um fluxo excepcional. Nao passa pelo SERPRO e exige justificativa formal para ausencia da nota, comprovante alternativo da despesa, rubrica orcamentaria e vinculacao a transacao bancaria. A despesa fica marcada para analise obrigatoria pela Area Tecnica.

```mermaid
sequenceDiagram
    autonumber
    actor Coord as Coordenador / Outorgado
    participant API as API Prestacao de Contas
    participant DB as Base M014
    participant MinIO as MinIO

    Coord->>API: Registra produto sem nota fiscal e envia comprovantes
    API->>DB: Registra metadados dos arquivos
    API->>MinIO: Salva comprovante alternativo
    MinIO-->>API: Retorna URLs dos arquivos
    API->>DB: Atualiza URLs dos arquivos
    Coord->>API: Informa fornecedor, data, valor e descricao dos produtos
    Coord->>API: Informa justificativa para ausencia da nota fiscal
    Coord->>API: Vincula transacao bancaria correspondente
    API->>DB: Verifica transacao vinculada a Prestacao

    alt Sem justificativa ou comprovante alternativo
        API-->>Coord: Impede registro da despesa
    else Dados minimos informados
        Coord->>API: Define rubrica da compra
        API->>DB: Valida rubrica e limite orcamentario
        API->>DB: Persiste JustificativaProdutoSemNota
        API->>DB: Marca analise obrigatoria pela Area Tecnica
        API->>DB: Calcula saldo da prestacao
        API-->>Coord: Confirma produto sem nota registrado
    end
```

### Fluxo 3.5 - Invoice

Invoice nao passa pelo SERPRO. A API valida internamente os dados da despesa internacional, incluindo moeda e cambio, armazena os arquivos e permite a classificacao em rubrica.

```mermaid
sequenceDiagram
    autonumber
    actor Coord as Coordenador / Outorgado
    participant API as API Prestacao de Contas
    participant DB as Base M014
    participant MinIO as MinIO

    Coord->>API: Registra invoice e envia arquivos
    API->>DB: Registra metadados dos arquivos
    API->>MinIO: Salva arquivos enviados
    MinIO-->>API: Retorna URLs dos arquivos
    API->>DB: Atualiza URLs dos arquivos
    Coord->>API: Informa moeda, valor e dados de cambio
    API->>API: Valida dados internos da invoice
    API->>DB: Persiste JustificativaInvoice
    Coord->>API: Define rubrica das compras
    API->>DB: Valida rubrica e limite orcamentario
    Coord->>API: Informa orcamentos da compra quando aplicavel
    API->>DB: Persiste OrcamentoFornecedor
    API->>DB: Calcula saldo da prestacao
    API-->>Coord: Confirma invoice registrada
```

### Fluxo 3.6 - Diarias

Diarias nao passam pelo SERPRO. O Coordenador deve informar a solicitacao de diaria e o PIX do pagamento antes do registro da despesa. A API valida a solicitacao, beneficiario, quantidade, valor da diaria e comprovante PIX, armazena os comprovantes e registra a justificativa.

```mermaid
sequenceDiagram
    autonumber
    actor Coord as Coordenador / Outorgado
    participant API as API Prestacao de Contas
    participant DB as Base M014
    participant MinIO as MinIO

    Coord->>API: Informa solicitacao de diaria
    API->>DB: Consulta solicitacao de diaria
    API-->>Coord: Retorna dados da solicitacao
    Coord->>API: Registra diaria, PIX do pagamento e arquivos
    API->>DB: Registra metadados dos arquivos
    API->>MinIO: Salva arquivos enviados
    MinIO-->>API: Retorna URLs dos arquivos
    API->>DB: Atualiza URLs dos arquivos
    Coord->>API: Informa beneficiario, quantidade e valor
    API->>API: Valida solicitacao, beneficiario, quantidade, valor e PIX
    API->>DB: Persiste JustificativaDiaria
    Coord->>API: Define rubrica da diaria
    API->>DB: Valida rubrica e limite orcamentario
    API->>DB: Calcula saldo da prestacao
    API-->>Coord: Confirma diaria registrada
```

### Fluxo 3.7 - Passagens

Passagens nao passam pelo SERPRO. O Coordenador deve informar os dados da viagem, o PIX do pagamento e o PDF da compra da passagem. A API valida os comprovantes, o PDF da compra, os dados da viagem e o comprovante PIX, armazena os arquivos e registra a despesa na rubrica definida pelo Coordenador ou Outorgado.

```mermaid
sequenceDiagram
    autonumber
    actor Coord as Coordenador / Outorgado
    participant API as API Prestacao de Contas
    participant DB as Base M014
    participant MinIO as MinIO

    Coord->>API: Registra passagem, PIX do pagamento e PDF da compra
    API->>DB: Registra metadados dos arquivos
    API->>MinIO: Salva arquivos enviados
    MinIO-->>API: Retorna URLs dos arquivos
    API->>DB: Atualiza URLs dos arquivos
    Coord->>API: Informa dados da viagem e comprovantes
    API->>API: Valida dados da passagem, PDF da compra e PIX
    API->>DB: Persiste justificativa de passagem
    Coord->>API: Define rubrica da passagem
    API->>DB: Valida rubrica e limite orcamentario
    Coord->>API: Informa orcamentos quando aplicavel
    API->>DB: Persiste OrcamentoFornecedor
    API->>DB: Calcula saldo da prestacao
    API-->>Coord: Confirma passagem registrada
```

### Atividades da elaboracao

| # | Atividade | Responsavel | Resultado |
|---|-----------|-------------|-----------|
| 1 | Criar Prestacao | Coordenador / Outorgado | `Prestacao` criada em `RASCUNHO`. |
| 2 | Vincular transacoes | Coordenador / Outorgado | Movimentos bancarios associados a prestacao, respeitando RN04. |
| 3 | Registrar nota fiscal de produto | Coordenador / Outorgado / SERPRO | SERPRO retorna dados e itens da nota; o sistema encaixa os itens nas rubricas, e nota falsa, invalida ou ja usada e impedida. |
| 4 | Registrar nota fiscal de servico | Coordenador / Outorgado | Despesa segue por biblioteca interna no fluxo atual; validacao via SERPRO fica prevista como evolucao futura. |
| 5 | Registrar produto sem nota fiscal | Coordenador / Outorgado | Despesa excepcional registrada com justificativa, comprovante alternativo, rubrica e analise obrigatoria pela Area Tecnica. |
| 6 | Registrar invoice | Coordenador / Outorgado | Despesa internacional registrada com moeda, valor e cambio, sem chamada ao SERPRO. |
| 7 | Registrar diaria | Coordenador / Outorgado | Diaria registrada a partir da solicitacao de diaria, com beneficiario, quantidade, valor e PIX do pagamento, sem chamada ao SERPRO. |
| 8 | Registrar passagem | Coordenador / Outorgado | Passagem registrada com dados da viagem, PDF da compra da passagem e PIX do pagamento, sem chamada ao SERPRO. |
| 9 | Enviar arquivos | Coordenador / Outorgado / MinIO | Arquivos comprobatorios armazenados no MinIO e vinculados a despesa. |
| 10 | Definir rubrica | Coordenador / Outorgado | Despesa classificada na rubrica orcamentaria correspondente. |
| 11 | Informar orcamentos | Coordenador / Outorgado | Orcamentos cadastrados quando aplicavel e, quando necessario, um orcamento marcado como escolhido. |
| 12 | Calcular saldo | Modulo M014 | Saldo calculado por `ValorTotalTransacoes - ValorTotalJustificativas`. |

---

## Fluxo 4 - Submissao e Analise da Prestacao

A submissao so pode ocorrer quando a prestacao esta em `RASCUNHO` ou `REVISAO` e possui conciliacao suficiente entre transacoes e justificativas. Ao entrar em `EM_ANALISE`, edicoes e exclusoes no agregado ficam bloqueadas ate a decisao da FAPES.

```mermaid
sequenceDiagram
    autonumber
    actor Coord as Coordenador / Outorgado
    actor FAPES as Responsavel FAPES
    participant API as API Prestacao de Contas
    participant DB as Base M014

    Coord->>API: Solicita submissao da Prestacao
    API->>DB: Consulta Prestacao, transacoes e justificativas

    alt Status diferente de RASCUNHO ou REVISAO
        API-->>Coord: Rejeita submissao por estado invalido
    else Prestacao apta para validacao
        API->>API: Valida transacoes, justificativas, rubricas e conciliacao

        alt Sem transacoes ou conciliacao invalida
            API-->>Coord: Rejeita submissao por pendencias
        else Conciliacao valida
            API->>DB: Altera status para EM_ANALISE
            API->>DB: Registra historico e auditoria
            API-->>Coord: Confirma submissao
        end
    end

    FAPES->>API: Inicia analise da Prestacao
    API->>DB: Consulta documentos, transacoes, rubricas e saldo
    DB-->>API: Retorna dados para analise
    API-->>FAPES: Exibe prestacao em analise
    FAPES->>API: Emite parecer

    alt Parecer favoravel
        API->>DB: Aprova Prestacao e altera status para FINALIZADO
        API-->>FAPES: Confirma aprovacao
    else Parecer desfavoravel
        API->>DB: Nega Prestacao e altera status para NEGADO
        API-->>FAPES: Confirma negacao
    else Necessita correcao
        API->>DB: Solicita revisao e altera status para REVISAO
        API-->>Coord: Notifica pendencias para revisao
    end
```

### Atividades da submissao e analise

| # | Atividade | Responsavel | Resultado |
|---|-----------|-------------|-----------|
| 1 | Solicitar submissao | Coordenador / Outorgado | Pedido de envio para analise iniciado. |
| 2 | Validar aptidao | Modulo M014 | Prestacao aceita apenas se estiver em `RASCUNHO` ou `REVISAO` e atender RN01 e RN02. |
| 3 | Bloquear edicoes | Modulo M014 | Alteracoes no agregado bloqueadas em `EM_ANALISE`, conforme RN03. |
| 4 | Analisar documentos | Responsavel FAPES | Verificacao de transacoes, justificativas, rubricas, documentos fiscais e saldo. |
| 5 | Emitir parecer | Responsavel FAPES | Prestacao aprovada, negada ou devolvida para revisao, conforme RN10. |
| 6 | Registrar auditoria | Modulo M014 | Operacoes relevantes registradas em historico, conforme RN09. |

---

## Fluxo 5 - Revisao pelo Coordenador

Quando a FAPES solicita revisao, a prestacao retorna para `REVISAO`. O Coordenador pode ajustar justificativas, documentos, orcamentos, classificacoes e transacoes vinculadas antes de submeter novamente. `FINALIZADO` e `NEGADO` sao estados terminais.

```mermaid
sequenceDiagram
    autonumber
    actor Coord as Coordenador / Outorgado
    participant API as API Prestacao de Contas
    participant DB as Base M014

    Coord->>API: Consulta pendencias da Prestacao em REVISAO
    API->>DB: Busca parecer e orientacoes de correcao
    DB-->>API: Retorna pendencias registradas
    API-->>Coord: Exibe pendencias da analise

    Coord->>API: Ajusta justificativas e documentos
    API->>DB: Atualiza JustificativaDespesa e DocumentoFiscal
    Coord->>API: Ajusta orcamentos de fornecedor
    API->>DB: Atualiza OrcamentoFornecedor
    Coord->>API: Reclassifica itens em rubricas
    API->>DB: Valida e atualiza RubricaOrcamentaria dos itens
    Coord->>API: Ajusta transacoes vinculadas
    API->>DB: Atualiza vinculos de TransacaoFinanceira
    Coord->>API: Solicita nova submissao
    API->>DB: Consulta prestacao corrigida
    API->>API: Valida pendencias, rubricas e conciliacao

    alt Pendencias ou conciliacao invalida
        API-->>Coord: Mantem em REVISAO e informa pendencias
    else Prestacao corrigida
        API->>DB: Registra nova submissao
        API->>DB: Altera status para EM_ANALISE
        API-->>Coord: Confirma retorno para analise
    end
```

### Atividades da revisao

| # | Atividade | Responsavel | Resultado |
|---|-----------|-------------|-----------|
| 1 | Ler pendencias | Coordenador / Outorgado | Coordenador identifica os pontos devolvidos pela FAPES. |
| 2 | Ajustar prestacao | Coordenador / Outorgado | Justificativas, documentos, orcamentos, rubricas e transacoes corrigidos. |
| 3 | Validar conciliacao | Modulo M014 | Nova versao validada antes da submissao. |
| 4 | Submeter novamente | Coordenador / Outorgado | Prestacao retorna para `EM_ANALISE`. |
| 5 | Bloquear edicoes | Modulo M014 | Agregado protegido durante nova analise. |
