# Backlog — M023 Integracao Assinatura Eletronica

[M023](README.md) | [Modelo Estrutural](modelo-estrutural.md) | [Modelo Comportamental](modelo-comportamental.md) | [Contrato](contrato.md)

## EPICs

| ID | Titulo | Prioridade | Status | Documento |
|----|--------|------------|--------|-----------|
| EPIC-M023-001 | Envio de Documento para Assinatura + Captura Inicial | Must | To Do | [EPIC-M023-001](epics/EPIC-M023-001.md) |
| EPIC-M023-002 | Sincronizacao de Status + Arquivamento do PDF Assinado | Must | To Do | [EPIC-M023-002](epics/EPIC-M023-002.md) |
| EPIC-M023-003 | Tratamento de Recusa, Expiracao e Reconciliacao Manual | Should | To Do | [EPIC-M023-003](epics/EPIC-M023-003.md) |

## Historias

| ID | Historia | EPIC | Prioridade | Status |
|----|----------|------|------------|--------|
| US-M023-001 | Cadastrar adapter de provedor (E-Docs V2) com OAuth Client Credentials | EPIC-001 | Must | To Do |
| US-M023-002 | Enviar Documento M008 para coleta de assinaturas com lista de signatarios | EPIC-001 | Must | To Do |
| US-M023-003 | Persistir SolicitacaoAssinatura + Signatarios + EventoAssinatura inicial | EPIC-001 | Must | To Do |
| US-M023-004 | Polling automatico de status (job ReconciliarAssinaturas a cada 5 min) | EPIC-002 | Must | To Do |
| US-M023-005 | Detectar conclusao + baixar PDF + arquivar em M008.Documento | EPIC-002 | Must | To Do |
| US-M023-006 | Emitir eventos publicos `DocumentoAssinadoCompletamente` e `DocumentoAssinadoParcialmente` | EPIC-002 | Must | To Do |
| US-M023-007 | Detectar recusa + emitir `AssinaturaRecusada` | EPIC-003 | Must | To Do |
| US-M023-008 | Job alertador de expiracao (`AssinaturaExpirando` aos 25 dias) | EPIC-003 | Should | To Do |
| US-M023-009 | Job de transicao de pendentes ha > 30 dias para `ERRO` | EPIC-003 | Should | To Do |
| US-M023-010 | Endpoint Sysadmin: ReconciliarManualmente | EPIC-003 | Should | To Do |
| US-M023-011 | Endpoint Sysadmin: CancelarSolicitacao | EPIC-003 | Should | To Do |

## Consumidores externos (modulos que dependem do M023)

| Modulo | Uso | Issues bloqueadas hoje |
|--------|-----|--------------------------|
| M009 (Bolsa) | Termo de Compromisso (5 signatarios) | EPIC-M009-003 — Formalizacao de Bolsa esta bloqueada por "Integracao assinatura — A definir" |
| M022 (Outorga) | Termo de Outorga | Formalizacao do Termo |
| M003 (Iniciativas) | Termo de Aceite, Plano de Trabalho | Aceite de bolsa + Plano vigente |
| M010 (Parcerias) | Termo de Cooperacao + aditivos | Formalizacao de Parceria |

## Metricas

| Metrica | Como medir | Meta |
|---------|------------|------|
| Tempo medio de coleta de assinaturas | `dataCapturaFinal - dataEnvio` por solicitacao concluida | < 15 dias para Termo de Compromisso |
| Taxa de recusa | `RECUSADA / total` por modulo consumidor | < 5% |
| Taxa de expiracao | `ERRO / total` (subcategoria expirou) | < 2% |
| Latencia de polling | Tempo medio entre assinatura no provedor e atualizacao em Conecta | < 6 min |
| SLA de disponibilidade | Janela de erro 5xx no provedor | < 1% no mes |

## Riscos e dependencias

| Risco | Mitigacao |
|-------|-----------|
| Provedor E-Docs indisponivel | Job retenta com backoff exponencial; alerta sysadmin > 30 min de erro continuo |
| URL de upload temporaria expira em segundos | Adapter executa POST imediato apos receber URL; falha retorna erro claro ao consumidor |
| Mudanca de scope/contrato no provedor | Versao V2 explicitada em README RN03; novos provedores entram como adapters |
| PDF nao texto pesquisavel | Validacao no envio (`DOCUMENTO_INVALIDO_PDF`) |
| Assinante nao tem conta Acesso Cidadao | Pendencia de discovery — precisa confirmar enrollment automatico ou exigir cadastro previo |

## Pendencias de Discovery (espelho de [`integracoes/e-docs.md`](../../../discovery/integracoes/e-docs.md))

1. Lei 14.063/20: nivel exigido para Termo de Compromisso e Outorga (eletronica avancada vs ICP-Brasil).
2. Signatario cidadao sem conta Acesso Cidadao: enrollment automatico?
3. Como descobrir/escolher `idClasseDocumental` adequada para cada tipo de termo.
4. Mapeamento `idPapel` do servidor capturador (Acesso Cidadao vs Organograma).
5. PDF/A obrigatorio ou PDF padrao serve.
6. Rate limit + SLA do ambiente Treinamento e Producao.
