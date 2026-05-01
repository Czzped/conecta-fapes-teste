# Modelo Estrutural

Dominio e regras de negocio: ver [README.md](README.md)

## Diagrama de Classes

```mermaid
classDiagram
    direction TB

    %% Agregado Principal: Prestacao
    class Prestacao {
        +Guid Id
        +DateTimeOffset Data
        +StatusPrestacao Status
        +IReadOnlyCollection~JustificativaDespesa~ Justificativas
        +IReadOnlyCollection~TransacaoFinanceira~ Transacoes
        +Submeter()
        +SolicitarRevisao()
        +Aprovar()
        +Negar()
        +AdicionarJustificativa(justificativa)
        +RemoverJustificativa(justificativa)
        +AdicionarTransacao(transacao)
        +RemoverTransacao(transacao)
        +ValorTotalJustificativas() decimal
        +ValorTotalTransacoes() decimal
        +Saldo() decimal
    }

    %% Transacao Financeira
    class TransacaoFinanceira {
        +Guid Id
        +ContaBancaria ContaBancaria
        +Guid TransacaoFinanceiraContaBancariaId
        +Prestacao? Prestacao
        +Guid? TransacaoFinanceiraPrestacaoId
        +RubricaOrcamentaria? RubricaOrcamentaria
        +Guid? TransacaoFinanceiraRubricaOrcamentariaId
        +Guid? TransacaoEstornadaId
        +DateTimeOffset Data
        +decimal Valor
        +string Descricao
        +string Identificador
        +string? Fonte
        +TipoOperacao Tipo
        +TipoClassificacaoTransacao Classificacao
        +StatusTransacao Status
        +VincularPrestacao(prestacaoId)
        +DesvincularPrestacao()
        +ClassificarComoEstorno(debitoId)
        +ClassificarComoRendimento()
    }

    %% Conta Bancaria
    class ContaBancaria {
        +Guid Id
        +Guid ContaBancariaProjetoId
        +string Banco
        +string Agencia
        +string Numero
        +string Titular
        +decimal SaldoAtual
        +AtualizarSaldo(novoSaldo)
    }

    %% Justificativa de Despesa (classe base)
    class JustificativaDespesa {
        +Guid Id
        +Prestacao Prestacao
        +Guid JustificativaDespesaPrestacaoId
        +string Descricao
        +decimal ValorTotal
        +string? UrlArquivo
        +ICollection~OrcamentoFornecedor~ Orcamentos
        +AtualizarValorTotal(novoValorTotal)
        +AtualizarUrlArquivo(urlArquivo)
    }

    %% Tipos de Justificativa
    class JustificativaNF {
        +DocumentoFiscal DocumentoFiscal
    }

    class JustificativaDiaria {
        +decimal ValorDiaria
        +int Quantidade
        +Guid JustificativaDiariaAlocacaoBolsistaId
    }

    class JustificativaInvoice {
        +decimal ValorCambio
        +TipoMoeda Moeda
    }

    class JustificativaProdutoSemNota {
        +string Fornecedor
        +string? IdentificadorFornecedor
        +DateTime DataCompra
        +Guid JustificativaProdutoSemNotaRubricaOrcamentariaId
        +RubricaOrcamentaria RubricaOrcamentaria
        +string JustificativaAusenciaNota
        +string UrlComprovanteAlternativo
        +bool AnaliseObrigatoria
    }

    %% Documento Fiscal
    class DocumentoFiscal {
        +Guid Id
        +JustificativaNF? JustificativaNF
        +Guid DocumentoFiscalJustificativaNFId
        +string ChaveAcesso
        +string NomeEmitente
        +string Descricao
        +decimal ValorTotal
        +string UF
        +string Pais
        +string Identificador
        +decimal TotalICMS
        +decimal TotalPIS
        +decimal TotalIPI
        +decimal TotalISS
        +TipoNota TipoNota
        +ICollection~ItemDocumentoFiscal~ ItensDocumentoFiscal
    }

    %% Item de Documento Fiscal
    class ItemDocumentoFiscal {
        +Guid Id
        +Guid ItemDocumentoFiscalDocumentoFiscalId
        +Guid ItemDocumentoFiscalRubricaOrcamentariaId
        +string Descricao
        +int Quantidade
        +decimal ValorUnitario
        +decimal ValorTotal
        +string? NCM
        +string? CFOP
        +VincularRubricaOrcamentaria(rubricaOrcamentariaId)
        +DesvincularRubricaOrcamentaria()
    }

    %% Orcamento Fornecedor
    class OrcamentoFornecedor {
        +Guid Id
        +JustificativaDespesa JustificativaDespesa
        +Guid OrcamentoFornecedorJustificativaDespesaId
        +string Fornecedor
        +decimal Valor
        +DateTime Data
        +string UrlArquivoPDF
        +bool Escolhido
        +MarcarComoEscolhido()
        +DesmarcarComoEscolhido()
        +Atualizar(fornecedor, valor, data, arquivoPDF)
    }

    %% Orcamento do Projeto
    class Orcamento {
        +Guid Id
        +Guid? OrcamentoProjetoId
        +int Ano
        +decimal ValorTotal
        +decimal ValorBolsasPrevisto
        +decimal ValorCapitalPrevisto
        +ICollection~RubricaOrcamentaria~ RubricasOrcamentarias
        +SaldoBolsas() decimal
        +SaldoCapital() decimal
        +SaldoTotal() decimal
    }

    %% Rubrica Orcamentaria
    class RubricaOrcamentaria {
        +Guid Id
        +Guid RubricaOrcamentariaOrcamentoId
        +Guid? RubricaOrcamentariaParentId
        +string Descricao
        +decimal Limite
        +ICollection~RubricaOrcamentaria~ SubRubricas
        +ICollection~ItemDocumentoFiscal~ ItensDocumentoFiscal
        +Saldo() decimal
    }

    %% Entidades de Referencia Externa (ImportacaoEditais)
    class ProjetoRef {
        <<view externa>>
        +Guid Id
        +string IdentificadorBancario
    }

    class AlocacaoBolsistaRef {
        <<view externa>>
        +Guid Id
    }

    %% Relacionamentos
    Prestacao "1" --> "*" JustificativaDespesa : contem
    Prestacao "1" --> "*" TransacaoFinanceira : contem

    TransacaoFinanceira "*" --> "1" ContaBancaria : pertence a
    TransacaoFinanceira "*" --> "0..1" Prestacao : vinculada a
    TransacaoFinanceira "*" --> "0..1" RubricaOrcamentaria : classificada em
    TransacaoFinanceira "0..1" --> "0..1" TransacaoFinanceira : estorna

    JustificativaDespesa <|-- JustificativaNF : herda
    JustificativaDespesa <|-- JustificativaDiaria : herda
    JustificativaDespesa <|-- JustificativaInvoice : herda
    JustificativaDespesa <|-- JustificativaProdutoSemNota : herda

    JustificativaDespesa "1" --> "*" OrcamentoFornecedor : possui
    JustificativaNF "1" --> "1" DocumentoFiscal : associada a
    JustificativaProdutoSemNota "*" --> "1" RubricaOrcamentaria : classificada em

    DocumentoFiscal "1" --> "*" ItemDocumentoFiscal : contem

    Orcamento "1" --> "*" RubricaOrcamentaria : possui
    RubricaOrcamentaria "1" --> "*" RubricaOrcamentaria : subrubricas
    RubricaOrcamentaria "1" --> "*" ItemDocumentoFiscal : classifica

    %% Referencias externas (views de M002 - Importacao de Editais)
    ContaBancaria "1" --> "1" ProjetoRef : projeto
    Orcamento "*" --> "0..1" ProjetoRef : projeto
    JustificativaDiaria "*" --> "1" AlocacaoBolsistaRef : bolsista
```

