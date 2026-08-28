## ID do Cenário
[CT-M014-FO-065]

## Título
Validar bloqueio de confirmação ao deixar campos obrigatórios do passageiro em branco

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Passagem)
- Regra Canônica: M014: `RN12` (Nome do passageiro, valor e comprovante são obrigatórios na justificativa de passagem)
- Contrato/API: `M014: RegistrarPassageiroBilhete`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Tipo de documento selecionado como `Passagem`.
- Seção `3. Informações da Passagem *` visível na tela.

## Passo a Passo
1. Deixar os campos `Nome Passageiro*`, `Valor da Passagem*` e `Localizador*` em branco.
2. Clicar no botão ciano `Enviar passageiros` (ou `Confirmar edição`).

## Dados de Entrada
- Nome Passageiro: `(vazio)`
- Valor da Passagem: `(vazio)`
- Localizador: `(vazio)`
- Data de Emissão: `(vazio)`

## Resultado Esperado
- O sistema bloqueia a confirmação.
- Cada campo obrigatório em branco exibe uma mensagem de validação inline: *"Campo obrigatório"*.
- O formulário não avança e os dados não são enviados ao servidor.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
