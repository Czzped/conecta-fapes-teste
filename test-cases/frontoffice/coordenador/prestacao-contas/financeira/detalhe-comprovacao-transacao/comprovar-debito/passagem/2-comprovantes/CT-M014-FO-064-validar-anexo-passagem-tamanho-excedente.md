## ID do Cenário
[CT-M014-FO-064]

## Título
Validar rejeição de comprovante de passagem com tamanho de arquivo excedente

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Passagem)
- Regra Canônica: M014: `RN05` / `RI-PAS02` (Limite máximo de tamanho de arquivo para comprovantes de passagem)
- Contrato/API: `M014: UploadComprovantePagamento` / `M014: UploadComprovanteViagem`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Tipo de documento selecionado como `Passagem`.
- Arquivo PDF com tamanho superior a 10MB disponível.

## Passo a Passo
1. Na seção `2. Anexar Comprovantes da Passagem *`, clicar em `Anexar comprovante de pagamento`.
2. Selecionar e tentar enviar um arquivo PDF com tamanho superior a 10MB (ex: `comprovante_grande.pdf` - 15MB).
3. Aguardar a resposta do sistema.

## Dados de Entrada
- Arquivo: `comprovante_grande.pdf` (Tamanho: `15 MB`)
- Limite permitido: `10 MB`

## Resultado Esperado
- O upload é interrompido antes de completar o envio ao servidor.
- O arquivo não é listado na coluna de comprovantes.
- O sistema exibe mensagem de erro: *"O arquivo excede o tamanho máximo permitido de 10MB."*.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [x] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