---

## Classe Base — BaseEntity

Todas as entidades herdam de `BaseEntity` (`ConectaFapes.Common.Domain.BaseEntities`):

| Atributo | Tipo | Nullable | Descricao |
|---|---|---|---|
| Id | Guid | Nao | Identificador unico gerado automaticamente |
| DateCreated | DateTimeOffset | Nao | Data de criacao do registro (default: DateTimeOffset.Now) |
| DateUpdated | DateTimeOffset? | Sim | Data da ultima atualizacao |
| DateDeleted | DateTimeOffset? | Sim | Data de exclusao logica — preenchida pelo metodo `Delete()` |

---

## Dicionario de Dados

### Prestacao

| Atributo | Tipo | Nullable | Obrig. | Descricao |
|---|---|---|---|---|
| Data | DateTimeOffset | Nao | Sim | Data de referencia da prestacao de contas |
| Status | StatusPrestacao | Nao | Gerado | Estado atual no ciclo de vida — ver enumeracoes |
| Justificativas | IReadOnlyCollection&lt;JustificativaDespesa&gt; | Nao | — | Justificativas de despesa vinculadas a esta prestacao |
| Transacoes | IReadOnlyCollection&lt;TransacaoFinanceira&gt; | Nao | — | Transacoes financeiras vinculadas a esta prestacao |

