## ID do Cenário
[CT-M014-FO-126]

## Título
Validar permissão de vincular/desvincular transações no status "Em Revisão" com ações de Nota Fiscal bloqueadas

## Requisito/História Relacionada
- Requisito/Issue: #2943 / Seção E2 (Estados e permissões em revisão)
- Regra Canônica: M014: `RN01` / `RN02` (Diferenciação de permissões entre DocumentoFiscal e TransacaoFinanceira no status Em Revisão)
- Contrato/API: `M014: VincularTransacaoJustificativaDespesa`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas devolvida pela FAPES para correção, em status `Em Revisão`.

## Passo a Passo
1. Acessar a tela de detalhes da prestação de contas no status `Em Revisão`.
2. Verificar as ações disponíveis na seção `2. Adicionar Descrição e Anexar Nota Fiscal *` (Acrescentar, Remover, Trocar).
3. Verificar a seção de transações vinculadas e testar as ações de `Vincular transação` e `Desvincular`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Status da prestação: `Em Revisão`

## Resultado Esperado
- As três ações relativas a Notas Fiscais (Acrescentar, Remover e Trocar) são apresentadas como **indisponíveis** (desabilitadas), exibindo tooltip com a justificativa de bloqueio no status em revisão.
- As ações de **Vincular transação** e **Desvincular transação** permanecem **liberadas e funcionais** (permitindo ajustar os lançamentos vinculados durante a revisão).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
