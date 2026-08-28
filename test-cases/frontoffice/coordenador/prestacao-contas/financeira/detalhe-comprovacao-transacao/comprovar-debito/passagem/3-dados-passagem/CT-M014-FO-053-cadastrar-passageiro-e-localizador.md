## ID do Cenário
[CT-M014-FO-053]

## Título
Cadastrar dados do passageiro, valor, localizador e data de emissão

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014: `RN05` (Detalhamento do passageiro e bilhete)
- Contrato/API: `M014: RegistrarPassageiroBilhete`

## Pré-condições
- Seção `3. Informações da Passagem *` visível na tela.

## Passo a Passo
1. Na sub-seção `Passageiro 1`, preencher o campo `Nome Passageiro*` (placeholder *"Informe o nome do passageiro"*).
2. Preencher o campo `Valor da Passagem*`.
3. Preencher o campo `Localizador*` (placeholder *"Ex: ABC123"*).
4. Preencher o campo `Data de Emissão*` no formato `dd/mm/aaaa`.

## Dados de Entrada
- Nome Passageiro: `João da Silva`
- Valor da Passagem: `R$ 1.250,00`
- Localizador: `ABC123`
- Data de Emissão: `10/05/2026`

## Resultado Esperado
- Todos os campos do passageiro aceitam os dados formatados corretamente.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