### TransacaoFinanceira

| Atributo | Tipo | Nullable | Obrig. | Descricao |
|---|---|---|---|---|
| ContaBancaria | ContaBancaria | Nao | Sim | Navegacao para a conta bancaria proprietaria |
| TransacaoFinanceiraContaBancariaId | Guid | Nao | Sim | FK para ContaBancaria |
| Prestacao | Prestacao? | Sim | Nao | Navegacao para a prestacao vinculada (null se ainda nao vinculada) |
| TransacaoFinanceiraPrestacaoId | Guid? | Sim | Nao | FK para Prestacao — null se a transacao ainda nao foi vinculada |
| RubricaOrcamentaria | RubricaOrcamentaria? | Sim | Nao | Rubrica usada para classificar creditos como Estorno ou Rendimento quando aplicavel |
| TransacaoFinanceiraRubricaOrcamentariaId | Guid? | Sim | Nao | FK opcional para RubricaOrcamentaria de classificacao operacional da transacao |
| TransacaoEstornadaId | Guid? | Sim | Nao | FK opcional para a transacao de debito compensada por um credito de estorno |
| Data | DateTimeOffset | Nao | Sim | Data do lancamento bancario |
| Valor | decimal | Nao | Sim | Valor monetario da transacao (>= 0) |
| Descricao | string | Nao | Sim | Descricao do lancamento conforme extrato |
| Identificador | string | Nao | Sim | Identificador unico da transacao no arquivo CNAB 240 |
| Fonte | string? | Sim | Nao | Origem/fonte do lancamento usada para parear estorno com debito de mesmo valor e mesma fonte |
| Tipo | TipoOperacao | Nao | Sim | DEBITO ou CREDITO |
| Classificacao | TipoClassificacaoTransacao | Nao | Gerado | Classificacao operacional da transacao: DESPESA, ESTORNO, RENDIMENTO ou PENDENTE_CLASSIFICACAO |
| Status | StatusTransacao | Nao | Gerado | Derivado do Status da Prestacao vinculada — ver enumeracoes |

### ContaBancaria

| Atributo | Tipo | Nullable | Obrig. | Descricao |
|---|---|---|---|---|
| ContaBancariaProjetoId | Guid | Nao | Sim | FK obrigatoria para ProjetoRef. Todo projeto possui uma conta bancaria para movimentacao dos recursos |
| Banco | string | Nao | Sim | Nome do banco |
| Agencia | string | Nao | Sim | Numero da agencia bancaria |
| Numero | string | Nao | Sim | Numero da conta corrente do projeto |
| Titular | string | Nao | Sim | Nome do titular da conta |
| SaldoAtual | decimal | Nao | Gerado | Saldo atual calculado a partir das transacoes |

### JustificativaDespesa (classe base)

Classe base concreta (nao declarada `abstract` no codigo, porem com construtor `protected` — instancia-se apenas atraves de `JustificativaNF`, `JustificativaDiaria`, `JustificativaInvoice` ou `JustificativaProdutoSemNota`).

