## ID do Cenário
[CT-M014-FO-110]

## Título
Validar bloqueio de remoção da última Nota Fiscal em uma prestação de contas

## Requisito/História Relacionada
- Requisito/Issue: #2943 / EP-11 (Múltiplas Notas Fiscais por Despesa)
- Regra Canônica: M014: `RN05` / `RI-NFE01` (Obrigatoriedade de ao menos um DocumentoFiscal ativo por prestação do tipo Nota Fiscal)
- Contrato/API: `M014: RemoverDocumentoFiscal`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas de débito em estado `Em Rascunho`.
- Prestação contendo exatamente **uma única Nota Fiscal** anexada e confirmada.

## Passo a Passo
1. Acessar a tela de comprovação de débito contendo 1 Nota Fiscal anexada.
2. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, clicar no botão `Editar`.
3. Localizar o ícone de remoção/exclusão (lixeira) no card da única Nota Fiscal.
4. Passar o ponteiro do mouse (hover) sobre o ícone de lixeira.
5. Tentar clicar no ícone de lixeira.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Quantidade de notas anexadas: 1

## Resultado Esperado
- O ícone de exclusão (lixeira) é apresentado em estado desabilitado (disabled).
- Ao realizar o hover, um tooltip orientativo é exibido com a mensagem orientando a utilizar a ação *"Trocar nota fiscal"*.
- Nenhuma chamada HTTP/API de deleção é disparada ao servidor.
- A única Nota Fiscal é mantida intacta na prestação.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
