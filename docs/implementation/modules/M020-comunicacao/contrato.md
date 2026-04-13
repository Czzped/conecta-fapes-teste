# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M020 como servico transversal de comunicacao da plataforma. O modulo expoe comandos, consultas, jobs e consumo de eventos internos para registrar notificacoes, processar envios, gerenciar templates, operar comunicados em massa e disparar lembretes automaticos.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Modulos internos da plataforma | Disparam notificacoes a partir de eventos ou comandos internos |
| Servidor da Area Tecnica | Configura templates, consulta historico, solicita comunicados e configura lembretes |
| Diretor | Aprova ou rejeita comunicados em massa |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M005 | Modulo interno | Base de usuarios, perfis e identidades autenticadas |
| Provedor de email institucional | Sistema externo | Envio efetivo de mensagens a partir do remetente institucional |
| Modulos de origem dos eventos | Modulo interno | Fornecem moduloOrigem, eventoOrigem e dados de contexto para notificacao |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| ReceberEventoDeNegocioParaNotificacao | Event Consumed | Registrar uma notificacao pendente a partir de evento de outro modulo | eventoOrigem, moduloOrigem, destinatarios, dados para variaveis | `Notificacao` pendente vinculada a `TemplateNotificacao` | RN02, RN06, RN08 | Existe template ativo compativel com o evento | Template inexistente ou inativo, dados insuficientes para resolver variaveis | Sim para a mesma chave de evento quando houver mecanismo de deduplicacao | Modulo interno autorizado | Evento/mensagem interna a definir |
| ProcessarEnvioDeNotificacao | Async Job | Resolver template, enviar email, registrar historico e tratar retry | notificacoes pendentes ou em reenvio | `Notificacao` atualizada e `HistoricoEnvio` registrado | RN01, RN03, RN06 | Notificacao pendente com template valido | Falha no provedor de email, limite de tentativas esgotado | Sim por notificacao enquanto respeitar o limite de tentativas | Sistema | Job/fila assincrona a definir + provedor de email a definir |
| ConfigurarTemplateNotificacao | Command | Criar, alterar, ativar ou desativar templates de notificacao | nome, assuntoTemplate, corpoTemplate, tipo, mandatorio, ativo | `TemplateNotificacao` criado ou atualizado | RN02, RN04 | Usuario autenticado com permissao de administracao do modulo | Template mandatorio nao pode ser desativado, dados invalidos | Nao | Servidor da Area Tecnica | API interna/backoffice a definir |
| ConsultarHistoricoDeNotificacoes | Query | Consultar notificacoes enviadas, seus estados e tentativas | filtros por periodo, estado, moduloOrigem, destinatario | Lista ou detalhe de `Notificacao` com `HistoricoEnvio` | RN06 | Historico existente | Nenhum resultado para o filtro informado | N/A | Servidor da Area Tecnica | API interna/backoffice a definir |
| SolicitarComunicadoMassa | Command | Registrar um comunicado em massa para avaliacao do Diretor | titulo, corpo, publicoAlvo, template | `ComunicadoMassa` em `AGUARDANDO_APROVACAO` | RN05, RN06 | Solicitante autenticado e publico alvo definido | Dados obrigatorios ausentes, template invalido | Nao | Servidor da Area Tecnica | API interna/backoffice a definir |
| AprovarComunicadoMassa | Command | Aprovar comunicado e liberar o processamento em massa | identificador do comunicado | `ComunicadoMassa` em `APROVADO` ou `EM_ENVIO` | RN05, RN06, RN09 | Comunicado em `AGUARDANDO_APROVACAO` | Comunicado inexistente, estado invalido | Nao | Diretor | API interna/backoffice a definir |
| RejeitarComunicadoMassa | Command | Rejeitar comunicado e registrar justificativa | identificador do comunicado, justificativa | `ComunicadoMassa` em `REJEITADO` | RN05, RN06 | Comunicado em `AGUARDANDO_APROVACAO` | Comunicado inexistente, justificativa ausente, estado invalido | Nao | Diretor | API interna/backoffice a definir |
| ConfigurarLembreteDePrazo | Command | Registrar, alterar ou desativar lembretes de prazo | moduloOrigem, entidadeReferencia, entidadeId, dataPrazo, diasAntecedencia, ativo | `LembretePrazo` criado ou atualizado | RN06, RN07 | Usuario autenticado e prazo informado | Entidade invalida, dados obrigatorios ausentes | Nao | Servidor da Area Tecnica | API interna/backoffice a definir |
| ProcessarLembretesAtivos | Async Job | Avaliar lembretes ativos e gerar notificacoes automaticas na antecedencia configurada | lembretes ativos e data atual | `Notificacao` gerada e `ultimoEnvio` atualizado | RN03, RN06, RN07 | Existem lembretes ativos | Falha no envio, lembrete associado a entidade encerrada | Sim por lembrete e marco temporal | Sistema | Job agendado a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- Os exemplos mostram a intencao de negocio da operacao; endpoint, fila, scheduler e integracao concreta continuam `a definir`.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "codigo": "NTF-2026-001"
    }
  }
}
```

## Exemplos JSON por Operacao

### ReceberEventoDeNegocioParaNotificacao

**Exemplo de entrada**

```json
{
  "eventoOrigem": "BOLSA_IMPLEMENTADA",
  "moduloOrigem": "M009",
  "destinatarios": [
    {
      "email": "bolsista@exemplo.br",
      "nome": "Maria Oliveira"
    }
  ],
  "dados": {
    "codigoBolsa": "BP-2026-004",
    "status": "IMPLEMENTADA"
  }
}
```

**Exemplo de saida**

```json
{
  "notificacao": {
    "codigo": "NTF-2026-001",
    "estado": "PENDENTE",
    "moduloOrigem": "M009",
    "eventoOrigem": "BOLSA_IMPLEMENTADA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| TEMPLATE_NOTIFICACAO_INEXISTENTE | Nao existe template ativo compativel com o evento informado. |
| DADOS_TEMPLATE_INSUFICIENTES | Os dados informados nao sao suficientes para resolver as variaveis do template. |

### ProcessarEnvioDeNotificacao

**Exemplo de entrada**

```json
{
  "notificacoes": [
    "NTF-2026-001",
    "NTF-2026-002"
  ]
}
```

**Exemplo de saida**

```json
{
  "processamento": {
    "processadas": 2,
    "enviadas": 1,
    "falhas": 1
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PROVEDOR_EMAIL_INDISPONIVEL | O provedor de email institucional esta indisponivel no momento. |
| LIMITE_TENTATIVAS_EXCEDIDO | A notificacao atingiu o limite maximo de tentativas de envio. |

### ConfigurarTemplateNotificacao

**Exemplo de entrada**

```json
{
  "nome": "Bolsa implementada",
  "assuntoTemplate": "Bolsa {{codigoBolsa}} - {{status}}",
  "corpoTemplate": "<p>Ola {{nome}}, sua bolsa foi {{status}}.</p>",
  "tipo": "MUDANCA_STATUS",
  "mandatorio": true,
  "ativo": true
}
```

**Exemplo de saida**

```json
{
  "templateNotificacao": {
    "codigo": "TPL-001",
    "nome": "Bolsa implementada",
    "tipo": "MUDANCA_STATUS",
    "mandatorio": true,
    "ativo": true
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| TEMPLATE_DADOS_INVALIDOS | Os dados informados para o template de notificacao sao invalidos. |
| TEMPLATE_MANDATORIO_NAO_PODE_SER_DESATIVADO | Templates mandatorios nao podem ser desativados. |

### ConsultarHistoricoDeNotificacoes

**Exemplo de entrada**

```json
{
  "filtros": {
    "moduloOrigem": "M009",
    "estado": "ENVIADA",
    "periodoInicio": "2026-04-01",
    "periodoFim": "2026-04-13"
  }
}
```

**Exemplo de saida**

```json
{
  "items": [
    {
      "codigo": "NTF-2026-001",
      "destinatarioEmail": "bolsista@exemplo.br",
      "estado": "ENVIADA",
      "tentativasEnvio": 1,
      "historico": [
        {
          "tentativa": 1,
          "sucesso": true,
          "mensagemErro": null
        }
      ]
    }
  ],
  "total": 1
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| HISTORICO_NOTIFICACAO_NAO_ENCONTRADO | Nenhuma notificacao foi encontrada para o filtro informado. |
| FILTRO_HISTORICO_INVALIDO | Os filtros informados para consulta de historico sao invalidos. |

### SolicitarComunicadoMassa

**Exemplo de entrada**

```json
{
  "titulo": "Atualizacao de cronograma",
  "corpo": "O cronograma do edital foi atualizado.",
  "publicoAlvo": "Bolsistas do Edital 01/2026",
  "templateCodigo": "TPL-020"
}
```

**Exemplo de saida**

```json
{
  "comunicadoMassa": {
    "codigo": "COM-2026-001",
    "estado": "AGUARDANDO_APROVACAO",
    "totalDestinatarios": 240
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PUBLICO_ALVO_INVALIDO | O publico alvo informado para o comunicado em massa e invalido. |
| TEMPLATE_COMUNICADO_INVALIDO | O template informado nao pode ser usado para comunicado em massa. |

### AprovarComunicadoMassa

**Exemplo de entrada**

```json
{
  "comunicadoCodigo": "COM-2026-001"
}
```

**Exemplo de saida**

```json
{
  "comunicadoMassa": {
    "codigo": "COM-2026-001",
    "estado": "APROVADO",
    "aprovadoPor": "diretor@agencia.br",
    "dataAprovacao": "2026-04-13T15:00:00Z"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| COMUNICADO_NAO_ENCONTRADO | O comunicado em massa informado nao foi encontrado. |
| COMUNICADO_ESTADO_INVALIDO | Somente comunicados aguardando aprovacao podem ser aprovados. |

### RejeitarComunicadoMassa

**Exemplo de entrada**

```json
{
  "comunicadoCodigo": "COM-2026-001",
  "justificativa": "O publico alvo precisa ser refinado antes do envio."
}
```

**Exemplo de saida**

```json
{
  "comunicadoMassa": {
    "codigo": "COM-2026-001",
    "estado": "REJEITADO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| COMUNICADO_NAO_ENCONTRADO | O comunicado em massa informado nao foi encontrado. |
| JUSTIFICATIVA_OBRIGATORIA | E obrigatorio informar justificativa para rejeitar o comunicado. |
| COMUNICADO_ESTADO_INVALIDO | Somente comunicados aguardando aprovacao podem ser rejeitados. |

### ConfigurarLembreteDePrazo

**Exemplo de entrada**

```json
{
  "moduloOrigem": "M014",
  "entidadeReferencia": "PrestacaoContas",
  "entidadeId": "PC-2026-013",
  "dataPrazo": "2026-05-20",
  "diasAntecedencia": 15,
  "ativo": true
}
```

**Exemplo de saida**

```json
{
  "lembretePrazo": {
    "codigo": "LEM-2026-001",
    "moduloOrigem": "M014",
    "entidadeReferencia": "PrestacaoContas",
    "entidadeId": "PC-2026-013",
    "dataPrazo": "2026-05-20",
    "diasAntecedencia": 15,
    "ativo": true
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| ENTIDADE_REFERENCIA_INVALIDA | A entidade de referencia informada nao pode receber lembrete de prazo. |
| DATA_PRAZO_OBRIGATORIA | E obrigatorio informar a data de prazo do lembrete. |

### ProcessarLembretesAtivos

**Exemplo de entrada**

```json
{
  "dataReferencia": "2026-05-05"
}
```

**Exemplo de saida**

```json
{
  "processamento": {
    "lembretesAvaliados": 35,
    "notificacoesGeradas": 12,
    "lembretesDesativados": 2
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PROVEDOR_EMAIL_INDISPONIVEL | O provedor de email institucional esta indisponivel durante o processamento dos lembretes. |
| LEMBRETE_ENTIDADE_ENCERRADA | O lembrete referencia uma entidade encerrada e nao pode mais gerar notificacao. |

## Mapeamento de Transporte

- `Configurar*`, `Consultar*`, `Solicitar*`, `Aprovar*` e `Rejeitar*`: `API interna/backoffice a definir`.
- `ReceberEventoDeNegocioParaNotificacao`: `evento/mensagem interna a definir`.
- `ProcessarEnvioDeNotificacao` e `ProcessarLembretesAtivos`: `job/fila assincrona a definir`.
- Integracao externa de email: `provedor institucional a definir`.

## Eventos e Efeitos Colaterais

- `ReceberEventoDeNegocioParaNotificacao` deve criar `Notificacao` pendente com `moduloOrigem` e `eventoOrigem` rastreaveis.
- `ProcessarEnvioDeNotificacao` deve resolver variaveis do template, enviar o email com remetente institucional, registrar cada tentativa e agendar retry quando houver falha.
- `SolicitarComunicadoMassa` deve notificar o Diretor sobre a pendencia de aprovacao.
- `AprovarComunicadoMassa` deve iniciar o envio em massa gerando uma notificacao individual por destinatario.
- `ProcessarLembretesAtivos` deve gerar notificacoes automaticas e desativar lembretes associados a entidades ja encerradas quando essa informacao estiver disponivel.
- Nenhum evento emitido foi estabilizado como interface publica nesta rodada; por enquanto, os efeitos colaterais observaveis ficam documentados neste contrato.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- EPICs: [EPIC-M020-001](epics/EPIC-M020-001.md), [EPIC-M020-002](epics/EPIC-M020-002.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