| Atributo | Tipo | Nullable | Obrig. | Descricao |
|---|---|---|---|---|
| Prestacao | Prestacao | Nao | Sim | Navegacao para a prestacao proprietaria |
| JustificativaDespesaPrestacaoId | Guid | Nao | Sim | FK para Prestacao |
| Descricao | string | Nao | Sim | Descricao textual da despesa justificada |
| ValorTotal | decimal | Nao | Gerado | Valor total da despesa (>= 0) — atualizado por `AtualizarValorTotal()` |
| UrlArquivo | string? | Sim | Nao | URL do arquivo comprovante armazenado no MinIO — atualizado por `AtualizarUrlArquivo()` |
| Orcamentos | ICollection&lt;OrcamentoFornecedor&gt; | Nao | — | Orcamentos de fornecedor vinculados |

### JustificativaNF

Herda todos os atributos de `JustificativaDespesa`. Valor total derivado do `DocumentoFiscal` vinculado (inicializado como 0).

| Atributo | Tipo | Nullable | Obrig. | Descricao |
|---|---|---|---|---|
| DocumentoFiscal | DocumentoFiscal | Nao | Sim | Nota fiscal associada a esta justificativa (navegacao) |

### JustificativaDiaria

Herda todos os atributos de `JustificativaDespesa`.

| Atributo | Tipo | Nullable | Obrig. | Descricao |
|---|---|---|---|---|
| ValorDiaria | decimal | Nao | Sim | Valor unitario de cada diaria (>= 0) |
| Quantidade | int | Nao | Sim | Numero de diarias (> 0) |
| JustificativaDiariaAlocacaoBolsistaId | Guid | Nao | Sim | FK para AlocacaoBolsistaRef — bolsista beneficiario da diaria |
| SolicitacaoDiariaRef | string/Guid | Nao | Sim | Referencia externa da solicitacao de diaria aprovada no M003 |

Regras estruturais:

- `SolicitacaoDiariaRef` deve ser unica entre `JustificativaDiaria` ativas, impedindo que a mesma diaria seja prestada contas mais de uma vez.
- A lista de selecao de diarias deve consultar o M003 e remover solicitacoes ja vinculadas a `JustificativaDiaria`.

### JustificativaInvoice

Herda todos os atributos de `JustificativaDespesa`. Usada para despesas realizadas em moeda estrangeira.

| Atributo | Tipo | Nullable | Obrig. | Descricao |
|---|---|---|---|---|
| ValorCambio | decimal | Nao | Sim | Taxa de cambio aplicada na conversao para BRL |
| Moeda | TipoMoeda | Nao | Sim | Moeda estrangeira utilizada — ver enumeracoes |

### JustificativaProdutoSemNota

Herda todos os atributos de `JustificativaDespesa`. Usada para compra excepcional de produto sem nota fiscal, com justificativa formal, comprovante alternativo e analise obrigatoria pela Area Tecnica.

| Atributo | Tipo | Nullable | Obrig. | Descricao |
|---|---|---|---|---|
| Fornecedor | string | Nao | Sim | Nome ou razao social do fornecedor da compra |
| IdentificadorFornecedor | string? | Sim | Nao | CPF ou CNPJ do fornecedor, quando informado |
| DataCompra | DateTime | Nao | Sim | Data da compra sem nota fiscal |
| RubricaOrcamentaria | RubricaOrcamentaria | Nao | Sim | Rubrica orcamentaria usada para classificar a despesa |
| JustificativaProdutoSemNotaRubricaOrcamentariaId | Guid | Nao | Sim | FK para RubricaOrcamentaria |
| JustificativaAusenciaNota | string | Nao | Sim | Justificativa formal para ausencia da nota fiscal |
| UrlComprovanteAlternativo | string | Nao | Sim | URL do comprovante alternativo armazenado no MinIO |
| AnaliseObrigatoria | bool | Nao | Gerado | Indica que a despesa deve ser destacada para analise obrigatoria pela Area Tecnica |

### OrcamentoFornecedor

