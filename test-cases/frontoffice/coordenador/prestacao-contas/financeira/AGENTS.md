# Contexto para Agentes de IA — Prestação de Contas Financeira (Frontoffice Coordenador)

Este documento orienta agentes de IA sobre a arquitetura, rotas, taxonomia de pastas e regras de negócio da **Prestação de Contas Financeira**, otimizando a leitura e economizando tokens.

---

## 🗺️ Mapa de Pastas do Módulo Financeiro

```
test-cases/frontoffice/coordenador/prestacao-contas/financeira/
├── AGENTS.md                                # Este guia de orientação
├── permissionamento/                        # 🛡️ Controle de acesso (RBAC/ABAC com OpenFGA)
│
├── cabecalho/                               # 🏷️ TELA INICIAL: Cabeçalho, navegação de volta e títulos
├── controle-gastos/                         # 📊 TELA INICIAL: Resumo orçamentário, barras e rubricas (M013)
├── extrato-filtros/                         # 🔍 TELA INICIAL: Busca, filtros de data, status e categoria
├── listagem-transacoes/                     # 📋 TELA INICIAL: Cards de transação, badges e paginação
│
└── detalhe-comprovacao-transacao/           # 📁 TELA DE DETALHE (/coordenador/prestacao-financeira/:paymentId)
    ├── README.md                            # Mapeamento detalhado das variantes
    │
    ├── debito/                              # 🔴 COMPROVAÇÃO DE DÉBITO (Saídas)
    │   ├── nota-fiscal/                     # 📄 Variante NF-e / NFS-e (nacional)
    │   ├── passagem/                        # ✈️ Variante Transporte / Bilhetes / Embarque
    │   └── invoice/                         # 🌐 Variante Compra Internacional / Câmbio
    │
    └── credito/                             # 🟢 CONCILIAÇÃO DE CRÉDITO (Entradas)
        ├── estorno/                         # 🔄 Estorno de compra (pareamento com débito original)
        └── devolucao/                       # 🏛️ Devolução de saldo / DARE / GRU
```

---

## 📌 Roteamento e Fontes de Verdade

| Seção / Tela | Rota no Portal | Módulo Bounded Context |
|---|---|---|
| **Tela Inicial da Prestação** | `/coordenador/prestacao-financeira` | [M014 — Prestação de Contas](../../../../docs/implementation/modules/M014-prestacao-contas/README.md) |
| **Resumo de Gastos e Rubricas** | Integrado na tela inicial | [M013 — Gestão Orçamentária](../../../../docs/implementation/modules/M013-gestao-orcamentaria-projeto/README.md) |
| **Detalhe de Comprovação** | `/coordenador/prestacao-financeira/:paymentId` | [M014 — Prestação de Contas](../../../../docs/implementation/modules/M014-prestacao-contas/README.md) |

---

## ⚡ Regras Críticas para Criação de Casos de Teste

1. **Estrutura Obrigatória:** Usar estritamente o template em [`test-cases/referencias/criacao-dos-cenarios-de-teste.md`](../../referencias/criacao-dos-cenarios-de-teste.md).
2. **Identificador Sequencial:** Formato `[CT-M014-FO-XXX]` onde `FO` indica Frontoffice do Coordenador.
3. **Independência:** Cada caso deve ter pré-condições suficientes para ser executado de forma autônoma.
4. **Semântica:**
   * `TransacaoFinanceira`: Movimento bancário importado do extrato (M014/M016).
   * `RubricaProjeto`: Categoria orçamentária do projeto que recebe a despesa (M013).
   * `DocumentoFiscal`: Comprovante tributário legal (M014).
