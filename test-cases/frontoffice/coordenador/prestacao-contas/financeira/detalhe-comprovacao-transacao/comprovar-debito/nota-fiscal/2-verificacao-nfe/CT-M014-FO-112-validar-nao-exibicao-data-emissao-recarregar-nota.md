## ID do Cenário
[CT-M014-FO-112]

## Título
Validar omissão da data de emissão ao recarregar a página com Nota Fiscal salva (sem fallback indevido)

## Requisito/História Relacionada
- Requisito/Issue: #2943 / Pendência 2 (Não persistência de dataEmissao pelo backend)
- Regra Canônica: M014: `RN05` (Tratamento visual de metadados de leitura do DocumentoFiscal)
- Contrato/API: `M014: ObterDetalhesJustificativaDespesa`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas contendo Nota Fiscal salva e confirmada no servidor.

## Passo a Passo
1. Acessar a tela de comprovação de débito contendo a Nota Fiscal previamente cadastrada.
2. Pressionar a tecla `F5` (ou acionar o recarregamento da página no navegador).
3. Aguardar o carregamento dos dados da prestação.
4. Expandir o card da Nota Fiscal salva.
5. Inspecionar a exibição do campo ou label de `Data de Emissão`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Ação: Recarregar a página (`F5`)

## Resultado Esperado
- A data de emissão **não é exibida** no card da Nota Fiscal recarregada (visto que o backend não persiste o campo).
- O sistema **não exibe** a data atual/hoje como fallback indevido (ex: bug de `dayjs(undefined)`).
- Os demais dados salvos da Nota Fiscal (Emitente, Chave de Acesso, Valor e Comprovante) continuam sendo exibidos corretamente.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
