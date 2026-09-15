## ID do Cenário
[CT-M014-FO-107]

## Título
Validar exclusão do arquivo anexo de Nota Fiscal

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Nota Fiscal)
- Regra Canônica: M014: `RN05` / `RI-NFE01` (Exclusão e gerenciamento do arquivo de DocumentoFiscal vinculado à JustificativaDespesa)
- Contrato/API: `M014: RemoverDocumentoFiscal`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de débito selecionada na prestação de contas.
- Arquivo de Nota Fiscal (XML ou PDF) previamente anexado na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`.

## Passo a Passo
1. Acessar a tela de comprovação de débito com Nota Fiscal anexada.
2. Localizar o componente de upload e o pill contendo a Nota Fiscal anexada na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`.
3. Clicar no ícone de remoção/exclusão (lixeira) presente no pill da Nota Fiscal.
4. Confirmar a exclusão caso seja exibida modal ou confirmação em tela.
5. Verificar a atualização do componente de upload e da seção `Verificar Informações da Nota Fiscal`.
6. Recarregar a página (`F5`) para validar a persistência da exclusão.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Arquivo anexo: `32240743708379014585550010000249881100249880-procNFe.pdf`
- Ação: Clicar no ícone de lixeira do anexo de Nota Fiscal

## Resultado Esperado
- O arquivo de Nota Fiscal é removido do pill de upload da seção.
- O sistema executa a exclusão do `DocumentoFiscal` no servidor.
- A seção `Verificar Informações da Nota Fiscal` é recolhida e limpa de todos os dados extraídos previamente.
- O componente de upload retorna ao seu estado inicial pendente (*"Selecione o arquivo ou arraste e solte aqui"*).
- Ao recarregar a página (`F5`), a remoção do anexo permanece de forma persistente.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
