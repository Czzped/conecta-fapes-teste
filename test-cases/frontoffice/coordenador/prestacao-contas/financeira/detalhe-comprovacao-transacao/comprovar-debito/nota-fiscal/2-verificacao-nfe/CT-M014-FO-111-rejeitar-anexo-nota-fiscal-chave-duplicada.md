## ID do Cenário
[CT-M014-FO-111]

## Título
Validar rejeição ao tentar anexar Nota Fiscal com chave de acesso duplicada na mesma prestação

## Requisito/História Relacionada
- Requisito/Issue: #2943 / EP-11 (Múltiplas Notas Fiscais por Despesa)
- Regra Canônica: M014: `RN05` / `RI-NFE02` (Unicidade da chave de acesso do DocumentoFiscal na despesa)
- Contrato/API: `M014: AdicionarDocumentoFiscal`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas de débito contendo a Nota Fiscal 1 (Chave de Acesso `32240743708379014585550010000249881100249880`) já anexada e confirmada.

## Passo a Passo
1. Acessar a tela de comprovação de débito contendo a Nota Fiscal 1.
2. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, clicar em `Acrescentar nota fiscal`.
3. Confirmar o aviso orientativo da modal.
4. Anexar um segundo arquivo de Nota Fiscal que possua a mesma Chave de Acesso da Nota Fiscal 1 (`32240743708379014585550010000249881100249880`).
5. Aguardar o processamento da leitura e clicar em `Confirmar` / `Enviar Nota Fiscal`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Chave de Acesso duplicada: `32240743708379014585550010000249881100249880`

## Resultado Esperado
- O sistema recusa o cadastro da nova nota e exibe uma mensagem de erro clara alertando sobre a duplicidade de chave de acesso.
- O card em rascunho da nova nota permanece preenchido com as informações extraídas sem exigir um novo upload do arquivo pelo usuário.
- A prestação não altera o valor total da despesa nem adiciona a nota duplicada à lista oficial.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