| Atributo | Tipo | Nullable | Obrig. | Descricao |
|---|---|---|---|---|
| JustificativaDespesa | JustificativaDespesa | Nao | Sim | Navegacao para a justificativa proprietaria |
| OrcamentoFornecedorJustificativaDespesaId | Guid | Nao | Sim | FK para JustificativaDespesa |
| Fornecedor | string | Nao | Sim | Nome ou razao social do fornecedor |
| Valor | decimal | Nao | Sim | Valor total do orcamento (>= 0) |
| Data | DateTime | Nao | Sim | Data de emissao do orcamento |
| UrlArquivoPDF | string | Nao | Sim | URL do PDF do orcamento armazenado no MinIO |
| Escolhido | bool | Nao | Gerado | Indica se este orcamento foi selecionado como vencedor — definido por `MarcarComoEscolhido()` |

### DocumentoFiscal

| Atributo | Tipo | Nullable | Obrig. | Descricao |
|---|---|---|---|---|
| JustificativaNF | JustificativaNF? | Sim | Nao | Navegacao para a justificativa associada (1:1) |
| DocumentoFiscalJustificativaNFId | Guid | Nao | Sim | FK para JustificativaNF |
| ChaveAcesso | string | Nao | Sim | Chave de acesso da NF-e com 44 digitos — usada na consulta SERPRO |
| NomeEmitente | string | Nao | Sim | Razao social do emitente da nota fiscal |
| Descricao | string | Nao | Sim | Descricao do objeto da nota fiscal |
| ValorTotal | decimal | Nao | Sim | Valor total da nota (>= 0) |
| UF | string | Nao | Sim | Unidade federativa do emitente |
| Pais | string | Nao | Sim | Pais do emitente |
| Identificador | string | Nao | Sim | CPF ou CNPJ do emitente |
| TotalICMS | decimal | Nao | Sim | Total de ICMS destacado na nota (>= 0) |
| TotalPIS | decimal | Nao | Sim | Total de PIS destacado na nota (>= 0) |
| TotalIPI | decimal | Nao | Sim | Total de IPI destacado na nota (>= 0) |
| TotalISS | decimal | Nao | Sim | Total de ISS destacado na nota (>= 0) |
| TipoNota | TipoNota | Nao | Sim | Tipo da nota: PRODUTO ou SERVICO |
| ItensDocumentoFiscal | ICollection&lt;ItemDocumentoFiscal&gt; | Nao | — | Itens discriminados na nota fiscal |

### ItemDocumentoFiscal

| Atributo | Tipo | Nullable | Obrig. | Descricao |
|---|---|---|---|---|
| ItemDocumentoFiscalDocumentoFiscalId | Guid | Nao | Sim | FK para DocumentoFiscal |
| ItemDocumentoFiscalRubricaOrcamentariaId | Guid | Nao | Sim | FK para RubricaOrcamentaria — define a classificacao orcamentaria do item |
| Descricao | string | Nao | Sim | Descricao do item conforme nota fiscal |
| Quantidade | int | Nao | Sim | Quantidade do item (> 0) |
| ValorUnitario | decimal | Nao | Sim | Valor unitario do item (>= 0) |
| ValorTotal | decimal | Nao | Gerado | Valor total do item — calculado como Quantidade * ValorUnitario |
| NCM | string? | Sim | Nao | Codigo NCM — Nomenclatura Comum do Mercosul |
| CFOP | string? | Sim | Nao | Codigo CFOP — Codigo Fiscal de Operacoes e Prestacoes |

### Orcamento

> **DT-M014-001:** Implementado neste backend mas pertence conceitualmente a M013 (Gestao Orcamentaria).

| Atributo | Tipo | Nullable | Obrig. | Descricao |
|---|---|---|---|---|
| OrcamentoProjetoId | Guid? | Sim | Nao | FK para ProjetoRef (view externa) |
| Ano | int | Nao | Sim | Ano de referencia do orcamento |
| ValorTotal | decimal | Nao | Sim | Valor total aprovado para o projeto no ano |
| ValorBolsasPrevisto | decimal | Nao | Sim | Valor previsto para pagamento de bolsas |
| ValorCapitalPrevisto | decimal | Nao | Sim | Valor previsto para aquisicao de capital |
| RubricasOrcamentarias | ICollection&lt;RubricaOrcamentaria&gt; | Nao | — | Rubricas orcamentarias que estruturam o orcamento |

