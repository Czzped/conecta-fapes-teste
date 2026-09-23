## ID do Cenário
[CT-M014-FO-113]

## Título
Trocar uma nota fiscal específica em uma prestação de contas contendo múltiplas notas fiscais

## Requisito/História Relacionada
- Requisito/Issue: #2943 / #2853 (Substituição de DocumentoFiscal com identificação explícita)
- Regra Canônica: M014: `RN05` / `RI-NFE01` (Substituição direcionada por documentoFiscalId)
- Contrato/API: `M014: AtualizarDocumentoFiscal`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas de débito em estado `Em Rascunho`.
- Prestação contendo exatamente **duas Notas Fiscais** (NF-e A e NF-e B) cadastradas.

## Passo a Passo
1. Acessar a tela de comprovação de débito contendo a NF-e A e NF-e B.
2. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, clicar em `Editar`.
3. No card correspondente à NF-e B, clicar na opção `Trocar nota fiscal`.
4. Anexar o novo arquivo de substituição (NF-e C).
5. Aguardar a extração dos dados e clicar em `Confirmar` / `Enviar Nota Fiscal`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Nota Fiscal mantida: NF-e A
- Nota Fiscal substituída: NF-e B (`documentoFiscalId` da NF-e B)
- Nova Nota Fiscal: NF-e C

## Resultado Esperado
- A requisição enviada ao servidor informa expressamente o `documentoFiscalId` da NF-e B que está sendo substituída.
- Apenas a NF-e B é substituída pela NF-e C.
- A NF-e A permanece inalterada e intacta na prestação de contas.
- O valor total das notas é atualizado para a soma de NF-e A + NF-e C.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
