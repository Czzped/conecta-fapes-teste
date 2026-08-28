## ID do Cenário
[CT-M014-FO-067]

## Título
Validar rejeição de localizador de passagem em formato incorreto

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Passagem)
- Regra Canônica: M014: `RN12` (Localizador deve seguir formato alfanumérico padrão de bilhete aéreo)
- Contrato/API: `M014: RegistrarPassageiroBilhete`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Seção `3. Informações da Passagem *` visível.

## Passo a Passo
1. No campo `Localizador*` (placeholder *"Ex: ABC123"*), inserir um valor inválido:
   - Cenário A: caracteres especiais (ex: `A@#!23`)
   - Cenário B: campo com apenas 1 caractere (ex: `A`)
   - Cenário C: campo excessivamente longo (ex: `ABCDEFGHIJKLMNOP123456`)
2. Tentar confirmar clicando em `Enviar passageiros`.

## Dados de Entrada
- Cenário A: Localizador = `A@#!23` (caracteres especiais)
- Cenário B: Localizador = `A` (muito curto)
- Cenário C: Localizador = `ABCDEFGHIJKLMNOP123456` (muito longo)

## Resultado Esperado
- O sistema exibe mensagem de validação: *"Localizador inválido. Informe um código alfanumérico válido."*.
- A confirmação é bloqueada.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [x] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
