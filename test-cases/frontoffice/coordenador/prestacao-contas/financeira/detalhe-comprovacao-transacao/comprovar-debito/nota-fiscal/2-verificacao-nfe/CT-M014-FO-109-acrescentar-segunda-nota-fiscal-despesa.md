## ID do Cenário
[CT-M014-FO-109]

## Título
Acrescentar uma segunda Nota Fiscal a uma mesma prestação de contas com sucesso

## Requisito/História Relacionada
- Requisito/Issue: #2943 / EP-11 (Múltiplas Notas Fiscais por Despesa)
- Regra Canônica: M014: `RN05` / `RI-NFE01` (Suporte a múltiplos DocumentoFiscal por JustificativaDespesa)
- Contrato/API: `M014: AdicionarDocumentoFiscal`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas de débito em estado `Em Rascunho`.
- Primeira Nota Fiscal (NF-e 1) já anexada e com informações confirmadas.
- Segundo arquivo de Nota Fiscal (NF-e 2) com chave de acesso diferente disponível no ambiente local.

## Passo a Passo
1. Acessar a tela de comprovação de débito contendo a NF-e 1 anexada.
2. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, clicar no botão `Acrescentar nota fiscal`.
3. Confirmar a mensagem de aviso orientativo na modal.
4. Anexar o segundo arquivo de Nota Fiscal (NF-e 2).
5. Aguardar a extração dos dados da NF-e 2 e clicar no botão `Confirmar` / `Enviar Nota Fiscal`.
6. Observar a exibição da lista de notas e o recalculo do valor total da despesa.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- NF-e 1 (Anexada): `32240743708379014585550010000249881100249880-procNFe.pdf` (Valor: R$ 1.500,00)
- NF-e 2 (Nova): `43240843708379014585550010000249881100249881-procNFe.pdf` (Valor: R$ 2.000,00)

## Resultado Esperado
- A tela exibe dois cards expansíveis independentes correspondentes à NF-e 1 e NF-e 2.
- A descrição geral da despesa não é solicitada novamente ao acrescentar a segunda nota.
- O valor total das notas é recalculado para a soma dos valores (R$ 3.500,00).
- Cada card exibe individualmente seu emitente, chave de acesso, valor e o status de comprovante anexado.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
