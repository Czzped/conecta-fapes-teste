## ID do Cenário
[CT-M014-FO-113]

## Título
Realizar o ato de trocar uma Nota Fiscal através da ação "Trocar nota fiscal" no card do documento

## Requisito/História Relacionada
- Requisito/Issue: #2943 / #2853 (Funcionalidade de substituição direta de DocumentoFiscal no card)
- Regra Canônica: M014: `RN05` / `RI-NFE01` (Substituição de Nota Fiscal informando o identificador do documento)
- Contrato/API: `POST /api/prestacao-de-contas/projeto/{projectId}/justificativa-nf/{justificativaId}/documento-fiscal/substituir`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas de débito em estado `Em Rascunho`.
- Pelo menos uma Nota Fiscal (ex: NF-e A - *Fast Shop S.A.*) já anexada e visível em seu respetivo card na Seção `2. Adicionar Descrição e Anexar Nota Fiscal *`.
- Arquivo de uma nova Nota Fiscal distinta (ex: NF-e B - XML ou PDF) disponível no ambiente local.

## Passo a Passo
1. Acessar a tela de comprovação de débito em `/coordenador/prestacao-financeira/detalhes/:paymentId`.
2. Na Seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, localizar o card da Nota Fiscal que se deseja substituir (NF-e A).
3. Clicar na opção/ícone `Trocar nota fiscal` localizado no card do documento.
4. Observar a expansão do componente de upload (*"Selecione o arquivo ou arraste e solte aqui (PDF ou XML)"*).
5. Selecionar ou arrastar o novo arquivo de Nota Fiscal (NF-e B) para a área de upload.
6. Aguardar o processamento e a leitura automatizada dos metadados da NF-e B na seção *"Verificar informações da Nota Fiscal"*.
7. Clicar no botão `Enviar Nota Fiscal`.
8. Inspecionar o envio da requisição ao servidor e o feedback exibido em tela.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Card acionado: NF-e A (`Fast Shop S.A.`, Chave: `35240953...39104406`)
- Ação: Clicar em `Trocar nota fiscal` no card da NF-e A
- Novo arquivo: `43240843708379014585550010000249881100249881-procNFe.pdf` (NF-e B)

## Resultado Esperado
- Ao clicar em `Trocar nota fiscal`, o componente de upload é expandido corretamente para receber o novo documento.
- O sistema realiza a leitura automatizada e atualiza a seção *"Verificar informações da Nota Fiscal"* com os dados da nova NF-e B.
- Ao clicar em `Enviar Nota Fiscal`, a requisição de substituição é disparada informando o identificador do documento (`documentoFiscalId`), evitando erros de ambiguidade (HTTP 422).
- O card é atualizado exibindo as informações da nova NF-e B (Emitente, Chave e Valor).
- É exibido o toast de confirmação: *"Nota fiscal trocada com sucesso"*.
- Ao recarregar a página (`F5`), a troca permanece persistida no servidor.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
