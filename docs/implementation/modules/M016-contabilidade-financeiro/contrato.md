# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M016 como contexto responsavel por plano de contas, contas bancarias, movimentacoes financeiras, conciliacao e fluxo de caixa da plataforma.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Gestor financeiro | Mantem contas, lancamentos e conciliacoes |
| M017 | Consome movimentacoes para monitoramento PLD |
| M018 e M019 | Consultam saldos, fluxo e dados consolidados para analise e auditoria |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M003 | Modulo interno | Fornece `Iniciativa` como entidade externa do escopo financeiro |
| M010 | Modulo interno | Fornece `Programa` e `Parceria` |
| Extrato bancario / sistema financeiro | Sistema externo | Pode alimentar conciliacao e dados de conta bancaria |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| CriarFundoFinanceiro | Command | Registrar fundo financeiro gerido pela agencia de fomento que agrega recursos de multiplas contas bancarias | nome, descricao | `FundoFinanceiro` criado no estado `ATIVO` | — | Nome informado | Fundo duplicado | Nao | Gestor financeiro | API interna/backoffice a definir |
| CriarContaContabil | Command | Registrar conta contabil conforme plano de contas governamental | codigo, nome, tipo, natureza | `ContaContabil` criada | RN01, RI1 | Codigo informado | Conta contabil duplicada, tipo invalido | Nao | Gestor financeiro | API interna/backoffice a definir |
| AssociarContaAoEscopoFinanceiro | Command | Associar conta contabil a iniciativa, programa ou parceria | contaContabil, tipoAssociacao, referencia | `AssociacaoConta` criada | RN02, RN07 | Conta existente | Associacao obrigatoria ausente, referencia invalida | Nao | Gestor financeiro | API interna/backoffice a definir |
| CadastrarContaBancaria | Command | Registrar conta bancaria vinculada a um FundoFinanceiro (obrigatorio) e opcionalmente a um escopo de negocio (Iniciativa, Programa ou Parceria) | banco, agencia, numeroConta, fundoFinanceiroId, referencia? | `ContaBancaria` criada | RN03, RI2 | FundoFinanceiro existente; escopo informado quando fornecido | Fundo inexistente, conta duplicada, referencia invalida | Nao | Gestor financeiro | API interna/backoffice a definir |
| RegistrarMovimentacaoFinanceira | Command | Registrar lancamento financeiro em conta contabil e bancaria | contaContabil, contaBancaria, tipoMovimentacao, valor, data | `MovimentacaoFinanceira` registrada | RN05, RN06, RN07 | Associacoes existentes | Saldo negativo nao autorizado, conta invalida | Nao | Gestor financeiro | API interna/backoffice a definir |
| ExecutarConciliacaoBancaria | Async Job | Comparar extrato bancario com lancamentos do sistema e registrar divergencias | contaBancaria, periodo | `ConciliacaoBancaria` executada | RN04, RN08, RN09 | Conta bancaria existente | Conciliacao em andamento, extrato indisponivel | Sim por conta e periodo | Sistema ou gestor financeiro | Job/fila a definir |
| ConsultarFluxoCaixaESaldos | Query | Consultar fluxo de caixa e saldos por conta, programa ou iniciativa | conta, programa, parceria, periodo | `FluxoCaixa` e `SaldoConta` consolidados | RN05, RN10 | Filtro informado | Consulta sem dados | N/A | Gestor financeiro ou perfil autorizado | API interna a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- O contrato nao fixa layout de extrato bancario nem integracao contábil concreta.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "conta": "CTB-2026-010"
    }
  }
}
```

## Nota de Deferimento

> **`CriarFundoFinanceiro` e `CadastrarContaBancaria` (vinculo ao fundo) — fora do escopo deste sprint.**
> O modelo estrutural e o contrato ja refletem `FundoFinanceiro` e o relacionamento N:1 com `ContaBancaria`, mas a implementacao dessas operacoes sera planejada somente apos a conclusao do modulo M014 (Prestacao de Contas), quando o fluxo financeiro completo entre aportes, fundos e execucao estiver definido.

## Exemplos JSON por Operacao

### CriarFundoFinanceiro

**Exemplo de entrada**

```json
{
  "nome": "Fundo de Pesquisa e Inovacao",
  "descricao": "Fundo que concentra recursos oriundos de parcerias institucionais para fomento a pesquisa aplicada."
}
```

**Exemplo de saida**

```json
{
  "fundoFinanceiro": {
    "id": "FF-2026-001",
    "nome": "Fundo de Pesquisa e Inovacao",
    "estado": "ATIVO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FUNDO_FINANCEIRO_DUPLICADO | Ja existe um fundo financeiro com o nome informado. |

---

### CriarContaContabil

**Exemplo de entrada**

```json
{
  "codigo": "1.1.1.01",
  "nome": "Caixa e equivalentes",
  "tipoConta": "ATIVO",
  "natureza": "DEVEDORA"
}
```

**Exemplo de saida**

```json
{
  "contaContabil": {
    "id": "CTB-2026-010",
    "codigo": "1.1.1.01"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CONTA_CONTABIL_DUPLICADA | Ja existe conta contabil cadastrada com o codigo informado. |
| CONTA_CONTABIL_INVALIDA | Os dados informados para a conta contabil sao invalidos. |

### AssociarContaAoEscopoFinanceiro

**Exemplo de entrada**

```json
{
  "contaContabilId": "CTB-2026-010",
  "tipoAssociacao": "PROGRAMA",
  "referenciaId": "PROG-2026-01"
}
```

**Exemplo de saida**

```json
{
  "associacaoConta": {
    "contaContabilId": "CTB-2026-010",
    "tipoAssociacao": "PROGRAMA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| REFERENCIA_FINANCEIRA_INVALIDA | A iniciativa, programa ou parceria informada nao pode receber associacao financeira. |
| CONTA_SEM_ASSOCIACAO_PERMITIDA | A conta contabil precisa estar associada a ao menos um escopo valido. |

### CadastrarContaBancaria

**Exemplo de entrada**

```json
{
  "banco": "104",
  "agencia": "1234",
  "numeroConta": "000123-4",
  "tipoAssociacao": "INICIATIVA",
  "referenciaId": "PROJ-2026-014"
}
```

**Exemplo de saida**

```json
{
  "contaBancaria": {
    "id": "CB-2026-002",
    "numeroConta": "000123-4"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CONTA_BANCARIA_DUPLICADA | Ja existe conta bancaria cadastrada com os mesmos dados informados. |
| REFERENCIA_CONTA_BANCARIA_INVALIDA | A referencia informada nao pode ser associada a conta bancaria. |

### RegistrarMovimentacaoFinanceira

**Exemplo de entrada**

```json
{
  "contaContabilId": "CTB-2026-010",
  "contaBancariaId": "CB-2026-002",
  "tipoMovimentacao": "DEBITO",
  "valor": 3500.0,
  "data": "2026-04-13"
}
```

**Exemplo de saida**

```json
{
  "movimentacaoFinanceira": {
    "id": "MOV-2026-088",
    "valor": 3500.0
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| SALDO_NEGATIVO_NAO_AUTORIZADO | A movimentacao resultaria em saldo negativo sem autorizacao expressa. |
| ASSOCIACAO_FINANCEIRA_AUSENTE | Nao existe associacao valida entre conta contabil e escopo para o lancamento. |

### ExecutarConciliacaoBancaria

**Exemplo de entrada**

```json
{
  "contaBancariaId": "CB-2026-002",
  "periodoInicio": "2026-04-01",
  "periodoFim": "2026-04-30"
}
```

**Exemplo de saida**

```json
{
  "conciliacaoBancaria": {
    "id": "CONC-2026-004",
    "estado": "EM_ANDAMENTO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CONCILIACAO_EM_ANDAMENTO | Ja existe conciliacao em andamento para a conta bancaria informada. |
| EXTRATO_BANCARIO_INDISPONIVEL | Nao foi possivel obter ou processar o extrato bancario para conciliacao. |

### ConsultarFluxoCaixaESaldos

**Exemplo de entrada**

```json
{
  "referenciaId": "PROG-2026-01",
  "periodoInicio": "2026-04-01",
  "periodoFim": "2026-04-30"
}
```

**Exemplo de saida**

```json
{
  "fluxoCaixa": {
    "entradas": 120000.0,
    "saidas": 3500.0
  },
  "saldoConta": 116500.0
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CONSULTA_FINANCEIRA_SEM_DADOS | Nao ha dados financeiros para o filtro informado. |
| FILTRO_FINANCEIRO_INVALIDO | Os filtros informados para fluxo de caixa e saldos sao invalidos. |

## Mapeamento de Transporte

- `Command` e `Query`: `API interna/backoffice a definir`.
- `ExecutarConciliacaoBancaria`: `job/fila a definir`.
- Integracoes bancarias permanecem `a definir`.

## Eventos e Efeitos Colaterais

- `RegistrarMovimentacaoFinanceira` alimenta fluxo de caixa, saldos e dados para auditoria/PLD.
- `ExecutarConciliacaoBancaria` gera divergencias que precisam ser tratadas antes do fechamento.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
