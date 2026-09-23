## ID do Cenário
[CT-M014-FO-125]

## Título
Validar exibição de modal de aviso informando a quantidade de itens que serão descartados ao remover ou trocar uma Nota Fiscal com itens classificados

## Requisito/História Relacionada
- Requisito/Issue: #2943 / Seção D4 (Advertência no descarte de itens de nota removida)
- Regra Canônica: M014: `RN06` (Gerenciamento de efeito colateral na remoção de DocumentoFiscal com itens associados)
- Contrato/API: `M014: RemoverDocumentoFiscal`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas contendo 2 Notas Fiscais (NF-e 1 e NF-e 2).
- Itens da NF-e 1 já devidamente associados a categorias contábeis na etapa `3. Associar Compra *`.

## Passo a Passo
1. Acessar a tela de comprovação de débito.
2. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, clicar em `Editar`.
3. Clicar no ícone de exclusão (lixeira) ou na opção de trocar a NF-e 1 (que possui itens já classificados).
4. Observar a modal de confirmação exibida na tela.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- NF-e 1: Possui 3 itens já associados na Seção 3

## Resultado Esperado
- A modal de confirmação exibe uma advertência destacada informando quantos itens classificados (ex: *"Esta nota possui 3 itens classificados que serão descartados"*).
- Caso o usuário confirme, a nota e seus 3 itens associados são descartados.
- Se a nota removida não possuir nenhum item classificado previamente, a modal exibe apenas a confirmação simples padrão sem o aviso de descarte de itens.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
