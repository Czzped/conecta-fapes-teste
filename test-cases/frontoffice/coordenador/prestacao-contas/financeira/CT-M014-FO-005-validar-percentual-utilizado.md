## ID do Cenário
[CT-M014-FO-005]

## Título
Validar campo de Percentual Utilizado do orçamento

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, seção Controle de Gastos.
- M013: RN06 / RI-SLD1 (invariante de saldos do orçamento).
- M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado no contexto do portal.
- O projeto possui orçamento total aprovado de R$ 100.000,00 e despesas consumidas/executadas no valor de R$ 75.000,00.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. Localizar a seção `Controle de Gastos`.
4. Inspecionar o texto de percentual exibido abaixo do título `Progresso do Orçamento`.

## Dados de Entrada
- Perfil: `coordenador`.
- Orçamento Total: R$ 100.000,00.
- Valor Gasto (Consumido): R$ 75.000,00.

## Resultado Esperado
- A seção exibe o texto `75% utilizado`.
- O valor percentual reflete a proporção exata entre o montante consumido e o total aprovado do projeto.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
