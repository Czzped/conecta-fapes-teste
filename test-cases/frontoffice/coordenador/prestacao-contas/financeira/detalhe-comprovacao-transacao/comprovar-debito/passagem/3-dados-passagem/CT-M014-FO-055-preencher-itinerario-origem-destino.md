## ID do Cenário
[CT-M014-FO-055]

## Título
Preencher itinerário de viagem (origem, destino, datas e horários)

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014: `RN05` (Validação de itinerário de viagem)
- Contrato/API: `M014: RegistrarItinerarioViagem`

## Pré-condições
- Seção `3. Informações da Passagem *` aberta.

## Passo a Passo
1. Preencher `Local de Origem*` (placeholder *"Ex: Vitória/ES"*).
2. Preencher `Data de Saída*` (dd/mm/aaaa) e `Horário de Saída*` (--:--).
3. Preencher `Local de Destino*` (placeholder *"Ex: São Paulo/SP"*).
4. Preencher `Data de Chegada*` (dd/mm/aaaa) e `Horário de Chegada*` (--:--).
5. Clicar no botão ciano `Confirmar edição`.

## Dados de Entrada
- Origem: `Vitória/ES` | Saída: `15/06/2026 - 08:00`
- Destino: `São Paulo/SP` | Chegada: `15/06/2026 - 09:30`

## Resultado Esperado
- Todos os campos do itinerário são preenchidos e validados.
- O clique em `Confirmar edição` salva as informações na seção.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
