# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

### Ciclo de Vida: RelatorioSECONT

```mermaid
stateDiagram-v2
    [*] --> EmGeracao : Solicitar geracao de relatorio

    EmGeracao --> Gerado : Processamento concluido com sucesso

    Gerado --> Enviado : Registrar envio a SECONT
    Gerado --> Gerado : Regenerar relatorio

    Enviado --> Confirmado : Registrar confirmacao de recebimento

    Confirmado --> [*]

    state EmGeracao : Sistema processando dados financeiros
    state Gerado : Relatorio disponivel para download e envio
    state Enviado : Relatorio enviado, aguardando confirmacao
    state Confirmado : SECONT confirmou recebimento
```
