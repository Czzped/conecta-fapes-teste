## ID do Cenário
[CT-M014-FO-052]

## Título
Anexar comprovante de realização da viagem (bilhete/cartão de embarque)

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014: `RN05` (Comprovação da efetiva realização da viagem)
- Contrato/API: `M014: AnexarComprovanteViagem`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Arquivo do bilhete aéreo/rodoviário ou cartão de embarque (PDF, até 10MB) disponível.

## Passo a Passo
1. Na coluna `Comprovante de Realização da viagem`, clicar no botão `Anexar comprovante/registro da viagem` ou arrastar o arquivo.
2. Aguardar a conclusão do upload.
3. Clicar no botão ciano `Confirmar edição` da seção.

## Dados de Entrada
- Arquivo: `cartao_embarque_viagem.pdf` (Tamanho: `59 KB`)

## Resultado Esperado
- O arquivo é enviado e listado na coluna de realização da viagem.
- Ao clicar em `Confirmar edição`, as alterações da seção 2 são salvas no rascunho.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
