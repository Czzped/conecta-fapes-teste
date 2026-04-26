# Analise DDD e Modularidade — M004 Pagamento de Bolsistas

| Atributo | Valor |
|----------|-------|
| **Data** | 2026-04-14 |
| **Status** | Proposta |
| **Modulo** | M004 |
| **Referencia** | [ADR-006](../../../../architecture/adr/ADR-006-reconciliacao-m004-pagamento-bolsista.md) |

## Objetivo

Este documento registra a analise do modulo M004 sob a otica de Domain-Driven Design (DDD) e design modular. Identifica violacoes de fronteira de bounded context, ausencia de conceitos estruturais (aggregates, value objects, domain events) e vazamentos de infraestrutura no modelo de dominio. Para cada problema, propoe uma mudanca concreta nos artefatos do modulo.

---

## Indice de Problemas

| # | Problema | Gravidade | Artefato(s) impactado(s) |
|---|---------|-----------|--------------------------|
| P1 | [Escrita em entidades fora do escopo](#p1-escrita-em-entidades-fora-do-escopo) | Alta | modelo-estrutural, contrato |
| P2 | [Aggregates nao identificados](#p2-aggregates-nao-identificados) | Alta | modelo-estrutural |
| P3 | [Modelo comportamental inclui AlocacaoBolsista](#p3-modelo-comportamental-inclui-alocacaobolsista) | Media | modelo-comportamental |
| P4 | [Value Objects nao identificados](#p4-value-objects-nao-identificados) | Media | modelo-estrutural |
| P5 | [Vazamento de infraestrutura no dominio](#p5-vazamento-de-infraestrutura-no-dominio) | Media | modelo-estrutural, contrato |
| P6 | [Ausencia de Domain Events formalizados](#p6-ausencia-de-domain-events-formalizados) | Media | contrato |
| P7 | [Usuario replicado como entidade completa](#p7-usuario-replicado-como-entidade-completa) | Baixa | modelo-estrutural |
| P8 | [Contratante orfao no modelo](#p8-contratante-orfao-no-modelo) | Baixa | modelo-estrutural |
| P9 | [Campos computados sem documentacao de estrategia](#p9-campos-computados-sem-documentacao-de-estrategia) | Baixa | modelo-estrutural |

---

## P1 — Escrita em entidades fora do escopo

### Situacao atual

O modelo estrutural marca `AlocacaoBolsista` como `<<fora do escopo - M003/M009>>`, mas o contrato do M004 **escreve diretamente** nessa entidade:

| Operacao M004 | Campo alterado em AlocacaoBolsista |
|---|---|
| `GerarRemessaCadastroBolsista` | `StatusCadastroBaneste` → ENVIADO |
| `ProcessarRetornoRemessaCadastro` | `StatusCadastroBaneste` → CADASTRADO / PENDENTE |
| `EncaminharPagamentoBandes` | `EhPagamentoBancoPadrao` → false |

Da mesma forma, `EncaminharPagamentoBandes` cria dados bancarios para `Pessoa` (M008).

Em DDD, um bounded context nao deve escrever em entidades que pertencem a outro bounded context. Isso cria acoplamento oculto e pode gerar inconsistencias quando o contexto dono da entidade evolui.

### Mudanca proposta

**Opcao A — Entidade local (recomendada):**

Criar uma entidade `CadastroBancarioBolsista` pertencente ao M004, que armazena o estado do cadastro bancario do bolsista na perspectiva do pagamento:

```
CadastroBancarioBolsista {
    +Guid alocacaoBolsistaId          // referencia por ID, nao navegacao
    +EnumCadastroBanestes status      // PENDENTE, ENVIADO, CADASTRADO
    +Boolean ehPagamentoBancoPadrao
    +String? contaBancaria
    +String? agenciaBancaria
    +String? codigoBanco
}
```

- O M004 passa a ser dono desses dados e os opera livremente.
- A referencia a `AlocacaoBolsista` e por ID (anti-corruption layer).
- Os campos `StatusCadastroBaneste` e `EhPagamentoBancoPadrao` sao removidos de `AlocacaoBolsista` no contexto do M003/M009.

**Opcao B — Shared Kernel:**

Manter como esta, mas documentar explicitamente no contrato de ambos os modulos (M004 e M003/M009) que os campos `StatusCadastroBaneste` e `EhPagamentoBancoPadrao` constituem um **Shared Kernel**, com regras claras:

- M004 e o unico que escreve nesses campos.
- M003/M009 podem ler, mas nunca alterar.
- Alteracoes na estrutura desses campos exigem acordo entre ambos os modulos.

### Impacto

- **modelo-estrutural.md**: adicionar `CadastroBancarioBolsista` (Opcao A) ou seção "Shared Kernel" (Opcao B)
- **contrato.md**: ajustar operacoes que escrevem em AlocacaoBolsista
- **M003/M009**: atualizar contratos para refletir a decisao

---

## P2 — Aggregates nao identificados

### Situacao atual

O modelo estrutural lista 16+ entidades proprias com relacoes, mas nao identifica **nenhum Aggregate Root** nem fronteiras de agregado. Sem isso, nao ha fronteiras transacionais claras e qualquer entidade pode ser alterada de qualquer ponto, violando invariantes.

### Mudanca proposta

Adicionar secao "Agregados" no modelo estrutural com o seguinte mapeamento:

| Aggregate Root | Entidades/VOs contidos | Invariante principal |
|---|---|---|
| **PlanoMensal** | EditalCompetencia, DecisaoLiberacao | M1 < M2 < M3; um unico plano com `ehAtual = true`; EditalCompetencia criada apos M1+1 |
| **Folha** | DecisaoFolha, GuiaDeLiberacao | Ciclo GERADA → PAGA; nao pode alterar editais/pagamentos apos geracao; cancelamento so antes de M2 do mes seguinte |
| **PagamentoBolsista** | PagamentoBolsistaDecisaoAdmin | Ciclo ALOCADO → PAGO; valor = original + bonus; vinculo com Folha por ID |
| **BonusPagamento** | — | So pode ser criado/editado se PlanoMensal nao tem folha; vinculo com VersaoModalidade por referencia |
| **Remessa** | RemessaCadastro, RemessaPagamento, ErroCadastro, ErroAgendamentoPagamento | Integridade via hash SHA256; contadores consistentes com registros de erro |
| **ProcessoRemessa** | — | Tentativa <= Limite para reprocessamento; status segue maquina de estados |
| **Contratante** | — | Dados bancarios da FAPES para geracao de remessa |

**Regras entre agregados:**

- `Folha` referencia `PagamentoBolsista` por ID (nao por navegacao direta no agregado).
- `GuiaDeLiberacao` referencia `PagamentoBolsista` por lista de IDs.
- `EditalCompetencia` referencia `Edital` (externo) por ID.
- `RemessaPagamento` referencia `Folha` e `PagamentoBolsista` por IDs.

### Impacto

- **modelo-estrutural.md**: adicionar secao "Agregados" antes do diagrama de classes; marcar `<<aggregate root>>` no diagrama Mermaid

---

## P3 — Modelo comportamental inclui AlocacaoBolsista

### Situacao atual

O `modelo-comportamental.md` documenta o ciclo de vida completo de `AlocacaoBolsista` (11 estados: EmEdicao → Finalizada). Essa maquina de estados pertence ao **M003/M009**, nao ao M004.

### Mudanca proposta

1. **Remover** o diagrama "Ciclo de Vida: AlocacaoBolsista" do modelo comportamental do M004.
2. **Renomear** o diagrama "Ciclo de Vida: AlocacaoBolsista (Cadastro Banestes)" para **"Ciclo de Vida: Cadastro Bancario do Bolsista"**, reforçando que e uma visao local do M004.
3. Adicionar nota: _"O ciclo de vida completo de AlocacaoBolsista e documentado em M003/M009. Este diagrama representa apenas o sub-ciclo controlado pelo M004."_

### Impacto

- **modelo-comportamental.md**: remover 1 diagrama, renomear outro, adicionar nota

---

## P4 — Value Objects nao identificados

### Situacao atual

Varias classes sao registros imutaveis de fatos mas estao modeladas como entidades:

| Classe atual | Deveria ser | Justificativa |
|---|---|---|
| `DecisaoLiberacao` | Value Object (dentro de EditalCompetencia) | Registro imutavel de decisao; identificada por horario + usuario |
| `DecisaoFolha` | Value Object (dentro de Folha) | Registro imutavel de auditoria |
| `ErroCadastro` | Value Object (dentro de RemessaCadastro) | Lista de codigos de erro, nunca editada |
| `ErroAgendamentoPagamento` | Value Object (dentro de RemessaPagamento) | Idem |

### Mudanca proposta

Marcar com `<<value object>>` no diagrama de classes e no dicionario de dados. Na implementacao, podem continuar com ID (necessidade do EF Core/BaseEntity), mas o modelo de dominio deve comunicar a intencao de imutabilidade.

### Impacto

- **modelo-estrutural.md**: alterar estereotipos no diagrama Mermaid e adicionar nota no dicionario

---

## P5 — Vazamento de infraestrutura no dominio

### Situacao atual

| Entidade | Campo | Problema |
|---|---|---|
| `ProcessoRemessa` | `pathMinio` | Referencia direta a tecnologia de storage |
| `ProcessoRemessa` | `pathProcesso` | Idem |
| `Remessa` | `arquivoEnviado`, `arquivoRetorno` | Ambiguo: sao caminhos MinIO ou conteudo? |

No contrato, `MinIO` e `Redis` aparecem como dependencias nomeadas por tecnologia.

### Mudanca proposta

**Modelo estrutural:**
- Renomear `pathMinio` → `caminhoArquivoOrigem`
- Renomear `pathProcesso` → `caminhoArquivoResultado`
- Documentar no dicionario que `arquivoEnviado` e `arquivoRetorno` sao referencias (caminhos) ao servico de armazenamento, nao conteudo inline

**Contrato:**
- Na tabela de dependencias, substituir:
  - `MinIO | Sistema externo` → `Servico de Armazenamento de Objetos | Sistema externo | Compativel com S3 (MinIO em producao)`
  - `Redis | Sistema externo` → `Fila de Mensagens Assincrona | Sistema externo | Redis em producao`

### Impacto

- **modelo-estrutural.md**: renomear campos, atualizar dicionario
- **contrato.md**: ajustar tabela de dependencias

---

## P6 — Ausencia de Domain Events formalizados

### Situacao atual

A secao "Eventos e Efeitos Colaterais" do contrato lista 11 efeitos como texto livre. Nenhum esta formalizado como Domain Event com schema e consumidores.

### Mudanca proposta

Adicionar secao **"Domain Events"** no contrato com a seguinte estrutura:

| Evento | Publicado por | Payload | Consumidores potenciais |
|---|---|---|---|
| `FolhaGerada` | GerarFolhaDePagamento | `{ folhaId, competencia, pagamentoIds[], editalCompetenciaIds[] }` | M017 (PLD), M018 (BI) |
| `FolhaCancelada` | RegistrarDecisaoSobreFolha (CANCELAR/REJEITAR) | `{ folhaId, pagamentoIds[], editalCompetenciaIds[] }` | M017 |
| `FolhaAutorizada` | RegistrarDecisaoSobreFolha (AUTORIZAR) | `{ folhaId, competencia }` | M016 (Contabilidade) |
| `RemessaCadastroGerada` | GerarRemessaCadastroBolsista | `{ remessaId, alocacaoIds[] }` | — |
| `RemessaPagamentoGerada` | GerarRemessaPagamento | `{ remessaId, folhaId, pagamentoIds[] }` | — |
| `RetornoRemessaProcessado` | ProcessarRetorno* | `{ remessaId, tipo, resultados[] }` | — |
| `PagamentoConcluido` | ProcessarRetornoRemessaPagamento | `{ pagamentoId, valor, bolsistaId }` | M017 (PLD), M018 (BI) |
| `FolhaPaga` | ProcessarRetorno (DP9 final) | `{ folhaId, valorTotal }` | M016, M018 |

Manter a secao "Eventos e Efeitos Colaterais" existente como descricao narrativa e referenciar esta nova secao para os schemas formais.

### Impacto

- **contrato.md**: adicionar secao "Domain Events"

---

## P7 — Usuario replicado como entidade completa

### Situacao atual

O M004 modela `Usuario` com `nome`, `email`, `cpf` como entidade no diagrama, mas usuarios sao geridos por M008 (Cadastros Corporativos).

### Mudanca proposta

Marcar `Usuario` como `<<fora do escopo - M008>>` no diagrama (como ja e feito com Edital, Projeto, etc.). Ou criar um Value Object local `AutorDecisao { nome, email }` que e uma projecao read-only do usuario autenticado.

### Impacto

- **modelo-estrutural.md**: alterar estereotipo de Usuario

---

## P8 — Contratante orfao no modelo

### Situacao atual

`Contratante` existe no diagrama e dicionario, mas nao tem nenhuma relacao com outras entidades. Nao esta claro como e usado.

### Mudanca proposta

Adicionar relacao no diagrama: `Remessa "*" --> "1" Contratante : contratante` (ou documentar que e uma entidade de configuracao usada na geracao do header do arquivo de remessa, sem FK direta).

### Impacto

- **modelo-estrutural.md**: adicionar relacao ou nota explicativa

---

## P9 — Campos computados sem documentacao de estrategia

### Situacao atual

`EditalCompetencia` tem `valorPrevisto`, `valorPago`, `bolsasVigentes`, `bolsasPendentes` — agregacoes calculadas a partir dos pagamentos. Sem documentacao sobre quando sao recalculados, podem ficar stale.

### Mudanca proposta

Adicionar no dicionario de dados uma coluna "Estrategia" indicando:
- **Denormalizado**: recalculado na geracao de folha e no processamento de retorno
- **Calculado em tempo real**: projecao do read-model

### Impacto

- **modelo-estrutural.md**: adicionar coluna ou nota no dicionario

---

## Priorizacao Sugerida

### Sprint imediata (impacto estrutural)

| # | Problema | Estimativa |
|---|---------|------------|
| P2 | Identificar Aggregates | Documentacao |
| P1 | Resolver ownership de AlocacaoBolsista | Documentacao + decisao |
| P6 | Formalizar Domain Events | Documentacao |

### Sprint seguinte (refinamento)

| # | Problema | Estimativa |
|---|---------|------------|
| P3 | Limpar modelo comportamental | Documentacao |
| P4 | Classificar Value Objects | Documentacao |
| P5 | Abstrair infraestrutura | Documentacao |

### Backlog (melhorias incrementais)

| # | Problema | Estimativa |
|---|---------|------------|
| P7 | Usuario como fora do escopo | Documentacao |
| P8 | Contratante com relacao | Documentacao |
| P9 | Estrategia de campos computados | Documentacao |
