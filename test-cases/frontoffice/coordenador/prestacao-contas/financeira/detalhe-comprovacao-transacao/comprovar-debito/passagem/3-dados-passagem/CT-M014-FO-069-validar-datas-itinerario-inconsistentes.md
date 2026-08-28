## ID do Cenário
[CT-M014-FO-069]

## Título
Validar rejeição de itinerário com data/horário de chegada anterior à data/horário de saída

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Passagem)
- Regra Canônica: M014: `RN12` (Consistência lógica do itinerário — chegada deve ser posterior à saída)
- Contrato/API: `M014: RegistrarItinerarioViagem`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Dados do passageiro já preenchidos na seção `3. Informações da Passagem *`.

## Passo a Passo
1. Preencher `Local de Origem*`: `Vitória/ES`.
2. Preencher `Data de Saída*`: `15/06/2026` e `Horário de Saída*`: `10:00`.
3. Preencher `Local de Destino*`: `São Paulo/SP`.
4. Preencher `Data de Chegada*`: `14/06/2026` (um dia ANTES da saída) e `Horário de Chegada*`: `09:00`.
5. Clicar no botão ciano `Confirmar edição`.

## Dados de Entrada
- Saída: `15/06/2026 - 10:00`
- Chegada: `14/06/2026 - 09:00` (anterior à saída — inválido)

## Resultado Esperado
- O sistema detecta a inconsistência lógica do itinerário.
- É exibida mensagem de erro: *"A data/horário de chegada deve ser posterior à data/horário de saída."*.
- A confirmação do itinerário é bloqueada.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
