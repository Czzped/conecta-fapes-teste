## ID do Cenário
[CT-M014-FO-123]

## Título
Validar atualização reativa sem reload da barra de conciliação ao manipular notas fiscais ou transações

## Requisito/História Relacionada
- Requisito/Issue: #2943 / Seção C4 (Atualização reativa da conciliação)
- Regra Canônica: M014: `RN02` / `RN05` (Reatividade da conciliação no estado local do formulário)
- Contrato/API: `M014: ValidarDadosJustificativaDespesa`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas aberta na tela de detalhes.

## Passo a Passo
1. Acessar a prestação de contas com conciliação divergente.
2. Acrescentar uma nova Nota Fiscal ou vincular uma nova transação.
3. Observar o comportamento da barra de conciliação imediatamente após a ação, **sem pressionar F5 ou recarregar a página**.
4. Remover uma Nota Fiscal ou desvincular uma transação.
5. Observar novamente a barra de conciliação.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Ações: Acrescentar nota / Vincular transação / Remover nota / Desvincular transação

## Resultado Esperado
- A barra de conciliação (valores somados, diferença calculada e mensagem de status) atualiza em tempo real instantaneamente na tela após cada alteração.
- Não é necessário recarregar a página (`F5`) para refletir o novo estado de conciliação.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
