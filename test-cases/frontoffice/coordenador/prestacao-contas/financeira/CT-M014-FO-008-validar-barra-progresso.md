## ID do Cenário
[CT-M014-FO-008]

## Título
Validar preenchimento e renderização da Barra de Progresso do orçamento

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, seção Controle de Gastos.
- M013: RN06 / RI-SLD1 (invariante de saldos do orçamento).
- M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado no contexto do portal com orçamento total aprovado de R$ 100.000,00 e despesas executadas de R$ 75.000,00 (75% consumido).

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. Localizar a seção `Controle de Gastos`.
4. Inspecionar o componente visual de barra de progresso orçamentária (`UProgress`).

## Dados de Entrada
- Perfil: `coordenador`.
- Orçamento Total: R$ 100.000,00.
- Valor Gasto: R$ 75.000,00.

## Resultado Esperado
- A barra de progresso é renderizada visualmente dentro do card de orçamento.
- O preenchimento da barra reflete proporcionalmente a porcentagem calculada (75% preenchida).
- O componente não apresenta distorções visuais ou quebras de layout.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
