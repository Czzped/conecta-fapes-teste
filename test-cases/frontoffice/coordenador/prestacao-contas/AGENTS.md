# Contexto para IA — Casos de teste de Prestação de Contas do Coordenador

## Objetivo

Criar casos de teste funcionais para as páginas do perfil Coordenador, sem
inventar regras de negócio. Esta pasta é uma camada de **verificação**; o
domínio e as regras canônicas continuam nos módulos de implementação.

## Rotas e ownership

| Diretório | Rota | Módulo proprietário | Escopo nesta pasta |
|---|---|---|---|
| `financeira/` | `/coordenador/financeira` | M014 — Prestação de Contas | Sim |
| `financeira/[paymentId]/` | `/coordenador/financeira/:paymentId` | M014 — Prestação de Contas | Sim |
| `tecnica/` | `/coordenador/prestacao-contas-tecnica` | M012 — Acompanhamento e Resultados | Não criar casos M014; encaminhar para M012 |
| `remanejamento/` | `/coordenador/remanejamento` | M013 — Gestão Orçamentária do Projeto | Não criar casos M014; encaminhar para M013 |

## Fontes de verdade

Ler antes de criar ou alterar um caso:

1. [Padrão de cenários](../../../referencias/criacao-dos-cenarios-de-teste.md).
2. [Domínio e regras M014](../../../../docs/implementation/modules/M014-prestacao-contas/README.md).
3. [Contrato público M014](../../../../docs/implementation/modules/M014-prestacao-contas/contrato.md).
4. [Backlog e rastreabilidade M014](../../../../docs/implementation/modules/M014-prestacao-contas/backlog.md).
5. O EPIC e a User Story mencionados pelo caso.

Em caso de divergência, a precedência é: `ontology.yaml` (quando existir) →
`README.md` do M014 → `contrato.md` → EPIC/User Story → interface publicada.
Uma tela observada em produção não cria, por si só, uma nova regra de negócio.

## Linguagem canônica

Use estes termos sem sinônimos alternativos:

- `Prestacao`: agregado de prestação de contas.
- `JustificativaDespesa`: despesa declarada pelo coordenador.
- `TransacaoFinanceira`: movimento bancário importado; não é a classificação
  orçamentária da despesa.
- `RubricaProjeto`: classifica a despesa no orçamento aprovado; pertence ao
  contexto de M013.
- `DocumentoFiscal`, `ItemDocumentoFiscal` e `OrcamentoFornecedor`: elementos
  da prestação de contas M014.

Não tratar `RubricaProjeto`, `TransacaoFinanceira` e `ContaContabil` como o
mesmo conceito.

## Regras vinculantes para cobertura

Os casos de M014 devem referenciar, conforme aplicável, os identificadores
canônicos `RN01` a `RN13` e `RI1` a `RI4` do README do módulo. Cobrir o fluxo
principal, rejeições e limites, em especial:

- submissão e transições de estado da `Prestacao`;
- bloqueio de edição/exclusão durante `EM_ANALISE`;
- conciliação e vínculo único de transações;
- validação de NF-e/NFS-e e classificação de itens em `RubricaProjeto`;
- limite e seleção de orçamentos de fornecedor;
- saldo, limites monetários e estornos.

Marcar explicitamente como `Pos-MVP` qualquer caso referente a funcionalidades
que o backlog classifica dessa forma. Não apresentá-las como comportamento
obrigatório já implementado.

## Formato e nomenclatura

- Um arquivo por objetivo de teste: `CT-M014-FO-001-descricao-curta.md`.
- Usar integralmente o template da pasta `referencias`.
- Em **Requisito/História Relacionada**, informar o EPIC, a User Story e as
  regras RN/RI aplicáveis.
- Em **Tipo de Teste**, selecionar somente uma classificação principal:
  Positivo, Negativo, Limite ou Regressão.
- Escrever pré-condições e massa de dados suficientes para execução
  independente; não depender da execução de outro caso.
- Distinguir fatos observados na UI (`Observado em produção`) de expectativas
  documentadas (`Especificado em M014`).

## Limites

- Não repetir ou redefinir regras do M014 neste arquivo ou nos casos; apontar
  para seus IDs canônicos.
- Não escrever casos de aprovação, negação ou análise como se fossem ações do
  Coordenador: essas ações pertencem à Área Técnica/SECONT.
- Não incluir regras de prestação técnica (M012) nem de remanejamento (M013)
  em casos de M014.
