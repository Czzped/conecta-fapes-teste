## ID do Cenário
[CT-M014-FO-080]

## Título
Validar rejeição de data do Invoice em formato inválido ou data futura

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RN05` (Data do Invoice deve ser anterior ou igual à data atual)
- Contrato/API: `M014: RegistrarDadosInvoice`

## Pré-condições
- Seção `3. Informações do Invoice *` visível.
- `Valor Original*`, `Moeda*` e `Taxa de Câmbio*` preenchidos corretamente.

## Passo a Passo
1. No campo `Data do Invoice*` (formato `dd/mm/aaaa`):
   - Cenário A: inserir data inexistente (ex: `30/02/2026`).
   - Cenário B: inserir data futura (ex: `01/01/2099`).
2. Tentar confirmar clicando em `Enviar`.

## Dados de Entrada
- Cenário A: Data do Invoice = `30/02/2026` (data inexistente)
- Cenário B: Data do Invoice = `01/01/2099` (data futura)

## Resultado Esperado
- Cenário A: Mensagem de erro *"Data inválida. Informe uma data no formato dd/mm/aaaa."*.
- Cenário B: Mensagem de erro *"A data do Invoice não pode ser uma data futura."*.
- Em ambos, a confirmação é bloqueada.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
