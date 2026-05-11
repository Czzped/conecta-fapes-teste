# Adapter E-Docs ES (V2)

[← Voltar ao M023](../README.md) | [Discovery — E-Docs](../../../../discovery/integracoes/e-docs.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [adapter.md](adapter.md) | Mapeamento de comandos M023 → endpoints V2; scopes; tratamento de erros |
| [fluxos.md](fluxos.md) | Sequence diagrams especificos do E-Docs (envio, polling, recusa) |

---

## O que e

Adapter do M023 para o **E-Docs ES** (`api.e-docs.es.gov.br`) — sistema oficial do Estado para assinatura eletronica qualificada (Lei 14.063/20). Identidade dos signatarios via Acesso Cidadao.

Este adapter implementa os comandos genericos do M023 (`EnviarDocumentoParaAssinatura`, `ConsultarStatusAssinatura`, `BaixarDocumentoAssinado`, `CancelarSolicitacao`) traduzindo-os em chamadas a endpoints `/v2/...` do E-Docs.

## Quando usar este adapter

- Signatarios sao servidores publicos do ES (autenticam via Acesso Cidadao papel/lotacao) ou cidadaos (autenticam via Acesso Cidadao CPF + 2FA).
- Documento e um Termo formal da FAPES com valor administrativo (Termo de Compromisso, Outorga, Aceite, Cooperacao).
- Captura no E-Docs e desejavel para preservar protocolo + hash + manifesto de assinaturas (tres niveis Lei 14.063: eletronica avancada, ICP-Brasil, sem assinatura).

## Quando NAO usar este adapter

- Documento exige assinatura ICP-Brasil aplicada externamente antes do upload — caminho permanece pelo E-Docs mas sem fase de assinatura interna.
- Signatario nao tem conta Acesso Cidadao (verificar enrollment automatico — pendencia de discovery).
- Caso de uso fora dos termos administrativos do Estado ES (ex: contrato com fornecedor internacional). Usar adapter alternativo a definir.

## Ambientes

| Ambiente | URL base | Quando usar |
|----------|----------|-------------|
| Treinamento (homologacao) | `https://api.treinamento.e-docs.es.gov.br` | desenvolvimento, testes integrados, demonstracao |
| Producao | `https://api.e-docs.es.gov.br` | operacao real |

Configuracao do ambiente esta no [adapter.md](adapter.md).

## Pre-requisitos

1. **Solicitar acesso** ao E-Docs para a aplicacao Conecta — procedimento em [docs.e-docs.es.gov.br/api/SolicitarAcesso](https://docs.e-docs.es.gov.br/api/SolicitarAcesso).
2. Cadastrar dois Apps no [Acesso Cidadao](https://acessocidadao.es.gov.br):
   - **App Hybrid** — usado pelos signatarios para autenticar e assinar no portal E-Docs.
   - **App Client Credentials** — usado pelo backend Conecta para chamadas servidor-a-servidor (upload, captura, polling). Adicionar scope `api-organograma` quando necessario consultar Organograma diretamente.
3. Persistir credenciais em vault de configuracao (M005 ou Sysadmin do Conecta).

## Referencias

- [Documentacao oficial E-Docs API V2](https://docs.e-docs.es.gov.br/api/) — fonte canonica
- [Discovery interno — E-Docs](../../../../discovery/integracoes/e-docs.md) — visao geral, capacidades, sequence diagrams
- [Swagger publico V2](https://api.e-docs.es.gov.br/swagger/index.html?urls.primaryName=V2.0)
- [Modelo Estrutural M023](../modelo-estrutural.md) — entidades genericas
- [Modelo Comportamental M023](../modelo-comportamental.md) — estados e eventos
- [Contrato M023](../contrato.md) — comandos publicos
- Lei 14.063/20 — assinatura eletronica em atos administrativos do Estado
