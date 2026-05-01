# Arquitetura - M014 Prestacao de Contas

[<< Voltar ao README](README.md)

## Objetivo

Este documento registra a avaliacao de aderencia entre o backend atual de prestacao de contas (`leds-conectafapes-prestacao-de-contas`, branch `develop`) e o processo revisado do modulo M014.

A avaliacao considera os modelos em [processo.md](processo.md), [modelo-estrutural.md](modelo-estrutural.md), [backlog.md](backlog.md) e EPICs do modulo.

## Resumo Executivo

O backend atual esta **parcialmente adequado** ao processo revisado. Ele cobre bem uma V1 nuclear de prestacao de contas, mas ainda nao acompanha todas as decisoes funcionais e arquiteturais adicionadas ao processo.

Estimativa de aderencia:

- **Alta aderencia** para o ciclo base de `Prestacao`, justificativas de NF/diaria/invoice, documentos fiscais, itens de documento fiscal, transacoes financeiras, SERPRO para NF-e, extracao interna de NFS-e e armazenamento em MinIO.
- **Baixa aderencia** para os fluxos novos ou refinados: produto sem nota fiscal, passagens, PIX em diaria/passagem, referencia a solicitacao de diaria aprovada do M003, CNAB 240 com EDI Banestes e processamento em fila, e migracao de `ContaContabil` para `RubricaOrcamentaria`.

Como referencia pratica, o backend atual parece cerca de **60% alinhado** ao processo documentado depois das revisoes mais recentes. Ele esta mais proximo do modelo MVP anterior do que do processo completo atual.

## Pontos Aderentes

### Ciclo da Prestacao

O backend possui entidade `Prestacao` com ciclo de estados compativel com o modelo atual:

- `RASCUNHO`
- `EM_ANALISE`
- `REVISAO`
- `FINALIZADO`
- `NEGADO`

As transicoes principais tambem estao coerentes:

- Submeter apenas a partir de `RASCUNHO` ou `REVISAO`.
- Aprovar, negar ou solicitar revisao apenas quando a prestacao esta `EM_ANALISE`.
- `FINALIZADO` e `NEGADO` como estados terminais.

### Justificativas de Despesa

O backend ja implementa a hierarquia principal:

- `JustificativaDespesa`
- `JustificativaNF`
- `JustificativaDiaria`
- `JustificativaInvoice`

Essa base e compativel com o modelo estrutural, mas precisa ser expandida para acomodar os tipos adicionais do processo revisado.

### Documentos Fiscais e SERPRO

O backend ja possui:

- `DocumentoFiscal`
- `ItemDocumentoFiscal`
- validacao de chave de acesso de NF-e
- consulta a SERPRO para NF-e de produto
- verificacao de duplicidade por chave de acesso
- criacao de itens a partir dos dados retornados pela SERPRO

Isso atende bem ao fluxo de nota fiscal de produto.

### Nota Fiscal de Servico

O backend possui processamento de NFS-e por biblioteca interna, com extracao de XML/PDF. Isso esta coerente com a decisao atual:

- servico **nao passa pelo SERPRO agora**
- validacao via SERPRO para servico fica como evolucao futura

### MinIO

Existe `MinioService` na infraestrutura do backend, com upload, remocao, verificacao de existencia e geracao de URL pre-assinada.

Isso confirma que o MinIO esta sob a responsabilidade da API/Base M014, conforme ajustado no processo.

### Transacoes Financeiras

O backend possui:

- `TransacaoFinanceira`
- `ContaBancaria`
- importacao de lote de extrato ja processado
- endpoint `importar-extrato`
- tipos de operacao `CREDITO` e `DEBITO`

Isso cobre a persistencia de debitos e creditos, mas nao cobre todo o fluxo de captura e processamento do CNAB 240 descrito no processo revisado.

## Lacunas Identificadas

### Produto sem Nota Fiscal

Nao foi identificado suporte a compra de produto sem nota fiscal.

Lacunas:

- entidade `JustificativaProdutoSemNota`
- DTOs de request/response
- controller
- service/use case
- repository
- configuracao EF Core
- mapeamento no enum `TipoJustificativa`
- vinculo obrigatorio com `RubricaOrcamentaria`
- comprovante alternativo em MinIO
- flag de analise obrigatoria

Impacto: o processo e os EPICs documentam esse fluxo, mas o backend ainda nao o implementa.

### Passagens

Nao foi identificado modelo proprio para prestacao de contas de passagens.

Lacunas:

- entidade ou subtipo especifico para passagem
- campos de dados da viagem
- comprovante PIX
- PDF da compra da passagem
- validacoes especificas
- classificacao em rubrica de passagens

Impacto: o processo separa passagens como fluxo proprio, mas o backend atual nao apresenta esse tipo como conceito explicito.

### Diarias com Solicitacao M003 e PIX

`JustificativaDiaria` possui valor unitario, quantidade e alocacao do bolsista, mas nao possui os campos exigidos pelo processo revisado de comprovacao:

- referencia a solicitacao de diaria aprovada do M003
- bloqueio de reutilizacao de solicitacao de diaria ja prestada contas
- comprovante PIX do pagamento
- metadados do pagamento

Impacto: a entidade atende ao MVP antigo, mas nao ao fluxo atual de diarias, no qual a solicitacao e aceite pertencem ao M003 e a prestacao de contas apenas comprova o pagamento.

### Importacao CNAB 240 com EDI, MinIO, Fila e Workers

O backend recebe um lote de transacoes ja processadas no endpoint `importar-extrato`.

O processo revisado exige uma arquitetura mais completa:

