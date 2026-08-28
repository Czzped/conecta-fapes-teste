## ID do Cenário
[CT-M014-FO-066]

## Título
Validar rejeição de valor da passagem igual a zero ou negativo

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Passagem)
- Regra Canônica: M014: `RI1` (Valores monetários devem ser sempre >= 0 e, para justificativas, > 0)
- Contrato/API: `M014: RegistrarPassageiroBilhete`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Seção `3. Informações da Passagem *` visível.
- `Nome Passageiro*` e `Localizador*` preenchidos corretamente.

## Passo a Passo
1. No campo `Valor da Passagem*`, inserir o valor `R$ 0,00`.
2. Clicar no botão `Enviar passageiros` (ou `Confirmar edição`).
3. Repetir o teste inserindo um valor negativo (ex: `-100`).

## Dados de Entrada
- Cenário A: Valor da Passagem = `R$ 0,00`
- Cenário B: Valor da Passagem = `-100`

## Resultado Esperado
- O sistema exibe mensagem de validação no campo: *"O valor da passagem deve ser maior que zero."*.
- A confirmação é bloqueada e nenhum dado é enviado ao servidor.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [x] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