### RubricaOrcamentaria

> **DT-M014-001:** Implementado neste backend mas pertence conceitualmente a M013 (Gestao Orcamentaria).
> **DT-M014-005:** O termo legado `ContaContabil` deve ser migrado no codigo/persistencia para `RubricaOrcamentaria`; no dominio deste modulo, a classificacao de despesas e feita por rubrica orcamentaria.

| Atributo | Tipo | Nullable | Obrig. | Descricao |
|---|---|---|---|---|
| RubricaOrcamentariaOrcamentoId | Guid | Nao | Sim | FK para Orcamento |
| RubricaOrcamentariaParentId | Guid? | Sim | Nao | FK para RubricaOrcamentaria pai — null se rubrica raiz (auto-referencia hierarquica) |
| Descricao | string | Nao | Sim | Descricao da rubrica orcamentaria |
| Limite | decimal | Nao | Sim | Limite de gasto aprovado para esta rubrica (>= 0) |
| SubRubricas | ICollection&lt;RubricaOrcamentaria&gt; | Nao | — | Rubricas filhas na hierarquia |
| ItensDocumentoFiscal | ICollection&lt;ItemDocumentoFiscal&gt; | Nao | — | Itens de documentos fiscais classificados nesta rubrica |

---

## Entidades de Referencia Externa (ImportacaoEditais)

Entidades triviais mapeadas a views de banco de dados do sistema de Importacao de Editais (M002). Nao herdam de `BaseEntity`, nao possuem repositorio proprio e sao somente leitura.

### ProjetoRef

Namespace: `ConectaFapes.PrestacaoContas.Domain.Entities.ImportacaoEditais`

| Atributo | Tipo | Nullable | Obrig. | Descricao |
|---|---|---|---|---|
| Id | Guid | Nao | Sim | Identificador do projeto na view externa |
| IdentificadorBancario | string | Nao | Sim | Identificador do projeto no sistema bancario, usado pelo importador CNAB 240 para reconciliar conta/projeto quando disponivel no arquivo |

Referenciada por: `ContaBancaria.ContaBancariaProjetoId`, `Orcamento.OrcamentoProjetoId`.

### AlocacaoBolsistaRef

Namespace: `ConectaFapes.PrestacaoContas.Domain.Entities.ImportacaoEditais`

| Atributo | Tipo | Nullable | Obrig. | Descricao |
|---|---|---|---|---|
| Id | Guid | Nao | Sim | Identificador da alocacao de bolsista na view externa |

Referenciada por: `JustificativaDiaria.JustificativaDiariaAlocacaoBolsistaId`.

---

## Value Objects planejados (inativos)

Os seguintes Value Objects existem em `src/Domain/ValueObjects/` mas estao integralmente comentados no codigo — **nao estao ativos**. Os campos correspondentes nas entidades usam tipos primitivos.

| Value Object | Estado | Substituido por |
|---|---|---|
| `ChaveAcessoNF` | Comentado | `string` em `DocumentoFiscal.ChaveAcesso` (validacao de 44 digitos feita no servico SERPRO) |
| `Moeda` | Comentado | Enum `TipoMoeda` em `JustificativaInvoice.Moeda` |
| `AlocacaoBolsista` | Comentado | FK `Guid` em `JustificativaDiaria.JustificativaDiariaAlocacaoBolsistaId` apontando para `AlocacaoBolsistaRef` |
| `ValueObject` (base) | Comentado | — |

---

## Enumeracoes

