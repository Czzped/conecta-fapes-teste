# Jornada — Criacao da Parceria

[← Voltar ao Processo](processo.md) | [Estrutural](modelo-estrutural.md) | [Comportamental](modelo-comportamental.md)

---

## Jornada do Usuario

```mermaid
journey
    title Criacao e Formalizacao da Parceria

    section 1. Solicitacao
      1.1 Solicitar parceria: 4: Instituicao
      1.2 Enviar documento de solicitacao: 4: Instituicao
      1.3 Receber solicitacao: 4: Area de Parcerias
      1.4 Analisar documento de solicitacao: 3: Area de Parcerias
      1.5 Complementar informacoes se necessario: 2: Instituicao

    section 2. Cadastro
      2.1 Cadastrar Parceria em elaboracao: 4: Area de Parcerias
      2.2 Vincular exatamente uma Instituicao: 4: Area de Parcerias
      2.3 Registrar vigencia original: 4: Area de Parcerias
      2.4 Anexar documento formalizador: 4: Area de Parcerias

    section 3. Aporte Original
      3.1 Validar conta bancaria de destino: 3: Financeiro
      3.2 Registrar aporte original da Instituicao vinculada: 4: Area de Parcerias
      3.3 Atualizar saldo da Parceria: 4: Financeiro

    section 4. Formalizacao
      4.1 Validar criterios da RN19: 3: Area de Parcerias
      4.2 Formalizar Parceria: 5: Area de Parcerias
      4.3 Disponibilizar Parceria vigente: 5: Area de Parcerias
```

## Etapas

| # | Etapa | Ator principal | Resultado |
|---|-------|----------------|-----------|
| 1 | Solicitacao | Instituicao | Pedido de parceria e documento de solicitacao enviados. |
| 2 | Analise inicial | Area de Parcerias | Solicitacao aceita para cadastro ou devolvida para complementacao. |
| 3 | Cadastro | Area de Parcerias | Parceria criada em `EmElaboracao` com Instituicao unica, vigencia original e documentos. |
| 4 | Aporte original | Area de Parcerias / Financeiro | `AporteFinanceiro` original registrado com origem na Instituicao vinculada. |
| 5 | Formalizacao | Area de Parcerias | Parceria transita para `Vigente` quando RN19 e atendida. |

## Referencia de Regras

Regras aplicaveis: `RN04`, `RN10`, `RN15`, `RN19`. As definicoes oficiais ficam em [M010 — Regras de Negocio](../README.md#regras-de-negocio-consolidadas).
