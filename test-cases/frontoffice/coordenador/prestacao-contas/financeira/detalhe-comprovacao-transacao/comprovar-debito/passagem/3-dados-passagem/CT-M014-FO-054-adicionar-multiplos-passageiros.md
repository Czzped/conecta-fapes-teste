## ID do Cenário
[CT-M014-FO-054]

## Título
Adicionar múltiplos passageiros à mesma comprovação de passagem

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014: `RN05` (Inclusão de múltiplos passageiros em um lote de compra)
- Contrato/API: `M014: AdicionarPassageiroLote`

## Pré-condições
- Dados do `Passageiro 1` preenchidos na seção `3. Informações da Passagem *`.

## Passo a Passo
1. Clicar no botão `+ Adicionar passageiro`.
2. Observar a criação da nova estrutura `Passageiro 2`.
3. Preencher os dados do novo passageiro e clicar no botão ciano `Enviar passageiros`.

## Dados de Entrada
- Passageiro 2 Nome: `Maria Oliveira` | Valor: `R$ 1.250,00` | Localizador: `DEF456` | Data Emissão: `10/05/2026`

## Resultado Esperado
- Uma nova sub-seção `Passageiro 2` é adicionada ao formulário.
- O sistema permite salvar múltiplos passageiros associados à mesma transação de débito.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
