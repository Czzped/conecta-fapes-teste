## ID do Cenário
[CT-M014-FO-122]

## Título
Validar impedimento estrito de envio da prestação de contas quando os totais de notas e transações forem divergentes

## Requisito/História Relacionada
- Requisito/Issue: #2943 / Seção C5 (Recusa de envio por SALDO_NAO_ZERADO)
- Regra Canônica: M014: `RN10` (Validação estrita de submissão `SALDO_NAO_ZERADO`)
- Contrato/API: `M014: SubmeterComprovacaoDebito`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas com todas as seções preenchidas, porém apresentando divergência de valores entre a soma das notas e o total das transações.

## Passo a Passo
1. Acessar a prestação de contas com divergência na conciliação.
2. Clicar no botão `Enviar`.
3. Inspecionar o modal de validações prévias ao envio e tentar prosseguir.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Estado: Soma das notas ≠ Soma das transações

## Resultado Esperado
- A conciliação consta como item pendente/reprovado na lista de validação antes do envio.
- Caso o usuário force a chamada de envio, o serviço do backend recusa a operação com erro orientativo e código `SALDO_NAO_ZERADO`.
- A prestação não transiciona para o status `Em Análise` e permanece em rascunho até o ajuste dos valores.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
