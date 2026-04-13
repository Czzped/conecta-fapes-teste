# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M009 como contexto responsavel pela indicacao, avaliacao, formalizacao, implementacao e consulta operacional de bolsas de pesquisa.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Coordenador e Orientador | Indicam bolsistas e acompanham o fluxo da bolsa |
| Area Tecnica da Agencia de Fomento | Avalia documentos e decide continuidade do fluxo |
| M004 e M015 | Consomem o estado da bolsa para pagamento, suspensao e encerramento |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M003 | Modulo interno | Fornece `Projeto`, `Coordenador`, `Orientador`, `Bolsista` e `CotaEdital` |
| M001 | Modulo interno | Fornece `VersaoNivel` |
| Diario Oficial / assinatura | Sistema externo | Suporta publicacao e assinatura quando aplicavel |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| IndicarBolsista | Command | Registrar a indicacao inicial do bolsista para o projeto e cota | projeto, cota, coordenador, orientador, bolsista, temaPesquisa | `BolsaPesquisa` criada | RN01, RN02, RI1, RI2 | Projeto e cota validos | Cota indisponivel, bolsa simultanea invalida | Nao | Coordenador autorizado | API interna/backoffice a definir |
| RegistrarAceiteDoOrientador | Command | Registrar aceite ou recusa do orientador sobre a indicacao | bolsa, aceito, justificativa | `TermoAceite` registrado | RN03 | Bolsa indicada | Bolsa inexistente, recusa sem justificativa | Nao | Orientador | API interna/backoffice a definir |
| SubmeterDocumentacaoDaBolsa | Command | Permitir envio de documentos da bolsa apos aceite do orientador | bolsa, documentos | `DocumentoBolsa` registrado | RN03, RN05 | Aceite do orientador concluido | Aceite pendente, documento invalido | Nao | Bolsista | API interna/backoffice a definir |
| AvaliarDocumentacaoDaBolsa | Command | Emitir parecer documental e liberar ou devolver para reenvio | bolsa, aprovado, justificativa | `ParecerAvaliacao` registrado | RN04, RN05, RN09 | Documentacao submetida | Documentacao inexistente, parecer inconsistente | Nao | Area Tecnica da Agencia de Fomento | API interna/backoffice a definir |
| FormalizarEImplementarBolsa | Command | Gerar termo, registrar assinaturas, publicacao e implementacao da bolsa | bolsa, assinaturas, publicacao, dataInicio, dataFim | `BolsaPesquisa` implementada | RN06, RN07, RN08 | Documentacao aprovada | Assinaturas pendentes, publicacao ausente, vigencia invalida | Nao | Area Tecnica da Agencia de Fomento | API interna/backoffice a definir |
| ConsultarBolsaPesquisa | Query | Consultar o estado completo da bolsa, documentos, pareceres e historico | bolsa, projeto, bolsista | Detalhe ou lista de bolsas | RN08, RN10, RN13 | Filtro informado | Bolsa nao encontrada | N/A | Usuario interno autorizado | API interna a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- O contrato nao fixa endpoints, integracao de assinatura nem integracao de publicacao.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "bolsa": "BP-2026-001"
    }
  }
}
```

## Exemplos JSON por Operacao

### IndicarBolsista

**Exemplo de entrada**

```json
{
  "projetoId": "PROJ-2026-014",
  "cotaEditalId": "COT-2026-001",
  "coordenadorId": "COD-2026-011",
  "orientadorId": "ORI-2026-004",
  "bolsistaId": "BOL-2026-009",
  "temaPesquisa": "Analise de dados publicos"
}
```

**Exemplo de saida**

```json
{
  "bolsaPesquisa": {
    "codigo": "BP-2026-001",
    "estado": "AGUARDANDO_ACEITE_ORIENTADOR"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| COTA_EDITAL_INDISPONIVEL | A cota do edital nao possui disponibilidade para a indicacao informada. |
| BOLSA_SIMULTANEA_NAO_PERMITIDA | O bolsista nao pode receber mais de uma bolsa do mesmo tipo simultaneamente. |

### RegistrarAceiteDoOrientador

**Exemplo de entrada**

```json
{
  "bolsaCodigo": "BP-2026-001",
  "aceito": true,
  "justificativa": null
}
```

**Exemplo de saida**

```json
{
  "termoAceite": {
    "aceito": true
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| BOLSA_NAO_ENCONTRADA | A bolsa informada nao foi encontrada para aceite do orientador. |
| RECUSA_SEM_JUSTIFICATIVA | E obrigatorio informar justificativa quando o orientador recusa a indicacao. |

### SubmeterDocumentacaoDaBolsa

**Exemplo de entrada**

```json
{
  "bolsaCodigo": "BP-2026-001",
  "documentos": [
    {
      "nome": "Comprovante de matricula",
      "tipo": "MATRICULA",
      "url": "https://docs.exemplo.br/matricula.pdf"
    }
  ]
}
```

**Exemplo de saida**

```json
{
  "bolsaPesquisa": {
    "codigo": "BP-2026-001",
    "estado": "AGUARDANDO_DOCUMENTOS"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| ACEITE_ORIENTADOR_PENDENTE | O orientador ainda nao concluiu o aceite da indicacao. |
| DOCUMENTO_BOLSA_INVALIDO | Um ou mais documentos enviados sao invalidos ou obrigatorios nao foram anexados. |

### AvaliarDocumentacaoDaBolsa

**Exemplo de entrada**

```json
{
  "bolsaCodigo": "BP-2026-001",
  "aprovado": true,
  "justificativa": "Documentacao completa e valida."
}
```

**Exemplo de saida**

```json
{
  "parecerAvaliacao": {
    "aprovado": true
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| DOCUMENTACAO_NAO_SUBMETIDA | Nao existe documentacao submetida para a bolsa informada. |
| PARECER_DOCUMENTAL_INVALIDO | O parecer informado e inconsistente com os documentos da bolsa. |

### FormalizarEImplementarBolsa

**Exemplo de entrada**

```json
{
  "bolsaCodigo": "BP-2026-001",
  "dataInicioBolsa": "2026-06-01",
  "dataFimBolsa": "2027-05-31",
  "numeroDiario": "1234"
}
```

**Exemplo de saida**

```json
{
  "bolsaPesquisa": {
    "codigo": "BP-2026-001",
    "estado": "IMPLEMENTADA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| ASSINATURA_PENDENTE | A bolsa ainda possui assinaturas pendentes para formalizacao. |
| PUBLICACAO_DIARIO_OBRIGATORIA | E obrigatoria a publicacao no Diario Oficial antes da implementacao da bolsa. |

### ConsultarBolsaPesquisa

**Exemplo de entrada**

```json
{
  "bolsaCodigo": "BP-2026-001"
}
```

**Exemplo de saida**

```json
{
  "bolsaPesquisa": {
    "codigo": "BP-2026-001",
    "estado": "IMPLEMENTADA",
    "temaPesquisa": "Analise de dados publicos"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| BOLSA_NAO_ENCONTRADA | Nenhuma bolsa foi encontrada para o identificador informado. |
| CONSULTA_BOLSA_INVALIDA | Os filtros informados para consulta da bolsa sao invalidos. |

## Mapeamento de Transporte

- Todas as operacoes deste contrato ficam mapeadas como `API interna/backoffice a definir`.
- Integracoes de assinatura e publicacao permanecem `a definir`.

## Eventos e Efeitos Colaterais

- `IndicarBolsista` reserva operacionalmente a cota associada.
- `AvaliarDocumentacaoDaBolsa` pode devolver a bolsa para reenvio documental.
- `FormalizarEImplementarBolsa` prepara a bolsa para consumo por M004 e demais modulos.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
