## ID do Cenário
[CT-M014-FO-040]

## Título
Verificar informações extraídas da Nota Fiscal (Chave de Acesso, Impostos e Emitente)

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014: `RN05` / `RI-NFE02` (Validação de tributos e dados cadastrais da NF-e)
- Contrato/API: `M014: ValidarDadosNotaFiscal`

## Pré-condições
- Nota Fiscal válida anexada com sucesso.
- Seção `Verificar Informações da Nota Fiscal` expandida na tela.

## Passo a Passo
1. Inspecionar os campos extraídos na seção `Verificar Informações da Nota Fiscal`.
2. Conferir os valores de Chave de Acesso, Data de Emissão, Identificador do Emitente e UF do Emitente.
3. Conferir os totais de impostos (`Total ICMS`, `Total PIS`, `Total IPI`, `Total ISS`).

## Dados de Entrada
- Chave de Acesso: `32240743708379014585550010000249881100249880` (44 dígitos)
- Data de Emissão: `28/08/2026`
- Identificador Emitente: `43708379014585` | UF: `ES`
- Impostos: ICMS (`R$ 3.675,32`), PIS (`R$ 356,72`), IPI (`R$ 0,00`), ISS (`R$ 0,00`)

## Resultado Esperado
- Todos os campos são preenchidos automaticamente com os valores correspondentes extraídos da nota.
- Os botões `Confirmar`, `Editar` e `Enviar Nota Fiscal` são disponibilizados.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
