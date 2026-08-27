## ID do Cenário
[CT-M014-FO-021]

## Título
Validar diferenciação visual entre operações de Débito e Crédito

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, listagem de transações.
- M014: RN02 / RN12 (conciliação e movimentações a crédito/estornos/devoluções).

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado contendo transações de `DÉBITO` (despesas comuns) e transações de `CRÉDITO` (estornos de compras ou devoluções de recursos).

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. Inspecionar visualmente uma linha com operação `DÉBITO`.
4. Inspecionar visualmente uma linha com operação `CRÉDITO` (ex.: estorno ou devolução).

## Dados de Entrada
- Perfil: `coordenador`.
- Transação de débito: Pagamento de boleto R$ 3.456,70 (DÉBITO · DESPESA).
- Transação de crédito: Crédito de terceiro R$ 1.250,00 (CRÉDITO · ESTORNO).

## Resultado Esperado
- A transação de débito exibe o texto da operação `DÉBITO · DESPESA` em tom neutro/padrão.
- A transação de crédito exibe o texto `CRÉDITO · ESTORNO` (ou `CRÉDITO · DEVOLUÇÃO`) com destaque na cor verde (`rgb(34, 197, 94)`), permitindo fácil diferenciação pelo usuário.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
