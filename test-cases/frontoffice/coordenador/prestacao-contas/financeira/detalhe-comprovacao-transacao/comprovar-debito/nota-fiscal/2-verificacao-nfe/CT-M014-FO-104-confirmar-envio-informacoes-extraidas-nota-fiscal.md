## ID do Cenário
[CT-M014-FO-104]

## Título
Confirmar e enviar as informações extraídas da Nota Fiscal com sucesso

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Nota Fiscal)
- Regra Canônica: M014: `RN05` / `RI-NFE02` (Validação, confirmação e consolidação dos dados extraídos do DocumentoFiscal)
- Contrato/API: `M014: ValidarDadosNotaFiscal`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Arquivo de Nota Fiscal (XML ou PDF) anexado com sucesso na etapa `2. Adicionar Descrição e Anexar Nota Fiscal *`.
- Seção `Verificar Informações da Nota Fiscal` expandida contendo os dados extraídos (Chave de Acesso, Data de Emissão, Emitente, Impostos e Tabela de Itens).

## Passo a Passo
1. Acessar a tela de comprovação de débito onde a Nota Fiscal foi anexada.
2. Inspecionar e conferir as informações extraídas na seção `Verificar Informações da Nota Fiscal`.
3. Clicar no botão `Confirmar` (ou `Enviar Nota Fiscal`) na seção de verificação da Nota Fiscal.
4. Aguardar o processamento da confirmação dos dados pelo sistema.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Chave de Acesso: `32240743708379014585550010000249881100249880`
- Dados extraídos verificados: Data de Emissão, Identificador/UF do Emitente, Impostos (ICMS, PIS, IPI, ISS) e Itens da Nota Fiscal
- Ação: Clicar no botão `Confirmar` / `Enviar Nota Fiscal`

## Resultado Esperado
- O sistema processa e salva a validação das informações extraídas da Nota Fiscal.
- Os dados extraídos são consolidados no rascunho da comprovação de débito.
- Exibe notificação/feedback de sucesso informando a confirmação das informações da Nota Fiscal.
- A etapa subsequente `3. Associar Compra *` é liberada/habilitada para preenchimento.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
