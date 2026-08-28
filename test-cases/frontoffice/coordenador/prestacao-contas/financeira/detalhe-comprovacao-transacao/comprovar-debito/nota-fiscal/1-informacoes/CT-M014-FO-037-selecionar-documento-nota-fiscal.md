## ID do Cenário
[CT-M014-FO-037]

## Título
Selecionar tipo de documento Nota Fiscal (Produto ou Serviço)

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (`/coordenador/prestacao-financeira/detalhes/:paymentId`)
- Regra Canônica: M014: `RN05` (Seleção de tipo de documento fiscal para comprovação)
- Contrato/API: `M014: ConsultarTransacaoFinanceira`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação do tipo Débito pendente de comprovação selecionada no extrato do projeto.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira/detalhes/:paymentId`.
2. Na seção `1. Informações Gerais *`, clicar no select `Documento`.
3. Selecionar a opção `Nota Fiscal (Produto ou Serviço)`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Campo Documento: `Nota Fiscal (Produto ou Serviço)`

## Resultado Esperado
- A opção `Nota Fiscal (Produto ou Serviço)` é selecionada com sucesso.
- A página habilita as seções subsequentes de descrição, upload de NF-e, associação de compras e cotação de fornecedores.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