1. EDI Banestes grava CNAB 240 em pasta de servidor.
2. Job de captura le a pasta.
3. Job envia arquivo bruto para API/Base M014.
4. API salva arquivo bruto no MinIO.
5. API publica mensagem em fila.
6. Workers consomem a fila.
7. Workers chamam a API para processar o CNAB.
8. API persiste debitos e creditos como `TransacaoFinanceira`.

Lacunas:

- entidade/registro de captura do arquivo CNAB
- upload do arquivo CNAB bruto para MinIO
- referencia bucket/chave do CNAB
- fila de importacao
- workers de importacao
- controle de idempotencia por arquivo/linha
- status de processamento da importacao
- trilha de auditoria da importacao diaria

Impacto: a persistencia final das transacoes existe, mas a arquitetura operacional diaria ainda nao esta implementada.

### RubricaOrcamentaria vs ContaContabil

O backend usa `ContaContabil` para classificar itens de documento fiscal.

O modelo revisado define `RubricaOrcamentaria` como termo de dominio. `ContaContabil` deve ser tratado como nome legado tecnico ate migracao controlada.

Impacto:

- contratos, DTOs e nomes de metodos ainda falam `ContaContabil`
- o processo e os EPICs falam `RubricaOrcamentaria`
- a migracao precisa ser planejada para evitar quebra de contratos e banco

### Encaixe Automatico em Rubricas

O backend possui vinculo manual de item com conta contabil/rubrica.

O processo revisado diz que, quando a SERPRO retorna os dados da nota fiscal de produto, o sistema usa os itens retornados para encaixar as compras nas rubricas.

Lacunas:

- regra de sugestao automatica por NCM, CFOP, descricao ou catalogo de rubricas
- confianca/justificativa da sugestao
- aceite ou ajuste pelo Coordenador/Outorgado
- auditoria da classificacao final

Impacto: hoje existe base para classificar itens, mas nao foi identificado motor de sugestao automatica.

## Avaliacao por Fluxo

| Fluxo | Aderencia | Observacao |
|-------|-----------|------------|
| Fluxo 1 - Importacao unica do orcamento original | Parcial | O backend possui conceitos de orcamento/conta contabil, mas a integracao unica Conecta FAPES -> SIGFAPES precisa ser confirmada fora do recorte analisado. |
| Fluxo 2 - CNAB 240 diario | Parcial baixa | Existe importacao de transacoes ja processadas, mas faltam EDI Banestes, pasta, arquivo bruto no MinIO, fila e workers. |
| Fluxo 3.1 - Base da prestacao | Boa | `Prestacao`, transacoes e ciclo base estao implementados. |
| Fluxo 3.2 - NF de produto | Boa | SERPRO, duplicidade e itens fiscais existem. Falta evoluir o encaixe automatico em rubricas. |
| Fluxo 3.3 - NF de servico | Boa para o momento atual | Extracao interna de NFS-e existe. SERPRO para servico fica como evolucao futura. |
| Fluxo 3.4 - Produto sem nota fiscal | Baixa | Nao ha suporte identificado. |
| Fluxo 3.5 - Invoice | Parcial | Entidade existe, mas ainda e generica. |
| Fluxo 3.6 - Diarias | Parcial | Entidade existe, mas faltam referencia a solicitacao de diaria aprovada do M003 e PIX. |
| Fluxo 3.7 - Passagens | Baixa | Nao ha tipo/fluxo proprio identificado. |
| Fluxo 4 - Submissao e analise | Boa para MVP | Ciclo de submissao e analise esta implementado. |
| Fluxo 5 - Revisao | Boa para MVP | Estado `REVISAO` e ressubmissao existem. |

## Recomendacoes Arquiteturais

### Prioridade 1 - Fechar lacunas de dominio do processo revisado

Implementar:

- `JustificativaProdutoSemNota`
- tipo especifico para passagens ou decisao documentada de modelar passagens como subtipo existente
- campos de referencia a solicitacao de diaria aprovada do M003 e PIX em diarias
- campos de PIX e PDF de compra em passagens
- enum `TipoJustificativa.PRODUTO_SEM_NOTA`

### Prioridade 2 - Formalizar a arquitetura da importacao CNAB

Criar componentes para:

- captura diaria do arquivo gerado pelo EDI Banestes
- registro da captura na Base M014
- armazenamento do CNAB bruto no MinIO
- publicacao em fila
- processamento paralelo por workers
- idempotencia e auditoria

### Prioridade 3 - Resolver o nome de dominio da classificacao

Escolher um caminho:

- migrar `ContaContabil` para `RubricaOrcamentaria`; ou
- manter `ContaContabil` como nome tecnico por enquanto, documentando explicitamente o mapeamento para `RubricaOrcamentaria`.

A recomendacao do modelo M014 e migrar de forma controlada, pois `RubricaOrcamentaria` comunica melhor a regra de negocio de prestacao de contas.

### Prioridade 4 - Evoluir classificacao automatica por rubrica

Adicionar uma camada de sugestao de rubrica para itens retornados pela SERPRO:

- regras por NCM/CFOP
- regras por descricao
- tabela de mapeamento mantida pela area tecnica
- confirmacao manual pelo Coordenador/Outorgado
- auditoria da classificacao final

## Conclusao

O backend atual e uma boa base para M014 e ja implementa as partes mais importantes da V1. A maior diferenca esta no fato de que o processo documentado evoluiu para um desenho operacional mais completo, principalmente em:

- CNAB 240 diario com MinIO e fila
- produto sem nota fiscal
- passagens
- PIX em diaria e passagem
- referencia a solicitacao de diaria aprovada do M003
- rubricas como linguagem de dominio
- sugestao automatica de rubricas a partir dos dados fiscais

Assim, a arquitetura atual deve ser tratada como **base valida**, mas nao como implementacao completa do processo revisado.
