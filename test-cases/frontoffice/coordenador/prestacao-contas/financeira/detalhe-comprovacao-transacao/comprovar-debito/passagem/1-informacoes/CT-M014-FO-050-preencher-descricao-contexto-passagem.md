## ID do Cenário
[CT-M014-FO-050]

## Título
Preencher descrição do contexto da compra da passagem

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014: `RN05` (Descrição justificativa da compra de passagem)
- Contrato/API: `M014: RegistrarJustificativaDespesa`

## Pré-condições
- Tipo de documento selecionado como `Passagem`.

## Passo a Passo
1. Localizar o campo de texto `Descrição` na seção `1. Informações Gerais *`.
2. Inserir o texto explicativo sobre o motivo da viagem e aquisição das passagens.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_passagem_01`
- Texto de Descrição: `Aquisição de passagem aérea para participação em congresso internacional de pesquisa.`
- Limite: `250 caracteres`

## Resultado Esperado
- O texto inserido é aceito com sucesso.
- O contador exibe o número atualizado de caracteres (ex: `89/250 caracteres`).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
