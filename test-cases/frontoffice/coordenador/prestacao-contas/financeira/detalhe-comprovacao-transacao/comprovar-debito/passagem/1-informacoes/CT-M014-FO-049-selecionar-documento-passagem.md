## ID do Cenário
[CT-M014-FO-049]

## Título
Selecionar tipo de documento Passagem na comprovação de débito

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (`/coordenador/prestacao-financeira/detalhes/:paymentId`)
- Regra Canônica: M014: `RN05` (Comprovação de despesas com transporte e passagens)
- Contrato/API: `M014: ConsultarTransacaoFinanceira`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação do tipo Débito pendente de comprovação selecionada no extrato.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira/detalhes/:paymentId`.
2. Na seção `1. Informações Gerais *`, clicar no select `Documento`.
3. Selecionar a opção `Passagem`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_passagem_01`
- Campo Documento: `Passagem`

## Resultado Esperado
- A opção `Passagem` é selecionada com sucesso.
- O campo de descrição atualiza o placeholder para *"Descreva o contexto da compra da passagem"*.
- A tela exibe as seções `2. Anexar Comprovantes da Passagem *` e `3. Informações da Passagem *`.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
