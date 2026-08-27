## ID do Cenário
[CT-M014-FO-006]

## Título
Validar campo Valor Gasto do orçamento

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, seção Controle de Gastos.
- M013: RN06 / RI-SLD1 (invariante de saldos do orçamento).
- M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado no contexto do portal.
- O projeto possui despesas comprovadas/consumidas totalizando R$ 75.000,00 entre suas rubricas orçamentárias.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. Localizar a seção `Controle de Gastos`.
4. Inspecionar o valor exibido no campo `Valor gasto` no canto superior direito do card de progresso.

## Dados de Entrada
- Perfil: `coordenador`.
- Total de despesas consumidas nas rubricas: R$ 75.000,00.

## Resultado Esperado
- O campo exibe o rótulo `Valor gasto` acompanhado do montante formatado em moeda brasileira (`R$ 75.000` ou `R$ 75.000,00`).
- O valor exibido corresponde fielmente ao somatório dos valores executados/consumidos em todas as rubricas do projeto.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
