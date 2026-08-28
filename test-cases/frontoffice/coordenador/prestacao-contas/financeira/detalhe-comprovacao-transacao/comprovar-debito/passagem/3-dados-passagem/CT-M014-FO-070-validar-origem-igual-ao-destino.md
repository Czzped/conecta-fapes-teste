## ID do Cenário
[CT-M014-FO-070]

## Título
Validar rejeição de itinerário com local de origem igual ao local de destino

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Passagem)
- Regra Canônica: M014: `RN12` (Itinerário deve representar deslocamento real — origem ≠ destino)
- Contrato/API: `M014: RegistrarItinerarioViagem`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Seção `3. Informações da Passagem *` visível.

## Passo a Passo
1. Preencher `Local de Origem*`: `Vitória/ES`.
2. Preencher `Local de Destino*`: `Vitória/ES` (idêntico à origem).
3. Preencher as datas e horários válidos.
4. Clicar no botão ciano `Confirmar edição`.

## Dados de Entrada
- Local de Origem: `Vitória/ES`
- Local de Destino: `Vitória/ES` (igual à origem — inválido)
- Data Saída: `15/06/2026 - 08:00`
- Data Chegada: `15/06/2026 - 10:00`

## Resultado Esperado
- O sistema detecta que origem e destino são idênticos.
- É exibida mensagem de erro: *"O local de destino deve ser diferente do local de origem."*.
- A confirmação do itinerário é bloqueada.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
