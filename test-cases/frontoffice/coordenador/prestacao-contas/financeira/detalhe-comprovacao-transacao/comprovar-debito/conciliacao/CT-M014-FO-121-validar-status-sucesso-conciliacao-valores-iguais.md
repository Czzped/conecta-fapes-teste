## ID do Cenário
[CT-M014-FO-121]

## Título
Validar estado de conciliação bem-sucedido quando o valor total das Notas Fiscais for exatamente igual ao das transações

## Requisito/História Relacionada
- Requisito/Issue: #2943 / Seção C3 (Conciliação entre notas e transações)
- Regra Canônica: M014: `RN02` / `RN10` (Validação de saldo zerado na conciliação)
- Contrato/API: `M014: ValidarDadosJustificativaDespesa`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas de débito em estado `Em Rascunho`.
- Transação(ões) vinculada(s) somando R$ 3.000,00.
- Nota(s) Fiscal(is) anexada(s) somando exatamente R$ 3.000,00.

## Passo a Passo
1. Acessar a tela de comprovação de débito com valores iguais entre notas e transações (R$ 3.000,00).
2. Inspecionar a barra de conciliação.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Soma das Transações: R$ 3.000,00
- Soma das Notas: R$ 3.000,00 (Divergência: R$ 0,00)

## Resultado Esperado
- A barra de conciliação exibe a mensagem de sucesso: *"Despesa integralmente comprovada"*.
- O destaque em cor vermelha nos totais é removido.
- A trava de pendência de conciliação para envio é liberada.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
