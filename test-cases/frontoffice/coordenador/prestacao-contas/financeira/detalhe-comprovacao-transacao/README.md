# Guia de Estrutura — Detalhe e Comprovação de Transação

Este documento serve como mapa de navegação e contexto oficial para desenvolvedores e agentes de IA, evitando consumo excessivo de tokens e garantindo padronização na criação e execução de casos de teste.

---

## 📌 Visão Geral da Tela de Detalhe
* **Rota Frontend:** `/coordenador/prestacao-financeira/:paymentId`
* **Módulo Proprietário:** [M014 — Prestação de Contas](../../../../docs/implementation/modules/M014-prestacao-contas/README.md)
* **Módulos Integrados:** [M013 — Gestão Orçamentária](../../../../docs/implementation/modules/M013-gestao-orcamentaria-projeto/README.md) (Rubricas), [M016 — Financeiro](../../../../docs/implementation/modules/M016-contabilidade-financeiro/README.md) (Contabilidade/Conciliação)
* **Objetivo:** Permitir ao Coordenador comprovar detalhadamente uma movimentação bancária específica do extrato do projeto.

---

## 🌳 Taxonomia de Pastas e Variantes

```
detalhe-comprovacao-transacao/
│
├── debito/                              # 🔴 TRANSAÇÕES DE DÉBITO (Saídas financeiras da conta)
│   │
│   ├── nota-fiscal/                     # 📄 Variante 1: Compra de Materiais ou Serviços Nacionais
│   │   ├── dados-gerais/                # Identificação da transação, favorecido/CNPJ e justificativa
│   │   ├── upload-xml-pdf/              # Upload de NF-e/NFS-e, Danfe, chave 44 dígitos e SERPRO
│   │   ├── itens-e-rubricas/            # Detalhamento de itens da nota vinculados a RubricaProjeto (M013)
│   │   ├── orcamentos-fornecedor/       # 3 cotações prévias obrigatórias por faixa de valor
│   │   └── submissao/                   # Salvar rascunho, submissão final e bloqueio pós-envio
│   │
│   ├── passagem/                        # ✈️ Variante 2: Despesas com Transporte e Viagens
│   │   ├── dados-viagem/                # Motivo da viagem, período, destino e passageiro
│   │   ├── bilhete-e-embarque/          # Upload de bilhete aéreo/rodoviário e cartões de embarque
│   │   ├── rubrica-e-custo/             # Classificação na rubrica de Passagens/Diárias e conferência de taxa
│   │   └── submissao/                   # Validação de relatório de viagem vinculado e envio
│   │
│   └── invoice/                         # 🌐 Variante 3: Compras Internacionais / Importação
│       ├── dados-invoice/               # Número da invoice, fornecedor estrangeiro e descrição em moeda estrangeira
│       ├── conversao-cambial/           # Taxa de câmbio na data do débito, IOF e cálculo do valor em R$
│       ├── comprovante-pagamento/       # Upload do invoice (PDF), contrato de câmbio e comprovante Swift/Cartão
│       └── submissao/                   # Submissão de comprovação internacional
│
└── credito/                             # 🟢 TRANSAÇÕES DE CRÉDITO (Entradas financeiras na conta)
    │
    ├── estorno/                         # 🔄 Classificação 1: Devolução de compra cancelada / estorno de fornecedor
    │   ├── dados-credito/               # Identificação do crédito bancário e valor recebido
    │   ├── pareamento-debito/           # Seleção e vínculo ao débito de origem (anulação mútua: Saldo Líquido R$ 0,00)
    │   └── confirmacao/                 # Validação de valores idênticos e conciliação do par
    │
    └── devolucao/                       # 🏛️ Classificação 2: Devolução voluntária / restituição de saldo / rendimentos
        ├── dados-credito/               # Identificação da entrada financeira
        ├── classificacao-motivo/        # Motivo da devolução (saldo de diária não gasta, rendimento de conta)
        └── comprovante-dare-gru/        # Anexo de comprovante de recolhimento oficial (DARE/GRU/TED)
```

---

## 🎯 Regras Canônicas Rápidas para IAs (Evite Alucinações)

1. **Débito vs. Crédito:**
   * Débito **sempre** gera comprovação via documento fiscal/comprovante (`nota-fiscal`, `passagem` ou `invoice`).
   * Crédito de estorno **não gera** nova nota nem nova despesa; ele é **pareado** com um débito existente.
2. **Classificação Orçamentária:**
   * A classificação de despesa é responsabilidade exclusiva de `RubricaProjeto` (M013), não da `TransacaoFinanceira` bancária.
3. **Uso Único de NF-e:**
   * Uma chave de acesso de NF-e (44 dígitos) é única no ecossistema FAPES e não pode ser reutilizada em outro projeto.
4. **Estados da Prestação:**
   * `RASCUNHO` (editável) $\rightarrow$ `EM_ANALISE` (bloqueado para edição) $\rightarrow$ `REVISAO` (ajustes pontuais) $\rightarrow$ `FINALIZADO` / `NEGADO`.
5. **Padrão de Nomenclatura dos Arquivos de Teste:**
   * `CT-M014-FO-XXX-descricao-curta.md` seguindo o template oficial de [`test-cases/referencias/criacao-dos-cenarios-de-teste.md`](../../referencias/criacao-dos-cenarios-de-teste.md).