| Enum | Entidade | Valores |
|---|---|---|
| StatusPrestacao | Prestacao | RASCUNHO (1), EM_ANALISE (2), REVISAO (3), FINALIZADO (4), NEGADO (5) |
| StatusTransacao | TransacaoFinanceira | PENDENTE (1), EM_RASCUNHO (2), EM_ANALISE (3), EM_REVISAO (4), APROVADA (5), REJEITADA (6) |
| TipoOperacao | TransacaoFinanceira | DEBITO (1), CREDITO (2) |
| TipoClassificacaoTransacao | TransacaoFinanceira | DESPESA (1), ESTORNO (2), RENDIMENTO (3), PENDENTE_CLASSIFICACAO (4) |
| TipoNota | DocumentoFiscal | PRODUTO (1), SERVICO (2) |
| TipoDocumentoFiscal | DocumentoFiscal | NFE_PRODUTO (1), NFSE_SERVICO (2) |
| TipoMoeda | JustificativaInvoice | BRL, USD, EUR, GBP |
| TipoJustificativa | JustificativaDespesa | NF, INVOICE, DIARIA, PRODUTO_SEM_NOTA |
| TipoArquivoNfe | (processamento interno SERPRO) | XML (1), PDF (2), Imagem (3) |

---

## Notas de Implementacao

**Backend separado:**
Este modulo roda em projeto independente `ConectaFapes.PrestacaoContas.*` com seu proprio `AppDbContext` (SQL Server) e pipeline de injecao de dependencias. Detalhes de infraestrutura em [architecture/04-dados-e-operacao.md](../../../architecture/04-dados-e-operacao.md).

**Heranca de BaseEntity:**
Todas as entidades herdam de `BaseEntity` (`ConectaFapes.Common.Domain.BaseEntities`), que fornece `Id` (Guid), timestamps de auditoria (`DateCreated`, `DateUpdated`) e exclusao logica (`DateDeleted` via `Delete()`). Nenhuma entidade e removida fisicamente do banco.

**Entidades de referencia externa:**
`ProjetoRef` e `AlocacaoBolsistaRef` sao mapeadas a views de banco de dados do sistema de Importacao de Editais (M002). Nao herdam de `BaseEntity` e nao possuem repositorio proprio — sao somente leitura.

**Divida tecnica DT-M014-001:**
`ContaBancaria`, `Orcamento`, `RubricaOrcamentaria` e `TransacaoFinanceira` estao implementadas neste backend mas pertencem conceitualmente a M013 (Gestao Orcamentaria) e M016 (Contabilidade e Financeiro). A separacao e planejada como debito tecnico de prioridade alta — ver [backlog.md](backlog.md#debito-tecnico).

**Divida tecnica DT-M014-005:**
`RubricaOrcamentaria` e o nome de dominio para a estrutura de classificacao do orcamento do projeto. Caso o backend ou o banco ainda usem `ContaContabil`, esse nome deve ser tratado como legado tecnico ate a migracao controlada de classes, tabelas, FKs, DTOs e contratos internos.

**Integracao SERPRO:**
`DocumentoFiscal` e processado via API SERPRO para NF-e (consulta por `ChaveAcesso` de 44 digitos) ou por upload direto para NFS-e. A autenticacao usa OAuth2 com cache de token em `SerproTokenService`. O tipo do arquivo (XML, PDF ou imagem) e detectado automaticamente por `TipoArquivoIdentifierService`.

**Armazenamento MinIO:**
`UrlArquivo` em `JustificativaDespesa`, `UrlComprovanteAlternativo` em `JustificativaProdutoSemNota` e `UrlArquivoPDF` em `OrcamentoFornecedor` referenciam objetos armazenados no MinIO. A API de Prestacao de Contas orquestra o registro dos metadados na Base M014 e o armazenamento dos arquivos no MinIO, retornando as URLs para persistencia no agregado.

**StatusTransacao como estado derivado:**
O `Status` de `TransacaoFinanceira` nao e persistido diretamente — e uma propriedade calculada que reflete o `Status` da `Prestacao` a qual a transacao esta vinculada. Transacoes sem vinculo ficam com status `PENDENTE`.

**Navegabilidade:**
- Cardinalidade 1: atributo do tipo da classe destino (ex: `JustificativaNF.DocumentoFiscal: DocumentoFiscal`)
- Cardinalidade N: atributo lista (ex: `Prestacao.Justificativas: IReadOnlyCollection<JustificativaDespesa>`)
- `IReadOnlyCollection` em `Prestacao` indica que as colecoes sao mutadas apenas pelos metodos da propria entidade (`AdicionarJustificativa`, `RemoverJustificativa`, etc.)
