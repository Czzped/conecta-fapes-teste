## ID do Cenário
[CT-M014-FO-068]

## Título
Validar rejeição de data de emissão da passagem em formato inválido ou data futura

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Passagem)
- Regra Canônica: M014: `RN12` (Data de emissão do bilhete deve ser anterior ou igual à data atual)
- Contrato/API: `M014: RegistrarPassageiroBilhete`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Seção `3. Informações da Passagem *` visível.

## Passo a Passo
1. No campo `Data de Emissão*` (formato `dd/mm/aaaa`):
   - Cenário A: inserir data em formato inválido (ex: `32/13/2026`).
   - Cenário B: inserir data futura (ex: `31/12/2099`).
2. Tentar confirmar clicando em `Enviar passageiros`.

## Dados de Entrada
- Cenário A: Data de Emissão = `32/13/2026` (data inexistente)
- Cenário B: Data de Emissão = `31/12/2099` (data futura)

## Resultado Esperado
- Cenário A: O sistema exibe *"Data inválida. Informe uma data no formato dd/mm/aaaa."*.
- Cenário B: O sistema exibe *"A data de emissão não pode ser uma data futura."*.
- Em ambos os casos, a confirmação é bloqueada.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
